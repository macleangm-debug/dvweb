/**
 * DataVision International - Careers Page
 * Main careers section with dropdown navigation and tab-based content
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Heart, Briefcase, Target, GraduationCap, 
  Star, Users, Smile, ChevronDown
} from 'lucide-react';

// Import all components and data from careers folder
import {
  openPositions,
  departments,
  teamMembers,
  benefits,
  careerNavItems,
  OverviewTab,
  WhyUsTab,
  JobsTab,
  ProcessTab,
  StudentsTab,
  LifeTab,
  ExpertsTab,
  RegisterTab
} from '../components/careers';

// Icon mapping for navigation
const iconMap = {
  Building2, Heart, Briefcase, Target, GraduationCap, Star, Users, Smile
};

const CareersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [expandedJob, setExpandedJob] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine which dropdown contains the active tab
  const getActiveDropdown = () => {
    for (const nav of careerNavItems) {
      if (nav.type === 'dropdown') {
        if (nav.items.some(item => item.id === activeTab)) {
          return nav.id;
        }
      }
    }
    return null;
  };

  const activeDropdownId = getActiveDropdown();

  // Filter jobs based on search and department
  const filteredJobs = openPositions.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  // Get icon component for navigation items
  const getNavIcon = (iconName) => {
    const icons = { Building2, Heart, Briefcase, Target, GraduationCap, Star, Users, Smile };
    return icons[iconName] || Building2;
  };

  return (
    <div className="pt-20 bg-white">
      {/* Careers Navigation Bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            {/* Careers Branding */}
            <div className="hidden md:flex items-center gap-3 py-4">
              <span className="text-sm font-semibold text-[#e63946] uppercase tracking-wider">Careers</span>
              <div className="h-4 w-px bg-[#e2e8f0]"></div>
              <span className="text-sm text-[#64748b]">Join Our Team</span>
            </div>
            
            {/* Tab Navigation with Dropdowns */}
            <nav ref={dropdownRef} className="flex items-center gap-1 py-1" data-testid="careers-nav">
              {careerNavItems.map((navItem) => (
                navItem.type === 'single' ? (
                  // Single item - Overview
                  <button
                    key={navItem.id}
                    onClick={() => setActiveTab(navItem.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                      activeTab === navItem.id
                        ? 'text-[#e63946] border-[#e63946]'
                        : 'text-[#64748b] border-transparent hover:text-[#0a1628] hover:border-[#e2e8f0]'
                    }`}
                    data-testid={`careers-tab-${navItem.id}`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{navItem.label}</span>
                  </button>
                ) : (
                  // Dropdown item
                  <div key={navItem.id} className="relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === navItem.id ? null : navItem.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                        activeDropdownId === navItem.id
                          ? 'text-[#e63946] border-[#e63946]'
                          : 'text-[#64748b] border-transparent hover:text-[#0a1628] hover:border-[#e2e8f0]'
                      }`}
                      data-testid={`careers-dropdown-${navItem.id}`}
                    >
                      {navItem.id === 'culture' ? <Heart className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      <span className="hidden sm:inline">{navItem.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === navItem.id ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openDropdown === navItem.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-[#e2e8f0] py-2 min-w-[240px] z-50"
                        >
                          {navItem.items.map((item) => {
                            const ItemIcon = item.id === 'why-us' ? Heart : 
                                           item.id === 'life' ? Smile :
                                           item.id === 'process' ? Target :
                                           item.id === 'jobs' ? Briefcase :
                                           item.id === 'students' ? GraduationCap :
                                           item.id === 'experts' ? Star : Users;
                            return (
                              <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-[#f8fafc] ${
                                  activeTab === item.id ? 'bg-[#e63946]/5' : ''
                                }`}
                                data-testid={`careers-tab-${item.id}`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  activeTab === item.id ? 'bg-[#e63946]/10 text-[#e63946]' : 'bg-[#f8fafc] text-[#64748b]'
                                }`}>
                                  <ItemIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className={`text-sm font-medium ${activeTab === item.id ? 'text-[#e63946]' : 'text-[#0a1628]'}`}>
                                    {item.label}
                                  </div>
                                  <div className="text-xs text-[#64748b]">{item.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && <OverviewTab key="overview" setActiveTab={setActiveTab} />}
        {activeTab === 'why-us' && <WhyUsTab key="why-us" />}
        {activeTab === 'jobs' && (
          <JobsTab 
            key="jobs"
            jobs={filteredJobs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            expandedJob={expandedJob}
            setExpandedJob={setExpandedJob}
            departments={departments}
          />
        )}
        {activeTab === 'experts' && <ExpertsTab key="experts" setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <RegisterTab key="register" />}
        {activeTab === 'process' && <ProcessTab key="process" />}
        {activeTab === 'students' && <StudentsTab key="students" />}
        {activeTab === 'life' && <LifeTab key="life" teamMembers={teamMembers} benefits={benefits} />}
      </AnimatePresence>
    </div>
  );
};

export default CareersPage;
