from flask_jwt_extended import jwt_required, get_jwt
from flask_smorest import abort


def access_control_admin(func):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_role = get_jwt().get("role")
        if current_user_role == 'admin':
            return func(*args, **kwargs)
        else:
            abort(401, message="Admin role required.")
    return wrapper


def access_control_admin_or_staff(func):
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_role = get_jwt().get("role")
        if current_user_role == 'admin' or current_user_role == 'staff':
            return func(*args, **kwargs)
        else:
            abort(401, message="Admin or staff role required.")
    return wrapper
