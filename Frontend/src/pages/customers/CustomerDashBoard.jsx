import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, CreditCard, Star, ArrowRight, MapPin, Clock } from 'lucide-react';

function CustomerDashBoard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    favoriteRestaurants: 0,
  });

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/admin/restaurants', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/customer/orders', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        const totalSpent = data.reduce((sum, order) => sum + (order.total_price || 0), 0);
        setStats({
          totalOrders: data.length,
          totalSpent,
          favoriteRestaurants: new Set(data.map(o => o.restaurant_id)).size,
        });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent-500 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold">${stats.totalSpent.toFixed(2)}</p>
            </div>
            <CreditCard className="h-12 w-12 text-accent-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Restaurants</p>
              <p className="text-3xl font-bold">{stats.favoriteRestaurants}</p>
            </div>
            <Star className="h-12 w-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <Link
            to="/customer/orders"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No orders yet</p>
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
              Browse restaurants
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.total_price?.toFixed(2) || '0.00'}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.payment_status ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Restaurants */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular Restaurants</h2>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>Browse all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/customer/restaurants/${restaurant.id}/menu`}
              className="card hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg mb-4 flex items-center justify-center">
                {restaurant.logo ? (
                  <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <UtensilsCrossed className="h-16 w-16 text-primary-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{restaurant.address}</span>
                </div>
              </div>
              {restaurant.bio && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{restaurant.bio}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-primary-600 font-semibold">View Menu</span>
                <ArrowRight className="h-5 w-5 text-primary-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashBoard;

