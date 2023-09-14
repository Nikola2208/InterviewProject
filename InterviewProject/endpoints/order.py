from datetime import datetime
from io import BytesIO

import sqlalchemy.exc as exc
from flask import render_template, make_response
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import Blueprint, abort

from access_control.access_control import access_control_admin
from database import database
from models import OrderModel, OrderStatus, UserModel, GroupModel, ItemModel
from schemas.schemas import *
from xhtml2pdf import pisa

blueprint = Blueprint("orders", __name__, description="Order operations")


@blueprint.route("/order")
class OrderCreation(MethodView):
    @jwt_required()
    @blueprint.arguments(schema=OrderCreationSchema)
    @blueprint.response(201, OrderResponseSchema)
    def post(self, order_data):
        order = OrderModel()
        order.user = UserModel.query.get_or_404(get_jwt_identity())
        order.status = OrderStatus.WAITING.value
        order.name = order_data["name"]
        total_price = 0
        for g in order_data["groups"]:
            group = GroupModel()
            group.total_amount = g["total_amount"]
            group.item = ItemModel.query.filter(ItemModel.name == g["item_name"]).first()
            total_price += group.item.price * group.total_amount * (1 + group.item.tax/100)
            order.groups.add(group)
        order.total_price = total_price
        try:
            database.session.add(order)
            database.session.commit()
        except exc.IntegrityError:
            abort(400, message="Order with same name already exists.")
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while creating the order.")
        return order


@blueprint.route("/orders")
class OrderList(MethodView):
    @blueprint.response(200, OrderResponseSchema(many=True))
    @access_control_admin
    def get(self):
        return OrderModel.query.all()


@blueprint.route("/approved-orders")
class ApprovedOrderList(MethodView):
    @blueprint.response(200, OrderResponseSchema(many=True))
    @access_control_admin
    def get(self):
        return OrderModel.query.filter(OrderModel.status == OrderStatus.APPROVED.value)


@blueprint.route("/order/<int:order_id>")
class Order(MethodView):
    @blueprint.response(200, OrderResponseSchema)
    @access_control_admin
    def get(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        return order

    @jwt_required()
    def delete(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        if order.status != OrderStatus.WAITING.value:
            abort(400, message="Unable to cancel this order.")
        database.session.delete(order)
        database.session.commit()
        return {"message": "Order successfully canceled."}


@blueprint.route("/user/<int:user_id>/orders")
class OrderListByUser(MethodView):
    @jwt_required()
    @blueprint.response(200, OrderResponseSchema(many=True))
    def get(self, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        orders = OrderModel.query.all()
        user_orders = []
        for order in orders:
            if order.user_id == get_jwt_identity():
                user_orders.append(order)
        return user_orders


@blueprint.route("/order/<int:order_id>/reject")
class OrderRejection(MethodView):
    @access_control_admin
    def get(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.status != OrderStatus.WAITING.value:
            abort(400, message="Order has already been reviewed.")
        order.status = OrderStatus.DENIED.value
        try:
            database.session.add(order)
            database.session.commit()
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while updating the order.")
        return {"message": "Order successfully rejected."}


@blueprint.route("/order/<int:order_id>/accept")
class OrderAcceptance(MethodView):
    @access_control_admin
    def get(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.status != OrderStatus.WAITING.value:
            abort(400, message="Order has already been reviewed.")
        order.status = OrderStatus.APPROVED.value
        try:
            database.session.add(order)
            database.session.commit()
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while updating the order.")
        return {"message": "Order successfully accepted."}


@blueprint.route("/order/<int:order_id>/pdf")
class OrderPDF(MethodView):
    @access_control_admin
    def post(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.status != OrderStatus.APPROVED.value:
            abort(400, message="Order is not approved.")
        user = order.user
        headings = ("Name", "Price per unit", "Tax", "Total amount")
        data = []
        for group in order.groups:
            element = (group.item.name, str(group.item.price) + ' RSD', str(group.item.tax) + ' %', 'x' + str(group.total_amount))
            data.append(element)
        template = render_template("order_pdf.html", name=user.name, surname=user.surname,
                                   total_price=order.total_price, headings=headings, data=data, date=str(datetime.now().strftime("%d/%m/%Y")))
        headers = {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'filename=order.pdf'
        }
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(template.encode("ISO-8859-1")), result)
        response = make_response(result.getvalue(), 200, headers)
        return response

