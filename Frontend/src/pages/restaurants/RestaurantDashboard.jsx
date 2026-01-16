import { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, Star, TrendingUp, Clock, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../../config';

// Currency formatter for KSh
const formatCurrency = (amount) => {
  return `KSh ${Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalAgents: 0,
    averageRating: 0,
  });
  const [topCustomers, setTopCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    unit_price: '',
    description: '',
    availability: true,
    image: ''
  });
  const [addForm, setAddForm] = useState({
    name: '',
    unit_price: '',
    description: '',
    availability: true,
    image: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, ordersRes, paymentsRes, agentsRes, customersRes, menuRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/restaurant/account`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/restaurant/orders`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/restaurant/payments`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/restaurant/agents`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/restaurant/top-customers`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/restaurant/menuitems`, { credentials: 'include' }),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setRestaurant(profileData);
        setStats(prev => ({ ...prev, averageRating: profileData.rating || 0 }));
      }

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        setStats(prev => ({ ...prev, totalOrders: orders.length }));
      }

      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        setStats(prev => ({ ...prev, totalRevenue: revenue }));
      }

      if (agentsRes.ok) {
        const agents = await agentsRes.json();
        setStats(prev => ({ ...prev, totalAgents: agents.length }));
      }

      if (customersRes.ok) {
        const customers = await customersRes.json();
        setTopCustomers(customers);
      }

      if (menuRes.ok) {
        const items = await menuRes.json();
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/restaurant/menuitems/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setMenuItems(prev => prev.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete menu item:', error);
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name,
      unit_price: item.unit_price,
      description: item.description || '',
      availability: item.availability,
      image: item.image || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurant/menuitems/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (response.ok) {
        // Close modal first for better UX
        setEditingItem(null);
        // Re-fetch menu items to get updated data from server
        const menuRes = await fetch(`${API_BASE_URL}/api/restaurant/menuitems`, { credentials: 'include' });
        if (menuRes.ok) {
          const items = await menuRes.json();
          setMenuItems(items);
        }
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurant/menuitems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addForm),
      });
      if (response.ok) {
        const data = await response.json();
        setMenuItems(prev => [...prev, { ...addForm, id: data.id }]);
        setShowAddForm(false);
        setAddForm({
          name: '',
          unit_price: '',
          description: '',
          availability: true,
          image: ''
        });
      }
    } catch (error) {
      console.error('Failed to add menu item:', error);
    }
  };

  const handleImageUpload = (e, setFormFunc) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormFunc(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {restaurant?.name || 'Your Restaurant'} Dashboard</h1>
        <p className="text-gray-600">Overview of your restaurant</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-primary-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="h-12 w-12 text-green-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Delivery Agents</p>
              <p className="text-3xl font-bold">{stats.totalAgents}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary-500" />
            Top 5 Customers
          </h2>
        </div>
        {topCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No customers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topCustomers.map((customer, index) => (
              <div
                key={customer.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-primary-500'
                  }`}>
                    {customer.image ? (
                      <img src={customer.image} alt={customer.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      customer.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-center truncate">{customer.name}</p>
                <p className="text-sm text-gray-500 text-center">{customer.order_count} orders</p>
                <div className="mt-2 flex items-center justify-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    #{index + 1} Top Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary-500" />
            Menu Items
          </h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Item
          </button>
        </div>
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No menu items yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Add your first menu item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white group"
              >
                <div className="relative h-48 bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 className="h-5 w-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <span className="text-lg font-bold text-primary-600">{formatCurrency(item.unit_price)}</span>
                  </div>
                  {item.description && (
                    <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Edit Menu Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.unit_price}
                  onChange={(e) => setEditForm(prev => ({ ...prev, unit_price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-availability"
                  checked={editForm.availability}
                  onChange={(e) => setEditForm(prev => ({ ...prev, availability: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="edit-availability" className="text-sm text-gray-700">Available</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setEditForm)}
                      className="hidden"
                    />
                  </label>
                  {editForm.image && (
                    <img src={editForm.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-bold text-gray-900">Add Menu Item</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSh)</label>
                <input
                  type="number"
                  step="0.01"
                  value={addForm.unit_price}
                  onChange={(e) => setAddForm(prev => ({ ...prev, unit_price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-availability"
                  checked={addForm.availability}
                  onChange={(e) => setAddForm(prev => ({ ...prev, availability: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="add-availability" className="text-sm text-gray-700">Available</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setAddForm)}
                      className="hidden"
                    />
                  </label>
                  {addForm.image && (
                    <img src={addForm.image} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantDashboard;

