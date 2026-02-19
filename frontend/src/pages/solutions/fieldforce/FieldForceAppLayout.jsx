/**
 * FieldForce - Canva-inspired Layout (Based on GitHub Original)
 * Rail + Expandable Panel navigation system
 */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  House,
  Folder,
  Database,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  FileText,
  Layout,
  ClipboardList,
  Briefcase,
  Table2,
  Download,
  Smartphone,
  Users,
  Shield,
  Languages,
  BarChart3,
  Plus,
  Zap
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api/fieldforce`;

// FieldForce Navigation - Canva-style with paths updated for DataVision
const NAVIGATION = [
  {
    id: 'home',
    label: 'Home',
    icon: House,
    path: '/solutions/fieldforce/app/dashboard',
    items: []
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Folder,
    items: [
      { label: 'All Projects', path: '/solutions/fieldforce/app/projects', icon: Folder },
      { label: 'Forms', path: '/solutions/fieldforce/app/forms', icon: FileText },
      { label: 'Templates', path: '/solutions/fieldforce/app/templates', icon: Layout },
      { label: 'Submissions', path: '/solutions/fieldforce/app/submissions', icon: ClipboardList }
    ]
  },
  {
    id: 'data',
    label: 'Data',
    icon: Database,
    items: [
      { label: 'Cases', path: '/solutions/fieldforce/app/cases', icon: Briefcase },
      { label: 'Datasets', path: '/solutions/fieldforce/app/datasets', icon: Table2 },
      { label: 'Exports', path: '/solutions/fieldforce/app/exports', icon: Download }
    ]
  },
  {
    id: 'field',
    label: 'Field',
    icon: MapPin,
    items: [
      { label: 'GPS Map', path: '/solutions/fieldforce/app/map', icon: MapPin },
      { label: 'Devices', path: '/solutions/fieldforce/app/devices', icon: Smartphone },
      { label: 'Quality', path: '/solutions/fieldforce/app/quality', icon: Zap },
      { label: 'Analytics', path: '/solutions/fieldforce/app/analytics', icon: BarChart3 }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    items: [
      { label: 'Team', path: '/solutions/fieldforce/app/team', icon: Users },
      { label: 'Roles', path: '/solutions/fieldforce/app/rbac', icon: Shield },
      { label: 'Translations', path: '/solutions/fieldforce/app/translations', icon: Languages },
      { label: 'Billing', path: '/solutions/fieldforce/app/billing', icon: CreditCard },
      { label: 'Settings', path: '/solutions/fieldforce/app/settings', icon: Settings }
    ]
  }
];

// Find active group based on current path
function findActiveGroup(pathname) {
  for (const group of NAVIGATION) {
    if (group.path === pathname) return group.id;
    for (const item of group.items || []) {
      if (pathname.startsWith(item.path)) return group.id;
    }
  }
  return 'home';
}

export const FieldForceCanvaLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [activeGroup, setActiveGroup] = useState('home');
  const [panelOpen, setPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('fieldforce_token');
    const storedUser = localStorage.getItem('fieldforce_user');
    
    if (!token) {
      navigate('/solutions/fieldforce/app/login');
      return;
    }

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.organization_id) {
          // Fetch org details
          fetchOrganization(userData.organization_id, token);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [navigate]);

  const fetchOrganization = async (orgId, token) => {
    try {
      const res = await axios.get(`${API}/organizations/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentOrg(res.data);
    } catch (e) {
      console.log('No org found');
    }
  };

  // Update active group based on route
  useEffect(() => {
    const group = findActiveGroup(location.pathname);
    setActiveGroup(group);
  }, [location.pathname]);

  const currentGroup = NAVIGATION.find(g => g.id === activeGroup);
  const showPanel = currentGroup?.items?.length > 0;

  const handleLogout = () => {
    localStorage.removeItem('fieldforce_token');
    localStorage.removeItem('fieldforce_user');
    navigate('/solutions/fieldforce/app/login');
  };

  const handleRailClick = (group) => {
    setActiveGroup(group.id);
    if (group.path) {
      navigate(group.path);
    } else if (group.items?.length > 0) {
      setPanelOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-[#0a1628]">
      {/* Rail - Thin icon sidebar with labels */}
      <aside className="hidden lg:flex flex-col items-center w-[80px] bg-[#0f172a] border-r border-white/10 py-4">
        {/* Logo - FieldForce */}
        <Link to="/solutions/fieldforce/app/dashboard" className="mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </Link>

        {/* Online Status Indicator */}
        <div className="w-3 h-3 rounded-full bg-green-500 mb-4" title="Online" />

        {/* Create Button */}
        <button
          onClick={() => navigate('/solutions/fieldforce/app/forms/new')}
          className="w-14 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 mb-4 flex flex-col items-center justify-center gap-0.5 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[9px] font-medium">Create</span>
        </button>

        {/* Navigation Rail Items with Labels */}
        <nav className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {NAVIGATION.map((group) => {
            const Icon = group.icon;
            const isActive = activeGroup === group.id;
            
            return (
              <button
                key={group.id}
                onClick={() => handleRailClick(group)}
                className={`w-16 py-2 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {group.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section - Profile */}
        <div className="mt-auto flex flex-col items-center gap-2">
          <button 
            onClick={handleLogout}
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/60 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
            <span className="text-blue-400 text-sm font-medium">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </aside>

      {/* Expandable Panel */}
      <AnimatePresence mode="wait">
        {showPanel && panelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden lg:block bg-[#0f172a] border-r border-white/10 overflow-hidden"
          >
            <div className="w-[200px] h-full flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-white">{currentGroup?.label}</h2>
              </div>

              {/* Panel Items */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {currentGroup?.items?.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                  location.pathname.startsWith(item.path + '/');
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        isActive 
                          ? 'bg-blue-500/20 text-blue-400 font-medium' 
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Organization Selector */}
              {currentOrg && (
                <div className="p-3 border-t border-white/10">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-medium text-xs">
                      {currentOrg?.name?.charAt(0) || 'O'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {currentOrg?.name || 'My Org'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-[#0f172a] border-b border-white/10 flex items-center px-4 lg:px-6 gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/60"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Panel Toggle (Desktop) */}
          {showPanel && (
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-white/5 text-white/50"
            >
              {panelOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 border-0 rounded-lg focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20 transition-all text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* Desktop Profile */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-white/10">
              <span className="text-sm text-white/60">{user?.name || 'Demo User'}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a1628]">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0f172a] z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-white">FieldForce</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-white/60">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3">
                {NAVIGATION.map((group) => {
                  const Icon = group.icon;
                  const isActive = activeGroup === group.id;
                  
                  return (
                    <div key={group.id} className="mb-4">
                      <button
                        onClick={() => {
                          if (group.path) {
                            navigate(group.path);
                            setMobileMenuOpen(false);
                          } else {
                            setActiveGroup(isActive ? '' : group.id);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive ? 'bg-blue-500/20 text-blue-400' : 'text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {group.label}
                      </button>
                      
                      {isActive && group.items?.length > 0 && (
                        <div className="mt-1 ml-4 pl-4 border-l border-white/20 space-y-1">
                          {group.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`block px-3 py-2 rounded-lg text-sm ${
                                location.pathname === item.path
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'text-white/60 hover:bg-white/5'
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Mobile User */}
              <div className="p-4 border-t border-white/10 mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <span className="text-blue-400 font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white">{user?.name}</p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FieldForceCanvaLayout;
