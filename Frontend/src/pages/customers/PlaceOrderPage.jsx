import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Phone,
  User,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function PlaceOrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state; // no TS cast

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    phone: '+254 712 345 678',
    address: '',
    city: 'Nairobi',
    deliveryInstructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!state || !state.cart || state.cart.length === 0) {
    navigate('/customer/dashboard');
    return null;
  }

  const { cart, restaurant, totalPrice } = state;
  const deliveryFee = 200;
  const grandTotal = totalPrice + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order submission
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate('/customer/orders');
      }, 3000);
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-500 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#A60311] mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your order has been confirmed and will be delivered soon.
          </p>
          <p className="text-sm text-gray-500">Redirecting to orders page...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Place Your Order</h2>
        <p className="text-gray-600">Fill in your delivery details to complete the order</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-[#A60311] mb-6">Delivery Information</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F20519]" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F20519]" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                  placeholder="+254 712 345 678"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Delivery Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 w-5 h-5 text-[#F20519]" />
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                  placeholder="Enter your delivery address"
                  rows={3}
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Delivery Instructions (Optional)</label>
              <textarea
                value={formData.deliveryInstructions}
                onChange={(e) => setFormData({ ...formData, deliveryInstructions: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                placeholder="Any special instructions for delivery..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Confirm Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8">
          <h3 className="text-2xl font-bold text-[#A60311] mb-6">Order Summary</h3>

          {/* Restaurant Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F20519]">
              <ImageWithFallback
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-[#A60311]">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">Your order from</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h5 className="font-bold text-[#A60311]">{item.name}</h5>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x KSh {item.price.toLocaleString()}
                  </p>
                </div>
                <p className="font-bold text-[#F20519]">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>KSh {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span>KSh {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-[#A60311] pt-3 border-t">
              <span>Total:</span>
              <span className="text-[#F20519]">KSh {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mt-6 bg-gradient-to-br from-[#F2F2F2] to-white p-4 rounded-xl">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-[#A60311]">Payment Method:</span> Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
