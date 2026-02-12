import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package, DollarSign, Users, TrendingUp, TrendingDown, Activity,
  BarChart3, Calendar, Download, Filter, Search, MoreVertical,
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Globe, Smartphone
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const SolutionsManagement = ({ subSection }) => {
  const [activeProduct, setActiveProduct] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    products: [
      { id: 'fieldforce', name: 'FieldForce', icon: Smartphone, color: 'from-sky-500 to-blue-500' },
      { id: 'survey360', name: 'Survey360', icon: BarChart3, color: 'from-emerald-500 to-teal-500' },
      { id: 'datapulse', name: 'DataPulse', icon: Activity, color: 'from-indigo-500 to-purple-500' },
    ],
    stats: {
      fieldforce: {
        revenue: 89500, revenueChange: 15.2,
        users: 456, usersChange: 8.4,
        activeSubscriptions: 234, subscriptionChange: 12.1,
        usage: 78, usageChange: 5.3,
        clients: [
          { name: 'World Bank', plan: 'Enterprise', users: 45, revenue: 12500, status: 'active' },
          { name: 'UNICEF Tanzania', plan: 'Professional', users: 28, revenue: 8400, status: 'active' },
          { name: 'GIZ', plan: 'Enterprise', users: 52, revenue: 14500, status: 'active' },
        ]
      },
      survey360: {
        revenue: 124300, revenueChange: 22.8,
        users: 612, usersChange: 14.2,
        activeSubscriptions: 312, subscriptionChange: 18.5,
        usage: 85, usageChange: 7.1,
        clients: [
          { name: 'USAID', plan: 'Enterprise', users: 89, revenue: 24500, status: 'active' },
          { name: 'Ministry of Health', plan: 'Professional', users: 34, revenue: 10200, status: 'active' },
          { name: 'Gates Foundation', plan: 'Enterprise', users: 67, revenue: 18600, status: 'active' },
        ]
      },
      datapulse: {
        revenue: 32090, revenueChange: 45.6,
        users: 179, usersChange: 32.1,
        activeSubscriptions: 89, subscriptionChange: 28.4,
        usage: 62, usageChange: 15.8,
        clients: [
          { name: 'WHO Africa', plan: 'Enterprise', users: 23, revenue: 8500, status: 'active' },
          { name: 'FAO', plan: 'Professional', users: 18, revenue: 5400, status: 'trial' },
        ]
      }
    }
  });

  const calculateTotal = (metric) => {
    return Object.values(data.stats).reduce((sum, product) => sum + (product[metric] || 0), 0);
  };

  const renderProductsOverview = () => (
    <div className="space-y-6">
      {/* Product Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1 inline-flex">
        <button
          onClick={() => setActiveProduct('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeProduct === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Products
        </button>
        {data.products.map(product => (
          <button
            key={product.id}
            onClick={() => setActiveProduct(product.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeProduct === product.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeProduct === 'all' ? (
          <>
            <StatCard title="Total Revenue" value={`$${calculateTotal('revenue').toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
            <StatCard title="Total Users" value={calculateTotal('users').toLocaleString()} icon={Users} color="bg-blue-500" />
            <StatCard title="Active Subscriptions" value={calculateTotal('activeSubscriptions')} icon={Package} color="bg-purple-500" />
            <StatCard title="Avg Usage Rate" value={`${Math.round((data.stats.fieldforce.usage + data.stats.survey360.usage + data.stats.datapulse.usage) / 3)}%`} icon={Activity} color="bg-amber-500" />
          </>
        ) : (
          <>
            <StatCard 
              title="Revenue (MTD)" 
              value={`$${data.stats[activeProduct]?.revenue.toLocaleString()}`} 
              change={data.stats[activeProduct]?.revenueChange}
              icon={DollarSign} 
              color="bg-emerald-500" 
            />
            <StatCard 
              title="Active Users" 
              value={data.stats[activeProduct]?.users.toLocaleString()} 
              change={data.stats[activeProduct]?.usersChange}
              icon={Users} 
              color="bg-blue-500" 
            />
            <StatCard 
              title="Subscriptions" 
              value={data.stats[activeProduct]?.activeSubscriptions} 
              change={data.stats[activeProduct]?.subscriptionChange}
              icon={Package} 
              color="bg-purple-500" 
            />
            <StatCard 
              title="Usage Rate" 
              value={`${data.stats[activeProduct]?.usage}%`} 
              change={data.stats[activeProduct]?.usageChange}
              icon={Activity} 
              color="bg-amber-500" 
            />
          </>
        )}
      </div>

      {/* Product Cards */}
      {activeProduct === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.products.map(product => {
            const stats = data.stats[product.id];
            return (
              <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${product.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                        <product.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500">Revenue</p>
                      <p className="text-lg font-semibold">${stats.revenue.toLocaleString()}</p>
                      <span className={`text-xs ${stats.revenueChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Users</p>
                      <p className="text-lg font-semibold">{stats.users}</p>
                      <span className={`text-xs ${stats.usersChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {stats.usersChange >= 0 ? '+' : ''}{stats.usersChange}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Usage Rate</span>
                      <span className="text-sm font-medium">{stats.usage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${product.color}`}
                        style={{ width: `${stats.usage}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveProduct(product.id)}
                    className="w-full mt-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Client List for Selected Product */}
      {activeProduct !== 'all' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Client Registrations</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search clients..." 
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
              </div>
              <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.stats[activeProduct]?.clients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.plan === 'Enterprise' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {client.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{client.users}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${client.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderRevenueTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Revenue Tracking</h2>
        <div className="flex items-center gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">This Year</option>
          </select>
          <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Total Revenue (MTD)</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">${calculateTotal('revenue').toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-500">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">18.5% vs last month</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">MRR (Monthly Recurring)</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">$78,450</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-500">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">12.3% growth</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">ARR (Annual)</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">$941,400</p>
          <div className="flex items-center gap-1 mt-2 text-emerald-500">
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-sm">On track for $1M</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Avg Revenue Per User</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">$197</p>
          <div className="flex items-center gap-1 mt-2 text-blue-500">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Stable</span>
          </div>
        </div>
      </div>

      {/* Revenue by Product */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Revenue by Product</h3>
        <div className="space-y-4">
          {data.products.map(product => {
            const stats = data.stats[product.id];
            const percentage = Math.round((stats.revenue / calculateTotal('revenue')) * 100);
            return (
              <div key={product.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${product.color}`}></div>
                    <span className="text-sm font-medium text-slate-700">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">${stats.revenue.toLocaleString()}</span>
                    <span className="text-sm text-slate-400 ml-2">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${product.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderUsageAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Usage Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.products.map(product => {
          const stats = data.stats[product.id];
          return (
            <div key={product.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                  <product.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{product.name}</h3>
                  <p className="text-sm text-slate-500">{stats.users} active users</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Daily Active Users</span>
                    <span className="font-medium">{Math.round(stats.users * 0.65)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Feature Adoption</span>
                    <span className="font-medium">{stats.usage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${stats.usage}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Data Sync Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPricingPlans = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Pricing & Plans</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
          Add New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Starter', 'Professional', 'Enterprise'].map((plan, idx) => (
          <div key={plan} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{plan}</h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              ${[99, 299, 999][idx]}
              <span className="text-sm font-normal text-slate-400">/month</span>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">{[45, 156, 89][idx]} active subscriptions</p>
              <p className="text-sm text-slate-500">${[4455, 46644, 88911][idx].toLocaleString()} MRR</p>
            </div>
            <button className="w-full mt-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Render based on sub-section
  const renderContent = () => {
    switch (subSection) {
      case 'revenue':
        return renderRevenueTracking();
      case 'usage':
        return renderUsageAnalytics();
      case 'pricing':
        return renderPricingPlans();
      case 'clients':
      case 'products':
      default:
        return renderProductsOverview();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Solutions Management</h1>
        <p className="text-slate-500 mt-1">Monitor and manage your software products</p>
      </div>
      {renderContent()}
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {change >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            )}
            <span className={change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default SolutionsManagement;
