import { useState, useEffect } from 'react';
import { ShoppingBag, User, Trash2, CheckCircle, XCircle } from 'lucide-react';

function RestaurantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/restaurant/orders', {
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

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/restaurant/agents', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAgents(data);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    try {
      const response = await fetch(`/api/restaurant/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ delivery_agent_id: agentId }),
      });

      if (response.ok) {
        fetchOrders();
        setShowAssignModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to assign agent:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/restaurant/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage all orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.payment_status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.payment_status ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Pending
                        </>
                      )}
                    </span>
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
                    <div>
                      <p className="font-medium text-gray-700">Agent</p>
                      <p>{order.delivery_agent_id ? `Agent #${order.delivery_agent_id}` : 'Unassigned'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-6">
                  {!order.delivery_agent_id && (
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowAssignModal(true);
                      }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Assign Agent</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Assign Delivery Agent</h2>
            <p className="text-gray-600 mb-6">Select an agent for Order #{selectedOrder.id}</p>
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {agents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No agents available</p>
              ) : (
                agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAssignAgent(selectedOrder.id, agent.id)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                  >
                    <p className="font-semibold text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.contact}</p>
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedOrder(null);
              }}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantOrdersPage;

