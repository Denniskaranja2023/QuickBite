import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  Menu,
  X,
  User,
} from 'lucide-react';
import { WhatsAppButton } from '../../components/WhatsappButton';

export function CustomerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/customer/dashboard' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/customer/orders' },
    { id: 'payments', label: 'Payments', icon: DollarSign, path: '/customer/payments' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, path: '/customer/reviews' },
  ];

  const isActive = (path) => location.pathname === path;

  const customer = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-br from-[#F20519] to-[#A60311] p-6">
        {/* Profile */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 mb-3 bg-white/10 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white text-center">
            {customer.name}
          </h1>
          <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full mt-2">
            Customer
          </span>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white text-[#F20519] shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={() => navigate('/login')}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-[#F20519]" />
              <h1 className="text-xl font-bold text-[#A60311]">
                {customer.name}
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#F20519]" />
              ) : (
                <Menu className="w-6 h-6 text-[#F20519]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="border-t bg-gradient-to-br from-[#F20519] to-[#A60311] p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-white text-[#F20519]'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                Logout
              </button>
            </nav>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
