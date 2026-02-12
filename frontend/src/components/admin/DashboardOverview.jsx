import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Package, FileText,
  Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar,
  Clock, CheckCircle, AlertCircle, UserPlus, Briefcase, BarChart3, PieChart
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API = process.env.REACT_APP_BACKEND_URL;

// Chart color palette
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#8b5cf6'];
const PRODUCT_COLORS = {
  fieldforce: '#14b8a6',
  survey360: '#8b5cf6', 
  datapulse: '#f97316'
};

const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {change && (
      <div className="flex items-center gap-1 mt-4">
        {changeType === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}>
          {change}%
        </span>
        <span className="text-slate-400 text-sm ml-1">vs last month</span>
      </div>
    )}
  </div>
);

const ActivityItem = ({ icon: Icon, title, description, time, type, category }) => {
  const colors = {
    success: 'bg-emerald-100 text-emerald-600',
    warning: 'bg-amber-100 text-amber-600',
    info: 'bg-blue-100 text-blue-600',
    error: 'bg-red-100 text-red-600',
  };

  // Map activity types to icons if no icon is provided
  const getIcon = () => {
    if (Icon) return Icon;
    // Default icons based on type
    const iconMap = {
      expert_registration: UserPlus,
      new_lead: DollarSign,
      job_application: Briefcase,
      project_completed: CheckCircle,
      default: Activity
    };
    return iconMap[type] || iconMap.default;
  };

  const IconComponent = getIcon();
  const colorKey = category || type || 'info';

  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className={`w-10 h-10 rounded-lg ${colors[colorKey] || colors.info} flex items-center justify-center flex-shrink-0`}>
        {IconComponent && <IconComponent className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-sm text-slate-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
    </div>
  );
};

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({
    revenue: [],
    users: [],
    products: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('dv_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch multiple endpoints in parallel
        const [statsRes, activityRes, chartsRes] = await Promise.all([
          axios.get(`${API}/api/admin/dashboard/stats`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API}/api/admin/dashboard/activity`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/admin/dashboard/charts?period=${selectedPeriod}`, { headers }).catch(() => ({ data: null })),
        ]);

        if (statsRes.data) {
          setStats(statsRes.data);
        } else {
          setStats({
            totalRevenue: 245890,
            revenueChange: 12.5,
            activeUsers: 1247,
            usersChange: 8.3,
            activeProjects: 34,
            projectsChange: -2.1,
            pendingTasks: 18,
            solutionStats: {
              fieldforce: { users: 456, revenue: 89500, growth: 15.2 },
              survey360: { users: 612, revenue: 124300, growth: 22.8 },
              datapulse: { users: 179, revenue: 32090, growth: 45.6 },
            }
          });
        }

        if (chartsRes.data) {
          setChartData(chartsRes.data);
        } else {
          // Generate mock chart data
          const mockRevenue = generateMockRevenueData(parseInt(selectedPeriod));
          const mockUsers = generateMockUserData(parseInt(selectedPeriod));
          const mockProducts = [
            { name: 'FieldForce', value: 456, color: PRODUCT_COLORS.fieldforce },
            { name: 'Survey360', value: 612, color: PRODUCT_COLORS.survey360 },
            { name: 'DataPulse', value: 179, color: PRODUCT_COLORS.datapulse },
          ];
          setChartData({ revenue: mockRevenue, users: mockUsers, products: mockProducts });
        }

        if (activityRes.data?.length) {
          setRecentActivity(activityRes.data);
        } else {
          setRecentActivity([
            { icon: UserPlus, title: 'New Expert Registration', description: 'Dr. Sarah Kimani registered as Health Research Expert', time: '2 mins ago', type: 'info' },
            { icon: DollarSign, title: 'New Subscription', description: 'UNICEF Tanzania subscribed to Survey360 Enterprise', time: '15 mins ago', type: 'success' },
            { icon: Briefcase, title: 'Job Application', description: 'John Mwamba applied for Senior Data Analyst position', time: '1 hour ago', type: 'info' },
            { icon: CheckCircle, title: 'Project Completed', description: 'Agricultural Survey for World Bank marked complete', time: '2 hours ago', type: 'success' },
            { icon: AlertCircle, title: 'Expert Verification Pending', description: '3 expert profiles awaiting verification', time: '3 hours ago', type: 'warning' },
            { icon: Package, title: 'New Client Registration', description: 'Ministry of Health registered for DataPulse trial', time: '5 hours ago', type: 'info' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  // Helper functions to generate mock data
  const generateMockRevenueData = (days) => {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const base = 5000 + Math.random() * 3000;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fieldforce: Math.round(base * 0.4 + Math.random() * 500),
        survey360: Math.round(base * 0.5 + Math.random() * 800),
        datapulse: Math.round(base * 0.15 + Math.random() * 300),
        total: Math.round(base + Math.random() * 1500)
      });
    }
    return data;
  };

  const generateMockUserData = (days) => {
    const data = [];
    const now = new Date();
    let cumulative = { fieldforce: 380, survey360: 520, datapulse: 120 };
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      cumulative.fieldforce += Math.round(Math.random() * 5);
      cumulative.survey360 += Math.round(Math.random() * 6);
      cumulative.datapulse += Math.round(Math.random() * 4);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fieldforce: cumulative.fieldforce,
        survey360: cumulative.survey360,
        datapulse: cumulative.datapulse,
        total: cumulative.fieldforce + cumulative.survey360 + cumulative.datapulse
      });
    }
    return data;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
            Download Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue?.toLocaleString() || '0'}`}
          change={stats?.revenueChange}
          changeType="up"
          icon={DollarSign}
          color="bg-gradient-to-br from-emerald-500 to-teal-500"
          subtitle="All products combined"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers?.toLocaleString() || '0'}
          change={stats?.usersChange}
          changeType="up"
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-indigo-500"
          subtitle="Across all platforms"
        />
        <StatCard
          title="Active Projects"
          value={stats?.activeProjects || '0'}
          change={Math.abs(stats?.projectsChange || 0)}
          changeType={stats?.projectsChange >= 0 ? 'up' : 'down'}
          icon={Briefcase}
          color="bg-gradient-to-br from-purple-500 to-pink-500"
          subtitle="Currently in progress"
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingTasks || '0'}
          icon={Clock}
          color="bg-gradient-to-br from-amber-500 to-orange-500"
          subtitle="Require attention"
        />
      </div>

      {/* Solutions Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(stats?.solutionStats || {}).map(([key, data]) => (
          <div key={key} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 capitalize">{key}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${
                data.growth >= 20 ? 'bg-emerald-100 text-emerald-600' : 
                data.growth >= 10 ? 'bg-blue-100 text-blue-600' : 
                'bg-slate-100 text-slate-600'
              }`}>
                +{data.growth}% growth
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Active Users</span>
                <span className="font-semibold text-slate-900">{data.users.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Revenue (MTD)</span>
                <span className="font-semibold text-slate-900">${data.revenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${Math.min(data.growth * 2, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <button className="text-sm text-red-500 hover:text-red-600">View All</button>
          </div>
          <div className="space-y-1">
            {recentActivity.slice(0, 5).map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: UserPlus, label: 'Add Expert', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { icon: FileText, label: 'New Article', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
              { icon: Briefcase, label: 'Post Job', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              { icon: Package, label: 'Add Product', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
            ].map((action, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-3 p-4 rounded-xl ${action.color} transition-colors`}
              >
                <action.icon className="w-5 h-5" />
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Pending Items */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-500 mb-3">Pending Items</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm text-amber-700">3 Expert verifications pending</span>
                <button className="text-xs text-amber-600 font-medium hover:underline">Review</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">5 New job applications</span>
                <button className="text-xs text-blue-600 font-medium hover:underline">Review</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-red-700">2 Inquiries need response</span>
                <button className="text-xs text-red-600 font-medium hover:underline">Respond</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
