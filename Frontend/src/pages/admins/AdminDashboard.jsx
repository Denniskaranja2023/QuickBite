import { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, customersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/restaurants', { credentials: 'include' }),
        fetch('/api/admin/customers', { credentials: 'include' }),
        fetch('/api/admin/payments', { credentials: 'include' }),
      ]);

      if (restaurantsRes.ok) {
        const restaurants = await restaurantsRes.json();
        setStats(prev => ({ ...prev, totalRestaurants: restaurants.length }));
      }

      if (customersRes.ok) {
        const customers = await customersRes.json();
        setStats(prev => ({ ...prev, totalCustomers: customers.length }));
      }

      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        setStats(prev => ({ ...prev, totalRevenue: revenue, totalOrders: payments.length }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of the platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/restaurants" className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Restaurants</p>
              <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
            </div>
            <UtensilsCrossed className="h-12 w-12 text-primary-200" />
          </div>
        </Link>
        <Link to="/admin/customers" className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Customers</p>
              <p className="text-3xl font-bold">{stats.totalCustomers}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </Link>
        <Link to="/admin/payments" className="card bg-gradient-to-br from-green-500 to-green-600 text-white hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-200" />
          </div>
        </Link>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/restaurants"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <UtensilsCrossed className="h-8 w-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Restaurants</h3>
            <p className="text-sm text-gray-600">View and manage all restaurants</p>
          </Link>
          <Link
            to="/admin/customers"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <Users className="h-8 w-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Manage Customers</h3>
            <p className="text-sm text-gray-600">View and manage all customers</p>
          </Link>
          <Link
            to="/admin/payments"
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <DollarSign className="h-8 w-8 text-primary-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">View Payments</h3>
            <p className="text-sm text-gray-600">Monitor all transactions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

