import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, Star, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { WhatsAppButton } from '../components/WhatsappButton';

export function Homepage() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Pizza', image: 'https://images.unsplash.com/photo-1672856398893-2fb52d807874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080' },
    { name: 'Burgers', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080' },
    { name: 'Restaurants', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080' },
  ];

  const features = [
    { icon: Clock, title: 'Fast Delivery', description: 'Get your food in 30 minutes or less' },
    { icon: Star, title: 'Best Quality', description: 'Fresh ingredients, every time' },
    { icon: ShoppingBag, title: 'Easy Ordering', description: 'Order in just a few clicks' },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-[#F20519]" />
            <h1 className="text-2xl font-bold text-[#A60311]">QuickBite</h1>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#F20519] text-white px-6 py-2.5 rounded-full hover:bg-[#A60311] transition-colors duration-300"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F20519] via-[#F20530] to-[#A60311] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
              Delicious Food<br />
              <span className="text-[#D9895B]">Delivered Fast</span>
            </h2>
            <p className="text-xl text-white/90">
              Order from your favorite restaurants and get it delivered right to your doorstep in minutes
            </p>
            <div className="flex gap-4 pt-4 flex-wrap">
              <button
                onClick={() => navigate('/signup')}
                className="bg-white text-[#F20519] px-8 py-3.5 rounded-full hover:bg-[#F2F2F2] transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-transparent border-2 border-white text-white px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1615495504323-13bc487d9c9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
              alt="Food delivery"
              className="rounded-3xl shadow-2xl w-full object-cover h-[400px] lg:h-[500px]"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F2F2F2] to-transparent"></div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-[#A60311] mb-8 text-center">Popular Categories</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <ImageWithFallback
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <h4 className="text-white text-2xl font-bold p-6">{category.name}</h4>
              </div>
              <div className="absolute inset-0 bg-[#F20519]/0 group-hover:bg-[#F20519]/20 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#A60311] mb-12 text-center">Why Choose QuickBite?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="text-center p-8 rounded-2xl bg-[#F2F2F2] hover:bg-gradient-to-br hover:from-[#F20519] hover:to-[#F20530] hover:text-white transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F20519] group-hover:bg-white rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-white group-hover:text-[#F20519]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-[#A60311] group-hover:text-white">{feature.title}</h4>
                <p className="text-gray-600 group-hover:text-white/90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#A60311] to-[#F20519] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold mb-4">Ready to Order?</h3>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of happy customers enjoying delicious food delivered fast
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-[#F20519] px-10 py-4 rounded-full hover:bg-[#D9895B] hover:text-white transition-all duration-300 text-lg shadow-xl"
          >
            Start Ordering Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#A60311] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xl font-bold">QuickBite</span>
          </div>
          <p className="text-white/80">© 2026 QuickBite. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
