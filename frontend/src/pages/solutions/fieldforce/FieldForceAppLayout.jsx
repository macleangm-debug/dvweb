import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  LayoutDashboard, 
  FolderOpen, 
  ClipboardList, 
  FileText, 
  Users, 
  Map, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  Upload,
  Bell
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api/fieldforce`;

// Product Navbar for FieldForce - Similar to Survey360
export const FieldForceProductNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('fieldforce_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fieldforce_token');
    localStorage.removeItem('fieldforce_user');
    navigate('/solutions/fieldforce');
  };

  const navItems = [
    { name: 'Dashboard', path: '/solutions/fieldforce/app/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/solutions/fieldforce/app/projects', icon: FolderOpen },
    { name: 'Forms', path: '/solutions/fieldforce/app/forms', icon: ClipboardList },
    { name: 'Submissions', path: '/solutions/fieldforce/app/submissions', icon: FileText },
    { name: 'Map', path: '/solutions/fieldforce/app/map', icon: Map },
    { name: 'Team', path: '/solutions/fieldforce/app/team', icon: Users },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="bg-[#0a1628] border-b border-white/10 sticky top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link to="/solutions/fieldforce/app/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-white font-semibold hidden sm:block">FieldForce</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/solutions/fieldforce/app/settings"
              className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5"
            >
              <Settings className="w-5 h-5" />
            </Link>
            
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                  <span className="text-teal-400 text-sm font-medium">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/60 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// App Layout wrapper for FieldForce pages
export const FieldForceAppLayout = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('fieldforce_token');
    const storedUser = localStorage.getItem('fieldforce_user');
    
    if (!token) {
      navigate('/solutions/fieldforce/app/login');
      return;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <FieldForceProductNavbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default FieldForceAppLayout;
