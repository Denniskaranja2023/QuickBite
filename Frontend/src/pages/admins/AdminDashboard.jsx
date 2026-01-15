import {
  DollarSign,
  Store,
  Users,
  TrendingUp,
  Award,
  ShoppingCart,
  MapPin,
  Star,
  Phone,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function AdminDashboard() {
  const stats = {
    totalPayments: 149271.75,
    totalRestaurants: 6,
    totalCustomers: 8,
  };

  const topRestaurants = [
    {
      id: 1,
      name: 'Pizza Paradise',
      logo: 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY4Mjk0MjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 1245,
      revenue: 28450.75,
      rating: 4.8,
      location: 'Downtown',
    },
    {
      id: 3,
      name: 'Sushi Station',
      logo: 'https://images.unsplash.com/photo-1696449241254-11cf7f18ce32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY4MzgxNzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 980,
      revenue: 32450.0,
      rating: 4.9,
      location: 'Karen',
    },
    {
      id: 2,
      name: 'Burger Hub',
      logo: 'https://images.unsplash.com/photo-1644447381290-85358ae625cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2ODQwOTA2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 1180,
      revenue: 25680.25,
      rating: 4.7,
      location: 'Westlands',
    },
    {
      id: 4,
      name: 'Italian Bistro',
      logo: 'https://images.unsplash.com/photo-1532117472055-4d0734b51f31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3Njg0MTYxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 875,
      revenue: 24320.5,
      rating: 4.6,
      location: 'Kilimani',
    },
    {
      id: 5,
      name: 'The Food Court',
      logo: 'https://images.unsplash.com/photo-1667388969250-1c7220bf3f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY4NDA3ODAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 820,
      revenue: 19870.25,
      rating: 4.5,
      location: 'Upperhill',
    },
  ];

  const topCustomers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb258ZW58MXx8fHwxNzY4NDE2MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 156,
      totalSpent: 4850.75,
      phone: '+254 712 345 678',
      joinDate: 'Jan 2025',
    },
    {
      id: 2,
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      orders: 142,
      totalSpent: 4320.5,
      phone: '+254 723 456 789',
      joinDate: 'Feb 2025',
    },
    {
      id: 3,
      name: 'Emily Williams',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      orders: 128,
      totalSpent: 3950.25,
      phone: '+254 734 567 890',
      joinDate: 'Dec 2024',
    },
    {
      id: 4,
      name: 'James Brown',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      orders: 115,
      totalSpent: 3680.0,
      phone: '+254 745 678 901',
      joinDate: 'Jan 2025',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      orders: 108,
      totalSpent: 3420.5,
      phone: '+254 756 789 012',
      joinDate: 'Mar 2025',
    },
  ];

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Monitor your platform's performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Payments */}
        <div className="bg-gradient-to-br from-[#F20519] to-[#F20530] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Total Payments</h3>
          <p className="text-3xl font-bold">
            KSh {stats.totalPayments.toLocaleString()}
          </p>
        </div>

        {/* Total Restaurants */}
        <div className="bg-gradient-to-br from-[#D9895B] to-[#A0653E] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Store className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Total Restaurants</h3>
          <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
        </div>

        {/* Total Customers */}
        <div className="bg-gradient-to-br from-[#A60311] to-[#7A0209] rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 text-white/80" />
          </div>
          <h3 className="text-white/90 text-sm mb-1">Total Customers</h3>
          <p className="text-3xl font-bold">{stats.totalCustomers}</p>
        </div>
      </div>

      {/* Top Performers Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Restaurants */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-[#F20519]" />
            <h3 className="text-2xl font-bold text-[#A60311]">Top 5 Restaurants</h3>
          </div>
          <div className="space-y-4">
            {topRestaurants.map((restaurant, index) => (
              <div
                key={restaurant.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F2F2F2] to-white rounded-xl hover:shadow-md transition-shadow duration-300 border-l-4 border-[#F20519]"
              >
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute -top-2 -left-2 bg-[#F20519] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#A60311] truncate">{restaurant.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurant.location}</span>
                    <span className="text-[#D9895B]">•</span>
                    <Star className="w-3 h-3 fill-[#D9895B] text-[#D9895B]" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="bg-[#F20519]/10 text-[#F20519] px-2 py-1 rounded-full flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      {restaurant.orders} orders
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      KSh {restaurant.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-[#F20519]" />
            <h3 className="text-2xl font-bold text-[#A60311]">Top 5 Customers</h3>
          </div>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F2F2F2] to-white rounded-xl hover:shadow-md transition-shadow duration-300 border-l-4 border-[#D9895B]"
              >
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={customer.image}
                    alt={customer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#D9895B]"
                  />
                  <div className="absolute -top-2 -left-2 bg-[#D9895B] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#A60311] truncate">{customer.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Phone className="w-3 h-3" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="bg-[#D9895B]/10 text-[#D9895B] px-2 py-1 rounded-full flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      {customer.orders} orders
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      KSh {customer.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Joined {customer.joinDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
