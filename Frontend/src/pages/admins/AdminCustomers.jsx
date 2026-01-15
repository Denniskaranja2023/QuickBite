import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXJzb258ZW58MXx8fHwxNzY4NDE2MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      orders: 156,
      totalSpent: 4850.75,
      phone: '+254 712 345 678',
      email: 'sarah.j@email.com',
      joinDate: 'Jan 2025',
      location: 'Nairobi',
    },
    {
      id: 2,
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      orders: 142,
      totalSpent: 4320.5,
      phone: '+254 723 456 789',
      email: 'michael.c@email.com',
      joinDate: 'Feb 2025',
      location: 'Westlands',
    },
    {
      id: 3,
      name: 'Emily Williams',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      orders: 128,
      totalSpent: 3950.25,
      phone: '+254 734 567 890',
      email: 'emily.w@email.com',
      joinDate: 'Dec 2024',
      location: 'Karen',
    },
    {
      id: 4,
      name: 'James Brown',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      orders: 115,
      totalSpent: 3680.0,
      phone: '+254 745 678 901',
      email: 'james.b@email.com',
      joinDate: 'Jan 2025',
      location: 'CBD',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      orders: 108,
      totalSpent: 3420.5,
      phone: '+254 756 789 012',
      email: 'lisa.a@email.com',
      joinDate: 'Mar 2025',
      location: 'Kilimani',
    },
    {
      id: 6,
      name: 'David Martinez',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      orders: 95,
      totalSpent: 2980.0,
      phone: '+254 767 890 123',
      email: 'david.m@email.com',
      joinDate: 'Feb 2025',
      location: 'Upperhill',
    },
    {
      id: 7,
      name: 'Sophia Taylor',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      orders: 87,
      totalSpent: 2650.75,
      phone: '+254 778 901 234',
      email: 'sophia.t@email.com',
      joinDate: 'Jan 2025',
      location: 'Parklands',
    },
    {
      id: 8,
      name: 'Robert Wilson',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      orders: 72,
      totalSpent: 2290.0,
      phone: '+254 789 012 345',
      email: 'robert.w@email.com',
      joinDate: 'Feb 2025',
      location: 'Lavington',
    },
  ]);

  const handleDeleteCustomer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      setCustomers(customers.filter(customer => customer.id !== id));
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Customers</h2>
        <p className="text-gray-600">Manage all customers on the platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <ImageWithFallback
                src={customer.image}
                alt={customer.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#F2F2F2]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-[#A60311] mb-1 truncate">
                  {customer.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-3 h-3" />
                  <span>{customer.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-[#F20519]" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#F20519]" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-[#F20519]" />
                <span>Joined {customer.joinDate}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="bg-[#D9895B]/10 text-[#D9895B] px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                <ShoppingCart className="w-4 h-4" />
                {customer.orders} orders
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {customer.totalSpent.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
              className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-2.5 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Customer
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
