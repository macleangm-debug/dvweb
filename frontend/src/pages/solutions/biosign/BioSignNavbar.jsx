import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useState } from "react";

const BioSignNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5" data-testid="biosign-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* DataVision Logo - Back to main site (no arrow, just logo) */}
          <Link to="/" className="flex items-center gap-2" data-testid="datavision-link">
            <div className="bg-white rounded px-2 py-1">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-6 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/solutions/biosign"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Overview
            </Link>
            <Link
              to="/solutions/biosign/features"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Features
            </Link>
            <Link
              to="/solutions/biosign/docs"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              Documentation
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/solutions/biosign/demo">
              <Button 
                size="sm" 
                className="bg-[#00FF94] text-black hover:bg-[#00E085] font-semibold shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                data-testid="request-demo-btn"
              >
                Request Demo
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/5 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5" data-testid="mobile-menu">
            <div className="flex flex-col gap-1">
              <Link
                to="/solutions/biosign"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Overview
              </Link>
              <Link
                to="/solutions/biosign/features"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/solutions/biosign/docs"
                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link to="/solutions/biosign/demo" className="mt-4" onClick={() => setMobileMenuOpen(false)}>
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
