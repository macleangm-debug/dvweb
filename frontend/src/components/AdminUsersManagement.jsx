import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Mail, Building2, Globe, Briefcase, Calendar, Filter,
  Search, RefreshCw, ChevronDown, Eye, Download, UserCheck
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const AdminUsersManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, by_country: {}, by_industry: {}, by_product: {} });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countryFilter) params.append('country', countryFilter);
      if (industryFilter) params.append('industry', industryFilter);
      
      const response = await axios.get(`${API}/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
      setStats(response.data.stats || { total: 0, by_country: {}, by_industry: {}, by_product: {} });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, countryFilter, industryFilter]);

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.organization?.toLowerCase().includes(search) ||
      user.country?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-slate-500">{user.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${user.profile_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user.profile_completed ? 'Profile Complete' : 'Basic Profile'}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Globe className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Country</p>
                  <p className="text-sm font-medium text-slate-900">{user.country || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Industry</p>
                  <p className="text-sm font-medium text-slate-900">{user.industry || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Organization</p>
                  <p className="text-sm font-medium text-slate-900">{user.organization || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <UserCheck className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Job Title</p>
                  <p className="text-sm font-medium text-slate-900">{user.job_title || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Company Size</p>
                <p className="font-medium text-slate-900">{user.company_size || 'Not provided'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Phone</p>
                <p className="font-medium text-slate-900">{user.phone || 'Not provided'}</p>
              </div>
            </div>

            {/* Marketing Info */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-medium mb-1">MARKETING INSIGHT</p>
              <p className="text-sm text-slate-700">
                <span className="font-medium">How they heard about us: </span>
                {user.how_heard || 'Not provided'}
              </p>
            </div>

            {/* Products Accessed */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Products Accessed</p>
              <div className="flex flex-wrap gap-2">
                {user.products_accessed && user.products_accessed.length > 0 ? (
                  user.products_accessed.map(product => (
                    <span key={product} className="px-3 py-1 text-sm bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-700 rounded-full border border-red-200 font-medium">
                      {product.charAt(0).toUpperCase() + product.slice(1)}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm">No products accessed yet</span>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Registered: {formatDate(user.created_at)}</span>
              </div>
              {user.last_login && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Last Login: {formatDate(user.last_login)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">
              Close
            </button>
            <a
              href={`mailto:${user.email}`}
              className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" /> Send Email
            </a>
          </div>
        </div>
      </div>
    );
  };

  const uniqueCountries = [...new Set(users.map(u => u.country).filter(Boolean))];
  const uniqueIndustries = [...new Set(users.map(u => u.industry).filter(Boolean))];

  return (
    <div className="space-y-6" data-testid="admin-users-management">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Countries</p>
              <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.by_country).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Industries</p>
              <p className="text-2xl font-bold text-slate-900">{Object.keys(stats.by_industry).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">FieldForce Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.by_product?.fieldforce || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by name, email, organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              data-testid="users-search"
            />
          </div>
          <div className="relative">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            >
              <option value="">All Countries</option>
              {uniqueCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            >
              <option value="">All Industries</option>
              {uniqueIndustries.map(i => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 py-2.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mr-2" />
            <span className="text-slate-500">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No users found</p>
            <p className="text-sm text-slate-400 mt-1">
              {searchTerm || countryFilter || industryFilter
                ? 'Try adjusting your filters'
                : 'Registered users will appear here'}
            </p>
          </div>
        ) : (
          <table className="w-full" data-testid="users-table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Industry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id || user.email} className="hover:bg-slate-50" data-testid={`user-row-${index}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-slate-900">{user.organization || '-'}</p>
                      <p className="text-xs text-slate-500">{user.job_title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.country || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.industry || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.profile_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {user.profile_completed ? 'Complete' : 'Basic'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900"
                      title="View details"
                      data-testid={`view-user-${index}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default AdminUsersManagement;
