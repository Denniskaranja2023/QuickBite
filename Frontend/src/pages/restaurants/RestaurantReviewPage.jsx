import { Star, MessageSquare, Award, Calendar } from 'lucide-react';

export function RestaurantReviewsPage() {
  const reviews = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      rating: 5,
      comment:
        'Amazing pizza! The delivery was fast and the food was still hot. Highly recommend the Margherita!',
      date: '2026-01-14',
    },
    {
      id: 2,
      customer: 'Michael Chen',
      rating: 4,
      comment:
        'Great taste and good portion sizes. The BBQ Chicken pizza was delicious.',
      date: '2026-01-13',
    },
    {
      id: 3,
      customer: 'Emily Williams',
      rating: 5,
      comment: 'Best pizza in town! Fresh ingredients and excellent service.',
      date: '2026-01-13',
    },
    {
      id: 4,
      customer: 'James Brown',
      rating: 4,
      comment: 'Very good pizza, though I wish they had more vegan options.',
      date: '2026-01-12',
    },
    {
      id: 5,
      customer: 'Lisa Anderson',
      rating: 5,
      comment: 'Absolutely loved it! The Meat Lovers pizza is a must-try.',
      date: '2026-01-11',
    },
    {
      id: 6,
      customer: 'Tom Harris',
      rating: 3,
      comment: 'Good pizza but the delivery took longer than expected.',
      date: '2026-01-10',
    },
  ];

  // Calculate average rating
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Customer Reviews</h2>
        <p className="text-gray-600">
          See what customers are saying about your restaurant
        </p>
      </div>

      {/* Average Rating */}
      <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-8 text-white shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg mb-2">Average Rating</h3>
            <div className="flex items-center gap-3">
              <span className="text-6xl font-bold">{averageRating}</span>
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(parseFloat(averageRating))
                          ? 'fill-white text-white'
                          : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/90">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <Award className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* All Reviews */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-[#F20519]" />
          <h3 className="text-2xl font-bold text-[#A60311]">All Reviews</h3>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-[#F2F2F2] to-white rounded-xl p-6 border-2 border-[#F20519]/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-[#A60311] text-lg">
                    {review.customer}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
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
                    <span className="text-sm text-gray-500">({review.rating}/5)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {review.date}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
