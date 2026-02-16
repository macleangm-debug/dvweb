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

const DashboardOverview = ({ subSection = 'overview' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState({
    revenue: [],
    users: [],
    products: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: [],
    userSources: [],
    topPages: [],
    conversionFunnel: [],
    deviceBreakdown: [],
    geoData: []
  });

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
              <p className="text-sm text-slate-500">Daily revenue by product</p>
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData.revenue} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorFieldforce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRODUCT_COLORS.fieldforce} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={PRODUCT_COLORS.fieldforce} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSurvey360" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRODUCT_COLORS.survey360} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={PRODUCT_COLORS.survey360} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDatapulse" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRODUCT_COLORS.datapulse} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={PRODUCT_COLORS.datapulse} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="fieldforce" name="FieldForce" stroke={PRODUCT_COLORS.fieldforce} fillOpacity={1} fill="url(#colorFieldforce)" />
              <Area type="monotone" dataKey="survey360" name="Survey360" stroke={PRODUCT_COLORS.survey360} fillOpacity={1} fill="url(#colorSurvey360)" />
              <Area type="monotone" dataKey="datapulse" name="DataPulse" stroke={PRODUCT_COLORS.datapulse} fillOpacity={1} fill="url(#colorDatapulse)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">User Growth</h3>
              <p className="text-sm text-slate-500">Cumulative users by product</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRODUCT_COLORS.fieldforce }}></div>
                <span className="text-xs text-slate-500">FieldForce</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRODUCT_COLORS.survey360 }}></div>
                <span className="text-xs text-slate-500">Survey360</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PRODUCT_COLORS.datapulse }}></div>
                <span className="text-xs text-slate-500">DataPulse</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData.users} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="fieldforce" name="FieldForce" stroke={PRODUCT_COLORS.fieldforce} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="survey360" name="Survey360" stroke={PRODUCT_COLORS.survey360} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="datapulse" name="DataPulse" stroke={PRODUCT_COLORS.datapulse} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Distribution & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RechartsPie>
              <Pie
                data={chartData.products}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.products.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Users']} />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {chartData.products.map((product, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }}></div>
                <span className="text-xs text-slate-600">{product.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Product Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue by Product (MTD)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart 
              data={[
                { name: 'FieldForce', revenue: stats?.solutionStats?.fieldforce?.revenue || 89500, color: PRODUCT_COLORS.fieldforce },
                { name: 'Survey360', revenue: stats?.solutionStats?.survey360?.revenue || 124300, color: PRODUCT_COLORS.survey360 },
                { name: 'DataPulse', revenue: stats?.solutionStats?.datapulse?.revenue || 32090, color: PRODUCT_COLORS.datapulse },
              ]} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(v) => `$${v/1000}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {[
                  { name: 'FieldForce', color: PRODUCT_COLORS.fieldforce },
                  { name: 'Survey360', color: PRODUCT_COLORS.survey360 },
                  { name: 'DataPulse', color: PRODUCT_COLORS.datapulse },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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

  // Analytics Section Component
  const AnalyticsView = () => {
    // Generate mock analytics data
    const mockPageViews = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      mockPageViews.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.round(1000 + Math.random() * 2000),
        uniqueVisitors: Math.round(600 + Math.random() * 1200),
        bounceRate: Math.round(30 + Math.random() * 25)
      });
    }

    const mockTrafficSources = [
      { name: 'Organic Search', value: 45, color: '#22c55e' },
      { name: 'Direct', value: 25, color: '#3b82f6' },
      { name: 'Social Media', value: 15, color: '#8b5cf6' },
      { name: 'Referral', value: 10, color: '#f97316' },
      { name: 'Email', value: 5, color: '#ef4444' },
    ];

    const mockTopPages = [
      { page: '/solutions/fieldforce', views: 4523, avgTime: '3:45', bounce: '32%' },
      { page: '/solutions/survey360', views: 3821, avgTime: '4:12', bounce: '28%' },
      { page: '/', views: 3654, avgTime: '2:15', bounce: '45%' },
      { page: '/about', views: 2134, avgTime: '2:58', bounce: '38%' },
      { page: '/contact', views: 1876, avgTime: '1:45', bounce: '52%' },
      { page: '/careers', views: 1543, avgTime: '3:22', bounce: '35%' },
    ];

    const mockDeviceData = [
      { name: 'Desktop', value: 58, color: '#3b82f6' },
      { name: 'Mobile', value: 35, color: '#22c55e' },
      { name: 'Tablet', value: 7, color: '#f97316' },
    ];

    const mockGeoData = [
      { country: 'Tanzania', visitors: 4521, percentage: 38 },
      { country: 'Kenya', visitors: 2134, percentage: 18 },
      { country: 'Uganda', visitors: 1876, percentage: 16 },
      { country: 'Rwanda', visitors: 1234, percentage: 10 },
      { country: 'Ethiopia', visitors: 987, percentage: 8 },
      { country: 'Other', visitors: 1189, percentage: 10 },
    ];

    const mockConversionFunnel = [
      { stage: 'Website Visits', value: 12450, percentage: 100 },
      { stage: 'Product Page Views', value: 6225, percentage: 50 },
      { stage: 'Demo Requests', value: 935, percentage: 7.5 },
      { stage: 'Trial Signups', value: 467, percentage: 3.8 },
      { stage: 'Paid Conversions', value: 187, percentage: 1.5 },
    ];

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-500 mt-1">Detailed insights into user behavior and traffic</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
            <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Total Page Views</div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">48,234</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">12.5%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Unique Visitors</div>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">12,847</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">8.3%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Avg. Session Duration</div>
              <Clock className="w-5 h-5 text-teal-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">3:24</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">5.2%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Bounce Rate</div>
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2">38.2%</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">-3.1%</span>
              <span className="text-slate-400">vs last period</span>
            </div>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Page Views & Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockPageViews}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources & Device Breakdown */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Traffic Sources</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={180} height={180}>
                <RechartsPie>
                  <Pie
                    data={mockTrafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockTrafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {mockTrafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                      <span className="text-sm text-slate-600">{source.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{source.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Device Breakdown</h3>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width={180} height={180}>
                <RechartsPie>
                  <Pie
                    data={mockDeviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockDeviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="flex-1 space-y-4">
                {mockDeviceData.map((device, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">{device.name}</span>
                      <span className="text-sm font-semibold text-slate-900">{device.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${device.value}%`, backgroundColor: device.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages & Conversion Funnel */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Pages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase py-3">Page</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase py-3">Views</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase py-3">Avg Time</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase py-3">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopPages.map((page, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 text-sm text-slate-900 font-medium truncate max-w-[200px]">{page.page}</td>
                      <td className="py-3 text-sm text-slate-600 text-right">{page.views.toLocaleString()}</td>
                      <td className="py-3 text-sm text-slate-600 text-right">{page.avgTime}</td>
                      <td className="py-3 text-sm text-slate-600 text-right">{page.bounce}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              {mockConversionFunnel.map((stage, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{stage.stage}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-900">{stage.value.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 ml-2">({stage.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Geographic Distribution</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockGeoData.map((country, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{country.country}</p>
                  <p className="text-sm text-slate-500">{country.visitors.toLocaleString()} visitors</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Activity Log View
  const ActivityView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recent Activity</h1>
          <p className="text-slate-500 mt-1">Track all system activity and user actions</p>
        </div>
        <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">
          Export Log
        </button>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 text-sm border border-slate-200 rounded-lg">
              <option>All Categories</option>
              <option>User Actions</option>
              <option>System Events</option>
              <option>Admin Actions</option>
            </select>
            <input 
              type="text" 
              placeholder="Search activity..."
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              title={activity.title}
              description={activity.description}
              time={activity.time}
              type={activity.type}
              category={activity.category}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Render based on subSection
  if (subSection === 'analytics') {
    return <AnalyticsView />;
  }

  if (subSection === 'activity') {
    return <ActivityView />;
  }

  // Default Overview
  const OverviewContent = (
