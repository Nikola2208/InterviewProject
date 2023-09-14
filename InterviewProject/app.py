import os

from flask_cors import CORS
from flask import Flask, jsonify
from flask_smorest import Api
from database import database
import models
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
from endpoints.user import blueprint as UserBlueprint
from endpoints.item import blueprint as ItemBlueprint
from endpoints.order import blueprint as OrderBlueprint
from endpoints.invoice import blueprint as InvoiceBlueprint
from endpoints.stack import blueprint as StackBlueprint


def create_app(db_url=None):
    app = Flask(__name__)
    cors = CORS(app)
    load_dotenv()

    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Interview Project Flask REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url or os.getenv("DATABASE_URL", "sqlite:///data.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    database.init_app(app)

    migrate = Migrate(app, database)

    api = Api(app)

    app.config["JWT_SECRET_KEY"] = "holja"
    jwt = JWTManager(app)

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has been revoked.", "error": "token_revoked"}),
            401,
        )

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has expired.", "error": "token_expired"}),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Signature verification failed.", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required",
                }
            ),
            401,
        )

    api.register_blueprint(UserBlueprint)
    api.register_blueprint(ItemBlueprint)
    api.register_blueprint(OrderBlueprint)
    api.register_blueprint(InvoiceBlueprint)
    api.register_blueprint(StackBlueprint)

    return app
