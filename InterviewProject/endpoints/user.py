from flask.views import MethodView
from flask_smorest import Blueprint, abort
from schemas.schemas import *
from database import database
from models import UserModel, UserRole, AddressModel, AccountModel
import sqlalchemy.exc as exc
from passlib.hash import pbkdf2_sha256
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from access_control.access_control import access_control_admin


blueprint = Blueprint("users", __name__, description="User operations")


@blueprint.route("/register")
class UserRegistration(MethodView):
    @blueprint.arguments(schema=UserRegistrationSchema)
    @blueprint.response(201, UserResponseSchema)
    def post(self, user_data):
        user = UserModel()
        user.name = user_data["name"]
        user.surname = user_data["surname"]
        user.role = user_data["role"]
        address = AddressModel()
        address.city = user_data["city"]
        address.number = user_data["number"]
        address.country = user_data["country"]
        address.street = user_data["street"]
        user.address = address
        account = AccountModel()
        account.email = user_data["email"]
        account.username = user_data["username"]
        account.password = pbkdf2_sha256.hash(user_data["password"])
        user.account = account
        roles = []
        for role in UserRole:
            roles.append(role.value)
        if user.role.lower() in roles:
            user.role = user.role.lower()
        else:
            abort(400, message="Role does not exist.")
        try:
            database.session.add(user)
            database.session.commit()
        except exc.IntegrityError:
            abort(400, message="User with same credentials already exists.")
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while inserting the user.")
        return user


@blueprint.route("/login")
class UserLogin(MethodView):
    @blueprint.arguments(schema=UserLoginSchema)
    def post(self, user_data):
        users = UserModel.query.all()
        user = None
        for u in users:
            if u.account.username == user_data["username"]:
                user = u
        if user is None:
            abort(401, message="Invalid credentials.")
        if user and pbkdf2_sha256.verify(user_data["password"], user.account.password):
            token = create_access_token(identity=user.id, additional_claims={'role': user.role, 'user_id': user.id})
            return {"token": token}
        abort(401, message="Invalid credentials.")


@blueprint.route("/user/<int:user_id>")
class User(MethodView):
    @jwt_required()
    @blueprint.response(200, UserResponseSchema)
    def get(self, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        user = UserModel.query.get_or_404(user_id)
        return user

    @jwt_required()
    def delete(self, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        user = UserModel.query.get(user_id)
        if user is None:
            abort(404, message="User with chosen id does not exist.")
        database.session.delete(user)
        database.session.commit()
        return {"message": "User successfully deleted."}


@blueprint.route("/users")
class UserList(MethodView):
    @blueprint.response(200, UserResponseSchema(many=True))
    @access_control_admin
    def get(self):
        return UserModel.query.all()


@blueprint.route("/user/<int:user_id>/account")
class AccountUpdate(MethodView):
    @jwt_required()
    @blueprint.arguments(schema=AccountUpdateSchema)
    @blueprint.response(200, UserResponseSchema)
    def put(self, account_data, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        user = UserModel.query.get_or_404(user_id)
        user.account.email = account_data["email"]
        try:
            database.session.add(user)
            database.session.commit()
        except exc.IntegrityError:
            abort(400, message="User with same email already exists.")
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while updating the user's account.")
        return user


@blueprint.route("/user/<int:user_id>/address")
class AddressUpdate(MethodView):
    @jwt_required()
    @blueprint.arguments(schema=AddressUpdateSchema)
    @blueprint.response(200, UserResponseSchema)
    def put(self, address_data, user_id):
        if user_id != get_jwt_identity():
            abort(400, message="Identifiers do not match.")
        user = UserModel.query.get_or_404(user_id)
        user.address.number = address_data["number"]
        user.address.street = address_data["street"]
        user.address.city = address_data["city"]
        user.address.country = address_data["country"]
        try:
            database.session.add(user)
            database.session.commit()
        except exc.SQLAlchemyError:
            abort(500, message="An error occurred while updating the user's address.")
        return user
