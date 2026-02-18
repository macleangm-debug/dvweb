import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp, Users, DollarSign, Target, Mail, Phone, Calendar,
  Filter, Search, MoreVertical, Plus, ChevronRight, Clock, User,
  CheckCircle, AlertCircle, ArrowRight, Tag, Building2, Globe, RefreshCw,
  Eye, MessageSquare, ExternalLink
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const MarketingSales = ({ subSection }) => {
  const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [inquiryStats, setInquiryStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pipeline, setPipeline] = useState({
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    closed: []
  });
  const [tasks, setTasks] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real inquiries from API
  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const token = localStorage.getItem('dv_token');
      const response = await axios.get(`${API}/api/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(response.data.inquiries || []);
      setInquiryStats(response.data.stats || { total: 0, new: 0, contacted: 0, converted: 0 });
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    if (subSection === 'leads') {
      fetchInquiries();
    }
  }, [subSection]);

  useEffect(() => {
    // Load mock data for other sections
    setLeads([
      { id: 1, name: 'John Mwangi', email: 'john@worldbank.org', company: 'World Bank', source: 'Website', status: 'new', date: '2024-02-10', value: 25000 },
      { id: 2, name: 'Sarah Kim', email: 'sarah@unicef.org', company: 'UNICEF', source: 'Referral', status: 'contacted', date: '2024-02-09', value: 45000 },
      { id: 3, name: 'Peter Ochieng', email: 'peter@giz.de', company: 'GIZ', source: 'Event', status: 'qualified', date: '2024-02-08', value: 35000 },
      { id: 4, name: 'Anna Mushi', email: 'anna@moh.go.tz', company: 'Ministry of Health', source: 'Website', status: 'proposal', date: '2024-02-07', value: 28000 },
    ]);

    setPipeline({
      new: [
        { id: 1, company: 'World Bank', contact: 'John Mwangi', value: 25000, days: 2 },
        { id: 5, company: 'FAO', contact: 'Maria Santos', value: 18000, days: 1 },
      ],
      contacted: [
        { id: 2, company: 'UNICEF', contact: 'Sarah Kim', value: 45000, days: 5 },
      ],
      qualified: [
        { id: 3, company: 'GIZ', contact: 'Peter Ochieng', value: 35000, days: 8 },
        { id: 6, company: 'USAID', contact: 'Tom Wilson', value: 52000, days: 6 },
      ],
      proposal: [
        { id: 4, company: 'Ministry of Health', contact: 'Anna Mushi', value: 28000, days: 12 },
      ],
      negotiation: [
        { id: 7, company: 'Gates Foundation', contact: 'Lisa Chen', value: 75000, days: 15 },
      ],
      closed: []
    });

    setTasks([
      { id: 1, title: 'Follow up with World Bank', assignee: 'James Kimani', dueDate: '2024-02-12', priority: 'high', status: 'pending', lead: 'John Mwangi' },
      { id: 2, title: 'Send proposal to UNICEF', assignee: 'Sarah Odhiambo', dueDate: '2024-02-11', priority: 'high', status: 'in-progress', lead: 'Sarah Kim' },
      { id: 3, title: 'Schedule demo for GIZ', assignee: 'James Kimani', dueDate: '2024-02-14', priority: 'medium', status: 'pending', lead: 'Peter Ochieng' },
      { id: 4, title: 'Prepare contract for MoH', assignee: 'Legal Team', dueDate: '2024-02-15', priority: 'medium', status: 'pending', lead: 'Anna Mushi' },
    ]);

    setSegments([
      { id: 1, name: 'International NGOs', count: 45, avgDealSize: 42000, conversionRate: 28 },
      { id: 2, name: 'Government Agencies', count: 32, avgDealSize: 35000, conversionRate: 22 },
      { id: 3, name: 'UN Agencies', count: 18, avgDealSize: 65000, conversionRate: 35 },
      { id: 4, name: 'Research Institutions', count: 28, avgDealSize: 22000, conversionRate: 18 },
      { id: 5, name: 'Private Sector', count: 52, avgDealSize: 15000, conversionRate: 32 },
    ]);
  }, []);

  // Filter inquiries based on search and status
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = searchTerm === '' || 
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.solution_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'new': 'bg-blue-100 text-blue-700 border-blue-200',
      'contacted': 'bg-amber-100 text-amber-700 border-amber-200',
      'qualified': 'bg-purple-100 text-purple-700 border-purple-200',
      'converted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'closed': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return statusStyles[status] || statusStyles['new'];
  };

  const InquiryDetailModal = ({ inquiry, onClose }) => {
    if (!inquiry) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{inquiry.name}</h3>
                <p className="text-slate-500">{inquiry.organization || 'No organization'}</p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full border ${getStatusBadge(inquiry.status)}`}>
                {inquiry.status || 'new'}
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a href={`mailto:${inquiry.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                    {inquiry.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-900">{inquiry.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Organization Type</p>
                  <p className="text-sm font-medium text-slate-900">{inquiry.organization_type || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <Globe className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Country</p>
                  <p className="text-sm font-medium text-slate-900">{inquiry.country || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Solution Interest */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
              <p className="text-xs text-red-600 font-medium mb-1">INTERESTED IN</p>
              <p className="text-lg font-semibold text-slate-900">{inquiry.solution_name || inquiry.solution}</p>
              <p className="text-sm text-slate-500 mt-1">Request Type: {inquiry.type || 'Demo Request'}</p>
            </div>

            {/* Message */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Message</p>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-600 whitespace-pre-wrap">{inquiry.message || 'No message provided'}</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Submitted: {formatDate(inquiry.created_at)}</span>
              </div>
              {inquiry.employee_count && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{inquiry.employee_count} employees</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <a 
                href={`mailto:${inquiry.email}?subject=Re: ${inquiry.solution_name} Demo Request`}
                className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeadInquiries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Solution Inquiries</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search inquiries..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg w-64" 
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
          <button 
            onClick={fetchInquiries}
            disabled={loadingInquiries}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loadingInquiries ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Inquiries</p>
          <p className="text-2xl font-bold text-slate-900">{inquiryStats.total}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">New</p>
          <p className="text-2xl font-bold text-blue-700">{inquiryStats.new}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-600">Contacted</p>
          <p className="text-2xl font-bold text-amber-700">{inquiryStats.contacted}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Converted</p>
          <p className="text-2xl font-bold text-emerald-700">{inquiryStats.converted}</p>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loadingInquiries ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400 mr-2" />
            <span className="text-slate-500">Loading inquiries...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No inquiries found</p>
            <p className="text-sm text-slate-400 mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Inquiries from solution pages will appear here'}
            </p>
          </div>
        ) : (
          <table className="w-full" data-testid="inquiries-table">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Solution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInquiries.map((inquiry, index) => (
                <tr key={inquiry.email + index} className="hover:bg-slate-50" data-testid={`inquiry-row-${index}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-medium">
                        {inquiry.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{inquiry.name}</p>
                        <p className="text-sm text-slate-500">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-slate-900">{inquiry.organization || '-'}</p>
                      <p className="text-xs text-slate-500">{inquiry.country}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700 font-medium">
                      {inquiry.solution_name || inquiry.solution}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(inquiry.status)}`}>
                      {inquiry.status || 'new'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {formatDate(inquiry.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900"
                        title="View details"
                        data-testid={`view-inquiry-${index}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a 
                        href={`mailto:${inquiry.email}?subject=Re: ${inquiry.solution_name || inquiry.solution} Inquiry`}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-blue-600"
                        title="Send email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />
      )}
    </div>
  );

  const renderSalesPipeline = () => {
    const stages = [
      { key: 'new', label: 'New', color: 'bg-blue-500' },
      { key: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
      { key: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
      { key: 'proposal', label: 'Proposal', color: 'bg-indigo-500' },
      { key: 'negotiation', label: 'Negotiation', color: 'bg-pink-500' },
      { key: 'closed', label: 'Closed Won', color: 'bg-emerald-500' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Sales Pipeline</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Total Pipeline Value:</span>
            <span className="text-lg font-bold text-slate-900">$278,000</span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div key={stage.key} className="flex-shrink-0 w-72">
              <div className="bg-slate-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <span className="font-medium text-slate-700">{stage.label}</span>
                  </div>
                  <span className="text-sm text-slate-500">{pipeline[stage.key]?.length || 0}</span>
                </div>

                <div className="space-y-3">
                  {pipeline[stage.key]?.map(deal => (
                    <div key={deal.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{deal.company}</p>
                          <p className="text-sm text-slate-500">{deal.contact}</p>
                        </div>
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <span className="text-lg font-semibold text-slate-900">${deal.value.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">{deal.days} days</span>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" /> Add Deal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMarketSegmentation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Market Segmentation</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Segment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map(segment => (
          <div key={segment.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">{segment.name}</h3>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total Leads</span>
                <span className="font-semibold text-slate-900">{segment.count}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Avg Deal Size</span>
                <span className="font-semibold text-slate-900">${segment.avgDealSize.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Conversion Rate</span>
                <span className="font-semibold text-emerald-600">{segment.conversionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                  style={{ width: `${segment.conversionRate}%` }}
                ></div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1">
              View Leads <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSalesTasks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Sales Tasks</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-600">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{tasks.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{tasks.filter(t => t.status === 'in-progress').length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Completed</p>
          <p className="text-2xl font-bold text-emerald-700">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg">All</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">My Tasks</button>
            <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Overdue</button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search tasks..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {tasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-slate-50 flex items-center gap-4">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-600' :
                    task.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Related to: {task.lead}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{task.assignee}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{task.dueDate}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {task.status}
                </span>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subSection) {
      case 'pipeline':
        return renderSalesPipeline();
      case 'segmentation':
        return renderMarketSegmentation();
      case 'tasks':
        return renderSalesTasks();
      case 'leads':
      default:
        return renderLeadInquiries();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Marketing & Sales</h1>
        <p className="text-slate-500 mt-1">Manage leads, track sales, and segment your market</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default MarketingSales;
