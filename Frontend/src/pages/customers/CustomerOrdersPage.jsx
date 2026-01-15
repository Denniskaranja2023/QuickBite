import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Calendar,
  CreditCard,
  Ban,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function CustomerOrdersPage() {
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [ordersList, setOrdersList] = useState([
    {
      id: 'ORD-001',
      restaurant: {
        name: 'Pizza Paradise',
        logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?w=400',
      },
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 1200 },
        { name: 'Pepperoni Pizza', quantity: 1, price: 1500 },
      ],
      total: 4100,
      status: 'delivered',
      date: '2026-01-14',
      deliveryAddress: '123 Main Street, Nairobi',
      phone: '+254 712 345 678',
    },
    {
      id: 'ORD-002',
      restaurant: {
        name: 'Burger House',
        logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      },
      items: [
        { name: 'Classic Burger', quantity: 1, price: 800 },
        { name: 'Cheese Burger', quantity: 2, price: 950 },
      ],
      total: 2900,
      status: 'pending',
      date: '2026-01-15',
      deliveryAddress: '456 Oak Avenue, Nairobi',
      phone: '+254 712 345 678',
    },
    {
      id: 'ORD-003',
      restaurant: {
        name: 'Sushi Master',
        logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      items: [{ name: 'California Roll', quantity: 3, price: 1200 }],
      total: 3800,
      status: 'delivered',
      date: '2026-01-13',
      deliveryAddress: '789 Palm Drive, Nairobi',
      phone: '+254 712 345 678',
    },
    {
      id: 'ORD-004',
      restaurant: {
        name: 'Taco Fiesta',
        logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      items: [{ name: 'Beef Tacos', quantity: 4, price: 600 }],
      total: 2600,
      status: 'pending',
      date: '2026-01-15',
      deliveryAddress: '321 Sunset Blvd, Nairobi',
      phone: '+254 712 345 678',
    },
    {
      id: 'ORD-005',
      restaurant: {
        name: 'Indian Spice',
        logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      },
      items: [
        { name: 'Chicken Tikka Masala', quantity: 1, price: 1400 },
        { name: 'Naan Bread', quantity: 2, price: 300 },
      ],
      total: 2200,
      status: 'cancelled',
      date: '2026-01-12',
      deliveryAddress: '555 River Road, Nairobi',
      phone: '+254 712 345 678',
    },
  ]);

  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const filteredOrders = ordersList.filter((order) =>
    selectedStatus === 'all' ? true : order.status === selectedStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const statusCounts = {
    all: ordersList.length,
    pending: ordersList.filter((o) => o.status === 'pending').length,
    delivered: ordersList.filter((o) => o.status === 'delivered').length,
    cancelled: ordersList.filter((o) => o.status === 'cancelled').length,
  };

  const handleCancelOrder = (orderId) => {
    setCancellingOrderId(orderId);
  };

  const confirmCancelOrder = () => {
    if (cancellingOrderId) {
      setOrdersList(
        ordersList.map((order) =>
          order.id === cancellingOrderId ? { ...order, status: 'cancelled' } : order
        )
      );
      setCancellingOrderId(null);
    }
  };

  const dismissCancelDialog = () => {
    setCancellingOrderId(null);
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">My Orders</h2>
        <p className="text-gray-600">Track and manage all your food orders</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['all', 'pending', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-[#F20519] to-[#F20530] text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {{
                all: <Package className="w-6 h-6 mx-auto mb-2" />,
                pending: <Clock className="w-6 h-6 mx-auto mb-2" />,
                delivered: <CheckCircle className="w-6 h-6 mx-auto mb-2" />,
                cancelled: <XCircle className="w-6 h-6 mx-auto mb-2" />,
              }[status]}
              <p className="font-bold">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
              <p className="text-sm">{statusCounts[status]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                    <ImageWithFallback
                      src={order.restaurant.logo}
                      alt={order.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{order.restaurant.name}</h3>
                    <p className="text-sm text-white/80">Order #{order.id}</p>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="font-bold capitalize">{order.status}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-[#A60311] mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t flex justify-between">
                    <span className="font-bold text-[#A60311]">Total:</span>
                    <span className="font-bold text-[#F20519] text-lg">
                      KSh {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Delivery Details */}
                <div>
                  <h4 className="font-bold text-[#A60311] mb-3">Delivery Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-[#F20519] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Order Date</p>
                        <p className="font-bold">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#F20519] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="font-bold">{order.deliveryAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#F20519] mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Contact Number</p>
                        <p className="font-bold">{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay / Cancel Buttons */}
              {order.status === 'pending' && (
                <div className="mt-6 pt-6 border-t">
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() =>
                        navigate(`/customer/order/${order.id}/payment`, { state: { order } })
                      }
                      className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay for Order - KSh {order.total.toLocaleString()}
                    </button>
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="w-full bg-white border-2 border-[#F20519] text-[#F20519] py-4 rounded-xl hover:bg-[#F20519] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-bold"
                    >
                      <Ban className="w-5 h-5" />
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {selectedStatus === 'all'
                ? "You haven't placed any orders yet"
                : `No ${selectedStatus} orders`}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Dialog */}
      {cancellingOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-96">
            <h3 className="text-xl font-bold text-[#A60311] mb-4">Confirm Cancel Order</h3>
            <p className="text-gray-600">Are you sure you want to cancel this order?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={dismissCancelDialog}
                className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancelOrder}
                className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-2 px-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
