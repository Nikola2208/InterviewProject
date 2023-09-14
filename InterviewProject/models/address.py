from database import database
from sqlalchemy import Column, Integer, String
import sqlalchemy.orm as orm


class AddressModel(database.Model):
    __tablename__ = "addresses"
    id = Column(Integer, primary_key=True)
    number = Column(Integer, unique=False, nullable=False)
    street = Column(String(50), unique=False, nullable=False)
    city = Column(String(50), unique=False, nullable=False)
    country = Column(String(50), unique=False, nullable=False)
    user = orm.relationship("UserModel", back_populates="address")
