import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Clock, ArrowRight, UtensilsCrossed, ShoppingCart, ChefHat } from 'lucide-react';
import { useState, useEffect } from 'react';

function Homepage({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/admin/restaurants', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <UtensilsCrossed className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold text-gray-900">QuickBite</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to={`/${user.user_type}/dashboard`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Order Food <span className="text-primary-500">Delivered</span> Fast
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing restaurants and get your favorite meals delivered to your doorstep
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary-500 transition-all duration-200 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card text-center">
            <Clock className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your food delivered in 30 minutes or less</p>
          </div>
          <div className="card text-center">
            <ChefHat className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Top Restaurants</h3>
            <p className="text-gray-600">Choose from hundreds of verified restaurants</p>
          </div>
          <div className="card text-center">
            <ShoppingCart className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
            <p className="text-gray-600">Simple and secure checkout process</p>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Restaurants</h2>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No restaurants found. Try a different search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={user?.user_type === 'customer' ? `/customer/restaurants/${restaurant.id}/menu` : '/login'}
                  className="card hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg mb-4 flex items-center justify-center">
                    {restaurant.logo ? (
                      <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <UtensilsCrossed className="h-16 w-16 text-primary-400" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{restaurant.address}</span>
                    </div>
                  </div>
                  {restaurant.bio && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{restaurant.bio}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold">View Menu</span>
                    <ArrowRight className="h-5 w-5 text-primary-600" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <UtensilsCrossed className="h-6 w-6" />
                <span className="text-xl font-bold">QuickBite</span>
              </div>
              <p className="text-gray-400">Your favorite food, delivered fast.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuickBite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;

