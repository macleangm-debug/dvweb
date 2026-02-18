import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Fingerprint, Shield, Smartphone, Globe, Zap, Lock, Eye, AlertTriangle,
  CheckCircle2, ArrowRight, Play, Server, Key, Activity, FileText, 
  Clock, Users, TrendingUp, Cpu, Wifi, WifiOff, MapPin, ChevronRight,
  Building2, Banknote, CreditCard, Phone, ChevronDown, Menu, X
} from 'lucide-react';

// BioSign Product Navigation Component
const BioSignNavbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* DataVision logo - links to home */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded px-2 py-1">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-6 w-auto"
              />
            </div>
          </Link>

          {/* Product Name */}
          <Link to="/solutions/biosign" className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-white">BioSign SDK</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/solutions/biosign" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Overview</Link>
            <Link to="/solutions/biosign/features" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Features</Link>
            <Link to="/solutions/biosign/docs" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Documentation</Link>
            <a href="#use-cases" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Use Cases</a>
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link 
              to="/solutions/biosign/demo"
              className="hidden sm:flex px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-400 hover:to-cyan-500 transition-all items-center gap-2"
            >
              Request Demo
            </Link>
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
            className="md:hidden bg-slate-950 border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              <Link 
                to="/solutions/biosign" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Overview
              </Link>
              <Link 
                to="/solutions/biosign/features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Features
              </Link>
              <Link 
                to="/solutions/biosign/docs" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Documentation
              </Link>
              <Link 
                to="/solutions/biosign/demo" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all"
              >
                Request Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const BioSignLandingPage = () => {
  const [activeTab, setActiveTab] = useState('mobile-money');

  const complianceBadges = [
    { name: 'PCI DSS', color: 'bg-blue-500' },
    { name: 'ISO 27001', color: 'bg-emerald-500' },
    { name: 'PSD2 SCA', color: 'bg-violet-500' },
    { name: 'FIDO2 Certified', color: 'bg-cyan-500' },
    { name: 'SOC 2 Type II', color: 'bg-amber-500' },
    { name: 'GDPR', color: 'bg-pink-500' },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Device-Bound Security',
      description: 'Cryptographic keys bound to secure enclave/TEE. Private keys never leave the device.'
    },
    {
      icon: Fingerprint,
      title: 'Biometric Confirmation',
      description: 'Local biometric matching - fingerprint or face. No biometric data stored on servers.'
    },
    {
      icon: Cpu,
      title: 'AI Risk Analysis',
      description: 'Real-time transaction risk scoring using advanced AI. Behavioral pattern detection.'
    },
    {
      icon: Zap,
      title: 'Zero OTP Required',
      description: 'Eliminate SMS/OTP vulnerabilities. Resistant to SIM swap and phishing attacks.'
    },
    {
      icon: FileText,
      title: 'Dynamic Linking',
      description: 'Transaction payload includes amount, recipient, timestamp for non-repudiation.'
    },
    {
      icon: Shield,
      title: 'Compliance Ready',
      description: 'PCI DSS, ISO 27001, PSD2 SCA aligned. Full audit trail and forensic readiness.'
    },
  ];

  const mobileMoneyUseCases = [
    { title: 'Agent PIN Replacement', description: 'Replace 4-digit PINs with biometrics for 500K+ agents' },
    { title: 'P2P Transfers', description: 'Secure person-to-person money transfers without SMS OTP' },
    { title: 'Merchant Payments', description: 'Biometric confirmation for till payments and QR codes' },
    { title: 'Offline Transactions', description: 'Queue transactions in rural areas, sync when online' },
    { title: 'Cash-In/Cash-Out', description: 'Secure agent float management and customer withdrawals' },
    { title: 'Geo-Fenced Operations', description: 'Location-based risk scoring for fraud prevention' },
  ];

  const bankingUseCases = [
    { title: 'High-Value Transfers', description: 'Biometric authorization for large transactions' },
    { title: 'Beneficiary Management', description: 'Secure addition of new payment beneficiaries' },
    { title: 'Card Controls', description: 'Real-time card blocking and limit changes' },
    { title: 'Loan Disbursement', description: 'Biometric verification for loan approvals' },
    { title: 'Investment Trading', description: 'Secure authorization for buy/sell orders' },
    { title: 'Account Settings', description: 'Biometric protection for sensitive changes' },
  ];

  const mobileMoneyPartners = ['M-Pesa', 'MTN MoMo', 'Airtel Money', 'Wave', 'Orange Money', 'Tigo Pesa'];

  const howItWorks = [
    {
      step: '01',
      title: 'Device Registration',
      description: 'User enrolls their device using WebAuthn/FIDO2. Cryptographic keys generated in secure enclave.'
    },
    {
      step: '02',
      title: 'Transaction Signing',
      description: 'Each transaction is digitally signed on the user\'s device with private key. Bank verifies signature.'
    },
    {
      step: '03',
      title: 'Biometric Confirm',
      description: 'User confirms with biometric (fingerprint/face). Verification happens locally on device.'
    },
  ];

  const apiEndpoints = [
    { method: 'POST', endpoint: '/api/devices/register', description: 'Register new device with WebAuthn' },
    { method: 'POST', endpoint: '/api/transactions/create', description: 'Create and sign transaction' },
    { method: 'POST', endpoint: '/api/risk/analyze', description: 'AI-powered risk analysis' },
    { method: 'GET', endpoint: '/api/audit/logs', description: 'Tamper-proof audit logs' },
    { method: 'POST', endpoint: '/api/auth/login', description: 'Authenticate user' },
    { method: 'POST', endpoint: '/api/behavioral/analyze', description: 'Behavioral biometrics' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Product Navigation */}
      <BioSignNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-slate-950 to-violet-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Compliance Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {complianceBadges.slice(0, 3).map((badge, index) => (
              <span key={index} className={`${badge.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                {badge.name}
              </span>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Secure Transactions{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Without OTP
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Device-bound cryptographic signing with biometric confirmation. Replace SMS/OTP with 
              bank-grade security that's resistant to phishing, SIM swap, and man-in-the-middle attacks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/solutions/biosign/demo"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                Request Demo <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/solutions/biosign/docs"
                className="px-8 py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700"
              >
                <FileText className="w-5 h-5" /> View Documentation
              </Link>
            </div>

            {/* Supported Platforms */}
            <div className="flex items-center justify-center gap-6 text-slate-400">
              <span className="text-sm">Supported Platforms:</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Android</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">iOS</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">WebAuthn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <p className="text-3xl md:text-4xl font-bold text-cyan-400">99.9%</p>
              <p className="text-slate-400 text-sm mt-1">Fraud Prevention</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <p className="text-3xl md:text-4xl font-bold text-violet-400">0ms</p>
              <p className="text-slate-400 text-sm mt-1">OTP Delay</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <p className="text-3xl md:text-4xl font-bold text-emerald-400">&lt;3s</p>
              <p className="text-slate-400 text-sm mt-1">Auth Time</p>
            </div>
            <div className="text-center p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <p className="text-3xl md:text-4xl font-bold text-amber-400">40%</p>
              <p className="text-slate-400 text-sm mt-1">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A complete SDK for implementing secure transaction authorization without relying on vulnerable SMS/OTP mechanisms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-violet-500/30 transition-all">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">Industry Solutions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              Built for Financial Services
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Whether you're a mobile money operator or a traditional bank, BioSign SDK adapts to your specific security and compliance requirements.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('mobile-money')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'mobile-money'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Mobile Money
            </button>
            <button
              onClick={() => setActiveTab('banking')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'banking'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Banking
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-8 md:p-12">
            {activeTab === 'mobile-money' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Mobile Money</h3>
                    <p className="text-slate-400">M-Pesa, MTN MoMo, Airtel Money, Wave, Orange Money</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mobileMoneyPartners.map((partner, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-slate-300 mb-8">
                  Secure mobile money transactions for telcos and fintech across Africa, Asia, and emerging markets.
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">500K+</p>
                    <p className="text-slate-400 text-sm">Agents Secured</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">99.9%</p>
                    <p className="text-slate-400 text-sm">Fraud Prevention</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-violet-400">&lt;3s</p>
                    <p className="text-slate-400 text-sm">Auth Time</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">40%</p>
                    <p className="text-slate-400 text-sm">Cost Reduction</p>
                  </div>
                </div>

                {/* Use Cases Grid */}
                <h4 className="text-lg font-semibold text-white mb-4">Key Use Cases</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mobileMoneyUseCases.map((useCase, index) => (
                    <div key={index} className="p-4 bg-slate-900/50 rounded-xl">
                      <h5 className="font-semibold text-white mb-1">{useCase.title}</h5>
                      <p className="text-slate-400 text-sm">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'banking' && (
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Banking & Financial Institutions</h3>
                  <p className="text-slate-400">Retail banks, corporate banking, investment platforms</p>
                </div>

                <p className="text-slate-300 mb-8">
                  Replace legacy OTP systems with device-bound biometric authentication for all banking transactions.
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">$10B+</p>
                    <p className="text-slate-400 text-sm">Transactions Secured</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-400">99.99%</p>
                    <p className="text-slate-400 text-sm">Uptime SLA</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-violet-400">50+</p>
                    <p className="text-slate-400 text-sm">Bank Partners</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-400">60%</p>
                    <p className="text-slate-400 text-sm">Fraud Reduction</p>
                  </div>
                </div>

                {/* Use Cases Grid */}
                <h4 className="text-lg font-semibold text-white mb-4">Key Use Cases</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bankingUseCases.map((useCase, index) => (
                    <div key={index} className="p-4 bg-slate-900/50 rounded-xl">
                      <h5 className="font-semibold text-white mb-1">{useCase.title}</h5>
                      <p className="text-slate-400 text-sm">{useCase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <Link 
                to="/solutions/biosign/demo"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                See {activeTab === 'mobile-money' ? 'Mobile Money' : 'Banking'} Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Simple integration, powerful security. Replace OTP in three steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-cyan-500/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ChevronRight className="w-8 h-8 text-slate-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Simple Integration
              </h2>
              <p className="text-slate-400 mb-8">
                Integrate BioSign SDK into your existing banking app with just a few lines of code. 
                Full REST API support with SDK libraries for JavaScript, Python, and mobile platforms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/solutions/biosign/docs"
                  className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> View API Documentation
                </Link>
                <Link 
                  to="/solutions/biosign/features"
                  className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all flex items-center justify-center gap-2"
                >
                  Try Interactive Demos
                </Link>
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-400 text-sm ml-2">transaction.js</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="text-slate-300">
{`// Create signed transaction
const transaction = await biosign.createTransaction({
  amount: 1500.00,
  recipient: "ACC-123456",
  currency: "USD"
});

// Risk analysis
const risk = await biosign.analyzeRisk(transaction);

if (risk.level === "low") {
  // Auto-approve low risk
  await biosign.approve(transaction);
} else {
  // Request biometric confirmation
  await biosign.requestBiometric(transaction);
}`}
                </code>
              </pre>
            </div>
          </div>

          {/* API Endpoints Grid */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-white mb-6">API Reference</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiEndpoints.map((api, index) => (
                <div key={index} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {api.method}
                    </span>
                    <code className="text-cyan-400 text-sm">{api.endpoint}</code>
                  </div>
                  <p className="text-slate-400 text-sm">{api.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Badges Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Compliance & Certifications</h3>
            <p className="text-slate-400">Bank-grade security standards for financial services</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {complianceBadges.map((badge, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-cyan-600 to-violet-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Eliminate OTP?
              </h2>
              <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
                Join leading banks and fintechs using BioSign SDK for secure, user-friendly transaction authorization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/solutions/biosign/demo"
                  className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2"
                >
                  Request Demo <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/solutions/biosign/docs"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  Read Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BioSignLandingPage;
