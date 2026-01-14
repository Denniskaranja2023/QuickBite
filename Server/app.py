from flask import Flask, request, session, make_response
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from dotenv import load_dotenv
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime
import pytz
import os
from extensions import db, bcrypt

#loads the variables from the .env file
load_dotenv()
#creates a Flask APP Instance
app= Flask(__name__)
#Enables communication with the frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
#For the creation of databases
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = os.getenv('SECRET_KEY')
# db is already initialized with metadata in extensions.py
db.init_app(app)
#For restful Apis
api = Api(app)
#Enables migrations
migrate = Migrate(app,db)
#Initialize bcrypt with app
bcrypt.init_app(app)

# Import models after db and bcrypt are initialized to avoid circular import
from models import Restaurant, DeliveryAgent, Customer, MenuItem, Order, Payment, RestaurantReview, DeliveryReview, Admin

#1. Authentication Routes
class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        user_type = data.get('user_type')
        
        if not email or not password or not user_type:
            return make_response({'error': 'Email, password, and user_type are required'}, 400)
        
        user = None
        if user_type == 'restaurant':
            user = Restaurant.query.filter_by(email=email).first()
        elif user_type == 'customer':
            user = Customer.query.filter_by(email=email).first()
        elif user_type == 'agent':
            user = DeliveryAgent.query.filter_by(email=email).first()
        elif user_type == 'admin':
            user = Admin.query.filter_by(email=email).first()
        else:
            return make_response({'error': 'Invalid user_type'}, 400)
        
        if user and user.authenticate(password):
            session.clear()
            session['user_id'] = user.id
            session['user_type'] = user_type
            return make_response({'message': 'Login successful', 'user_type': user_type, 'user_id': user.id}, 200)
        
        return make_response({'error': 'Invalid credentials'}, 401)

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        user_type = session.get('user_type')
        
        if not user_id or not user_type:
            return make_response({'error': 'Not logged in'}, 401)
        
        user = None
        if user_type == 'restaurant':
            user = Restaurant.query.get(user_id)
        elif user_type == 'customer':
            user = Customer.query.get(user_id)
        elif user_type == 'agent':
            user = DeliveryAgent.query.get(user_id)
        elif user_type == 'admin':
            user = Admin.query.get(user_id)
        
        if user:
            return make_response({'user_id': user.id, 'user_type': user_type, 'name': user.name, 'email': user.email}, 200)
        
        return make_response({'error': 'User not found'}, 404)

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)
        session.pop('user_type', None)
        return make_response({'message': 'Logout successful'}, 200)

api.add_resource(Login, '/api/login')
api.add_resource(CheckSession, '/api/check_session')
api.add_resource(Logout, '/api/logout')

#2. Admin routes
class AdminRestaurants(Resource):
    def get(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurants = Restaurant.query.all()
        return make_response([{
            'id': r.id,
            'name': r.name,
            'email': r.email,
            'address': r.address,
            'contact': r.contact,
            'rating': r.rating,
            'logo': r.logo,
            'paybill_number': r.paybill_number,
            'bio': r.bio
        } for r in restaurants], 200)
    
    def post(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        data = request.get_json()
        admin_id = session.get('user_id')
        
        restaurant = Restaurant(
            name=data.get('name'),
            email=data.get('email'),
            address=data.get('address'),
            contact=data.get('contact'),
            logo=data.get('logo'),
            paybill_number=data.get('paybill_number'),
            bio=data.get('bio'),
            admin_id=admin_id
        )
        restaurant.password_hash = data.get('password', 'restaurant')
        
        db.session.add(restaurant)
        db.session.commit()
        
        return make_response({'message': 'Restaurant created', 'id': restaurant.id}, 201)

class AdminRestaurantById(Resource):
    def get(self, id):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant = Restaurant.query.get(id)
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        return make_response({
            'id': restaurant.id,
            'name': restaurant.name,
            'email': restaurant.email,
            'address': restaurant.address,
            'contact': restaurant.contact,
            'rating': restaurant.rating,
            'logo': restaurant.logo,
            'paybill_number': restaurant.paybill_number,
            'bio': restaurant.bio
        }, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant = Restaurant.query.get(id)
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        db.session.delete(restaurant)
        db.session.commit()
        
        return make_response({'message': 'Restaurant deleted'}, 200)

class AdminPayments(Resource):
    def get(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        payments = Payment.query.all()
        return make_response([{
            'id': p.id,
            'amount': p.amount,
            'method': p.method,
            'created_at': p.created_at.isoformat(),
            'order_id': p.order_id,
            'customer_id': p.customer_id,
            'restaurant_id': p.restaurant_id
        } for p in payments], 200)

class AdminPaymentById(Resource):
    def delete(self, id):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        payment = Payment.query.get(id)
        if not payment:
            return make_response({'error': 'Payment not found'}, 404)
        
        db.session.delete(payment)
        db.session.commit()
        
        return make_response({'message': 'Payment deleted'}, 200)

class AdminCustomers(Resource):
    def get(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customers = Customer.query.all()
        return make_response([{
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'contact': c.contact,
            'image': c.image
        } for c in customers], 200)

class AdminCustomerById(Resource):
    def delete(self, id):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer = Customer.query.get(id)
        if not customer:
            return make_response({'error': 'Customer not found'}, 404)
        
        db.session.delete(customer)
        db.session.commit()
        
        return make_response({'message': 'Customer deleted'}, 200)

api.add_resource(AdminRestaurants, '/api/admin/restaurants')
api.add_resource(AdminRestaurantById, '/api/admin/restaurants/<int:id>')
api.add_resource(AdminPayments, '/api/admin/payments')
api.add_resource(AdminPaymentById, '/api/admin/payments/<int:id>')
api.add_resource(AdminCustomers, '/api/admin/customers')
api.add_resource(AdminCustomerById, '/api/admin/customers/<int:id>')

#3. Restaurant routes
class RestaurantAccount(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        restaurant = Restaurant.query.get(restaurant_id)
        
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        return make_response({
            'id': restaurant.id,
            'name': restaurant.name,
            'email': restaurant.email,
            'address': restaurant.address,
            'contact': restaurant.contact,
            'logo': restaurant.logo,
            'paybill_number': restaurant.paybill_number,
            'bio': restaurant.bio,
            'rating': restaurant.rating
        }, 200)
    
    def patch(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        restaurant = Restaurant.query.get(restaurant_id)
        
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        data = request.get_json()
        if 'name' in data:
            restaurant.name = data['name']
        if 'address' in data:
            restaurant.address = data['address']
        if 'contact' in data:
            restaurant.contact = data['contact']
        if 'logo' in data:
            restaurant.logo = data['logo']
        if 'paybill_number' in data:
            restaurant.paybill_number = data['paybill_number']
        if 'email' in data:
            restaurant.email = data['email']
        if 'bio' in data:
            restaurant.bio = data['bio']
        if 'password' in data:
            restaurant.password_hash = data['password']
        
        db.session.commit()
        
        return make_response({
            'message': 'Restaurant updated',
            'id': restaurant.id,
            'name': restaurant.name,
            'email': restaurant.email,
            'address': restaurant.address,
            'contact': restaurant.contact,
            'logo': restaurant.logo,
            'paybill_number': restaurant.paybill_number,
            'bio': restaurant.bio
        }, 200)
    
    def delete(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        restaurant = Restaurant.query.get(restaurant_id)
        
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        db.session.delete(restaurant)
        db.session.commit()
        
        session.clear()
        return make_response({'message': 'Restaurant account deleted'}, 200)


class RestaurantMenuItems(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        menu_items = MenuItem.query.filter_by(restaurant_id=restaurant_id).all()
        
        return make_response([{
            'id': m.id,
            'name': m.name,
            'unit_price': m.unit_price,
            'image': m.image,
            'availability': m.availability,
            'restaurant_id': m.restaurant_id
        } for m in menu_items], 200)
    
    def post(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        data = request.get_json()
        
        menu_item = MenuItem(
            name=data.get('name'),
            unit_price=data.get('unit_price'),
            image=data.get('image'),
            availability=data.get('availability', True),
            restaurant_id=restaurant_id
        )
        
        db.session.add(menu_item)
        db.session.commit()
        
        return make_response({'message': 'Menu item created', 'id': menu_item.id}, 201)

class RestaurantMenuItemById(Resource):
    def get(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        menu_item = MenuItem.query.get(id)
        
        if not menu_item:
            return make_response({'error': 'Menu item not found'}, 404)
        
        if menu_item.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        return make_response({
            'id': menu_item.id,
            'name': menu_item.name,
            'unit_price': menu_item.unit_price,
            'image': menu_item.image,
            'availability': menu_item.availability,
            'restaurant_id': menu_item.restaurant_id
        }, 200)
    
    def patch(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        menu_item = MenuItem.query.get(id)
        
        if not menu_item:
            return make_response({'error': 'Menu item not found'}, 404)
        
        if menu_item.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        data = request.get_json()
        if 'name' in data:
            menu_item.name = data['name']
        if 'unit_price' in data:
            menu_item.unit_price = data['unit_price']
        if 'image' in data:
            menu_item.image = data['image']
        if 'availability' in data:
            menu_item.availability = data['availability']
        
        db.session.commit()
        
        return make_response({'message': 'Menu item updated'}, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        menu_item = MenuItem.query.get(id)
        
        if not menu_item:
            return make_response({'error': 'Menu item not found'}, 404)
        
        if menu_item.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        db.session.delete(menu_item)
        db.session.commit()
        
        return make_response({'message': 'Menu item deleted'}, 200)


class RestaurantOrders(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        orders = Order.query.filter_by(restaurant_id=restaurant_id).all()
        
        return make_response([{
            'id': o.id,
            'created_at': o.created_at.isoformat() if o.created_at else None,
            'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
            'delivery_address': o.delivery_address,
            'payment_status': o.payment_status,
            'total_price': o.total_price,
            'restaurant_id': o.restaurant_id,
            'delivery_agent_id': o.delivery_agent_id,
            'customer_id': o.customer_id
        } for o in orders], 200)


class RestaurantOrderById(Resource):
    def get(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        return make_response({
            'id': order.id,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'delivery_time': order.delivery_time.isoformat() if order.delivery_time else None,
            'delivery_address': order.delivery_address,
            'payment_status': order.payment_status,
            'total_price': order.total_price,
            'restaurant_id': order.restaurant_id,
            'delivery_agent_id': order.delivery_agent_id,
            'customer_id': order.customer_id,
        }, 200)
    
    def patch(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        data = request.get_json()
        agent_id = data.get('delivery_agent_id')
        
        if agent_id is None:
            return make_response({'error': 'delivery_agent_id is required'}, 400)
        
        agent = DeliveryAgent.query.get(agent_id)
        if not agent or agent.restaurant_id != restaurant_id:
            return make_response({'error': 'Invalid delivery agent'}, 400)
        
        order.delivery_agent_id = agent_id
        db.session.commit()
        
        return make_response({'message': 'Delivery agent assigned', 'delivery_agent_id': order.delivery_agent_id}, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        db.session.delete(order)
        db.session.commit()
        
        return make_response({'message': 'Order deleted'}, 200)


class RestaurantPayments(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        payments = Payment.query.filter_by(restaurant_id=restaurant_id).all()
        
        return make_response([{
            'id': p.id,
            'amount': p.amount,
            'method': p.method,
            'created_at': p.created_at.isoformat() if p.created_at else None,
            'order_id': p.order_id,
            'customer_id': p.customer_id,
            'restaurant_id': p.restaurant_id
        } for p in payments], 200)


class RestaurantDeliveryAgents(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        agents = DeliveryAgent.query.filter_by(restaurant_id=restaurant_id).all()
        
        return make_response([{
            'id': a.id,
            'name': a.name,
            'contact': a.contact,
            'image': a.image,
            'rating': a.rating,
            'restaurant_id': a.restaurant_id
        } for a in agents], 200)
    
    def post(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        data = request.get_json()
        
        agent = DeliveryAgent(
            name=data.get('name'),
            contact=data.get('contact'),
            image=data.get('image'),
            rating=data.get('rating', 5.0),
            restaurant_id=restaurant_id
        )
        # set default or provided password
        agent.password_hash = data.get('password', 'agent')
        
        db.session.add(agent)
        db.session.commit()
        
        return make_response({'message': 'Delivery agent created', 'id': agent.id}, 201)


class RestaurantDeliveryAgentById(Resource):
    def delete(self, id):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        agent = DeliveryAgent.query.get(id)
        
        if not agent:
            return make_response({'error': 'Delivery agent not found'}, 404)
        
        if agent.restaurant_id != restaurant_id:
            return make_response({'error': 'Unauthorized'}, 403)
        
        db.session.delete(agent)
        db.session.commit()
        
        return make_response({'message': 'Delivery agent deleted'}, 200)

api.add_resource(RestaurantAccount, '/api/restaurant/account')
api.add_resource(RestaurantMenuItems, '/api/restaurant/menuitems')
api.add_resource(RestaurantMenuItemById, '/api/restaurant/menuitems/<int:id>')
api.add_resource(RestaurantOrders, '/api/restaurant/orders')
api.add_resource(RestaurantOrderById, '/api/restaurant/orders/<int:id>')
api.add_resource(RestaurantPayments, '/api/restaurant/payments')
api.add_resource(RestaurantDeliveryAgents, '/api/restaurant/agents')
api.add_resource(RestaurantDeliveryAgentById, '/api/restaurant/agents/<int:id>')

#4. Customer routes
class CustomerAccount(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return make_response({'error': 'Customer not found'}, 404)
        
        return make_response({
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'contact': customer.contact,
            'image': customer.image
        }, 200)
    
    def patch(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return make_response({'error': 'Customer not found'}, 404)
        
        data = request.get_json()
        if 'name' in data:
            customer.name = data['name']
        if 'contact' in data:
            customer.contact = data['contact']
        if 'image' in data:
            customer.image = data['image']
        if 'email' in data:
            customer.email = data['email']
        if 'password' in data:
            customer.password_hash = data['password']
        
        db.session.commit()
        
        return make_response({
            'message': 'Customer updated',
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'contact': customer.contact,
            'image': customer.image
        }, 200)
    
    def delete(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        customer = Customer.query.get(customer_id)
        
        if not customer:
            return make_response({'error': 'Customer not found'}, 404)
        
        db.session.delete(customer)
        db.session.commit()
        
        session.clear()
        return make_response({'message': 'Customer account deleted'}, 200)


class CustomerRestaurants(Resource):
    def get(self):
        restaurants = Restaurant.query.all()
        return make_response([{
            'id': r.id,
            'name': r.name,
            'email': r.email,
            'address': r.address,
            'contact': r.contact,
            'rating': r.rating,
            'logo': r.logo,
            'paybill_number': r.paybill_number,
            'bio': r.bio
        } for r in restaurants], 200)


class CustomerRestaurantById(Resource):
    def get(self, id):
        restaurant = Restaurant.query.get(id)
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        return make_response({
            'id': restaurant.id,
            'name': restaurant.name,
            'email': restaurant.email,
            'address': restaurant.address,
            'contact': restaurant.contact,
            'rating': restaurant.rating,
            'logo': restaurant.logo,
            'paybill_number': restaurant.paybill_number,
            'bio': restaurant.bio
        }, 200)


class CustomerMenuItems(Resource):
    def get(self):
        restaurant_id = request.args.get('restaurant_id')
        if not restaurant_id:
            return make_response({'error': 'restaurant_id query parameter is required'}, 400)
        
        menu_items = MenuItem.query.filter_by(restaurant_id=restaurant_id, availability=True).all()
        
        return make_response([{
            'id': m.id,
            'name': m.name,
            'unit_price': m.unit_price,
            'image': m.image,
            'availability': m.availability,
            'restaurant_id': m.restaurant_id
        } for m in menu_items], 200)


class CustomerOrders(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        orders = Order.query.filter_by(customer_id=customer_id).all()
        
        return make_response([{
            'id': o.id,
            'created_at': o.created_at.isoformat() if o.created_at else None,
            'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
            'delivery_address': o.delivery_address,
            'payment_status': o.payment_status,
            'total_price': o.total_price,
            'restaurant_id': o.restaurant_id,
            'delivery_agent_id': o.delivery_agent_id,
            'customer_id': o.customer_id
        } for o in orders], 200)
    
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        restaurant_id = data.get('restaurant_id')
        delivery_address = data.get('delivery_address')
        menu_item_ids = data.get('menu_item_ids', [])
        total_price = data.get('total_price')
        
        if not restaurant_id or not delivery_address or not menu_item_ids or total_price is None:
            return make_response({'error': 'restaurant_id, delivery_address, menu_item_ids and total_price are required'}, 400)
        
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        order = Order(
            restaurant_id=restaurant_id,
            customer_id=customer_id,
            delivery_address=delivery_address,
            total_price=total_price
        )
        db.session.add(order)
        db.session.flush()
        
        menu_items = MenuItem.query.filter(MenuItem.id.in_(menu_item_ids)).all()
        for m in menu_items:
            order.menu_items.append(m)
        
        db.session.commit()
        
        return make_response({'message': 'Order created', 'id': order.id}, 201)


class CustomerOrderById(Resource):
    def get(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order or order.customer_id != customer_id:
            return make_response({'error': 'Order not found'}, 404)
        
        return make_response({
            'id': order.id,
            'created_at': order.created_at.isoformat() if order.created_at else None,
            'delivery_time': order.delivery_time.isoformat() if order.delivery_time else None,
            'delivery_address': order.delivery_address,
            'payment_status': order.payment_status,
            'total_price': order.total_price,
            'restaurant_id': order.restaurant_id,
            'delivery_agent_id': order.delivery_agent_id,
            'customer_id': order.customer_id
        }, 200)
    
    def patch(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order or order.customer_id != customer_id:
            return make_response({'error': 'Order not found'}, 404)
        
        data = request.get_json()
        if 'delivery_address' in data:
            order.delivery_address = data['delivery_address']
        if 'total_price' in data:
            order.total_price = data['total_price']
        if 'menu_item_ids' in data:
            new_ids = data.get('menu_item_ids') or []
            order.menu_items = MenuItem.query.filter(MenuItem.id.in_(new_ids)).all()
        
        db.session.commit()
        return make_response({'message': 'Order updated'}, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order or order.customer_id != customer_id:
            return make_response({'error': 'Order not found'}, 404)
        
        db.session.delete(order)
        db.session.commit()
        return make_response({'message': 'Order deleted'}, 200)


class CustomerPayments(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        payments = Payment.query.filter_by(customer_id=customer_id).all()
        
        return make_response([{
            'id': p.id,
            'amount': p.amount,
            'method': p.method,
            'created_at': p.created_at.isoformat() if p.created_at else None,
            'order_id': p.order_id,
            'customer_id': p.customer_id,
            'restaurant_id': p.restaurant_id
        } for p in payments], 200)
    
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        order_id = data.get('order_id')
        amount = data.get('amount')
        method = data.get('method')
        
        if not order_id or amount is None or not method:
            return make_response({'error': 'order_id, amount, and method are required'}, 400)
        
        order = Order.query.get(order_id)
        if not order or order.customer_id != customer_id:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.payment_status:
            return make_response({'error': 'Order already paid'}, 400)
        
        payment = Payment(
            order_id=order_id,
            customer_id=customer_id,
            restaurant_id=order.restaurant_id,
            amount=amount,
            method=method
        )
        
        order.payment_status = True
        db.session.add(payment)
        db.session.commit()
        
        return make_response({'message': 'Payment created', 'id': payment.id}, 201)


class CustomerRestaurantReviews(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        reviews = RestaurantReview.query.filter_by(customer_id=customer_id).all()
        
        return make_response([{
            'id': r.id,
            'comment': r.comment,
            'rating': r.rating,
            'created_at': r.created_at.isoformat() if r.created_at else None,
            'restaurant_id': r.restaurant_id,
            'customer_id': r.customer_id
        } for r in reviews], 200)
    
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        restaurant_id = data.get('restaurant_id')
        comment = data.get('comment')
        rating = data.get('rating')
        
        if not restaurant_id or not comment or rating is None:
            return make_response({'error': 'restaurant_id, comment, and rating are required'}, 400)
        
        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            return make_response({'error': 'Restaurant not found'}, 404)
        
        review = RestaurantReview(
            restaurant_id=restaurant_id,
            customer_id=customer_id,
            comment=comment,
            rating=rating
        )
        
        db.session.add(review)
        db.session.commit()
        
        return make_response({'message': 'Review created', 'id': review.id}, 201)


class CustomerDeliveryReviews(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        reviews = DeliveryReview.query.filter_by(customer_id=customer_id).all()
        return make_response([{
            'id': r.id,
            'comment': r.comment,
            'rating': r.rating,
            'created_at': r.created_at.isoformat() if r.created_at else None,
            'delivery_agent_id': r.delivery_agent_id,
            'customer_id': r.customer_id
        } for r in reviews], 200)
    
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        delivery_agent_id = data.get('delivery_agent_id')
        comment = data.get('comment')
        rating = data.get('rating')
        
        if not delivery_agent_id or not comment or rating is None:
            return make_response({'error': 'delivery_agent_id, comment, and rating are required'}, 400)
        
        agent = DeliveryAgent.query.get(delivery_agent_id)
        if not agent:
            return make_response({'error': 'Delivery agent not found'}, 404)
        
        review = DeliveryReview(
            delivery_agent_id=delivery_agent_id,
            customer_id=customer_id,
            comment=comment,
            rating=rating
        )
        
        db.session.add(review)
        db.session.commit()
        
        return make_response({'message': 'Review created', 'id': review.id}, 201)
class CustomerRestaurantReviewById(Resource):
    def delete(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = RestaurantReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        db.session.delete(review)
        db.session.commit()
        return make_response({'message': 'Review deleted'}, 200)
class CustomerDeliveryReviewById(Resource):
    def delete(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = DeliveryReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        db.session.delete(review)
        db.session.commit()
        return make_response({'message': 'Review deleted'}, 200)  
    
    
api.add_resource(CustomerAccount, '/api/customer/account')
api.add_resource(CustomerRestaurants, '/api/customer/restaurants')
api.add_resource(CustomerRestaurantById, '/api/customer/restaurants/<int:id>')
api.add_resource(CustomerMenuItems, '/api/customer/menuitems')
api.add_resource(CustomerOrders, '/api/customer/orders')
api.add_resource(CustomerOrderById, '/api/customer/orders/<int:id>')
api.add_resource(CustomerPayments, '/api/customer/payments')
api.add_resource(CustomerRestaurantReviews, '/api/customer/restaurant-reviews')
api.add_resource(CustomerDeliveryReviews, '/api/customer/delivery-reviews')
api.add_resource(CustomerRestaurantReviewById, '/api/customer/restaurant-reviews/<int:id>') 
api.add_resource(CustomerDeliveryReviewById, '/api/customer/delivery-reviews/<int:id>')

#5. Delivery Agent routes
class DeliveryAgentAccount(Resource):
    def patch(self):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        agent = DeliveryAgent.query.get(agent_id)
        
        if not agent:
            return make_response({'error': 'Delivery agent not found'}, 404)
        
        data = request.get_json()
        if 'name' in data:
            agent.name = data['name']
        if 'contact' in data:
            agent.contact = data['contact']
        if 'image' in data:
            agent.image = data['image']
        if 'rating' in data:
            agent.rating = data['rating']
        if 'email' in data:
            agent.email = data['email']
        if 'password' in data:
            agent.password_hash = data['password']
        
        db.session.commit()
        
        return make_response({
            'message': 'Delivery agent updated',
            'id': agent.id,
            'name': agent.name,
            'email': agent.email,
            'contact': agent.contact,
            'image': agent.image,
            'rating': agent.rating,
            'restaurant_id': agent.restaurant_id
        }, 200)


class DeliveryAgentOrders(Resource):
    def get(self):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        orders = Order.query.filter_by(delivery_agent_id=agent_id).all()
        
        return make_response([{
            'id': o.id,
            'created_at': o.created_at.isoformat() if o.created_at else None,
            'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
            'delivery_address': o.delivery_address,
            'payment_status': o.payment_status,
            'total_price': o.total_price,
            'restaurant_id': o.restaurant_id,
            'delivery_agent_id': o.delivery_agent_id,
            'customer_id': o.customer_id
        } for o in orders], 200)


class DeliveryAgentDeliveredOrders(Resource):
    def get(self):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        # Get orders where delivery_time is not None (delivered orders)
        orders = Order.query.filter(
            Order.delivery_agent_id == agent_id,
            Order.delivery_time.isnot(None)
        ).all()
        
        return make_response([{
            'id': o.id,
            'created_at': o.created_at.isoformat() if o.created_at else None,
            'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
            'delivery_address': o.delivery_address,
            'payment_status': o.payment_status,
            'total_price': o.total_price,
            'restaurant_id': o.restaurant_id,
            'delivery_agent_id': o.delivery_agent_id,
            'customer_id': o.customer_id
        } for o in orders], 200)


class DeliveryAgentReviews(Resource):
    def get(self):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        reviews = DeliveryReview.query.filter_by(delivery_agent_id=agent_id).all()
        
        return make_response([{
            'id': r.id,
            'comment': r.comment,
            'rating': r.rating,
            'created_at': r.created_at.isoformat() if r.created_at else None,
            'delivery_agent_id': r.delivery_agent_id,
            'customer_id': r.customer_id
        } for r in reviews], 200)


class DeliveryAgentOrderById(Resource):
    def patch(self, id):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        order = Order.query.get(id)
        
        if not order:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.delivery_agent_id != agent_id:
            return make_response({'error': 'Unauthorized - Order not assigned to you'}, 403)
        
        data = request.get_json()
        delivery_time_str = data.get('delivery_time')
        
        if delivery_time_str is None:
            return make_response({'error': 'delivery_time is required'}, 400)
        
        try:
            # Parse ISO format datetime string
            delivery_time = datetime.fromisoformat(delivery_time_str.replace('Z', '+00:00'))
            # Convert to timezone-aware datetime if needed
            if delivery_time.tzinfo is None:
                delivery_time = pytz.timezone('Africa/Nairobi').localize(delivery_time)
            order.delivery_time = delivery_time
        except (ValueError, AttributeError) as e:
            return make_response({'error': f'Invalid delivery_time format: {str(e)}'}, 400)
        
        db.session.commit()
        
        return make_response({
            'message': 'Delivery time updated',
            'delivery_time': order.delivery_time.isoformat() if order.delivery_time else None
        }, 200)


api.add_resource(DeliveryAgentAccount, '/api/agent/account')
api.add_resource(DeliveryAgentOrders, '/api/agent/orders')
api.add_resource(DeliveryAgentDeliveredOrders, '/api/agent/delivered-orders')
api.add_resource(DeliveryAgentReviews, '/api/agent/reviews')
api.add_resource(DeliveryAgentOrderById, '/api/agent/orders/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)