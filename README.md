# 🍔 QuickBite - Food Delivery Platform

<div align="center">

*A modern, full-stack food delivery platform connecting customers, restaurants, and delivery agents*

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=flat-square&logo=render)](https://render.com/)

</div>

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Live Demo](#live-demo)
3. [Features](#features)
4. [User Roles & Experience](#user-roles--experience)
   - [Admin Dashboard](#admin-dashboard)
   - [Restaurant Portal](#restaurant-portal)
   - [Customer App](#customer-app)
   - [Delivery Agent App](#delivery-agent-app)
5. [Quick Start](#quick-start)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running Locally](#running-locally)
6. [Testing the Application](#testing-the-application)
7. [API Documentation](#api-documentation)
8. [Tech Stack](#tech-stack)
9. [Future Improvements](#future-improvements)
10. [Contributing](#contributing)
11. [License](#license)

---

## 🎯 Project Overview

### What is QuickBite?

QuickBite is a comprehensive food delivery platform built with modern web technologies. It provides a seamless ecosystem connecting three key user groups:

- **🍽️ Restaurants** - Manage menus, track orders, and monitor payments
- **👨‍🍳 Customers** - Browse restaurants, order food, and track deliveries
- **🚴 Delivery Agents** - Accept and complete delivery assignments

### Who Can Use QuickBite?

| User Type | Use Case |
|-----------|----------|
| **Restaurant Owners** | List menus, manage orders, track earnings, manage delivery staff |
| **Customers** | Find restaurants, order food, pay securely, rate experiences |
| **Delivery Agents** | Receive delivery requests, navigate to locations, complete deliveries |
| **Platform Admins** | Manage users, view analytics, oversee platform operations |

### Key Highlights

- 🚀 **Fast Performance** - Built with React and Flask for lightning-fast responses
- 🔐 **Secure Authentication** - Session-based auth with password hashing
- 💳 **Payment Integration Ready** - M-Pesa STK Push, PayPal support coming soon
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⭐ **Rating System** - Restaurants and agents earn ratings from customers
- 📊 **Analytics Dashboard** - Track orders, revenue, and performance

---

## 🌐 Live Demo

### Frontend (Vercel)
**URL:** [https://quick-bite-theta-sable.vercel.app](https://quick-bite-theta-sable.vercel.app)

### Backend (Render)
**URL:** [https://quickbite-vzfk.onrender.com](https://quickbite-vzfk.onrender.com)

---

## ✨ Features

### Common Features
- 🔐 Secure login/logout with session management
- 👤 Profile management
- 📱 Responsive design for all devices
- 🗣️ Swahili and English language support

### Admin Features
- 📊 Dashboard with platform-wide statistics
- 🏪 Manage all restaurants
- 👥 Manage all customers
- 💰 View all payments and transactions
- 📈 Top performing restaurants and customers analytics

### Restaurant Features
- 📊 Dashboard with orders and revenue stats
- 🍔 Menu item management (CRUD operations)
- 🛵 Manage delivery agents
- 📋 Order management and tracking
- ⭐ View customer reviews and ratings
- 💳 Payment history and earnings

### Customer Features
- 🏠 Homepage with featured restaurants and popular items
- 🔍 Search and filter restaurants
- 📖 View restaurant menus
- 🛒 Place orders with multiple items
- 💳 Secure payment processing
- 📦 Track order status
- ⭐ Rate restaurants and delivery agents
- 📋 Order history and receipts

### Delivery Agent Features
- 📊 Dashboard with delivery statistics
- 📦 View assigned orders
- ✅ Mark orders as delivered
- ⭐ View ratings and feedback
- 📋 Delivery history

---

## 📸 Screenshots Guide

This section documents the screenshots available for each section of the application.

| Section | File Name | Description |
|---------|-----------|-------------|
| Homepage | `Homepage.png` | Main landing page |
| Admin Dashboard | `Admindashboard.png` | Admin overview with stats |
| Admin Payments | `AdminPayments.png` | Payment tracking |
| Add Restaurant Form | `AddRestaurantForm.png` | Admin adding restaurant |
| Restaurant Dashboard | `Restaurant_dashboard.png` | Restaurant overview |
| Restaurant Orders | `Restaurant_orders.png` | Order management |
| Menu Items | `Menu_items.png` | Menu items management |
| Customer Dashboard | `Customer_dashboard.png` | Customer home |
| Agent Dashboard | `Agent_dashboard.png` | Agent overview |

---

## 👥 User Roles & Experience

### 🖥️ Homepage

![Homepage](Frontend/public/Homepage.png)

The QuickBite homepage welcomes users with a clean, modern interface featuring:
- Platform statistics (restaurants, customers, delivery agents)
- Top-rated restaurants carousel
- Most popular menu items
- Easy navigation to login/signup

---

### 👑 Admin Dashboard

![Admin Dashboard](Frontend/public/Admindashboard.png)

The Admin Dashboard provides complete oversight of the entire platform.

**Access:** Login with admin credentials (see [Testing](#testing-the-application))

**Key Features:**

| Feature | Description |
|---------|-------------|
| **Platform Stats** | View total restaurants, customers, and delivery agents |
| **Top Restaurants** | Analytics on best-performing restaurants by orders |
| **Top Customers** | Identify most active customers by order volume |
| **Restaurant Management** | View, add, or remove restaurants |
| **Customer Management** | View all registered customers |
| **Payment Tracking** | Monitor all platform transactions |

**Admin User Flow:**
1. Navigate to `/login`
2. Enter admin credentials
3. Access dashboard at `/admin/dashboard`
4. View analytics cards showing platform metrics
5. Click on sidebar items to manage resources
6. Use "Top Restaurants" to identify best performers
7. Monitor "Payments" for transaction history

---

### 🏪 Restaurant Portal

![Restaurant Dashboard](Frontend/public/Restaurant_dashboard.png)

Restaurant owners can manage their entire food business from the portal.

**Access:** Login with restaurant credentials (see [Testing](#testing-the-application))

**Key Features:**

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of orders, revenue, and performance |
| **Menu Items** | Add, edit, or remove menu items with images and prices |
| **Orders** | View and manage incoming orders |
| **Payments** | Track earnings and payment history |
| **Delivery Agents** | Add and manage delivery staff |
| **Reviews** | Monitor customer feedback and ratings |

**Restaurant User Flow:**
1. Login at `/login` as restaurant
2. Access dashboard showing today's orders and revenue
3. Navigate to **Menu Items** to add new dishes
4. Use **Orders** to view pending orders
5. Assign delivery agents to orders
6. Check **Payments** for earnings
7. Add new delivery agents in **Agents** section
8. Monitor **Reviews** for customer feedback

---

### 👨‍🍳 Customer App

![Customer Dashboard](Frontend/public/Customer_dashboard.png)

Customers enjoy a seamless food ordering experience.

**Access:** Sign up at `/signup` or login with test credentials

**Key Features:**

| Feature | Description |
|---------|-------------|
| **Browse Restaurants** | View all available restaurants with ratings |
| **Menu Browsing** | See detailed menus with prices and images |
| **Shopping Cart** | Add multiple items to cart |
| **Order Placement** | Place orders with delivery address |
| **Payment** | Pay securely online |
| **Order Tracking** | Monitor order status in real-time |
| **Order History** | View past orders and receipts |
| **Reviews** | Rate restaurants and delivery agents |

**Customer User Flow:**
1. Visit homepage to browse restaurants
2. Click "Sign Up" or "Login" to authenticate
3. Browse restaurants on dashboard
4. Click a restaurant to view its menu
5. Select items and add to cart
6. Click "Place Order" and enter delivery details
7. Complete payment
8. Track order status
9. After delivery, leave reviews

---

### 🚴 Delivery Agent App

![Agent Dashboard](Frontend/public/Agent_dashboard.png)

Delivery agents manage their delivery assignments efficiently.

**Access:** Login with agent credentials (see [Testing](#testing-the-application))

**Key Features:**

| Feature | Description |
|---------|-------------|
| **Dashboard** | View delivery statistics |
| **Pending Orders** | View assigned deliveries |
| **Delivered Orders** | View completed deliveries |
| **Reviews** | Monitor customer ratings |

**Delivery Agent User Flow:**
1. Login at `/login` as delivery agent
2. View dashboard with delivery stats
3. Check "Pending Orders" for new assignments
4. Click an order to view details
5. Complete delivery and update status
6. View "Delivered Orders" history
7. Monitor ratings in "Reviews"

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (optional, for production) - [Download](https://www.postgresql.org/)

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QuickBite.git
cd QuickBite
```

#### 2. Set Up the Backend

```bash
# Navigate to server directory
cd Server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Set Up the Frontend

```bash
# Navigate to frontend directory
cd ../Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### ⚙️ Configuration

#### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quickbite
# Or use SQLite for development
DATABASE_URL=sqlite:///app.db

# Session
SECRET_KEY=your-secret-key-here

# M-Pesa Configuration (Optional)
MPESA_SHORTCODE=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=

# Environment
FLASK_ENV=development
```

#### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:5555
```

### 🏃 Running Locally

#### Start the Backend

```bash
cd Server
python app.py
```

The backend will start at `http://localhost:5555`

#### Start the Frontend

```bash
cd Frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

---

## 🧪 Testing the Application

QuickBite comes with pre-seeded test data for all user types.

### Test Credentials

| User Type | Email | Password | Access URL |
|-----------|-------|----------|------------|
| **Admin** | john.admin@quickbite.com | admin | /admin/dashboard |
| **Restaurant** | urbanbites@restaurant.com | restaurant | /restaurant/dashboard |
| **Customer** | dennis.karanja@customer.com | customer | /customer/dashboard |
| **Delivery Agent** | ashley.thomas@agent.com | agent | /agent/dashboard |

### Seeded Data Includes:

- **2 Admins** - Platform managers
- **10 Restaurants** - With logos, menus, and ratings
- **20 Customers** - With profiles and order history
- **15 Delivery Agents** - Assigned to restaurants
- **40 Menu Items** - With images, descriptions, and prices
- **30 Orders** - Mix of pending and completed
- **30 Reviews** - Restaurant and delivery agent ratings

### Testing Steps

#### 1. Test Admin Features
1. Login with admin credentials
2. View platform statistics on dashboard
3. Navigate to "Restaurants" to view all restaurants
4. Check "Customers" for user management
5. View "Payments" for transaction history

#### 2. Test Restaurant Features
1. Login with restaurant credentials
2. View dashboard with order stats
3. Add a new menu item
4. View and manage pending orders
5. Add a new delivery agent
6. Check payment history

#### 3. Test Customer Features
1. Login with customer credentials
2. Browse restaurants on dashboard
3. View restaurant menu
4. Add items to cart and place order
5. View order in history
6. Complete payment
7. Leave a review after delivery

#### 4. Test Delivery Agent Features
1. Login with agent credentials
2. View assigned orders in "Pending Orders"
3. Complete a delivery
4. View delivery history
5. Check ratings and reviews

---

## 📚 API Documentation

QuickBite provides a RESTful API with the following endpoints:

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User login |
| POST | `/api/signup` | User registration |
| GET | `/api/check_session` | Verify current session |
| DELETE | `/api/logout` | User logout |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/restaurants` | List all restaurants |
| POST | `/api/admin/restaurants` | Create restaurant |
| GET | `/api/admin/customers` | List all customers |
| GET | `/api/admin/payments` | List all payments |
| GET | `/api/admin/top-restaurants` | Top performing restaurants |
| GET | `/api/admin/top-customers` | Top spending customers |

### Restaurant Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurant/account` | Get restaurant profile |
| PATCH | `/api/restaurant/account` | Update restaurant profile |
| GET | `/api/restaurant/menuitems` | List menu items |
| POST | `/api/restaurant/menuitems` | Create menu item |
| GET | `/api/restaurant/orders` | List orders |
| GET | `/api/restaurant/agents` | List delivery agents |
| POST | `/api/restaurant/agents` | Create delivery agent |
| GET | `/api/restaurant/reviews` | List reviews |

### Customer Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customer/restaurants` | List all restaurants |
| GET | `/api/customer/restaurants/<id>` | Get restaurant details |
| GET | `/api/customer/menuitems` | List menu items by restaurant |
| GET | `/api/customer/orders` | List customer orders |
| POST | `/api/customer/orders` | Create new order |
| GET | `/api/customer/payments` | List customer payments |
| GET | `/api/customer/stats` | Get customer statistics |
| POST | `/api/customer/restaurant-reviews` | Review a restaurant |
| POST | `/api/customer/delivery-reviews` | Review a delivery agent |

### Delivery Agent Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agent/orders` | List all orders |
| GET | `/api/agent/pending-orders` | List pending deliveries |
| GET | `/api/agent/delivered-orders` | List delivered orders |
| PATCH | `/api/agent/orders/<id>` | Update delivery status |
| GET | `/api/agent/reviews` | List agent reviews |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Next-generation build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client

### Backend
- **Flask** - Lightweight Python web framework
- **Flask-RESTful** - REST API building
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-SQLAlchemy** - ORM for database
- **Flask-Bcrypt** - Password hashing
- **Flask-Migrate** - Database migrations
- **Python-dotenv** - Environment variables

### Database
- **PostgreSQL** - Production database
- **SQLite** - Development database

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## 🚀 Future Improvements

### Payment Integrations

| Integration | Status | Description |
|-------------|--------|-------------|
| **M-Pesa STK Push** | Ready | Mobile money payments for Kenyan market |
| **PayPal** | Planned | International payment processing |
| **Credit/Debit Cards** | Ready | Direct card payments |
| **USSD** | Planned | Payments via mobile phone |

### AI & Machine Learning Features

| Feature | Description |
|---------|-------------|
| **Smart Recommendations** | AI-powered dish suggestions based on preferences |
| **Demand Prediction** | Predict popular items for restaurants |
| **Delivery Time Estimation** | ML models for accurate delivery ETAs |
| **Sentiment Analysis** | Analyze reviews for insights |
| **Dynamic Pricing** - | Optimize prices based on demand |

### Platform Enhancements

| Feature | Description |
|---------|-------------|
| **Real-time Tracking** | Live order tracking with maps |
| **Chat System** | In-app messaging between users |
| **Push Notifications** | Order updates and promotions |
| **Multi-language** | Support for Swahili, English, more |
| **Dark Mode** | Dark theme for the UI |
| **Social Login** | Google, Facebook authentication |
| **Referral System** | Rewards for referring users |
| **Loyalty Points** | Points system for repeat customers |
| **Advanced Analytics** | Detailed business insights |
| **Restaurant Admin App** | Mobile app for restaurant owners |

---

## 🤝 Contributing

We welcome contributions to QuickBite! Whether you want to fix a bug, add a feature, or improve documentation, your help is appreciated.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/QuickBite.git
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/QuickBite.git
   cd QuickBite
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

5. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Submit a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes

### Code Style Guidelines

- **Frontend:** Follow ESLint configuration, use Prettier for formatting
- **Backend:** Follow PEP 8 style guide, use type hints where possible
- **Commits:** Use conventional commit messages

### Reporting Issues

Found a bug? Have a suggestion? Let us know!

📧 **Email:** denniswanyeki2021@gmail.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 QuickBite

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for beautiful food and restaurant images
- [Flaticon](https://www.flaticon.com) for icons
- [Faker.js](https://fakerjs.dev) for test data generation
- [Tailwind CSS](https://tailwindcss.com) for the beautiful UI components
- [Render](https://render.com) for free backend hosting
- [Vercel](https://vercel.com) for free frontend hosting

---

<div align="center">

**Made with ❤️ by Dennis Karanja**

📧 Contact: denniswanyeki2021@gmail.com

</div>

