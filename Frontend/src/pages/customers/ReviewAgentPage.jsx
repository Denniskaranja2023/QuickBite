import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { User, Star, ChevronLeft, Send } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';
import { toast } from 'sonner';

export function ReviewAgentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agentId } = useParams();
  const order = location.state?.order;

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <h3 className="text-xl font-bold text-gray-600 mb-2">Order not found</h3>
        <p className="text-gray-500 mb-6">Unable to load order details for this review.</p>
        <button
          onClick={() => navigate('/customer/reviews')}
          className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300"
        >
          Back to Reviews
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Please write a comment with at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Delivery agent review submitted successfully!');
      setIsSubmitting(false);
      navigate('/customer/reviews');
    }, 1500);
  };

  const renderRatingStars = () => (
    <div className="flex gap-2 justify-center">
      {[1,2,3,4,5,6,7,8,9,10].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-all duration-200 hover:scale-125"
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hoveredRating || rating)
                ? 'fill-[#F20519] text-[#F20519]'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Back Button */}
      <button
        onClick={() => navigate('/customer/reviews')}
        className="mb-6 flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-bold">Back to Reviews</span>
      </button>

      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Review Delivery Agent</h2>
        <p className="text-gray-600">Rate your delivery experience and service quality</p>
      </div>

      {/* Order & Agent Info Card */}
      <div className="bg-gradient-to-br from-[#D9895B] to-[#A0653E] rounded-2xl p-6 text-white shadow-lg mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <ImageWithFallback
              src={order.deliveryAgent.photo}
              alt={order.deliveryAgent.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-5 h-5" />
              <h3 className="text-xl font-bold">{order.deliveryAgent.name}</h3>
            </div>
            <p className="text-white/80">Delivery Agent</p>
            <p className="text-sm text-white/70">Order #{order.id} • {order.deliveryDate}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <h4 className="font-bold mb-2">Order from {order.restaurant.name}</h4>
          <div className="space-y-1">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-white/20 flex justify-between font-bold">
            <span>Total:</span>
            <span>KSh {order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div>
            <label className="block text-center font-bold text-[#A60311] mb-4">
              How would you rate this delivery agent?
            </label>
            {renderRatingStars()}
            {rating > 0 && (
              <div className="text-center mt-4 inline-flex items-center gap-2 bg-[#F20519]/10 px-6 py-3 rounded-full">
                <span className="text-3xl font-bold text-[#F20519]">{rating}</span>
                <span className="text-gray-600">out of 10</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-4 px-4">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block font-bold text-[#A60311] mb-3">
              Share your delivery experience
            </label>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              rows={6}
              placeholder="Tell us about the delivery time, professionalism, communication, packaging handling, and overall service..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum 10 characters ({comment.length}/10)
            </p>
          </div>

          {/* Helpful Tips */}
          <div className="bg-[#D9895B]/10 border-2 border-[#D9895B]/30 rounded-xl p-4">
            <h4 className="font-bold text-[#A60311] mb-2">Tips for a helpful review:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Comment on delivery timeliness and speed</li>
              <li>• Note the agent's professionalism and courtesy</li>
              <li>• Mention how the food was handled and delivered</li>
              <li>• Include any communication or special service</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/customer/reviews')}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
