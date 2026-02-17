import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Gift, DollarSign, TrendingUp, Award, Search, ChevronRight,
  ArrowUpRight, ArrowDownRight, Crown, Star, UserPlus, AlertCircle,
  Check, X, RefreshCw, Calendar, Target, Zap
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const API = process.env.REACT_APP_BACKEND_URL;

const ReferralManagement = ({ subSection = 'leaderboard' }) => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [potentialAffiliates, setPotentialAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  
  // Credit adjustment modal
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ user_id: '', amount: '', reason: '' });
  const [adjusting, setAdjusting] = useState(false);

  const token = localStorage.getItem('dv_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, [subSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        axios.get(`${API}/api/admin/referrals/stats`, { headers }),
        axios.get(`${API}/api/admin/referrals/leaderboard?limit=20`, { headers })
      ]);
      setStats(statsRes.data);
      setLeaderboard(leaderboardRes.data.leaderboard || []);

      if (subSection === 'conversions') {
        const convRes = await axios.get(`${API}/api/admin/referrals/conversions?days=30`, { headers });
        setConversions(convRes.data.timeline || []);
      }

      if (subSection === 'credits') {
        const potentialRes = await axios.get(`${API}/api/admin/referrals/potential-affiliates?min_referrals=3`, { headers });
        setPotentialAffiliates(potentialRes.data.potential_affiliates || []);
      }
    } catch (err) {
      console.error('Error fetching referral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const res = await axios.get(`${API}/api/admin/referrals/user/${userId}`, { headers });
      setUserDetails(res.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const adjustCredits = async (e) => {
    e.preventDefault();
    setAdjusting(true);
    try {
      await axios.post(`${API}/api/admin/referrals/credits/adjust`, {
        user_id: adjustForm.user_id,
        amount: parseFloat(adjustForm.amount),
        reason: adjustForm.reason
      }, { headers });
      setShowAdjustModal(false);
      setAdjustForm({ user_id: '', amount: '', reason: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to adjust credits');
    } finally {
      setAdjusting(false);
    }
  };

  const promoteToAffiliate = async (userId) => {
    if (!window.confirm('Promote this user to affiliate status?')) return;
    try {
      const res = await axios.post(`${API}/api/admin/referrals/promote-to-affiliate/${userId}`, {}, { headers });
      alert(`User promoted! Affiliate code: ${res.data.affiliate_code}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to promote user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Leaderboard View
  if (subSection === 'leaderboard') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Referral Leaderboard</h1>
            <p className="text-slate-500 mt-1">Top performing referrers in your network</p>
          </div>
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Total Referrers</div>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{stats.overview.total_referrers}</div>
              <div className="text-sm text-slate-500 mt-1">{stats.overview.active_referrers} active</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Total Referrals</div>
                <Gift className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{stats.overview.total_referrals}</div>
              <div className="text-sm text-emerald-500 mt-1">{stats.overview.conversion_rate}% conversion</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">Credits Issued</div>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">${stats.credits.total_issued}</div>
              <div className="text-sm text-slate-500 mt-1">${stats.credits.outstanding} outstanding</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">This Month</div>
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{stats.this_month.signups}</div>
              <div className="text-sm text-slate-500 mt-1">new signups from referrals</div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Top Referrers</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Rank</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Code</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Referrals</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Conversions</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase">Credits Earned</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-slate-500">
                      No referrers yet
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {user.rank === 1 ? (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Crown className="w-4 h-4 text-amber-600" />
                            </div>
                          ) : user.rank === 2 ? (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="font-bold text-slate-600">2</span>
                            </div>
                          ) : user.rank === 3 ? (
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="font-bold text-orange-600">3</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">{user.rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                          {user.referral_code}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold">{user.total_referrals}</span>
                        {user.pending_referrals > 0 && (
                          <span className="text-amber-600 text-xs ml-1">({user.pending_referrals} pending)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-emerald-600">{user.successful_referrals}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.conversion_rate >= 50 ? 'bg-emerald-100 text-emerald-700' :
                          user.conversion_rate >= 25 ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.conversion_rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        ${user.total_credits_earned}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.affiliate_potential ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium flex items-center gap-1 justify-center">
                            <Star className="w-3 h-3" /> Affiliate Ready
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Active</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewUserDetails(user.user_id)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700"
                            title="View Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          {user.affiliate_potential && (
                            <button
                              onClick={() => promoteToAffiliate(user.user_id)}
                              className="p-1.5 hover:bg-purple-100 rounded text-purple-500 hover:text-purple-700"
                              title="Promote to Affiliate"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
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

        {/* User Details Modal */}
        {selectedUser && userDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{userDetails.user?.name}</h3>
                  <p className="text-sm text-slate-500">{userDetails.user?.email}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-slate-900">{userDetails.profile?.total_referrals || 0}</div>
                    <div className="text-sm text-slate-500">Total Referrals</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{userDetails.profile?.successful_referrals || 0}</div>
                    <div className="text-sm text-slate-500">Conversions</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">${userDetails.profile?.credits_available || 0}</div>
                    <div className="text-sm text-slate-500">Credits Available</div>
                  </div>
                </div>

                {/* Recent Invites */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Recent Invites</h4>
                  {userDetails.invites?.length > 0 ? (
                    <div className="space-y-2">
                      {userDetails.invites.slice(0, 5).map((invite) => (
                        <div key={invite.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{invite.invitee_email}</p>
                            <p className="text-xs text-slate-500">{new Date(invite.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            invite.status === 'converted' ? 'bg-emerald-100 text-emerald-700' :
                            invite.status === 'signed_up' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {invite.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No invites sent</p>
                  )}
                </div>

                {/* Credit Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setAdjustForm({ user_id: selectedUser, amount: '', reason: '' });
                      setShowAdjustModal(true);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
                  >
                    Adjust Credits
                  </button>
                  {userDetails.profile?.successful_referrals >= 5 && (
                    <button
                      onClick={() => {
                        promoteToAffiliate(selectedUser);
                        setSelectedUser(null);
                      }}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                    >
                      Promote to Affiliate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adjust Credits Modal */}
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Adjust User Credits</h3>
              <form onSubmit={adjustCredits} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={adjustForm.amount}
                    onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
                    placeholder="Enter positive or negative amount"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use negative number to deduct credits</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                  <textarea
                    required
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    placeholder="Reason for adjustment"
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAdjustModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adjusting}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                  >
                    {adjusting ? 'Adjusting...' : 'Adjust Credits'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Credits Management View
  if (subSection === 'credits') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Credit Management</h1>
            <p className="text-slate-500 mt-1">Manage referral credits and identify potential affiliates</p>
          </div>
        </div>

        {/* Credit Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Issued</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.credits.total_issued}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Redeemed</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.credits.total_redeemed}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Outstanding</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.credits.outstanding}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Potential Affiliates */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Potential Affiliates</h3>
              <p className="text-sm text-slate-500">Users with 3+ successful referrals who aren't affiliates yet</p>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {potentialAffiliates.length} candidates
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {potentialAffiliates.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No potential affiliates found yet
              </div>
            ) : (
              potentialAffiliates.map((user) => (
                <div key={user.user_id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900">{user.successful_referrals}</p>
                      <p className="text-xs text-slate-500">Referrals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-600">{user.conversion_rate}%</p>
                      <p className="text-xs text-slate-500">Conv. Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">${user.total_credits_earned}</p>
                      <p className="text-xs text-slate-500">Earned</p>
                    </div>
                    <button
                      onClick={() => promoteToAffiliate(user.user_id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Promote
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Conversions View
  if (subSection === 'conversions') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Conversion Analytics</h1>
            <p className="text-slate-500 mt-1">Track referral invites, signups, and conversions over time</p>
          </div>
        </div>

        {/* Conversion Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Conversion Funnel (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={conversions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="invites_sent" 
                name="Invites Sent" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="signups" 
                name="Signups" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2} 
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                name="Conversions" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">This Month Referrals</span>
                <Gift className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.this_month.referrals}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">This Month Signups</span>
                <UserPlus className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-slate-900">{stats.this_month.signups}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">Conversion Rate</span>
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-emerald-600">{stats.this_month.conversion_rate}%</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default ReferralManagement;
