import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Database,
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  Play,
  Building2,
  Users,
  Wifi,
  WifiOff,
  ChevronRight,
  Menu,
  X,
  FileText,
  Map,
  Globe,
  Lock,
  Zap,
  Server,
  Brain,
  Layers,
  GitBranch,
  Workflow,
  PieChart,
  TrendingUp,
  LineChart,
  RefreshCw,
  Filter,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

// Interactive Demo Components
const RealTimeMetricsDemo = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 1247,
    dataPoints: 45892,
    apiCalls: 8934,
    responseTime: 42
  });
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 3,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100),
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 50),
        responseTime: Math.max(20, Math.min(80, prev.responseTime + Math.floor(Math.random() * 10) - 5))
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Real-Time Metrics Dashboard
        </h3>
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 ${isLive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-700 text-slate-400'}`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
          {isLive ? 'Live' : 'Paused'}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Active Users</div>
          <div className="text-2xl font-bold text-indigo-400">{metrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-green-400 mt-1">↑ 12% from last hour</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Data Points</div>
          <div className="text-2xl font-bold text-purple-400">{metrics.dataPoints.toLocaleString()}</div>
          <div className="text-xs text-green-400 mt-1">↑ 8% from last hour</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">API Calls/min</div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.apiCalls.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Avg: 8,500/min</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Response Time</div>
          <div className="text-2xl font-bold text-amber-400">{metrics.responseTime}ms</div>
          <div className="text-xs text-green-400 mt-1">Target: &lt;50ms</div>
        </div>
      </div>

      {/* Mini Chart Visualization */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Traffic Overview (Last 24h)</span>
          <LineChart className="w-4 h-4 text-slate-500" />
        </div>
        <div className="flex items-end h-20 gap-1">
          {[35, 45, 40, 55, 70, 65, 80, 75, 90, 85, 95, 88, 78, 82, 90, 95, 88, 92, 85, 80, 75, 82, 88, 92].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DataIntegrationDemo = () => {
  const [connections, setConnections] = useState([
    { name: 'PostgreSQL', status: 'connected', latency: '12ms', icon: Database },
    { name: 'MongoDB', status: 'connected', latency: '8ms', icon: Server },
    { name: 'REST API', status: 'connected', latency: '45ms', icon: Globe },
    { name: 'Kafka Stream', status: 'syncing', latency: '23ms', icon: Activity }
  ]);
  const [testResult, setTestResult] = useState(null);

  const testConnection = (name) => {
    setTestResult({ name, status: 'testing' });
    setTimeout(() => {
      setTestResult({ name, status: 'success', message: `${name} connection verified successfully!` });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          Data Source Connections
        </h3>
        <button className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Sync All
        </button>
      </div>

      <div className="space-y-3">
        {connections.map((conn, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                <conn.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="font-medium">{conn.name}</div>
                <div className="text-xs text-slate-400">Latency: {conn.latency}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs ${conn.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {conn.status === 'connected' ? '● Connected' : '◐ Syncing'}
              </span>
              <button 
                onClick={() => testConnection(conn.name)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${testResult.status === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-indigo-500/10 border border-indigo-500/30'}`}>
          {testResult.status === 'testing' ? (
            <>
              <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="text-indigo-400">Testing {testResult.name} connection...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">{testResult.message}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const KPIDashboardDemo = () => {
  const kpis = [
    { name: 'Revenue', value: '$124,500', target: '$120,000', progress: 104, trend: 'up' },
    { name: 'Conversion Rate', value: '3.2%', target: '3.0%', progress: 107, trend: 'up' },
    { name: 'Customer Satisfaction', value: '4.6/5', target: '4.5/5', progress: 92, trend: 'up' },
    { name: 'Response Time', value: '1.2h', target: '2h', progress: 160, trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          KPI Performance Dashboard
        </h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm">
          <option>This Month</option>
          <option>Last Month</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{kpi.name}</span>
              <span className={`text-xs ${kpi.progress >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
                {kpi.progress >= 100 ? '✓ On Track' : '⚠ Below Target'}
              </span>
            </div>
            <div className="text-2xl font-bold mb-2">{kpi.value}</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${kpi.progress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                style={{ width: `${Math.min(kpi.progress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">Target: {kpi.target}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AlertsDemo = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'API response time exceeded threshold', time: '2 min ago', acknowledged: false },
    { id: 2, type: 'info', message: 'New data source connected: Salesforce', time: '15 min ago', acknowledged: true },
    { id: 3, type: 'success', message: 'Daily backup completed successfully', time: '1 hour ago', acknowledged: true },
    { id: 4, type: 'error', message: 'Failed to sync with external API', time: '2 hours ago', acknowledged: false }
  ]);

  const acknowledgeAlert = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-indigo-400" />
          System Alerts & Notifications
        </h3>
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
          {alerts.filter(a => !a.acknowledged).length} Unacknowledged
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`bg-slate-800/50 border rounded-xl p-4 flex items-center justify-between ${
              alert.type === 'error' ? 'border-red-500/30' :
              alert.type === 'warning' ? 'border-amber-500/30' :
              alert.type === 'success' ? 'border-green-500/30' : 'border-slate-700'
            } ${alert.acknowledged ? 'opacity-60' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                alert.type === 'error' ? 'bg-red-500/20' :
                alert.type === 'warning' ? 'bg-amber-500/20' :
                alert.type === 'success' ? 'bg-green-500/20' : 'bg-indigo-500/20'
              }`}>
                {alert.type === 'error' ? <X className="w-4 h-4 text-red-400" /> :
                 alert.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                 alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                 <Activity className="w-4 h-4 text-indigo-400" />}
              </div>
              <div>
                <div className="text-sm">{alert.message}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.time}
                </div>
              </div>
            </div>
            {!alert.acknowledged && (
              <button 
                onClick={() => acknowledgeAlert(alert.id)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DataPulseLandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState('metrics');

  const stats = [
    { value: '10M+', label: 'Data points collected' },
    { value: '50+', label: 'Countries served' },
    { value: '99.9%', label: 'Uptime guarantee' },
    { value: '500+', label: 'Organizations' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Design & Configure',
      description: 'Build complex forms with advanced logic, validations, and multi-language support.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      step: 2,
      title: 'Deploy Anywhere',
      description: 'Deploy to field teams with offline-first capabilities and GPS tracking.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      step: 3,
      title: 'Monitor Quality',
      description: 'AI-powered quality monitoring ensures data integrity in real-time.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      step: 4,
      title: 'Analyze & Report',
      description: 'Advanced analytics, statistical analysis, and automated reporting.',
      color: 'from-rose-500 to-pink-500'
    }
  ];

  const features = [
    { icon: Database, title: 'Enterprise Data Collection', description: 'Handle millions of records with enterprise-grade infrastructure.' },
    { icon: WifiOff, title: 'Offline-First Architecture', description: 'Full functionality without internet. Auto-sync when connected.' },
    { icon: Brain, title: 'AI Quality Monitoring', description: 'Machine learning detects anomalies and ensures data quality.' },
    { icon: GitBranch, title: 'Complex Skip Logic', description: 'Nested conditions, calculated fields, and dynamic forms.' },
    { icon: Map, title: 'GPS & Geofencing', description: 'Location validation, route tracking, and area restrictions.' },
    { icon: Layers, title: 'Multi-Language (EN/SW)', description: 'Full localization support including Swahili.' },
    { icon: Workflow, title: 'CATI/CAPI Integration', description: 'Computer-assisted interviewing for phone and in-person surveys.' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with role-based access control.' }
  ];

  const useCases = [
    { icon: Building2, title: 'Development Organizations', description: 'Monitor & Evaluate programs, track indicators, and measure impact across large-scale development initiatives.', tags: ['M&E Systems', 'Impact Evaluation', 'Indicator Tracking'] },
    { icon: BarChart3, title: 'Research Institutions', description: 'Conduct rigorous quantitative and qualitative research with robust data collection methodologies.', tags: ['Academic Research', 'Policy Studies', 'Statistical Analysis'] },
    { icon: Users, title: 'Government Agencies', description: 'National surveys, census operations, and public service monitoring at scale.', tags: ['Census Operations', 'Public Services', 'National Statistics'] },
    { icon: TrendingUp, title: 'Market Research', description: 'Large-scale consumer studies with quality controls and advanced sampling methodologies.', tags: ['Consumer Studies', 'Brand Research', 'Market Analysis'] }
  ];

  const pricingPlans = [
    {
      name: 'Professional',
      price: 499,
      features: ['Unlimited forms', '10,000 submissions/month', 'Full offline support', 'Basic analytics'],
      popular: false
    },
    {
      name: 'Enterprise',
      price: 1499,
      features: ['Unlimited everything', 'AI quality monitoring', 'CATI/CAPI modules', 'Priority support', 'Custom integrations'],
      popular: true
    },
    {
      name: 'Custom',
      price: null,
      features: ['On-premise deployment', 'Custom development', 'Dedicated support', 'SLA guarantee', 'Training included'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white" data-testid="datapulse-landing">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/solutions/datapulse" className="flex items-center gap-2" data-testid="datapulse-logo">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">DataPulse</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors">Pricing</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/solutions/datapulse/login">
                <button className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors" data-testid="datapulse-signin-btn">
                  Sign In
                </button>
              </Link>
              <Link to="/solutions/datapulse/register">
                <button className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity" data-testid="datapulse-getstarted-btn">
                  Request Demo
                  <ArrowRight className="w-4 h-4 ml-1 inline" />
                </button>
              </Link>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900 border-b border-slate-800"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className="block text-slate-300 hover:text-white">Features</a>
                <a href="#how-it-works" className="block text-slate-300 hover:text-white">How It Works</a>
                <a href="#pricing" className="block text-slate-300 hover:text-white">Pricing</a>
                <div className="pt-4 space-y-2">
                  <Link to="/solutions/datapulse/login" className="block w-full text-center py-2 border border-slate-700 rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/solutions/datapulse/register" className="block w-full text-center py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    Request Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm text-indigo-300 mb-6">
              Enterprise-Grade Data Collection Platform
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Real-Time Data Analytics
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              The most powerful platform for data integration, real-time analytics, and business intelligence. 
              Monitor KPIs, track metrics, and make data-driven decisions. Trusted by leading organizations worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/solutions/datapulse/demo">
                <button className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2" data-testid="hero-demo-btn">
                  <Play className="w-5 h-5" />
                  Try DataPulse Demo
                </button>
              </Link>
              <Link to="/solutions/datapulse/register">
                <button className="w-full sm:w-auto px-8 py-3 border border-slate-700 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  Request Enterprise Demo
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Built for organizations that need reliability, scale, and advanced capabilities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From design to insights in four simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-xl font-bold mb-4`}>
                  {step.step}
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-slate-700" />
                )}
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for Your Industry</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Trusted by development organizations, research institutions, and government agencies worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{useCase.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="px-2 py-1 text-xs bg-slate-700/50 rounded-full text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise Pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Flexible plans designed for organizations of all sizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500' 
                    : 'bg-slate-800/50 border border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  {plan.price !== null ? (
                    <div>
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold">Contact Us</div>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to={plan.price === null ? '/contact' : '/solutions/datapulse/register'}>
                  <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90'
                      : 'border border-slate-600 hover:bg-slate-700'
                  }`}>
                    {plan.price === null ? 'Contact Sales' : 'Get Started'}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl p-12 border border-indigo-500/30"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data Collection?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join 500+ organizations using DataPulse for research, monitoring, and evaluation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/solutions/datapulse/demo">
                <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Try DataPulse Demo
                </button>
              </Link>
              <Link to="/solutions/datapulse/register">
                <button className="px-8 py-3 border border-slate-600 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Request Enterprise Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">DataPulse</span>
              <span className="text-slate-500 ml-2">by DataVision</span>
            </div>
            <div className="text-sm text-slate-500">
              © 2026 DataPulse. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { DataPulseLandingPage };
export default DataPulseLandingPage;
