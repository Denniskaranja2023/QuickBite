import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ArrowLeft, Star, X, Check, Search } from 'lucide-react';
import API_BASE_URL from '../../config';

function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurant();
    fetchMenuItems();
  }, [id]);

  useEffect(() => {
    // Filter menu items based on search term
    if (searchTerm.trim() === '') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, menuItems]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/restaurants/${id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
      }
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customer/menuitems?restaurant_id=${id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
        setFilteredItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: {
        ...item,
        quantity: (prev[item.id]?.quantity || 0) + 1
      }
    }));
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (!newCart[itemId]) return newCart;
      
      newCart[itemId] = {
        ...newCart[itemId],
        quantity: newCart[itemId].quantity + delta
      };
      
      if (newCart[itemId].quantity <= 0) {
        delete newCart[itemId];
      }
      
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + (item.unit_price || 0) * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const proceedToCheckout = () => {
    setShowCartModal(false);
    const cartData = Object.entries(cart).map(([itemId, item]) => ({
      menu_item_id: parseInt(itemId),
      name: item.name,
      unit_price: item.unit_price,
      quantity: item.quantity,
    }));
    navigate('/customer/place-order', { state: { restaurant, cart: cartData, menuItems } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {restaurant && (
        <div className="card mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg flex items-center justify-center overflow-hidden">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🍽️</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <span>{restaurant.address}</span>
              </div>
              {restaurant.bio && <p className="text-gray-600 mt-2">{restaurant.bio}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Menu Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
        
        {/* Search Bar for Menu Items */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No menu items found matching your search' : 'No menu items available'}
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
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
                !item.availability ? 'opacity-60' : ''
              }`}
            >
              {/* Menu Item Image */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">🍔</span>
                  </div>
                )}
                {!item.availability && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Unavailable
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white font-bold text-2xl">KSh {item.unit_price?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              
              {/* Menu Item Details */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                )}
                
                <button
                  onClick={() => item.availability && addToCart(item)}
                  disabled={!item.availability}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                    item.availability 
                      ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {cart[item.id] ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Added ({cart[item.id].quantity})</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart Floating Button */}
      {Object.keys(cart).length > 0 && (
        <button
          onClick={() => {
            setShowCartModal(true);
          }}
          className="fixed bottom-8 right-8 z-[100] bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-xl p-4 flex items-center space-x-3 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="h-8 w-8" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {getCartItemCount()}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm opacity-80">Total</p>
            <p className="font-bold text-lg">KSh {getCartTotal().toFixed(2)}</p>
          </div>
        </button>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={() => setShowCartModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-6 w-6" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add items from the menu above</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(cart).map(([itemId, item]) => (
                    <div 
                      key={itemId} 
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl">🍔</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                        <p className="text-primary-600 font-medium text-sm">KSh {item.unit_price?.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(parseInt(itemId), -1)}
                          className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(parseInt(itemId), 1)}
                          className="p-1 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            {Object.keys(cart).length > 0 && (
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Total ({getCartItemCount()} items)</span>
                  <span className="text-xl font-bold text-primary-600">KSh {getCartTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Place Order</span>
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantMenuPage;

