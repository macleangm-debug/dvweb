import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  DollarSign, Users, TrendingUp, Gift, CheckCircle, ArrowRight,
  Zap, Globe, Shield, Award, ChevronRight, Star, Clock,
  CreditCard, Smartphone, Building2, Target, BarChart3, Mail,
  Phone, User, Briefcase, Link as LinkIcon, MessageCircle
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Tier card component
const TierCard = ({ tier, isHighlighted }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`relative rounded-2xl p-6 border ${
      isHighlighted 
        ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30' 
        : 'bg-white/5 border-white/10'
    }`}
  >
    {isHighlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
        MOST POPULAR
      </div>
    )}
    <div 
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
      style={{ backgroundColor: `${tier.color}20` }}
    >
      <Award className="w-6 h-6" style={{ color: tier.color }} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
    <div className="text-3xl font-bold text-white mb-1">
      {tier.commission_rate}%
    </div>
    <p className="text-sm text-slate-400 mb-4">
      {tier.min_referrals === 0 ? 'Starting tier' : `${tier.min_referrals}+ referrals`}
    </p>
    <ul className="space-y-2">
      {tier.benefits.map((benefit, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          {benefit}
        </li>
      ))}
    </ul>
  </motion.div>
);

// Application form component
const ApplicationForm = ({ onSubmit, loading }) => {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Payment Info
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    website_url: '',
    audience_size: '',
    audience_description: '',
    promotion_methods: [],
    why_join: '',
    social_profiles: { linkedin: '', twitter: '', youtube: '' },
    payment_info: {
      payment_method: '',
      bank_name: '',
      account_name: '',
      account_number: '',
      swift_code: '',
      paypal_email: '',
      mpesa_phone: '',
      mpesa_name: '',
      crypto_wallet: '',
      crypto_network: ''
    },
    agreed_to_terms: false
  });

  const promotionOptions = [
    { id: 'blog', label: 'Blog/Website', icon: Globe },
    { id: 'social', label: 'Social Media', icon: MessageCircle },
    { id: 'email', label: 'Email Marketing', icon: Mail },
    { id: 'youtube', label: 'YouTube', icon: Smartphone },
    { id: 'podcast', label: 'Podcast', icon: Zap },
    { id: 'courses', label: 'Online Courses', icon: Building2 }
  ];

  const paymentMethods = [
    { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
    { id: 'paypal', label: 'PayPal', icon: CreditCard },
    { id: 'mpesa', label: 'M-Pesa', icon: Smartphone },
    { id: 'crypto', label: 'Cryptocurrency', icon: Globe }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'agreed_to_terms') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        // Handle promotion methods
        setFormData(prev => ({
          ...prev,
          promotion_methods: checked 
            ? [...prev.promotion_methods, name]
            : prev.promotion_methods.filter(m => m !== name)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payment_info: { ...prev.payment_info, [field]: value }
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_profiles: { ...prev.social_profiles, [platform]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    onSubmit({
      ...formData,
      audience_size: formData.audience_size ? parseInt(formData.audience_size) : null
    });
  };

  const renderPaymentFields = () => {
    const method = formData.payment_info.payment_method;
    
    switch (method) {
      case 'bank_transfer':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bank Name *</label>
              <input
                type="text"
                value={formData.payment_info.bank_name}
                onChange={(e) => handlePaymentChange('bank_name', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="e.g., CRDB Bank, NMB Bank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={formData.payment_info.account_name}
                onChange={(e) => handlePaymentChange('account_name', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="Full name as on bank account"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Number *</label>
              <input
                type="text"
                value={formData.payment_info.account_number}
                onChange={(e) => handlePaymentChange('account_number', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="Your bank account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">SWIFT Code (for international transfers)</label>
              <input
                type="text"
                value={formData.payment_info.swift_code}
                onChange={(e) => handlePaymentChange('swift_code', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="Optional"
              />
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">PayPal Email *</label>
              <input
                type="email"
                value={formData.payment_info.paypal_email}
                onChange={(e) => handlePaymentChange('paypal_email', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="your-paypal@email.com"
              />
            </div>
          </div>
        );
      case 'mpesa':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">M-Pesa Phone Number *</label>
              <input
                type="tel"
                value={formData.payment_info.mpesa_phone}
                onChange={(e) => handlePaymentChange('mpesa_phone', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="+255 7XX XXX XXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Registered Name *</label>
              <input
                type="text"
                value={formData.payment_info.mpesa_name}
                onChange={(e) => handlePaymentChange('mpesa_name', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="Name registered with M-Pesa"
              />
            </div>
          </div>
        );
      case 'crypto':
        return (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Crypto Network *</label>
              <select
                value={formData.payment_info.crypto_network}
                onChange={(e) => handlePaymentChange('crypto_network', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Select network</option>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT-TRC20">USDT (TRC20)</option>
                <option value="USDT-ERC20">USDT (ERC20)</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address *</label>
              <input
                type="text"
                value={formData.payment_info.crypto_wallet}
                onChange={(e) => handlePaymentChange('crypto_wallet', e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none font-mono text-sm"
                placeholder="Your wallet address"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-red-400' : 'text-slate-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>1</div>
          <span className="text-sm font-medium">Basic Info</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-700" />
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-red-400' : 'text-slate-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}>2</div>
          <span className="text-sm font-medium">Payment Info</span>
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="+255 123 456 789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Company/Organization</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
                placeholder="Your Company"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
            <input
              type="url"
              name="website_url"
              value={formData.website_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Audience Size (estimated)</label>
            <input
              type="number"
              name="audience_size"
              value={formData.audience_size}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none"
              placeholder="10000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">How will you promote DataVision?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {promotionOptions.map(option => (
                <label 
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.promotion_methods.includes(option.id)
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={option.id}
                    checked={formData.promotion_methods.includes(option.id)}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <option.icon className="w-4 h-4" />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tell us about your audience</label>
            <textarea
              name="audience_description"
              value={formData.audience_description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
              placeholder="Describe your audience demographics, interests, and why they'd be interested in data collection tools..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Why do you want to join?</label>
            <textarea
              name="why_join"
              value={formData.why_join}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-red-500 focus:outline-none resize-none"
              placeholder="Tell us why you're excited to partner with DataVision..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
          >
            Continue to Payment Info
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      ) : (
        <>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-300">Payment Information Required</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Provide your payment details now so we can pay your commissions. You earn 10% on every referred customer's payment for up to 12 months.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Select Payment Method *</label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <label 
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.payment_info.payment_method === method.id
                      ? 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.id}
                    checked={formData.payment_info.payment_method === method.id}
                    onChange={(e) => handlePaymentChange('payment_method', e.target.value)}
                    className="hidden"
                  />
                  <method.icon className="w-5 h-5" />
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {renderPaymentFields()}

          <div className="flex items-start gap-3 mt-6">
            <input
              type="checkbox"
              name="agreed_to_terms"
              checked={formData.agreed_to_terms}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500"
            />
            <label className="text-sm text-slate-400">
              I agree to the <Link to="/terms" className="text-red-400 hover:underline">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="text-red-400 hover:underline">Affiliate Agreement</Link>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !formData.agreed_to_terms || !formData.payment_info.payment_method}
              className="flex-1 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

const AffiliateProgramPage = () => {
  const [programInfo, setProgramInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramInfo = async () => {
      try {
        const res = await axios.get(`${API}/api/affiliates/program-info`);
        setProgramInfo(res.data);
      } catch (err) {
        console.error('Error fetching program info:', err);
        // Use default data if API fails
        setProgramInfo({
          tiers: [
            { name: 'Bronze', min_referrals: 0, max_referrals: 5, commission_rate: 10, color: '#CD7F32', benefits: ['Basic dashboard', 'Monthly payouts'] },
            { name: 'Silver', min_referrals: 6, max_referrals: 20, commission_rate: 15, color: '#C0C0C0', benefits: ['Priority support', 'Bi-weekly payouts', 'Custom links'] },
            { name: 'Gold', min_referrals: 21, max_referrals: 50, commission_rate: 20, color: '#FFD700', benefits: ['Dedicated manager', 'Weekly payouts', 'Co-marketing'] },
            { name: 'Platinum', min_referrals: 51, max_referrals: null, commission_rate: 25, color: '#E5E4E2', benefits: ['VIP support', 'Instant payouts', 'Revenue bonuses'] }
          ],
          highlights: ['Earn up to 25% commission', 'Get paid via Bank, PayPal, M-Pesa', '90-day cookie duration', 'Referred users get 20% off'],
          payout_settings: { min_threshold: 50, payment_methods: ['bank_transfer', 'paypal', 'mpesa', 'crypto'], currency: 'USD' },
          referral_benefits: { discount_percent: 20, extended_trial_days: 14 }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProgramInfo();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await axios.post(`${API}/api/affiliates/apply`, formData);
      setSubmitted(true);
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    { value: '25%', label: 'Max Commission', icon: DollarSign },
    { value: '90', label: 'Day Cookie', icon: Clock },
    { value: '$50', label: 'Min Payout', icon: CreditCard },
    { value: '3', label: 'Products', icon: Target }
  ];

  const howItWorks = [
    { step: 1, title: 'Apply & Get Approved', description: 'Submit your application and get approved within 24-48 hours', icon: User },
    { step: 2, title: 'Share Your Link', description: 'Get your unique referral link and start sharing with your audience', icon: LinkIcon },
    { step: 3, title: 'Earn Commissions', description: 'Earn up to 25% on every sale from your referrals', icon: DollarSign },
    { step: 4, title: 'Get Paid', description: 'Request payouts via bank transfer, PayPal, M-Pesa, or crypto', icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/30 mb-6">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-300">Affiliate Partner Program</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Earn Up to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                25% Commission
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Partner with DataVision and earn recurring commissions by promoting our powerful 
              data collection and analytics solutions. Join Africa's leading research tech affiliate program.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2"
              >
                Become an Affiliate
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <stat.icon className="w-5 h-5 text-red-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Start earning in 4 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="relative"
              >
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-red-500/50 to-transparent" />
                )}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-xs text-red-400 font-semibold mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Commission Tiers</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The more you refer, the more you earn. Unlock higher commission rates as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {programInfo?.tiers?.map((tier, idx) => (
              <TierCard key={idx} tier={tier} isHighlighted={tier.name === 'Gold'} />
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Products You Can Promote</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Earn commissions on our full suite of data solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'FieldForce', desc: 'Mobile data collection for field teams', commission: '15%', color: '#14b8a6', link: '/solutions/fieldforce' },
              { name: 'Survey360', desc: 'Professional survey management platform', commission: '15%', color: '#8b5cf6', link: '/solutions/survey360' },
              { name: 'DataPulse', desc: 'Enterprise data collection infrastructure', commission: '20%', color: '#f97316', link: '/solutions/datapulse' }
            ].map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${product.color}20` }}>
                  <BarChart3 className="w-6 h-6" style={{ color: product.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: product.color }}>{product.commission}</span>
                  <Link to={product.link} className="text-sm text-slate-400 hover:text-white flex items-center gap-1">
                    View product <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-12 border border-red-500/20"
          >
            <Gift className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8">
              Join our affiliate program today and start earning commissions on every referral. 
              Your referred users also get {programInfo?.referral_benefits?.discount_percent || 20}% off their first purchase!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all flex items-center gap-2 mx-auto"
            >
              Apply Now - It's Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Application Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800"
          >
            <div className="sticky top-0 bg-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Affiliate Application</h3>
                <p className="text-sm text-slate-400">Join the DataVision Partner Program</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                  {error}
                </div>
              )}
              <ApplicationForm onSubmit={handleSubmit} loading={submitting} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center border border-slate-800"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-slate-400 mb-6">
              Thank you for applying to the DataVision Affiliate Program. We'll review your application 
              and get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AffiliateProgramPage;
