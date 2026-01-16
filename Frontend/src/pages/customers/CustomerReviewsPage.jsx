import { useState, useEffect } from 'react';
import { Star, MessageSquare, Calendar, Edit2, Trash2, X } from 'lucide-react';
import API_BASE_URL from '../../config';

function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editFormData, setEditFormData] = useState({ rating: 5, comment: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/reviews`, {
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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleEditClick = async (review) => {
    try {
      const endpoint = review.type === 'restaurant'
        ? `${API_BASE_URL}/api/customer/restaurant-reviews/${review.id}`
        : `${API_BASE_URL}/api/customer/delivery-reviews/${review.id}`;
      
      const response = await fetch(endpoint, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setEditFormData({ rating: data.rating, comment: data.comment });
        setEditingReview(review);
        setIsEditModalOpen(true);
      } else {
        showMessage('error', 'Failed to load review for editing');
      }
    } catch (error) {
      showMessage('error', 'Failed to load review for editing');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);

    try {
      const endpoint = editingReview.type === 'restaurant'
        ? `${API_BASE_URL}/api/customer/restaurant-reviews/${editingReview.id}`
        : `${API_BASE_URL}/api/customer/delivery-reviews/${editingReview.id}`;
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        showMessage('success', 'Review updated successfully');
        setIsEditModalOpen(false);
        setEditingReview(null);
        fetchReviews();
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Failed to update review');
      }
    } catch (error) {
      showMessage('error', 'Failed to update review');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    setLoadingAction(true);
    try {
      const endpoint = review.type === 'restaurant'
        ? `${API_BASE_URL}/api/customer/restaurant-reviews/${review.id}`
        : `${API_BASE_URL}/api/customer/delivery-reviews/${review.id}`;
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showMessage('success', 'Review deleted successfully');
        fetchReviews();
      } else {
        const data = await response.json();
        showMessage('error', data.error || 'Failed to delete review');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete review');
    } finally {
      setLoadingAction(false);
    }
  };

  const renderStars = (rating, interactive = false, onRate = null) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
        <p className="text-gray-600">Reviews you've submitted</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="card text-center py-12">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={`${review.type}-${review.id}`} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      review.type === 'restaurant'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {review.type === 'restaurant' ? '🍽️ Restaurant' : '🚗 Delivery Agent'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {review.target_name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-gray-600">({review.rating}/5)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      disabled={loadingAction}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                      title="Edit Review"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review)}
                      disabled={loadingAction}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg disabled:opacity-50"
                      title="Delete Review"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Edit Review</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              {/* Restaurant/Agent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingReview?.type === 'restaurant' ? 'Restaurant' : 'Delivery Agent'}
                </label>
                <p className="text-gray-900 font-medium">{editingReview?.target_name}</p>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(editFormData.rating, true, (rating) =>
                    setEditFormData({ ...editFormData, rating })
                  )}
                  <span className="ml-2 text-gray-600">({editFormData.rating}/5)</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  required
                  value={editFormData.comment}
                  onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                  className="input-field"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction || !editFormData.comment}
                  className="btn-primary disabled:opacity-50"
                >
                  {loadingAction ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerReviewsPage;

