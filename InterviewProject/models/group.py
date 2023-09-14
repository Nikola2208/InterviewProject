from database import database
from sqlalchemy import Column, Integer, String, ForeignKey
import sqlalchemy.orm as orm


class GroupModel(database.Model):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True)
    total_amount = Column(Integer, unique=False, nullable=False)
    item_id = Column(Integer, ForeignKey("items.id"), unique=False, nullable=False)
    item = orm.relationship("ItemModel", back_populates="groups")
    order_id = Column(Integer, ForeignKey("orders.id"), unique=False, nullable=True)
    order = orm.relationship("OrderModel", back_populates="groups")
    invoice_id = Column(Integer, ForeignKey("invoices.id"), unique=False, nullable=True)
    invoice = orm.relationship("InvoiceModel", back_populates="invoice_groups")
    stacks = orm.relationship("StackModel", back_populates="group", lazy="dynamic")
