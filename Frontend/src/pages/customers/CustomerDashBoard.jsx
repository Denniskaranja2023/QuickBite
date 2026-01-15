import { useNavigate } from 'react-router-dom';
import { Store, PackageCheck, PackageX, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function CustomerDashboard() {
  const navigate = useNavigate();

  // Mock data for restaurants
  const restaurants = [
    {
      id: 1,
      name: 'Pizza Paradise',
      logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY4Mjk0MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      name: 'Burger House',
      logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    },
    {
      id: 3,
      name: 'Sushi Master',
      logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
    {
      id: 4,
      name: 'Taco Fiesta',
      logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
    {
      id: 5,
      name: 'Indian Spice',
      logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    },
    {
      id: 6,
      name: 'Pasta Palace',
      logo: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    },
    {
      id: 7,
      name: 'BBQ Station',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    },
    {
      id: 8,
      name: 'Smoothie Bar',
      logo: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    },
  ];

  // Stats
  const stats = {
    totalRestaurants: restaurants.length,
    deliveredOrders: 24,
    pendingOrders: 2,
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Welcome Back!</h2>
        <p className="text-gray-600">Explore restaurants and track your orders</p>
      </div>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Restaurants */}
        <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Store className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Total Restaurants</h3>
          <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
          <p className="text-xs text-white/70 mt-1">Available on platform</p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-gradient-to-br from-[#D9895B] to-[#A0653E] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <PackageCheck className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Delivered Orders</h3>
          <p className="text-3xl font-bold">{stats.deliveredOrders}</p>
          <p className="text-xs text-white/70 mt-1">All time</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-[#A60311] to-[#7A0209] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <PackageX className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Pending Orders</h3>
          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
          <p className="text-xs text-white/70 mt-1">In progress</p>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-6 h-6 text-[#F20519]" />
          <h3 className="text-2xl font-bold text-[#A60311]">Available Restaurants</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => navigate(`/customer/restaurant/${restaurant.id}/menu`)}
              className="bg-gradient-to-br from-[#F2F2F2] to-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left"
            >
              <div className="relative h-40">
                <ImageWithFallback
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h4 className="absolute bottom-3 left-3 right-3 text-xl font-bold text-white">
                  {restaurant.name}
                </h4>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">View Menu</span>
                  <div className="bg-[#F20519] text-white px-3 py-1 rounded-full text-xs">
                    Open
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}