import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle,
  Eye, Search, Filter, ChevronDown, Award, CreditCard, 
  Building2, Smartphone, Globe, AlertCircle, RefreshCw
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const AffiliateManagement = ({ subSection }) => {
  const [affiliates, setAffiliates] = useState([]);
  const [stats, setStats] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('dv_token');

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
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
    } catch (err) {
      console.error('Error fetching affiliate data:', err);
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
        <p className="text-slate-500">Manage affiliate applications and payouts</p>
      </div>

      <StatsCards />
      <ApplicationsList />
      <PayoutsList />
      <DetailModal />
    </div>
  );
};

export default AffiliateManagement;
