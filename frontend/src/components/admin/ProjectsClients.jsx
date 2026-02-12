import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FolderOpen, Building2, Users, Calendar, DollarSign, MapPin,
  Search, Filter, Plus, MoreVertical, ChevronRight, Clock, CheckCircle,
  AlertCircle, Star, Globe, Mail, Phone, ExternalLink, Edit, Trash2,
  TrendingUp, Target, FileText, Briefcase
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const ProjectsClients = ({ subSection }) => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('dv_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [projectsRes, clientsRes] = await Promise.all([
          axios.get(`${API}/api/projects`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API}/api/clients`, { headers }).catch(() => ({ data: [] })),
        ]);
        
        setProjects(projectsRes.data.length > 0 ? projectsRes.data : getMockProjects());
        setClients(clientsRes.data.length > 0 ? clientsRes.data : getMockClients());
      } catch (error) {
        console.error('Error fetching data:', error);
        setProjects(getMockProjects());
        setClients(getMockClients());
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getMockProjects = () => [
    {
      id: '1',
      title: 'Agricultural Impact Assessment - Northern Tanzania',
      client: 'World Bank',
      client_id: '1',
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2024-06-30',
      budget: 125000,
      spent: 45000,
      progress: 36,
      team_size: 8,
      location: 'Arusha, Tanzania',
      description: 'Comprehensive assessment of agricultural interventions across 5 districts',
      products_used: ['FieldForce', 'Survey360'],
      experts_assigned: ['Dr. James Ochieng', 'Maria Santos']
    },
    {
      id: '2',
      title: 'Health Systems Strengthening Evaluation',
      client: 'USAID',
      client_id: '2',
      status: 'active',
      start_date: '2024-02-01',
      end_date: '2024-08-31',
      budget: 185000,
      spent: 32000,
      progress: 17,
      team_size: 12,
      location: 'Kenya, Uganda, Rwanda',
      description: 'Multi-country evaluation of health systems strengthening programs',
      products_used: ['Survey360', 'DataPulse'],
      experts_assigned: ['Dr. Sarah Kimani']
    },
    {
      id: '3',
      title: 'Education Quality Assessment',
      client: 'UNICEF',
      client_id: '3',
      status: 'completed',
      start_date: '2023-09-01',
      end_date: '2024-01-31',
      budget: 95000,
      spent: 92000,
      progress: 100,
      team_size: 6,
      location: 'Dar es Salaam, Tanzania',
      description: 'Assessment of learning outcomes in primary schools',
      products_used: ['Survey360'],
      experts_assigned: ['Prof. James Ochieng']
    },
  ];

  const getMockClients = () => [
    {
      id: '1',
      name: 'World Bank',
      type: 'International Organization',
      contact_person: 'John Smith',
      email: 'jsmith@worldbank.org',
      phone: '+1 202 473 1000',
      location: 'Washington, DC',
      status: 'active',
      projects_count: 5,
      total_revenue: 450000,
      since: '2019',
      products_subscribed: ['FieldForce', 'Survey360']
    },
    {
      id: '2',
      name: 'USAID',
      type: 'Government Agency',
      contact_person: 'Sarah Johnson',
      email: 'sjohnson@usaid.gov',
      phone: '+1 202 712 0000',
      location: 'Washington, DC',
      status: 'active',
      projects_count: 8,
      total_revenue: 620000,
      since: '2018',
      products_subscribed: ['Survey360', 'DataPulse']
    },
    {
      id: '3',
      name: 'UNICEF Tanzania',
      type: 'UN Agency',
      contact_person: 'Maria Gonzalez',
      email: 'mgonzalez@unicef.org',
      phone: '+255 22 219 6500',
      location: 'Dar es Salaam, Tanzania',
      status: 'active',
      projects_count: 3,
      total_revenue: 185000,
      since: '2020',
      products_subscribed: ['Survey360']
    },
    {
      id: '4',
      name: 'GIZ Tanzania',
      type: 'Development Agency',
      contact_person: 'Hans Mueller',
      email: 'hmueller@giz.de',
      phone: '+255 22 211 8075',
      location: 'Dar es Salaam, Tanzania',
      status: 'active',
      projects_count: 4,
      total_revenue: 280000,
      since: '2019',
      products_subscribed: ['FieldForce', 'Survey360', 'DataPulse']
    },
  ];

  const ProjectForm = ({ project, onClose, onSave }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{project ? 'Edit Project' : 'Create New Project'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input type="text" defaultValue={project?.title} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select defaultValue={project?.status || 'planning'} className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" defaultValue={project?.start_date} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" defaultValue={project?.end_date} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($)</label>
              <input type="number" defaultValue={project?.budget} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" defaultValue={project?.location} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea rows={3} defaultValue={project?.description} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">Save Project</button>
        </div>
      </div>
    </div>
  );

  const ClientForm = ({ client, onClose, onSave }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{client ? 'Edit Client' : 'Add New Client'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
              <input type="text" defaultValue={client?.name} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select defaultValue={client?.type} className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                <option>International Organization</option>
                <option>UN Agency</option>
                <option>Government Agency</option>
                <option>Development Agency</option>
                <option>NGO</option>
                <option>Private Sector</option>
                <option>Research Institution</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
              <input type="text" defaultValue={client?.contact_person} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" defaultValue={client?.email} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="tel" defaultValue={client?.phone} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input type="text" defaultValue={client?.location} className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
          <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800">Save Client</button>
        </div>
      </div>
    </div>
  );

  const renderActiveProjects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Active Projects</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search projects..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
          <button onClick={() => setShowProjectForm(true)} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Active</p>
          <p className="text-2xl font-bold text-emerald-700">{projects.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">Total Budget</p>
          <p className="text-2xl font-bold text-blue-700">${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-600">Team Members</p>
          <p className="text-2xl font-bold text-purple-700">{projects.reduce((sum, p) => sum + p.team_size, 0)}</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{project.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    project.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                    'bg-amber-100 text-amber-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{project.client}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{project.end_date}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign className="w-4 h-4" />
                <span>${project.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="w-4 h-4" />
                <span>{project.team_size} members</span>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Products Used */}
            <div className="flex flex-wrap gap-2">
              {project.products_used.map((product, idx) => (
                <span key={idx} className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                  {product}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showProjectForm && <ProjectForm project={editingItem} onClose={() => { setShowProjectForm(false); setEditingItem(null); }} />}
    </div>
  );

  const renderClientManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Client Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search clients..." className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg" />
          </div>
          <button onClick={() => setShowClientForm(true)} className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Clients</p>
          <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-sm text-emerald-600">Active</p>
          <p className="text-2xl font-bold text-emerald-700">{clients.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-600">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-700">${clients.reduce((sum, c) => sum + c.total_revenue, 0).toLocaleString()}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm text-purple-600">Total Projects</p>
          <p className="text-2xl font-bold text-purple-700">{clients.reduce((sum, c) => sum + c.projects_count, 0)}</p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Projects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{client.name}</p>
                      <p className="text-sm text-slate-500">{client.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">{client.type}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900">{client.contact_person}</p>
                  <p className="text-xs text-slate-500">{client.email}</p>
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{client.projects_count}</td>
                <td className="px-6 py-4 font-medium text-slate-900">${client.total_revenue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {client.products_subscribed.map((p, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showClientForm && <ClientForm client={editingItem} onClose={() => { setShowClientForm(false); setEditingItem(null); }} />}
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Portfolio Showcase</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add to Portfolio
        </button>
      </div>

      <p className="text-slate-500">Completed projects showcased on the public website.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.filter(p => p.status === 'completed').map(project => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <FolderOpen className="w-12 h-12 text-white/30" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-slate-900">{project.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{project.client}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-600 rounded-full">Completed</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">Featured</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (subSection) {
      case 'clientlist':
        return renderClientManagement();
      case 'portfolio':
        return renderPortfolio();
      case 'matching':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Project Matching</h2>
            <p className="text-slate-500">Match experts to projects based on skills and availability.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <Target className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="font-semibold text-amber-800">Coming Soon</h3>
              <p className="text-sm text-amber-600 mt-2">AI-powered project matching will be available soon.</p>
            </div>
          </div>
        );
      case 'active':
      default:
        return renderActiveProjects();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Projects & Clients</h1>
        <p className="text-slate-500 mt-1">Manage projects, clients, and portfolio</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProjectsClients;
