import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  MessageSquare,
  Package,
  User,
  Store,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function CustomerReviewsPage() {
  const navigate = useNavigate();

  // Orders that have been delivered but not reviewed yet
  const [unreviewedOrders] = useState([
    {
      id: 'ORD-001',
      restaurant: {
        id: 'REST-001',
        name: 'Pizza Paradise',
        logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?w=400',
      },
      deliveryAgent: {
        id: 'AGENT-001',
        name: 'John Kamau',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 1200 },
        { name: 'Pepperoni Pizza', quantity: 1, price: 1500 },
      ],
      total: 4100,
      deliveryDate: '2026-01-14',
      restaurantReviewed: false,
      agentReviewed: false,
    },
    {
      id: 'ORD-003',
      restaurant: {
        id: 'REST-003',
        name: 'Sushi Master',
        logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      },
      deliveryAgent: {
        id: 'AGENT-002',
        name: 'Mary Wanjiku',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      items: [
        { name: 'California Roll', quantity: 3, price: 1200 },
      ],
      total: 3800,
      deliveryDate: '2026-01-13',
      restaurantReviewed: true,
      agentReviewed: false,
    },
    {
      id: 'ORD-006',
      restaurant: {
        id: 'REST-004',
        name: 'Taco Fiesta',
        logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
      },
      deliveryAgent: {
        id: 'AGENT-003',
        name: 'David Ochieng',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      },
      items: [
        { name: 'Beef Tacos', quantity: 4, price: 600 },
      ],
      total: 2600,
      deliveryDate: '2026-01-12',
      restaurantReviewed: false,
      agentReviewed: true,
    },
  ]);

  // Previously submitted reviews
  const [submittedReviews] = useState([
    {
      id: 1,
      type: 'restaurant',
      targetName: 'Burger House',
      targetLogo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      orderId: 'ORD-002',
      rating: 8,
      comment: 'Great burgers and good portion sizes. The cheese burger was delicious. Only complaint is that it took a bit longer than expected to arrive.',
      date: '2026-01-13',
    },
    {
      id: 2,
      type: 'agent',
      targetName: 'James Mwangi',
      targetPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      orderId: 'ORD-002',
      rating: 9,
      comment: 'Very professional delivery agent. Arrived on time and was very polite. Great service!',
      date: '2026-01-13',
    },
    {
      id: 3,
      type: 'restaurant',
      targetName: 'Sushi Master',
      targetLogo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      orderId: 'ORD-003',
      rating: 10,
      comment: 'Best sushi in Nairobi! Fresh fish, beautifully presented, and authentic taste. Will definitely order again.',
      date: '2026-01-12',
    },
  ]);

  // Function to render the rating bar
  const renderRatingBar = (rating) => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#F20519] to-[#F20530] h-2 rounded-full"
            style={{ width: `${(rating / 10) * 100}%` }}
          />
        </div>
        <span className="font-bold text-[#F20519] min-w-[3rem]">{rating}/10</span>
      </div>
    );
  };

  const totalUnreviewed = unreviewedOrders.reduce((count, order) => {
    let orderCount = 0;
    if (!order.restaurantReviewed) orderCount++;
    if (!order.agentReviewed) orderCount++;
    return count + orderCount;
  }, 0);

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Reviews</h2>
        <p className="text-gray-600">Review your delivered orders and share your experiences</p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-6 text-white shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-white/90 text-sm mb-1">Pending Reviews</h3>
              <p className="text-3xl font-bold">{totalUnreviewed}</p>
              <p className="text-xs text-white/70 mt-1">Orders waiting for your feedback</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Total Reviews Submitted</p>
            <p className="text-2xl font-bold">{submittedReviews.length}</p>
          </div>
        </div>
      </div>

      {/* Unreviewed Orders Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#A60311] mb-4 flex items-center gap-2">
          <Package className="w-6 h-6" />
          Orders Pending Review
        </h3>

        {unreviewedOrders.length > 0 ? (
          <div className="space-y-4">
            {unreviewedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-[#D9895B] to-[#A0653E] text-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">Order #{order.id}</h4>
                      <p className="text-sm text-white/80">Delivered on {order.deliveryDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">KSh {order.total.toLocaleString()}</p>
                      <p className="text-xs text-white/80">{order.items.length} items</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Restaurant Review Card */}
                    <div
                      className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                        order.restaurantReviewed
                          ? 'border-green-300 bg-green-50'
                          : 'border-[#F20519] bg-[#F20519]/5 hover:bg-[#F20519]/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F20519]">
                          <ImageWithFallback
                            src={order.restaurant.logo}
                            alt={order.restaurant.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            Restaurant
                          </p>
                          <p className="font-bold text-[#A60311]">{order.restaurant.name}</p>
                        </div>
                      </div>

                      {order.restaurantReviewed ? (
                        <div className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-center text-sm font-bold">
                          ✓ Reviewed
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/customer/review/restaurant/${order.restaurant.id}`, {
                              state: { order },
                            })
                          }
                          className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-3 rounded-lg hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold"
                        >
                          Review Restaurant
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Delivery Agent Review Card */}
                    <div
                      className={`border-2 rounded-xl p-4 transition-all duration-300 ${
                        order.agentReviewed
                          ? 'border-green-300 bg-green-50'
                          : 'border-[#F20519] bg-[#F20519]/5 hover:bg-[#F20519]/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F20519]">
                          <ImageWithFallback
                            src={order.deliveryAgent.photo}
                            alt={order.deliveryAgent.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            Delivery Agent
                          </p>
                          <p className="font-bold text-[#A60311]">{order.deliveryAgent.name}</p>
                        </div>
                      </div>

                      {order.agentReviewed ? (
                        <div className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-center text-sm font-bold">
                          ✓ Reviewed
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            navigate(`/customer/review/agent/${order.deliveryAgent.id}`, {
                              state: { order },
                            })
                          }
                          className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-3 rounded-lg hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold"
                        >
                          Review Agent
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No pending reviews</h3>
            <p className="text-gray-500">All your delivered orders have been reviewed!</p>
          </div>
        )}
      </div>

      {/* Submitted Reviews Section */}
      <div>
        <h3 className="text-xl font-bold text-[#A60311] mb-4 flex items-center gap-2">
          <Star className="w-6 h-6" />
          Your Submitted Reviews
        </h3>

        {submittedReviews.length > 0 ? (
          <div className="space-y-4">
            {submittedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                        <ImageWithFallback
                          src={review.type === 'restaurant' ? review.targetLogo : review.targetPhoto}
                          alt={review.targetName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{review.targetName}</h4>
                        <p className="text-sm text-white/80 flex items-center gap-1">
                          {review.type === 'restaurant' ? (
                            <>
                              <Store className="w-3 h-3" /> Restaurant Review
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3" /> Delivery Agent Review
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/80">Order #{review.orderId}</p>
                      <p className="text-xs text-white/60">{review.date}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">{renderRatingBar(review.rating)}</div>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">No reviews yet</h3>
            <p className="text-gray-500">Start reviewing your delivered orders!</p>
          </div>
        )}
      </div>
    </>
  );
}
