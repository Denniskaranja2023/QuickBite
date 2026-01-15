import { useState } from 'react';
import { Package } from 'lucide-react';

export function AgentDashboard() {
  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      address: '123 Main Street, Apartment 4B, Nairobi',
      contact: '0722123456',
      items: ['Grilled Chicken Burger', 'French Fries', 'Coke'],
      paymentExpected: 1250,
      status: 'undelivered'
    },
    {
      id: '2',
      customerName: 'Michael Ochieng',
      customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      address: '456 Kimathi Avenue, Westlands, Nairobi',
      contact: '0733987654',
      items: ['Margherita Pizza', 'Garlic Bread'],
      paymentExpected: 1800,
      status: 'undelivered'
    },
    {
      id: '3',
      customerName: 'Grace Wanjiru',
      customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      address: '789 Ngong Road, Karen, Nairobi',
      contact: '0711234567',
      items: ['Beef Stir Fry', 'Fried Rice', 'Spring Rolls'],
      paymentExpected: 1950,
      status: 'delivered',
      deliveryTime: '2026-01-14 11:30 AM'
    },
    {
      id: '4',
      customerName: 'David Kamau',
      customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      address: '321 Mombasa Road, Industrial Area, Nairobi',
      contact: '0744556677',
      items: ['Fish and Chips', 'Coleslaw'],
      paymentExpected: 1100,
      status: 'delivered',
      deliveryTime: '2026-01-14 10:15 AM'
    },
    {
      id: '5',
      customerName: 'Amina Hassan',
      customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      address: '654 Waiyaki Way, Parklands, Nairobi',
      contact: '0755443322',
      items: ['Chicken Biryani', 'Naan Bread', 'Mango Lassi'],
      paymentExpected: 2100,
      status: 'undelivered'
    }
  ]);

  const markAsDelivered = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status: 'delivered', 
              deliveryTime: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            }
          : order
      )
    );
  };

  const undeliveredOrders = orders.filter(order => order.status === 'undelivered');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">My Deliveries</h1>
        <p className="text-gray-600">Manage your delivery orders and track your performance</p>
      </div>

      {/* Undelivered Orders Section */}
      <div>
        <h2 className="text-gray-900 mb-4">Active Orders ({undeliveredOrders.length})</h2>
        {undeliveredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No active orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {undeliveredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#F20519]">
                {/* Customer Info */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={order.customerImage}
                    alt={order.customerName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{order.customerName}</h3>
                    <p className="text-sm text-gray-600">{order.contact}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                </div>

                {/* Items Ordered */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Items Ordered:</p>
                  <ul className="space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-[#F20519] mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-700">
                    Payment Expected: <span className="font-semibold text-[#F20519]">KSh {order.paymentExpected.toLocaleString()}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
                    Undelivered
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => markAsDelivered(order.id)}
                  className="w-full bg-[#F20519] text-white py-2 rounded-lg hover:bg-[#A60311] transition-colors"
                >
                  Mark as Delivered
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delivered Orders Table */}
      <div>
        <h2 className="text-gray-900 mb-4">Delivered Orders ({deliveredOrders.length})</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F20519] text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Customer Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Time of Delivery</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Payment Expected</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Items Ordered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No delivered orders yet
                    </td>
                  </tr>
                ) : (
                  deliveredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.deliveryTime}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#F20519]">
                        KSh {order.paymentExpected.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.items.join(', ')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
