import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Camera, 
  Mic, 
  Shield, 
  Users, 
  Globe, 
  BarChart3, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Play,
  Heart,
  Leaf,
  GraduationCap,
  ShoppingCart,
  Store,
  Building2,
  Banknote,
  Zap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const FieldForceLandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState(0);

  // Stats counter animation
  const stats = [
    { value: '500+', label: 'Free submissions' },
    { value: '100%', label: 'Offline capable' },
    { value: '256-bit', label: 'AES Encryption' },
    { value: '24/7', label: 'Support available' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Design Forms',
      description: 'Create surveys with our drag-and-drop builder. Add skip logic, calculations, and validations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Deploy to Field',
      description: 'Enumerators download forms to their devices. Works completely offline in remote areas.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 3,
      title: 'Collect Data',
      description: 'Capture GPS, photos, audio, signatures. All data encrypted and stored securely on device.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 4,
      title: 'Sync & Analyze',
      description: 'Data syncs automatically when online. View submissions, export reports, track quality.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    { icon: WifiOff, title: 'Works Offline', description: 'Collect data in remote areas with no internet. Sync when back online.' },
    { icon: MapPin, title: 'GPS Tracking', description: 'Automatic location capture with geofencing validation.' },
    { icon: Camera, title: 'Media Capture', description: 'Photos, audio recordings, video, and signatures.' },
    { icon: Shield, title: 'Encrypted Storage', description: 'AES-256 encryption protects all data on device.' },
    { icon: Users, title: 'Team Management', description: 'Assign forms, track progress, manage permissions.' },
    { icon: Globe, title: 'Multi-Language', description: 'English, Swahili, and more. Easy translations.' },
    { icon: BarChart3, title: 'Real-time Analytics', description: 'Dashboard with submission trends and quality metrics.' },
    { icon: Smartphone, title: 'Device Management', description: 'Remote wipe, lock devices, track activity.' }
  ];

  const useCases = [
    { icon: Heart, title: 'Healthcare & Public Health', description: 'Patient surveys, vaccination tracking, community health assessments, clinical trials data.', tags: ['Disease surveillance', 'Patient satisfaction', 'Health facility audits'] },
    { icon: Leaf, title: 'Agriculture & Environment', description: 'Crop yield assessments, farmer interviews, livestock census, environmental monitoring.', tags: ['Farm productivity', 'Climate studies', 'Supply chain'] },
    { icon: GraduationCap, title: 'Education & Research', description: 'Student assessments, school audits, academic research, enrollment verification.', tags: ['Learning outcomes', 'Teacher feedback', 'Campus surveys'] },
    { icon: ShoppingCart, title: 'Market Research', description: 'Consumer surveys, brand tracking, product feedback, competitive analysis.', tags: ['Customer satisfaction', 'Brand awareness', 'Pricing research'] },
    { icon: Store, title: 'Retail & Field Sales', description: 'Store audits, merchandising checks, mystery shopping, sales rep tracking.', tags: ['Planogram compliance', 'Inventory checks', 'Competitor pricing'] },
    { icon: Building2, title: 'NGO & Development', description: 'Beneficiary registration, program monitoring, impact evaluations, needs assessments.', tags: ['Humanitarian response', 'Project M&E', 'Baseline surveys'] },
    { icon: Banknote, title: 'Insurance & Finance', description: 'Claims verification, risk assessments, KYC data collection, field underwriting.', tags: ['Property inspections', 'Loan applications', 'Damage assessments'] },
    { icon: Zap, title: 'Utilities & Infrastructure', description: 'Asset inspections, meter readings, maintenance logs, service quality audits.', tags: ['Equipment reports', 'Site surveys', 'Compliance checks'] }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 69,
      features: ['1,500 submissions', '5 GB storage', '10 users'],
      popular: false
    },
    {
      name: 'Pro',
      price: 189,
      features: ['5,000 submissions', '25 GB storage', '30 users', 'API access'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 499,
      features: ['20,000 submissions', '100 GB storage', 'Unlimited users', 'SSO'],
      popular: false
    }
  ];

  const handleStartFreeTrial = () => {
    // Redirect to DataVision for signup
    navigate('/admin');
  };

  const handleLogin = () => {
    // Redirect to DataVision login, which will SSO back
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* DataVision logo only - links to home */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white rounded px-2 py-1">
                <img 
                  src="/datavision-logo-cropped.png" 
                  alt="DataVision" 
                  className="h-6 w-auto"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              <a href="#features" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Features</a>
              <a href="#how-it-works" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">How It Works</a>
              <a href="#use-cases" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Use Cases</a>
              <a href="#pricing" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Pricing</a>
              <button className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                Demo
              </button>
            </div>

            {/* Auth Buttons & Mobile Menu */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogin}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                Log in
              </button>
              <button 
                onClick={handleStartFreeTrial}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-400 hover:to-cyan-400 transition-all flex items-center gap-2"
              >
                <span className="hidden sm:inline">✨</span>
                Start Free
              </button>
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a1628] border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-2">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  How It Works
                </a>
                <a 
                  href="#use-cases" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Use Cases
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                  Pricing
                </a>
                <button 
                  className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Demo
                </button>
                <hr className="border-white/10 my-2" />
                <button 
                  onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Log in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating Icons */}
        <motion.div 
          className="absolute top-32 left-10 w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <MapPin className="w-6 h-6 text-teal-400" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Camera className="w-6 h-6 text-cyan-400" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Mic className="w-6 h-6 text-purple-400" />
        </motion.div>

        <div className="max-w-7xl mx-auto text-center">
          {/* Product Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">FieldForce</span>
          </motion.div>

          {/* By DataVision Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-teal-500/20 text-teal-300 text-sm font-medium rounded-full border border-teal-500/30">
              By DataVision International
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white"
          >
            Mobile Data Collection{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Made Simple
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10"
          >
            Powerful offline-first data collection for field teams. GPS tracking, photo capture, 
            and seamless sync - all in one platform trusted by researchers across Africa.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button 
              onClick={handleStartFreeTrial}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Try Interactive Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-teal-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1d33]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-500/20 text-teal-300 text-sm font-medium rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              From Design to Insights in 4 Steps
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              FieldForce simplifies the entire data collection workflow - from form creation to analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a1628] rounded-2xl p-6 border border-white/5 hover:border-teal-500/30 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-500/20 text-teal-300 text-sm font-medium rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything You Need for Field Data Collection
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0d1d33] rounded-xl p-6 border border-white/5 hover:border-teal-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-all">
                  <feature.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1d33]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-500/20 text-teal-300 text-sm font-medium rounded-full mb-4">
              Use Cases
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Built for Every Industry
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From market research to humanitarian operations, FieldForce empowers organizations worldwide to collect accurate, real-time data from the field.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0a1628] rounded-xl p-6 border border-white/5 hover:border-teal-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{useCase.description}</p>
                <div className="flex flex-wrap gap-2">
                  {useCase.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Also used in: Real Estate • Construction • Logistics • Government • Tourism • Manufacturing
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-500/20 text-teal-300 text-sm font-medium rounded-full mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Enterprise Features, Startup Pricing
            </h2>
            <p className="text-gray-400">
              Affordable data collection for organizations of all sizes. Start free, scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 border ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-teal-500/20 to-cyan-500/10 border-teal-500/50' 
                    : 'bg-[#0d1d33] border-white/10'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-medium rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all border border-white/10"
            >
              View Full Pricing
              <ChevronRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              Pay-as-you-go credits also available. M-Pesa accepted.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1d33]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-teal-500/25">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Field Operations?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join hundreds of organizations collecting better data with FieldForce.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button 
              onClick={handleStartFreeTrial}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
            >
              Start Free Trial
            </button>
            <Link 
              to="/"
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-all border border-white/10"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            No credit card required • 500 free submissions • Full onboarding wizard included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">FieldForce</span>
            <span className="text-gray-500">by DataVision International</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FieldForceLandingPage;
