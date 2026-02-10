import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList,
  FileText,
  BarChart3,
  Share2,
  CheckCircle2,
  ArrowRight,
  Play,
  Heart,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  Calendar,
  HeartPulse,
  ChevronRight,
  Menu,
  X,
  QrCode,
  GitBranch,
  Palette,
  Download,
  Lock,
  PieChart,
  Send,
  Zap
} from 'lucide-react';

const Survey360LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { value: '500+', label: 'Free responses' },
    { value: '100%', label: 'Free forever' },
    { value: '10+', label: 'Question types' },
    { value: '24/7', label: 'Support available' }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Design Survey',
      description: 'Use our drag-and-drop builder. Add skip logic, branding, and validations.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: 'Share Anywhere',
      description: 'Send via link, QR code, email, or embed on your website.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 3,
      title: 'Collect Responses',
      description: 'Respondents fill out your survey. All data captured securely.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 4,
      title: 'Analyze Results',
      description: 'View real-time charts. Export data. Make data-driven decisions.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    { icon: ClipboardList, title: 'Drag & Drop Builder', description: '10+ question types. Build beautiful surveys in minutes.' },
    { icon: GitBranch, title: 'Smart Skip Logic', description: 'Show questions based on previous answers.' },
    { icon: QrCode, title: 'QR & Embed', description: 'Share via QR codes or embed on any website.' },
    { icon: Lock, title: 'Secure Responses', description: 'All data encrypted and stored securely.' },
    { icon: Palette, title: 'Custom Branding', description: 'Your logo, your colors, your identity.' },
    { icon: Share2, title: 'Easy Sharing', description: 'Public links, private invites, email distribution.' },
    { icon: PieChart, title: 'Real-Time Analytics', description: 'Charts and insights as responses come in.' },
    { icon: Download, title: 'Export Anywhere', description: 'Download as CSV for any analysis tool.' }
  ];

  const useCases = [
    { icon: Heart, title: 'Customer Experience', description: 'Understand your customers better with feedback surveys, NPS tracking, and satisfaction measurement.', tags: ['Customer satisfaction', 'Product feedback', 'Support ratings'] },
    { icon: BarChart3, title: 'Market Research', description: 'Validate ideas and understand your market with targeted research surveys and concept testing.', tags: ['Consumer insights', 'Brand awareness', 'Pricing research'] },
    { icon: Users, title: 'Employee Engagement', description: 'Build a better workplace with engagement surveys, pulse checks, and 360° feedback.', tags: ['Engagement surveys', 'Exit interviews', 'Team feedback'] },
    { icon: Calendar, title: 'Events & Registration', description: 'Manage events effortlessly with registration forms, RSVPs, and post-event surveys.', tags: ['Event registration', 'Attendee feedback', 'Speaker ratings'] },
    { icon: GraduationCap, title: 'Education & Academia', description: 'Improve learning outcomes with course evaluations, student feedback, and research studies.', tags: ['Course evaluations', 'Student surveys', 'Research studies'] },
    { icon: HeartPulse, title: 'Healthcare', description: 'Enhance patient care with satisfaction surveys, intake forms, and health assessments.', tags: ['Patient satisfaction', 'Appointment follow-up', 'Health screenings'] },
    { icon: Building2, title: 'Non-Profit & NGO', description: 'Measure impact with beneficiary surveys, program evaluations, and donor feedback.', tags: ['Impact assessment', 'Donor surveys', 'Volunteer feedback'] },
    { icon: Briefcase, title: 'Professional Services', description: 'Gather client feedback, conduct assessments, and improve service delivery.', tags: ['Client satisfaction', 'Project feedback', 'Quality audits'] }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 0,
      features: ['3 surveys', '100 responses/month', '10 question types', 'Basic analytics'],
      popular: false
    },
    {
      name: 'Pro',
      price: 29,
      features: ['Unlimited surveys', '2,500 responses/month', 'Skip logic', 'Custom branding', 'Priority support'],
      popular: true
    },
    {
      name: 'Business',
      price: 99,
      features: ['Everything in Pro', '10,000 responses/month', 'Team collaboration', 'API access', 'SSO'],
      popular: false
    }
  ];

  const handleStartFreeTrial = () => {
    navigate('/solutions/survey360/login');
  };

  const handleLogin = () => {
    navigate('/solutions/survey360/login');
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
                className="hidden sm:flex px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all items-center gap-2"
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
          className="absolute top-32 left-10 w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <ClipboardList className="w-6 h-6 text-purple-400" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-20 w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <PieChart className="w-6 h-6 text-pink-400" />
        </motion.div>
        <motion.div 
          className="absolute bottom-40 left-20 w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Send className="w-5 h-5 text-blue-400" />
        </motion.div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Product Logo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Survey360</span>
          </motion.div>

          {/* By DataVision Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full border border-purple-500/30">
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
            Beautiful Surveys{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Made Simple
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Create professional surveys in minutes. Collect responses anywhere. 
            Get insights instantly - all in one simple platform.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button 
              onClick={handleStartFreeTrial}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogin}
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Try Interactive Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-purple-400">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1d33]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              From Idea to Insights in 4 Steps
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Survey360 simplifies the entire survey workflow - from design to analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a1628] rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all"
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
            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything You Need for Better Surveys
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0a1628] rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
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
            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full mb-4">
              Use Cases
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Built for Every Industry
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From startups to enterprises, teams worldwide use Survey360 to collect insights and make better decisions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#0a1628] rounded-xl p-6 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <useCase.icon className="w-6 h-6 text-purple-400" />
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
            Also used in: Real Estate • Consulting • Hospitality • Retail • Government • Manufacturing
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-[#0a1628] rounded-2xl p-6 border ${plan.popular ? 'border-purple-500 ring-1 ring-purple-500/50' : 'border-white/5'}`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-purple-500 text-white text-xs font-medium rounded-full mb-4">
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
                      <CheckCircle2 className="w-4 h-4 text-purple-400" />
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
              All plans include SSL encryption and GDPR compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1d33]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/25">
            <ClipboardList className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Ready to Create Better Surveys?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of teams collecting insights with Survey360.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button 
              onClick={handleStartFreeTrial}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link 
              to="/solutions/survey360/pricing"
              className="px-8 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            No credit card required • 500 free responses • Full onboarding included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Survey360</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 Survey360. A product of DataVision International.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { Survey360LandingPage };
export default Survey360LandingPage;
