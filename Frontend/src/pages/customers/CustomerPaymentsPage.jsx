import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Building } from 'lucide-react';
import ImageWithFallback from '../../components/ImageWithFallback';
import API_BASE_URL from '../../config';

// Currency formatter for KSh
const formatCurrency = (amount) => {
  return `KSh ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function CustomerPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/payments`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
        const total = data.reduce((sum, p) => sum + (p.amount || 0), 0);
        const thisMonth = data
          .filter(p => {
            const paymentDate = new Date(p.created_at);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + (p.amount || 0), 0);
        setStats({ total, thisMonth });
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Payments</h1>
        <p className="text-gray-600">View your payment history</p>
      </div>

      {/* Stats Cards - Customer specific */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Spent</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.total)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.thisMonth)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-200" />
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="card">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Restaurant</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {payment.restaurant_logo ? (
                          <ImageWithFallback
                            src={payment.restaurant_logo}
                            alt={payment.restaurant_name}
                            className="w-8 h-8 rounded-full object-cover"
                            fallbackSrc="https://via.placeholder.com/32?text=R"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">
                          {payment.restaurant_name || 'Unknown Restaurant'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold">{formatCurrency(payment.amount)}</td>
                    <td className="py-4 px-4 capitalize">{payment.method || 'N/A'}</td>
                    <td className="py-4 px-4">#{payment.order_id || 'N/A'}</td>
                    <td className="py-4 px-4">
                      {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
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

export default CustomerPaymentsPage;

