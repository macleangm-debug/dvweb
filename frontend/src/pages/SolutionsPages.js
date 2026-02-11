import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BarChart3, Database, Smartphone, Globe, Target,
  Sprout, GraduationCap, Heart, Droplets, Building2, Factory,
  CheckCircle2, Play, Monitor, Cloud, Shield, Zap, Users,
  PieChart, LineChart, TrendingUp, Layers, Settings, ChevronRight,
  Workflow, FileText, Map, Clock, Award, Headphones, CreditCard,
  Loader2, ShoppingCart, Tag
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Pricing packages mapping to backend packages
const PRICING_DATA = {
  'survey360': {
    monthly: { id: 'survey360_monthly', price: 99, period: '/month', features: ['Up to 5 surveys', '1,000 responses/month', 'Basic analytics', 'Email support'] },
    annual: { id: 'survey360_annual', price: 990, period: '/year', features: ['Unlimited surveys', '10,000 responses/month', 'Advanced analytics', 'Priority support', 'API access'] },
    enterprise: { id: 'survey360_enterprise', price: null, period: 'Custom', features: ['Unlimited everything', 'Dedicated account manager', 'Custom integrations', 'On-premise option', 'SLA guarantee'] }
  },
  'dataviz-studio': {
    monthly: { id: 'dataviz_monthly', price: 79, period: '/month', features: ['5 dashboards', '10 data sources', 'Basic charts', 'Export to PDF'] },
    annual: { id: 'dataviz_annual', price: 790, period: '/year', features: ['Unlimited dashboards', 'Unlimited data sources', 'Advanced visualizations', 'White labeling', 'Team collaboration'] }
  },
  'me-tracker': {
    monthly: { id: 'me_tracker_monthly', price: 149, period: '/month', features: ['5 programs', '50 indicators', 'Basic reports', 'Email support'] },
    annual: { id: 'me_tracker_annual', price: 1490, period: '/year', features: ['25 programs', '500 indicators', 'Advanced reports', 'Donor templates', 'API access'] }
  },
  'fieldforce': {
    small: { id: 'fieldforce_10seats', price: 499, period: 'one-time', features: ['10 user seats', 'iOS & Android apps', 'Offline mode', '1 year support'] },
    medium: { id: 'fieldforce_50seats', price: 1999, period: 'one-time', features: ['50 user seats', 'All mobile features', 'Supervisor dashboard', '2 years support'] },
    unlimited: { id: 'fieldforce_unlimited', price: 4999, period: 'one-time', features: ['Unlimited seats', 'All features', 'Priority support', 'Lifetime updates'] }
  },
  'agridata-pro': {
    annual: { id: 'agridata_annual', price: 1999, period: '/year', features: ['Full platform access', 'Weather integration', 'Market analytics', 'Farmer registry', 'Priority support'] }
  },
  'eduinsights': {
    annual: { id: 'eduinsights_annual', price: 1499, period: '/year', features: ['Full platform access', 'Learning assessments', 'Teacher analytics', 'Early warning system', 'Priority support'] }
  },
  'healthpulse': {
    annual: { id: 'healthpulse_annual', price: 1799, period: '/year', features: ['Full platform access', 'Disease surveillance', 'Supply chain tracking', 'Quality metrics', 'Priority support'] }
  },
  'wash-monitor': {
    annual: { id: 'wash_monitor_annual', price: 1299, period: '/year', features: ['Full platform access', 'Water point mapping', 'SDG 6 tracking', 'Community feedback', 'Priority support'] }
  }
};

// ==================== SOFTWARE SOLUTIONS DATA ====================
const softwareSolutions = [
  {
    id: 'survey360',
    name: 'Survey360',
    tagline: 'End-to-End Survey Management Platform',
    shortDesc: 'Complete survey lifecycle management from design to analysis',
    icon: Target,
    color: '#e63946',
    category: 'data-collection',
    industries: ['all'],
    features: [
      'Drag-and-drop questionnaire builder',
      'Multi-language support',
      'Offline data collection',
      'Real-time quality monitoring',
      'Automated skip logic & validation',
      'GPS & multimedia capture'
    ],
    stats: { users: '10K+', surveys: '5K+', responses: '50M+' }
  },
  {
    id: 'dataviz-studio',
    name: 'DataViz Studio',
    tagline: 'Interactive Analytics & Visualization Platform',
    shortDesc: 'Transform raw data into compelling visual stories and insights',
    icon: PieChart,
    color: '#8b5cf6',
    category: 'analytics',
    industries: ['all'],
    features: [
      'Drag-and-drop dashboard builder',
      '50+ chart types & visualizations',
      'Real-time data connections',
      'Automated report generation',
      'Collaborative workspaces',
      'Export to PDF, Excel, PowerPoint'
    ],
    stats: { dashboards: '2K+', users: '5K+', dataPoints: '100M+' }
  },
  {
    id: 'me-tracker',
    name: 'M&E Tracker',
    tagline: 'Monitoring & Evaluation Management System',
    shortDesc: 'Comprehensive M&E platform for program tracking and impact measurement',
    icon: TrendingUp,
    color: '#2a9d8f',
    category: 'analytics',
    industries: ['ngos', 'public-sector'],
    features: [
      'Indicator tracking & management',
      'Theory of Change mapping',
      'Automated progress reports',
      'Beneficiary management',
      'Impact measurement tools',
      'Donor reporting templates'
    ],
    stats: { programs: '500+', indicators: '10K+', organizations: '100+' }
  },
  {
    id: 'fieldforce',
    name: 'FieldForce',
    tagline: 'Mobile Data Collection Suite',
    shortDesc: 'Powerful mobile tools for field teams and enumerators',
    icon: Smartphone,
    color: '#f59e0b',
    category: 'data-collection',
    industries: ['all'],
    features: [
      'Native iOS & Android apps',
      'Works fully offline',
      'GPS tracking & geofencing',
      'Photo & audio capture',
      'Supervisor dashboards',
      'Team management tools'
    ],
    stats: { downloads: '25K+', countries: '15+', dataPoints: '75M+' }
  },
  {
    id: 'datapulse',
    name: 'DataPulse',
    tagline: 'Enterprise Data Collection Platform',
    shortDesc: 'The most powerful platform for research, monitoring & evaluation',
    icon: Database,
    color: '#6366f1',
    category: 'data-collection',
    industries: ['all'],
    features: [
      'Enterprise-grade infrastructure',
      'AI-powered quality monitoring',
      'CATI/CAPI integration',
      'Multi-language support (EN/SW)',
      'Advanced statistical analysis',
      'Custom workflow automation'
    ],
    stats: { organizations: '500+', countries: '50+', dataPoints: '10M+' }
  },
  {
    id: 'agridata-pro',
    name: 'AgriData Pro',
    tagline: 'Agricultural Intelligence Platform',
    shortDesc: 'Data-driven insights for agricultural productivity and food security',
    icon: Sprout,
    color: '#22c55e',
    category: 'sectoral',
    industries: ['agriculture'],
    features: [
      'Crop monitoring & forecasting',
      'Weather data integration',
      'Supply chain tracking',
      'Farmer registry management',
      'Market price analytics',
      'Extension service coordination'
    ],
    stats: { farmers: '500K+', hectares: '2M+', cooperatives: '200+' }
  },
  {
    id: 'eduinsights',
    name: 'EduInsights',
    tagline: 'Education Analytics Dashboard',
    shortDesc: 'Comprehensive education sector monitoring and learning analytics',
    icon: GraduationCap,
    color: '#f59e0b',
    category: 'sectoral',
    industries: ['education'],
    features: [
      'School performance tracking',
      'Student learning assessments',
      'Teacher effectiveness metrics',
      'Resource allocation analysis',
      'Attendance monitoring',
      'Early warning systems'
    ],
    stats: { schools: '2K+', students: '1M+', teachers: '25K+' }
  },
  {
    id: 'healthpulse',
    name: 'HealthPulse',
    tagline: 'Healthcare Analytics Platform',
    shortDesc: 'Real-time health facility monitoring and service delivery analytics',
    icon: Heart,
    color: '#ef4444',
    category: 'sectoral',
    industries: ['health'],
    features: [
      'Facility performance dashboards',
      'Disease surveillance tools',
      'Supply chain management',
      'Patient flow analytics',
      'Quality of care metrics',
      'Community health tracking'
    ],
    stats: { facilities: '500+', patients: '2M+', healthWorkers: '10K+' }
  },
  {
    id: 'wash-monitor',
    name: 'WASH Monitor',
    tagline: 'Water & Sanitation Tracking System',
    shortDesc: 'End-to-end WASH sector monitoring and sustainability tracking',
    icon: Droplets,
    color: '#0ea5e9',
    category: 'sectoral',
    industries: ['wash'],
    features: [
      'Water point mapping & status',
      'Service level monitoring',
      'Sustainability indicators',
      'Community feedback tools',
      'Maintenance scheduling',
      'SDG 6 progress tracking'
    ],
    stats: { waterPoints: '10K+', communities: '5K+', beneficiaries: '3M+' }
  }
];

const solutionCategories = [
  { id: 'all', name: 'All Solutions', icon: Layers },
  { id: 'data-collection', name: 'Data Collection', icon: Database },
  { id: 'analytics', name: 'Analytics & Visualization', icon: PieChart },
  { id: 'sectoral', name: 'Sector Solutions', icon: Building2 }
];

// ==================== SOLUTIONS HUB PAGE ====================
export const SolutionsHubPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSolutions = activeCategory === 'all' 
    ? softwareSolutions 
    : softwareSolutions.filter(s => s.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #e63946 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, #8b5cf6 0%, transparent 40%)`
          }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#e63946] px-4 py-2 rounded-full mb-6">
                <Monitor className="w-4 h-4" />
                <span className="text-sm font-semibold">Software Products</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Software Solutions
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Powerful, purpose-built software platforms designed for data collection, 
                analytics, and sector-specific operations across Africa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                >
                  Request Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all">
                  <Play className="w-4 h-4" />
                  Watch Overview
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Floating product cards */}
                <div className="grid grid-cols-2 gap-4">
                  {softwareSolutions.slice(0, 4).map((solution, index) => (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all"
                    >
                      <solution.icon className="w-8 h-8 mb-2" style={{ color: solution.color }} />
                      <h3 className="font-bold text-white">{solution.name}</h3>
                      <p className="text-white/60 text-xs">{solution.tagline}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Cloud, title: 'Cloud-Based', desc: 'Secure, scalable infrastructure' },
              { icon: Smartphone, title: 'Mobile-First', desc: 'Works on any device, anywhere' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-level data protection' },
              { icon: Headphones, title: 'Local Support', desc: '24/7 Tanzania-based support' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0a1628] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-[#e63946]" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-1">{item.title}</h3>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-[#f8fafc] border-b sticky top-20 z-30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-3">
            {solutionCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#0a1628] text-white'
                    : 'bg-white text-[#64748b] hover:bg-[#0a1628] hover:text-white'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSolutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/solutions/${solution.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  {/* Header */}
                  <div 
                    className="h-48 relative overflow-hidden"
                    style={{ backgroundColor: solution.color + '10' }}
                  >
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 80% 20%, ${solution.color}30 0%, transparent 50%)`
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <solution.icon 
                        className="w-24 h-24 transition-transform group-hover:scale-110" 
                        style={{ color: solution.color }}
                      />
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: solution.color }}
                      >
                        {solutionCategories.find(c => c.id === solution.category)?.name}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0a1628] mb-1 group-hover:text-[#e63946] transition-colors">
                      {solution.name}
                    </h3>
                    <p className="text-[#64748b] text-sm mb-4">{solution.tagline}</p>
                    
                    {/* Key features preview */}
                    <div className="space-y-2 mb-4">
                      {solution.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
                          <CheckCircle2 className="w-4 h-4 text-[#2a9d8f] flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 pt-4 border-t border-[#e2e8f0]">
                      {Object.entries(solution.stats).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold" style={{ color: solution.color }}>{value}</div>
                          <div className="text-xs text-[#64748b] capitalize">{key}</div>
                        </div>
                      ))}
                      <div className="ml-auto">
                        <span className="flex items-center gap-1 text-sm font-semibold text-[#0a1628] group-hover:text-[#e63946] transition-colors">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
                Seamless Integration
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                End-to-End Solutions That Work Together
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Our software products are designed to integrate seamlessly with each other 
                and your existing systems. Create powerful data workflows from collection 
                to analysis to visualization—all in one ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'API Access',
                  'Custom Integrations',
                  'Data Export/Import',
                  'SSO Support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection diagram */}
              <div className="grid grid-cols-3 gap-4">
                {softwareSolutions.slice(0, 6).map((solution, index) => (
                  <div
                    key={solution.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all"
                  >
                    <solution.icon className="w-8 h-8 mx-auto mb-2" style={{ color: solution.color }} />
                    <p className="text-xs font-medium">{solution.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Schedule a personalized demo to see how our software solutions can 
              streamline your data collection, analysis, and decision-making processes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
              >
                Schedule Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-[#e63946] transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ==================== SOLUTION DETAIL PAGE TEMPLATE ====================
const SolutionDetailPage = ({ solution }) => {
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);

  if (!solution) return <div>Solution not found</div>;

  const pricing = PRICING_DATA[solution.id] || {};

  const handlePurchase = async (packageId) => {
    setPurchaseLoading(packageId);
    setPurchaseError(null);
    
    try {
      const response = await fetch(`${API}/payments/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_id: packageId,
          origin_url: window.location.origin,
          metadata: {
            source: 'solutions_page',
            product: solution.id
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseError(error.message);
      setPurchaseLoading(null);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: solution.color }}
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{solution.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ backgroundColor: solution.color }}
              >
                <solution.icon className="w-4 h-4" />
                {solutionCategories.find(c => c.id === solution.category)?.name}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {solution.name}
              </h1>
              <p className="text-2xl text-white/80 mb-6">{solution.tagline}</p>
              <p className="text-white/70 leading-relaxed mb-8">
                {solution.shortDesc}. Built for organizations that demand reliability, 
                scalability, and actionable insights from their data operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                  data-testid="view-pricing-btn"
                >
                  <Tag className="w-4 h-4" />
                  View Pricing
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                >
                  Request Demo
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div 
                className="w-80 h-80 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: solution.color + '20' }}
              >
                <solution.icon className="w-48 h-48" style={{ color: solution.color }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-12">
            {Object.entries(solution.stats).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold" style={{ color: solution.color }}>{value}</div>
                <div className="text-[#64748b] capitalize text-sm">{key}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
              Powerful Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: solution.color + '20' }}
                >
                  <CheckCircle2 className="w-6 h-6" style={{ color: solution.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{feature}</h3>
                <p className="text-[#64748b] text-sm">
                  Purpose-built functionality designed for real-world data operations.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
                Why Choose {solution.name}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
                Built for Africa's Data Challenges
              </h2>
              <p className="text-[#64748b] mb-8 leading-relaxed">
                Unlike generic tools, {solution.name} is specifically designed for the 
                unique challenges of data operations in Tanzania and across Africa—from 
                low connectivity environments to multi-language requirements.
              </p>
              <div className="space-y-4">
                {[
                  'Works offline in remote areas',
                  'Multi-language support (English, Swahili)',
                  'Local data hosting options',
                  'Dedicated Tanzania-based support team',
                  'Affordable pricing for local organizations'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] flex-shrink-0" />
                    <span className="text-[#0a1628]">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a1628] rounded-2xl p-8 text-white"
            >
              <Award className="w-12 h-12 text-[#e63946] mb-6" />
              <h3 className="text-2xl font-bold mb-4">Trusted by Leaders</h3>
              <p className="text-white/70 mb-6">
                Organizations across Tanzania and East Africa rely on {solution.name} 
                for their critical data operations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Active Users', value: solution.stats[Object.keys(solution.stats)[0]] },
                  { label: 'Uptime', value: '99.9%' },
                  { label: 'Support Response', value: '<2hrs' },
                  { label: 'Satisfaction', value: '98%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-xl font-bold text-[#e63946]">{stat.value}</div>
                    <div className="text-white/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started with {solution.name}?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Choose a plan that fits your needs or schedule a personalized demo 
              to see {solution.name} in action.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#pricing"
                className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </a>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-[#e63946] transition-all"
              >
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
              Pricing
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Flexible pricing options designed for organizations of all sizes. 
              All plans include access to our Tanzania-based support team.
            </p>
          </div>

          {purchaseError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 text-center"
            >
              <p className="text-red-600 text-sm">{purchaseError}</p>
            </motion.div>
          )}

          <div className={`grid gap-6 max-w-6xl mx-auto ${
            Object.keys(pricing).length === 1 ? 'md:grid-cols-1 max-w-md' :
            Object.keys(pricing).length === 2 ? 'md:grid-cols-2 max-w-3xl' :
            'md:grid-cols-3'
          }`}>
            {Object.entries(pricing).map(([tier, plan], index) => {
              const isPopular = tier === 'professional' || tier === 'medium' || (Object.keys(pricing).length === 1);
              const isEnterprise = plan.price === null;
              
              return (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl p-8 ${
                    isPopular 
                      ? 'bg-[#0a1628] text-white ring-4 ring-[#e63946] scale-105' 
                      : 'bg-[#f8fafc] text-[#0a1628]'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-[#e63946] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className={`text-lg font-bold capitalize mb-2 ${isPopular ? 'text-white' : 'text-[#0a1628]'}`}>
                      {tier.replace('_', ' ')}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      {isEnterprise ? (
                        <span className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-[#0a1628]'}`}>
                          Custom
                        </span>
                      ) : (
                        <>
                          <span className={`text-4xl font-bold ${isPopular ? 'text-white' : 'text-[#0a1628]'}`}>
                            ${plan.price.toLocaleString()}
                          </span>
                          <span className={`text-sm ${isPopular ? 'text-white/70' : 'text-[#64748b]'}`}>
                            {plan.period}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isPopular ? 'text-[#2a9d8f]' : 'text-[#2a9d8f]'
                        }`} />
                        <span className={`text-sm ${isPopular ? 'text-white/90' : 'text-[#64748b]'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {isEnterprise ? (
                    <Link
                      to="/contact"
                      className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                        isPopular
                          ? 'bg-white text-[#0a1628] hover:bg-[#e63946] hover:text-white'
                          : 'bg-[#0a1628] text-white hover:bg-[#e63946]'
                      }`}
                      data-testid={`contact-${tier}-btn`}
                    >
                      Contact Sales
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePurchase(plan.id)}
                      disabled={purchaseLoading === plan.id}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                        isPopular
                          ? 'bg-[#e63946] text-white hover:bg-white hover:text-[#0a1628]'
                          : 'bg-[#0a1628] text-white hover:bg-[#e63946]'
                      }`}
                      data-testid={`buy-${tier}-btn`}
                    >
                      {purchaseLoading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Buy Now
                        </>
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Trust badges */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-[#64748b]">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2a9d8f]" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2a9d8f]" />
                <span className="text-sm">Powered by Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2a9d8f]" />
                <span className="text-sm">Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==================== INDIVIDUAL SOLUTION PAGES ====================
export const Survey360Page = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'survey360')} />;
export const DataVizStudioPage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'dataviz-studio')} />;
export const METrackerPage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'me-tracker')} />;
export const FieldForcePage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'fieldforce')} />;
export const DataPulsePage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'datapulse')} />;
export const AgriDataProPage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'agridata-pro')} />;
export const EduInsightsPage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'eduinsights')} />;
export const HealthPulsePage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'healthpulse')} />;
export const WASHMonitorPage = () => <SolutionDetailPage solution={softwareSolutions.find(s => s.id === 'wash-monitor')} />;

// Export data for navigation
export { softwareSolutions };
