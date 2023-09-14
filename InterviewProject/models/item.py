from database import database
from sqlalchemy import Column, Integer, Float, String
import sqlalchemy.orm as orm


class ItemModel(database.Model):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    price = Column(Float(precision=2), unique=False, nullable=False)
    tax = Column(Float(precision=1), unique=False, nullable=False)
    weight = Column(Float(precision=2), unique=False, nullable=False)
    total_capacity = Column(Integer, unique=False, nullable=False)
    groups = orm.relationship("GroupModel", back_populates="item", lazy="dynamic")
