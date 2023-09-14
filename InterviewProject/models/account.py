from database import database
from sqlalchemy import Column, Integer, String
import sqlalchemy.orm as orm


class AccountModel(database.Model):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(), unique=True, nullable=False)
    user = orm.relationship("UserModel", back_populates="account")
