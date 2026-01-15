import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AdminLayout } from './pages/admins/AdminLayout';
import { AdminDashboard } from './pages/admins/AdminDashboard';
import { AdminRestaurantsPage } from './pages/admins/AdminRestaurants';
import { AdminCustomersPage } from './pages/admins/AdminCustomers';
import { AdminPaymentsPage } from './pages/admins/AdminPayments';
import { RestaurantLayout } from './pages/restaurants/ReastaurantLayout';
import { RestaurantDashboard } from './pages/restaurants/RestaurantDashboard';
import { RestaurantAgentsPage } from './pages/restaurants/RestaurantAgents';
import { RestaurantOrdersPage } from './pages/restaurants/RestaurantOrdersPage';
import { RestaurantPaymentsPage } from './pages/restaurants/RestaurantPaymentsPage';
import { RestaurantProfilePage } from './pages/restaurants/RestaurantProfilePage';
import { RestaurantReviewsPage } from './pages/restaurants/RestaurantReviewPage';
import { CustomerLayout } from './pages/customers/CustomerLayout';
import { CustomerDashboard } from './pages/customers/CustomerDashBoard';
import { CustomerOrdersPage } from './pages/customers/CustomerOrdersPage';
import { CustomerPaymentsPage } from './pages/customers/CustomerPaymentsPage';
import { CustomerReviewsPage } from './pages/customers/CustomerReviewsPage';
import { PlaceOrderPage } from './pages/customers/PlaceOrderPage';
import { RestaurantMenuPage } from './pages/customers/RestaurantMenuPage';
import { OrderPaymentPage } from './pages/customers/OrderPaymentPage';
import { ReviewAgentPage } from './pages/customers/ReviewAgentPage';
import { ReviewRestaurantPage } from './pages/customers/ReviewRestaurantPage';
import { AgentLayout } from './pages/agents/AgentLayout';
import { AgentDashboard } from './pages/agents/AgentDashboard';
import { AgentReviewsPage } from './pages/agents/AgentReviewsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/restaurants" element={<AdminLayout><AdminRestaurantsPage /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPaymentsPage /></AdminLayout>} />
        <Route path="/restaurant/dashboard" element={<RestaurantLayout><RestaurantDashboard /></RestaurantLayout>} />
        <Route path="/restaurant/agents" element={<RestaurantLayout><RestaurantAgentsPage /></RestaurantLayout>} />
        <Route path="/restaurant/orders" element={<RestaurantLayout><RestaurantOrdersPage /></RestaurantLayout>} />
        <Route path="/restaurant/payments" element={<RestaurantLayout><RestaurantPaymentsPage /></RestaurantLayout>} />
        <Route path="/restaurant/profile" element={<RestaurantLayout><RestaurantProfilePage /></RestaurantLayout>} />
        <Route path="/restaurant/reviews" element={<RestaurantLayout><RestaurantReviewsPage /></RestaurantLayout>} />
        <Route path="/customer/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
        <Route path="/customer/place-order" element={<CustomerLayout><PlaceOrderPage /></CustomerLayout>} />
        <Route path="/customer/restaurant/:id/menu" element={<CustomerLayout><RestaurantMenuPage /></CustomerLayout>} />
        <Route path="/customer/orders" element={<CustomerLayout><CustomerOrdersPage /></CustomerLayout>} />
        <Route path="/customer/order/:id/payment" element={<CustomerLayout><OrderPaymentPage /></CustomerLayout>} />
        <Route path="/customer/payments" element={<CustomerLayout><CustomerPaymentsPage /></CustomerLayout>} />
        <Route path="/customer/reviews" element={<CustomerLayout><CustomerReviewsPage /></CustomerLayout>} />
        <Route path="/customer/review-restaurant/:id" element={<CustomerLayout><ReviewRestaurantPage /></CustomerLayout>} />
        <Route path="/customer/review-agent/:id" element={<CustomerLayout><ReviewAgentPage /></CustomerLayout>} />
        <Route path="/agent/dashboard" element={<AgentLayout><AgentDashboard /></AgentLayout>} />
        <Route path="/agent/reviews" element={<AgentLayout><AgentReviewsPage /></AgentLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
