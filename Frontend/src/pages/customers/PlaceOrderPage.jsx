import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../../config';

function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurant, cart, menuItems } = location.state || {};
  const [formData, setFormData] = useState({
    delivery_address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle both old format (menu_item_id only) and new format (full item details)
  const cartItems = cart || [];

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.unit_price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurant_id: restaurant?.id,
          menu_item_ids: cartItems.map(item => item.menu_item_id || item.id),
          delivery_address: formData.delivery_address,
          total_price: calculateTotal(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to My Orders page after successful order placement
        navigate('/customer/orders', { 
          state: { 
            success: 'Order placed successfully! Please complete payment.',
            orderId: data.id 
          } 
        });
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
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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
        {/* Restaurant Info */}
        <div className="card bg-gradient-to-br from-primary-50 to-accent-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-md">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <span className="text-3xl">🍽️</span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
              <p className="text-gray-600">{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span>Order Summary</span>
          </h2>
          <div className="space-y-4 mb-6">
            {cartItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl">🍔</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name || `Item ${item.menu_item_id}`}</p>
                    <p className="text-sm text-gray-600">KSh {item.unit_price?.toFixed(2)} × {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-primary-600">KSh {(item.unit_price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-dashed border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold text-gray-700">Total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span className="text-3xl font-bold text-primary-600">KSh {calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-red-500" />
            <span>Delivery Address</span>
          </h2>
          <textarea
            required
            value={formData.delivery_address}
            onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
            className="input-field"
            rows="3"
            placeholder="Enter your full delivery address including landmarks..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowRight className="h-5 w-5 rotate-180" />
            <span>Back to Menu</span>
          </button>
          <button
            type="submit"
            disabled={loading || !formData.delivery_address}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
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

