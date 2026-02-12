import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Linkedin, ExternalLink,
  Globe, BarChart3, Target, Users, PieChart,
  Sprout, BookOpen, Heart, Droplets, Building2,
  Smartphone, TrendingUp, GraduationCap, Layers, Activity
} from 'lucide-react';

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
    { name: 'FieldForce', path: '/solutions/fieldforce' },
    { name: 'DataPulse', path: '/solutions/datapulse' },
    { name: 'DataViz Studio', path: '/solutions/dataviz-studio' },
    { name: 'M&E Tracker', path: '/solutions/me-tracker' },
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
    <footer className="bg-[#0a1628] text-white relative noise-overlay border-t-4 border-[#e63946]" data-testid="footer">
      <div className="container mx-auto px-6 lg:px-12 pt-60 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand - Takes 2 columns on large screens */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="mb-6">
              <div className="bg-white inline-block rounded px-3 py-2">
                <img 
                  src="/datavision-logo-cropped.png" 
                  alt="DataVision International" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
            <p className="text-white/70 mb-6 max-w-md text-sm leading-relaxed">
              A trusted global partner in research, data analytics, and development consulting. Over 25 years of experience 
              delivering data-driven insights across Africa and beyond.
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[#e63946] transition-colors" data-testid="footer-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            
            {/* Contact Info */}
            <div className="mt-6 space-y-3 text-sm text-white/70">
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
            Excellence in Data & Development Since 1998
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==================== PAGES ====================


export default Footer;
