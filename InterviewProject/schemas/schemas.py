from marshmallow import Schema, fields


class AccountResponseSchema(Schema):
    username = fields.String(required=True)
    email = fields.String(required=True)


class AccountUpdateSchema(Schema):
    email = fields.String(required=True)


class AddressResponseSchema(Schema):
    number = fields.Integer(required=True)
    street = fields.String(required=True)
    city = fields.String(required=True)
    country = fields.String(required=True)


class AddressUpdateSchema(Schema):
    number = fields.Integer(required=True)
    street = fields.String(required=True)
    city = fields.String(required=True)
    country = fields.String(required=True)


class UserRequestSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)


class UserLoginSchema(UserRequestSchema):
    pass


class UserRegistrationSchema(UserRequestSchema):
    name = fields.String(required=True)
    surname = fields.String(required=True)
    email = fields.String(required=True)
    role = fields.String(required=True)
    number = fields.Integer(required=True)
    street = fields.String(required=True)
    city = fields.String(required=True)
    country = fields.String(required=True)


class UserResponseSchema(Schema):
    id = fields.Int(required=True)
    name = fields.String(required=True)
    surname = fields.String(required=True)
    role = fields.String(required=True)
    account = fields.Nested(AccountResponseSchema())
    address = fields.Nested(AddressResponseSchema())


class UserInOrderSchema(Schema):
    id = fields.Int(required=True)
    name = fields.String(required=True)
    surname = fields.String(required=True)


class GroupResponseSchema(Schema):
    total_amount = fields.Integer(required=True)


class ItemCreationSchema(Schema):
    name = fields.String(required=True)
    price = fields.Float(required=True)
    tax = fields.Float(required=True)
    weight = fields.Float(required=True)
    total_capacity = fields.Float(required=True)


class ItemResponseSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    price = fields.Float(required=True)
    tax = fields.Float(required=True)
    weight = fields.Float(required=True)
    total_capacity = fields.Float(required=True)


class ItemInOrderSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    price = fields.Float(required=True)
    tax = fields.Float(required=True)


class GroupCreationSchema(Schema):
    total_amount = fields.Integer(required=True)


class GroupInOrderSchema(Schema):
    total_amount = fields.Integer(required=True)
    item_name = fields.String(required=True)


class GroupInOrderResponseSchema(Schema):
    total_amount = fields.Integer(required=True)
    item = fields.Nested(ItemInOrderSchema())


class OrderCreationSchema(Schema):
    name = fields.String(required=True)
    groups = fields.List(fields.Nested(GroupInOrderSchema()))


class OrderInInvoiceSchema(Schema):
    name = fields.String(required=True)
    total_price = fields.Float(required=True)


class OrderResponseSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    total_price = fields.Float(required=True)
    status = fields.String(required=True)
    user = fields.Nested(UserInOrderSchema())
    groups = fields.List(fields.Nested(GroupInOrderResponseSchema()))


class InvoiceCreationSchema(Schema):
    name = fields.String(required=True)
    item_names = fields.List(fields.String(required=True))


class InvoiceResponseSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    order = fields.Nested(OrderInInvoiceSchema())
    user = fields.Nested(UserInOrderSchema())
    invoice_groups = fields.List(fields.Nested(GroupInOrderResponseSchema()))


class StackResponseSchema(Schema):
    id = fields.Integer(required=True)
    name = fields.String(required=True)
    items_per_stack = fields.Integer(required=True)
    order = fields.Nested(OrderInInvoiceSchema())
    group = fields.Nested(GroupInOrderResponseSchema())

