import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AdminLayout,
  DashboardOverview,
  SolutionsManagement,
  MarketingSales,
  CareersHR,
  ExpertNetwork,
  ContentManagement,
  ProjectsClients,
  AdminSettings,
  AffiliateManagement
} from '../components/admin';
import ReferralManagement from '../components/admin/ReferralManagement';
import AdminUsersManagement from '../components/AdminUsersManagement';

const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubSection, setActiveSubSection] = useState('overview');

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview subSection={activeSubSection} />;
      case 'content':
        return <ContentManagement subSection={activeSubSection} />;
      case 'solutions':
        return <SolutionsManagement subSection={activeSubSection} />;
      case 'marketing':
        return <MarketingSales subSection={activeSubSection} />;
      case 'careers':
        return <CareersHR subSection={activeSubSection} />;
      case 'experts':
        return <ExpertNetwork subSection={activeSubSection} />;
      case 'projects':
        return <ProjectsClients subSection={activeSubSection} />;
      case 'users':
        return (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">User Management</h1>
            <AdminUsersManagement token={localStorage.getItem('dv_token')} />
          </div>
        );
      case 'affiliates':
        return <AffiliateManagement subSection={activeSubSection} />;
      case 'referrals':
        return <ReferralManagement subSection={activeSubSection} />;
      case 'settings':
        return <AdminSettings subSection={activeSubSection} />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout
      user={user}
      logout={logout}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      activeSubSection={activeSubSection}
      setActiveSubSection={setActiveSubSection}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
