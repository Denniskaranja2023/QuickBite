import { useState, useEffect } from 'react';
import { ShoppingBag, User, Trash2, CheckCircle, XCircle, MapPin, Clock, DollarSign, Package, RefreshCw } from 'lucide-react';
import ImageWithFallback from '../../components/ImageWithFallback';
import API_BASE_URL from '../../config';

function RestaurantOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState('unassigned');

  useEffect(() => {
    fetchOrders();
    fetchAgents();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurant/orders`, {
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
      const response = await fetch(`${API_BASE_URL}/api/restaurant/agents`, {
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
      const response = await fetch(`${API_BASE_URL}/api/restaurant/orders/${orderId}`, {
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
    if (!window.confirm('Are you sure you want to cancel and delete this order?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurant/orders/${orderId}`, {
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

  // Categorize orders
  const unassignedOrders = orders.filter(order => !order.delivery_agent_id);
  const assignedOrders = orders.filter(order => order.delivery_agent_id && !order.delivery_time);
  const deliveredOrders = orders.filter(order => order.delivery_agent_id && order.delivery_time);

  const getOrderCount = (tab) => {
    switch (tab) {
      case 'unassigned': return unassignedOrders.length;
      case 'assigned': return assignedOrders.length;
      case 'delivered': return deliveredOrders.length;
      default: return 0;
    }
  };

  const renderOrderCard = (order) => {
    const isUnassigned = !order.delivery_agent_id;
    const isAssigned = order.delivery_agent_id && !order.delivery_time;
    const isDelivered = order.delivery_agent_id && order.delivery_time;

    return (
      <div
        key={order.id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        {/* Header with customer info */}
        <div className="bg-gradient-to-r from-primary-50 to-white px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ImageWithFallback
                  src={order.customer?.image}
                  alt={order.customer?.name || 'Customer'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  #{order.id}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {order.customer?.name || `Customer #${order.customer_id}`}
                </h3>
                <p className="text-sm text-gray-500">{order.customer?.contact || 'No contact'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  order.payment_status
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.payment_status ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Paid
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Pending
                  </>
                )}
              </span>
              
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isUnassigned
                    ? 'bg-red-100 text-red-800'
                    : isAssigned
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {isUnassigned && 'Unassigned'}
                {isAssigned && 'Assigned'}
                {isDelivered && 'Delivered'}
              </span>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <Package className="h-4 w-4 mr-1" />
              Ordered Items
            </h4>
            <div className="space-y-2">
              {order.menu_items && order.menu_items.length > 0 ? (
                <>
                  {order.menu_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {item.quantity}×
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-400">KSh {item.unit_price?.toFixed(2)} each</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        KSh {(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {/* Items Subtotal */}
                  <div className="flex items-center justify-between py-2 px-3 bg-primary-50 rounded-lg mt-3 border border-primary-100">
                    <span className="text-sm font-medium text-primary-800">Items Total</span>
                    <span className="text-lg font-bold text-primary-700">
                      KSh {order.menu_items.reduce((sum, item) => sum + (item.unit_price * (item.quantity || 1)), 0).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No items</p>
              )}
            </div>
          </div>

          {/* Order details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Ordered</p>
                <p className="font-medium text-gray-900">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-500">Delivery</p>
                <p className="font-medium text-gray-900 truncate">{order.delivery_address || 'N/A'}</p>
              </div>
            </div>
            
            {order.delivery_agent && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-500">Agent</p>
                  <p className="font-medium text-gray-900">{order.delivery_agent.name}</p>
                </div>
              </div>
            )}
            
            {order.delivery_time && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-gray-500">Delivered</p>
                  <p className="font-medium text-gray-900">
                    {new Date(order.delivery_time).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with total and actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-5 w-5 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                KSh {order.total_price?.toFixed(2) || '0.00'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {(isUnassigned || isAssigned) && (
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowAssignModal(true);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isUnassigned
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isUnassigned ? (
                    <>
                      <User className="h-4 w-4" />
                      <span>Assign</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Reassign</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersSection = (title, orderList, icon) => {
    const Icon = icon;
    return (
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Icon className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <span className="bg-gray-200 text-gray-700 text-sm px-2 py-0.5 rounded-full">
            {orderList.length}
          </span>
        </div>
        
        {orderList.length === 0 ? (
          <div className="card text-center py-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders in this category</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orderList.map(renderOrderCard)}
          </div>
        )}
      </div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all restaurant orders</p>
      </div>

      {/* Tab navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6">
        {[
          { id: 'unassigned', label: 'Unassigned', icon: User, count: unassignedOrders.length },
          { id: 'assigned', label: 'Assigned', icon: RefreshCw, count: assignedOrders.length },
          { id: 'delivered', label: 'Delivered', icon: CheckCircle, count: deliveredOrders.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render orders based on active tab */}
      {activeTab === 'unassigned' && renderOrdersSection('Unassigned Orders', unassignedOrders, User)}
      {activeTab === 'assigned' && renderOrdersSection('Assigned Orders', assignedOrders, RefreshCw)}
      {activeTab === 'delivered' && renderOrdersSection('Delivered Orders', deliveredOrders, CheckCircle)}

      {/* Show all sections when no tab is selected */}
      {!activeTab && (
        <>
          {renderOrdersSection('Unassigned Orders', unassignedOrders, User)}
          {renderOrdersSection('Assigned Orders', assignedOrders, RefreshCw)}
          {renderOrdersSection('Delivered Orders', deliveredOrders, CheckCircle)}
        </>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedOrder.delivery_agent_id ? 'Reassign Agent' : 'Assign Agent'}
            </h2>
            <p className="text-gray-600 mb-6">
              Select an agent for order #{selectedOrder.id}
            </p>
            
            {selectedOrder.customer && (
              <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={selectedOrder.customer.image}
                  alt={selectedOrder.customer.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customer.contact}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {agents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No agents available</p>
              ) : (
                agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleAssignAgent(selectedOrder.id, agent.id)}
                    className={`w-full text-left p-4 border-2 rounded-lg hover:transition-all duration-200 flex items-center space-x-3 ${
                      selectedOrder.delivery_agent_id === agent.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    <ImageWithFallback
                      src={agent.image}
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.contact}</p>
                    </div>
                    {selectedOrder.delivery_agent_id === agent.id && (
                      <CheckCircle className="h-5 w-5 text-primary-600" />
                    )}
                  </button>
                ))
              )}
            </div>
            
            <button
              onClick={() => {
                setShowAssignModal(false);
                setSelectedOrder(null);
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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

