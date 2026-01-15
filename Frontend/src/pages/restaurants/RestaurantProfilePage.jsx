import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function RestaurantProfilePage() {
  const navigate = useNavigate();
  const restaurant = {
    name: 'Pizza Paradise',
    logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?w=400',
  };

  const [profileData, setProfileData] = useState({
    name: restaurant.name,
    bio: 'We serve the best authentic Italian pizza in town with fresh ingredients and a passion for quality.',
    contact: '+254 700 123 456',
    paybill: '123456',
    email: 'info@pizzaparadise.com',
    location: 'Nairobi, Kenya',
    image: restaurant.logo,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
        setProfileData({ ...profileData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      alert('Account deleted. Redirecting...');
      navigate('/login');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Restaurant Profile</h2>
        <p className="text-gray-600">Manage your restaurant information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 max-w-4xl">
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-bold text-[#A60311] mb-2">
              Restaurant Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#F20519]">
                <ImageWithFallback
                  src={profileImagePreview || profileData.image}
                  alt="Restaurant logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all">
                  <Upload className="w-5 h-5" />
                  Change Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a high-quality logo (recommended: 512x512px)
                </p>
              </div>
            </div>
          </div>

          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-bold text-[#A60311] mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold text-[#A60311] mb-2">
              Bio / Description *
            </label>
            <textarea
              required
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              rows={4}
            />
          </div>

          {/* Contact & Email */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                required
                value={profileData.contact}
                onChange={(e) =>
                  setProfileData({ ...profileData, contact: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              />
            </div>
          </div>

          {/* Paybill & Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                M-Pesa Paybill *
              </label>
              <input
                type="text"
                required
                value={profileData.paybill}
                onChange={(e) =>
                  setProfileData({ ...profileData, paybill: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={profileData.location}
                onChange={(e) =>
                  setProfileData({ ...profileData, location: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 font-bold"
            >
              Update Profile
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-bold flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete Account
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This action cannot be undone. Your account and all data will be permanently deleted.
          </p>
        </div>
      </div>
    </>
  );
}
