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
  Zap, Pickaxe, Plane, Landmark, Layers, ShoppingCart, Briefcase
} from 'lucide-react';
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
  PublicSurveyPage
} from './pages/solutions/survey360';

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

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Africa Map Component
const AfricaMap = ({ onCountryClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  
  // Countries with donor-funded projects
  const projectCountries = [
    'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Ethiopia', 'Malawi', 
    'Mozambique', 'Zambia', 'Zimbabwe', 'South Africa', 'Ghana', 
    'Nigeria', 'Senegal', 'Mali', 'Niger'
  ];

  // Simplified Africa SVG paths
  const africaCountries = [
    { id: 'TZ', name: 'Tanzania', path: 'M540,340 L560,330 L580,345 L575,370 L555,385 L530,375 L525,355 Z' },
    { id: 'KE', name: 'Kenya', path: 'M540,290 L570,285 L580,310 L560,330 L540,340 L525,320 Z' },
    { id: 'UG', name: 'Uganda', path: 'M510,285 L540,280 L540,310 L520,320 L505,305 Z' },
    { id: 'RW', name: 'Rwanda', path: 'M515,320 L530,318 L532,332 L518,334 Z' },
    { id: 'ET', name: 'Ethiopia', path: 'M540,240 L590,230 L610,260 L580,290 L540,280 Z' },
    { id: 'MW', name: 'Malawi', path: 'M555,385 L565,375 L570,400 L560,420 L550,405 Z' },
    { id: 'MZ', name: 'Mozambique', path: 'M560,420 L580,400 L590,440 L570,480 L545,460 L555,430 Z' },
    { id: 'ZM', name: 'Zambia', path: 'M490,380 L530,375 L545,400 L520,430 L480,415 Z' },
    { id: 'ZW', name: 'Zimbabwe', path: 'M510,430 L545,420 L550,450 L520,460 L505,445 Z' },
    { id: 'ZA', name: 'South Africa', path: 'M460,500 L540,490 L560,530 L520,570 L470,560 L450,520 Z' },
    { id: 'GH', name: 'Ghana', path: 'M370,280 L390,275 L395,310 L375,320 L365,300 Z' },
    { id: 'NG', name: 'Nigeria', path: 'M400,270 L450,265 L460,300 L440,330 L395,320 Z' },
    { id: 'SN', name: 'Senegal', path: 'M310,250 L340,245 L345,265 L320,275 Z' },
    { id: 'ML', name: 'Mali', path: 'M340,200 L400,195 L410,250 L350,260 Z' },
    { id: 'NE', name: 'Niger', path: 'M410,200 L470,195 L475,245 L420,255 Z' },
    // Non-project countries (shown in grey)
    { id: 'EG', name: 'Egypt', path: 'M500,120 L550,110 L560,160 L520,180 L495,155 Z', noProject: true },
    { id: 'LY', name: 'Libya', path: 'M430,120 L500,115 L505,170 L450,185 L420,160 Z', noProject: true },
    { id: 'DZ', name: 'Algeria', path: 'M360,100 L430,95 L440,170 L380,190 L350,150 Z', noProject: true },
    { id: 'MA', name: 'Morocco', path: 'M320,100 L360,95 L365,140 L330,155 Z', noProject: true },
    { id: 'SD', name: 'Sudan', path: 'M500,180 L560,175 L570,230 L520,245 L490,220 Z', noProject: true },
    { id: 'CD', name: 'DR Congo', path: 'M460,310 L510,300 L520,360 L490,390 L450,370 Z', noProject: true },
    { id: 'AO', name: 'Angola', path: 'M420,380 L470,370 L480,430 L440,450 L410,420 Z', noProject: true },
    { id: 'NA', name: 'Namibia', path: 'M420,450 L460,440 L470,510 L430,530 L410,490 Z', noProject: true },
    { id: 'BW', name: 'Botswana', path: 'M470,450 L510,445 L515,500 L475,510 Z', noProject: true },
  ];

  return (
    <div className="relative">
      <svg viewBox="280 80 350 520" className="w-full h-auto africa-map">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {africaCountries.map((country) => {
          const hasProject = projectCountries.includes(country.name);
          const isHovered = hoveredCountry === country.name;
          return (
            <motion.path
              key={country.id}
              d={country.path}
              fill={hasProject ? (isHovered ? '#e63946' : '#2a9d8f') : '#e2e8f0'}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => hasProject && onCountryClick?.(country.name)}
              filter={isHovered && hasProject ? 'url(#glow)' : undefined}
            />
          );
        })}
      </svg>
      {hoveredCountry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-[#0a1628] text-white px-4 py-2 text-sm font-medium"
        >
          {hoveredCountry}
          {projectCountries.includes(hoveredCountry) && (
            <span className="ml-2 text-[#2a9d8f]">• Active Projects</span>
          )}
        </motion.div>
      )}
      <div className="mt-4 flex items-center gap-6 text-sm text-[#64748b]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#2a9d8f]"></div>
          <span>Active Presence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#e2e8f0]"></div>
          <span>Expansion Target</span>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [megaMenuTab, setMegaMenuTab] = useState('services');
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMobileSubMenu(null);
    }
  }, [isOpen]);

  // Close mega menu on route change
  useEffect(() => {
    setMegaMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/insights' },
    { name: 'Careers', path: '/careers' },
  ];

  const serviceLinks = [
    { name: 'All Services', path: '/services', icon: Globe, description: 'Comprehensive research solutions' },
    { name: 'Research & Statistics', path: '/services/research-statistics', icon: BarChart3, description: 'Quantitative & qualitative' },
    { name: 'Monitoring & Evaluation', path: '/services/monitoring-evaluation', icon: Target, description: 'M&E frameworks' },
    { name: 'Data Collection', path: '/services/data-collection', icon: Users, description: 'Field operations' },
    { name: 'Data Analytics', path: '/services/data-analytics', icon: PieChart, description: 'Analysis & visualization' },
    { name: 'Survey Design', path: '/services/survey-design', icon: PenTool, description: 'Methodology expertise' },
    { name: 'Qualitative Research', path: '/services/qualitative-research', icon: MessageCircle, description: 'In-depth understanding' },
    { name: 'GIS & Geospatial', path: '/services/gis-geospatial', icon: Map, description: 'Spatial analysis' },
    { name: 'Digital Solutions', path: '/services/digital-solutions', icon: Smartphone, description: 'Tech-enabled data' },
    { name: 'Program Design', path: '/services/program-design', icon: Workflow, description: 'ToC & frameworks' },
    { name: 'Policy Research', path: '/services/policy-research', icon: FileText, description: 'Evidence to action' },
    { name: 'Economic Analysis', path: '/services/economic-analysis', icon: Calculator, description: 'Cost-benefit & ROI' },
    { name: 'Knowledge Management', path: '/services/knowledge-management', icon: FolderOpen, description: 'Learning systems' },
    { name: 'Capacity Building', path: '/services/capacity-building', icon: GraduationCap, description: 'Training programs' },
    { name: 'Technical Advisory', path: '/services/technical-advisory', icon: Compass, description: 'Strategic guidance' },
  ];

  const practiceAreaLinks = [
    { name: 'All Practice Areas', path: '/practice-areas', icon: Globe, description: 'Our sector expertise' },
    { name: 'Agriculture & Food Security', path: '/practice-areas/agriculture', icon: Sprout, description: 'Food security & farming' },
    { name: 'Education', path: '/practice-areas/education', icon: BookOpen, description: 'Learning assessments' },
    { name: 'Health', path: '/practice-areas/health', icon: Heart, description: 'Health systems' },
    { name: 'WASH', path: '/practice-areas/wash', icon: Droplets, description: 'Water & sanitation' },
    { name: 'Nutrition', path: '/practice-areas/nutrition', icon: Utensils, description: 'Nutrition surveys' },
    { name: 'Social Protection', path: '/practice-areas/social-protection', icon: Shield, description: 'Safety nets' },
    { name: 'Inclusion & Disability', path: '/practice-areas/inclusion', icon: HandHeart, description: 'Inclusive programming' },
    { name: 'Youth & Adolescents', path: '/practice-areas/youth', icon: GraduationCap, description: 'Youth development' },
    { name: 'Governance', path: '/practice-areas/governance', icon: Scale, description: 'Public finance' },
    { name: 'Economic Development', path: '/practice-areas/economic-development', icon: TrendingUp, description: 'Enterprise & jobs' },
    { name: 'Conflict & Humanitarian', path: '/practice-areas/conflict-humanitarian', icon: AlertTriangle, description: 'Crisis response' },
    { name: 'Urban Development', path: '/practice-areas/urban', icon: Building2, description: 'Cities & services' },
    { name: 'Infrastructure', path: '/practice-areas/infrastructure', icon: Truck, description: 'Roads & energy' },
    { name: 'Private Sector', path: '/practice-areas/private-sector', icon: Factory, description: 'Business environment' },
    { name: 'Environment & Climate', path: '/practice-areas/environment', icon: Globe, description: 'Climate resilience' },
  ];

  const industryLinks = [
    { name: 'All Industries', path: '/industries', icon: Globe, description: 'Our industry expertise' },
    { name: 'Agriculture & Agribusiness', path: '/industries/agriculture', icon: Sprout, description: 'Food security solutions' },
    { name: 'Education & Training', path: '/industries/education', icon: GraduationCap, description: 'Learning outcomes' },
    { name: 'Health & Pharmaceuticals', path: '/industries/health', icon: Heart, description: 'Healthcare analytics' },
    { name: 'Water & Sanitation', path: '/industries/wash', icon: Droplets, description: 'WASH sector solutions' },
    { name: 'Public Sector & Government', path: '/industries/public-sector', icon: Landmark, description: 'Policy research' },
    { name: 'Energy & Utilities', path: '/industries/energy', icon: Zap, description: 'Energy access' },
    { name: 'Financial Services', path: '/industries/financial-services', icon: Building2, description: 'Financial inclusion' },
    { name: 'Infrastructure & Construction', path: '/industries/infrastructure', icon: Factory, description: 'Project assessments' },
    { name: 'Transport & Logistics', path: '/industries/transport', icon: Truck, description: 'Mobility analytics' },
    { name: 'Tourism & Hospitality', path: '/industries/tourism', icon: Plane, description: 'Destination analytics' },
    { name: 'Technology & Telecom', path: '/industries/technology', icon: Smartphone, description: 'Digital transformation' },
    { name: 'Mining & Extractives', path: '/industries/mining', icon: Pickaxe, description: 'ESG assessments' },
    { name: 'Food & Nutrition', path: '/industries/nutrition', icon: Utensils, description: 'Food systems' },
    { name: 'NGOs & Development', path: '/industries/ngos', icon: Globe, description: 'Impact measurement' },
    { name: 'Manufacturing', path: '/industries/manufacturing', icon: Factory, description: 'Industrial analytics' },
    { name: 'Retail & Consumer Goods', path: '/industries/retail', icon: ShoppingCart, description: 'Consumer insights' },
  ];

  const solutionLinks = [
    { name: 'All Solutions', path: '/solutions', icon: Layers, description: 'Software products overview' },
    { name: 'Survey360', path: '/solutions/survey360', icon: Target, description: 'Survey management platform' },
    { name: 'DataViz Studio', path: '/solutions/dataviz-studio', icon: PieChart, description: 'Analytics & visualization' },
    { name: 'M&E Tracker', path: '/solutions/me-tracker', icon: TrendingUp, description: 'M&E management system' },
    { name: 'FieldForce', path: '/solutions/fieldforce', icon: Smartphone, description: 'Mobile data collection' },
    { name: 'AgriData Pro', path: '/solutions/agridata-pro', icon: Sprout, description: 'Agricultural intelligence' },
    { name: 'EduInsights', path: '/solutions/eduinsights', icon: GraduationCap, description: 'Education analytics' },
    { name: 'HealthPulse', path: '/solutions/healthpulse', icon: Heart, description: 'Healthcare analytics' },
    { name: 'WASH Monitor', path: '/solutions/wash-monitor', icon: Droplets, description: 'WASH tracking system' },
  ];

  const isServicesActive = location.pathname.startsWith('/services');
  const isPracticeAreasActive = location.pathname.startsWith('/practice-areas');
  const isIndustriesActive = location.pathname.startsWith('/industries');
  const isSolutionsActive = location.pathname.startsWith('/solutions');
  const isWhatWeDoActive = isServicesActive || isPracticeAreasActive || isIndustriesActive || isSolutionsActive;
  
  // Check if we're on a specific product page (Survey360, DataPulse, etc.)
  const isOnProductPage = location.pathname.startsWith('/solutions/survey360') || 
                          location.pathname.startsWith('/solutions/datapulse');

  // Minimal navbar for product pages
  if (isOnProductPage) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/datavision-logo.png" 
                alt="DataVision International" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Back to Solutions link */}
            <Link 
              to="/solutions" 
              className="flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0a1628] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Solutions</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/datavision-logo.png" 
              alt="DataVision International" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation - Simplified */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-[#e63946]' 
                  : 'text-[#64748b] hover:text-[#0a1628]'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/about' 
                  ? 'text-[#e63946]' 
                  : 'text-[#64748b] hover:text-[#0a1628]'
              }`}
            >
              About
            </Link>
            
            {/* MEGA MENU - What We Do */}
            <div 
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button 
                className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                  isWhatWeDoActive ? 'text-[#e63946]' : 'text-[#0a1628] hover:text-[#e63946]'
                }`}
                data-testid="mega-menu-btn"
              >
                What We Do <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px]"
                  >
                    <div className="bg-white shadow-2xl border border-[#e2e8f0] rounded-lg overflow-hidden">
                      {/* Tabs */}
                      <div className="flex border-b border-[#e2e8f0] bg-[#f8fafc]">
                        {[
                          { id: 'services', label: 'Services', icon: Target },
                          { id: 'solutions', label: 'Solutions', icon: Layers },
                          { id: 'industries', label: 'Industries', icon: Building2 },
                          { id: 'practice-areas', label: 'Practice Areas', icon: Globe },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setMegaMenuTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all ${
                              megaMenuTab === tab.id 
                                ? 'text-[#e63946] border-b-2 border-[#e63946] bg-white' 
                                : 'text-[#64748b] hover:text-[#0a1628]'
                            }`}
                          >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {megaMenuTab === 'services' && (
                          <div className="grid grid-cols-3 gap-3">
                            {serviceLinks.slice(0, 9).map((service, index) => (
                              <Link
                                key={service.path}
                                to={service.path}
                                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors group ${
                                  index === 0 ? 'col-span-3 bg-[#0a1628] hover:bg-[#1e293b] mb-2' : ''
                                }`}
                              >
                                <service.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  index === 0 ? 'text-[#e63946]' : 'text-[#2a9d8f] group-hover:text-[#e63946]'
                                } transition-colors`} />
                                <div>
                                  <span className={`text-sm font-semibold block ${
                                    index === 0 ? 'text-white' : 'text-[#0a1628] group-hover:text-[#e63946]'
                                  } transition-colors`}>
                                    {service.name}
                                  </span>
                                  <span className={`text-xs ${index === 0 ? 'text-white/70' : 'text-[#64748b]'}`}>
                                    {service.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {megaMenuTab === 'solutions' && (
                          <div className="grid grid-cols-3 gap-3">
                            {solutionLinks.map((solution, index) => (
                              <Link
                                key={solution.path}
                                to={solution.path}
                                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors group ${
                                  index === 0 ? 'col-span-3 bg-[#0a1628] hover:bg-[#1e293b] mb-2' : ''
                                }`}
                              >
                                <solution.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  index === 0 ? 'text-[#e63946]' : 'text-[#8b5cf6] group-hover:text-[#e63946]'
                                } transition-colors`} />
                                <div>
                                  <span className={`text-sm font-semibold block ${
                                    index === 0 ? 'text-white' : 'text-[#0a1628] group-hover:text-[#e63946]'
                                  } transition-colors`}>
                                    {solution.name}
                                  </span>
                                  <span className={`text-xs ${index === 0 ? 'text-white/70' : 'text-[#64748b]'}`}>
                                    {solution.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {megaMenuTab === 'industries' && (
                          <div className="grid grid-cols-3 gap-3">
                            {industryLinks.slice(0, 10).map((industry, index) => (
                              <Link
                                key={industry.path}
                                to={industry.path}
                                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors group ${
                                  index === 0 ? 'col-span-3 bg-[#0a1628] hover:bg-[#1e293b] mb-2' : ''
                                }`}
                              >
                                <industry.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  index === 0 ? 'text-[#e63946]' : 'text-[#2a9d8f] group-hover:text-[#e63946]'
                                } transition-colors`} />
                                <div>
                                  <span className={`text-sm font-semibold block ${
                                    index === 0 ? 'text-white' : 'text-[#0a1628] group-hover:text-[#e63946]'
                                  } transition-colors`}>
                                    {industry.name}
                                  </span>
                                  <span className={`text-xs ${index === 0 ? 'text-white/70' : 'text-[#64748b]'}`}>
                                    {industry.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {megaMenuTab === 'practice-areas' && (
                          <div className="grid grid-cols-3 gap-3">
                            {practiceAreaLinks.slice(0, 10).map((area, index) => (
                              <Link
                                key={area.path}
                                to={area.path}
                                className={`flex items-start gap-3 p-3 rounded-lg hover:bg-[#f8fafc] transition-colors group ${
                                  index === 0 ? 'col-span-3 bg-[#0a1628] hover:bg-[#1e293b] mb-2' : ''
                                }`}
                              >
                                <area.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                  index === 0 ? 'text-[#e63946]' : 'text-[#2a9d8f] group-hover:text-[#e63946]'
                                } transition-colors`} />
                                <div>
                                  <span className={`text-sm font-semibold block ${
                                    index === 0 ? 'text-white' : 'text-[#0a1628] group-hover:text-[#e63946]'
                                  } transition-colors`}>
                                    {area.name}
                                  </span>
                                  <span className={`text-xs ${index === 0 ? 'text-white/70' : 'text-[#64748b]'}`}>
                                    {area.description}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link
              to="/insights"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/insights') 
                  ? 'text-[#e63946]' 
                  : 'text-[#64748b] hover:text-[#0a1628]'
              }`}
            >
              Insights
            </Link>
            
            <Link
              to="/careers"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/careers') 
                  ? 'text-[#e63946]' 
                  : 'text-[#64748b] hover:text-[#0a1628]'
              }`}
            >
              Careers
            </Link>
          </div>

          {/* CTA and Mobile Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0a1628]"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#e63946]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#0a1628]"
              >
                <LogIn className="w-4 h-4" />
                Admin
              </Link>
            )}
            <Link 
              to="/contact"
              className="hidden md:block bg-[#e63946] text-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-[#0a1628] transition-colors"
            >
              Partner With Us
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2"
              data-testid="mobile-menu-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu - What We Do Unified Design (Matches Desktop Mega Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="relative" style={{ minHeight: '450px' }}>
              {/* Main Menu Panel */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu ? '-100%' : '0%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white"
              >
                <div className="px-6 py-4">
                  {/* Home */}
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 text-base font-medium border-b border-[#f1f5f9] ${
                      location.pathname === '/' ? 'text-[#e63946]' : 'text-[#0a1628]'
                    }`}
                  >
                    Home
                  </Link>
                  
                  {/* About */}
                  <Link
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 text-base font-medium border-b border-[#f1f5f9] ${
                      location.pathname === '/about' ? 'text-[#e63946]' : 'text-[#0a1628]'
                    }`}
                  >
                    About
                  </Link>
                  
                  {/* What We Do - Opens Sub Panel (Unified like desktop) */}
                  <button
                    onClick={() => setMobileSubMenu('what-we-do')}
                    className={`flex items-center justify-between w-full py-4 text-base font-semibold border-b border-[#f1f5f9] ${
                      isWhatWeDoActive ? 'text-[#e63946]' : 'text-[#0a1628]'
                    }`}
                    data-testid="mobile-what-we-do-btn"
                  >
                    <span>What We Do</span>
                    <ChevronRight className="w-5 h-5 text-[#64748b]" />
                  </button>
                  
                  {/* Insights */}
                  <Link
                    to="/insights"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 text-base font-medium border-b border-[#f1f5f9] ${
                      location.pathname.startsWith('/insights') ? 'text-[#e63946]' : 'text-[#0a1628]'
                    }`}
                  >
                    Insights
                  </Link>
                  
                  {/* Careers */}
                  <Link
                    to="/careers"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-4 text-base font-medium border-b border-[#f1f5f9] ${
                      location.pathname.startsWith('/careers') ? 'text-[#e63946]' : 'text-[#0a1628]'
                    }`}
                  >
                    Careers
                  </Link>
                  
                  {/* CTA Button */}
                  <Link 
                    to="/contact" 
                    onClick={() => setIsOpen(false)}
                    className="block mt-6 bg-[#e63946] text-white px-6 py-4 text-sm font-semibold uppercase tracking-wider text-center"
                    data-testid="mobile-cta-btn"
                  >
                    Partner With Us
                  </Link>
                </div>
              </motion.div>

              {/* What We Do Sub Panel - Category Selection */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu === 'what-we-do' ? '0%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto"
              >
                <div className="px-6 py-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setMobileSubMenu(null)}
                    className="flex items-center gap-2 py-4 text-[#64748b] font-medium border-b border-[#f1f5f9] w-full"
                    data-testid="mobile-back-btn"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back</span>
                  </button>
                  
                  {/* Section Title */}
                  <div className="py-4 border-b border-[#e63946]">
                    <h3 className="text-lg font-bold text-[#0a1628]">What We Do</h3>
                    <p className="text-sm text-[#64748b]">Explore our offerings</p>
                  </div>
                  
                  {/* Category Cards */}
                  <div className="py-4 space-y-3">
                    <button
                      onClick={() => setMobileSubMenu('services')}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${
                        isServicesActive ? 'border-[#e63946] bg-[#e63946]/5' : 'border-[#e2e8f0] hover:border-[#e63946]'
                      }`}
                      data-testid="mobile-services-btn"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center">
                        <Target className="w-6 h-6 text-[#e63946]" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-base font-semibold text-[#0a1628]">Services</span>
                        <p className="text-xs text-[#64748b]">Our consulting offerings</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748b]" />
                    </button>
                    
                    <button
                      onClick={() => setMobileSubMenu('solutions')}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${
                        isSolutionsActive ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' : 'border-[#e2e8f0] hover:border-[#8b5cf6]'
                      }`}
                      data-testid="mobile-solutions-btn"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center">
                        <Layers className="w-6 h-6 text-[#8b5cf6]" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-base font-semibold text-[#0a1628]">Solutions</span>
                        <p className="text-xs text-[#64748b]">Software products</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748b]" />
                    </button>
                    
                    <button
                      onClick={() => setMobileSubMenu('industries')}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${
                        isIndustriesActive ? 'border-[#2a9d8f] bg-[#2a9d8f]/5' : 'border-[#e2e8f0] hover:border-[#2a9d8f]'
                      }`}
                      data-testid="mobile-industries-btn"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[#2a9d8f]" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-base font-semibold text-[#0a1628]">Industries</span>
                        <p className="text-xs text-[#64748b]">Sectors we serve</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748b]" />
                    </button>
                    
                    <button
                      onClick={() => setMobileSubMenu('practice-areas')}
                      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all ${
                        isPracticeAreasActive ? 'border-[#f59e0b] bg-[#f59e0b]/5' : 'border-[#e2e8f0] hover:border-[#f59e0b]'
                      }`}
                      data-testid="mobile-practice-areas-btn"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#0a1628] flex items-center justify-center">
                        <Globe className="w-6 h-6 text-[#f59e0b]" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-base font-semibold text-[#0a1628]">Practice Areas</span>
                        <p className="text-xs text-[#64748b]">Our sector expertise</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#64748b]" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Services Sub Panel */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu === 'services' ? '0%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto"
              >
                <div className="px-6 py-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setMobileSubMenu('what-we-do')}
                    className="flex items-center gap-2 py-4 text-[#64748b] font-medium border-b border-[#f1f5f9] w-full"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to What We Do</span>
                  </button>
                  
                  {/* Section Title */}
                  <div className="py-4 border-b border-[#e63946]">
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-[#e63946]" />
                      <div>
                        <h3 className="text-lg font-bold text-[#0a1628]">Services</h3>
                        <p className="text-sm text-[#64748b]">Our comprehensive offerings</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Links */}
                  <div className="py-2">
                    {serviceLinks.map((service, index) => (
                      <Link
                        key={service.path}
                        to={service.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 py-3 ${
                          index !== serviceLinks.length - 1 ? 'border-b border-[#f1f5f9]' : ''
                        } ${location.pathname === service.path ? 'text-[#e63946]' : 'text-[#0a1628]'}`}
                      >
                        <service.icon className={`w-5 h-5 flex-shrink-0 ${
                          location.pathname === service.path ? 'text-[#e63946]' : 'text-[#2a9d8f]'
                        }`} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium block truncate">{service.name}</span>
                          <p className="text-xs text-[#64748b] truncate">{service.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Solutions Sub Panel */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu === 'solutions' ? '0%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto"
              >
                <div className="px-6 py-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setMobileSubMenu('what-we-do')}
                    className="flex items-center gap-2 py-4 text-[#64748b] font-medium border-b border-[#f1f5f9] w-full"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to What We Do</span>
                  </button>
                  
                  {/* Section Title */}
                  <div className="py-4 border-b border-[#8b5cf6]">
                    <div className="flex items-center gap-3">
                      <Layers className="w-6 h-6 text-[#8b5cf6]" />
                      <div>
                        <h3 className="text-lg font-bold text-[#0a1628]">Solutions</h3>
                        <p className="text-sm text-[#64748b]">Software products</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Solution Links */}
                  <div className="py-2">
                    {solutionLinks.map((solution, index) => (
                      <Link
                        key={solution.path}
                        to={solution.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 py-3 ${
                          index !== solutionLinks.length - 1 ? 'border-b border-[#f1f5f9]' : ''
                        } ${location.pathname === solution.path ? 'text-[#e63946]' : 'text-[#0a1628]'}`}
                      >
                        <solution.icon className={`w-5 h-5 flex-shrink-0 ${
                          location.pathname === solution.path ? 'text-[#e63946]' : 'text-[#8b5cf6]'
                        }`} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium block truncate">{solution.name}</span>
                          <p className="text-xs text-[#64748b] truncate">{solution.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Industries Sub Panel */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu === 'industries' ? '0%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto"
              >
                <div className="px-6 py-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setMobileSubMenu('what-we-do')}
                    className="flex items-center gap-2 py-4 text-[#64748b] font-medium border-b border-[#f1f5f9] w-full"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to What We Do</span>
                  </button>
                  
                  {/* Section Title */}
                  <div className="py-4 border-b border-[#2a9d8f]">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-[#2a9d8f]" />
                      <div>
                        <h3 className="text-lg font-bold text-[#0a1628]">Industries</h3>
                        <p className="text-sm text-[#64748b]">Sectors we serve</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Industry Links */}
                  <div className="py-2">
                    {industryLinks.map((industry, index) => (
                      <Link
                        key={industry.path}
                        to={industry.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 py-3 ${
                          index !== industryLinks.length - 1 ? 'border-b border-[#f1f5f9]' : ''
                        } ${location.pathname === industry.path ? 'text-[#e63946]' : 'text-[#0a1628]'}`}
                      >
                        <industry.icon className={`w-5 h-5 flex-shrink-0 ${
                          location.pathname === industry.path ? 'text-[#e63946]' : 'text-[#2a9d8f]'
                        }`} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium block truncate">{industry.name}</span>
                          <p className="text-xs text-[#64748b] truncate">{industry.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Practice Areas Sub Panel */}
              <motion.div
                initial={false}
                animate={{ x: mobileSubMenu === 'practice-areas' ? '0%' : '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="absolute inset-0 bg-white overflow-y-auto"
              >
                <div className="px-6 py-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setMobileSubMenu('what-we-do')}
                    className="flex items-center gap-2 py-4 text-[#64748b] font-medium border-b border-[#f1f5f9] w-full"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to What We Do</span>
                  </button>
                  
                  {/* Section Title */}
                  <div className="py-4 border-b border-[#f59e0b]">
                    <div className="flex items-center gap-3">
                      <Globe className="w-6 h-6 text-[#f59e0b]" />
                      <div>
                        <h3 className="text-lg font-bold text-[#0a1628]">Practice Areas</h3>
                        <p className="text-sm text-[#64748b]">Our sector expertise</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Practice Area Links */}
                  <div className="py-2">
                    {practiceAreaLinks.map((area, index) => (
                      <Link
                        key={area.path}
                        to={area.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 py-3 ${
                          index !== practiceAreaLinks.length - 1 ? 'border-b border-[#f1f5f9]' : ''
                        } ${location.pathname === area.path ? 'text-[#e63946]' : 'text-[#0a1628]'}`}
                      >
                        <area.icon className={`w-5 h-5 flex-shrink-0 ${
                          location.pathname === area.path ? 'text-[#e63946]' : 'text-[#2a9d8f]'
                        }`} />
                        <div className="min-w-0">
                          <span className="text-sm font-medium block truncate">{area.name}</span>
                          <p className="text-xs text-[#64748b] truncate">{area.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  const footerServices = [
    { name: 'Research & Statistics', path: '/services/research-statistics' },
    { name: 'Monitoring & Evaluation', path: '/services/monitoring-evaluation' },
    { name: 'Data Collection', path: '/services/data-collection' },
    { name: 'Data Analytics', path: '/services/data-analytics' },
    { name: 'View All Services', path: '/services' },
  ];

  const footerSolutions = [
    { name: 'Survey360', path: '/solutions/survey360' },
    { name: 'DataViz Studio', path: '/solutions/dataviz-studio' },
    { name: 'M&E Tracker', path: '/solutions/me-tracker' },
    { name: 'FieldForce', path: '/solutions/fieldforce' },
    { name: 'View All Solutions', path: '/solutions' },
  ];

  const footerIndustries = [
    { name: 'Agriculture', path: '/industries/agriculture' },
    { name: 'Education', path: '/industries/education' },
    { name: 'Health', path: '/industries/health' },
    { name: 'Public Sector', path: '/industries/public-sector' },
    { name: 'View All Industries', path: '/industries' },
  ];

  const footerCompany = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Insights', path: '/insights' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-[#0a1628] text-white relative noise-overlay" data-testid="footer">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand - Takes 2 columns on large screens */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="mb-4">
              <img 
                src="/datavision-logo.png" 
                alt="DataVision International" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-white/70 mb-6 max-w-md text-sm leading-relaxed">
              Africa's trusted partner in research and statistics. Over 25 years of experience 
              delivering data-driven insights that shape policy and drive development across the continent.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#e63946] transition-colors" data-testid="footer-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#e63946] flex-shrink-0" />
                <span>Garden Road, Mikocheni Area, Dar es Salaam</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e63946] flex-shrink-0" />
                <span>+255 754 869 302</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e63946] flex-shrink-0" />
                <a href="mailto:info@datavision.co.tz" className="hover:text-[#e63946]">info@datavision.co.tz</a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white" data-testid="footer-services-title">Services</h4>
            <ul className="space-y-2">
              {footerServices.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-[#e63946] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white" data-testid="footer-solutions-title">Solutions</h4>
            <ul className="space-y-2">
              {footerSolutions.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-[#e63946] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white" data-testid="footer-industries-title">Industries</h4>
            <ul className="space-y-2">
              {footerIndustries.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-[#e63946] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-white" data-testid="footer-company-title">Company</h4>
            <ul className="space-y-2">
              {footerCompany.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-[#e63946] transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} DataVision International. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">
            Research Excellence Since 1998
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==================== PAGES ====================

// Home Page
const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes, projectsRes, partnersRes] = await Promise.all([
          axios.get(`${API}/statistics`),
          axios.get(`${API}/testimonials?featured=true`),
          axios.get(`${API}/projects?featured=true`),
          axios.get(`${API}/partners`)
        ]);
        setStats(statsRes.data);
        setTestimonials(testimonialsRes.data);
        setProjects(projectsRes.data);
        setPartners(partnersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const heroMessages = [
    "Data-Driven Insights Shaping Africa's Future",
    "Africa's Trusted Partner in Research & Statistics"
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white min-h-[90vh] flex items-center noise-overlay overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#1e293b] to-[#0a1628]" style={{background: 'radial-gradient(circle at top right, #1e293b 0%, #0a1628 100%)'}}></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">
                25 Years of Excellence
              </p>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-serif text-white"
                  data-testid="hero-title"
                >
                  {heroMessages[heroIndex]}
                </motion.h1>
              </AnimatePresence>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Leading research and statistics consultancy with deep expertise across 
                agriculture, education, health, and WASH sectors. Trusted by World Bank, 
                USAID, and development partners across Africa.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
                  data-testid="hero-partner-btn"
                >
                  Partner With Us
                </Link>
                <Link 
                  to="/contact?type=consultation" 
                  className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#0a1628] transition-all"
                  data-testid="hero-consultation-btn"
                >
                  Request Consultation
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <AfricaMap />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-5xl md:text-6xl font-bold text-[#0a1628] mb-2 font-serif">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <p className="text-sm text-[#64748b] uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
                Delivering Excellence in Research Since 1998
              </h2>
              <p className="text-[#64748b] mb-6">
                DataVision International is a leading research and statistics consultancy 
                headquartered in Dar es Salaam, Tanzania. With over 25 years of experience, 
                we specialize in complex quantitative and qualitative surveys, monitoring 
                and evaluation studies across diverse sectors.
              </p>
              <p className="text-[#64748b] mb-8">
                Our expertise spans hypothesis and concept development, designing, and 
                implementation including planning, sampling, recruitment, training, field 
                and remote data collection, data processing and analysis, report writing, 
                and dissemination.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
              >
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all">
                <Sprout className="w-8 h-8 text-[#2a9d8f] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Agriculture</h3>
                <p className="text-sm text-[#64748b]">Food security & agricultural development research</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all">
                <BookOpen className="w-8 h-8 text-[#2a9d8f] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Education</h3>
                <p className="text-sm text-[#64748b]">Literacy programs & educational assessments</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all">
                <Heart className="w-8 h-8 text-[#2a9d8f] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Health</h3>
                <p className="text-sm text-[#64748b]">Healthcare access & public health studies</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all">
                <Droplets className="w-8 h-8 text-[#2a9d8f] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">WASH</h3>
                <p className="text-sm text-[#64748b]">Water, sanitation & hygiene research</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-2">Our Work</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif">Featured Projects</h2>
            </div>
            <Link 
              to="/projects" 
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] p-8 hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all group"
                data-testid={`project-card-${index}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-1">
                    {project.sector}
                  </span>
                  <span className="text-xs text-[#64748b]">{project.year}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-3 font-serif group-hover:text-[#e63946] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#64748b] text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Building2 className="w-4 h-4" />
                  <span>{project.client}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-[#0a1628] text-white relative noise-overlay">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center relative">
              <Quote className="w-16 h-16 text-[#e63946] opacity-20 absolute -top-8 left-0" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  data-testid="testimonial-carousel"
                >
                  <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial]?.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-[#e63946]">
                      {testimonials[currentTestimonial]?.author_name}
                    </p>
                    <p className="text-white/70 text-sm">
                      {testimonials[currentTestimonial]?.author_title}, {testimonials[currentTestimonial]?.organization}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-[#e63946] w-8' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="py-16 bg-white border-t">
          <div className="container mx-auto px-6 lg:px-12">
            <p className="text-center text-sm uppercase tracking-wider text-[#64748b] mb-8">
              Trusted by Leading Organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {partners.map((partner) => (
                <img 
                  key={partner.id}
                  src={partner.logo_url} 
                  alt={partner.name}
                  className="h-12 object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
            Ready to Partner With Africa's Leading Research Consultancy?
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto mb-8">
            Whether you're planning a large-scale survey, need monitoring and evaluation expertise, 
            or require data collection services across Africa, we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
              data-testid="cta-discuss-btn"
            >
              Discuss Your Project
            </Link>
            <Link 
              to="/research" 
              className="border-2 border-[#0a1628] text-[#0a1628] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Explore Our Expertise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// About Page
const AboutPage = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axios.get(`${API}/team`).then(res => setTeam(res.data)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif max-w-3xl">
              Going the Extra Mile Since 1998
            </h1>
            <p className="text-white/80 max-w-2xl">
              DataVision International has its headquarters in Dar es Salaam, Tanzania, 
              offering professional consulting services in Research & Statistics, ICT, 
              Payments & Cards, and Professional Training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6 font-serif">Our Story</h2>
              <p className="text-[#64748b] mb-4">
                Founded and registered under the companies' law of the United Republic of Tanzania 
                in 1998, DataVision International is an outcome of the recognition that sustainable 
                development can be accelerated by providing requirement-driven solutions.
              </p>
              <p className="text-[#64748b] mb-4">
                Since its establishment, the company has been fast growing in terms of delivery of 
                services and customer base. The best part of our history includes our ability to 
                adapt to the fast-changing demands of our clients.
              </p>
              <p className="text-[#64748b]">
                We work with a "Customer First, Open Mind" philosophy. This relates to our 
                implementation process which makes our clients an integral part of the project 
                to ensure effective capacity building and transfer of the deliverables.
              </p>
            </div>
            <div className="bg-[#f8fafc] p-8">
              <h3 className="text-xl font-bold text-[#0a1628] mb-6 font-serif">Our Values</h3>
              <div className="space-y-4">
                {[
                  { title: 'Excellence', desc: 'Delivering the highest quality in everything we do' },
                  { title: 'Integrity', desc: 'Maintaining ethical standards and transparency' },
                  { title: 'Innovation', desc: 'Embracing modern technologies and methodologies' },
                  { title: 'Partnership', desc: 'Building lasting relationships with our clients' },
                ].map((value, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#0a1628]">{value.title}</h4>
                      <p className="text-sm text-[#64748b]">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-2">Leadership</p>
            <h2 className="text-3xl font-bold text-[#0a1628] font-serif">Our Team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all"
              >
                <div className="w-20 h-20 bg-[#0a1628] rounded-full mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] font-serif">{member.name}</h3>
                <p className="text-[#e63946] text-sm font-semibold mb-2">{member.position}</p>
                <p className="text-[#64748b] text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Research & Statistics Page (Main Focus)
const ResearchPage = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Core Expertise</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                Research & Statistics
              </h1>
              <p className="text-white/80 mb-8">
                Our Research & Statistics team is fully dedicated with over 25 years of field 
                experience in diverse sectors. We deliver complex quantitative and qualitative 
                surveys and monitoring and evaluation studies across Africa.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all"
                data-testid="research-cta-btn"
              >
                Discuss Your Research Needs
              </Link>
            </motion.div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1584931423298-c576fda54bd2?w=600" 
                alt="Data Visualization"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0a1628] font-serif mb-4">Our Research Services</h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              End-to-end research solutions from design to dissemination
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Survey Design & Implementation', desc: 'Complex quantitative and qualitative survey design, sampling methodologies, and field implementation across diverse contexts.' },
              { icon: Users, title: 'Data Collection', desc: 'Large-scale data collection including household surveys, facility assessments, community studies, and institutional research.' },
              { icon: Globe, title: 'Monitoring & Evaluation', desc: 'Comprehensive M&E frameworks, baseline studies, midterm reviews, and impact evaluations for development programs.' },
              { icon: FileText, title: 'Analysis & Reporting', desc: 'Advanced statistical analysis, data processing, visualization, and comprehensive report writing.' },
              { icon: Award, title: 'Training & Capacity Building', desc: 'Enumerator training, data quality protocols, and knowledge transfer to local teams.' },
              { icon: CheckCircle2, title: 'Quality Assurance', desc: 'Rigorous quality control measures, data verification, and validation processes.' },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <service.icon className="w-10 h-10 text-[#2a9d8f] mb-4" />
                <h3 className="text-lg font-bold text-[#0a1628] mb-3 font-serif">{service.title}</h3>
                <p className="text-[#64748b] text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Approach</p>
              <h2 className="text-3xl font-bold text-[#0a1628] font-serif mb-6">
                Rigorous Methodology, Reliable Results
              </h2>
              <p className="text-[#64748b] mb-6">
                Our expertise includes hypothesis and concept development, designing, and 
                implementation in various fields of research. We have vast experiences in 
                enumerating in health facilities, households, schools, communities, businesses, 
                and government institutions.
              </p>
              <div className="space-y-4">
                {[
                  'Planning & sampling design',
                  'Recruitment & training',
                  'Field & remote data collection',
                  'Data processing & analysis',
                  'Report writing & dissemination'
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#e63946] text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-[#0a1628] font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0a1628] p-8 text-white">
              <h3 className="text-xl font-bold mb-6 font-serif">Why Partner With Us?</h3>
              <ul className="space-y-4">
                {[
                  '25+ years of field experience',
                  'Network of 500+ trained enumerators',
                  'Presence across 15+ African countries',
                  'Trusted by World Bank, USAID, UN agencies',
                  'ISO-compliant data quality standards',
                  'Adaptive methodologies including remote surveys'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#e63946] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
            Looking for a Research Partner in Africa?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Whether it's a baseline survey, impact evaluation, or large-scale data collection 
            project, we have the expertise and infrastructure to deliver.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

// Services Page (Other Services - Less Prominent)
const ServicesPage = () => {
  const services = [
    {
      title: 'ICT Solutions',
      icon: Globe,
      description: 'Software engineering, mobile & web apps, ERP suites, system integration, and IT outsourcing.',
      features: ['Custom Software Development', 'Mobile & Web Applications', 'System Integration', 'IT Strategy & Consulting']
    },
    {
      title: 'Payments & Card Services',
      icon: BarChart3,
      description: 'Payment solutions, card personalization, EMV migration advisory, and ID systems.',
      features: ['Payment Software Development', 'Card Personalization', 'EMV Migration Advisory', 'ID Systems Implementation']
    },
    {
      title: 'Professional Training',
      icon: BookOpen,
      description: 'Tailor-made professional and soft skills training in ICT, statistics, research, and management.',
      features: ['ICT Training Programs', 'Statistical Analysis Training', 'Research Methodology', 'Management Skills']
    },
    {
      title: 'TechTab Rentals',
      icon: Settings,
      description: 'Tablet rental solutions for projects, events, and research activities.',
      features: ['Up to 200 devices available', 'Latest iPad & Android tablets', 'Delivery & support included', 'Flexible rental periods']
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#f8fafc] py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Additional Services</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-6 font-serif">
              Beyond Research
            </h1>
            <p className="text-[#64748b]">
              In addition to our core research and statistics expertise, we offer complementary 
              services in ICT, payments, and professional training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <service.icon className="w-12 h-12 text-[#2a9d8f] mb-4" />
                <h3 className="text-xl font-bold text-[#0a1628] mb-3 font-serif">{service.title}</h3>
                <p className="text-[#64748b] mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
                      <ChevronRight className="w-4 h-4 text-[#e63946]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-white/80 mb-4">Looking for our core expertise?</p>
          <Link 
            to="/research" 
            className="inline-flex items-center gap-2 text-[#e63946] font-semibold hover:underline"
          >
            Explore Research & Statistics <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

// Practice Areas Page
const PracticeAreasPage = () => {
  const areas = [
    { 
      id: 'agriculture', 
      icon: Sprout, 
      title: 'Agriculture', 
      color: '#2a9d8f',
      description: 'Food security, agricultural development, and rural livelihoods research across Africa.',
      projects: ['Agricultural productivity studies', 'Food security assessments', 'Value chain analysis', 'Climate-smart agriculture research']
    },
    { 
      id: 'education', 
      icon: BookOpen, 
      title: 'Education', 
      color: '#e9c46a',
      description: 'Educational assessments, literacy programs, and school-based research.',
      projects: ['Early grade literacy assessments', 'School safety evaluations', 'Teacher effectiveness studies', 'Education program evaluations']
    },
    { 
      id: 'health', 
      icon: Heart, 
      title: 'Health', 
      color: '#e63946',
      description: 'Public health studies, healthcare access, and facility assessments.',
      projects: ['Health facility surveys', 'Disease prevalence studies', 'Healthcare access research', 'Nutrition assessments']
    },
    { 
      id: 'wash', 
      icon: Droplets, 
      title: 'WASH', 
      color: '#0ea5e9',
      description: 'Water, sanitation, and hygiene research and data verification.',
      projects: ['Water point mapping', 'Sanitation coverage surveys', 'Hygiene behavior studies', 'WASH infrastructure verification']
    },
  ];

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
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Sector Expertise</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Practice Areas
            </h1>
            <p className="text-white/80">
              DataVision International has more than 25 years experience implementing data 
              related services including quality-driven data collection for baselines and 
              follow-up surveys in different practice areas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8">
            {areas.map((area, index) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 border border-[#e2e8f0] hover:shadow-lg transition-all"
                style={{ borderLeftWidth: '4px', borderLeftColor: area.color }}
              >
                <area.icon className="w-12 h-12 mb-4" style={{ color: area.color }} />
                <h3 className="text-2xl font-bold text-[#0a1628] mb-3 font-serif">{area.title}</h3>
                <p className="text-[#64748b] mb-6">{area.description}</p>
                <h4 className="font-semibold text-[#0a1628] mb-3 text-sm uppercase tracking-wider">Key Projects Include:</h4>
                <ul className="space-y-2">
                  {area.projects.map((project, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#64748b]">
                      <CheckCircle2 className="w-4 h-4" style={{ color: area.color }} />
                      {project}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0a1628] font-serif mb-6">
                Presence Across Africa
              </h2>
              <p className="text-[#64748b] mb-6">
                We have extensive experience conducting research across multiple African 
                countries, with a strong network of local partners and trained enumerators.
              </p>
              <Link 
                to="/contact" 
                className="inline-block bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all"
              >
                Become a Local Partner
              </Link>
            </div>
            <AfricaMap />
          </div>
        </div>
      </section>
    </div>
  );
};

// Projects Page
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    axios.get(`${API}/projects`).then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const sectors = ['all', 'agriculture', 'education', 'health', 'wash'];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.sector === filter);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Work</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Projects & Case Studies
            </h1>
            <p className="text-white/80 max-w-2xl">
              Explore our portfolio of research projects delivered for leading development 
              organizations across Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setFilter(sector)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                  filter === sector 
                    ? 'bg-[#0a1628] text-white' 
                    : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#e2e8f0]'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-[#e2e8f0] p-8 hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-1">
                    {project.sector}
                  </span>
                  <span className="text-xs text-[#64748b]">{project.year}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-3 font-serif">{project.title}</h3>
                <p className="text-[#64748b] text-sm mb-4">{project.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-[#64748b]" />
                  <span className="text-[#0a1628] font-medium">{project.client}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <MapPin className="w-4 h-4 text-[#64748b]" />
                  <span className="text-[#64748b]">{project.country}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p className="text-center text-[#64748b] py-12">No projects found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

// News Page
const NewsPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get(`${API}/news`).then(res => setNews(res.data)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#f8fafc] py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Latest Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] font-serif">
              News & Insights
            </h1>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all"
              >
                <div className="p-8">
                  <p className="text-xs text-[#64748b] mb-3">
                    {new Date(article.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-3 font-serif">{article.title}</h3>
                  <p className="text-[#64748b] text-sm">{article.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {news.length === 0 && (
            <p className="text-center text-[#64748b] py-12">No news articles available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

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

// Admin Dashboard
const AdminDashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Wait for auth loading to complete before redirecting
    if (loading) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('dv_token');
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${API}/admin/inquiries`, { headers }),
      axios.get(`${API}/projects`),
      axios.get(`${API}/statistics`)
    ]).then(([inqRes, projRes, statsRes]) => {
      setInquiries(inqRes.data);
      setProjects(projRes.data);
      setStats(statsRes.data);
    }).catch(console.error);
  }, [user, navigate, loading]);

  // Show loading while auth is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#e63946] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'experts', label: 'Expert Network', icon: Users },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'matching', label: 'Project Matching', icon: Target },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Admin Header */}
      <header className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold font-serif">
            Data<span className="text-[#e63946]">Vision</span>
          </Link>
          <span className="text-white/50">|</span>
          <span className="text-sm text-white/70">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/70">{user.email}</span>
          <button 
            onClick={logout}
            className="text-sm text-white/70 hover:text-[#e63946] flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#0a1628] text-white' 
                    : 'text-[#64748b] hover:bg-[#f8fafc]'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-sm text-[#64748b] hover:text-[#e63946]"
            >
              <ExternalLink className="w-4 h-4" /> View Website
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'inquiries' && (
            <div>
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 font-serif">Inquiries</h2>
              <div className="bg-white border border-[#e2e8f0]">
                {inquiries.length === 0 ? (
                  <p className="p-8 text-center text-[#64748b]">No inquiries yet.</p>
                ) : (
                  <div className="divide-y">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-6 hover:bg-[#f8fafc]">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-[#0a1628]">{inquiry.subject}</h3>
                            <p className="text-sm text-[#64748b] mt-1">
                              From: {inquiry.name} ({inquiry.email})
                              {inquiry.company && ` - ${inquiry.company}`}
                            </p>
                            <p className="text-sm text-[#64748b] mt-2">{inquiry.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 ${
                              inquiry.status === 'new' 
                                ? 'bg-[#e63946]/10 text-[#e63946]' 
                                : 'bg-[#2a9d8f]/10 text-[#2a9d8f]'
                            }`}>
                              {inquiry.status}
                            </span>
                            <span className="text-xs text-[#64748b]">
                              {new Date(inquiry.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'experts' && (
            <AdminExpertManagement token={localStorage.getItem('dv_token')} />
          )}

          {activeTab === 'verification' && (
            <AdminVerificationDashboard token={localStorage.getItem('dv_token')} />
          )}

          {activeTab === 'matching' && (
            <AdminProjectMatching token={localStorage.getItem('dv_token')} />
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0a1628] font-serif">Projects</h2>
              </div>
              <div className="bg-white border border-[#e2e8f0]">
                {projects.map((project) => (
                  <div key={project.id} className="p-6 border-b last:border-b-0 hover:bg-[#f8fafc]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-[#0a1628]">{project.title}</h3>
                        <p className="text-sm text-[#64748b] mt-1">{project.client} • {project.year}</p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-[#2a9d8f]/10 text-[#2a9d8f]">
                        {project.sector}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div>
              <h2 className="text-2xl font-bold text-[#0a1628] mb-6 font-serif">Statistics</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.id} className="bg-white p-6 border border-[#e2e8f0]">
                    <p className="text-4xl font-bold text-[#0a1628] font-serif">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </p>
                    <p className="text-sm text-[#64748b] mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={
              <>
                <Navbar />
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
                  <Route path="/solutions/survey360" element={<Survey360ProductPage />} />
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
                  <Route path="/solutions/fieldforce" element={<FieldForcePage />} />
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
