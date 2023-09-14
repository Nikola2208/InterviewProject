from database import database
from sqlalchemy import Column, Integer, String, ForeignKey
import sqlalchemy.orm as orm


class StackModel(database.Model):
    __tablename__ = "stacks"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    items_per_stack = Column(Integer, unique=False, nullable=False)
    group_id = Column(Integer, ForeignKey("groups.id"), unique=False, nullable=False)
    group = orm.relationship("GroupModel", back_populates="stacks")
    order_id = Column(Integer, ForeignKey("orders.id"), unique=False, nullable=False)
    order = orm.relationship("OrderModel", back_populates="stacks")
