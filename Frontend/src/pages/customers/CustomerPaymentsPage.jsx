import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  CreditCard,
} from 'lucide-react';

export function CustomerPaymentsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const payments = [
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      restaurant: 'Pizza Paradise',
      amount: 4100,
      status: 'completed',
      date: '2026-01-14',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      restaurant: 'Burger House',
      amount: 2900,
      status: 'pending',
      date: '2026-01-15',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      restaurant: 'Sushi Master',
      amount: 3800,
      status: 'completed',
      date: '2026-01-13',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      restaurant: 'Taco Fiesta',
      amount: 2600,
      status: 'pending',
      date: '2026-01-15',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'PAY-005',
      orderId: 'ORD-005',
      restaurant: 'Indian Spice',
      amount: 2200,
      status: 'completed',
      date: '2026-01-12',
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'PAY-006',
      orderId: 'ORD-006',
      restaurant: 'Pasta Palace',
      amount: 3500,
      status: 'completed',
      date: '2026-01-10',
      paymentMethod: 'M-Pesa',
    },
    {
      id: 'PAY-007',
      orderId: 'ORD-007',
      restaurant: 'BBQ Station',
      amount: 4200,
      status: 'completed',
      date: '2026-01-08',
      paymentMethod: 'Cash on Delivery',
    },
  ];

  const totalSpent = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = payments.filter((p) => p.status === 'completed').length;

  const getStatusColor = (status) => {
    return status === 'completed'
      ? 'bg-green-100 text-green-700'
      : 'bg-yellow-100 text-yellow-700';
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <CheckCircle className="w-5 h-5" />
    ) : (
      <Clock className="w-5 h-5" />
    );
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Payment History</h2>
        <p className="text-gray-600">Track all your payment transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Spent */}
        <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Total Spent</h3>
          <p className="text-3xl font-bold">KSh {totalSpent.toLocaleString()}</p>
          <p className="text-xs text-white/70 mt-1">All completed payments</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-gradient-to-br from-[#D9895B] to-[#A0653E] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Clock className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Pending Payments</h3>
          <p className="text-3xl font-bold">KSh {pendingPayments.toLocaleString()}</p>
          <p className="text-xs text-white/70 mt-1">Awaiting completion</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-gradient-to-br from-[#A60311] to-[#7A0209] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Completed</h3>
          <p className="text-3xl font-bold">{completedCount}</p>
          <p className="text-xs text-white/70 mt-1">Transactions</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              selectedPeriod === 'all'
                ? 'bg-gradient-to-r from-[#F20519] to-[#F20530] text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              selectedPeriod === 'month'
                ? 'bg-gradient-to-r from-[#F20519] to-[#F20530] text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              selectedPeriod === 'week'
                ? 'bg-gradient-to-r from-[#F20519] to-[#F20530] text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#F20519]" />
            <h3 className="text-2xl font-bold text-[#A60311]">Transaction History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Payment ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Restaurant
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#A60311]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-[#A60311]">{payment.id}</p>
                      <p className="text-xs text-gray-500">{payment.orderId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">{payment.restaurant}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#F20519]">
                      KSh {payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {payment.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="text-sm font-bold capitalize">{payment.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#F20519] hover:text-[#A60311] transition-colors">
                      <Download className="w-5 h-5" />
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
