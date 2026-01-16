import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, Clock, MapPin, Star, Search, ArrowRight } from 'lucide-react';
import API_BASE_URL from '../../config';

function CustomerDashBoard() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    deliveredOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search term
    if (searchTerm.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant => 
        restaurant.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/stats`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalRestaurants: data.total_restaurants,
          deliveredOrders: data.delivered_orders,
          pendingOrders: data.pending_orders,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/restaurants`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's your QuickBite dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Total Restaurants</p>
              <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
            </div>
            <UtensilsCrossed className="h-12 w-12 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Delivered Orders</p>
              <p className="text-3xl font-bold">{stats.deliveredOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-green-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm mb-1">Pending Orders</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* All Restaurants Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">All Restaurants</h2>
          
          {/* Search Bar for Location */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <UtensilsCrossed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No restaurants found matching your search' : 'No restaurants available'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/customer/restaurants/${restaurant.id}/menu`}
                className="card relative overflow-hidden group cursor-pointer"
              >
                {/* Logo as background */}
                <div 
                  className="h-48 bg-gradient-to-br from-primary-300 to-accent-300 flex items-center justify-center relative"
                  style={{
                    backgroundImage: restaurant.logo ? `url(${restaurant.logo})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                  
                  {/* Fallback icon when no logo */}
                  {!restaurant.logo && (
                    <UtensilsCrossed className="h-16 w-16 text-white/80 relative z-10" />
                  )}
                  
                  {/* Restaurant name at bottom left */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">{restaurant.name}</h3>
                    <div className="flex items-center space-x-3 text-white/90 text-sm mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-[150px]">{restaurant.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashBoard;

