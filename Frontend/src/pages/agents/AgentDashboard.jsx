import { useState, useEffect } from 'react';
import { ShoppingBag, Star, TrendingUp, Clock } from 'lucide-react';

function AgentDashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    averageRating: 0,
    completedToday: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/agent/orders', { credentials: 'include' }),
        fetch('/api/agent/reviews', { credentials: 'include' }),
      ]);

      let recentOrders = [];
      let totalDeliveries = 0;

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        recentOrders = orders.slice(0, 5);
        totalDeliveries = orders.length;
        setRecentOrders(recentOrders);
      }

      let averageRating = 0;
      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json();
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        }
      }

      // Calculate completed today
      const today = new Date();
      const completedToday = recentOrders.filter(order => {
        if (!order.delivery_time) return false;
        const orderDate = new Date(order.delivery_time);
        return orderDate.toDateString() === today.toDateString();
      }).length;

      setStats({
        totalDeliveries,
        averageRating,
        completedToday,
      });
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Your delivery performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Total Deliveries</p>
              <p className="text-3xl font-bold">{stats.totalDeliveries}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Average Rating</p>
              <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Completed Today</p>
              <p className="text-3xl font-bold">{stats.completedToday}</p>
            </div>
            <Clock className="h-12 w-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Deliveries</h2>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No deliveries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.delivery_address || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${order.total_price?.toFixed(2) || '0.00'}</p>
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 bg-green-100 text-green-800">
                      Delivered
                    </span>
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

export default AgentDashboard;

