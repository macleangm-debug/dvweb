import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Menu, X } from 'lucide-react';

// BioSign Product Navigation Component
const BioSignNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/solutions/biosign', label: 'Overview' },
    { path: '/solutions/biosign/features', label: 'Features' },
    { path: '/solutions/biosign/docs', label: 'Documentation' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* DataVision logo - links to home */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white rounded px-2 py-1">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-6 w-auto"
              />
            </div>
          </Link>

          {/* Product Name */}
          <Link to="/solutions/biosign" className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-white">BioSign SDK</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  isActive(link.path) 
                    ? 'text-cyan-400 bg-cyan-400/10' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href="#use-cases" className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">Use Cases</a>
          </div>

          {/* Auth Buttons & Mobile Menu */}
          <div className="flex items-center gap-3">
            <Link 
              to="/solutions/biosign/demo"
              className={`hidden sm:flex px-4 py-2 text-sm font-medium rounded-lg transition-all items-center gap-2 ${
                isActive('/solutions/biosign/demo')
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500'
              }`}
            >
              Request Demo
            </Link>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    isActive(link.path)
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/solutions/biosign/demo" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-cyan-400 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all"
              >
                Request Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default BioSignNavbar;
