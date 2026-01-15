import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Award,
  ShoppingBag,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  PackageCheck,
  PackageX,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback";

export function RestaurantDashboard() {
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    available: true,
  });

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      image:
        "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
      description: "Classic tomato sauce, mozzarella, and fresh basil",
      price: 1200,
      available: true,
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
      description: "Loaded with pepperoni and extra cheese",
      price: 1500,
      available: true,
    },
    {
      id: 3,
      name: "BBQ Chicken Pizza",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
      description: "BBQ sauce, grilled chicken, onions, and cilantro",
      price: 1600,
      available: false,
    },
    {
      id: 4,
      name: "Veggie Supreme",
      image:
        "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400",
      description: "Bell peppers, mushrooms, olives, and onions",
      price: 1300,
      available: true,
    },
    {
      id: 5,
      name: "Hawaiian Pizza",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
      description: "Ham, pineapple, and mozzarella cheese",
      price: 1400,
      available: true,
    },
    {
      id: 6,
      name: "Meat Lovers",
      image:
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400",
      description: "Pepperoni, sausage, bacon, and ham",
      price: 1800,
      available: true,
    },
  ]);

  const [editFormData, setEditFormData] = useState(null);

  const [topCustomers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      orders: 45,
      totalSpent: 54000,
      phone: "+254 712 345 678",
    },
    {
      id: 2,
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      orders: 38,
      totalSpent: 45600,
      phone: "+254 723 456 789",
    },
    {
      id: 3,
      name: "Emily Williams",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      orders: 32,
      totalSpent: 38400,
      phone: "+254 734 567 890",
    },
    {
      id: 4,
      name: "James Brown",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      orders: 28,
      totalSpent: 33600,
      phone: "+254 745 678 901",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      orders: 25,
      totalSpent: 30000,
      phone: "+254 756 789 012",
    },
  ]);

  const stats = {
    newOrders: 12,
    deliveredOrders: 1245,
    totalPayments: 1493000,
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewMenuItem({ ...newMenuItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && editFormData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({ ...editFormData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMenuItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: menuItems.length + 1,
      name: newMenuItem.name,
      image:
        imagePreview ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
      description: newMenuItem.description,
      price: parseFloat(newMenuItem.price),
      available: newMenuItem.available,
    };
    setMenuItems([...menuItems, newItem]);
    setNewMenuItem({ name: "", image: "", description: "", price: "", available: true });
    setImagePreview(null);
    setShowAddMenuItem(false);
    alert("Menu item added successfully!");
  };

  const handleDeleteMenuItem = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditFormData({ ...item });
  };

  const handleSaveEdit = (id) => {
    if (editFormData) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === id ? { ...item, ...editFormData } : item
        )
      );
      setEditingItemId(null);
      setEditFormData(null);
      alert("Menu item updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditFormData(null);
  };

  // -------------------------- JSX --------------------------
  if (showAddMenuItem) {
    return (
      <div className="mb-8">
        <button
          onClick={() => {
            setShowAddMenuItem(false);
            setNewMenuItem({ name: "", image: "", description: "", price: "", available: true });
            setImagePreview(null);
          }}
          className="flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Add New Menu Item</h2>
        <p className="text-gray-600">Fill in the details to add a new dish</p>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 max-w-3xl">
          <form onSubmit={handleAddMenuItem} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Dish Image</label>
              <div className="flex items-center gap-6">
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-[#F20519]">
                    <img src={imagePreview} alt="Dish preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all">
                    <Upload className="w-5 h-5" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Recommended: High quality image showing the dish</p>
                </div>
              </div>
            </div>

            {/* Dish Name */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Dish Name *</label>
              <input
                type="text"
                required
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519]"
                placeholder="Enter dish name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Description *</label>
              <textarea
                required
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519]"
                rows={3}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">Unit Price (KSh) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F20519]" />
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newMenuItem.price}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519]"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={newMenuItem.available}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, available: e.target.checked })}
                className="w-5 h-5 text-[#F20519] focus:ring-[#F20519] rounded"
              />
              <label className="text-sm font-bold text-[#A60311]">Mark as available</label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddMenuItem(false);
                  setNewMenuItem({ name: "", image: "", description: "", price: "", available: true });
                  setImagePreview(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Menu Item
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dashboard Stats, Top Customers, and Menu Items Sections */}
      {/* The rest of the JSX can remain the same as your original code */}
    </>
  );
}
