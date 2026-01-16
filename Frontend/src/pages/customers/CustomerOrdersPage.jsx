import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, XCircle, ArrowRight, CreditCard, Trash2, Package, Star } from 'lucide-react';
import ImageWithFallback from '../../components/ImageWithFallback';
import API_BASE_URL from '../../config';

function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.success || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Clear messages when leaving the page
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setErrorMessage('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setSuccessMessage('Order cancelled successfully');
        // Remove the cancelled order from the list
        setOrders(orders.filter(o => o.id !== orderId));
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      setErrorMessage('Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const getDeliveryStatus = (order) => {
    if (order.delivery_time) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-4 w-4 mr-1" />
        Undelivered
      </span>
    );
  };

  const getPaymentStatus = (order) => {
    if (order.payment_status) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
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

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <p className="font-medium text-green-800">Success!</p>
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <XCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

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
              {/* Restaurant Header */}
              {order.restaurant && (
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 mb-4">
                  <ImageWithFallback
                    src={order.restaurant.logo}
                    alt={order.restaurant.name}
                    className="w-12 h-12 rounded-full object-cover"
                    fallbackSrc="https://via.placeholder.com/48?text=Restaurant"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{order.restaurant.name}</h3>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Menu Items */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Ordered Items
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {order.menu_items && order.menu_items.length > 0 ? (
                      <div className="space-y-2">
                        {order.menu_items.map((item, index) => (
                          <div key={item.id || index} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">
                                {item.quantity > 1 && `${item.quantity}x `}
                                {item.name}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              KSh {(item.unit_price * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No items in this order</p>
                    )}
                  </div>
                  
                  {/* Delivery Address */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h4>
                    <p className="text-gray-700">{order.delivery_address || 'N/A'}</p>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      {getDeliveryStatus(order)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payment</span>
                      {getPaymentStatus(order)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Date</span>
                      <span className="text-sm text-gray-700">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        KSh {order.total_price?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    {order.delivery_time && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          Delivered: {new Date(order.delivery_time).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {!order.payment_status && (
                      <Link
                        to={`/customer/order/${order.id}/payment`}
                        state={{ order }}
                        className="btn-primary flex items-center space-x-2 flex-1 justify-center"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Pay Now</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    
                    {/* Review Restaurant Button - Only for delivered orders */}
                    {order.delivery_time && order.restaurant && (
                      <Link
                        to={`/customer/review/restaurant/${order.restaurant.id}`}
                        state={{ orderId: order.id }}
                        className="btn-secondary flex items-center space-x-2 flex-1 justify-center"
                      >
                        <Star className="h-4 w-4" />
                        <span>Rate Restaurant</span>
                      </Link>
                    )}
                    
                    {/* Review Delivery Agent Button - Only for delivered orders with agent */}
                    {order.delivery_time && order.delivery_agent_id && (
                      <Link
                        to={`/customer/review/agent/${order.delivery_agent_id}`}
                        state={{ orderId: order.id }}
                        className="btn-secondary flex items-center space-x-2 flex-1 justify-center"
                      >
                        <Star className="h-4 w-4" />
                        <span>Rate Delivery</span>
                      </Link>
                    )}
                    
                    {/* Cancel Order Button - Only for undelivered orders */}
                    {!order.delivery_time && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        title="Cancel Order"
                      >
                        {cancellingOrder === order.id ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
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

