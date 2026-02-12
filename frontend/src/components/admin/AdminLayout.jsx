import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Package, TrendingUp, Briefcase, Users,
  FolderOpen, Settings, LogOut, ChevronDown, ChevronRight, ExternalLink,
  Bell, Search, Menu, X, BarChart3, UserCheck, Newspaper, DollarSign
} from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const AdminLayout = ({ user, logout, children, activeSection, setActiveSection, activeSubSection, setActiveSubSection }) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['dashboard']);
  
  // Get token for WebSocket auth
  const token = localStorage.getItem('dv_token');

  const menuStructure = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      subItems: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'activity', label: 'Recent Activity' },
      ]
    },
    {
      id: 'content',
      label: 'Content Management',
      icon: FileText,
      subItems: [
        { id: 'pages', label: 'Page Content' },
        { id: 'news', label: 'News & Articles' },
        { id: 'team', label: 'Team Members' },
        { id: 'testimonials', label: 'Testimonials' },
        { id: 'partners', label: 'Partners & Logos' },
      ]
    },
    {
      id: 'solutions',
      label: 'Solutions Management',
      icon: Package,
      subItems: [
        { id: 'products', label: 'Products Catalog' },
        { id: 'revenue', label: 'Revenue Tracking' },
        { id: 'usage', label: 'Usage Analytics' },
        { id: 'clients', label: 'Client Registrations' },
        { id: 'pricing', label: 'Pricing & Plans' },
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing & Sales',
      icon: TrendingUp,
      subItems: [
        { id: 'leads', label: 'Lead Inquiries' },
        { id: 'pipeline', label: 'Sales Pipeline' },
        { id: 'segmentation', label: 'Market Segmentation' },
        { id: 'tasks', label: 'Sales Tasks' },
        { id: 'campaigns', label: 'Campaigns' },
      ]
    },
    {
      id: 'careers',
      label: 'Careers & HR',
      icon: Briefcase,
      subItems: [
        { id: 'jobs', label: 'Job Postings' },
        { id: 'applications', label: 'Applications' },
        { id: 'tracking', label: 'Applicant Tracking' },
      ]
    },
    {
      id: 'experts',
      label: 'Expert Network',
      icon: UserCheck,
      subItems: [
        { id: 'registrations', label: 'Registrations' },
        { id: 'verification', label: 'Verification' },
        { id: 'profiles', label: 'Expert Profiles' },
        { id: 'matching', label: 'Auto-Matching' },
        { id: 'ratings', label: 'Ratings & Reviews' },
      ]
    },
    {
      id: 'projects',
      label: 'Projects & Clients',
      icon: FolderOpen,
      subItems: [
        { id: 'active', label: 'Active Projects' },
        { id: 'clientlist', label: 'Client Management' },
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'matching', label: 'Project Matching' },
      ]
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      subItems: [
        { id: 'all', label: 'All Users' },
        { id: 'roles', label: 'Roles & Permissions' },
        { id: 'subscriptions', label: 'Subscriptions' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      subItems: [
        { id: 'general', label: 'General' },
        { id: 'email', label: 'Email Templates' },
        { id: 'integrations', label: 'Integrations' },
        { id: 'logs', label: 'System Logs' },
      ]
    },
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleMenuClick = (sectionId, subItemId) => {
    setActiveSection(sectionId);
    setActiveSubSection(subItemId);
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections(prev => [...prev, sectionId]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Data<span className="text-red-500">Vision</span></span>
          </Link>
          <span className="text-slate-500">|</span>
          <span className="text-sm text-slate-400">Admin Console</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-white placeholder-slate-400"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-800 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-sm font-bold">
              {(user?.name || 'A')[0].toUpperCase()}
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 transition-all duration-300 z-40 overflow-y-auto ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <nav className="p-2">
          {menuStructure.map((section) => (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => {
                  if (sidebarCollapsed) {
                    setSidebarCollapsed(false);
                    setExpandedSections([section.id]);
                    handleMenuClick(section.id, section.subItems[0].id);
                  } else {
                    toggleSection(section.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <section.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{section.label}</span>
                    {expandedSections.includes(section.id) 
                      ? <ChevronDown className="w-4 h-4" />
                      : <ChevronRight className="w-4 h-4" />
                    }
                  </>
                )}
              </button>

              {/* Sub Items */}
              {!sidebarCollapsed && expandedSections.includes(section.id) && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-4">
                  {section.subItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(section.id, item.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        activeSection === section.id && activeSubSection === item.id
                          ? 'bg-red-50 text-red-600 font-medium'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Link */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500"
            >
              <ExternalLink className="w-4 h-4" /> View Website
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
