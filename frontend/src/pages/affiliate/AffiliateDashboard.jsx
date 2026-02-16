import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  DollarSign, Users, TrendingUp, Copy, Check, ExternalLink,
  Clock, CreditCard, Building2, Smartphone, Globe, Award,
  ArrowRight, Download, Filter, Calendar, ChevronDown,
  Wallet, Target, BarChart3, Share2, Link as LinkIcon,
  MousePointer, Eye, Lightbulb, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const API = process.env.REACT_APP_BACKEND_URL;

const AffiliateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({ code: false, link: false, short: false });
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutLoading, setPayoutLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('dv_token');

  useEffect(() => {
    if (!token) {
      navigate('/auth/login?redirect=affiliate-dashboard');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch profile
      const profileRes = await axios.get(`${API}/api/affiliates/my-profile`, { headers });
      
      if (!profileRes.data.is_affiliate) {
        setError('not_affiliate');
        setLoading(false);
        return;
      }
      
      setProfile(profileRes.data);

      // Fetch referrals
      const referralsRes = await axios.get(`${API}/api/affiliates/my-referrals`, { headers });
      setReferrals(referralsRes.data.referrals || []);

      // Fetch commissions
      const commissionsRes = await axios.get(`${API}/api/affiliates/my-commissions`, { headers });
      setCommissions(commissionsRes.data.commissions || []);

      // Fetch payouts
      const payoutsRes = await axios.get(`${API}/api/affiliates/my-payouts`, { headers });
      setPayouts(payoutsRes.data.payouts || []);

      // Fetch analytics
      const analyticsRes = await axios.get(`${API}/api/affiliates/my-analytics?period_days=${analyticsPeriod}`, { headers });
      setAnalytics(analyticsRes.data);

    } catch (err) {
      console.error('Error fetching affiliate data:', err);
      if (err.response?.status === 404) {
        setError('not_affiliate');
      } else {
        setError('fetch_error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh analytics when period changes
  useEffect(() => {
    if (profile && token) {
      const fetchAnalytics = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const analyticsRes = await axios.get(`${API}/api/affiliates/my-analytics?period_days=${analyticsPeriod}`, { headers });
          setAnalytics(analyticsRes.data);
        } catch (err) {
          console.error('Error fetching analytics:', err);
        }
      };
      fetchAnalytics();
    }
  }, [analyticsPeriod]);

    } catch (err) {
      console.error('Error fetching affiliate data:', err);
      if (err.response?.status === 404) {
        setError('not_affiliate');
      } else {
        setError('fetch_error');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const requestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) return;
    
    setPayoutLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API}/api/affiliates/request-payout`, {
        amount: parseFloat(payoutAmount),
        payment_method: profile.payment_info?.payment_method || 'bank_transfer',
        payment_details: profile.payment_info || {}
      }, { headers });
      
      setShowPayoutModal(false);
      setPayoutAmount('');
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Error requesting payout:', err);
      alert(err.response?.data?.detail || 'Failed to request payout');
    } finally {
      setPayoutLoading(false);
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'bank_transfer': return <Building2 className="w-4 h-4" />;
      case 'paypal': return <CreditCard className="w-4 h-4" />;
      case 'mpesa': return <Smartphone className="w-4 h-4" />;
      case 'crypto': return <Globe className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error === 'not_affiliate') {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Not an Affiliate Yet</h1>
          <p className="text-slate-400 mb-8">
            You haven't joined our affiliate program yet. Apply now and start earning 10% commission on every referral!
          </p>
          <Link
            to="/affiliate"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all"
          >
            Apply to Affiliate Program
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'fetch_error') {
    return (
      <div className="min-h-screen bg-slate-950 pt-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-slate-400 mb-8">There was an error loading your affiliate dashboard. Please try again.</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Shortened link uses /api/r/ path
  const shortenedLink = `${API}/r/${profile?.referral_code}`;
  const fullReferralLink = profile?.referral_link || `https://datavision.co.tz/?ref=${profile?.referral_code}`;
  const conversionRate = profile?.total_clicks > 0 
    ? ((profile?.total_referrals / profile?.total_clicks) * 100).toFixed(1) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${profile?.tier_color}30` }}
            >
              <Award className="w-5 h-5" style={{ color: profile?.tier_color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
              <p className="text-slate-400 text-sm">{profile?.tier} Partner • {profile?.commission_rate}% Commission</p>
            </div>
          </div>
        </div>

        {/* Promo Code & Referral Links - Prominent */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Promo Code */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-lg">Your Promo Code</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-900/50 rounded-xl px-4 py-3 font-mono text-2xl font-bold text-center tracking-wider">
                {profile?.referral_code}
              </div>
              <button
                onClick={() => copyToClipboard(profile?.referral_code, 'code')}
                className={`p-3 rounded-xl transition-all ${
                  copied.code ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-white/20'
                }`}
                data-testid="copy-promo-code-btn"
              >
                {copied.code ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Share this code with your audience. They get 20% off their first purchase!
            </p>
          </motion.div>

          {/* Shortened Referral Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-lg">Shortened Referral Link</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">NEW</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-900/50 rounded-xl px-4 py-3 font-mono text-base text-emerald-300 truncate">
                {shortenedLink}
              </div>
              <button
                onClick={() => copyToClipboard(shortenedLink, 'short')}
                className={`p-3 rounded-xl transition-all ${
                  copied.short ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 hover:bg-white/20'
                }`}
                data-testid="copy-short-link-btn"
              >
                {copied.short ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Easy to share shortened link. Perfect for social media & SMS!
            </p>
          </motion.div>
        </div>

        {/* Full Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900/30 rounded-xl p-4 border border-slate-800 mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <LinkIcon className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-500">Full Link:</span>
              <span className="text-sm text-slate-400 truncate">{fullReferralLink}</span>
            </div>
            <button
              onClick={() => copyToClipboard(fullReferralLink, 'link')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${
                copied.link ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 hover:bg-white/10 text-slate-400'
              }`}
              data-testid="copy-full-link-btn"
            >
              {copied.link ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied.link ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 pl-7">
            90-day cookie tracking • Auto-attributed referrals
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 rounded-xl p-5 border border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-400">Total Clicks</span>
            </div>
            <p className="text-2xl font-bold">{profile?.total_clicks || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-slate-900/50 rounded-xl p-5 border border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-400">Referrals</span>
            </div>
            <p className="text-2xl font-bold">{profile?.total_referrals || 0}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 rounded-xl p-5 border border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-slate-400">Conversion</span>
            </div>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-slate-900/50 rounded-xl p-5 border border-slate-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-sm text-slate-400">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold">${(profile?.total_earnings || 0).toFixed(2)}</p>
          </motion.div>
        </div>

        {/* Earnings Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 rounded-xl p-6 border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-300 text-sm">Available Balance</span>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">${(profile?.available_balance || 0).toFixed(2)}</p>
            {(profile?.available_balance || 0) >= 50 && (
              <button
                onClick={() => setShowPayoutModal(true)}
                className="mt-4 w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Request Payout
              </button>
            )}
            {(profile?.available_balance || 0) < 50 && (
              <p className="mt-3 text-xs text-slate-400">Min. $50 required for payout</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-amber-500/10 rounded-xl p-6 border border-amber-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-300 text-sm">Pending Earnings</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400">${(profile?.pending_earnings || 0).toFixed(2)}</p>
            <p className="mt-3 text-xs text-slate-400">Processing within 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Total Paid Out</span>
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-blue-400">${(profile?.paid_out || 0).toFixed(2)}</p>
            <p className="mt-3 text-xs text-slate-400">Lifetime payouts</p>
          </motion.div>
        </div>

        {/* Tier Progress */}
        {profile?.next_tier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progress to {profile.next_tier}</h3>
              <span className="text-sm text-slate-400">{profile.referrals_to_next_tier} more referrals needed</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(100, ((profile.total_referrals / (profile.total_referrals + profile.referrals_to_next_tier)) * 100))}%` 
                }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>{profile.tier}</span>
              <span>{profile.next_tier}</span>
            </div>
          </motion.div>
        )}

        {/* Commission End Date Warning */}
        {profile?.commission_end_date && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20 mb-8"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm text-amber-300 font-medium">Commission Period Active</p>
                <p className="text-xs text-slate-400">
                  Your commission earning period ends on {new Date(profile.commission_end_date).toLocaleDateString()}. 
                  Continue referring to maximize your earnings!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Referrals', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'commissions', label: 'Commissions', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-red-400 border-red-500'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Period Selector */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Link Performance Analytics</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={analyticsPeriod}
                  onChange={(e) => setAnalyticsPeriod(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"
                  data-testid="analytics-period-select"
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={60}>Last 60 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>

            {/* Analytics Summary Cards */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">Total Clicks</span>
                  </div>
                  <p className="text-xl font-bold">{analytics.summary.total_clicks}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-slate-400">Referrals</span>
                  </div>
                  <p className="text-xl font-bold">{analytics.summary.period_referrals}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400">Conversions</span>
                  </div>
                  <p className="text-xl font-bold">{analytics.summary.period_conversions}</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-slate-400">Conv. Rate</span>
                  </div>
                  <p className="text-xl font-bold">{analytics.summary.conversion_rate}%</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Avg/Day</span>
                  </div>
                  <p className="text-xl font-bold">{analytics.summary.avg_clicks_per_day}</p>
                </div>
              </div>
            )}

            {/* Clicks Over Time Chart */}
            {analytics?.daily_clicks && (
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <h4 className="font-semibold mb-4">Clicks Over Time</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.daily_clicks}>
                      <defs>
                        <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth()+1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #334155',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        fill="url(#clickGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Sources & Geographic Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Referral Sources */}
              {analytics?.top_sources && analytics.top_sources.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Top Referral Sources
                  </h4>
                  <div className="space-y-3">
                    {analytics.top_sources.map((source, index) => {
                      const maxClicks = analytics.top_sources[0]?.clicks || 1;
                      const percentage = (source.clicks / maxClicks) * 100;
                      return (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-slate-300 truncate max-w-[200px]" title={source.source}>
                              {source.source}
                            </span>
                            <span className="text-sm font-medium text-white">{source.clicks} clicks</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {analytics.top_sources.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No source data yet</p>
                  )}
                </div>
              )}

              {/* Geographic Breakdown */}
              {analytics?.geo_breakdown && analytics.geo_breakdown.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Geographic Breakdown
                  </h4>
                  <div className="space-y-3">
                    {analytics.geo_breakdown.map((region, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-300">{region.region}</span>
                          <span className="text-sm text-slate-400">{region.percentage}% ({region.clicks} clicks)</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                            style={{ width: `${region.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI-Generated Insights */}
            {analytics?.insights && analytics.insights.length > 0 && (
              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Performance Insights
                </h4>
                <div className="space-y-3">
                  {analytics.insights.map((insight, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        insight.type === 'success' ? 'bg-emerald-500/10' :
                        insight.type === 'warning' ? 'bg-amber-500/10' :
                        insight.type === 'tip' ? 'bg-blue-500/10' :
                        'bg-slate-800/50'
                      }`}
                    >
                      {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'tip' && <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
                      {insight.type === 'info' && <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium text-sm text-white">{insight.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{insight.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {(!analytics || analytics.summary.total_clicks === 0) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Analytics Data Yet</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  Share your referral link to start tracking clicks and conversions. 
                  Analytics will appear here once your link gets some traffic.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Recent Referrals - Only show on overview tab */}
        {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-slate-900/50 rounded-xl border border-slate-800 mb-8"
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold">Recent Referrals</h3>
            <span className="text-sm text-slate-400">{referrals.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Commission</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                      No referrals yet. Share your promo code to start earning!
                    </td>
                  </tr>
                ) : (
                  referrals.slice(0, 10).map((referral, idx) => (
                    <tr key={referral.id || idx} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 text-sm">{referral.referred_email}</td>
                      <td className="px-4 py-3 text-sm capitalize">{referral.product}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'converted' ? 'bg-emerald-500/20 text-emerald-400' :
                          referral.status === 'signed_up' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-500/20 text-slate-400'
                        }`}>
                          {referral.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-400">
                        ${(referral.commission_earned || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {new Date(referral.signup_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Commissions Table */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold">Commission History</h3>
                <span className="text-sm text-slate-400">{commissions.length} commissions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Referral</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {commissions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                          No commissions yet. Get referrals to start earning!
                        </td>
                      </tr>
                    ) : (
                      commissions.map((commission, idx) => (
                        <tr key={commission.id || idx} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-sm">{commission.referral_email || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-emerald-400">
                            +${commission.amount?.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              commission.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                              commission.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {commission.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {commission.created_at ? new Date(commission.created_at).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payout History in Commissions Tab */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold">Payout History</h3>
                <span className="text-sm text-slate-400">{payouts.length} payouts</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Method</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Requested</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 uppercase">Processed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {payouts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                          No payouts yet
                        </td>
                      </tr>
                    ) : (
                      payouts.map((payout, idx) => (
                        <tr key={payout.id || idx} className="hover:bg-slate-800/30">
                          <td className="px-4 py-3 text-sm font-semibold">${payout.amount?.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-sm">
                              {getPaymentMethodIcon(payout.payment_method)}
                              <span className="capitalize">{payout.payment_method?.replace('_', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payout.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              payout.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                              payout.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {new Date(payout.requested_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-400">
                            {payout.processed_at ? new Date(payout.processed_at).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-800"
          >
            <h3 className="text-xl font-bold mb-4">Request Payout</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Available Balance</label>
              <p className="text-2xl font-bold text-emerald-400">${(profile?.available_balance || 0).toFixed(2)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Payout Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  max={profile?.available_balance || 0}
                  min={50}
                  className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Enter amount (min $50)"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Payment Method</label>
              <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
                {getPaymentMethodIcon(profile?.payment_info?.payment_method)}
                <span className="capitalize">{profile?.payment_info?.payment_method?.replace('_', ' ') || 'Not set'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 py-3 bg-slate-800 rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={requestPayout}
                disabled={payoutLoading || !payoutAmount || parseFloat(payoutAmount) < 50 || parseFloat(payoutAmount) > (profile?.available_balance || 0)}
                className="flex-1 py-3 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {payoutLoading ? 'Processing...' : 'Request Payout'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;
