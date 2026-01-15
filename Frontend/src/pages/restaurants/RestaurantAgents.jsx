import React, { useState } from 'react';
import { Users, Plus, Trash2, Mail, Phone, Upload, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../../components/ImageWithFallback';

export function RestaurantAgentsPage() {
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [agentImagePreview, setAgentImagePreview] = useState(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    contact: '',
    image: '',
  });

  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'David Martinez',
      email: 'david.m@delivery.com',
      contact: '+254 701 234 567',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
    {
      id: 2,
      name: 'Sophie Taylor',
      email: 'sophie.t@delivery.com',
      contact: '+254 702 345 678',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    },
    {
      id: 3,
      name: 'Kevin Wilson',
      email: 'kevin.w@delivery.com',
      contact: '+254 703 456 789',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    },
  ]);

  const handleAgentImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAgentImagePreview(reader.result);
        setNewAgent({ ...newAgent, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAgent = (e) => {
    e.preventDefault();
    const agent = {
      id: agents.length + 1,
      name: newAgent.name,
      email: newAgent.email,
      contact: newAgent.contact,
      image:
        agentImagePreview ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    };
    setAgents([...agents, agent]);
    setNewAgent({
      name: '',
      email: '',
      contact: '',
      image: '',
    });
    setAgentImagePreview(null);
    setShowAddAgent(false);
    alert('Delivery agent added successfully!');
  };

  const handleDeleteAgent = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setAgents(agents.filter((agent) => agent.id !== id));
    }
  };

  if (showAddAgent) {
    return (
      <>
        <div className="mb-8">
          <button
            onClick={() => {
              setShowAddAgent(false);
              setNewAgent({ name: '', email: '', contact: '', image: '' });
              setAgentImagePreview(null);
            }}
            className="flex items-center gap-2 text-[#F20519] hover:text-[#A60311] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Agents
          </button>
          <h2 className="text-3xl font-bold text-[#A60311] mb-2">Add New Agent</h2>
          <p className="text-gray-600">Add a delivery agent to your team</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 max-w-3xl">
          <form onSubmit={handleAddAgent} className="space-y-6">
            {/* Agent Photo */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Agent Photo
              </label>
              <div className="flex items-center gap-6">
                {agentImagePreview ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#F20519]">
                    <img
                      src={agentImagePreview}
                      alt="Agent preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all">
                    <Upload className="w-5 h-5" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAgentImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a clear photo of the agent
                  </p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newAgent.name}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                placeholder="Enter agent's full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newAgent.email}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                placeholder="agent@example.com"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-bold text-[#A60311] mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                required
                value={newAgent.contact}
                onChange={(e) =>
                  setNewAgent({ ...newAgent, contact: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F20519] focus:border-transparent"
                placeholder="+254 700 000 000"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddAgent(false);
                  setNewAgent({ name: '', email: '', contact: '', image: '' });
                  setAgentImagePreview(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Agent
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  // Main Agents List
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#A60311] mb-2">Delivery Agents</h2>
        <p className="text-gray-600">Manage your delivery team</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#F20519]" />
            <h3 className="text-2xl font-bold text-[#A60311]">Active Agents</h3>
          </div>
          <button
            onClick={() => setShowAddAgent(true)}
            className="bg-gradient-to-r from-[#F20519] to-[#F20530] text-white px-6 py-3 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Agent
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gradient-to-br from-[#F2F2F2] to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#F20519]/20"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D9895B] mb-4">
                  <ImageWithFallback
                    src={agent.image}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-[#A60311] mb-2">{agent.name}</h4>
                <div className="space-y-2 w-full mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-[#F20519]" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-[#F20519]" />
                    <span>{agent.contact}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAgent(agent.id, agent.name)}
                  className="w-full bg-gradient-to-r from-[#F20519] to-[#F20530] text-white py-2.5 rounded-xl hover:from-[#A60311] hover:to-[#F20519] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Agent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
