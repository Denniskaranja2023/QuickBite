from app import app, db
from models import Restaurant, DeliveryAgent, Customer, MenuItem, Order, Payment, RestaurantReview, DeliveryReview, Admin
from faker import Faker
import random

fake = Faker()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Kenyan addresses
        kenyan_addresses = [
            "Kimathi Street, Nairobi",
            "Moi Avenue, Mombasa",
            "Kenyatta Avenue, Nairobi",
            "Uhuru Highway, Nairobi",
            "Nyerere Road, Mombasa",
            "Thika Road, Nairobi",
            "Ngong Road, Nairobi",
            "Digo Road, Mombasa",
            "Garissa Road, Thika",
            "Kenyatta Highway, Thika",
            "Oginga Odinga Street, Kisumu",
            "Jomo Kenyatta Highway, Kisumu",
            "Waiyaki Way, Nairobi",
            "Mombasa Road, Nairobi",
            "Langata Road, Nairobi",
            "Makupa Causeway, Mombasa",
            "Nkrumah Road, Kisumu",
            "Commercial Street, Thika",
            "Haile Selassie Avenue, Nairobi",
            "Mama Ngina Drive, Mombasa"
        ]
        
        # Restaurant logos
        logos = [
            "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_hybrid&w=740&q=80",
            "https://static.free-logo-design.net/uploads/2020/06/free-falcon-logo-design.jpg",
            "https://img.freepik.com/free-vector/abstract-logo-flame-shape_1043-44.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg",
            "https://media.istockphoto.com/id/1399318216/vector/round-icon-spartan-helmet.jpg?s=612x612&w=0&k=20&c=PWKk1b8Xm7THDlgYS_9qyi3ShUxL3VGtaEVJK0wgGF0="
        ]
        
        # Agent images
        agent_images = [
            "https://www.shutterstock.com/image-photo/portrait-african-man-260nw-156307685.jpg",
            "https://cdn.pixabay.com/photo/2022/08/20/11/59/african-man-7398921_960_720.jpg",
            "https://t3.ftcdn.net/jpg/03/91/34/72/360_F_391347204_XaDg0S7PtbzJRoeow3yWO1vK4pnqBVQY.jpg",
            "https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-photo/sideways-shot-pleased-relaxed-woman-with-healthy-dark-skin-looks-positively-aside_273609-18172.jpg?semt=ais_hybrid&w=740&q=80",
            "https://img.freepik.com/free-photo/confident-african-businesswoman-smiling-closeup-portrait-jobs-career-campaign_53876-143280.jpg?semt=ais_hybrid&w=740&q=80"
        ]
        
        # Customer images
        customer_images = [
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",  # Male
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500",  # Female
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500",  # Male
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",  # Female
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",  # Male
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",  # Female
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",  # Male
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",  # Female
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500",  # Male
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500"   # Female
        ]
        
        # Restaurant names
        restaurant_names = [
            "Mama's Kitchen", "Spice Garden", "Urban Bites", "Golden Fork", "Savory Delights",
            "The Hungry Lion", "Coastal Flavors", "Mountain View Grill", "City Cafe", "Heritage Restaurant"
        ]
        
        # Create 2 admins
        admins = []
        admin_names = ["John Admin", "Sarah Manager"]
        for name in admin_names:
            admin = Admin(
                name=name,
                email=f"{name.lower().replace(' ', '.')}@quickbite.com"
            )
            admin.password_hash = "admin"
            admins.append(admin)
            db.session.add(admin)
        
        db.session.commit()
        
        # Create 10 restaurants
        restaurants = []
        for i in range(10):
            name = restaurant_names[i]
            restaurant = Restaurant(
                name=name,
                address=random.choice(kenyan_addresses),
                contact=fake.phone_number(),
                email=f"{name.lower().replace(' ', '').replace(chr(39), '')}@restaurant.com",
                bio=fake.text(max_nb_chars=200),
                logo=random.choice(logos),
                paybill_number=fake.random_int(min=100000, max=999999),
                rating=round(random.uniform(3.0, 5.0), 1),
                admin=random.choice(admins)
            )
            restaurant.password_hash = "restaurant"
            restaurants.append(restaurant)
            db.session.add(restaurant)
        
        # Create 20 customers
        customers = []
        for _ in range(20):
            name = fake.name()
            customer = Customer(
                name=name,
                contact=fake.phone_number(),
                image=random.choice(customer_images),
                email=f"{name.lower().replace(' ', '.')}@customer.com"
            )
            customer.password_hash = "customer"
            customers.append(customer)
            db.session.add(customer)
        
        # Create 15 delivery agents
        agents = []
        for _ in range(15):
            name = fake.name()
            agent = DeliveryAgent(
                name=name,
                contact=fake.phone_number(),
                image=random.choice(agent_images),
                rating=round(random.uniform(4.0, 5.0), 1),
                restaurant=random.choice(restaurants),
                email=f"{name.lower().replace(' ', '.')}@agent.com"
            )
            agent.password_hash = "agent"
            agents.append(agent)
            db.session.add(agent)
        
        db.session.commit()
        
        # Menu item descriptions
        food_descriptions = {
            "Grilled Chicken": "Tender chicken breast marinated in herbs and spices, perfectly grilled to golden perfection. Served with your choice of sides.",
            "Beef Steak": "Premium quality beef steak, cooked to your preference. Juicy, tender, and full of flavor. Served with vegetables and your choice of sauce.",
            "Fish Fillet": "Fresh fish fillet, lightly seasoned and pan-fried until crispy on the outside and tender on the inside. Served with lemon and tartar sauce.",
            "Vegetable Curry": "A flavorful mix of fresh seasonal vegetables cooked in a rich, aromatic curry sauce. Perfectly spiced and served with rice or naan.",
            "Pasta Carbonara": "Classic Italian pasta with creamy sauce, crispy bacon, and parmesan cheese. Rich, comforting, and absolutely delicious.",
            "Pizza Margherita": "Traditional Italian pizza with fresh tomato sauce, mozzarella cheese, and basil. Simple, classic, and always satisfying.",
            "Caesar Salad": "Crisp romaine lettuce tossed in creamy Caesar dressing, topped with parmesan cheese and croutons. Fresh and flavorful.",
            "Chicken Wings": "Crispy, golden chicken wings tossed in your choice of sauce. Spicy, tangy, and finger-licking good.",
            "Lamb Chops": "Tender lamb chops seasoned with herbs and grilled to perfection. Juicy, flavorful, and served with mint sauce.",
            "Seafood Platter": "A generous assortment of fresh seafood including fish, prawns, and calamari. Grilled and seasoned to perfection.",
            "Burger Deluxe": "Juicy beef patty with fresh lettuce, tomato, onion, pickles, and special sauce on a toasted bun. A classic favorite.",
            "Fried Rice": "Fragrant rice stir-fried with vegetables, eggs, and your choice of protein. Flavorful and satisfying.",
            "Noodle Soup": "Warm, comforting noodle soup with vegetables and your choice of protein. Perfect for any time of day.",
            "Tacos": "Soft or crispy tortillas filled with seasoned meat, fresh vegetables, cheese, and salsa. Authentic Mexican flavors.",
            "Quesadilla": "Warm tortilla filled with melted cheese and your choice of fillings. Crispy on the outside, gooey on the inside.",
            "Sushi Roll": "Fresh sushi rolls with premium fish, vegetables, and rice. Artfully prepared and beautifully presented.",
            "Pad Thai": "Classic Thai stir-fried noodles with tamarind sauce, vegetables, peanuts, and your choice of protein. Sweet, sour, and savory.",
            "Biryani": "Fragrant basmati rice cooked with aromatic spices and tender meat. A flavorful and aromatic dish that's a feast for the senses.",
            "Samosa": "Crispy pastry filled with spiced potatoes and peas. Golden, flaky, and perfectly seasoned. Served with chutney.",
            "Spring Rolls": "Crispy vegetable spring rolls with a savory filling. Light, crunchy, and served with sweet and sour sauce.",
            "Chocolate Cake": "Rich, moist chocolate cake with creamy frosting. Decadent and irresistible. Perfect for satisfying your sweet tooth.",
            "Ice Cream": "Creamy, smooth ice cream in various flavors. Cool, refreshing, and the perfect dessert for any occasion.",
            "Fruit Salad": "Fresh seasonal fruits mixed together. Light, refreshing, and naturally sweet. A healthy and delicious choice.",
            "Cheesecake": "Creamy, rich cheesecake with a buttery graham cracker crust. Smooth, decadent, and absolutely delightful.",
            "Tiramisu": "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream. Rich, creamy, and elegant.",
            "Coffee": "Freshly brewed coffee, hot and aromatic. Available in various styles. The perfect pick-me-up to start your day.",
            "Fresh Juice": "Freshly squeezed juice from seasonal fruits. Natural, refreshing, and packed with vitamins. Available in various flavors.",
            "Smoothie": "Blended fresh fruits with yogurt or milk. Thick, creamy, and nutritious. A delicious and healthy beverage option.",
            "Tea": "Hot, aromatic tea served with your choice of milk and sugar. Soothing and comforting. Available in various flavors.",
            "Soda": "Refreshing carbonated soft drinks. Cold, fizzy, and available in various flavors. Perfect for quenching your thirst.",
            "Garlic Bread": "Crispy bread brushed with garlic butter and herbs. Warm, fragrant, and the perfect accompaniment to any meal.",
            "Onion Rings": "Golden, crispy onion rings with a light batter. Crunchy on the outside, tender on the inside. Addictively delicious.",
            "French Fries": "Crispy, golden french fries, perfectly seasoned and cooked to perfection. Hot, salty, and absolutely irresistible.",
            "Mozzarella Sticks": "Breaded mozzarella cheese sticks, fried until golden and crispy. Melted cheese center with a crunchy exterior.",
            "Chicken Nuggets": "Tender pieces of chicken, breaded and fried until golden. Crispy on the outside, juicy on the inside. Served with dipping sauce.",
            "Pancakes": "Fluffy, golden pancakes served with butter and syrup. Light, sweet, and perfect for breakfast or brunch.",
            "Waffles": "Crispy, golden waffles with a light, fluffy texture. Served with butter, syrup, and fresh fruit. A breakfast favorite.",
            "Omelette": "Fluffy eggs filled with your choice of vegetables, cheese, and meat. Customizable and always satisfying.",
            "Sandwich": "Fresh bread filled with your choice of ingredients. Customizable, convenient, and always delicious. Perfect for a quick meal.",
            "Wrap": "Soft tortilla wrapped around your choice of fresh fillings. Portable, flavorful, and perfect for on-the-go dining."
        }
        
        # Menu items with images
        food_data = [
            ("Grilled Chicken", "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500"),
            ("Beef Steak", "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500"),
            ("Fish Fillet", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500"),
            ("Vegetable Curry", "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500"),
            ("Pasta Carbonara", "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500"),
            ("Pizza Margherita", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500"),
            ("Caesar Salad", "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500"),
            ("Chicken Wings", "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500"),
            ("Lamb Chops", "https://images.unsplash.com/photo-1574484284002-952d92456975?w=500"),
            ("Seafood Platter", "https://images.unsplash.com/photo-1559737558-2f5a35f4523f?w=500"),
            ("Burger Deluxe", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"),
            ("Fried Rice", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"),
            ("Noodle Soup", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"),
            ("Tacos", "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500"),
            ("Quesadilla", "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500"),
            ("Sushi Roll", "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500"),
            ("Pad Thai", "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500"),
            ("Biryani", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"),
            ("Samosa", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500"),
            ("Spring Rolls", "https://images.unsplash.com/photo-1620704911511-8b2c6b146d5b?w=500"),
            ("Chocolate Cake", "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"),
            ("Ice Cream", "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500"),
            ("Fruit Salad", "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=500"),
            ("Cheesecake", "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=500"),
            ("Tiramisu", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500"),
            ("Coffee", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"),
            ("Fresh Juice", "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500"),
            ("Smoothie", "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500"),
            ("Tea", "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500"),
            ("Soda", "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500"),
            ("Garlic Bread", "https://images.unsplash.com/photo-1573140401552-388e3c0b1abb?w=500"),
            ("Onion Rings", "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500"),
            ("French Fries", "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"),
            ("Mozzarella Sticks", "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500"),
            ("Chicken Nuggets", "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
            ("Pancakes", "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500"),
            ("Waffles", "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=500"),
            ("Omelette", "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500"),
            ("Sandwich", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500"),
            ("Wrap", "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500")
        ]
        
        # Create 40 menu items
        menu_items = []
        for name, image in food_data:
            item = MenuItem(
                name=name,
                unit_price=round(random.uniform(300.0, 1500.0), 2),
                image=image,
                description=food_descriptions.get(name, "Delicious food item prepared with fresh ingredients."),
                restaurant=random.choice(restaurants),
                availability=random.choice([True, True, True, False])  # 75% available
            )
            menu_items.append(item)
            db.session.add(item)
        
        db.session.commit()
        
        # Create 30 orders
        orders = []
        for _ in range(30):
            order = Order(
                delivery_address=random.choice(kenyan_addresses),
                total_price=0,
                payment_status=random.choice([True, False]),
                customer=random.choice(customers),
                restaurant=random.choice(restaurants),
                delivery_agent=random.choice(agents),
                delivery_time=fake.date_time_this_month() if random.choice([True, False]) else None
            )
            orders.append(order)
            db.session.add(order)
        
        db.session.commit()
        
        # Add menu items to orders and calculate total price
        for order in orders:
            num_items = random.randint(1, 5)
            selected_items = random.sample(menu_items, num_items)
            order.menu_items.extend(selected_items)
            order.total_price = round(sum(item.unit_price for item in selected_items), 2)
        
        # Create 15 payments for some orders
        paid_orders = random.sample(orders, 15)
        for order in paid_orders:
            order.payment_status = True
            payment = Payment(
                amount=order.total_price,
                method=random.choice(["Credit Card", "Mobile Money", "Cash", "Bank Transfer"]),
                order=order,
                customer=order.customer,
                restaurant=order.restaurant
            )
            db.session.add(payment)
        
        # Create 20 restaurant reviews (at least one per restaurant)
        for restaurant in restaurants:
            review = RestaurantReview(
                comment=fake.text(max_nb_chars=150),
                rating=round(random.uniform(3.0, 5.0), 1),
                restaurant=restaurant,
                customer=random.choice(customers)
            )
            db.session.add(review)
        
        # Create 10 more random restaurant reviews
        for _ in range(10):
            review = RestaurantReview(
                comment=fake.text(max_nb_chars=150),
                rating=round(random.uniform(3.0, 5.0), 1),
                restaurant=random.choice(restaurants),
                customer=random.choice(customers)
            )
            db.session.add(review)
        
        # Create 25 delivery reviews (at least one per agent)
        for agent in agents:
            review = DeliveryReview(
                comment=fake.text(max_nb_chars=150),
                rating=round(random.uniform(4.0, 5.0), 1),
                delivery_agent=agent,
                customer=random.choice(customers)
            )
            db.session.add(review)
        
        # Create 10 more random delivery reviews
        for _ in range(10):
            review = DeliveryReview(
                comment=fake.text(max_nb_chars=150),
                rating=round(random.uniform(4.0, 5.0), 1),
                delivery_agent=random.choice(agents),
                customer=random.choice(customers)
            )
            db.session.add(review)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()