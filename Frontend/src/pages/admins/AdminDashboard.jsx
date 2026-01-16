import { useState, useEffect } from 'react';
import { UtensilsCrossed, Users, DollarSign, TrendingUp, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../config';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [restaurantsRes, customersRes, paymentsRes, topRestaurantsRes, topCustomersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/restaurants`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/admin/customers`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/admin/payments`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/admin/top-restaurants`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/admin/top-customers`, { credentials: 'include' }),
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
        setStats(prev => ({ ...prev, totalRevenue: revenue }));
      }

      if (topRestaurantsRes.ok) {
        const restaurants = await topRestaurantsRes.json();
        setTopRestaurants(restaurants);
      }

      if (topCustomersRes.ok) {
        const customers = await topCustomersRes.json();
        setTopCustomers(customers);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-200" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
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

      {/* Top Restaurants */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
            Top Restaurants
          </h2>
          <Link to="/admin/restaurants" className="text-primary-500 hover:text-primary-600 font-medium">
            View All →
          </Link>
        </div>
        
        {topRestaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topRestaurants.map((restaurant, index) => (
              <div key={restaurant.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-green-200 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={restaurant.logo || '/placeholder-restaurant.jpg'}
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{restaurant.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{formatCurrency(restaurant.total_revenue)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{restaurant.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Customers */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            Top Customers
          </h2>
          <Link to="/admin/customers" className="text-primary-500 hover:text-primary-600 font-medium">
            View All →
          </Link>
        </div>
        
        {topCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No customers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={customer.image || '/placeholder-customer.jpg'}
                      alt={customer.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{customer.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>{formatCurrency(customer.total_spent)} spent</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

