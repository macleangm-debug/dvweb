import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";

const BioSignNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/solutions/biosign", label: "Overview" },
    { path: "/solutions/biosign/features", label: "Features" },
    { path: "/solutions/biosign/docs", label: "Documentation" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5" data-testid="biosign-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* DataVision Logo - Back to main site */}
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors" data-testid="datavision-link">
            <ArrowLeft className="w-4 h-4" />
            <div className="bg-white rounded px-1.5 py-0.5">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-5 w-auto"
              />
            </div>
          </Link>

          {/* BioSign Logo */}
          <Link to="/solutions/biosign" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 rounded-lg bg-[#00FF94]/10 border border-[#00FF94]/30 flex items-center justify-center">
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
                data-testid={`nav-${link.label.toLowerCase()}`}
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
                className="bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                data-testid="get-started-btn"
              >
                Request Demo
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
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to DataVision
              </Link>
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
                <Button className="w-full bg-[#00FF94] text-black hover:bg-[#00E085]" size="sm">
                  Request Demo
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
