import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, Lock } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsappButton';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);

    // Navigate to appropriate dashboard based on user type
    if (formData.userType === 'admin') {
      navigate('/admin/dashboard');
    } else if (formData.userType === 'restaurant') {
      navigate('/restaurant/dashboard');
    } else if (formData.userType === 'delivery') {
      navigate('/agent/dashboard');
    } else if (formData.userType === 'customer') {
      navigate('/customer/dashboard');
    }
  };

  const userTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'delivery', label: 'Delivery Agent' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F20519] via-[#F20530] to-[#A60311] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <ShoppingBag className="w-8 h-8 text-[#F20519]" />
            <h1 className="text-2xl font-bold text-[#A60311]">QuickBite</h1>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-[#A60311] mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-600 text-center mb-8">Sign in to continue ordering delicious food</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: type.value })}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      formData.userType === type.value
                        ? 'border-[#F20519] bg-[#F20519] text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-[#F20519]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F20519] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#F20519] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#F20519] hover:text-[#A60311] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-3.5 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#F20519] hover:text-[#A60311] font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
