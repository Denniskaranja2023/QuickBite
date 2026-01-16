import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Clock, MapPin, User, Phone, CheckCircle, Package } from 'lucide-react';
import API_BASE_URL from '../../config';

function AgentDashboard() {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    averageRating: 0,
    completedToday: 0,
  });
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingDelivery, setMarkingDelivery] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, deliveredRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/agent/pending-orders`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/agent/delivered-orders`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/agent/reviews`, { credentials: 'include' }),
      ]);

      let pending = [];
      let delivered = [];
      let totalDeliveries = 0;

      if (pendingRes.ok) {
        pending = await pendingRes.json();
        setPendingOrders(pending);
      }

      if (deliveredRes.ok) {
        delivered = await deliveredRes.json();
        setDeliveredOrders(delivered);
      }

      totalDeliveries = pending.length + delivered.length;

      let averageRating = 0;
      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json();
        if (reviews.length > 0) {
          averageRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        }
      }

      // Calculate completed today
      const today = new Date();
      const completedToday = delivered.filter(order => {
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

  const markAsDelivered = async (orderId) => {
    setMarkingDelivery(orderId);
    try {
      const deliveryTime = new Date().toISOString();
      const response = await fetch(`${API_BASE_URL}/api/agent/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ delivery_time: deliveryTime }),
      });

      if (response.ok) {
        // Find the order in pending orders and move it to delivered
        const order = pendingOrders.find(o => o.id === orderId);
        if (order) {
          const deliveredOrder = {
            ...order,
            delivery_time: deliveryTime,
          };
          setDeliveredOrders([deliveredOrder, ...deliveredOrders]);
          setPendingOrders(pendingOrders.filter(o => o.id !== orderId));
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalDeliveries: prev.totalDeliveries + 1,
            completedToday: prev.completedToday + 1,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to mark order as delivered:', error);
    } finally {
      setMarkingDelivery(null);
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

      {/* Pending Orders Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Deliveries</h2>
        {pendingOrders.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No pending deliveries</p>
            <p className="text-gray-400 text-sm mt-2">Orders assigned to you will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="card border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                {/* Customer Info Header */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      {order.customer?.image ? (
                        <img
                          src={order.customer.image}
                          alt={order.customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {order.customer?.name || 'Unknown Customer'}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {order.customer?.contact || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Order #{order.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Restaurant Info */}
                {order.restaurant && (
                  <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">From:</span> {order.restaurant.name}
                    </p>
                  </div>
                )}

                {/* Delivery Address */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-600 text-sm mt-1">{order.delivery_address}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered</p>
                  <div className="space-y-2">
                    {order.menu_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        </div>
                        <span className="text-sm text-gray-500">KSh {item.unit_price?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Price and Action */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Payment Expected</p>
                      <p className="text-xl font-bold text-gray-900">KSh {order.total_price?.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => markAsDelivered(order.id)}
                      disabled={markingDelivery === order.id}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markingDelivery === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Marking...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark Delivered</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivered Orders Table */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivered Orders</h2>
        {deliveredOrders.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No delivered orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Time of Delivery</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Payment Expected</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Items Ordered</th>
                </tr>
              </thead>
              <tbody>
                {deliveredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                          {order.customer?.image ? (
                            <img
                              src={order.customer.image}
                              alt={order.customer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-primary-600" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {order.customer?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(order.delivery_time)}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      KSh {order.total_price?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {order.menu_items?.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {item.name}
                          </span>
                        ))}
                        {order.menu_items?.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                            +{order.menu_items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentDashboard;

