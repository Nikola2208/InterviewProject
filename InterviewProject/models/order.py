from enum import Enum
from database import database
from sqlalchemy import Column, Integer, Float, String, ForeignKey
import sqlalchemy.orm as orm


class OrderStatus(Enum):
    WAITING = "waiting"
    APPROVED = "approved"
    DENIED = "denied"


class OrderModel(database.Model):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    total_price = Column(Float(precision=2), unique=False, nullable=False)
    status = Column(String(), unique=False, nullable=False)
    groups = orm.relationship("GroupModel", back_populates="order", lazy="dynamic", cascade="delete, all")
    user_id = Column(Integer, ForeignKey("users.id"), unique=False, nullable=False)
    user = orm.relationship("UserModel", back_populates="orders")
    invoice = orm.relationship("InvoiceModel", back_populates="order")
    stacks = orm.relationship("StackModel", back_populates="order", lazy="dynamic")
