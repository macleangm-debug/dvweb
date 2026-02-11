import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, CreditCard, Settings, User,
  ExternalLink, ChevronRight, MapPin, FileText, BarChart3,
  Clock, Users, HardDrive, Zap, Bell, LogOut, Check,
  ArrowUpRight, Download, Eye
} from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Product Card Component
const ProductCard = ({ product, isActive }) => {
  const productConfig = {
    fieldforce: {
      name: 'FieldForce',
      description: 'Mobile Data Collection Platform',
      icon: MapPin,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      link: '/solutions/fieldforce/app/dashboard',
      features: ['Offline Data Collection', 'GPS Tracking', 'Photo Capture', 'Real-time Sync']
    },
    survey360: {
      name: 'Survey360',
      description: 'Survey Management Platform',
      icon: FileText,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-600',
      link: '/solutions/survey360/app/dashboard',
      features: ['Drag & Drop Builder', 'Real-time Analytics', 'Multi-language', 'Advanced Logic']
    }
  };

  const config = productConfig[product.type] || productConfig.fieldforce;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl border overflow-hidden ${
        isActive ? 'border-green-200 shadow-lg' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} p-6 text-white`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{config.name}</h3>
              <p className="text-white/80 text-sm">{config.description}</p>
            </div>
          </div>
          {isActive && (
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Active
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Plan Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <p className="font-semibold text-gray-900">{product.plan || 'Professional'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Renews</p>
            <p className="font-semibold text-gray-900">{product.renewDate || 'Mar 15, 2026'}</p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{product.usage?.submissions || '1.2K'}</p>
            <p className="text-xs text-gray-500">{product.type === 'survey360' ? 'Responses' : 'Submissions'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{product.usage?.projects || '8'}</p>
            <p className="text-xs text-gray-500">{product.type === 'survey360' ? 'Surveys' : 'Projects'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{product.usage?.team || '5'}</p>
            <p className="text-xs text-gray-500">Team Members</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link
            to={config.link}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-medium hover:opacity-90 transition-opacity`}
          >
            Open Dashboard <ExternalLink className="w-4 h-4" />
          </Link>
          <Link
            to={`${config.link.replace('/dashboard', '/settings')}`}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, change, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      {change && (
        <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

// Billing History Item
const BillingItem = ({ invoice }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
        <CreditCard className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900">{invoice.description}</p>
        <p className="text-sm text-gray-500">{invoice.date}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="font-semibold text-gray-900">${invoice.amount}</span>
      <button className="p-2 text-gray-400 hover:text-gray-600">
        <Download className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Main User Dashboard Component
const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('datavision_token') || localStorage.getItem('dv_token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);

      // Mock products data - replace with actual API
      setProducts([
        {
          type: 'fieldforce',
          plan: 'Professional',
          renewDate: 'Mar 15, 2026',
          status: 'active',
          usage: { submissions: '1,247', projects: '8', team: '5' }
        },
        {
          type: 'survey360',
          plan: 'Starter',
          renewDate: 'Apr 1, 2026',
          status: 'active',
          usage: { submissions: '892', projects: '12', team: '3' }
        }
      ]);

      // Mock billing history
      setBillingHistory([
        { id: 1, description: 'FieldForce Professional - Monthly', date: 'Feb 15, 2026', amount: '49.00' },
        { id: 2, description: 'Survey360 Starter - Monthly', date: 'Feb 1, 2026', amount: '29.00' },
        { id: 3, description: 'FieldForce Professional - Monthly', date: 'Jan 15, 2026', amount: '49.00' },
      ]);

    } catch (error) {
      console.error('Error loading user data:', error);
      // Demo mode with mock data
      setUser({
        name: 'Demo User',
        email: 'demo@datavision.co.tz',
        products_accessed: ['fieldforce', 'survey360']
      });
      setProducts([
        { type: 'fieldforce', plan: 'Professional', status: 'active', usage: { submissions: '1,247', projects: '8', team: '5' } },
        { type: 'survey360', plan: 'Starter', status: 'active', usage: { submissions: '892', projects: '12', team: '3' } }
      ]);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('datavision_token');
    localStorage.removeItem('dv_token');
    localStorage.removeItem('auth-storage');
    navigate('/auth/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <img src="/datavision-logo-cropped.png" alt="DataVision" className="h-8" />
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-600">My Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p className="text-blue-100">Here's an overview of your DataVision products and activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard icon={Package} label="Active Products" value={products.length} color="blue" />
              <StatsCard icon={BarChart3} label="Total Submissions" value="2.1K" change={12} color="green" />
              <StatsCard icon={Users} label="Team Members" value="8" color="purple" />
              <StatsCard icon={HardDrive} label="Storage Used" value="2.4 GB" color="orange" />
            </div>

            {/* Products Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
                <Link to="/solutions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Browse more products <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product, index) => (
                  <ProductCard key={index} product={product} isActive={product.status === 'active'} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  to="/solutions/fieldforce/app/forms/new"
                  className="flex flex-col items-center gap-2 p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <span className="text-sm font-medium text-teal-700">New Form</span>
                </Link>
                <Link
                  to="/solutions/survey360/app/surveys/new"
                  className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-700">New Survey</span>
                </Link>
                <Link
                  to="/dashboard?tab=billing"
                  onClick={() => setActiveTab('billing')}
                  className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-700">View Billing</span>
                </Link>
                <Link
                  to="/dashboard?tab=settings"
                  onClick={() => setActiveTab('settings')}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
              <Link
                to="/solutions"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Add Product
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} product={product} isActive={product.status === 'active'} />
              ))}
            </div>
            {products.length === 0 && (
              <div className="bg-white rounded-xl border p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-500 mb-4">Explore our software solutions to get started</p>
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Browse Products <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Billing & Payments</h2>
            
            {/* Current Plan Summary */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-900 mb-4">Active Subscriptions</h3>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        product.type === 'fieldforce' ? 'bg-teal-100' : 'bg-purple-100'
                      }`}>
                        {product.type === 'fieldforce' 
                          ? <MapPin className="w-5 h-5 text-teal-600" />
                          : <FileText className="w-5 h-5 text-purple-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.type === 'fieldforce' ? 'FieldForce' : 'Survey360'} - {product.plan}
                        </p>
                        <p className="text-sm text-gray-500">Renews {product.renewDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        ${product.type === 'fieldforce' ? '49' : '29'}/mo
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-700">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Payment Method</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Update</button>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/27</p>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Billing History</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Download All</button>
              </div>
              <div className="divide-y">
                {billingHistory.map((invoice) => (
                  <BillingItem key={invoice.id} invoice={invoice} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            
            {/* Profile */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-900 mb-4">Profile Information</h3>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      <input
                        type="text"
                        defaultValue={user?.organization || ''}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={user?.phone || ''}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-900 mb-4">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">Change Password</button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-medium text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates about your products</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Marketing Emails</p>
                    <p className="text-sm text-gray-500">Receive news and special offers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-200 p-6">
              <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-medium hover:bg-red-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
