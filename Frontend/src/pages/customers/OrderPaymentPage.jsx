import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  ShoppingCart,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function OrderPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const state = location.state; // no TS cast

  const [selectedMethod, setSelectedMethod] = useState(null); // 'mpesa' | 'cash' | null removed
  const [mpesaPhone, setMpesaPhone] = useState('+254 712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!state || !state.order) {
    navigate('/customer/orders');
    return null;
  }

  const order = state.order;

  // Mock restaurant paybill data
  const restaurantPaybill = {
    paybill: '247247',
    accountNumber: order.id,
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate('/customer/orders');
      }, 3000);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-500 to-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#A60311] mb-2">
            {selectedMethod === 'mpesa' ? 'Payment Initiated!' : 'Payment Confirmed!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {selectedMethod === 'mpesa'
              ? 'Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.'
              : 'Your cash payment has been recorded. Please have the exact amount ready for the delivery agent.'}
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
          onClick={() => navigate('/customer/orders')}
          className="flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Orders
        </button>
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Payment Options</h2>
        <p className="text-gray-600">Choose your preferred payment method</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="space-y-6">
          {/* M-Pesa STK Push */}
          <div
            onClick={() => setSelectedMethod('mpesa')}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${
              selectedMethod === 'mpesa'
                ? 'ring-4 ring-[#F20519] scale-105'
                : 'hover:shadow-xl'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#A60311] mb-2">M-Pesa STK Push</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pay instantly using M-Pesa. You'll receive a prompt on your phone to complete the payment.
                </p>
                {selectedMethod === 'mpesa' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-bold text-[#A60311] mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                        placeholder="+254 712 345 678"
                      />
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-bold text-green-800 mb-2">Payment Details</h4>
                      <div className="space-y-1 text-sm text-green-700">
                        <p><span className="font-bold">Paybill:</span> {restaurantPaybill.paybill}</p>
                        <p><span className="font-bold">Account Number:</span> {restaurantPaybill.accountNumber}</p>
                        <p><span className="font-bold">Amount:</span> KSh {order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cash Payment */}
          <div
            onClick={() => setSelectedMethod('cash')}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${
              selectedMethod === 'cash'
                ? 'ring-4 ring-[#F20519] scale-105'
                : 'hover:shadow-xl'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-[#D9895B] to-[#A0653E] p-4 rounded-xl">
                <Banknote className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#A60311] mb-2">Cash on Delivery</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pay with cash when your order arrives. Please have the exact amount ready for the delivery agent.
                </p>
                {selectedMethod === 'cash' && (
                  <div className="bg-orange-50 p-4 rounded-xl mt-4">
                    <h4 className="font-bold text-orange-800 mb-2">Important</h4>
                    <ul className="space-y-1 text-sm text-orange-700 list-disc list-inside">
                      <li>Have exact change ready (KSh {order.total.toLocaleString()})</li>
                      <li>Payment is due upon delivery</li>
                      <li>Delivery agent will provide receipt</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirm Payment Button */}
          {selectedMethod && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {selectedMethod === 'mpesa' ? 'Send M-Pesa Prompt' : 'Confirm Cash Payment'}
                </>
              )}
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-8">
          <h3 className="text-2xl font-bold text-[#A60311] mb-6">Order Summary</h3>

          {/* Restaurant Info */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F20519]">
              <ImageWithFallback
                src={order.restaurant.logo}
                alt={order.restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-[#A60311]">{order.restaurant.name}</h4>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6 pb-6 border-b">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-[#A60311]">
                  KSh {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-xl font-bold mb-6">
            <span className="text-[#A60311]">Total Amount:</span>
            <span className="text-[#F20519]">KSh {order.total.toLocaleString()}</span>
          </div>

          {/* Delivery Address */}
          <div className="bg-gradient-to-br from-[#F2F2F2] to-white p-4 rounded-xl">
            <h4 className="font-bold text-[#A60311] mb-2">Delivery Address</h4>
            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
          </div>

          {/* Payment Method Info */}
          {selectedMethod && (
            <div className="mt-4 bg-blue-50 p-4 rounded-xl">
              <h4 className="font-bold text-blue-800 mb-1">Payment Method</h4>
              <p className="text-sm text-blue-700">
                {selectedMethod === 'mpesa' ? 'M-Pesa STK Push' : 'Cash on Delivery'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
