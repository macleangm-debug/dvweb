import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users, Gift, DollarSign, Share2, Mail, Copy, Check,
  ArrowLeft, Send, Clock, CheckCircle, XCircle, ExternalLink,
  Coins, TrendingUp, Award, ChevronRight
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const ReferralDashboard = () => {
  const [stats, setStats] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [invites, setInvites] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  
  // Invite form
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', message: '' });
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');

  const token = localStorage.getItem('dv_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, codeRes, invitesRes, historyRes] = await Promise.all([
        axios.get(`${API}/api/referrals/my-stats`, { headers }),
        axios.get(`${API}/api/referrals/my-code`, { headers }),
        axios.get(`${API}/api/referrals/my-invites`, { headers }),
        axios.get(`${API}/api/referrals/credits/history`, { headers })
      ]);
      setStats(statsRes.data);
      setReferralCode(codeRes.data);
      setInvites(invitesRes.data.invites || []);
      setCreditHistory(historyRes.data.transactions || []);
    } catch (err) {
      console.error('Error fetching referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setInviteError('');
    setInviteSuccess('');
    
    try {
      await axios.post(`${API}/api/referrals/invite`, inviteForm, { headers });
      setInviteSuccess(`Invitation sent to ${inviteForm.email}!`);
      setInviteForm({ email: '', name: '', message: '' });
      fetchData(); // Refresh data
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess('');
      }, 2000);
    } catch (err) {
      setInviteError(err.response?.data?.detail || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0a1628] to-[#1a2942] text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-lg" data-testid="back-button">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Referral Program</h1>
              <p className="text-white/70">Invite friends, earn credits</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Users className="w-4 h-4" />
                Total Referrals
              </div>
              <div className="text-3xl font-bold">{stats?.total_referrals || 0}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <CheckCircle className="w-4 h-4" />
                Successful
              </div>
              <div className="text-3xl font-bold text-emerald-400">{stats?.successful_referrals || 0}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Coins className="w-4 h-4" />
                Credits Earned
              </div>
              <div className="text-3xl font-bold text-amber-400">${stats?.total_credits_earned || 0}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                Available
              </div>
              <div className="text-3xl font-bold text-green-400">${stats?.credits_available || 0}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Referral Link Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-1">Your Referral Link</h2>
              <p className="text-sm text-slate-500">Share this link with friends to earn credits</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 lg:flex-none">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2">
                  <span className="text-slate-600 font-mono text-sm truncate max-w-[250px]">
                    {referralCode?.referral_links?.main || 'Loading...'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(referralCode?.referral_links?.main)}
                    className="p-1 hover:bg-slate-200 rounded"
                    data-testid="copy-link-btn"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                data-testid="invite-friend-btn"
              >
                <Send className="w-4 h-4" />
                Invite Friend
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
            <div className="text-sm text-slate-500">Your code:</div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="font-mono font-bold text-amber-700">{referralCode?.referral_code || '...'}</span>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-medium text-slate-900">Share Your Link</h4>
                <p className="text-sm text-slate-600">Send your referral link to friends and colleagues</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-medium text-slate-900">They Sign Up</h4>
                <p className="text-sm text-slate-600">When they create an account, you both get ${referralCode?.rewards?.signup_bonus || 10} credits</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-medium text-slate-900">Earn More</h4>
                <p className="text-sm text-slate-600">Get ${referralCode?.rewards?.purchase_bonus || 25} more when they make their first purchase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'overview', label: 'Invitations', icon: Users },
            { id: 'credits', label: 'Credit History', icon: Coins },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
              data-testid={`tab-${tab.id}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Your Invitations</h3>
            </div>
            {invites.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No invitations sent yet</p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-4 text-red-500 font-medium hover:underline"
                >
                  Send your first invitation →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {invites.map((invite) => (
                  <div key={invite.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        invite.status === 'converted' ? 'bg-emerald-100' :
                        invite.status === 'signed_up' ? 'bg-blue-100' :
                        'bg-slate-100'
                      }`}>
                        <Mail className={`w-5 h-5 ${
                          invite.status === 'converted' ? 'text-emerald-600' :
                          invite.status === 'signed_up' ? 'text-blue-600' :
                          'text-slate-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{invite.invitee_name || invite.invitee_email}</p>
                        <p className="text-sm text-slate-500">{invite.invitee_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invite.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                        invite.status === 'signed_up' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {invite.status === 'converted' ? 'Converted' :
                         invite.status === 'signed_up' ? 'Signed Up' :
                         'Pending'}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Credit History</h3>
              <div className="text-sm text-slate-500">
                Balance: <span className="font-semibold text-emerald-600">${stats?.credits_available || 0}</span>
              </div>
            </div>
            {creditHistory.length === 0 ? (
              <div className="p-8 text-center">
                <Coins className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No credit transactions yet</p>
                <p className="text-sm text-slate-400 mt-1">Start inviting friends to earn credits!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {creditHistory.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.amount > 0 ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {tx.amount > 0 ? (
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <DollarSign className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{tx.description}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Invite a Friend</h3>
            
            {inviteSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {inviteSuccess}
              </div>
            )}
            
            {inviteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                {inviteError}
              </div>
            )}
            
            <form onSubmit={sendInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="friend@example.com"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  data-testid="invite-email-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Their Name</label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Personal Message</label>
                <textarea
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm({ ...inviteForm, message: e.target.value })}
                  placeholder="Hey! I've been using DataVision and thought you'd love it..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="send-invite-btn"
                >
                  {inviting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Invite
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralDashboard;
