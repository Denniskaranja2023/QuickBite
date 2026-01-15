import { useState, useEffect } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';

function AgentReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Note: You'll need to create this endpoint
      const response = await fetch('/api/agent/reviews', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
        <p className="text-gray-600">See what customers are saying about your service</p>
      </div>

      {/* Average Rating Card */}
      <div className="card mb-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm mb-1">Average Rating</p>
            <div className="flex items-center space-x-2">
              <p className="text-4xl font-bold">{averageRating}</p>
              <div className="flex items-center">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
            </div>
            <p className="text-primary-100 text-sm mt-2">{reviews.length} total reviews</p>
          </div>
          <MessageSquare className="h-16 w-16 text-primary-200" />
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.customer_name || 'Anonymous'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AgentReviewsPage;

