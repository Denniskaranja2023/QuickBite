import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, ArrowRight, Eye } from 'lucide-react';

function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/customer/orders', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (order) => {
    if (order.payment_status) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-4 w-4 mr-1" />
        Pending Payment
      </span>
    );
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">View and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No orders yet</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <span>Browse Restaurants</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    {getStatusBadge(order)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700">Date</p>
                      <p>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Total</p>
                      <p className="font-semibold text-gray-900">${order.total_price?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Delivery Address</p>
                      <p className="truncate">{order.delivery_address || 'N/A'}</p>
                    </div>
                    {order.delivery_time && (
                      <div>
                        <p className="font-medium text-gray-700">Delivery Time</p>
                        <p>{new Date(order.delivery_time).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-6">
                  {!order.payment_status && (
                    <Link
                      to={`/customer/order/${order.id}/payment`}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Pay Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    to={`/customer/orders/${order.id}`}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerOrdersPage;

