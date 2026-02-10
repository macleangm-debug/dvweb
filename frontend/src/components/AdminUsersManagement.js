import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Download, 
  Search, 
  Filter, 
  Globe, 
  Building2, 
  Package,
  ChevronDown,
  X,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  MapPin,
  Briefcase
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const INDUSTRIES = {
  agriculture: "Agriculture & Food Security",
  healthcare: "Healthcare & Public Health",
  education: "Education & Training",
  government: "Government & Public Sector",
  ngo: "NGO & Non-Profit",
  research: "Research & Academia",
  finance: "Financial Services",
  environment: "Environment & Conservation",
  wash: "WASH (Water, Sanitation, Hygiene)",
  humanitarian: "Humanitarian Aid",
  other: "Other"
};

const AdminUsersManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, by_country: {}, by_industry: {}, by_product: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected users for bulk actions
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
      setStats(response.data.stats || { total: 0, by_country: {}, by_industry: {}, by_product: {} });
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = !countryFilter || user.country === countryFilter;
    const matchesIndustry = !industryFilter || user.industry === industryFilter;
    const matchesProduct = !productFilter || (user.products_accessed || []).includes(productFilter);
    
    return matchesSearch && matchesCountry && matchesIndustry && matchesProduct;
  });

  // Get unique countries and industries for filter dropdowns
  const countries = [...new Set(users.map(u => u.country).filter(Boolean))].sort();
  const industries = [...new Set(users.map(u => u.industry).filter(Boolean))].sort();

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual selection
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const usersToExport = selectedUsers.length > 0 
      ? filteredUsers.filter(u => selectedUsers.includes(u.id))
      : filteredUsers;
    
    const headers = ['Name', 'Email', 'Country', 'Industry', 'Organization', 'Job Title', 'Company Size', 'Phone', 'Products', 'Registered'];
    const rows = usersToExport.map(u => [
      u.name || '',
      u.email || '',
      u.country || '',
      INDUSTRIES[u.industry] || u.industry || '',
      u.organization || '',
      u.job_title || '',
      u.company_size || '',
      u.phone || '',
      (u.products_accessed || []).join('; '),
      u.created_at ? new Date(u.created_at).toLocaleDateString() : ''
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `datavision_users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCountryFilter('');
    setIndustryFilter('');
    setProductFilter('');
  };

  const hasActiveFilters = searchQuery || countryFilter || industryFilter || productFilter;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#e63946] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] font-serif">Client Management</h2>
          <p className="text-sm text-[#64748b] mt-1">Manage registered clients and marketing segments</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a1628] text-white text-sm font-medium hover:bg-[#0a1628]/90 transition-all"
        >
          <Download className="w-4 h-4" />
          Export {selectedUsers.length > 0 ? `(${selectedUsers.length})` : 'All'} to CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{stats.total}</p>
              <p className="text-xs text-[#64748b]">Total Clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{Object.keys(stats.by_country).length}</p>
              <p className="text-xs text-[#64748b]">Countries</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{stats.by_product?.fieldforce || 0}</p>
              <p className="text-xs text-[#64748b]">FieldForce Clients</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e2e8f0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0a1628]">{stats.by_product?.survey360 || 0}</p>
              <p className="text-xs text-[#64748b]">Survey360 Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segment Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* By Country */}
        <div className="bg-white border border-[#e2e8f0] p-4">
          <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#64748b]" />
            Clients by Country
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(stats.by_country).length > 0 ? (
              Object.entries(stats.by_country)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">{country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-[#0a1628] w-8">{count}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-[#64748b]">No country data yet</p>
            )}
          </div>
        </div>

        {/* By Industry */}
        <div className="bg-white border border-[#e2e8f0] p-4">
          <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#64748b]" />
            Clients by Industry
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(stats.by_industry).length > 0 ? (
              Object.entries(stats.by_industry)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b] truncate max-w-[150px]">
                      {INDUSTRIES[industry] || industry}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-[#0a1628] w-8">{count}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-[#64748b]">No industry data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-[#e2e8f0] p-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0a1628]"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'border-[#0a1628] bg-[#0a1628] text-white'
                : 'border-[#e2e8f0] text-[#64748b] hover:border-[#0a1628]'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-[#e63946] rounded-full text-xs flex items-center justify-center">
                {[countryFilter, industryFilter, productFilter].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-[#e63946] hover:underline"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#e2e8f0]">
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Country</label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0a1628]"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Industry</label>
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0a1628]"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{INDUSTRIES[industry] || industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#64748b] mb-1">Product</label>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#0a1628]"
              >
                <option value="">All Products</option>
                <option value="fieldforce">FieldForce</option>
                <option value="survey360">Survey360</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-[#64748b]">
          Showing {filteredUsers.length} of {users.length} users
          {selectedUsers.length > 0 && ` (${selectedUsers.length} selected)`}
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e2e8f0] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 accent-[#0a1628]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Organization</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Products</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#64748b]">
                  {hasActiveFilters ? 'No users match your filters' : 'No users registered yet'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8fafc]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 accent-[#0a1628]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#0a1628]">{user.name || 'Unknown'}</p>
                      <p className="text-sm text-[#64748b] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-[#94a3b8] flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {user.country ? (
                        <p className="text-sm text-[#0a1628] flex items-center gap-1">
                          <Globe className="w-3 h-3 text-[#64748b]" />
                          {user.country}
                        </p>
                      ) : (
                        <span className="text-xs text-[#94a3b8]">—</span>
                      )}
                      {user.industry && (
                        <p className="text-xs text-[#64748b] mt-1">
                          {INDUSTRIES[user.industry] || user.industry}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      {user.organization ? (
                        <>
                          <p className="text-sm text-[#0a1628] flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#64748b]" />
                            {user.organization}
                          </p>
                          {user.job_title && (
                            <p className="text-xs text-[#64748b] flex items-center gap-1 mt-1">
                              <Briefcase className="w-3 h-3" />
                              {user.job_title}
                            </p>
                          )}
                          {user.company_size && (
                            <p className="text-xs text-[#94a3b8]">{user.company_size} employees</p>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[#94a3b8]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {(user.products_accessed || []).length > 0 ? (
                        user.products_accessed.map(product => (
                          <span
                            key={product}
                            className={`text-xs px-2 py-1 rounded-full ${
                              product === 'fieldforce'
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {product === 'fieldforce' ? 'FieldForce' : 'Survey360'}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#94a3b8]">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-[#64748b]">
                      <Calendar className="w-3 h-3" />
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                    </div>
                    {user.last_login && (
                      <p className="text-xs text-[#94a3b8] mt-1">
                        Last: {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagement;
