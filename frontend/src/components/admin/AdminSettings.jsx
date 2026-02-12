import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Settings as SettingsIcon, Globe, Mail, Bell, Shield, Database,
  Key, Save, RefreshCw, CheckCircle, AlertCircle, ExternalLink,
  Eye, EyeOff, Copy, Trash2, Plus, Edit, Clock, Server, Zap
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const AdminSettings = ({ subSection }) => {
  const [settings, setSettings] = useState({
    siteName: 'DataVision International',
    siteTagline: 'Data-Driven Insights Driving Global Impact',
    supportEmail: 'support@datavision.co.tz',
    salesEmail: 'sales@datavision.co.tz',
    phone: '+255 22 123 4567',
    address: 'Dar es Salaam, Tanzania',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/datavision',
      twitter: 'https://twitter.com/datavision',
    }
  });
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState({});

  useEffect(() => {
    // Load mock data
    setEmailTemplates([
      { id: '1', name: 'Welcome Email', subject: 'Welcome to DataVision', type: 'user', lastUpdated: '2024-02-01' },
      { id: '2', name: 'Job Application Received', subject: 'Application Received - {job_title}', type: 'careers', lastUpdated: '2024-01-28' },
      { id: '3', name: 'Expert Registration', subject: 'Welcome to DataVision Expert Network', type: 'expert', lastUpdated: '2024-01-25' },
      { id: '4', name: 'Password Reset', subject: 'Reset Your Password', type: 'auth', lastUpdated: '2024-01-20' },
      { id: '5', name: 'Invoice', subject: 'Invoice #{invoice_number}', type: 'billing', lastUpdated: '2024-01-15' },
    ]);

    setIntegrations([
      { id: '1', name: 'Stripe', description: 'Payment processing', status: 'connected', icon: '💳', lastSync: '2024-02-10' },
      { id: '2', name: 'SendGrid', description: 'Email delivery', status: 'connected', icon: '📧', lastSync: '2024-02-10' },
      { id: '3', name: 'Google Analytics', description: 'Website analytics', status: 'connected', icon: '📊', lastSync: '2024-02-09' },
      { id: '4', name: 'Slack', description: 'Team notifications', status: 'disconnected', icon: '💬', lastSync: null },
      { id: '5', name: 'AWS S3', description: 'File storage', status: 'connected', icon: '☁️', lastSync: '2024-02-10' },
    ]);

    setLogs([
      { id: '1', type: 'info', message: 'User login: admin@datavision.co.tz', timestamp: '2024-02-10 14:32:15', ip: '192.168.1.1' },
      { id: '2', type: 'success', message: 'New expert registered: Dr. Sarah Kimani', timestamp: '2024-02-10 14:28:42', ip: '192.168.1.45' },
      { id: '3', type: 'warning', message: 'API rate limit reached for endpoint /api/surveys', timestamp: '2024-02-10 14:15:23', ip: '192.168.1.100' },
      { id: '4', type: 'info', message: 'Database backup completed', timestamp: '2024-02-10 12:00:00', ip: 'system' },
      { id: '5', type: 'error', message: 'Failed payment attempt for subscription #1234', timestamp: '2024-02-10 11:45:18', ip: '192.168.1.78' },
      { id: '6', type: 'success', message: 'New client registration: World Bank', timestamp: '2024-02-10 10:22:33', ip: '192.168.1.52' },
    ]);
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation: await axios.put(`${API}/api/admin/settings`, settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">General Settings</h2>
        <button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-400" /> Site Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
            <input 
              type="text" 
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
            <input 
              type="text" 
              value={settings.siteTagline}
              onChange={(e) => setSettings({...settings, siteTagline: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-slate-400" /> Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
            <input 
              type="email" 
              value={settings.supportEmail}
              onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sales Email</label>
            <input 
              type="email" 
              value={settings.salesEmail}
              onChange={(e) => setSettings({...settings, salesEmail: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input 
              type="tel" 
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <input 
              type="text" 
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-slate-400" /> Social Links
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
            <input 
              type="url" 
              value={settings.socialLinks.linkedin}
              onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, linkedin: e.target.value}})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Twitter</label>
            <input 
              type="url" 
              value={settings.socialLinks.twitter}
              onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, twitter: e.target.value}})}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Email Templates</h2>
        <button className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Template Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {emailTemplates.map(template => (
              <tr key={template.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{template.name}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{template.subject}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.type === 'auth' ? 'bg-purple-100 text-purple-600' :
                    template.type === 'billing' ? 'bg-emerald-100 text-emerald-600' :
                    template.type === 'careers' ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {template.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{template.lastUpdated}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Eye className="w-4 h-4 text-slate-400" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Trash2 className="w-4 h-4 text-slate-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Variables Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Available Template Variables</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {['{user_name}', '{user_email}', '{company_name}', '{job_title}', '{invoice_number}', '{reset_link}', '{expert_name}', '{project_name}'].map((v, idx) => (
            <code key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{v}</code>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Integrations</h2>
        <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Sync All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(integration => (
          <div key={integration.id} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{integration.name}</h3>
                  <p className="text-sm text-slate-500">{integration.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                integration.status === 'connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {integration.status}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              {integration.lastSync ? (
                <span className="text-xs text-slate-500">Last sync: {integration.lastSync}</span>
              ) : (
                <span className="text-xs text-slate-400">Not connected</span>
              )}
              <button className={`px-3 py-1.5 text-sm rounded-lg ${
                integration.status === 'connected' 
                  ? 'border border-slate-200 hover:bg-slate-50' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}>
                {integration.status === 'connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-400" /> API Keys
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Production API Key', key: 'dv_prod_xxxxxxxxxxxxxxxxxxxxxx', created: '2024-01-01' },
            { name: 'Development API Key', key: 'dv_dev_xxxxxxxxxxxxxxxxxxxxxx', created: '2024-01-15' },
          ].map((apiKey, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">{apiKey.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm text-slate-500">
                    {showApiKey[idx] ? apiKey.key : '••••••••••••••••••••••••'}
                  </code>
                  <button onClick={() => setShowApiKey({...showApiKey, [idx]: !showApiKey[idx]})} className="p-1 hover:bg-slate-200 rounded">
                    {showApiKey[idx] ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                  </button>
                  <button className="p-1 hover:bg-slate-200 rounded">
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <span className="text-xs text-slate-500">Created: {apiKey.created}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generate New Key
        </button>
      </div>
    </div>
  );

  const renderSystemLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [logFilter, setLogFilter] = useState('all');

    useEffect(() => {
      const fetchAuditLogs = async () => {
        try {
          const token = localStorage.getItem('dv_token');
          const response = await axios.get(`${API}/api/admin/audit-logs`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 50 }
          });
          if (response.data?.length) {
            setAuditLogs(response.data);
          }
        } catch (error) {
          console.error('Error fetching audit logs:', error);
        } finally {
          setLoadingLogs(false);
        }
      };
      fetchAuditLogs();
    }, []);

    // Use audit logs from API if available, otherwise use mock data
    const displayLogs = auditLogs.length > 0 ? auditLogs.map(log => ({
      id: log.id,
      type: log.action_type?.includes('delete') ? 'error' : 
            log.action_type?.includes('update') ? 'warning' : 
            log.action_type?.includes('create') ? 'success' : 'info',
      message: `${log.action_type}: ${log.details?.description || log.entity_type || 'Action performed'}`,
      timestamp: new Date(log.timestamp).toLocaleString(),
      ip: log.ip_address || log.admin_email
    })) : logs;

    const filteredLogs = logFilter === 'all' 
      ? displayLogs 
      : displayLogs.filter(log => log.type === logFilter);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">System & Audit Logs</h2>
          <div className="flex items-center gap-2">
            <select 
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total Events (24h)</p>
            <p className="text-2xl font-bold text-slate-900">{displayLogs.length || 0}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600">Errors</p>
            <p className="text-2xl font-bold text-red-700">{displayLogs.filter(l => l.type === 'error').length}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-600">Warnings</p>
            <p className="text-2xl font-bold text-amber-700">{displayLogs.filter(l => l.type === 'warning').length}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-emerald-600">System Health</p>
            <p className="text-2xl font-bold text-emerald-700">98.5%</p>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl border border-slate-200">
          {loadingLogs ? (
            <div className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-slate-300 mx-auto animate-spin" />
              <p className="text-slate-500 mt-2">Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    log.type === 'error' ? 'bg-red-100' :
                    log.type === 'warning' ? 'bg-amber-100' :
                    log.type === 'success' ? 'bg-emerald-100' :
                    'bg-blue-100'
                  }`}>
                    {log.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-600" /> :
                     log.type === 'warning' ? <AlertCircle className="w-4 h-4 text-amber-600" /> :
                     log.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> :
                     <Zap className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{log.message}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {log.timestamp}</span>
                      <span className="flex items-center gap-1"><Server className="w-3 h-3" /> {log.ip}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    log.type === 'error' ? 'bg-red-100 text-red-600' :
                    log.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    log.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <button className="text-sm text-slate-500 hover:text-slate-700">Load More Logs</button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (subSection) {
      case 'email':
        return renderEmailTemplates();
      case 'integrations':
        return renderIntegrations();
      case 'logs':
        return renderSystemLogs();
      case 'general':
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Configure your system settings and integrations</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default AdminSettings;
