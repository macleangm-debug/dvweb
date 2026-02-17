import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronDown, ArrowLeft,
  BookOpen, Droplets, Heart, Sprout,
  BarChart3, Globe,
  LogIn, LogOut, Settings, FileText, CreditCard,
  ChevronRight, Target, PieChart, GraduationCap, Compass, Scale, TrendingUp,
  Shield, HandHeart, Utensils, AlertTriangle, Truck, Factory,
  FolderOpen, Smartphone, Map, MessageCircle, PenTool, Workflow, Calculator,
  Zap, Pickaxe, Plane, Landmark, Layers, ShoppingCart, Building2, Activity
} from 'lucide-react';

const Navbar = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [megaMenuTab, setMegaMenuTab] = useState('services');
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const location = useLocation();

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

  const serviceLinks = [
    { name: 'All Services', path: '/services', icon: Globe, description: 'Comprehensive research solutions' },
    { name: 'Research & Statistics', path: '/services/research-statistics', icon: BarChart3, description: 'Quantitative & qualitative' },
    { name: 'Monitoring & Evaluation', path: '/services/monitoring-evaluation', icon: Target, description: 'M&E frameworks' },
    { name: 'Data Collection', path: '/services/data-collection', icon: Globe, description: 'Field operations' },
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
    { name: 'FieldForce', path: '/solutions/fieldforce', icon: Smartphone, description: 'Mobile data collection' },
    { name: 'DataPulse', path: '/solutions/datapulse', icon: Activity, description: 'Enterprise data collection' },
    { name: 'DataViz Studio', path: '/solutions/dataviz-studio', icon: PieChart, description: 'Analytics & visualization' },
    { name: 'M&E Tracker', path: '/solutions/me-tracker', icon: TrendingUp, description: 'M&E management system' },
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
  
  // Check if we're on a specific product page (Survey360, FieldForce, etc.)
  const isOnProductPage = location.pathname.startsWith('/solutions/survey360') || 
                          location.pathname.startsWith('/solutions/fieldforce') ||
                          location.pathname.startsWith('/solutions/datapulse');
  
  // Check if we're inside a product's app (full-screen experience - hide navbar completely)
  const isInProductApp = location.pathname.includes('/app/');

  // Hide navbar completely when inside product apps (login, dashboard, etc.)
  // Also hide on FieldForce landing page since it has its own dark-themed header
  if (isOnProductPage && (isInProductApp || location.pathname === '/solutions/fieldforce')) {
    return null;
  }

  // Minimal navbar for product landing pages only (Survey360, DataPulse - not FieldForce)
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
                src="/datavision-logo-cropped.png" 
                alt="DataVision International" 
                className="h-8 w-auto"
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
              src="/datavision-logo-cropped.png" 
              alt="DataVision International" 
              className="h-10 w-auto"
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

export default Navbar;
