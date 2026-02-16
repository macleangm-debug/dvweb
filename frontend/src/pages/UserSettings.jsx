import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Bell, Mail, Shield, Clock, Moon, ChevronRight, Check, X,
  AlertCircle, User, Lock, CreditCard, LogOut, ArrowLeft,
  Settings, Smartphone, Globe, ToggleLeft, ToggleRight
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

// Email category metadata
const CATEGORY_DETAILS = {
  security: { label: 'Security Alerts', description: 'Login alerts, password changes, suspicious activity', icon: Shield, mandatory: true },
  billing: { label: 'Billing & Payments', description: 'Invoices, payment confirmations, subscription updates', icon: CreditCard, mandatory: true },
  product_updates: { label: 'Product Updates', description: 'New features, improvements, release notes', icon: Smartphone, mandatory: false },
  tips_tutorials: { label: 'Tips & Tutorials', description: 'How-to guides, best practices, product tips', icon: Globe, mandatory: false },
  company_news: { label: 'Company News', description: 'Announcements, events, company updates', icon: Bell, mandatory: false },
  survey_activity: { label: 'Survey Activity', description: 'Survey responses, completion notifications', icon: Mail, mandatory: false },
  field_activity: { label: 'Field Activity', description: 'Data collection updates, sync notifications', icon: Settings, mandatory: false },
  reports_ready: { label: 'Reports Ready', description: 'When reports and exports are ready', icon: Mail, mandatory: false },
  weekly_summary: { label: 'Weekly Summary', description: 'Weekly digest of your activity', icon: Clock, mandatory: false },
  monthly_report: { label: 'Monthly Report', description: 'Monthly analytics and insights', icon: Clock, mandatory: false },
};

const FREQUENCY_OPTIONS = [
  { value: 'immediate', label: 'Immediately' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Digest' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'never', label: 'Never' },
];

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('dv_token');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API}/api/email-preferences/`, { headers });
      setPreferences(res.data.preferences);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      setErrorMessage('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryPreference = async (category, frequency) => {
    setSaving(true);
    setErrorMessage('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API}/api/email-preferences/category`, 
        { category, frequency },
        { headers }
      );
      setPreferences(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [category]: frequency }
      }));
      setSuccessMessage('Preference updated');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  const toggleGlobalUnsubscribe = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (preferences.global_unsubscribe) {
        await axios.post(`${API}/api/email-preferences/resubscribe`, {}, { headers });
        fetchPreferences();
      } else {
        await axios.post(`${API}/api/email-preferences/unsubscribe-all`, {}, { headers });
        setPreferences(prev => ({ ...prev, global_unsubscribe: true }));
      }
      setSuccessMessage(preferences.global_unsubscribe ? 'Resubscribed successfully' : 'Unsubscribed from marketing emails');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const updateQuietHours = async (enabled, start, end) => {
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/email-preferences/quiet-hours?enabled=${enabled}&start=${start}&end=${end}`,
        {},
        { headers }
      );
      setPreferences(prev => ({
        ...prev,
        quiet_hours_enabled: enabled,
        quiet_hours_start: start,
        quiet_hours_end: end
      }));
      setSuccessMessage('Quiet hours updated');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setErrorMessage('Failed to update quiet hours');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    if (!window.confirm('Reset all email preferences to defaults?')) return;
    setSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API}/api/email-preferences/reset-to-defaults`, { headers });
      fetchPreferences();
      setSuccessMessage('Preferences reset to defaults');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setErrorMessage('Failed to reset preferences');
    } finally {
      setSaving(false);
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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-lg" data-testid="back-button">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-700">
            <Check className="w-5 h-5" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {[
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'account', label: 'Account', icon: User },
                { id: 'security', label: 'Security', icon: Lock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-600 border-l-4 border-red-500'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'notifications' && (
              <>
                {/* Global Unsubscribe Toggle */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Email Notifications</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Control which emails you receive from DataVision
                      </p>
                    </div>
                    <button
                      onClick={toggleGlobalUnsubscribe}
                      disabled={saving}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        preferences?.global_unsubscribe
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      data-testid="global-unsubscribe-toggle"
                    >
                      {preferences?.global_unsubscribe ? (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          Resubscribe
                        </>
                      ) : (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          Unsubscribe All
                        </>
                      )}
                    </button>
                  </div>

                  {preferences?.global_unsubscribe && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-700">
                        <strong>You're unsubscribed</strong> from all marketing emails. You'll still receive security and billing notifications.
                      </p>
                    </div>
                  )}
                </div>

                {/* Email Categories */}
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Email Categories</h3>
                    <p className="text-sm text-slate-500 mt-1">Choose how often you want to receive each type of email</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {Object.entries(CATEGORY_DETAILS).map(([category, details]) => {
                      const currentFreq = preferences?.preferences?.[category] || 'immediate';
                      const Icon = details.icon;
                      return (
                        <div key={category} className="p-4 flex items-center justify-between" data-testid={`category-${category}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              details.mandatory ? 'bg-blue-100' : 'bg-slate-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${details.mandatory ? 'text-blue-600' : 'text-slate-600'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900">{details.label}</span>
                                {details.mandatory && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{details.description}</p>
                            </div>
                          </div>
                          <select
                            value={currentFreq}
                            onChange={(e) => updateCategoryPreference(category, e.target.value)}
                            disabled={details.mandatory || preferences?.global_unsubscribe || saving}
                            className={`px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                              details.mandatory || preferences?.global_unsubscribe
                                ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                : 'bg-white'
                            }`}
                            data-testid={`select-${category}`}
                          >
                            {FREQUENCY_OPTIONS.map((opt) => (
                              <option 
                                key={opt.value} 
                                value={opt.value}
                                disabled={details.mandatory && opt.value === 'never'}
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Quiet Hours</h3>
                        <p className="text-sm text-slate-500">Pause non-urgent notifications during these hours</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateQuietHours(
                        !preferences?.quiet_hours_enabled,
                        preferences?.quiet_hours_start || '22:00',
                        preferences?.quiet_hours_end || '08:00'
                      )}
                      disabled={saving}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        preferences?.quiet_hours_enabled
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      data-testid="quiet-hours-toggle"
                    >
                      {preferences?.quiet_hours_enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  
                  {preferences?.quiet_hours_enabled && (
                    <div className="flex items-center gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">From</label>
                        <input
                          type="time"
                          value={preferences?.quiet_hours_start || '22:00'}
                          onChange={(e) => updateQuietHours(true, e.target.value, preferences?.quiet_hours_end)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                      <span className="text-slate-400 mt-4">to</span>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Until</label>
                        <input
                          type="time"
                          value={preferences?.quiet_hours_end || '08:00'}
                          onChange={(e) => updateQuietHours(true, preferences?.quiet_hours_start, e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reset to Defaults */}
                <div className="flex justify-end">
                  <button
                    onClick={resetToDefaults}
                    disabled={saving}
                    className="text-sm text-slate-500 hover:text-slate-700 underline"
                    data-testid="reset-defaults-btn"
                  >
                    Reset to default preferences
                  </button>
                </div>
              </>
            )}

            {activeTab === 'account' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Settings</h3>
                <p className="text-slate-500">Account management features coming soon...</p>
                <div className="mt-6 space-y-4">
                  <Link 
                    to="/auth/forgot-password" 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-slate-600" />
                      <span className="font-medium text-slate-900">Change Password</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                <p className="text-slate-500">Security features coming soon...</p>
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Your account is secure</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">
                    Security alerts are always enabled and cannot be disabled.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
