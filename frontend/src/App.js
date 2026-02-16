import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Menu, X, ChevronDown, ArrowRight, ArrowLeft, MapPin, Users, Award, 
  BookOpen, Droplets, Heart, Sprout, Mail, Phone, Building2,
  ExternalLink, Linkedin, Quote, BarChart3, Globe, CheckCircle2,
  LogIn, LogOut, Settings, FileText, MessageSquare, PlusCircle,
  Trash2, Edit, Eye, ChevronRight, Target, PieChart, GraduationCap, Compass, Scale, TrendingUp,
  Shield, HandHeart, Utensils, AlertTriangle, Truck, Factory,
  FolderOpen, Smartphone, Map, MessageCircle, PenTool, Workflow, Calculator, Lightbulb,
  Zap, Pickaxe, Plane, Landmark, Layers, ShoppingCart, Briefcase, Activity
} from 'lucide-react';

// Extracted Common Components
import { AnimatedCounter, AfricaMap } from './components/common';

// Extracted Layout Components
import { Navbar, Footer } from './components/layout';

import {
  ResearchStatisticsPage,
  MonitoringEvaluationPage,
  DataCollectionPage,
  DataAnalyticsPage,
  CapacityBuildingPage,
  TechnicalAdvisoryPage,
  KnowledgeManagementPage,
  DigitalDataSolutionsPage,
  GISGeospatialPage,
  QualitativeResearchPage,
  SurveyDesignPage,
  ProgramDesignPage,
  PolicyResearchPage,
  EconomicAnalysisPage
} from './pages/ServicePages';
import ServicesHubPageRedesigned from './pages/ServicesHubRedesigned';
import InsightsPage from './pages/InsightsPage';
import ArticlePage from './pages/ArticlePage';
import CareersPage from './pages/CareersPage';
import AdminExpertManagement from './components/AdminExpertManagement';
import AdminProjectMatching from './components/AdminProjectMatching';
import AdminVerificationDashboard from './components/AdminVerificationDashboard';
import AdminUsersManagement from './components/AdminUsersManagement';
import {
  PracticeAreasHubPage,
  AgriculturePage,
  EducationPage,
  HealthPage,
  WASHPage,
  GovernancePage,
  EconomicDevelopmentPage,
  EnvironmentPage,
  SocialProtectionPage,
  InclusionPage,
  NutritionPage,
  ConflictHumanitarianPage,
  UrbanDevelopmentPage,
  YouthPage,
  InfrastructurePage,
  PrivateSectorPage
} from './pages/PracticeAreaPages';
import {
  IndustriesHubPage,
  AgricultureIndustryPage,
  EducationIndustryPage,
  HealthIndustryPage,
  WASHIndustryPage,
  PublicSectorIndustryPage,
  EnergyIndustryPage,
  FinancialServicesIndustryPage,
  InfrastructureIndustryPage,
  TransportIndustryPage,
  TourismIndustryPage,
  TechnologyIndustryPage,
  MiningIndustryPage,
  NutritionIndustryPage,
  NGOsIndustryPage,
  ManufacturingIndustryPage,
  RetailIndustryPage,
  industriesData
} from './pages/IndustriesPages';
import {
  SolutionsHubPage,
  Survey360Page,
  DataVizStudioPage,
  METrackerPage,
  FieldForcePage,
  AgriDataProPage,
  EduInsightsPage,
  HealthPulsePage,
  WASHMonitorPage,
  softwareSolutions
} from './pages/SolutionsPages';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import { Survey360ProductPage } from './components/solutions/survey360';

// DataVision Central Auth Pages
import { DataVisionLogin, DataVisionRegister, ForgotPassword, ResetPassword } from './pages/DataVisionAuth';

// User Dashboard
import UserDashboard from './pages/UserDashboard';

// CMS Content Manager
import CMSContentManager from './components/cms/CMSContentManager';

// Expert Network & Services
import JoinExpertNetwork from './pages/JoinExpertNetwork';
import ServicesShowcase from './pages/ServicesShowcase';

// Survey360 App Pages (from GitHub repo)
import {
  Survey360LoginPage,
  Survey360RegisterPage,
  Survey360AppLayout,
  Survey360DashboardPage,
  Survey360SurveysPage,
  Survey360BuilderPage,
  Survey360ResponsesPage,
  Survey360BillingPage,
  Survey360SettingsPage,
  Survey360PricingPage,
  PublicSurveyPage,
  Survey360LandingPage
} from './pages/solutions/survey360';

// FieldForce Landing Page
import { FieldForceLandingPage } from './pages/solutions/fieldforce';

// FieldForce Demo Page (from GitHub)
import FFDemoPage from './solutions/fieldforce/app/pages/DemoPage';
import FFLandingPage from './solutions/fieldforce/app/pages/LandingPage';

// DataPulse Pages
import { DataPulseLandingPage, DataPulseLoginPage, DataPulseRegisterPage } from './pages/solutions/datapulse';

// FieldForce Original Pages (from GitHub repo - FULL functionality)
import { LoginPage as FFLoginPage, RegisterPage as FFRegisterPage } from './solutions/fieldforce/app/pages/AuthPages';
import { DashboardPage as FFDashboardPage } from './solutions/fieldforce/app/pages/DashboardPage';
import { ProjectsPage as FFProjectsPage } from './solutions/fieldforce/app/pages/ProjectsPage';
import { FormsPage as FFFormsPage } from './solutions/fieldforce/app/pages/FormsPage';
import { FormBuilderPage as FFFormBuilderPage } from './solutions/fieldforce/app/pages/FormBuilderPage';
import { FormTemplatesPage as FFFormTemplatesPage } from './solutions/fieldforce/app/pages/FormTemplatesPage';
import { FormPreviewPage as FFFormPreviewPage } from './solutions/fieldforce/app/pages/FormPreviewPage';
import { SubmissionsPage as FFSubmissionsPage } from './solutions/fieldforce/app/pages/SubmissionsPage';
import { CasesPage as FFCasesPage } from './solutions/fieldforce/app/pages/CasesPage';
import { CaseImportPage as FFCaseImportPage } from './solutions/fieldforce/app/pages/CaseImportPage';
import { DatasetsPage as FFDatasetsPage } from './solutions/fieldforce/app/pages/DatasetsPage';
import { GPSMapPage as FFGPSMapPage } from './solutions/fieldforce/app/pages/GPSMapPage';
import { DeviceManagementPage as FFDeviceManagementPage } from './solutions/fieldforce/app/pages/DeviceManagementPage';
import { QualityPage as FFQualityPage } from './solutions/fieldforce/app/pages/QualityPage';
import { AnalyticsPage as FFAnalyticsPage } from './solutions/fieldforce/app/pages/AnalyticsPage';
import { TeamPage as FFTeamPage, CreateOrganizationPage as FFCreateOrganizationPage } from './solutions/fieldforce/app/pages/TeamPage';
import { RBACPage as FFRBACPage } from './solutions/fieldforce/app/pages/RBACPage';
import { TranslationsPage as FFTranslationsPage } from './solutions/fieldforce/app/pages/TranslationsPage';
import { SettingsPage as FFSettingsPage } from './solutions/fieldforce/app/pages/SettingsPage';

// Affiliate Program Pages
import AffiliateProgramPage from './pages/affiliate/AffiliateProgramPage';
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard';

// Extracted Page Components
import HomePage from './pages/HomePage';
import UserSettings from './pages/UserSettings';
import ReferralDashboard from './pages/ReferralDashboard';
import AboutPage from './pages/AboutPage';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ==================== CONTEXT ====================
const AuthContext = React.createContext(null);

const useAuth = () => React.useContext(AuthContext);

// Check for Survey360 auth token in localStorage
const getSurvey360Token = () => {
  try {
    return localStorage.getItem('survey360_token');
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dv_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // First try DataVision token
      if (token) {
        try {
          const res = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('dv_token');
          setToken(null);
        }
      }
      
      // Try Survey360 SSO exchange (reverse SSO)
      const survey360Token = getSurvey360Token();
      if (survey360Token) {
        try {
          const res = await axios.post(`${API}/auth/sso-exchange`, {}, {
            headers: { Authorization: `Bearer ${survey360Token}` }
          });
          if (res.data.access_token) {
            localStorage.setItem('dv_token', res.data.access_token);
            setToken(res.data.access_token);
            setUser(res.data.user);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('Survey360 SSO exchange failed:', error.message);
        }
      }
      
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('dv_token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('dv_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


// ==================== COMPONENTS ====================
// Note: Navbar and Footer have been extracted to /components/layout/
// Note: AnimatedCounter and AfricaMap have been extracted to /components/common/

// Navbar wrapper to inject auth context props
const NavbarWithAuth = () => {
  const { user, logout } = useAuth();
  return <Navbar user={user} logout={logout} />;
};

// ==================== PAGES ====================
// Note: HomePage has been extracted to /pages/HomePage.jsx

// Note: AboutPage has been extracted to /pages/AboutPage.jsx

// Contact Page
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiry_type: 'general',
    honeypot: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/inquiries`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiry_type: 'general',
        honeypot: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Let's Discuss Your Project
            </h1>
            <p className="text-white/80">
              Whether you're planning a research project, seeking a local partner, or 
              exploring collaboration opportunities, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#2a9d8f]/10 border border-[#2a9d8f] p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#2a9d8f] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-2 font-serif">Message Sent!</h3>
                  <p className="text-[#64748b]">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  {/* Honeypot - Hidden from users */}
                  <div className="honeypot-field" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Company/Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Inquiry Type</label>
                      <select
                        value={formData.inquiry_type}
                        onChange={(e) => setFormData({...formData, inquiry_type: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-type"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="consultation">Request Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                      data-testid="contact-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all resize-none"
                      data-testid="contact-message"
                    />
                  </div>

                  {error && (
                    <p className="text-[#e63946] text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="contact-submit"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-[#f8fafc] p-8">
                <h3 className="text-lg font-bold text-[#0a1628] mb-6 font-serif">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Address</p>
                      <p className="text-sm text-[#64748b]">Garden Road, Mikocheni Area<br />Dar es Salaam, Tanzania</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Phone</p>
                      <p className="text-sm text-[#64748b]">+255 754 869 302 (24/7)</p>
                      <p className="text-sm text-[#64748b]">+255 22 2701845/6</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Email</p>
                      <a href="mailto:info@datavision.co.tz" className="text-sm text-[#e63946] hover:underline">
                        info@datavision.co.tz
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a1628] text-white p-8">
                <h3 className="text-lg font-bold mb-4 font-serif">Quick Response</h3>
                <p className="text-white/80 text-sm">
                  Our team typically responds within 24 hours. For urgent matters, 
                  please call our 24/7 support line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to admin if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 border border-[#e2e8f0] w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0a1628] font-serif">Admin Login</h1>
          <p className="text-[#64748b] text-sm mt-2">Sign in to manage your website content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
          <div>
            <label className="block text-sm font-medium text-[#0a1628] mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
              data-testid="login-email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0a1628] mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
              data-testid="login-password"
            />
          </div>

          {error && (
            <p className="text-[#e63946] text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a1628] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#1e293b] transition-all disabled:opacity-50"
            data-testid="login-submit"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-[#64748b] hover:text-[#e63946]">
            ← Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Admin Dashboard - Comprehensive CMS
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
} from './components/admin';

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

// ==================== APP ====================

function App() {
  useEffect(() => {
    // Seed database on first load
    axios.post(`${API}/seed`).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/login" element={<DataVisionLogin />} />
            <Route path="/auth/register" element={<DataVisionRegister />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/network/join" element={<JoinExpertNetwork />} />
            <Route path="/experts/join" element={<JoinExpertNetwork />} />
            <Route path="/our-services" element={<ServicesShowcase />} />
            <Route path="/solutions/survey360" element={<Survey360LandingPage />} />
            <Route path="/solutions/fieldforce" element={<FieldForceLandingPage />} />
            <Route path="/solutions/fieldforce/demo" element={<FFDemoPage />} />
            <Route path="/solutions/datapulse" element={<DataPulseLandingPage />} />
            <Route path="/solutions/datapulse/login" element={<DataPulseLoginPage />} />
            <Route path="/solutions/datapulse/register" element={<DataPulseRegisterPage />} />
            <Route path="*" element={
              <>
                <NavbarWithAuth />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/about-us" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesHubPageRedesigned />} />
                  <Route path="/services/research-statistics" element={<ResearchStatisticsPage />} />
                  <Route path="/services/monitoring-evaluation" element={<MonitoringEvaluationPage />} />
                  <Route path="/services/data-collection" element={<DataCollectionPage />} />
                  <Route path="/services/data-analytics" element={<DataAnalyticsPage />} />
                  <Route path="/services/capacity-building" element={<CapacityBuildingPage />} />
                  <Route path="/services/technical-advisory" element={<TechnicalAdvisoryPage />} />
                  <Route path="/services/knowledge-management" element={<KnowledgeManagementPage />} />
                  <Route path="/services/digital-solutions" element={<DigitalDataSolutionsPage />} />
                  <Route path="/services/gis-geospatial" element={<GISGeospatialPage />} />
                  <Route path="/services/qualitative-research" element={<QualitativeResearchPage />} />
                  <Route path="/services/survey-design" element={<SurveyDesignPage />} />
                  <Route path="/services/program-design" element={<ProgramDesignPage />} />
                  <Route path="/services/policy-research" element={<PolicyResearchPage />} />
                  <Route path="/services/economic-analysis" element={<EconomicAnalysisPage />} />
                  <Route path="/research" element={<ResearchStatisticsPage />} />
                  <Route path="/research-statistics" element={<ResearchStatisticsPage />} />
                  <Route path="/practice-areas" element={<PracticeAreasHubPage />} />
                  <Route path="/practice-areas/agriculture" element={<AgriculturePage />} />
                  <Route path="/practice-areas/education" element={<EducationPage />} />
                  <Route path="/practice-areas/health" element={<HealthPage />} />
                  <Route path="/practice-areas/wash" element={<WASHPage />} />
                  <Route path="/practice-areas/nutrition" element={<NutritionPage />} />
                  <Route path="/practice-areas/governance" element={<GovernancePage />} />
                  <Route path="/practice-areas/economic-development" element={<EconomicDevelopmentPage />} />
                  <Route path="/practice-areas/social-protection" element={<SocialProtectionPage />} />
                  <Route path="/practice-areas/inclusion" element={<InclusionPage />} />
                  <Route path="/practice-areas/youth" element={<YouthPage />} />
                  <Route path="/practice-areas/conflict-humanitarian" element={<ConflictHumanitarianPage />} />
                  <Route path="/practice-areas/urban" element={<UrbanDevelopmentPage />} />
                  <Route path="/practice-areas/infrastructure" element={<InfrastructurePage />} />
                  <Route path="/practice-areas/private-sector" element={<PrivateSectorPage />} />
                  <Route path="/practice-areas/environment" element={<EnvironmentPage />} />
                  <Route path="/industries" element={<IndustriesHubPage />} />
                  <Route path="/industries/agriculture" element={<AgricultureIndustryPage />} />
                  <Route path="/industries/education" element={<EducationIndustryPage />} />
                  <Route path="/industries/health" element={<HealthIndustryPage />} />
                  <Route path="/industries/wash" element={<WASHIndustryPage />} />
                  <Route path="/industries/public-sector" element={<PublicSectorIndustryPage />} />
                  <Route path="/industries/energy" element={<EnergyIndustryPage />} />
                  <Route path="/industries/financial-services" element={<FinancialServicesIndustryPage />} />
                  <Route path="/industries/infrastructure" element={<InfrastructureIndustryPage />} />
                  <Route path="/industries/transport" element={<TransportIndustryPage />} />
                  <Route path="/industries/tourism" element={<TourismIndustryPage />} />
                  <Route path="/industries/technology" element={<TechnologyIndustryPage />} />
                  <Route path="/industries/mining" element={<MiningIndustryPage />} />
                  <Route path="/industries/nutrition" element={<NutritionIndustryPage />} />
                  <Route path="/industries/ngos" element={<NGOsIndustryPage />} />
                  <Route path="/industries/manufacturing" element={<ManufacturingIndustryPage />} />
                  <Route path="/industries/retail" element={<RetailIndustryPage />} />
                  <Route path="/solutions" element={<SolutionsHubPage />} />
                  <Route path="/solutions/survey360/pricing" element={<Survey360PricingPage />} />
                  <Route path="/solutions/survey360/login" element={<Survey360LoginPage />} />
                  <Route path="/solutions/survey360/register" element={<Survey360RegisterPage />} />
                  <Route path="/solutions/survey360/app" element={<Survey360AppLayout />}>
                    <Route path="dashboard" element={<Survey360DashboardPage />} />
                    <Route path="surveys" element={<Survey360SurveysPage />} />
                    <Route path="surveys/new" element={<Survey360BuilderPage />} />
                    <Route path="surveys/:id/edit" element={<Survey360BuilderPage />} />
                    <Route path="responses" element={<Survey360ResponsesPage />} />
                    <Route path="billing" element={<Survey360BillingPage />} />
                    <Route path="settings" element={<Survey360SettingsPage />} />
                  </Route>
                  <Route path="/s/:surveyId" element={<PublicSurveyPage />} />
                  <Route path="/solutions/dataviz-studio" element={<DataVizStudioPage />} />
                  <Route path="/solutions/me-tracker" element={<METrackerPage />} />
                  
                  {/* FieldForce Routes - Using ORIGINAL GitHub Canva-style Layout */}
                  <Route path="/solutions/fieldforce/app/login" element={<FFLoginPage />} />
                  <Route path="/solutions/fieldforce/app/register" element={<FFRegisterPage />} />
                  <Route path="/solutions/fieldforce/app/dashboard" element={<FFDashboardPage />} />
                  <Route path="/solutions/fieldforce/app/projects" element={<FFProjectsPage />} />
                  <Route path="/solutions/fieldforce/app/forms" element={<FFFormsPage />} />
                  <Route path="/solutions/fieldforce/app/forms/new" element={<FFFormBuilderPage />} />
                  <Route path="/solutions/fieldforce/app/forms/:id/edit" element={<FFFormBuilderPage />} />
                  <Route path="/solutions/fieldforce/app/forms/:id/preview" element={<FFFormPreviewPage />} />
                  <Route path="/solutions/fieldforce/app/templates" element={<FFFormTemplatesPage />} />
                  <Route path="/solutions/fieldforce/app/submissions" element={<FFSubmissionsPage />} />
                  <Route path="/solutions/fieldforce/app/cases" element={<FFCasesPage />} />
                  <Route path="/solutions/fieldforce/app/cases/import" element={<FFCaseImportPage />} />
                  <Route path="/solutions/fieldforce/app/datasets" element={<FFDatasetsPage />} />
                  <Route path="/solutions/fieldforce/app/map" element={<FFGPSMapPage />} />
                  <Route path="/solutions/fieldforce/app/devices" element={<FFDeviceManagementPage />} />
                  <Route path="/solutions/fieldforce/app/quality" element={<FFQualityPage />} />
                  <Route path="/solutions/fieldforce/app/analytics" element={<FFAnalyticsPage />} />
                  <Route path="/solutions/fieldforce/app/team" element={<FFTeamPage />} />
                  <Route path="/solutions/fieldforce/app/organizations/new" element={<FFCreateOrganizationPage />} />
                  <Route path="/solutions/fieldforce/app/rbac" element={<FFRBACPage />} />
                  <Route path="/solutions/fieldforce/app/translations" element={<FFTranslationsPage />} />
                  <Route path="/solutions/fieldforce/app/settings" element={<FFSettingsPage />} />
                  
                  <Route path="/solutions/agridata-pro" element={<AgriDataProPage />} />
                  <Route path="/solutions/eduinsights" element={<EduInsightsPage />} />
                  <Route path="/solutions/healthpulse" element={<HealthPulsePage />} />
                  <Route path="/solutions/wash-monitor" element={<WASHMonitorPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/insights" element={<InsightsPage />} />
                  <Route path="/insights/:articleId" element={<ArticlePage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/contact-us" element={<ContactPage />} />
                  <Route path="/affiliate" element={<AffiliateProgramPage />} />
                  <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
                  <Route path="/settings" element={<UserSettings />} />
                  <Route path="/referrals" element={<ReferralDashboard />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
