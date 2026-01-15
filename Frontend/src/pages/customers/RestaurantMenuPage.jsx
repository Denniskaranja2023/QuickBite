import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

function RestaurantMenuPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
    fetchMenuItems();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`/api/admin/restaurants/${id}`, {
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
      const response = await fetch(`/api/restaurant/menuitems`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        const filtered = data.filter(item => item.restaurant_id === parseInt(id));
        setMenuItems(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (itemId) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(m => m.id === parseInt(itemId));
      return total + (item?.unit_price || 0) * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const proceedToCheckout = () => {
    const cartData = Object.entries(cart).map(([itemId, quantity]) => ({
      menu_item_id: parseInt(itemId),
      quantity,
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
    <div className="max-w-7xl mx-auto">
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
            <div className="w-24 h-24 bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg flex items-center justify-center">
              {restaurant.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-lg" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
          {menuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No menu items available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.id} className="card flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 mb-2">${item.unit_price?.toFixed(2) || '0.00'}</p>
                    {!item.availability && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    {cart[item.id] ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">{cart[item.id]}</span>
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={!item.availability}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item.id)}
                        disabled={!item.availability}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Cart</span>
              {getCartItemCount() > 0 && (
                <span className="bg-primary-500 text-white text-sm px-2 py-1 rounded-full">
                  {getCartItemCount()}
                </span>
              )}
            </h2>
            {Object.keys(cart).length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {Object.entries(cart).map(([itemId, quantity]) => {
                    const item = menuItems.find(m => m.id === parseInt(itemId));
                    if (!item) return null;
                    return (
                      <div key={itemId} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">${item.unit_price?.toFixed(2)} x {quantity}</p>
                        </div>
                        <p className="font-semibold">${(item.unit_price * quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <button onClick={proceedToCheckout} className="w-full btn-primary">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantMenuPage;

