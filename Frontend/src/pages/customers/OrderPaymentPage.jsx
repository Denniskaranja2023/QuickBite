import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, Phone, DollarSign, Loader2 } from 'lucide-react';
import API_BASE_URL from '../../config';

function OrderPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  const [formData, setFormData] = useState({
    payment_method: 'mpesa',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stkStatus, setStkStatus] = useState('');

  useEffect(() => {
    if (order) {
      setFormData(prev => ({ ...prev, amount: order.total_price }));
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setStkStatus('');
    setLoading(true);

    try {
      if (formData.payment_method === 'mpesa') {
        // Initiate M-Pesa STK Push
        const response = await fetch(`${API_BASE_URL}/api/payments/mpesa/stkpush`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            order_id: parseInt(id),
            phone: formData.phone,
            amount: order.total_price,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setStkStatus(data.message || 'STK push sent! Check your phone to complete payment.');
          // Poll for payment status
          pollPaymentStatus();
        } else {
          setError(data.error || 'Failed to initiate payment');
        }
      } else {
        // Cash payment - just record it
        const response = await fetch(`${API_BASE_URL}/api/customer/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            order_id: parseInt(id),
            amount: order.total_price,
            method: 'cash',
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess('Cash payment recorded successfully!');
          setTimeout(() => {
            navigate('/customer/orders');
          }, 2000);
        } else {
          setError(data.error || 'Payment failed');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async () => {
    // Simple polling for payment status
    let attempts = 0;
    const maxAttempts = 10;
    
    const poll = setInterval(async () => {
      attempts++;
      try {
        const response = await fetch(`${API_BASE_URL}/api/customer/orders/${id}`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.payment_status) {
          clearInterval(poll);
          setSuccess('Payment received successfully!');
          setTimeout(() => {
            navigate('/customer/orders');
          }, 2000);
        } else if (attempts >= maxAttempts) {
          clearInterval(poll);
          setStkStatus('Payment pending. Please check your phone and confirm the payment.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Order not found</p>
          <button onClick={() => navigate('/customer/orders')} className="btn-primary">
            Go to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/customer/orders')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Orders</span>
      </button>

      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
        <p className="text-gray-600 mb-8">Order #{order.id}</p>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-3xl font-bold text-primary-600">KSh {order.total_price?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Delivery Address: {order.delivery_address}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <label
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.payment_method === 'mpesa'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="mpesa"
                  checked={formData.payment_method === 'mpesa'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-5 h-5 text-primary-500"
                />
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <span className="font-medium">M-Pesa</span>
                  <p className="text-sm text-gray-500">Pay via STK push on your phone</p>
                </div>
              </label>
              
              <label
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.payment_method === 'cash'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cash"
                  checked={formData.payment_method === 'cash'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-5 h-5 text-primary-500"
                />
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <span className="font-medium">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">Pay when your order arrives</p>
                </div>
              </label>
            </div>
          </div>

          {/* Phone Number for M-Pesa */}
          {formData.payment_method === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="254712345678"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          {/* Status Messages */}
          {stkStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                <p className="font-medium text-blue-800">Processing...</p>
              </div>
              <p className="text-sm text-blue-700">{stkStatus}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="font-medium text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/customer/orders')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (formData.payment_method === 'mpesa' && !formData.phone)}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>
                    {formData.payment_method === 'mpesa' 
                      ? `Pay KSh ${order.total_price?.toFixed(2) || '0.00'} via M-Pesa` 
                      : `Confirm Cash Payment`
                    }
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderPaymentPage;

