from database import database
from sqlalchemy import Column, Integer, String, ForeignKey
import sqlalchemy.orm as orm


class InvoiceModel(database.Model):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), unique=False, nullable=False)
    user = orm.relationship("UserModel", back_populates="invoices")
    order_id = Column(Integer, ForeignKey("orders.id"), unique=False, nullable=False)
    order = orm.relationship("OrderModel", back_populates="invoice")
    invoice_groups = orm.relationship("GroupModel", back_populates="invoice", lazy="dynamic")
