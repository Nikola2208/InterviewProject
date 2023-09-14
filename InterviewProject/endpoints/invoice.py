import sqlalchemy.exc as exc
from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import Blueprint, abort
from access_control.access_control import access_control_admin
from database import database
from models import OrderModel, InvoiceModel, UserModel, OrderStatus
from schemas.schemas import *

blueprint = Blueprint("invoices", __name__, description="Invoice operations")


@blueprint.route("/order/<int:order_id>/invoice")
class InvoiceCreation(MethodView):
    @blueprint.arguments(schema=InvoiceCreationSchema)
    @blueprint.response(201, InvoiceResponseSchema)
    @access_control_admin
    def post(self, invoice_data, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.status != OrderStatus.APPROVED.value:
            abort(400, message="Order has not yet been approved.")
        invoice = InvoiceModel()
        invoice.name = invoice_data["name"]
        invoice.order = order
        invoice.user = UserModel.query.get_or_404(invoice.order.user.id)
        for g in invoice.order.groups:
            if g.item.name in invoice_data["item_names"] and not g.invoice_id:
                invoice.invoice_groups.add(g)
            elif g.item.name in invoice_data["item_names"] and g.invoice_id:
                abort(400, message="Order line is already recorded in the invoice.")
        if invoice.invoice_groups[0] is None:
            abort(400, message="Chosen order lines do not exist within the selected order.")
        try:
            database.session.add(invoice)
            database.session.commit()
        except exc.IntegrityError:
            abort(400, message="Invoice with same name already exists.")
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while creating the invoice.")
        return invoice


@blueprint.route("/invoice/<int:invoice_id>")
class Invoice(MethodView):
    @blueprint.response(200, InvoiceResponseSchema)
    @access_control_admin
    def get(self, invoice_id):
        invoice = InvoiceModel.query.get_or_404(invoice_id)
        return invoice

    @access_control_admin
    def delete(self, invoice_id):
        invoice = InvoiceModel.query.get_or_404(invoice_id)
        database.session.delete(invoice)
        database.session.commit()
        return {"message": "Invoice successfully deleted."}


@blueprint.route("/invoices")
class InvoiceList(MethodView):
    @blueprint.response(200, InvoiceResponseSchema(many=True))
    @access_control_admin
    def get(self):
        return InvoiceModel.query.all()


@blueprint.route("/user/<int:user_id>/invoices")
class InvoiceListByUser(MethodView):
    @jwt_required()
    @blueprint.response(200, InvoiceResponseSchema(many=True))
    def get(self, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        invoices = InvoiceModel.query.all()
        user_invoices = []
        for invoice in invoices:
            if invoice.user_id == get_jwt_identity():
                user_invoices.append(invoice)
        return user_invoices
