from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas.schemas import *
from database import database
from models import OrderModel, OrderStatus, StackModel
import sqlalchemy.exc as exc
from access_control.access_control import access_control_admin, access_control_admin_or_staff


blueprint = Blueprint("stacks", __name__, description="Stack operations")


@blueprint.route("/order/<int:order_id>/stack")
class StackCreation(MethodView):
    @blueprint.response(201, StackResponseSchema(many=True))
    @access_control_admin
    def get(self, order_id):
        order = OrderModel.query.get_or_404(order_id)
        if order.status != OrderStatus.APPROVED.value:
            abort(400, message="Order has not yet been approved.")
        stacks = []
        for group in order.groups:
            if group.total_amount // (group.item.total_capacity // group.item.weight) == group.total_amount / (group.item.total_capacity // group.item.weight):
                number_of_stacks = int(group.total_amount // (group.item.total_capacity // group.item.weight))
            else:
                number_of_stacks = int(group.total_amount // (group.item.total_capacity // group.item.weight) + 1)
            equal_number_of_items_per_stack = group.total_amount // number_of_stacks
            rest_of_items = group.total_amount % number_of_stacks
            for i in range(number_of_stacks):
                stack = StackModel()
                stack.name = 'Stack_' + str(i+1) + '_order_id_' + str(order.id) + '_group_id_' + str(group.id)
                stack.group = group
                stack.order = order
                stack.items_per_stack = equal_number_of_items_per_stack
                if rest_of_items > 0:
                    stack.items_per_stack += 1
                    rest_of_items -= 1
                stacks.append(stack)
        for stack in stacks:
            try:
                database.session.add(stack)
                database.session.commit()
            except exc.IntegrityError:
                abort(400, message="Stack with same name already exists.")
            except exc.SQLAlchemyError:
                abort(500, message="An error occurred while inserting the stack.")
        return stacks


@blueprint.route("/stacks")
class StackList(MethodView):
    @blueprint.response(200, StackResponseSchema(many=True))
    @access_control_admin_or_staff
    def get(self):
        return StackModel.query.all()


@blueprint.route("/order/<int:order_id>/stacks")
class StacksPerOrder(MethodView):
    @blueprint.response(200, StackResponseSchema(many=True))
    @access_control_admin_or_staff
    def get(self, order_id):
        stacks = StackModel.query.filter(StackModel.order_id == order_id)
        return stacks

    @access_control_admin
    def delete(self, order_id):
        stacks = StackModel.query.filter(StackModel.order_id == order_id)
        for stack in stacks:
            database.session.delete(stack)
            database.session.commit()
        return {"message": "Stacks successfully deleted."}
