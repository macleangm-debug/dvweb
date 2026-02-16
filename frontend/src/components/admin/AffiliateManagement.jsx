import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
  Eye, Search, Filter, ChevronDown, Award, CreditCard, 
  Building2, Smartphone, Globe, AlertCircle, RefreshCw,
  AlertTriangle, TrendingDown, Percent, Calendar, Tag,
  Plus, Edit, Trash2, ToggleLeft, ToggleRight, Gift
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const AffiliateManagement = ({ subSection }) => {
  const [affiliates, setAffiliates] = useState([]);
  const [stats, setStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoStats, setPromoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('applications');
  const [kpiPeriod, setKpiPeriod] = useState(30);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');

  const token = localStorage.getItem('dv_token');

  useEffect(() => {
    fetchData();
  }, [statusFilter, activeTab, kpiPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (activeTab === 'applications' || activeTab === 'payouts') {
        // Fetch applications
        const appsRes = await axios.get(
          `${API}/api/affiliates/admin/applications${statusFilter ? `?status=${statusFilter}` : ''}`,
          { headers }
        );
        setAffiliates(appsRes.data.applications || []);
        setStats(appsRes.data.stats || {});

        // Fetch payouts
        const payoutsRes = await axios.get(`${API}/api/affiliates/admin/payouts`, { headers });
        setPayouts(payoutsRes.data.payouts || []);
      }
      
      if (activeTab === 'kpi') {
        // Fetch KPI data
        const kpiRes = await axios.get(
          `${API}/api/affiliates/admin/kpi?period_days=${kpiPeriod}`,
          { headers }
        );
        setKpiData(kpiRes.data);
      }
      
      if (activeTab === 'promo-codes') {
        // Fetch promo codes
        const promoRes = await axios.get(
          `${API}/api/affiliates/admin/promo-codes?include_expired=true`,
          { headers }
        );
        setPromoCodes(promoRes.data.promo_codes || []);
        setPromoStats(promoRes.data.stats || {});
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAffiliateStatus = async (affiliateId, status, notes = '') => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/affiliates/admin/affiliates/${affiliateId}`,
        { status, notes },
        { headers }
      );
      fetchData();
      setSelectedAffiliate(null);
    } catch (err) {
      console.error('Error updating affiliate:', err);
    }
  };

  const suspendAffiliate = async () => {
    if (!suspendModal || suspendReason.length < 10) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/affiliates/admin/affiliates/${suspendModal.id}/suspend?reason=${encodeURIComponent(suspendReason)}`,
        {},
        { headers }
      );
      setSuspendModal(null);
      setSuspendReason('');
      fetchData();
    } catch (err) {
      console.error('Error suspending affiliate:', err);
      alert(err.response?.data?.detail || 'Failed to suspend affiliate');
    }
  };

  const reactivateAffiliate = async (affiliateId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/affiliates/admin/affiliates/${affiliateId}/reactivate`,
        {},
        { headers }
      );
      fetchData();
    } catch (err) {
      console.error('Error reactivating affiliate:', err);
      alert(err.response?.data?.detail || 'Failed to reactivate affiliate');
    }
  };

  const processPayoutStatus = async (payoutId, status, transactionId = null) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/affiliates/admin/payouts/${payoutId}?status=${status}${transactionId ? `&transaction_id=${transactionId}` : ''}`,
        {},
        { headers }
      );
      fetchData();
    } catch (err) {
      console.error('Error processing payout:', err);
    }
  };

  const filteredAffiliates = affiliates.filter(a => 
    searchQuery === '' || 
    a.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'suspended': return 'bg-slate-100 text-slate-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
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

  // Stats Cards
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-sm text-slate-500">Total Affiliates</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats?.total || 0}</p>
      </div>
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-sm text-slate-500">Pending Review</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats?.pending || 0}</p>
      </div>
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-sm text-slate-500">Approved</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats?.approved || 0}</p>
      </div>
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-sm text-slate-500">Rejected</span>
        </div>
        <p className="text-2xl font-bold text-slate-900">{stats?.rejected || 0}</p>
      </div>
    </div>
  );

  // KPI Dashboard
  const KPIDashboard = () => {
    if (!kpiData) return null;

    return (
      <div>
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">Active Affiliates</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpiData.summary.total_active_affiliates}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-slate-500">Underperforming</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{kpiData.summary.underperforming_count}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Performance Rate</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{kpiData.summary.performance_rate}%</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500">Period</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpiPeriod} days</p>
          </div>
        </div>

        {/* KPI Thresholds */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">KPI Thresholds</h4>
              <p className="text-sm text-amber-700 mt-1">
                Affiliates are marked as underperforming if they have fewer than <strong>{kpiData.kpi_thresholds.min_referrals_per_month} referrals per month</strong> or 
                a conversion rate below <strong>{kpiData.kpi_thresholds.min_conversion_rate}%</strong> (with 100+ clicks).
              </p>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-4">
          <select
            value={kpiPeriod}
            onChange={(e) => setKpiPeriod(parseInt(e.target.value))}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* KPI Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Affiliate Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Referrals</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Clicks</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Conversion</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Earnings</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Performance</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {kpiData.affiliates.map((affiliate) => (
                  <tr key={affiliate.affiliate_id} className={`hover:bg-slate-50 ${affiliate.is_underperforming ? 'bg-red-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{affiliate.full_name}</p>
                        <p className="text-sm text-slate-500">{affiliate.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(affiliate.status)}`}>
                        {affiliate.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{affiliate.referrals_in_period}</td>
                    <td className="px-4 py-3 text-right">{affiliate.clicks_in_period}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={affiliate.conversion_rate < 5 && affiliate.clicks_in_period >= 100 ? 'text-red-600 font-medium' : ''}>
                        {affiliate.conversion_rate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-600">
                      ${affiliate.earnings_in_period.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {affiliate.is_underperforming ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <TrendingDown className="w-3 h-3" />
                          Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                          <TrendingUp className="w-3 h-3" />
                          Good
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {affiliate.status === 'suspended' ? (
                        <button
                          onClick={() => reactivateAffiliate(affiliate.affiliate_id)}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200"
                        >
                          Reactivate
                        </button>
                      ) : affiliate.status !== 'pending' && affiliate.status !== 'rejected' && (
                        <button
                          onClick={() => setSuspendModal(affiliate)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Promo Codes Management
  const PromoCodesSection = () => {
    const [promoForm, setPromoForm] = useState({
      code: '',
      name: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 10,
      max_uses: '',
      max_uses_per_user: 1,
      min_order_value: '',
      applicable_products: [],
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true
    });

    const handlePromoSubmit = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const payload = {
          ...promoForm,
          max_uses: promoForm.max_uses ? parseInt(promoForm.max_uses) : null,
          min_order_value: promoForm.min_order_value ? parseFloat(promoForm.min_order_value) : null,
          start_date: new Date(promoForm.start_date).toISOString(),
          end_date: new Date(promoForm.end_date).toISOString()
        };

        if (editingPromo) {
          await axios.put(`${API}/api/affiliates/admin/promo-codes/${editingPromo.id}`, payload, { headers });
        } else {
          await axios.post(`${API}/api/affiliates/admin/promo-codes`, payload, { headers });
        }
        
        setShowPromoModal(false);
        setEditingPromo(null);
        setPromoForm({
          code: '',
          name: '',
          description: '',
          discount_type: 'percentage',
          discount_value: 10,
          max_uses: '',
          max_uses_per_user: 1,
          min_order_value: '',
          applicable_products: [],
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          is_active: true
        });
        fetchData();
      } catch (err) {
        console.error('Error saving promo code:', err);
        alert(err.response?.data?.detail || 'Failed to save promo code');
      }
    };

    const deletePromoCode = async (promoId) => {
      if (!window.confirm('Are you sure you want to delete this promo code?')) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API}/api/affiliates/admin/promo-codes/${promoId}`, { headers });
        fetchData();
      } catch (err) {
        console.error('Error deleting promo code:', err);
      }
    };

    const togglePromoStatus = async (promo) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        await axios.put(
          `${API}/api/affiliates/admin/promo-codes/${promo.id}`,
          { is_active: !promo.is_active },
          { headers }
        );
        fetchData();
      } catch (err) {
        console.error('Error toggling promo status:', err);
      }
    };

    return (
      <div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-slate-500">Total Codes</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{promoStats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Active</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{promoStats?.active || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <ToggleLeft className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-sm text-slate-500">Inactive</span>
            </div>
            <p className="text-2xl font-bold text-slate-600">{promoStats?.inactive || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-slate-500">Expired</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{promoStats?.expired || 0}</p>
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingPromo(null);
              setShowPromoModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Create Promo Code
          </button>
        </div>

        {/* Promo Codes Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Promo Codes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Discount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Products</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Valid Period</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Usage</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promoCodes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                      No promo codes yet. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  promoCodes.map((promo) => {
                    const isExpired = new Date(promo.end_date) < new Date();
                    const productLabels = {
                      fieldforce: 'FF',
                      survey360: 'S360',
                      datapulse: 'DP'
                    };
                    const productColors = {
                      fieldforce: 'bg-teal-100 text-teal-700',
                      survey360: 'bg-purple-100 text-purple-700',
                      datapulse: 'bg-orange-100 text-orange-700'
                    };
                    return (
                      <tr key={promo.id} className={`hover:bg-slate-50 ${isExpired ? 'bg-slate-50' : ''}`}>
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            {promo.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{promo.name}</p>
                          {promo.description && (
                            <p className="text-sm text-slate-500 truncate max-w-xs">{promo.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900">
                            {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `$${promo.discount_value}`}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {promo.applicable_products && promo.applicable_products.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {promo.applicable_products.map((product) => (
                                <span 
                                  key={product} 
                                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${productColors[product] || 'bg-slate-100 text-slate-700'}`}
                                  title={product === 'fieldforce' ? 'FieldForce' : product === 'survey360' ? 'Survey360' : 'DataPulse'}
                                >
                                  {productLabels[product] || product}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">All Products</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <div>{new Date(promo.start_date).toLocaleDateString()}</div>
                          <div className="text-slate-400">to {new Date(promo.end_date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-medium">{promo.times_used || 0}</span>
                          {promo.max_uses && <span className="text-slate-400">/{promo.max_uses}</span>}
                        </td>
                        <td className="px-4 py-3">
                          {isExpired ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Expired</span>
                          ) : promo.is_active ? (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">Inactive</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {!isExpired && (
                              <button
                                onClick={() => togglePromoStatus(promo)}
                                className={`p-1.5 rounded-lg ${promo.is_active ? 'hover:bg-slate-100' : 'hover:bg-emerald-100'}`}
                                title={promo.is_active ? 'Deactivate' : 'Activate'}
                              >
                                {promo.is_active ? (
                                  <ToggleRight className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-slate-400" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingPromo(promo);
                                setPromoForm({
                                  code: promo.code,
                                  name: promo.name,
                                  description: promo.description || '',
                                  discount_type: promo.discount_type,
                                  discount_value: promo.discount_value,
                                  max_uses: promo.max_uses || '',
                                  max_uses_per_user: promo.max_uses_per_user,
                                  min_order_value: promo.min_order_value || '',
                                  applicable_products: promo.applicable_products || [],
                                  start_date: promo.start_date.split('T')[0],
                                  end_date: promo.end_date.split('T')[0],
                                  is_active: promo.is_active
                                });
                                setShowPromoModal(true);
                              }}
                              className="p-1.5 hover:bg-blue-100 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => deletePromoCode(promo.id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Promo Code Modal */}
        {showPromoModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-900">
                  {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
                </h3>
                <button
                  onClick={() => {
                    setShowPromoModal(false);
                    setEditingPromo(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Code *</label>
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                      placeholder="NEWYEAR25"
                      disabled={editingPromo}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={promoForm.name}
                      onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="New Year Discount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea
                    value={promoForm.description}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                    placeholder="Special discount for the new year..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type</label>
                    <select
                      value={promoForm.discount_type}
                      onChange={(e) => setPromoForm({ ...promoForm, discount_type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed_amount">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value *</label>
                    <input
                      type="number"
                      value={promoForm.discount_value}
                      onChange={(e) => setPromoForm({ ...promoForm, discount_value: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step={promoForm.discount_type === 'percentage' ? '1' : '0.01'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={promoForm.start_date}
                      onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      value={promoForm.end_date}
                      onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Uses (empty = unlimited)</label>
                    <input
                      type="number"
                      value={promoForm.max_uses}
                      onChange={(e) => setPromoForm({ ...promoForm, max_uses: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Order Value ($)</label>
                    <input
                      type="number"
                      value={promoForm.min_order_value}
                      onChange={(e) => setPromoForm({ ...promoForm, min_order_value: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step="0.01"
                      placeholder="No minimum"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={promoForm.is_active}
                    onChange={(e) => setPromoForm({ ...promoForm, is_active: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                    Active immediately
                  </label>
                </div>

                {/* Applicable Products Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Applicable Products</label>
                  <div className="space-y-2">
                    {['fieldforce', 'survey360', 'datapulse'].map((product) => (
                      <label key={product} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={promoForm.applicable_products.includes(product)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPromoForm({
                                ...promoForm,
                                applicable_products: [...promoForm.applicable_products, product]
                              });
                            } else {
                              setPromoForm({
                                ...promoForm,
                                applicable_products: promoForm.applicable_products.filter(p => p !== product)
                              });
                            }
                          }}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-slate-700 capitalize">
                          {product === 'fieldforce' ? 'FieldForce' : product === 'survey360' ? 'Survey360' : 'DataPulse'}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {promoForm.applicable_products.length === 0 
                      ? 'Leave empty to apply to all products' 
                      : `Applies to: ${promoForm.applicable_products.map(p => p === 'fieldforce' ? 'FieldForce' : p === 'survey360' ? 'Survey360' : 'DataPulse').join(', ')}`}
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowPromoModal(false);
                      setEditingPromo(null);
                    }}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePromoSubmit}
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingPromo ? 'Save Changes' : 'Create Code'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Applications List
  const ApplicationsList = () => (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Affiliate Applications</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search affiliates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={fetchData}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Payment Method</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Applied</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAffiliates.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No affiliate applications found
                </td>
              </tr>
            ) : (
              filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{affiliate.full_name}</p>
                      <p className="text-sm text-slate-500">{affiliate.company_name || '-'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-900">{affiliate.email}</p>
                    <p className="text-sm text-slate-500">{affiliate.phone || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    {affiliate.payment_info ? (
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(affiliate.payment_info.payment_method)}
                        <span className="text-sm text-slate-600 capitalize">
                          {affiliate.payment_info.payment_method?.replace('_', ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Not provided</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(affiliate.status)}`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(affiliate.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAffiliate(affiliate)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                      {affiliate.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateAffiliateStatus(affiliate.id, 'approved')}
                            className="p-1.5 hover:bg-emerald-100 rounded-lg"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button
                            onClick={() => updateAffiliateStatus(affiliate.id, 'rejected')}
                            className="p-1.5 hover:bg-red-100 rounded-lg"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Payouts List
  const PayoutsList = () => (
    <div className="bg-white rounded-xl border border-slate-200 mt-6">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Payout Requests</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Affiliate</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Method</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Requested</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                  No payout requests
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{payout.affiliate_name || 'Unknown'}</p>
                    <p className="text-sm text-slate-500">{payout.affiliate_email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    ${payout.amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payout.payment_method)}
                      <span className="text-sm text-slate-600 capitalize">
                        {payout.payment_method?.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(payout.requested_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {payout.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => processPayoutStatus(payout.id, 'completed')}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => processPayoutStatus(payout.id, 'failed')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {payout.status === 'completed' && (
                      <span className="text-sm text-emerald-600">Processed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Detail Modal
  const DetailModal = () => {
    if (!selectedAffiliate) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-900">Affiliate Details</h3>
            <button
              onClick={() => setSelectedAffiliate(null)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <XCircle className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-3">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Full Name</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Company</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.company_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Website</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.website_url || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Audience Size</p>
                  <p className="font-medium text-slate-900">{selectedAffiliate.audience_size?.toLocaleString() || '-'}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {selectedAffiliate.payment_info && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Payment Information</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {getPaymentMethodIcon(selectedAffiliate.payment_info.payment_method)}
                    <span className="font-medium text-slate-900 capitalize">
                      {selectedAffiliate.payment_info.payment_method?.replace('_', ' ')}
                    </span>
                  </div>
                  {selectedAffiliate.payment_info.payment_method === 'bank_transfer' && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-400">Bank:</span> {selectedAffiliate.payment_info.bank_name}</div>
                      <div><span className="text-slate-400">Account:</span> {selectedAffiliate.payment_info.account_number}</div>
                      <div><span className="text-slate-400">Holder:</span> {selectedAffiliate.payment_info.account_name}</div>
                      <div><span className="text-slate-400">SWIFT:</span> {selectedAffiliate.payment_info.swift_code || '-'}</div>
                    </div>
                  )}
                  {selectedAffiliate.payment_info.payment_method === 'paypal' && (
                    <div className="text-sm">
                      <span className="text-slate-400">PayPal Email:</span> {selectedAffiliate.payment_info.paypal_email}
                    </div>
                  )}
                  {selectedAffiliate.payment_info.payment_method === 'mpesa' && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-slate-400">Phone:</span> {selectedAffiliate.payment_info.mpesa_phone}</div>
                      <div><span className="text-slate-400">Name:</span> {selectedAffiliate.payment_info.mpesa_name}</div>
                    </div>
                  )}
                  {selectedAffiliate.payment_info.payment_method === 'crypto' && (
                    <div className="text-sm space-y-1">
                      <div><span className="text-slate-400">Network:</span> {selectedAffiliate.payment_info.crypto_network}</div>
                      <div><span className="text-slate-400">Wallet:</span> <span className="font-mono text-xs">{selectedAffiliate.payment_info.crypto_wallet}</span></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Promotion Methods */}
            {selectedAffiliate.promotion_methods?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Promotion Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAffiliate.promotion_methods.map((method, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Why Join */}
            {selectedAffiliate.application_data?.why_join && (
              <div>
                <h4 className="text-sm font-medium text-slate-500 mb-3">Why They Want to Join</h4>
                <p className="text-slate-600 text-sm">{selectedAffiliate.application_data.why_join}</p>
              </div>
            )}

            {/* Referral Code */}
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-3">Referral Code</h4>
              <div className="bg-slate-100 rounded-lg px-4 py-2 font-mono text-slate-900">
                {selectedAffiliate.referral_code}
              </div>
            </div>

            {/* Actions */}
            {selectedAffiliate.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'approved')}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Application
                </button>
                <button
                  onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'rejected')}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Suspend Modal
  const SuspendModal = () => {
    if (!suspendModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900">Suspend Affiliate</h3>
            <p className="text-sm text-slate-500 mt-1">
              Suspending <strong>{suspendModal.full_name}</strong>
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">
                  This will prevent the affiliate from earning commissions and accessing their dashboard.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason for Suspension *
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Provide a detailed reason (min 10 characters)..."
              />
              <p className="text-xs text-slate-400 mt-1">
                {suspendReason.length}/10 characters minimum
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setSuspendModal(null);
                  setSuspendReason('');
                }}
                className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={suspendAffiliate}
                disabled={suspendReason.length < 10}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suspend Affiliate
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Affiliate Program</h2>
        <p className="text-slate-500">Manage affiliates, track performance, and create promo codes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Applications
          </span>
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'payouts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Payouts
          </span>
        </button>
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'kpi'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            KPI Tracking
          </span>
        </button>
        <button
          onClick={() => setActiveTab('promo-codes')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'promo-codes'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Promo Codes
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'applications' && (
        <>
          <StatsCards />
          <ApplicationsList />
        </>
      )}
      {activeTab === 'payouts' && (
        <>
          <StatsCards />
          <PayoutsList />
        </>
      )}
      {activeTab === 'kpi' && <KPIDashboard />}
      {activeTab === 'promo-codes' && <PromoCodesSection />}

      <DetailModal />
      <SuspendModal />
    </div>
  );
};

export default AffiliateManagement;
