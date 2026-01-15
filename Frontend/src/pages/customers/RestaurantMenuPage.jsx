import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Store,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function RestaurantMenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Mock restaurant data
  const restaurants = {
    '1': {
      name: 'Pizza Paradise',
      logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?w=400',
    },
    '2': {
      name: 'Burger House',
      logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    },
    '3': {
      name: 'Sushi Master',
      logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    },
    '4': {
      name: 'Taco Fiesta',
      logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
    '5': {
      name: 'Indian Spice',
      logo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    },
    '6': {
      name: 'Pasta Palace',
      logo: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    },
    '7': {
      name: 'BBQ Station',
      logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    },
    '8': {
      name: 'Smoothie Bar',
      logo: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    },
  };

  const restaurant = restaurants[restaurantId || '1'] || restaurants['1'];

  // Mock menu items by restaurant
  const menuItemsByRestaurant = {
    '1': [
      {
        id: 1,
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
        description: 'Classic tomato sauce, mozzarella, and fresh basil',
        price: 1200,
      },
      {
        id: 2,
        name: 'Pepperoni Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        description: 'Loaded with pepperoni and extra cheese',
        price: 1500,
      },
      {
        id: 3,
        name: 'BBQ Chicken Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        description: 'BBQ sauce, grilled chicken, onions, and cilantro',
        price: 1600,
      },
      {
        id: 4,
        name: 'Veggie Supreme',
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
        description: 'Bell peppers, mushrooms, olives, and onions',
        price: 1300,
      },
    ],
    '2': [
      {
        id: 5,
        name: 'Classic Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        description: 'Beef patty, lettuce, tomato, and special sauce',
        price: 800,
      },
      {
        id: 6,
        name: 'Cheese Burger',
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
        description: 'Double cheese, beef patty, pickles, and onions',
        price: 950,
      },
      {
        id: 7,
        name: 'Chicken Burger',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        description: 'Crispy chicken, lettuce, mayo, and tomato',
        price: 850,
      },
    ],
  };

  const menuItems = menuItemsByRestaurant[restaurantId || '1'] || menuItemsByRestaurant['1'];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    navigate('/customer/place-order', {
      state: {
        cart,
        restaurant,
        totalPrice: getTotalPrice(),
      },
    });
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/customer/dashboard')}
          className="flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F20519]">
            <ImageWithFallback
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#A60311]">{restaurant.name}</h2>
            <p className="text-gray-600">Browse our menu and add items to cart</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-6 h-6 text-[#F20519]" />
          <h3 className="text-2xl font-bold text-[#A60311]">Menu Items</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-[#F2F2F2] to-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="text-xl font-bold text-[#A60311] mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-4 py-2 rounded-xl">
                    <p className="text-lg font-bold">KSh {item.price.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-4 rounded-full shadow-2xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center gap-3"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="font-bold">{getTotalItems()} Items</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              KSh {getTotalPrice().toLocaleString()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && cart.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Cart Header */}
            <div className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Your Cart</h3>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 mb-4 pb-4 border-b last:border-b-0"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#A60311]">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      KSh {item.price.toLocaleString()} each
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold px-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-[#F20519] hover:bg-[#A60311] text-white p-1 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#A60311]">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="bg-gray-50 p-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-[#A60311]">Total:</span>
                <span className="text-2xl font-bold text-[#F20519]">
                  KSh {getTotalPrice().toLocaleString()}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-4 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2 font-bold"
              >
                <ShoppingCart className="w-5 h-5" />
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
