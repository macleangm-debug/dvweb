import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Search, Plus, Briefcase, Users, MapPin, Clock, DollarSign,
  ChevronDown, ChevronRight, Star, CheckCircle2, X, Calendar,
  Target, Award, TrendingUp, AlertCircle, Eye, Trash2, RefreshCw,
  FileText, Globe, Zap, Shield, Mail
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Sector options for the form
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

// Common skills by sector
const skillsByCategory = {
  'Research': ['Survey Design', 'Qualitative Research', 'Quantitative Analysis', 'Data Collection', 'Sampling Methods'],
  'Data': ['Statistical Analysis', 'Data Visualization', 'Machine Learning', 'GIS Mapping', 'Database Management'],
  'M&E': ['Logical Framework', 'Theory of Change', 'Impact Evaluation', 'Results-Based Management', 'KPI Development'],
  'Technical': ['Project Management', 'Capacity Building', 'Training Facilitation', 'Report Writing', 'Stakeholder Engagement']
};

// Trust tier badges
const trustTierColors = {
  bronze: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Bronze' },
  silver: { bg: 'bg-slate-200', text: 'text-slate-700', label: 'Silver' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gold' },
  platinum: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Platinum' }
};

const AdminProjectMatching = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('projects'); // projects, matches

  const headers = { Authorization: `Bearer ${token}` };

  // Form state for new project
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sectors: [],
    required_skills: [],
    preferred_skills: [],
    min_experience: 3,
    countries: [],
    start_date: '',
    duration_months: 3,
    engagement_type: 'short-term',
    budget_max: '',
    positions_needed: 1
  });

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/project-requirements`, { headers });
      setProjects(res.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch matches for a project
  const fetchMatches = async (projectId) => {
    setMatchesLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/project-requirements/${projectId}/matches`, { headers });
      setMatches(res.data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // Create new project
  const createProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null
      };
      await axios.post(`${API}/api/admin/project-requirements`, payload, { headers });
      setShowCreateForm(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      sectors: [],
      required_skills: [],
      preferred_skills: [],
      min_experience: 3,
      countries: [],
      start_date: '',
      duration_months: 3,
      engagement_type: 'short-term',
      budget_max: '',
      positions_needed: 1
    });
  };

  // Select project and fetch matches
  const selectProject = (project) => {
    setSelectedProject(project);
    setActiveTab('matches');
    fetchMatches(project.id);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Multi-select handler
  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer ${
        selectedProject?.id === project.id ? 'border-[#e63946] ring-2 ring-[#e63946]/20' : 'border-[#e2e8f0]'
      }`}
      onClick={() => selectProject(project)}
      data-testid={`project-card-${project.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[#0a1628] text-lg">{project.title}</h3>
          <p className="text-sm text-[#64748b] mt-1 line-clamp-2">{project.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          project.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
          project.status === 'filled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {project.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {project.sectors?.slice(0, 3).map((sector, i) => (
          <span key={i} className="px-2 py-0.5 bg-[#e63946]/10 text-[#e63946] text-xs rounded">
            {sector}
          </span>
        ))}
        {project.sectors?.length > 3 && (
          <span className="px-2 py-0.5 bg-[#f8fafc] text-[#64748b] text-xs rounded">
            +{project.sectors.length - 3}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm text-[#64748b] pt-3 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          <span>{project.min_experience}+ yrs</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{project.duration_months} mo</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{project.positions_needed} pos</span>
        </div>
      </div>
    </motion.div>
  );

  // Expert Match Card Component
  const MatchCard = ({ match, rank }) => {
    const tierStyle = trustTierColors[match.trust_tier] || trustTierColors.bronze;
    const combinedScore = (match.match_score * 0.7 + match.verification_score * 0.3).toFixed(0);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.05 }}
        className="bg-white border border-[#e2e8f0] rounded-lg p-4 hover:shadow-md transition-all"
        data-testid={`match-card-${match.expert_id}`}
      >
        <div className="flex items-start gap-4">
          {/* Rank Badge */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
            rank === 0 ? 'bg-yellow-500' : rank === 1 ? 'bg-slate-400' : rank === 2 ? 'bg-orange-400' : 'bg-[#0a1628]'
          }`}>
            #{rank + 1}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-[#0a1628]">{match.expert_name}</h4>
                <p className="text-sm text-[#64748b]">{match.expert_email}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#e63946]">{combinedScore}%</div>
                <p className="text-xs text-[#64748b]">Combined Score</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-3 p-3 bg-[#f8fafc] rounded-lg">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#64748b]">Match Score</span>
                  <span className="text-sm font-medium text-[#0a1628]">{match.match_score.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#e63946]" style={{ width: `${match.match_score}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#64748b]">Verification</span>
                  <span className="text-sm font-medium text-[#0a1628]">{match.verification_score.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${match.verification_score}%` }} />
                </div>
              </div>
            </div>

            {/* Expert Details */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#64748b]">
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {match.years_experience} years exp
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={`capitalize ${
                  match.availability === 'available' ? 'text-emerald-600' : 
                  match.availability === 'limited' ? 'text-amber-600' : 'text-gray-500'
                }`}>
                  {match.availability}
                </span>
              </div>
              {(match.daily_rate_min || match.daily_rate_max) && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${match.daily_rate_min || '?'} - ${match.daily_rate_max || '?'}/day
                </div>
              )}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                {tierStyle.label} Tier
              </span>
            </div>

            {/* Matching Items */}
            <div className="mt-3 space-y-2">
              {match.matching_sectors?.length > 0 && (
                <div>
                  <span className="text-xs text-[#64748b]">Matching Sectors: </span>
                  {match.matching_sectors.map((sector, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded mr-1">
                      {sector}
                    </span>
                  ))}
                </div>
              )}
              {match.matching_skills?.length > 0 && (
                <div>
                  <span className="text-xs text-[#64748b]">Matching Skills: </span>
                  {match.matching_skills.map((skill, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded mr-1">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e2e8f0]">
              <a
                href={`mailto:${match.expert_email}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#e63946] text-white text-sm rounded hover:bg-[#0a1628] transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact
              </a>
              <button className="flex items-center gap-1 px-3 py-1.5 border border-[#e2e8f0] text-[#64748b] text-sm rounded hover:bg-[#f8fafc] transition-colors">
                <Eye className="w-4 h-4" /> View Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Create Project Form
  const CreateProjectForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={() => setShowCreateForm(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0a1628] text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Create Project Requirement</h2>
              <p className="text-white/70 text-sm">Define your project needs to find matching experts</p>
            </div>
            <button
              onClick={() => setShowCreateForm(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={createProject} className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  placeholder="e.g., Agricultural Value Chain Assessment"
                  required
                  data-testid="project-title-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  rows={3}
                  placeholder="Describe the project scope, objectives, and deliverables..."
                  required
                  data-testid="project-description-input"
                />
              </div>
            </div>
          </div>

          {/* Sectors */}
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Sectors Required
            </h3>
            <div className="flex flex-wrap gap-2">
              {sectorOptions.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleArrayItem('sectors', sector)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    formData.sectors.includes(sector)
                      ? 'bg-[#e63946] text-white'
                      : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                  data-testid={`sector-${sector.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Skills
            </h3>
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="mb-4">
                <p className="text-sm font-medium text-[#64748b] mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArrayItem('required_skills', skill)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        formData.required_skills.includes(skill)
                          ? 'bg-emerald-500 text-white'
                          : formData.preferred_skills.includes(skill)
                          ? 'bg-blue-500 text-white'
                          : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]'
                      }`}
                      onDoubleClick={() => {
                        // Double-click to make preferred instead
                        if (formData.required_skills.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            required_skills: prev.required_skills.filter(s => s !== skill),
                            preferred_skills: [...prev.preferred_skills, skill]
                          }));
                        }
                      }}
                    >
                      {skill}
                      {formData.required_skills.includes(skill) && <span className="ml-1 text-xs">(req)</span>}
                      {formData.preferred_skills.includes(skill) && <span className="ml-1 text-xs">(pref)</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-[#64748b] mt-2">Click to select as required. Double-click to mark as preferred.</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Requirements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Min. Experience (years)</label>
                <input
                  type="number"
                  value={formData.min_experience}
                  onChange={(e) => setFormData({ ...formData, min_experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  min={0}
                  data-testid="min-experience-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Positions Needed</label>
                <input
                  type="number"
                  value={formData.positions_needed}
                  onChange={(e) => setFormData({ ...formData, positions_needed: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  min={1}
                  data-testid="positions-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Duration (months)</label>
                <input
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  min={1}
                  data-testid="duration-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Engagement Type</label>
                <select
                  value={formData.engagement_type}
                  onChange={(e) => setFormData({ ...formData, engagement_type: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  data-testid="engagement-type-select"
                >
                  <option value="short-term">Short-term</option>
                  <option value="long-term">Long-term</option>
                  <option value="remote">Remote</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  data-testid="start-date-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#64748b] block mb-1">Max Budget (USD/day)</label>
                <input
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  placeholder="Optional"
                  min={0}
                  data-testid="budget-input"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-[#64748b] hover:bg-[#f8fafc] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#e63946] text-white font-medium rounded-lg hover:bg-[#0a1628] transition-colors flex items-center gap-2"
              data-testid="create-project-btn"
            >
              <Plus className="w-4 h-4" /> Create & Find Matches
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <div data-testid="admin-project-matching">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] font-serif">Project Matching</h2>
          <p className="text-sm text-[#64748b]">Create project requirements and find matching experts automatically</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white rounded-lg hover:bg-[#0a1628] transition-colors"
          data-testid="new-project-btn"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-[#e2e8f0]">
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'projects'
              ? 'text-[#e63946] border-[#e63946]'
              : 'text-[#64748b] border-transparent hover:text-[#0a1628]'
          }`}
          data-testid="projects-tab"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Projects ({projects.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'matches'
              ? 'text-[#e63946] border-[#e63946]'
              : 'text-[#64748b] border-transparent hover:text-[#0a1628]'
          }`}
          disabled={!selectedProject}
          data-testid="matches-tab"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Matches {selectedProject && `(${matches.length})`}
          </div>
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#e2e8f0] rounded-lg p-5 animate-pulse">
                  <div className="h-6 bg-[#e2e8f0] rounded w-3/4 mb-3" />
                  <div className="h-4 bg-[#e2e8f0] rounded w-full mb-2" />
                  <div className="h-4 bg-[#e2e8f0] rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No Projects Yet</h3>
              <p className="text-sm text-[#64748b] mb-4">Create your first project requirement to start matching experts</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-[#e63946] text-white rounded-lg hover:bg-[#0a1628] transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-2" /> Create Project
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          {selectedProject ? (
            <>
              {/* Selected Project Summary */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#0a1628]">{selectedProject.title}</h3>
                    <p className="text-sm text-[#64748b] mt-1">{selectedProject.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedProject.sectors?.map((sector, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#e63946]/10 text-[#e63946] text-xs rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => fetchMatches(selectedProject.id)}
                    className="p-2 hover:bg-white rounded-lg"
                    data-testid="refresh-matches-btn"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#64748b] ${matchesLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Matches List */}
              {matchesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-[#e2e8f0] rounded-lg p-4 animate-pulse">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#e2e8f0]" />
                        <div className="flex-1">
                          <div className="h-5 bg-[#e2e8f0] rounded w-1/3 mb-2" />
                          <div className="h-4 bg-[#e2e8f0] rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className="bg-white border border-[#e2e8f0] rounded-lg p-12 text-center">
                  <Users className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#0a1628] mb-2">No Matches Found</h3>
                  <p className="text-sm text-[#64748b]">
                    No experts match the criteria for this project. Try adjusting the requirements.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-[#64748b]">
                    <span>Top {matches.length} matching experts (ranked by combined score)</span>
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-[#e63946] rounded"></span> Match Score (70%)
                      <span className="inline-block w-3 h-3 bg-emerald-500 rounded ml-2"></span> Verification (30%)
                    </span>
                  </div>
                  {matches.map((match, index) => (
                    <MatchCard key={match.expert_id} match={match} rank={index} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-12 text-center">
              <Target className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Select a Project</h3>
              <p className="text-sm text-[#64748b]">
                Choose a project from the Projects tab to see matching experts
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Form Modal */}
      <AnimatePresence>
        {showCreateForm && <CreateProjectForm />}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjectMatching;
