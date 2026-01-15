import { useState } from 'react';
import { Hash, Calendar, DollarSign, CreditCard, Trash2 } from 'lucide-react';

export function AdminPaymentsPage() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      orderId: 'ORD-2025-0158',
      customer: 'Sarah Johnson',
      restaurant: 'Pizza Paradise',
      amount: 1580.5,
      method: 'M-Pesa',
      date: '2025-01-14 14:30',
    },
    {
      id: 2,
      orderId: 'ORD-2025-0157',
      customer: 'Michael Chen',
      restaurant: 'Sushi Station',
      amount: 2340.0,
      method: 'Card',
      date: '2025-01-14 13:15',
    },
    {
      id: 3,
      orderId: 'ORD-2025-0156',
      customer: 'Emily Williams',
      restaurant: 'Burger Hub',
      amount: 950.25,
      method: 'M-Pesa',
      date: '2025-01-14 12:45',
    },
    {
      id: 4,
      orderId: 'ORD-2025-0155',
      customer: 'James Brown',
      restaurant: 'Italian Bistro',
      amount: 1720.75,
      method: 'Card',
      date: '2025-01-14 11:20',
    },
    {
      id: 5,
      orderId: 'ORD-2025-0154',
      customer: 'Lisa Anderson',
      restaurant: 'The Food Court',
      amount: 750.0,
      method: 'M-Pesa',
      date: '2025-01-14 10:50',
    },
    {
      id: 6,
      orderId: 'ORD-2025-0153',
      customer: 'David Martinez',
      restaurant: 'Pizza Paradise',
      amount: 1200.25,
      method: 'Card',
      date: '2025-01-13 18:30',
    },
    {
      id: 7,
      orderId: 'ORD-2025-0152',
      customer: 'Sophia Taylor',
      restaurant: 'Burger Hub',
      amount: 890.0,
      method: 'M-Pesa',
      date: '2025-01-13 17:15',
    },
    {
      id: 8,
      orderId: 'ORD-2025-0151',
      customer: 'Robert Wilson',
      restaurant: 'Sushi Station',
      amount: 2150.5,
      method: 'Card',
      date: '2025-01-13 16:00',
    },
  ]);

  const handleDeletePayment = (id, orderId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete payment record for ${orderId}? This action cannot be undone.`
    );

    if (confirmed) {
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== id)
      );
    }
  };

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Payments</h2>
        <p className="text-gray-600">Track all payments across the platform</p>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-6 text-white shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-8 h-8" />
          <h3 className="text-xl">Total Revenue</h3>
        </div>
        <p className="text-4xl font-bold">
          KSh {totalRevenue.toLocaleString()}
        </p>
        <p className="text-white/80 mt-2">
          From {payments.length} transactions
        </p>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-mono text-[#F20519]">
                      <Hash className="w-4 h-4" />
                      {payment.orderId}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {payment.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {payment.restaurant}
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-green-700">
                    KSh {payment.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        payment.method === 'M-Pesa'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      {payment.method}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {payment.date}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleDeletePayment(payment.id, payment.orderId)
                      }
                      className="text-[#F20519] hover:text-[#A60311] transition-colors p-2 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
