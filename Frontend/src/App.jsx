import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Customer pages
import CustomerLayout from './pages/customers/CustomerLayout';
import CustomerDashBoard from './pages/customers/CustomerDashBoard';
import RestaurantMenuPage from './pages/customers/RestaurantMenuPage';
import PlaceOrderPage from './pages/customers/PlaceOrderPage';
import CustomerOrdersPage from './pages/customers/CustomerOrdersPage';
import CustomerPaymentsPage from './pages/customers/CustomerPaymentsPage';
import CustomerReviewsPage from './pages/customers/CustomerReviewsPage';
import ReviewRestaurantPage from './pages/customers/ReviewRestaurantPage';
import ReviewAgentPage from './pages/customers/ReviewAgentPage';
import OrderPaymentPage from './pages/customers/OrderPaymentPage';

// Restaurant pages
import ReastaurantLayout from './pages/restaurants/ReastaurantLayout';
import RestaurantDashboard from './pages/restaurants/RestaurantDashboard';
import RestaurantOrdersPage from './pages/restaurants/RestaurantOrdersPage';
import RestaurantPaymentsPage from './pages/restaurants/RestaurantPaymentsPage';
import RestaurantAgents from './pages/restaurants/RestaurantAgents';
import RestaurantProfilePage from './pages/restaurants/RestaurantProfilePage';
import RestaurantReviewPage from './pages/restaurants/RestaurantReviewPage';

// Admin pages
import AdminLayout from './pages/admins/AdminLayout';
import AdminDashboard from './pages/admins/AdminDashboard';
import AdminRestaurants from './pages/admins/AdminRestaurants';
import AdminCustomers from './pages/admins/AdminCustomers';
import AdminPayments from './pages/admins/AdminPayments';

// Agent pages
import AgentLayout from './pages/agents/AgentLayout';
import AgentDashboard from './pages/agents/AgentDashboard';
import AgentReviewsPage from './pages/agents/AgentReviewsPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/check_session', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setUser(null);
      navigate('/login');
      try {
        await fetch('/api/logout', {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage user={user} />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <Login setUser={setUser} />} />
      <Route path="/signup" element={user ? <Navigate to={`/${user.user_type}/dashboard`} /> : <Signup setUser={setUser} />} />
      
      {/* Customer Routes */}
      <Route path="/customer/*" element={<CustomerLayout user={user} onLogout={handleLogout} />}>
        <Route path="dashboard" element={<CustomerDashBoard />} />
        <Route path="restaurants/:id/menu" element={<RestaurantMenuPage />} />
        <Route path="place-order" element={<PlaceOrderPage />} />
        <Route path="orders" element={<CustomerOrdersPage />} />
        <Route path="payments" element={<CustomerPaymentsPage />} />
        <Route path="reviews" element={<CustomerReviewsPage />} />
        <Route path="review/restaurant/:id" element={<ReviewRestaurantPage />} />
        <Route path="review/agent/:id" element={<ReviewAgentPage />} />
        <Route path="order/:id/payment" element={<OrderPaymentPage />} />
      </Route>

      {/* Restaurant Routes */}
      <Route path="/restaurant/*" element={<ReastaurantLayout user={user} onLogout={handleLogout} />}>
        <Route path="dashboard" element={<RestaurantDashboard />} />
        <Route path="orders" element={<RestaurantOrdersPage />} />
        <Route path="payments" element={<RestaurantPaymentsPage />} />
        <Route path="agents" element={<RestaurantAgents />} />
        <Route path="profile" element={<RestaurantProfilePage />} />
        <Route path="reviews" element={<RestaurantReviewPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<AdminLayout user={user} onLogout={handleLogout} />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="restaurants" element={<AdminRestaurants />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="payments" element={<AdminPayments />} />
      </Route>

      {/* Agent Routes */}
      <Route path="/agent/*" element={<AgentLayout user={user} onLogout={handleLogout} />}>
        <Route path="dashboard" element={<AgentDashboard />} />
        <Route path="reviews" element={<AgentReviewsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

