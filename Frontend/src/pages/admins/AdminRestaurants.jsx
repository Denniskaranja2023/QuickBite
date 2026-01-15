import { useState } from 'react';
import {
  Plus,
  MapPin,
  Phone,
  Calendar,
  Star,
  ShoppingCart,
  DollarSign,
  Trash2,
  ArrowLeft,
  Upload,
  Mail,
  Lock,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function AdminRestaurantsPage() {
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    password: '',
    logo: '',
  });

  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: 'Pizza Paradise',
      logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf',
      orders: 1245,
      revenue: 28450.75,
      rating: 4.8,
      location: 'Downtown',
      phone: '+254 712 000 001',
      email: 'info@pizzaparadise.com',
      joined: 'Jan 2024',
    },
    {
      id: 2,
      name: 'Burger Hub',
      logo: 'https://images.unsplash.com/photo-1644447381290-85358ae625cb',
      orders: 1180,
      revenue: 25680.25,
      rating: 4.7,
      location: 'Westlands',
      phone: '+254 723 000 002',
      email: 'contact@burgerhub.com',
      joined: 'Feb 2024',
    },
  ]);

  const handleDeleteRestaurant = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setRestaurants(restaurants.filter(r => r.id !== id));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      setNewRestaurant({ ...newRestaurant, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddRestaurant = (e) => {
    e.preventDefault();

    const restaurant = {
      id: restaurants.length + 1,
      name: newRestaurant.name,
      logo:
        newRestaurant.logo ||
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      orders: 0,
      revenue: 0,
      rating: 4.0,
      location: newRestaurant.address,
      phone: newRestaurant.contact,
      email: newRestaurant.email,
      joined: 'Jan 2026',
    };

    setRestaurants([...restaurants, restaurant]);
    setShowAddRestaurant(false);
    setNewRestaurant({
      name: '',
      address: '',
      contact: '',
      email: '',
      password: '',
      logo: '',
    });
    setLogoPreview(null);
  };

  return (
    <>
      {!showAddRestaurant ? (
        <>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#A60311] mb-2">
                Restaurants
              </h2>
              <p className="text-gray-600">
                Manage all restaurants on the platform
              </p>
            </div>
            <button
              onClick={() => setShowAddRestaurant(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Restaurant
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <div
                key={restaurant.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48">
                  <ImageWithFallback
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3">
                    {restaurant.name}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {restaurant.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {restaurant.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {restaurant.joined}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteRestaurant(
                        restaurant.id,
                        restaurant.name
                      )
                    }
                    className="w-full bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setShowAddRestaurant(false)}
            className="flex items-center gap-2 mb-6 text-red-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <form
            onSubmit={handleAddRestaurant}
            className="bg-white p-8 rounded-xl max-w-xl space-y-6"
          >
            <input
              type="text"
              placeholder="Restaurant Name"
              value={newRestaurant.name}
              onChange={e =>
                setNewRestaurant({ ...newRestaurant, name: e.target.value })
              }
              className="w-full border p-3 rounded"
            />

            <input
              type="email"
              placeholder="Email"
              value={newRestaurant.email}
              onChange={e =>
                setNewRestaurant({ ...newRestaurant, email: e.target.value })
              }
              className="w-full border p-3 rounded"
            />

            <input
              type="password"
              placeholder="Password"
              value={newRestaurant.password}
              onChange={e =>
                setNewRestaurant({ ...newRestaurant, password: e.target.value })
              }
              className="w-full border p-3 rounded"
            />

            <input type="file" onChange={handleLogoChange} />

            <button className="w-full bg-red-600 text-white py-3 rounded">
              Add Restaurant
            </button>
          </form>
        </>
      )}
    </>
  );
}
