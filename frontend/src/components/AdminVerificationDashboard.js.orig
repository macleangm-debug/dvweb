/**
 * Expert Verification Dashboard Component
 * Admin UI for managing expert verification: assessments, references, documents
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Shield, FileText, Users, CheckCircle2, XCircle, Clock, 
  AlertCircle, ChevronRight, Mail, RefreshCw, Eye, Send,
  Award, Star, TrendingUp, Download, Upload, Clipboard
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Verification status colors
const statusColors = {
  unverified: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unverified' },
  pending_verification: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  partially_verified: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Partial' },
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Verified' },
  trusted: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Trusted' }
};

// Trust tier colors
const tierColors = {
  bronze: { bg: 'bg-orange-100', text: 'text-orange-700', color: '#f97316' },
  silver: { bg: 'bg-slate-200', text: 'text-slate-700', color: '#64748b' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', color: '#eab308' },
  platinum: { bg: 'bg-indigo-100', text: 'text-indigo-700', color: '#6366f1' }
};

const AdminVerificationDashboard = ({ token }) => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sectors, setSectors] = useState([]);
  const [sendingReference, setSendingReference] = useState(false);
  const [referenceForm, setReferenceForm] = useState({ name: '', email: '', organization: '' });

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch experts with verification status
  const fetchExperts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/experts`, { headers });
      setExperts(res.data);
    } catch (error) {
      console.error('Failed to fetch experts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available assessment sectors
  const fetchSectors = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/assessments/sectors`, { headers });
      setSectors(res.data.sectors || []);
    } catch (error) {
      console.error('Failed to fetch sectors:', error);
    }
  };

  // Fetch verification details for selected expert
  const fetchVerificationData = async (expertId) => {
    try {
      const res = await axios.get(`${API}/api/admin/experts/${expertId}/verification`, { headers });
      setVerificationData(res.data);
    } catch (error) {
      console.error('Failed to fetch verification data:', error);
      setVerificationData(null);
    }
  };

  // Request reference check
  const requestReference = async (expertId) => {
    if (!referenceForm.name || !referenceForm.email) return;
    setSendingReference(true);
    try {
      await axios.post(`${API}/api/admin/experts/${expertId}/request-reference`, referenceForm, { headers });
      setReferenceForm({ name: '', email: '', organization: '' });
      fetchVerificationData(expertId);
    } catch (error) {
      console.error('Failed to request reference:', error);
    } finally {
      setSendingReference(false);
    }
  };

  // Request all references at once
  const requestAllReferences = async (expertId) => {
    try {
      await axios.post(`${API}/api/admin/experts/${expertId}/request-all-references`, {}, { headers });
      fetchVerificationData(expertId);
    } catch (error) {
      console.error('Failed to request all references:', error);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchSectors();
  }, []);

  useEffect(() => {
    if (selectedExpert) {
      fetchVerificationData(selectedExpert.id);
    }
  }, [selectedExpert]);

  // Verification Score Gauge
  const ScoreGauge = ({ score, label, color }) => (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
          <circle 
            cx="48" cy="48" r="40" 
            stroke={color} 
            strokeWidth="8" 
            fill="none"
            strokeDasharray={`${score * 2.51} 251`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#0a1628]">{Math.round(score)}%</span>
        </div>
      </div>
      <p className="text-sm text-[#64748b] mt-2">{label}</p>
    </div>
  );

  // Expert Card
  const ExpertCard = ({ expert }) => {
    const verifyStyle = statusColors[expert.verification_status] || statusColors.unverified;
    const tierStyle = tierColors[expert.trust_tier] || tierColors.bronze;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          selectedExpert?.id === expert.id ? 'border-[#e63946] ring-2 ring-[#e63946]/20' : 'border-[#e2e8f0]'
        }`}
        onClick={() => setSelectedExpert(expert)}
        data-testid={`verification-expert-${expert.id}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#0a1628] text-white flex items-center justify-center font-bold">
            {expert.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#0a1628] truncate">{expert.full_name}</h4>
            <p className="text-sm text-[#64748b] truncate">{expert.current_title}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${verifyStyle.bg} ${verifyStyle.text}`}>
              {verifyStyle.label}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
              {expert.trust_tier}
            </span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-[#e63946]">{Math.round(expert.verification_score || 0)}%</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Verification Detail Panel
  const VerificationPanel = () => {
    if (!selectedExpert || !verificationData) return null;

    const tierStyle = tierColors[verificationData.trust_tier] || tierColors.bronze;

    return (
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a1628] text-white p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#e63946] flex items-center justify-center text-2xl font-bold">
              {selectedExpert.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{verificationData.expert_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[verificationData.verification_status]?.bg} ${statusColors[verificationData.verification_status]?.text}`}>
                  {statusColors[verificationData.verification_status]?.label}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                  {verificationData.trust_tier} Tier
                </span>
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-bold">{Math.round(verificationData.verification_score)}%</div>
              <p className="text-white/60 text-sm">Overall Score</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#e2e8f0]">
          <div className="flex">
            {['overview', 'assessments', 'references', 'documents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-[#e63946] border-b-2 border-[#e63946]'
                    : 'text-[#64748b] hover:text-[#0a1628]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Breakdown */}
              <div>
                <h3 className="font-semibold text-[#0a1628] mb-4">Score Breakdown</h3>
                <div className="grid grid-cols-3 gap-6">
                  <ScoreGauge 
                    score={verificationData.components?.skills_score || 0} 
                    label="Skills (40%)"
                    color="#e63946"
                  />
                  <ScoreGauge 
                    score={verificationData.components?.reference_score || 0} 
                    label="References (35%)"
                    color="#2a9d8f"
                  />
                  <ScoreGauge 
                    score={verificationData.components?.document_score || 0} 
                    label="Documents (25%)"
                    color="#f59e0b"
                  />
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#f8fafc] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#0a1628]">
                    {verificationData.assessments_passed}/{verificationData.assessments_completed}
                  </div>
                  <p className="text-sm text-[#64748b]">Assessments Passed</p>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#0a1628]">
                    {verificationData.references_verified}/{verificationData.references_requested}
                  </div>
                  <p className="text-sm text-[#64748b]">References Verified</p>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#0a1628]">
                    {verificationData.documents_verified}/{verificationData.documents_submitted}
                  </div>
                  <p className="text-sm text-[#64748b]">Documents Verified</p>
                </div>
                <div className="bg-[#f8fafc] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: tierStyle.color }}>
                    {verificationData.trust_tier}
                  </div>
                  <p className="text-sm text-[#64748b]">Trust Tier</p>
                </div>
              </div>

              {/* Trust Tier Scale */}
              <div>
                <h3 className="font-semibold text-[#0a1628] mb-3">Trust Tier Progress</h3>
                <div className="relative h-8 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 flex">
                    <div className="w-1/4 bg-orange-400 flex items-center justify-center text-xs text-white font-medium">Bronze</div>
                    <div className="w-1/4 bg-slate-400 flex items-center justify-center text-xs text-white font-medium">Silver</div>
                    <div className="w-1/4 bg-yellow-400 flex items-center justify-center text-xs text-white font-medium">Gold</div>
                    <div className="w-1/4 bg-indigo-500 flex items-center justify-center text-xs text-white font-medium">Platinum</div>
                  </div>
                  <div 
                    className="absolute top-0 h-full w-1 bg-[#0a1628] border-2 border-white shadow-lg"
                    style={{ left: `${verificationData.verification_score}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#64748b] mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>70%</span>
                  <span>85%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0a1628]">Skills Assessments</h3>
                <span className="text-sm text-[#64748b]">
                  {verificationData.assessments_passed} passed of {verificationData.assessments_completed} completed
                </span>
              </div>

              {/* Available Sectors */}
              <div className="grid md:grid-cols-2 gap-3">
                {sectors.map((sector) => {
                  const completed = selectedExpert.skills_assessments_completed?.includes(sector);
                  return (
                    <div 
                      key={sector}
                      className={`p-4 rounded-lg border ${
                        completed ? 'border-emerald-300 bg-emerald-50' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#0a1628] capitalize">{sector.replace('_', ' ')}</span>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#64748b]" />
                        )}
                      </div>
                      <p className="text-sm text-[#64748b] mt-1">
                        {completed ? 'Assessment completed' : 'Pending assessment'}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-[#64748b] bg-[#f8fafc] p-3 rounded">
                Experts can complete assessments from their profile page. Each passed assessment contributes to their verification score.
              </p>
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0a1628]">Reference Checks</h3>
                <button
                  onClick={() => requestAllReferences(selectedExpert.id)}
                  className="text-sm text-[#e63946] hover:underline flex items-center gap-1"
                >
                  <Send className="w-4 h-4" /> Request All Listed References
                </button>
              </div>

              {/* Add New Reference */}
              <div className="bg-[#f8fafc] rounded-lg p-4">
                <h4 className="font-medium text-[#0a1628] mb-3">Request New Reference</h4>
                <div className="grid md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Reference Name"
                    value={referenceForm.name}
                    onChange={(e) => setReferenceForm({ ...referenceForm, name: e.target.value })}
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={referenceForm.email}
                    onChange={(e) => setReferenceForm({ ...referenceForm, email: e.target.value })}
                    className="px-3 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                  />
                  <button
                    onClick={() => requestReference(selectedExpert.id)}
                    disabled={sendingReference || !referenceForm.name || !referenceForm.email}
                    className="px-4 py-2 bg-[#e63946] text-white rounded-lg hover:bg-[#0a1628] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingReference ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Send Request
                  </button>
                </div>
              </div>

              {/* Reference Status Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Email notifications are currently logged to the console. 
                      In production, integrate with an email service (SendGrid, SES) to send actual reference request emails.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#64748b]">
                {verificationData.references_verified} of {verificationData.references_requested} references have responded.
              </p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#0a1628]">Document Verification</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {['CV/Resume', 'Degree Certificate', 'Professional Certification', 'ID Document'].map((docType) => {
                  const verified = selectedExpert.documents_verified?.includes(docType.toLowerCase());
                  return (
                    <div 
                      key={docType}
                      className={`p-4 rounded-lg border ${
                        verified ? 'border-emerald-300 bg-emerald-50' : 'border-[#e2e8f0]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#0a1628]">{docType}</span>
                        {verified ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#64748b]" />
                        )}
                      </div>
                      <p className="text-sm text-[#64748b]">
                        {verified ? 'Document verified' : 'Awaiting upload'}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-[#64748b] bg-[#f8fafc] p-3 rounded">
                Experts can upload documents from their profile. Documents are manually reviewed by admins for verification.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div data-testid="admin-verification-dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] font-serif">Expert Verification</h2>
          <p className="text-sm text-[#64748b]">Manage skills assessments, references, and document verification</p>
        </div>
        <button
          onClick={fetchExperts}
          className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc]"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expert List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-[#0a1628] mb-3">Experts ({experts.length})</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#e2e8f0] rounded-lg p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e2e8f0]" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#e2e8f0] rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[#e2e8f0] rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </div>
          )}
        </div>

        {/* Verification Panel */}
        <div className="lg:col-span-2">
          {selectedExpert ? (
            <VerificationPanel />
          ) : (
            <div className="bg-white border border-[#e2e8f0] rounded-xl p-12 text-center">
              <Shield className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0a1628] mb-2">Select an Expert</h3>
              <p className="text-[#64748b]">Choose an expert from the list to view their verification details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVerificationDashboard;
