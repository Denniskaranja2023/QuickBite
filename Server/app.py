from flask import Flask, request, session, make_response, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from dotenv import load_dotenv
from datetime import datetime
import pytz
import os
import requests
from extensions import db, bcrypt

# Create uploads folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#loads the variables from the .env file
load_dotenv()
#creates a Flask APP Instance
app= Flask(__name__)
#Enables communication with the frontend
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'https://quick-bite-theta-sable.vercel.app', 'https://quick-bite-theta-sable.vercel.app/'])
#For the creation of databases
# Use DATABASE_URL if set, otherwise use local SQLite for development
database_url = os.getenv("DATABASE_URL")
if database_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback to local SQLite for development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = os.getenv('SECRET_KEY', 'dev-secret-key')

# Session cookie configuration for cross-origin requests (production)
# Only enable Secure and SameSite when in production (HTTPS)
if os.getenv('FLASK_ENV') == 'production':
    app.config['SESSION_COOKIE_SECURE'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
else:
    app.config['SESSION_COOKIE_SECURE'] = False
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
# db is already initialized with metadata in extensions.py
db.init_app(app)
#For restful Apis
api = Api(app)
#Enables migrations
migrate = Migrate(app,db)
#Initialize bcrypt with app
bcrypt.init_app(app)

# Import models after db and bcrypt are initialized to avoid circular import
from models import Restaurant, DeliveryAgent, Customer, MenuItem, Order, Payment, RestaurantReview, DeliveryReview, Admin, OrderMenuItem

# Helper function to update average rating for a restaurant
def update_restaurant_rating(restaurant_id):
    """Calculate and update the average rating for a restaurant based on all its reviews"""
    if not restaurant_id:
        return
    reviews = RestaurantReview.query.filter_by(restaurant_id=restaurant_id).all()
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        restaurant = Restaurant.query.get(restaurant_id)
        if restaurant:
            restaurant.rating = round(avg_rating, 1)
            db.session.commit()

# Helper function to update average rating for a delivery agent
def update_delivery_agent_rating(agent_id):
    """Calculate and update the average rating for a delivery agent based on all their reviews"""
    if not agent_id:
        return
    reviews = DeliveryReview.query.filter_by(delivery_agent_id=agent_id).all()
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        agent = DeliveryAgent.query.get(agent_id)
        if agent:
            agent.rating = round(avg_rating, 1)
            db.session.commit()

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

class Signup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        contact = data.get('contact')
        address = data.get('address')
        user_type = data.get('user_type')
        
        if not name or not email or not password or not contact or not user_type:
            return make_response({'error': 'All fields are required'}, 400)
        
        # Check if user already exists
        existing_user = None
        if user_type == 'restaurant':
            existing_user = Restaurant.query.filter_by(email=email).first()
        elif user_type == 'customer':
            existing_user = Customer.query.filter_by(email=email).first()
        
        if existing_user:
            return make_response({'error': 'User with this email already exists'}, 400)
        
        user = None
        if user_type == 'customer':
            user = Customer(
                name=name,
                email=email,
                contact=contact
            )
            user.password_hash = password
            db.session.add(user)
        elif user_type == 'restaurant':
            user = Restaurant(
                name=name,
                email=email,
                contact=contact,
                address=address or '',
                logo=data.get('logo'),
                bio=data.get('bio'),
                paybill_number=data.get('paybill_number')
            )
            user.password_hash = password
            db.session.add(user)
        else:
            return make_response({'error': 'Invalid user_type. Only customer and restaurant signup are supported.'}, 400)
        
        db.session.commit()
        
        # Log the user in
        session.clear()
        session['user_id'] = user.id
        session['user_type'] = user_type
        
        return make_response({
            'message': 'Signup successful',
            'user_type': user_type,
            'user_id': user.id,
            'name': user.name,
            'email': user.email
        }, 201)

api.add_resource(Login, '/api/login')
api.add_resource(Signup, '/api/signup')
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
        result = []
        for p in payments:
            customer = Customer.query.get(p.customer_id)
            restaurant = Restaurant.query.get(p.restaurant_id)
            result.append({
                'id': p.id,
                'amount': p.amount,
                'method': p.method,
                'created_at': p.created_at.isoformat(),
                'order_id': p.order_id,
                'customer_id': p.customer_id,
                'customer_name': customer.name if customer else 'Unknown Customer',
                'restaurant_id': p.restaurant_id,
                'restaurant_name': restaurant.name if restaurant else 'Unknown Restaurant'
            })
        return make_response(result, 200)

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

class AdminTopRestaurants(Resource):
    def get(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        # Get top 5 restaurants by order count
        top_restaurants = db.session.query(
            Restaurant,
            db.func.count(Order.id).label('order_count')
        ).outerjoin(Order).group_by(
            Restaurant.id
        ).order_by(
            db.func.count(Order.id).desc()
        ).limit(5).all()
        
        result = []
        for restaurant, order_count in top_restaurants:
            # Calculate total revenue for this restaurant
            total_revenue = db.session.query(
                db.func.sum(Payment.amount)
            ).filter_by(restaurant_id=restaurant.id).scalar() or 0
            
            result.append({
                'id': restaurant.id,
                'name': restaurant.name,
                'email': restaurant.email,
                'address': restaurant.address,
                'contact': restaurant.contact,
                'rating': restaurant.rating,
                'logo': restaurant.logo,
                'order_count': order_count,
                'total_revenue': total_revenue
            })
        
        return make_response(result, 200)

class AdminTopCustomers(Resource):
    def get(self):
        if session.get('user_type') != 'admin':
            return make_response({'error': 'Unauthorized'}, 403)
        
        # Get top 5 customers by order count
        top_customers = db.session.query(
            Customer,
            db.func.count(Order.id).label('order_count')
        ).outerjoin(Order).group_by(
            Customer.id
        ).order_by(
            db.func.count(Order.id).desc()
        ).limit(5).all()
        
        result = []
        for customer, order_count in top_customers:
            # Calculate total spent by this customer
            total_spent = db.session.query(
                db.func.sum(Payment.amount)
            ).filter_by(customer_id=customer.id).scalar() or 0
            
            result.append({
                'id': customer.id,
                'name': customer.name,
                'email': customer.email,
                'contact': customer.contact,
                'image': customer.image,
                'order_count': order_count,
                'total_spent': total_spent
            })
        
        return make_response(result, 200)

api.add_resource(AdminRestaurants, '/api/admin/restaurants')
api.add_resource(AdminRestaurantById, '/api/admin/restaurants/<int:id>')
api.add_resource(AdminPayments, '/api/admin/payments')
api.add_resource(AdminPaymentById, '/api/admin/payments/<int:id>')
api.add_resource(AdminCustomers, '/api/admin/customers')
api.add_resource(AdminCustomerById, '/api/admin/customers/<int:id>')
api.add_resource(AdminTopRestaurants, '/api/admin/top-restaurants')
api.add_resource(AdminTopCustomers, '/api/admin/top-customers')

# Platform-wide stats endpoint (public)
class PlatformStats(Resource):
    def get(self):
        """Get platform-wide statistics for the homepage"""
        total_restaurants = Restaurant.query.count()
        total_customers = Customer.query.count()
        total_agents = DeliveryAgent.query.count()
        
        return make_response({
            'restaurants': total_restaurants,
            'customers': total_customers,
            'agents': total_agents
        }, 200)

api.add_resource(PlatformStats, '/api/stats')

# Homepage public endpoints
class HomepageTopRestaurants(Resource):
    def get(self):
        """Get top 5 restaurants by order count for homepage (public endpoint)"""
        # Get top 5 restaurants by order count
        top_restaurants = db.session.query(
            Restaurant,
            db.func.count(Order.id).label('order_count')
        ).outerjoin(Order).group_by(
            Restaurant.id
        ).order_by(
            db.func.count(Order.id).desc()
        ).limit(5).all()
        
        result = []
        for restaurant, order_count in top_restaurants:
            result.append({
                'id': restaurant.id,
                'name': restaurant.name,
                'rating': restaurant.rating,
                'logo': restaurant.logo,
                'address': restaurant.address,
                'bio': restaurant.bio,
                'order_count': order_count
            })
        
        return make_response(result, 200)

class HomepageTopMenuItems(Resource):
    def get(self):
        """Get top 5 menu items by order count for homepage (public endpoint)"""
        # Get menu items with their order counts
        # First, get all menu items with their order counts
        menu_items_query = db.session.query(
            MenuItem
        ).all()
        
        # Calculate order count for each menu item
        result = []
        for menu_item in menu_items_query:
            order_count = len(menu_item.order_menu_items)
            restaurant = menu_item.restaurant
            result.append({
                'id': menu_item.id,
                'name': menu_item.name,
                'unit_price': menu_item.unit_price,
                'image': menu_item.image,
                'description': menu_item.description,
                'restaurant_id': menu_item.restaurant_id,
                'restaurant_name': restaurant.name if restaurant else 'Unknown Restaurant',
                'restaurant_logo': restaurant.logo if restaurant else None,
                'order_count': order_count
            })
        
        # Sort by order count descending and take top 5
        result.sort(key=lambda x: x['order_count'], reverse=True)
        result = result[:5]
        
        return make_response(result, 200)

api.add_resource(HomepageTopRestaurants, '/api/homepage/top-restaurants')
api.add_resource(HomepageTopMenuItems, '/api/homepage/top-menu-items')

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
            'description': m.description,
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
            description=data.get('description'),
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
            'description': menu_item.description,
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
        if 'description' in data:
            menu_item.description = data['description']
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
        
        result = []
        for o in orders:
            # Build menu items list with quantities from OrderMenuItem
            menu_items = []
            for order_item in o.order_menu_items:
                menu_item = order_item.menu_item
                menu_items.append({
                    'id': menu_item.id,
                    'name': menu_item.name,
                    'unit_price': menu_item.unit_price,
                    'image': menu_item.image,
                    'quantity': order_item.quantity
                })
            
            # Get customer details
            customer = o.customer
            customer_data = None
            if customer:
                customer_data = {
                    'id': customer.id,
                    'name': customer.name,
                    'image': customer.image,
                    'contact': customer.contact
                }
            
            # Get delivery agent details
            agent = o.delivery_agent
            agent_data = None
            if agent:
                agent_data = {
                    'id': agent.id,
                    'name': agent.name,
                    'image': agent.image,
                    'contact': agent.contact
                }
            
            result.append({
                'id': o.id,
                'created_at': o.created_at.isoformat() if o.created_at else None,
                'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
                'delivery_address': o.delivery_address,
                'payment_status': o.payment_status,
                'total_price': o.total_price,
                'restaurant_id': o.restaurant_id,
                'delivery_agent_id': o.delivery_agent_id,
                'customer_id': o.customer_id,
                'customer': customer_data,
                'delivery_agent': agent_data,
                'menu_items': menu_items
            })
        
        return make_response(result, 200)


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
        
        result = []
        for p in payments:
            customer= Customer.query.filter_by(id=p.customer_id).first()
            result.append({
                'id': p.id,
                'amount': p.amount,
                'method': p.method,
                'created_at': p.created_at.isoformat() if p.created_at else None,
                'order_id': p.order_id,
                'customer_id': p.customer_id,
                'restaurant_id': p.restaurant_id,
                'customer_name': customer.name if customer else 'Unknown',
                'customer_image': customer.image if customer else None
            })
        
        return make_response(result, 200)


class RestaurantDeliveryAgents(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        agents = DeliveryAgent.query.filter_by(restaurant_id=restaurant_id).all()
        
        return make_response([{
            'id': a.id,
            'name': a.name,
            'email': a.email,
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
            email=data.get('email'),
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


class RestaurantTopCustomers(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        
        # Get top 5 customers by order count for this restaurant
        top_customers = db.session.query(
            Customer,
            db.func.count(Order.id).label('order_count')
        ).join(Order).filter(
            Order.restaurant_id == restaurant_id
        ).group_by(
            Customer.id
        ).order_by(
            db.func.count(Order.id).desc()
        ).limit(5).all()
        
        return make_response([{
            'id': customer.id,
            'name': customer.name,
            'email': customer.email,
            'contact': customer.contact,
            'image': customer.image,
            'order_count': order_count
        } for customer, order_count in top_customers], 200)


class RestaurantReviews(Resource):
    def get(self):
        if session.get('user_type') != 'restaurant':
            return make_response({'error': 'Unauthorized'}, 403)
        
        restaurant_id = session.get('user_id')
        reviews = RestaurantReview.query.filter_by(restaurant_id=restaurant_id).all()
        
        result = []
        for r in reviews:
            customer = r.customer
            result.append({
                'id': r.id,
                'comment': r.comment,
                'rating': r.rating,
                'created_at': r.created_at.isoformat() if r.created_at else None,
                'restaurant_id': r.restaurant_id,
                'customer_id': r.customer_id,
                'customer_name': customer.name if customer else 'Anonymous',
                'customer_image': customer.image if customer else None
            })
        
        return make_response(result, 200)


api.add_resource(RestaurantAccount, '/api/restaurant/account')
api.add_resource(RestaurantMenuItems, '/api/restaurant/menuitems')
api.add_resource(RestaurantMenuItemById, '/api/restaurant/menuitems/<int:id>')
api.add_resource(RestaurantOrders, '/api/restaurant/orders')
api.add_resource(RestaurantOrderById, '/api/restaurant/orders/<int:id>')
api.add_resource(RestaurantPayments, '/api/restaurant/payments')
api.add_resource(RestaurantDeliveryAgents, '/api/restaurant/agents')
api.add_resource(RestaurantDeliveryAgentById, '/api/restaurant/agents/<int:id>')
api.add_resource(RestaurantTopCustomers, '/api/restaurant/top-customers')
api.add_resource(RestaurantReviews, '/api/restaurant/reviews')

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
            'description': m.description,
            'availability': m.availability,
            'restaurant_id': m.restaurant_id
        } for m in menu_items], 200)


class CustomerOrders(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        orders = Order.query.filter_by(customer_id=customer_id).all()
        
        result = []
        for o in orders:
            # Get restaurant details
            restaurant = o.restaurant
            restaurant_data = None
            if restaurant:
                restaurant_data = {
                    'id': restaurant.id,
                    'name': restaurant.name,
                    'logo': restaurant.logo
                }
            
            # Build menu items list with quantities from OrderMenuItem
            menu_items = []
            for order_item in o.order_menu_items:
                menu_item = order_item.menu_item
                menu_items.append({
                    'id': menu_item.id,
                    'name': menu_item.name,
                    'unit_price': menu_item.unit_price,
                    'image': menu_item.image,
                    'quantity': order_item.quantity
                })
            
            result.append({
                'id': o.id,
                'created_at': o.created_at.isoformat() if o.created_at else None,
                'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
                'delivery_address': o.delivery_address,
                'payment_status': o.payment_status,
                'total_price': o.total_price,
                'restaurant_id': o.restaurant_id,
                'delivery_agent_id': o.delivery_agent_id,
                'customer_id': o.customer_id,
                'restaurant': restaurant_data,
                'menu_items': menu_items
            })
        
        return make_response(result, 200)
    
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        restaurant_id = data.get('restaurant_id')
        delivery_address = data.get('delivery_address')
        menu_items_data = data.get('menu_items', [])  # Changed from menu_item_ids to menu_items with quantities
        total_price = data.get('total_price')
        
        if not restaurant_id or not delivery_address or not menu_items_data or total_price is None:
            return make_response({'error': 'restaurant_id, delivery_address, menu_items and total_price are required'}, 400)
        
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
        
        # Add menu items with quantities
        for item_data in menu_items_data:
            menu_item_id = item_data.get('id')
            quantity = item_data.get('quantity', 1)
            
            menu_item = MenuItem.query.get(menu_item_id)
            if menu_item:
                order_menu_item = OrderMenuItem(
                    order_id=order.id,
                    menu_item_id=menu_item_id,
                    quantity=quantity
                )
                db.session.add(order_menu_item)
        
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
        
        # Get restaurant details
        restaurant = order.restaurant
        restaurant_data = None
        if restaurant:
            restaurant_data = {
                'id': restaurant.id,
                'name': restaurant.name,
                'logo': restaurant.logo,
                'contact': restaurant.contact,
                'address': restaurant.address
            }
        
        # Build menu items list with quantities from OrderMenuItem
        menu_items = []
        for order_item in order.order_menu_items:
            menu_item = order_item.menu_item
            menu_items.append({
                'id': menu_item.id,
                'name': menu_item.name,
                'unit_price': menu_item.unit_price,
                'image': menu_item.image,
                'quantity': order_item.quantity
            })
        
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
            'restaurant': restaurant_data,
            'menu_items': menu_items
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
        if 'menu_items' in data:
            # Clear existing menu items
            OrderMenuItem.query.filter_by(order_id=order.id).delete()
            
            # Add new menu items with quantities
            menu_items_data = data.get('menu_items', [])
            for item_data in menu_items_data:
                menu_item_id = item_data.get('id')
                quantity = item_data.get('quantity', 1)
                
                menu_item = MenuItem.query.get(menu_item_id)
                if menu_item:
                    order_menu_item = OrderMenuItem(
                        order_id=order.id,
                        menu_item_id=menu_item_id,
                        quantity=quantity
                    )
                    db.session.add(order_menu_item)
        
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
        
        result = []
        for p in payments:
            restaurant = Restaurant.query.get(p.restaurant_id)
            result.append({
                'id': p.id,
                'amount': p.amount,
                'method': p.method,
                'created_at': p.created_at.isoformat() if p.created_at else None,
                'order_id': p.order_id,
                'customer_id': p.customer_id,
                'restaurant_id': p.restaurant_id,
                'restaurant_name': restaurant.name if restaurant else 'Unknown Restaurant',
                'restaurant_logo': restaurant.logo if restaurant else None
            })
        
        return make_response(result, 200)
    
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
        
        # Update restaurant average rating
        update_restaurant_rating(restaurant_id)
        
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
        
        # Update delivery agent average rating
        update_delivery_agent_rating(delivery_agent_id)
        
        return make_response({'message': 'Review created', 'id': review.id}, 201)
class CustomerRestaurantReviewById(Resource):
    def get(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = RestaurantReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)
        
        restaurant = Restaurant.query.get(review.restaurant_id)
        return make_response({
            'id': review.id,
            'comment': review.comment,
            'rating': review.rating,
            'created_at': review.created_at.isoformat() if review.created_at else None,
            'restaurant_id': review.restaurant_id,
            'restaurant_name': restaurant.name if restaurant else 'Unknown Restaurant',
            'customer_id': review.customer_id
        }, 200)
    
    def patch(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = RestaurantReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        data = request.get_json()
        old_restaurant_id = review.restaurant_id
        if 'rating' in data:
            review.rating = data['rating']
        if 'comment' in data:
            review.comment = data['comment']
        
        db.session.commit()
        
        # Update restaurant average rating (handle case where restaurant_id might have changed)
        update_restaurant_rating(old_restaurant_id)
        
        return make_response({'message': 'Review updated', 'review': {
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment
        }}, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = RestaurantReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        # Store restaurant_id before deletion
        restaurant_id = review.restaurant_id
        
        db.session.delete(review)
        db.session.commit()
        
        # Update restaurant average rating
        update_restaurant_rating(restaurant_id)
        
        return make_response({'message': 'Review deleted'}, 200)

class CustomerDeliveryReviewById(Resource):
    def get(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = DeliveryReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)
        
        agent = DeliveryAgent.query.get(review.delivery_agent_id)
        return make_response({
            'id': review.id,
            'comment': review.comment,
            'rating': review.rating,
            'created_at': review.created_at.isoformat() if review.created_at else None,
            'delivery_agent_id': review.delivery_agent_id,
            'agent_name': agent.name if agent else 'Unknown Agent',
            'customer_id': review.customer_id
        }, 200)
    
    def patch(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = DeliveryReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        data = request.get_json()
        old_agent_id = review.delivery_agent_id
        if 'rating' in data:
            review.rating = data['rating']
        if 'comment' in data:
            review.comment = data['comment']
        
        db.session.commit()
        
        # Update delivery agent average rating
        update_delivery_agent_rating(old_agent_id)
        
        return make_response({'message': 'Review updated', 'review': {
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment
        }}, 200)
    
    def delete(self, id):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)

        customer_id = session.get('user_id')
        review = DeliveryReview.query.get(id)

        if not review or review.customer_id != customer_id:
            return make_response({'error': 'Review not found'}, 404)

        # Store agent_id before deletion
        agent_id = review.delivery_agent_id
        
        db.session.delete(review)
        db.session.commit()
        
        # Update delivery agent average rating
        update_delivery_agent_rating(agent_id)
        
        return make_response({'message': 'Review deleted'}, 200)
    
    
class CustomerAllReviews(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        reviews = []
        
        # Get restaurant reviews
        restaurant_reviews = RestaurantReview.query.filter_by(customer_id=customer_id).all()
        for r in restaurant_reviews:
            restaurant = Restaurant.query.get(r.restaurant_id)
            reviews.append({
                'id': r.id,
                'type': 'restaurant',
                'comment': r.comment,
                'rating': r.rating,
                'created_at': r.created_at.isoformat() if r.created_at else None,
                'target_id': r.restaurant_id,
                'target_name': restaurant.name if restaurant else 'Unknown Restaurant'
            })
        
        # Get delivery agent reviews
        delivery_reviews = DeliveryReview.query.filter_by(customer_id=customer_id).all()
        for r in delivery_reviews:
            agent = DeliveryAgent.query.get(r.delivery_agent_id)
            reviews.append({
                'id': r.id,
                'type': 'agent',
                'comment': r.comment,
                'rating': r.rating,
                'created_at': r.created_at.isoformat() if r.created_at else None,
                'target_id': r.delivery_agent_id,
                'target_name': agent.name if agent else 'Unknown Agent'
            })
        
        # Sort by date, newest first
        reviews.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        return make_response(reviews, 200)

class CustomerStats(Resource):
    def get(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        
        # Get total restaurants count
        total_restaurants = Restaurant.query.count()
        
        # Get all orders for the customer
        orders = Order.query.filter_by(customer_id=customer_id).all()
        
        # Count delivered orders (those with delivery_time set)
        delivered_orders = sum(1 for o in orders if o.delivery_time is not None)
        
        # Count pending orders (those with null delivery_time)
        pending_orders = sum(1 for o in orders if o.delivery_time is None)
        
        return make_response({
            'total_restaurants': total_restaurants,
            'delivered_orders': delivered_orders,
            'pending_orders': pending_orders
        }, 200)

api.add_resource(CustomerAccount, '/api/customer/account')
api.add_resource(CustomerStats, '/api/customer/stats')
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
api.add_resource(CustomerAllReviews, '/api/customer/reviews')

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


class DeliveryAgentPendingOrders(Resource):
    def get(self):
        if session.get('user_type') != 'agent':
            return make_response({'error': 'Unauthorized'}, 403)
        
        agent_id = session.get('user_id')
        # Get orders where delivery_time is None (pending deliveries)
        orders = Order.query.filter(
            Order.delivery_agent_id == agent_id,
            Order.delivery_time.is_(None)
        ).all()
        
        result = []
        for o in orders:
            # Get customer details
            customer = o.customer
            customer_data = None
            if customer:
                customer_data = {
                    'id': customer.id,
                    'name': customer.name,
                    'image': customer.image,
                    'contact': customer.contact
                }
            
            # Get restaurant details
            restaurant = o.restaurant
            restaurant_data = None
            if restaurant:
                restaurant_data = {
                    'id': restaurant.id,
                    'name': restaurant.name,
                    'logo': restaurant.logo
                }
            
            # Build menu items list with quantities from OrderMenuItem
            menu_items = []
            for order_item in o.order_menu_items:
                menu_item = order_item.menu_item
                menu_items.append({
                    'id': menu_item.id,
                    'name': menu_item.name,
                    'unit_price': menu_item.unit_price,
                    'image': menu_item.image,
                    'quantity': order_item.quantity
                })
            
            result.append({
                'id': o.id,
                'created_at': o.created_at.isoformat() if o.created_at else None,
                'delivery_time': None,
                'delivery_address': o.delivery_address,
                'payment_status': o.payment_status,
                'total_price': o.total_price,
                'restaurant_id': o.restaurant_id,
                'delivery_agent_id': o.delivery_agent_id,
                'customer_id': o.customer_id,
                'customer': customer_data,
                'restaurant': restaurant_data,
                'menu_items': menu_items
            })
        
        return make_response(result, 200)


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
        
        result = []
        for o in orders:
            # Get customer details
            customer = o.customer
            customer_data = None
            if customer:
                customer_data = {
                    'id': customer.id,
                    'name': customer.name,
                    'image': customer.image,
                    'contact': customer.contact
                }
            
            # Build menu items list with quantities from OrderMenuItem
            menu_items = []
            for order_item in o.order_menu_items:
                menu_item = order_item.menu_item
                menu_items.append({
                    'id': menu_item.id,
                    'name': menu_item.name,
                    'unit_price': menu_item.unit_price,
                    'image': menu_item.image,
                    'quantity': order_item.quantity
                })
            
            result.append({
                'id': o.id,
                'created_at': o.created_at.isoformat() if o.created_at else None,
                'delivery_time': o.delivery_time.isoformat() if o.delivery_time else None,
                'delivery_address': o.delivery_address,
                'payment_status': o.payment_status,
                'total_price': o.total_price,
                'restaurant_id': o.restaurant_id,
                'delivery_agent_id': o.delivery_agent_id,
                'customer_id': o.customer_id,
                'customer': customer_data,
                'menu_items': menu_items
            })
        
        return make_response(result, 200)


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


class DeliveryAgentById(Resource):
    def get(self, id):
        agent = DeliveryAgent.query.get(id)
        if not agent:
            return make_response({'error': 'Delivery agent not found'}, 404)
        
        return make_response({
            'id': agent.id,
            'name': agent.name,
            'email': agent.email,
            'contact': agent.contact,
            'image': agent.image,
            'rating': agent.rating,
            'restaurant_id': agent.restaurant_id
        }, 200)

api.add_resource(DeliveryAgentAccount, '/api/agent/account')
api.add_resource(DeliveryAgentOrders, '/api/agent/orders')
api.add_resource(DeliveryAgentPendingOrders, '/api/agent/pending-orders')
api.add_resource(DeliveryAgentDeliveredOrders, '/api/agent/delivered-orders')
api.add_resource(DeliveryAgentReviews, '/api/agent/reviews')
api.add_resource(DeliveryAgentOrderById, '/api/agent/orders/<int:id>')
api.add_resource(DeliveryAgentById, '/api/agent/<int:id>')

#6. File upload endpoint
class UploadImage(Resource):
    def post(self):
        if 'file' not in request.files:
            return make_response({'error': 'No file provided'}, 400)
        
        file = request.files['file']
        if file.filename == '':
            return make_response({'error': 'No file selected'}, 400)
        
        if file:
            # Generate unique filename
            import uuid
            filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Return the URL for the uploaded file
            return make_response({'url': f'/uploads/{filename}'}, 200)

api.add_resource(UploadImage, '/api/upload')

#7. M-Pesa Payment Routes
class MpesaSTKPush(Resource):
    def post(self):
        if session.get('user_type') != 'customer':
            return make_response({'error': 'Unauthorized'}, 403)
        
        customer_id = session.get('user_id')
        data = request.get_json()
        
        order_id = data.get('order_id')
        phone = data.get('phone')
        amount = data.get('amount')
        
        if not order_id or not phone or not amount:
            return make_response({'error': 'order_id, phone, and amount are required'}, 400)
        
        order = Order.query.get(order_id)
        if not order or order.customer_id != customer_id:
            return make_response({'error': 'Order not found'}, 404)
        
        if order.payment_status:
            return make_response({'error': 'Order already paid'}, 400)
        
        # M-Pesa Configuration
        mpesa_shortcode = os.getenv('MPESA_SHORTCODE', '')
        mpesa_consumer_key = os.getenv('MPESA_CONSUMER_KEY', '')
        mpesa_consumer_secret = os.getenv('MPESA_CONSUMER_SECRET', '')
        mpesa_passkey = os.getenv('MPESA_PASSKEY', '')
        
        # Check if M-Pesa credentials are configured
        if not all([mpesa_shortcode, mpesa_consumer_key, mpesa_consumer_secret, mpesa_passkey]):
            # For demo purposes, simulate a successful STK push
            return make_response({
                'message': 'M-Pesa STK push initiated. Check your phone to complete payment.',
                'simulated': True,
                'order_id': order_id,
                'amount': amount,
                'phone': phone
            }, 200)
        
        # Format phone number (remove leading 0 if present)
        if phone.startswith('0'):
            phone = '254' + phone[1:]
        elif phone.startswith('+'):
            phone = phone[1:]
        
        try:
            # Get access token
            import base64
            auth = base64.b64encode(f'{mpesa_consumer_key}:{mpesa_consumer_secret}'.encode()).decode()
            
            token_response = requests.get(
                'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
                headers={'Authorization': f'Basic {auth}'}
            )
            
            if token_response.status_code != 200:
                return make_response({'error': 'Failed to get M-Pesa access token'}, 500)
            
            access_token = token_response.json().get('access_token')
            
            # Generate STK push request
            import uuid
            from datetime import datetime
            
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                f'{mpesa_shortcode}{mpesa_passkey}{timestamp}'.encode()
            ).decode()
            
            stk_payload = {
                'BusinessShortCode': mpesa_shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerBuyGoodsOnline',
                'Amount': int(amount),
                'PartyA': phone,
                'PartyB': mpesa_shortcode,
                'PhoneNumber': phone,
                'CallBackURL': os.getenv('MPESA_CALLBACK_URL', ''),
                'AccountReference': f'Order{order_id}',
                'TransactionDesc': f'Payment for Order #{order_id}'
            }
            
            stk_response = requests.post(
                'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
                json=stk_payload,
                headers={
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
            )
            
            if stk_response.status_code == 200:
                return make_response({
                    'message': 'STK push sent! Check your phone to complete payment.',
                    'checkout_request_id': stk_response.json().get('CheckoutRequestID')
                }, 200)
            else:
                return make_response({
                    'error': 'Failed to initiate STK push',
                    'details': stk_response.text
                }, 500)
                
        except Exception as e:
            return make_response({'error': f'M-Pesa error: {str(e)}'}, 500)

class MpesaCallback(Resource):
    def post(self):
        """Handle M-Pesa callback for STK push"""
        data = request.get_json()
        
        # Process callback data
        try:
            result = data.get('Body', {}).get('stkCallback', {})
            result_code = result.get('ResultCode')
            result_desc = result.get('ResultDesc')
            
            if result_code == 0:
                # Payment successful
                callback_metadata = result.get('CallbackMetadata', {})
                amount = 0
                phone = ''
                transaction_id = ''
                
                for item in callback_metadata.get('Item', []):
                    if item.get('Name') == 'Amount':
                        amount = item.get('Value')
                    elif item.get('Name') == 'PhoneNumber':
                        phone = item.get('Value')
                    elif item.get('Name') == 'MpesaReceiptNumber':
                        transaction_id = item.get('Value')
                
                # Find and update the order
                # The order is identified by AccountReference in the request
                account_ref = result.get('Item', [{}])[1].get('Value', '')
                order_id = int(account_ref.replace('Order', ''))
                
                order = Order.query.get(order_id)
                if order and not order.payment_status:
                    order.payment_status = True
                    
                    payment = Payment(
                        order_id=order_id,
                        customer_id=order.customer_id,
                        restaurant_id=order.restaurant_id,
                        amount=amount,
                        method='mpesa',
                        transaction_id=transaction_id
                    )
                    db.session.add(payment)
                    db.session.commit()
                    
                    return make_response({'message': 'Payment processed'}, 200)
            else:
                # Payment failed
                return make_response({'error': result_desc}, 400)
                                               
        except Exception as e:
            return make_response({'error': f'Callback processing error: {str(e)}'}, 500)
        
        return make_response({'message': 'Callback received'}, 200)

api.add_resource(MpesaSTKPush, '/api/payments/mpesa/stkpush')
api.add_resource(MpesaCallback, '/api/payments/mpesa/callback')

# Serve uploaded files
@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5555, debug=True)