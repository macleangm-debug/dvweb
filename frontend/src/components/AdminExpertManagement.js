import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Search, Filter, Users, UserCheck, UserX, Clock, Star,
  ChevronDown, ChevronRight, Mail, Phone, MapPin, Globe,
  Briefcase, GraduationCap, Calendar, DollarSign, CheckCircle2,
  XCircle, AlertCircle, Eye, Edit, Trash2, X, RefreshCw,
  Shield, Award, TrendingUp, BarChart3, Building2
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Status badge colors
const statusColors = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  approved: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: UserCheck },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700', icon: UserX },
  engaged: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Briefcase }
};

// Trust tier badges
const trustTierColors = {
  bronze: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Bronze' },
  silver: { bg: 'bg-slate-200', text: 'text-slate-700', label: 'Silver' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gold' },
  platinum: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Platinum' }
};

// Verification status badges
const verificationColors = {
  unverified: { bg: 'bg-gray-100', text: 'text-gray-600' },
  pending_verification: { bg: 'bg-amber-100', text: 'text-amber-700' },
  partially_verified: { bg: 'bg-blue-100', text: 'text-blue-700' },
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  trusted: { bg: 'bg-purple-100', text: 'text-purple-700' }
};

const AdminExpertManagement = ({ token }) => {
  const [experts, setExperts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // list, grid

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    sector: '',
    country: '',
    availability: '',
    search: '',
    minExperience: ''
  });

  // Sector options
  const sectorOptions = [
    'Agriculture & Food Security',
    'Health & Pharmaceuticals',
    'Education & Training',
    'Water, Sanitation & Hygiene',
    'Governance & Public Policy',
    'Energy & Environment',
    'Financial Services & Inclusion',
    'Gender & Social Development',
    'Data Science & Analytics',
    'Monitoring & Evaluation'
  ];

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch experts
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.sector) params.append('sector', filters.sector);
      if (filters.country) params.append('country', filters.country);
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.search) params.append('search', filters.search);
      if (filters.minExperience) params.append('min_experience', filters.minExperience);

      const res = await axios.get(`${API}/api/admin/experts?${params.toString()}`, { headers });
      setExperts(res.data);
    } catch (error) {
      console.error('Failed to fetch experts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/experts/stats/summary`, { headers });
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchStats();
  }, []);

  // Update expert status
  const updateStatus = async (expertId, newStatus) => {
    try {
      await axios.put(
        `${API}/api/admin/experts/${expertId}/status?status=${newStatus}`,
        {},
        { headers }
      );
      fetchExperts();
      if (selectedExpert?.id === expertId) {
        setSelectedExpert({ ...selectedExpert, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Delete expert
  const deleteExpert = async (expertId) => {
    if (!window.confirm('Are you sure you want to delete this expert?')) return;
    try {
      await axios.delete(`${API}/api/admin/experts/${expertId}`, { headers });
      fetchExperts();
      if (selectedExpert?.id === expertId) {
        setSelectedExpert(null);
      }
    } catch (error) {
      console.error('Failed to delete expert:', error);
    }
  };

  // Stats cards component
  const StatsCards = () => {
    if (!stats) return null;

    const statCards = [
      { label: 'Total Experts', value: stats.total_experts || 0, icon: Users, color: 'text-[#0a1628]' },
      { label: 'Pending Review', value: stats.by_status?.pending || 0, icon: Clock, color: 'text-amber-600' },
      { label: 'Active', value: stats.by_status?.active || 0, icon: UserCheck, color: 'text-emerald-600' },
      { label: 'Engaged', value: stats.by_status?.engaged || 0, icon: Briefcase, color: 'text-purple-600' }
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-[#e2e8f0] p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b]">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Filters component
  const FilterSection = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 mb-4 overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                data-testid="filter-status"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
                <option value="engaged">Engaged</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                data-testid="filter-sector"
              >
                <option value="">All Sectors</option>
                {sectorOptions.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                data-testid="filter-availability"
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#64748b] mb-1 block">Min Experience</label>
              <input
                type="number"
                value={filters.minExperience}
                onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
                placeholder="Years"
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                data-testid="filter-experience"
              />
            </div>
            <div className="col-span-2 flex items-end gap-2">
              <button
                onClick={fetchExperts}
                className="px-4 py-2 bg-[#e63946] text-white rounded-lg text-sm font-medium hover:bg-[#0a1628] transition-colors"
                data-testid="apply-filters-btn"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setFilters({ status: '', sector: '', country: '', availability: '', search: '', minExperience: '' });
                }}
                className="px-4 py-2 border border-[#e2e8f0] text-[#64748b] rounded-lg text-sm font-medium hover:bg-white transition-colors"
                data-testid="clear-filters-btn"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Expert list item component
  const ExpertCard = ({ expert }) => {
    const statusStyle = statusColors[expert.status] || statusColors.pending;
    const tierStyle = trustTierColors[expert.trust_tier] || trustTierColors.bronze;
    const StatusIcon = statusStyle.icon;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white border border-[#e2e8f0] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedExpert(expert)}
        data-testid={`expert-card-${expert.id}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#0a1628] text-white flex items-center justify-center font-bold text-lg">
              {expert.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-[#0a1628]">{expert.full_name}</h3>
              <p className="text-sm text-[#64748b]">{expert.current_title}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}>
              <StatusIcon className="w-3 h-3" />
              {expert.status}
            </span>
            {expert.verification_score > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                {tierStyle.label} ({Math.round(expert.verification_score)}%)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-[#64748b] mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {expert.location_city}, {expert.location_country}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {expert.years_experience} years
          </div>
        </div>

        {expert.primary_sectors?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {expert.primary_sectors.slice(0, 3).map((sector, i) => (
              <span key={i} className="px-2 py-0.5 bg-[#f8fafc] text-[#64748b] text-xs rounded">
                {sector}
              </span>
            ))}
            {expert.primary_sectors.length > 3 && (
              <span className="px-2 py-0.5 bg-[#f8fafc] text-[#64748b] text-xs rounded">
                +{expert.primary_sectors.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
          <span className="text-xs text-[#64748b]">
            Registered {new Date(expert.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedExpert(expert); }}
              className="p-1 hover:bg-[#f8fafc] rounded"
              data-testid={`view-expert-${expert.id}`}
            >
              <Eye className="w-4 h-4 text-[#64748b]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteExpert(expert.id); }}
              className="p-1 hover:bg-red-50 rounded"
              data-testid={`delete-expert-${expert.id}`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Expert detail panel
  const ExpertDetailPanel = ({ expert, onClose }) => {
    const statusStyle = statusColors[expert.status] || statusColors.pending;
    const tierStyle = trustTierColors[expert.trust_tier] || trustTierColors.bronze;
    const verificationStyle = verificationColors[expert.verification_status] || verificationColors.unverified;

    return (
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
        data-testid="expert-detail-panel"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0a1628] text-white p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-lg"
            data-testid="close-detail-btn"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e63946] text-white flex items-center justify-center font-bold text-xl">
              {expert.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{expert.full_name}</h2>
              <p className="text-white/70">{expert.current_title}</p>
              {expert.current_organization && (
                <p className="text-white/50 text-sm">{expert.current_organization}</p>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
              {expert.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificationStyle.bg} ${verificationStyle.text}`}>
              {expert.verification_status?.replace(/_/g, ' ')}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
              {tierStyle.label} Tier
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#f8fafc] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#0a1628] mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {expert.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateStatus(expert.id, 'approved')}
                    className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 flex items-center gap-1"
                    data-testid="approve-btn"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(expert.id, 'rejected')}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 flex items-center gap-1"
                    data-testid="reject-btn"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {expert.status === 'approved' && (
                <button
                  onClick={() => updateStatus(expert.id, 'active')}
                  className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center gap-1"
                  data-testid="activate-btn"
                >
                  <UserCheck className="w-4 h-4" /> Activate
                </button>
              )}
              {expert.status === 'active' && (
                <button
                  onClick={() => updateStatus(expert.id, 'engaged')}
                  className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 flex items-center gap-1"
                  data-testid="engage-btn"
                >
                  <Briefcase className="w-4 h-4" /> Mark Engaged
                </button>
              )}
              {(expert.status === 'active' || expert.status === 'engaged') && (
                <button
                  onClick={() => updateStatus(expert.id, 'inactive')}
                  className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 flex items-center gap-1"
                  data-testid="deactivate-btn"
                >
                  <UserX className="w-4 h-4" /> Deactivate
                </button>
              )}
            </div>
          </div>

          {/* Verification Score */}
          {expert.verification_score > 0 && (
            <div className="bg-[#f8fafc] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Verification Score
              </h3>
              <div className="relative h-4 bg-[#e2e8f0] rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute h-full ${
                    expert.verification_score >= 85 ? 'bg-indigo-500' :
                    expert.verification_score >= 70 ? 'bg-yellow-500' :
                    expert.verification_score >= 50 ? 'bg-slate-400' : 'bg-orange-400'
                  }`}
                  style={{ width: `${expert.verification_score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#64748b]">
                <span>Score: {Math.round(expert.verification_score)}%</span>
                <span>{tierStyle.label} Tier</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-lg font-bold text-[#0a1628]">{Math.round(expert.skills_assessment_score || 0)}%</p>
                  <p className="text-xs text-[#64748b]">Skills</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-lg font-bold text-[#0a1628]">{Math.round(expert.reference_verification_score || 0)}%</p>
                  <p className="text-xs text-[#64748b]">References</p>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <p className="text-lg font-bold text-[#0a1628]">{Math.round(expert.document_verification_score || 0)}%</p>
                  <p className="text-xs text-[#64748b]">Documents</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${expert.email}`} className="hover:text-[#e63946]">{expert.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <Phone className="w-4 h-4" />
                {expert.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#64748b]">
                <MapPin className="w-4 h-4" />
                {expert.location_city}, {expert.location_country}
              </div>
            </div>
          </div>

          {/* Experience & Skills */}
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Experience & Expertise
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-[#0a1628]">Years of Experience:</span>
                <span className="text-[#64748b]">{expert.years_experience} years</span>
              </div>
              {expert.primary_sectors?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#0a1628] mb-1">Primary Sectors:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.primary_sectors.map((sector, i) => (
                      <span key={i} className="px-2 py-1 bg-[#e63946]/10 text-[#e63946] text-xs rounded">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {expert.skills?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-[#0a1628] mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-[#f8fafc] text-[#64748b] text-xs rounded">
                        {skill.name} ({skill.proficiency})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Geographic Expertise */}
          {expert.countries_experience?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Geographic Expertise
              </h3>
              <div className="flex flex-wrap gap-1">
                {expert.countries_experience.map((country, i) => (
                  <span key={i} className="px-2 py-1 bg-[#f8fafc] text-[#64748b] text-xs rounded">
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability & Rates */}
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Availability & Rates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#64748b]">Availability</p>
                <p className="font-medium text-[#0a1628] capitalize">{expert.availability}</p>
              </div>
              {(expert.daily_rate_min || expert.daily_rate_max) && (
                <div>
                  <p className="text-xs text-[#64748b]">Daily Rate</p>
                  <p className="font-medium text-[#0a1628]">
                    {expert.rate_currency} {expert.daily_rate_min} - {expert.daily_rate_max}
                  </p>
                </div>
              )}
              {expert.engagement_type?.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-[#64748b] mb-1">Engagement Types</p>
                  <div className="flex flex-wrap gap-1">
                    {expert.engagement_type.map((type, i) => (
                      <span key={i} className="px-2 py-1 bg-[#f8fafc] text-[#64748b] text-xs rounded capitalize">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {expert.education?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Education
              </h3>
              <div className="space-y-2">
                {expert.education.map((edu, i) => (
                  <div key={i} className="p-3 bg-[#f8fafc] rounded">
                    <p className="font-medium text-[#0a1628]">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-[#64748b]">{edu.institution} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#0a1628] mb-3">Portfolio & Links</h3>
            <div className="space-y-2">
              {expert.cv_url && (
                <a href={expert.cv_url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 text-sm text-[#e63946] hover:underline">
                  <FileText className="w-4 h-4" /> View CV
                </a>
              )}
              {expert.linkedin_url && (
                <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-[#e63946] hover:underline">
                  <Building2 className="w-4 h-4" /> LinkedIn Profile
                </a>
              )}
              {expert.portfolio_url && (
                <a href={expert.portfolio_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 text-sm text-[#e63946] hover:underline">
                  <Globe className="w-4 h-4" /> Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          {expert.notes && (
            <div>
              <h3 className="text-sm font-semibold text-[#0a1628] mb-3">Admin Notes</h3>
              <p className="text-sm text-[#64748b] bg-[#f8fafc] p-3 rounded">{expert.notes}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white border border-[#e2e8f0] rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#e2e8f0]" />
            <div className="flex-1">
              <div className="h-4 bg-[#e2e8f0] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[#e2e8f0] rounded w-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-[#e2e8f0] rounded w-full" />
            <div className="h-3 bg-[#e2e8f0] rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const FileText = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  return (
    <div data-testid="admin-expert-management">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] font-serif">Expert Network Management</h2>
          <p className="text-sm text-[#64748b]">Manage and review registered experts in your network</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchExperts(); fetchStats(); }}
            className="p-2 border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]"
            data-testid="refresh-btn"
          >
            <RefreshCw className="w-4 h-4 text-[#64748b]" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search by name, email, or title..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && fetchExperts()}
            className="w-full pl-10 pr-4 py-2.5 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            data-testid="search-input"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${
            showFilters ? 'bg-[#0a1628] text-white border-[#0a1628]' : 'border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc]'
          }`}
          data-testid="toggle-filters-btn"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters panel */}
      <FilterSection />

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#64748b]">
          Showing <span className="font-medium text-[#0a1628]">{experts.length}</span> experts
        </p>
      </div>

      {/* Expert Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : experts.length === 0 ? (
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-12 text-center">
          <Users className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No experts found</h3>
          <p className="text-sm text-[#64748b]">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}

      {/* Detail Panel Overlay */}
      <AnimatePresence>
        {selectedExpert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedExpert(null)}
            />
            <ExpertDetailPanel
              expert={selectedExpert}
              onClose={() => setSelectedExpert(null)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExpertManagement;
