import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ArrowRight } from 'lucide-react';

function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, cart, menuItems } = location.state || {};
  const [formData, setFormData] = useState({
    delivery_address: '',
    payment_method: 'mpesa',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateTotal = () => {
    if (!cart || !menuItems) return 0;
    return cart.reduce((total, item) => {
      const menuItem = menuItems.find(m => m.id === item.menu_item_id);
      return total + (menuItem?.unit_price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/customer/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurant_id: restaurant?.id,
          menu_items: cart,
          delivery_address: formData.delivery_address,
          total_price: calculateTotal(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/customer/order/${data.id}/payment`, { state: { order: data, payment_method: formData.payment_method } });
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurant || !cart) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No order data found</p>
          <button onClick={() => navigate('/customer/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Place Your Order</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Summary */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => {
              const menuItem = menuItems.find(m => m.id === item.menu_item_id);
              if (!menuItem) return null;
              return (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{menuItem.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(menuItem.unit_price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span>Delivery Address</span>
          </h2>
          <textarea
            required
            value={formData.delivery_address}
            onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
            className="input-field"
            rows="3"
            placeholder="Enter your delivery address"
          />
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span>Payment Method</span>
          </h2>
          <div className="space-y-3">
            {['mpesa', 'card', 'cash'].map((method) => (
              <label
                key={method}
                className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.payment_method === method
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method}
                  checked={formData.payment_method === method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-5 h-5 text-primary-500"
                />
                <span className="font-medium capitalize">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading || !formData.delivery_address}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlaceOrderPage;

