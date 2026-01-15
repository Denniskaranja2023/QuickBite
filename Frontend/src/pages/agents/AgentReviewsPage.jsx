import { Star } from 'lucide-react';

export function AgentReviewsPage() {
  // Mock reviews data
  const reviews = [
    {
      id: '1',
      comment: 'Very professional and delivered on time. Food was still hot!',
      rating: 5,
      date: '2026-01-13 6:45 PM'
    },
    {
      id: '2',
      comment: 'Good service but took a bit longer than expected.',
      rating: 4,
      date: '2026-01-13 2:30 PM'
    },
    {
      id: '3',
      comment: 'Excellent delivery agent! Very polite and careful with the food.',
      rating: 5,
      date: '2026-01-12 8:20 PM'
    },
    {
      id: '4',
      comment: 'Delivered quickly and was very friendly.',
      rating: 5,
      date: '2026-01-12 1:15 PM'
    },
    {
      id: '5',
      comment: 'Good service overall.',
      rating: 4,
      date: '2026-01-11 7:00 PM'
    },
    {
      id: '6',
      comment: 'Agent was helpful and made sure I got everything I ordered.',
      rating: 5,
      date: '2026-01-11 12:30 PM'
    }
  ];

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Customer Reviews</h1>
        <p className="text-gray-600">See what customers are saying about your service</p>
      </div>

      {/* Average Rating Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#F20519] text-white rounded-full w-20 h-20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRating}</div>
              <div className="text-xs">/ 5.0</div>
            </div>
          </div>
          <div>
            <h3 className="text-gray-900 mb-1">Average Rating</h3>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(parseFloat(averageRating))
                      ? 'fill-[#F20519] text-[#F20519]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-[#F20519] text-[#F20519]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">- Anonymous Customer</p>
          </div>
        ))}
      </div>
    </div>
  );
}
