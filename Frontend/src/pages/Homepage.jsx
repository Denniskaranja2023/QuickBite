import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, UtensilsCrossed, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API_BASE_URL from '../config';

function Homepage({ user }) {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [topMenuItems, setTopMenuItems] = useState([]);
  const [stats, setStats] = useState({
    restaurants: 0,
    customers: 0,
    agents: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  
  // Carousel states - continuous scroll
  const [currentRestaurantIndex, setCurrentRestaurantIndex] = useState(0);
  const [currentMenuItemIndex, setCurrentMenuItemIndex] = useState(0);

  useEffect(() => {
    fetchStats();
    fetchTopRestaurants();
    fetchTopMenuItems();
  }, []);

  // Auto-scroll restaurants every 5 seconds (continuous left to right)
  useEffect(() => {
    if (topRestaurants.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentRestaurantIndex((prev) => {
        const maxIndex = topRestaurants.length - 3;
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [topRestaurants]);

  // Auto-scroll menu items every 5 seconds (continuous left to right)
  useEffect(() => {
    if (topMenuItems.length <= 3) return;
    
    const interval = setInterval(() => {
      setCurrentMenuItemIndex((prev) => {
        const maxIndex = topMenuItems.length - 3;
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [topMenuItems]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats({
          restaurants: data.restaurants || 0,
          customers: data.customers || 0,
          agents: data.agents || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchTopRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/homepage/top-restaurants`);
      if (response.ok) {
        const data = await response.json();
        setTopRestaurants(data);
      }
    } catch (error) {
      console.error('Failed to fetch top restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  const fetchTopMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/homepage/top-menu-items`);
      if (response.ok) {
        const data = await response.json();
        setTopMenuItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch top menu items:', error);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  // Animated counter hook
  const useAnimatedCounter = (endValue, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (loadingStats) return;
      
      const startValue = 0;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [endValue, duration, loadingStats]);

    return count;
  };

  // Simplified stat card with food image
  const StatCard = ({ value, label, image }) => {
    const animatedValue = useAnimatedCounter(value);
    
    return (
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
        {/* Background Image */}
        <img 
          src={image} 
          alt={label} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-4xl font-bold mb-1 drop-shadow-lg">
            {loadingStats ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
              </div>
            ) : (
              animatedValue.toLocaleString()
            )}
          </div>
          <div className="text-lg font-medium drop-shadow-md">{label}</div>
        </div>
      </div>
    );
  };

  // Restaurant carousel card
  const RestaurantCard = ({ restaurant }) => (
    <div className="flex-shrink-0 w-72 mx-2">
      <Link
        to={user?.user_type === 'customer' ? `/customer/restaurants/${restaurant.id}/menu` : '/login'}
        className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt={restaurant.name} className="h-full w-full object-cover" />
          ) : (
            <UtensilsCrossed className="h-16 w-16 text-primary-400" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{restaurant.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
            <span className="text-gray-400">•</span>
            <span>{restaurant.order_count || 0} orders</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </Link>
    </div>
  );

  // Menu item carousel card
  const MenuItemCard = ({ menuItem }) => (
    <div className="flex-shrink-0 w-72 mx-2">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden relative">
          {menuItem.image ? (
            <img src={menuItem.image} alt={menuItem.name} className="h-full w-full object-cover" />
          ) : (
            <UtensilsCrossed className="h-16 w-16 text-orange-400" />
          )}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-primary-600">
            KSh {menuItem.unit_price?.toFixed(2)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{menuItem.name}</h3>
          <p className="text-sm text-gray-500 mb-2 truncate">{menuItem.restaurant_name}</p>
          {menuItem.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{menuItem.description}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{menuItem.order_count || 0} ordered</span>
            </div>
            <Link
              to={user?.user_type === 'customer' ? `/customer/restaurants/${menuItem.restaurant_id}/menu` : '/login'}
              className="text-primary-600 font-semibold text-sm hover:text-primary-700 flex items-center"
            >
              View <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const scrollRestaurants = (direction) => {
    const maxIndex = topRestaurants.length - 3;
    setCurrentRestaurantIndex((prev) => {
      if (direction === 'left') {
        return prev > 0 ? prev - 1 : maxIndex;
      } else {
        return prev < maxIndex ? prev + 1 : 0;
      }
    });
  };

  const scrollMenuItems = (direction) => {
    const maxIndex = topMenuItems.length - 3;
    setCurrentMenuItemIndex((prev) => {
      if (direction === 'left') {
        // Left arrow → move to previous items (scroll left)
        return prev > 0 ? prev - 1 : maxIndex;
      } else {
        // Right arrow → move to next items (scroll right)
        return prev < maxIndex ? prev + 1 : 0;
      }
    });
  };

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
        </div>

        {/* Simplified Stats Cards - Food Images Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard 
            value={stats.restaurants} 
            label="Restaurants" 
            image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
          />
          <StatCard 
            value={stats.customers} 
            label="Happy Customers" 
            image="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"
          />
          <StatCard 
            value={stats.agents} 
            label="Delivery Agents" 
            image="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop"
          />
        </div>

        {/* Top Restaurants Carousel */}
        {loadingRestaurants ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Top Restaurants</h2>
            </div>
            <div className="flex space-x-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 mx-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : topRestaurants.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Top Restaurants</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => scrollRestaurants('left')}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scrollRestaurants('right')}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: -currentRestaurantIndex * 288 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {topRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </motion.div>
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {topRestaurants.slice(0, Math.max(1, topRestaurants.length - 2)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentRestaurantIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentRestaurantIndex ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center py-12 bg-gray-50 rounded-2xl">
            <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No restaurants available yet.</p>
            <p className="text-sm text-gray-400 mt-2">Check back soon for amazing dining options!</p>
          </div>
        )}

        {/* Top Menu Items Carousel */}
        {loadingMenuItems ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Most Popular</h2>
            </div>
            <div className="flex space-x-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-72 mx-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : topMenuItems.length > 0 ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Most Popular</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => scrollMenuItems('left')}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => scrollMenuItems('right')}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: -currentMenuItemIndex * 288 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {topMenuItems.map((menuItem) => (
                  <MenuItemCard key={menuItem.id} menuItem={menuItem} />
                ))}
              </motion.div>
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {topMenuItems.slice(0, Math.max(1, topMenuItems.length - 2)).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentMenuItemIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentMenuItemIndex ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16 text-center py-12 bg-gray-50 rounded-2xl">
            <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No popular menu items available yet.</p>
            <p className="text-sm text-gray-400 mt-2">Orders will appear here as customers order!</p>
          </div>
        )}
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

