import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";
import './biosign.css';

const BioSignNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/solutions/biosign", label: "Overview" },
    { path: "/solutions/biosign/features", label: "Features" },
    { path: "/solutions/biosign/docs", label: "Documentation" },
    { path: "/solutions/biosign/demo", label: "Request Demo" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 biosign-glass border-b border-white/5" data-testid="biosign-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 rounded-lg bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center biosign-shield-animate">
              <Shield className="w-6 h-6 text-[#00FF94]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">BioSign SDK</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-[#00FF94] bg-[#00FF94]/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                data-testid={`nav-${link.path.split('/').pop()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/solutions/biosign/demo">
              <Button 
                size="sm" 
                className="biosign-glow-green bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold"
                data-testid="get-started-btn"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/5 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/5" data-testid="mobile-menu">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-[#00FF94] bg-[#00FF94]/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/solutions/biosign/demo" className="mt-4">
                <Button className="w-full biosign-glow-green bg-[#00FF94] text-black hover:bg-[#00E085]" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BioSignNavbar;
