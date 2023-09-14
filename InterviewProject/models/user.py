from database import database
from sqlalchemy import Column, Integer, String, ForeignKey
from enum import Enum
import sqlalchemy.orm as orm


class UserRole(Enum):
    ADMIN = "admin"
    CUSTOMER = "customer"
    STAFF = "staff"


class UserModel(database.Model):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=False, nullable=False)
    surname = Column(String(50), unique=False, nullable=False)
    role = Column(String(), unique=False, nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), unique=True, nullable=False)
    account = orm.relationship("AccountModel", back_populates="user", cascade="delete, all")
    address_id = Column(Integer, ForeignKey("addresses.id"), unique=False, nullable=False)
    address = orm.relationship("AddressModel", back_populates="user", cascade="delete, all")
    orders = orm.relationship("OrderModel", back_populates="user", lazy="dynamic")
    invoices = orm.relationship("InvoiceModel", back_populates="user", lazy="dynamic")
