from app import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone
import pytz
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy

# Association table for many-to-many relationship between orders and menu items
order_menuitem_association = db.Table('order_menuitem_association',
    db.Column('order_id', db.Integer, db.ForeignKey('orders.id'), primary_key=True),
    db.Column('menu_item_id', db.Integer, db.ForeignKey('menu_items.id'), primary_key=True)
)

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, nullable=False)
    email= db.Column(db.String, unique=True, nullable=False)
    _password_hash= db.Column(db.String, nullable=False)
    
    restaurants = db.relationship('Restaurant', back_populates='admin')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    @password_hash.setter
    def password_hash(self, password):
        password_hash= bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash= password_hash.decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<Admin {self.id} {self.name}>'

class Restaurant(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'
    id= db.Column(db.Integer, primary_key=True)
    address= db.Column(db.String, nullable=False)
    contact= db.Column(db.String, nullable=False)
    name= db.Column(db.String, nullable=False)
    logo= db.Column(db.String, nullable=True)
    paybill_number= db.Column(db.Integer, nullable=True)
    email= db.Column(db.String, unique=True)
    bio= db.Column(db.String, nullable=True)
    _password_hash= db.Column(db.String, nullable=False)
    rating= db.Column(db.Float, default=3.0)
    admin_id= db.Column(db.Integer, db.ForeignKey('admins.id'))
    
    admin = db.relationship('Admin', back_populates='restaurants')
    orders = db.relationship('Order', back_populates='restaurant')
    payments = db.relationship('Payment', back_populates='restaurant')
    agents = db.relationship('DeliveryAgent', back_populates='restaurant')
    menu_items = db.relationship('MenuItem', back_populates='restaurant')
    restaurant_reviews = db.relationship('RestaurantReview', back_populates='restaurant')
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    @password_hash.setter
    def password_hash(self, password):
        password_hash= bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash= password_hash.decode('utf-8')
        
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    def __repr__(self):
        return f'<Restaurant {self.id} {self.name}>'  
    
 
class DeliveryAgent(db.Model, SerializerMixin):
    __tablename__ = 'delivery_agents'
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, nullable=False)
    contact= db.Column(db.String, nullable=False)
    image= db.Column(db.String, nullable=True)
    rating= db.Column(db.Float, default=5.0)
    _password_hash= db.Column(db.String, nullable=False)
    restaurant_id= db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    
    restaurant = db.relationship('Restaurant', back_populates='agents')
    delivery_reviews = db.relationship('DeliveryReview', back_populates='delivery_agent')
    orders = db.relationship('Order', back_populates='delivery_agent')
    customers = association_proxy('orders', 'customer')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    @password_hash.setter
    def password_hash(self, password):
        password_hash= bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash= password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<DeliveryAgent {self.id} {self.name}>'   


class DeliveryReview(db.Model, SerializerMixin):
    __tablename__= 'delivery_reviews'
    id= db.Column(db.Integer, primary_key=True)
    comment= db.Column(db.String, nullable=False)
    rating= db.Column(db.Float, nullable=False)
    created_at= db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    delivery_agent_id= db.Column(db.Integer, db.ForeignKey('delivery_agents.id'))
    customer_id= db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    delivery_agent = db.relationship('DeliveryAgent', back_populates='delivery_reviews')
    customer = db.relationship('Customer', back_populates='delivery_reviews')
    
    def __repr__(self):
        return f'<DeliveryReview {self.id} {self.comment}>'


class RestaurantReview(db.Model, SerializerMixin):
    __tablename__= 'restaurant_reviews'
    id= db.Column(db.Integer, primary_key=True)
    comment= db.Column(db.String, nullable=False)
    rating= db.Column(db.Float, nullable=False)
    created_at= db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    restaurant_id= db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    customer_id= db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    restaurant = db.relationship('Restaurant', back_populates='restaurant_reviews')
    customer = db.relationship('Customer', back_populates='restaurant_reviews')
    
    def __repr__(self):
        return f'<RestaurantReview {self.id} {self.comment}>'


class MenuItem(db.Model, SerializerMixin):
    __tablename__= 'menu_items'
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, nullable=False)
    unit_price= db.Column(db.Float, nullable=False)
    image= db.Column(db.String, nullable=True)
    restaurant_id= db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    availability= db.Column(db.Boolean, default=True)
    
    restaurant = db.relationship('Restaurant', back_populates='menu_items')
    orders = db.relationship('Order', secondary=order_menuitem_association, back_populates='menu_items')

    def __repr__(self):
        return f'<MenuItem {self.id} {self.name}>'

class Order(db.Model, SerializerMixin):
    __tablename__="orders"
    id= db.Column(db.Integer, primary_key=True)
    created_at= db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    delivery_time= db.Column(db.DateTime, nullable=True)
    delivery_address= db.Column(db.String, nullable=False)
    payment_status= db.Column(db.Boolean, default=False)
    total_price= db.Column(db.Float, nullable=False)
    restaurant_id= db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    delivery_agent_id= db.Column(db.Integer, db.ForeignKey('delivery_agents.id'))
    customer_id= db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    restaurant = db.relationship('Restaurant', back_populates='orders')
    delivery_agent = db.relationship('DeliveryAgent', back_populates='orders')
    menu_items = db.relationship('MenuItem', secondary=order_menuitem_association, back_populates='orders')
    customer = db.relationship('Customer', back_populates='orders')
    payment = db.relationship('Payment', back_populates='order', uselist=False)
    
    def __repr__(self):
        return f'<Order {self.id} {self.created_at}>'

class Customer(db.Model, SerializerMixin):
    __tablename__= 'customers'
    id= db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, nullable=False)
    contact= db.Column(db.String, nullable=False)
    image= db.Column(db.String, nullable=True)
    _password_hash= db.Column(db.String, nullable=False)
    
    delivery_reviews = db.relationship('DeliveryReview', back_populates='customer')
    restaurant_reviews = db.relationship('RestaurantReview', back_populates='customer')
    orders = db.relationship('Order', back_populates='customer')
    payments = db.relationship('Payment', back_populates='customer')
    delivery_agents = association_proxy('orders', 'delivery_agent')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    @password_hash.setter
    def password_hash(self, password):
        password_hash= bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash= password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<Customer {self.id} {self.name}>'

class Payment(db.Model, SerializerMixin):
    __tablename__= 'payments'
    id= db.Column(db.Integer, primary_key=True)
    amount= db.Column(db.Float, nullable=False)
    created_at= db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone('Africa/Nairobi')))
    method= db.Column(db.String, nullable=False)
    restaurant_id= db.Column(db.Integer, db.ForeignKey('restaurants.id'))
    order_id= db.Column(db.Integer, db.ForeignKey('orders.id'), unique=True)
    customer_id= db.Column(db.Integer, db.ForeignKey('customers.id'))
    
    restaurant = db.relationship('Restaurant', back_populates='payments')
    order = db.relationship('Order', back_populates='payment')
    customer = db.relationship('Customer', back_populates='payments')
  
    def __repr__(self):
        return f'<Payment {self.id} {self.amount}>'

    