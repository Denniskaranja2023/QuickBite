import { useState } from 'react';
import {
  ShoppingCart,
  Users,
  Trash2,
  CheckCircle,
  XCircle,
  PackageCheck,
  PackageX,
  Clock,
  X,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function RestaurantOrdersPage() {
  const [assigningOrderId, setAssigningOrderId] = useState(null);

  const [agents] = useState([
    {
      id: 1,
      name: 'David Martinez',
      email: 'david.m@delivery.com',
      contact: '+254 701 234 567',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
    {
      id: 2,
      name: 'Sophie Taylor',
      email: 'sophie.t@delivery.com',
      contact: '+254 702 345 678',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    {
      id: 3,
      name: 'Kevin Wilson',
      email: 'kevin.w@delivery.com',
      contact: '+254 703 456 789',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: {
        name: 'Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      },
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 1200 },
        { name: 'Pepperoni Pizza', quantity: 1, price: 1500 },
      ],
      totalPrice: 3900,
      time: '2026-01-14 14:30',
      status: 'unassigned',
      assignedAgent: null,
    },
    {
      id: 2,
      customer: {
        name: 'Michael Chen',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      items: [
        { name: 'BBQ Chicken Pizza', quantity: 1, price: 1600 },
        { name: 'Hawaiian Pizza', quantity: 1, price: 1400 },
      ],
      totalPrice: 3000,
      time: '2026-01-14 13:15',
      status: 'assigned',
      assignedAgent: {
        id: 1,
        name: 'David Martinez',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      },
    },
    {
      id: 3,
      customer: {
        name: 'Emily Williams',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      items: [
        { name: 'Veggie Supreme', quantity: 3, price: 1300 },
      ],
      totalPrice: 3900,
      time: '2026-01-14 12:45',
      status: 'delivered',
      assignedAgent: {
        id: 2,
        name: 'Sophie Taylor',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      },
    },
    {
      id: 4,
      customer: {
        name: 'James Brown',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      items: [
        { name: 'Meat Lovers', quantity: 2, price: 1800 },
      ],
      totalPrice: 3600,
      time: '2026-01-14 11:20',
      status: 'unassigned',
      assignedAgent: null,
    },
    {
      id: 5,
      customer: {
        name: 'Lisa Anderson',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      },
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 1200 },
        { name: 'Veggie Supreme', quantity: 1, price: 1300 },
        { name: 'Pepperoni Pizza', quantity: 1, price: 1500 },
      ],
      totalPrice: 4000,
      time: '2026-01-14 10:00',
      status: 'assigned',
      assignedAgent: {
        id: 3,
        name: 'Kevin Wilson',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      },
    },
  ]);

  const handleAssignAgent = (orderId, agentId) => {
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: 'assigned',
                assignedAgent: {
                  id: agent.id,
                  name: agent.name,
                  image: agent.image,
                },
              }
            : order
        )
      );
      setAssigningOrderId(null);
      alert(`Order assigned to ${agent.name} successfully!`);
    }
  };

  const handleDeleteOrder = (orderId, customerName) => {
    if (window.confirm(`Are you sure you want to delete the order from ${customerName}?`)) {
      setOrders(orders.filter((order) => order.id !== orderId));
      alert('Order deleted successfully!');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Orders Management</h2>
        <p className="text-gray-600">Track and manage all orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-6 h-6 text-[#F20519]" />
            <h3 className="text-2xl font-bold text-[#A60311]">Recent Orders</h3>
          </div>
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-400 mb-2">No orders yet</h4>
            <p className="text-gray-500">Orders will appear here once customers start placing them</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Status Badge */}
              <div
                className={`px-4 py-2 flex items-center justify-between ${
                  order.status === 'delivered'
                    ? 'bg-green-500'
                    : order.status === 'assigned'
                    ? 'bg-blue-500'
                    : 'bg-[#F20519]'
                }`}
              >
                <span className="text-white font-bold text-sm flex items-center gap-2">
                  {order.status === 'delivered' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Delivered
                    </>
                  ) : order.status === 'assigned' ? (
                    <>
                      <PackageCheck className="w-4 h-4" />
                      Assigned
                    </>
                  ) : (
                    <>
                      <PackageX className="w-4 h-4" />
                      Unassigned
                    </>
                  )}
                </span>
                <span className="text-white/90 text-xs">#{order.id}</span>
              </div>

              <div className="p-5">
                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-[#D9895B]">
                    <ImageWithFallback src={order.customer.image} alt={order.customer.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#A60311]">{order.customer.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {order.time}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="mb-4 space-y-2">
                  <h5 className="text-xs font-bold text-[#A60311] mb-2">ORDER ITEMS:</h5>
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-[#F2F2F2] rounded-lg px-3 py-2 flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.quantity}x {item.name}</span>
                      <span className="font-bold text-[#A60311]">KSh {(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total Price */}
                <div className="bg-gradient-to-r from-[#D9895B] to-[#A0653E] rounded-xl px-4 py-3 mb-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold">Total Price:</span>
                    <span className="text-xl font-bold">KSh {order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Assigned Agent Info */}
                {order.assignedAgent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400">
                        <ImageWithFallback src={order.assignedAgent.image} alt={order.assignedAgent.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600">Assigned to:</p>
                        <p className="font-bold text-blue-700 text-sm">{order.assignedAgent.name}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Agent Assignment Modal */}
                {assigningOrderId === order.id && (
                  <div className="mb-4 bg-gradient-to-br from-[#F2F2F2] to-white border-2 border-[#F20519] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-[#A60311] text-sm">Select Delivery Agent:</h5>
                      <button onClick={() => setAssigningOrderId(null)} className="text-gray-500 hover:text-[#F20519]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {agents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => handleAssignAgent(order.id, agent.id)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F20519]/10 transition-colors border border-gray-200"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D9895B]">
                            <ImageWithFallback src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-bold text-[#A60311] text-sm">{agent.name}</p>
                            <p className="text-xs text-gray-500">{agent.contact}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => setAssigningOrderId(order.id === assigningOrderId ? null : order.id)}
                      className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold ${
                        order.status === 'unassigned'
                          ? 'bg-gradient-to-r from-[#F20519] to-[#F20530] text-white hover:from-[#A60311] hover:to-[#F20519]'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      {order.status === 'unassigned' ? 'Assign' : 'Reassign'}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id, order.customer.name)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
