import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Database, BarChart3, Shield, CheckCircle2, ArrowRight, Play,
  Building2, Users, ChevronRight, Menu, X, Globe, Lock, Zap, Server,
  Brain, Layers, GitBranch, Workflow, TrendingUp, LineChart, RefreshCw,
  AlertTriangle, CheckCircle, Target, Mic, Plus, Bell
} from 'lucide-react';

// Dashboard Builder Demo - Drag and drop widget builder
const DashboardBuilderDemo = () => {
  const [widgets, setWidgets] = useState([
    { id: 1, type: 'metric', title: 'Total Revenue', value: '$124,500' },
    { id: 2, type: 'chart', title: 'Sales Trend' }
  ]);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [newWidgetType, setNewWidgetType] = useState('metric');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const addWidget = () => {
    if (!newWidgetTitle) return;
    setWidgets([...widgets, {
      id: Date.now(),
      type: newWidgetType,
      title: newWidgetTitle,
      value: newWidgetType === 'metric' ? '$0' : null
    }]);
    setNewWidgetTitle('');
    setShowAddForm(false);
  };

  const removeWidget = (id) => {
    setWidgets(widgets.filter(w => w.id !== id));
    setSelectedWidget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Dashboard Builder
        </h3>
        <button onClick={() => setShowAddForm(!showAddForm)} className="px-3 py-1.5 bg-cyan-500 text-black rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Widget
        </button>
      </div>

      {showAddForm && (
        <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Widget Type</label>
              <select value={newWidgetType} onChange={(e) => setNewWidgetType(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
                <option value="metric">Metric Card</option>
                <option value="chart">Line Chart</option>
                <option value="table">Data Table</option>
                <option value="gauge">Gauge</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Widget Title</label>
              <input type="text" value={newWidgetTitle} onChange={(e) => setNewWidgetTitle(e.target.value)} placeholder="e.g., Monthly Revenue" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addWidget} disabled={!newWidgetTitle} className="px-4 py-2 bg-cyan-500 text-black rounded-lg text-sm font-medium disabled:opacity-50">Add to Dashboard</button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-slate-700 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="text-xs text-slate-500 mb-3">Dashboard Preview (Click widgets to select)</div>
        <div className="grid grid-cols-2 gap-3 min-h-[200px]">
          {widgets.map((widget) => (
            <div key={widget.id} onClick={() => setSelectedWidget(widget.id)} className={`relative bg-slate-900 border rounded-lg p-3 cursor-pointer transition-all ${selectedWidget === widget.id ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-700 hover:border-slate-600'}`}>
              {selectedWidget === widget.id && (
                <button onClick={(e) => { e.stopPropagation(); removeWidget(widget.id); }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              )}
              <div className="text-xs text-slate-400 mb-1">{widget.title}</div>
              {widget.type === 'metric' && <div className="text-xl font-bold text-cyan-400">{widget.value}</div>}
              {widget.type === 'chart' && (
                <div className="flex items-end h-12 gap-0.5">
                  {[40, 60, 45, 80, 65, 90, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-cyan-500 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}
              {widget.type === 'table' && <div className="space-y-1">{[1, 2, 3].map(i => <div key={i} className="h-2 bg-slate-700 rounded" style={{ width: `${100 - i * 20}%` }} />)}</div>}
              {widget.type === 'gauge' && <div className="w-12 h-6 border-t-4 border-l-4 border-r-4 border-cyan-500 rounded-t-full mx-auto" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Query Builder Demo - Visual SQL builder
const QueryBuilderDemo = () => {
  const [table, setTable] = useState('users');
  const [columns, setColumns] = useState(['id', 'name', 'email']);
  const [condition, setCondition] = useState({ field: 'status', operator: '=', value: 'active' });
  const [limit, setLimit] = useState(100);
  const [queryResult, setQueryResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const columnOptions = {
    users: ['id', 'name', 'email', 'status', 'created_at'],
    orders: ['id', 'user_id', 'total', 'status', 'created_at'],
    products: ['id', 'name', 'price', 'category', 'stock']
  };

  const generatedQuery = `SELECT ${columns.join(', ')}\nFROM ${table}\nWHERE ${condition.field} ${condition.operator} '${condition.value}'\nLIMIT ${limit};`;

  const runQuery = () => {
    setIsRunning(true);
    setTimeout(() => {
      setQueryResult({ rows: Math.floor(Math.random() * 50) + 10, time: (Math.random() * 0.5 + 0.1).toFixed(3) });
      setIsRunning(false);
    }, 1500);
  };

  const toggleColumn = (col) => {
    setColumns(columns.includes(col) ? columns.filter(c => c !== col) : [...columns, col]);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold flex items-center gap-2">
        <Database className="w-5 h-5 text-cyan-400" />
        Visual Query Builder
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Select Table</label>
            <select value={table} onChange={(e) => { setTable(e.target.value); setColumns(['id']); }} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
              <option value="users">users</option>
              <option value="orders">orders</option>
              <option value="products">products</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Select Columns</label>
            <div className="flex flex-wrap gap-2">
              {columnOptions[table]?.map(col => (
                <button key={col} onClick={() => toggleColumn(col)} className={`px-2 py-1 rounded text-xs ${columns.includes(col) ? 'bg-cyan-500 text-black' : 'bg-slate-700 hover:bg-slate-600'}`}>
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Where Condition</label>
            <div className="grid grid-cols-3 gap-2">
              <select value={condition.field} onChange={(e) => setCondition({...condition, field: e.target.value})} className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm">
                {columnOptions[table]?.map(col => <option key={col} value={col}>{col}</option>)}
              </select>
              <select value={condition.operator} onChange={(e) => setCondition({...condition, operator: e.target.value})} className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm">
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
              </select>
              <input type="text" value={condition.value} onChange={(e) => setCondition({...condition, value: e.target.value})} className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Limit</label>
            <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 100)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-2">Generated SQL</div>
            <pre className="text-sm text-cyan-400 font-mono whitespace-pre-wrap">{generatedQuery}</pre>
          </div>

          <button onClick={runQuery} disabled={isRunning || columns.length === 0} className="w-full px-4 py-2.5 bg-cyan-500 text-black rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {isRunning ? <><RefreshCw className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Run Query</>}
          </button>

          {queryResult && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-400 mb-2"><CheckCircle className="w-4 h-4" /> Query Executed</div>
              <div className="text-sm"><span className="text-slate-400">Rows: </span>{queryResult.rows} <span className="text-slate-400 ml-4">Time: </span>{queryResult.time}s</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Alert Configuration Demo
const AlertConfigDemo = () => {
  const [alertName, setAlertName] = useState('High CPU Usage');
  const [metric, setMetric] = useState('cpu_usage');
  const [threshold, setThreshold] = useState(80);
  const [channels, setChannels] = useState(['email']);
  const [savedAlerts, setSavedAlerts] = useState([
    { id: 1, name: 'API Latency Alert', condition: '> 500ms', status: 'active' },
    { id: 2, name: 'Error Rate Alert', condition: '> 5%', status: 'active' }
  ]);
  const [saveResult, setSaveResult] = useState(null);

  const toggleChannel = (ch) => setChannels(channels.includes(ch) ? channels.filter(c => c !== ch) : [...channels, ch]);

  const saveAlert = () => {
    setSavedAlerts([...savedAlerts, { id: Date.now(), name: alertName, condition: `> ${threshold}`, status: 'active' }]);
    setSaveResult({ message: 'Alert created!' });
    setTimeout(() => setSaveResult(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold flex items-center gap-2"><Bell className="w-5 h-5 text-cyan-400" /> Alert Configuration</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="text-sm font-medium text-cyan-400">Create New Alert</div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Alert Name</label>
            <input type="text" value={alertName} onChange={(e) => setAlertName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Metric</label>
            <select value={metric} onChange={(e) => setMetric(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
              <option value="cpu_usage">CPU Usage (%)</option>
              <option value="memory">Memory Usage (%)</option>
              <option value="response_time">Response Time (ms)</option>
              <option value="error_rate">Error Rate (%)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Threshold</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Channels</label>
            <div className="flex gap-2">
              {['email', 'slack', 'pagerduty'].map(ch => (
                <button key={ch} onClick={() => toggleChannel(ch)} className={`px-3 py-1.5 rounded-lg text-xs ${channels.includes(ch) ? 'bg-cyan-500 text-black' : 'bg-slate-700'}`}>{ch}</button>
              ))}
            </div>
          </div>
          <button onClick={saveAlert} disabled={!alertName} className="w-full px-4 py-2.5 bg-cyan-500 text-black rounded-lg font-medium disabled:opacity-50">Create Alert</button>
          {saveResult && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-green-400 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{saveResult.message}</div>}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="text-sm font-medium text-cyan-400">Active Alerts</div>
          <div className="space-y-3">
            {savedAlerts.map(alert => (
              <div key={alert.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
                <div><div className="font-medium text-sm">{alert.name}</div><div className="text-xs text-slate-400">{alert.condition}</div></div>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">● {alert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Data Connection Demo
const DataConnectionDemo = () => {
  const [connectionType, setConnectionType] = useState('postgresql');
  const [host, setHost] = useState('db.example.com');
  const [database, setDatabase] = useState('analytics');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [connections, setConnections] = useState([
    { id: 1, type: 'postgresql', name: 'Production DB', status: 'connected' },
    { id: 2, type: 'mongodb', name: 'Analytics Store', status: 'connected' }
  ]);

  const testConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResult({ success: true, message: 'Connection successful!' });
      setIsTesting(false);
    }, 1500);
  };

  const saveConnection = () => {
    if (testResult?.success) {
      setConnections([...connections, { id: Date.now(), type: connectionType, name: database, status: 'connected' }]);
      setTestResult({ success: true, message: 'Saved!' });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold flex items-center gap-2"><Server className="w-5 h-5 text-cyan-400" /> Data Source Connection</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Database Type</label>
            <select value={connectionType} onChange={(e) => setConnectionType(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm">
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="mongodb">MongoDB</option>
              <option value="snowflake">Snowflake</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Host</label>
            <input type="text" value={host} onChange={(e) => setHost(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Database</label>
            <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={testConnection} disabled={isTesting} className="flex-1 px-4 py-2 bg-slate-700 rounded-lg flex items-center justify-center gap-2">
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Test
            </button>
            <button onClick={saveConnection} disabled={!testResult?.success} className="flex-1 px-4 py-2 bg-cyan-500 text-black rounded-lg disabled:opacity-50">Save</button>
          </div>
          {testResult && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-green-400 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" />{testResult.message}</div>}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
          <div className="text-sm font-medium text-cyan-400">Connected Sources</div>
          <div className="space-y-3">
            {connections.map(conn => (
              <div key={conn.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-cyan-400" />
                  <div><div className="font-medium text-sm">{conn.name}</div><div className="text-xs text-slate-400">{conn.type}</div></div>
                </div>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">● {conn.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataPulseLandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDemo, setActiveDemo] = useState('dashboard');

  const stats = [
    { value: '500+', label: 'Free submissions' },
    { value: '100%', label: 'Offline capable' },
    { value: '256-bit', label: 'AES Encryption' },
    { value: '24/7', label: 'Support available' }
  ];

  const features = [
    { icon: Database, title: 'Real-Time Analytics', description: 'Process millions of data points with sub-second latency.' },
    { icon: Activity, title: 'Live Dashboards', description: 'Auto-refreshing dashboards with customizable widgets.' },
    { icon: Brain, title: 'AI Insights', description: 'Machine learning powered anomaly detection.' },
    { icon: GitBranch, title: 'Data Pipelines', description: 'Build complex ETL workflows visually.' },
    { icon: Globe, title: 'Multi-Source', description: 'Connect 100+ data sources including databases.' },
    { icon: Layers, title: 'Custom Metrics', description: 'Define custom KPIs and calculated metrics.' },
    { icon: Shield, title: 'Enterprise Security', description: 'SOC 2 compliant with role-based access.' },
    { icon: Workflow, title: 'Automated Reports', description: 'Schedule and distribute reports automatically.' }
  ];

  const demoTabs = [
    { id: 'dashboard', label: 'Dashboard Builder', icon: Layers },
    { id: 'query', label: 'Query Builder', icon: Database },
    { id: 'alerts', label: 'Alert Config', icon: Bell },
    { id: 'connection', label: 'Data Connection', icon: Server }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white rounded-lg px-2 py-1">
                <img src="/datavision-logo-cropped.png" alt="DataVision" className="h-6 w-auto" />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-white">Features</a>
              <a href="#demo" className="text-slate-300 hover:text-white">Demo</a>
              <a href="#pricing" className="text-slate-300 hover:text-white">Pricing</a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link to="/solutions/datapulse/login" className="text-slate-300 hover:text-white flex items-center gap-1">
                <ArrowRight className="w-4 h-4" /> Log in
              </Link>
              <Link to="/solutions/datapulse/register">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Start Free
                </button>
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Real-Time Data Analytics<br /><span className="text-cyan-400">Made Simple</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Powerful data integration and analytics platform. Real-time dashboards, AI insights, and automated reporting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/solutions/datapulse/register">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="#demo">
                <button className="px-8 py-3 bg-slate-800 border border-slate-700 rounded-lg font-medium flex items-center gap-2">
                  <Play className="w-5 h-5" /> Try Interactive Demo
                </button>
              </a>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Analytics Features</h2>
            <p className="text-slate-400">Everything you need to transform data into insights.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-300 mb-4">
              <Zap className="w-4 h-4 inline mr-2" />
              Interactive Demo • No Signup Required
            </span>
            <h2 className="text-3xl font-bold mb-4">Try DataPulse Features Live</h2>
            <p className="text-slate-400">Click, type, and interact with real product interfaces.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {demoTabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveDemo(tab.id)} className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all ${activeDemo === tab.id ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <motion.div key={activeDemo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-5xl mx-auto">
            {activeDemo === 'dashboard' && <DashboardBuilderDemo />}
            {activeDemo === 'query' && <QueryBuilderDemo />}
            {activeDemo === 'alerts' && <AlertConfigDemo />}
            {activeDemo === 'connection' && <DataConnectionDemo />}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Data?</h2>
          <p className="text-slate-400 mb-8">Join thousands of teams using DataPulse for real-time analytics.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/solutions/datapulse/register">
              <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg font-medium">Start Free Trial</button>
            </Link>
            <Link to="/solutions/datapulse/demo">
              <button className="px-8 py-3 border border-slate-600 rounded-lg font-medium hover:bg-slate-800">Request Demo</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded-lg px-2 py-1">
              <img src="/datavision-logo-cropped.png" alt="DataVision" className="h-5 w-auto" />
            </div>
            <span className="font-semibold">DataPulse</span>
          </Link>
          <p className="text-sm text-slate-500">© 2024 DataVision International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DataPulseLandingPage;
