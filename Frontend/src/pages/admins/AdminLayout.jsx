import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Menu,
  X,
  ShoppingBag,
} from 'lucide-react';
import { WhatsAppButton } from '../../components/WhatsappButton';

export function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'restaurants', label: 'Restaurants', icon: Store, path: '/admin/restaurants' },
    { id: 'customers', label: 'Customers', icon: Users, path: '/admin/customers' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-br from-[#F20519] to-[#A60311] p-6">
        <div className="flex items-center gap-2 mb-10">
          <ShoppingBag className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">QuickBite</h1>
          <span className="ml-auto text-xs bg-white/20 text-white px-2 py-1 rounded-full">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                  isActive(item.path)
                    ? 'bg-white text-[#F20519]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => navigate('/login')}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 lg:ml-64">
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <WhatsAppButton />
    </div>
  );
}
