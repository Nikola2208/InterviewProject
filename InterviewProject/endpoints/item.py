from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas.schemas import *
from database import database
from models import ItemModel, GroupModel
import sqlalchemy.exc as exc
from access_control.access_control import access_control_admin

blueprint = Blueprint("Items", __name__, description="Item operations")


@blueprint.route("/item")
class ItemCreation(MethodView):
    @blueprint.arguments(schema=ItemCreationSchema)
    @blueprint.response(201, ItemResponseSchema)
    @access_control_admin
    def post(self, item_data):
        item = ItemModel()
        item.name = item_data["name"]
        item.price = item_data["price"]
        item.tax = item_data["tax"]
        item.weight = item_data["weight"]
        item.total_capacity = item_data["total_capacity"]
        try:
            database.session.add(item)
            database.session.commit()
        except exc.IntegrityError:
            abort(400, message="Item with same name already exists.")
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while inserting the item.")
        return item


@blueprint.route("/item/<int:item_id>")
class Item(MethodView):
    @blueprint.response(200, ItemResponseSchema)
    def get(self, item_id):
        item = ItemModel.query.get_or_404(item_id)
        return item

    @blueprint.arguments(schema=ItemCreationSchema)
    @blueprint.response(200, ItemResponseSchema)
    @access_control_admin
    def put(self, item_data, item_id):
        item = ItemModel.query.get_or_404(item_id)
        item.name = item_data["name"]
        item.price = item_data["price"]
        item.tax = item_data["tax"]
        item.weight = item_data["weight"]
        item.total_capacity = item_data["total_capacity"]
        try:
            database.session.add(item)
            database.session.commit()
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while updating the item.")
        return item

    @access_control_admin
    def delete(self, item_id):
        item = ItemModel.query.get(item_id)
        if item is None:
            abort(404, message="Item with chosen id does not exist.")
        database.session.delete(item)
        database.session.commit()
        return {"message": "Item successfully deleted."}


@blueprint.route("/items")
class ItemList(MethodView):
    @blueprint.response(200, ItemResponseSchema(many=True))
    def get(self):
        return ItemModel.query.all()


@blueprint.route("/item/<int:item_id>/group")
class ItemGroup(MethodView):
    @blueprint.arguments(schema=GroupCreationSchema)
    @blueprint.response(201, ItemResponseSchema)
    @access_control_admin
    def post(self, group_data, item_id):
        item = ItemModel.query.get(item_id)
        if item is None:
            abort(404, message="Item with chosen id does not exist.")
        group = GroupModel()
        group.total_amount = group_data["total_amount"]
        group.item = item
        try:
            database.session.add(group)
            database.session.commit()
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while inserting the group.")
        return item
