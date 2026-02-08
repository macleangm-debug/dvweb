import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Briefcase, Users, GraduationCap, Heart, Globe, 
  MapPin, Clock, Building2, ChevronRight, Search,
  Star, Award, TrendingUp, BookOpen, Lightbulb, Target,
  CheckCircle2, Play, Quote, Calendar, DollarSign,
  Smile, Coffee, Zap, Brain, BarChart3, Plane, ChevronDown
} from 'lucide-react';
import ExpertRegistrationForm from '../components/ExpertRegistrationForm';

// ==================== CAREERS DATA ====================
const openPositions = [
  {
    id: 1,
    title: 'Senior Research Analyst',
    department: 'Research & Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '5+ years',
    posted: '2 days ago',
    description: 'Lead complex research projects across multiple sectors, managing teams of analysts and ensuring delivery of high-quality insights.',
    requirements: ['Masters degree in Statistics, Economics, or related field', '5+ years in research/consulting', 'Advanced data analysis skills', 'Team leadership experience'],
    featured: true
  },
  {
    id: 2,
    title: 'Data Scientist',
    department: 'Data Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '3+ years',
    posted: '1 week ago',
    description: 'Apply machine learning and statistical modeling to solve complex development challenges across Africa.',
    requirements: ['Masters/PhD in Data Science, Statistics, or related field', 'Proficiency in Python, R', 'Experience with ML frameworks', 'Strong communication skills'],
    featured: true
  },
  {
    id: 3,
    title: 'M&E Specialist',
    department: 'Monitoring & Evaluation',
    location: 'Dar es Salaam / Remote',
    type: 'Full-time',
    experience: '4+ years',
    posted: '3 days ago',
    description: 'Design and implement M&E frameworks for donor-funded programs across East Africa.',
    requirements: ['Bachelors degree minimum', '4+ years M&E experience', 'Knowledge of donor requirements', 'Field research experience'],
    featured: false
  },
  {
    id: 4,
    title: 'Field Operations Manager',
    department: 'Operations',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '5+ years',
    posted: '5 days ago',
    description: 'Oversee large-scale data collection operations, managing field teams across Tanzania.',
    requirements: ['Bachelors degree', '5+ years field operations experience', 'Team management skills', 'Valid drivers license'],
    featured: false
  },
  {
    id: 5,
    title: 'Graduate Research Associate',
    department: 'Research & Analytics',
    location: 'Dar es Salaam',
    type: 'Full-time',
    experience: '0-2 years',
    posted: '1 week ago',
    description: 'Join our graduate program and develop your research skills while working on impactful projects.',
    requirements: ['Recent graduate (within 2 years)', 'Strong academic record', 'Analytical mindset', 'Fluent in English and Swahili'],
    featured: false
  },
  {
    id: 6,
    title: 'Software Developer',
    department: 'Technology',
    location: 'Dar es Salaam / Remote',
    type: 'Full-time',
    experience: '3+ years',
    posted: '4 days ago',
    description: 'Build and maintain our suite of data collection and analytics software products.',
    requirements: ['Bachelors in Computer Science or related', '3+ years development experience', 'React, Python, Mobile development', 'Experience with databases'],
    featured: true
  }
];

const departments = [
  { name: 'All Departments', count: openPositions.length },
  { name: 'Research & Analytics', count: 2 },
  { name: 'Data Analytics', count: 1 },
  { name: 'Monitoring & Evaluation', count: 1 },
  { name: 'Operations', count: 1 },
  { name: 'Technology', count: 1 }
];

const teamMembers = [
  {
    name: 'Dr. Sarah Mwangi',
    role: 'Director of Research',
    quote: 'At DataVision, every project is an opportunity to create real impact. Our work directly influences policies that affect millions of lives.',
    years: 8
  },
  {
    name: 'James Kimathi',
    role: 'Senior Data Scientist',
    quote: 'The diversity of projects keeps me challenged and growing. One month Im analyzing agricultural data, the next Im building healthcare dashboards.',
    years: 4
  },
  {
    name: 'Amina Hassan',
    role: 'M&E Specialist',
    quote: 'What I love most is the mentorship culture. Senior colleagues genuinely invest in your development.',
    years: 3
  }
];

const benefits = [
  { icon: DollarSign, title: 'Competitive Compensation', desc: 'Market-leading salaries with performance bonuses' },
  { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive medical coverage for you and family' },
  { icon: GraduationCap, title: 'Learning & Development', desc: 'Annual training budget and conference attendance' },
  { icon: Plane, title: 'Travel Opportunities', desc: 'Work across East Africa on diverse projects' },
  { icon: Clock, title: 'Flexible Work', desc: 'Hybrid arrangements and flexible hours' },
  { icon: Coffee, title: 'Work-Life Balance', desc: 'Generous leave policy and wellness programs' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Clear progression paths and promotions' },
  { icon: Users, title: 'Collaborative Culture', desc: 'Supportive team environment and mentorship' }
];

// Expert sectors for consultant network
const expertSectors = [
  { 
    id: 'agriculture',
    name: 'Agriculture & Food Security',
    icon: '🌾',
    description: 'Agricultural economics, value chain analysis, food systems, climate-smart agriculture',
    skills: ['Agricultural surveys', 'Value chain analysis', 'Food security assessments', 'Agri-finance research']
  },
  { 
    id: 'health',
    name: 'Health & Pharmaceuticals',
    icon: '🏥',
    description: 'Public health, healthcare systems, pharmaceutical research, health economics',
    skills: ['Health facility assessments', 'Disease surveillance', 'Health economics', 'Clinical research']
  },
  { 
    id: 'education',
    name: 'Education & Training',
    icon: '📚',
    description: 'Education policy, curriculum development, learning outcomes, EdTech',
    skills: ['Learning assessments', 'Teacher training evaluation', 'Education policy analysis', 'School surveys']
  },
  { 
    id: 'wash',
    name: 'Water, Sanitation & Hygiene',
    icon: '💧',
    description: 'WASH infrastructure, water quality, sanitation programs, hygiene behavior',
    skills: ['WASH surveys', 'Water quality testing', 'Sanitation mapping', 'Behavior change research']
  },
  { 
    id: 'governance',
    name: 'Governance & Public Policy',
    icon: '🏛️',
    description: 'Public administration, policy analysis, institutional assessments, governance reforms',
    skills: ['Policy analysis', 'Institutional assessments', 'Public expenditure reviews', 'Governance indicators']
  },
  { 
    id: 'energy',
    name: 'Energy & Environment',
    icon: '⚡',
    description: 'Renewable energy, environmental impact, climate change, natural resources',
    skills: ['Energy access surveys', 'Environmental assessments', 'Climate vulnerability', 'Resource mapping']
  },
  { 
    id: 'finance',
    name: 'Financial Services & Inclusion',
    icon: '💰',
    description: 'Financial inclusion, microfinance, banking, fintech, economic development',
    skills: ['Financial diaries', 'Market research', 'Impact evaluation', 'Fintech assessments']
  },
  { 
    id: 'gender',
    name: 'Gender & Social Development',
    icon: '⚖️',
    description: 'Gender analysis, social protection, youth development, vulnerable populations',
    skills: ['Gender assessments', 'Social protection surveys', 'Youth studies', 'Inclusion research']
  },
  { 
    id: 'data',
    name: 'Data Science & Analytics',
    icon: '📊',
    description: 'Statistical modeling, machine learning, data visualization, big data',
    skills: ['Statistical analysis', 'Machine learning', 'GIS & mapping', 'Dashboard development']
  },
  { 
    id: 'me',
    name: 'Monitoring & Evaluation',
    icon: '📈',
    description: 'M&E frameworks, impact evaluation, theory of change, results measurement',
    skills: ['M&E design', 'Impact evaluation', 'Logical frameworks', 'Results-based management']
  }
];

// Grouped navigation structure for cleaner UX
const careerNavItems = [
  { id: 'overview', label: 'Overview', icon: Building2, type: 'single' },
  { 
    id: 'culture', 
    label: 'Our Culture', 
    icon: Heart, 
    type: 'dropdown',
    items: [
      { id: 'why-us', label: 'Why Work Here', icon: Heart, desc: 'Our mission and values' },
      { id: 'life', label: 'Life at DataVision', icon: Smile, desc: 'Team culture and benefits' },
      { id: 'process', label: 'How We Hire', icon: Target, desc: 'Our hiring process' }
    ]
  },
  { 
    id: 'opportunities', 
    label: 'Find Your Role', 
    icon: Briefcase, 
    type: 'dropdown',
    items: [
      { id: 'jobs', label: 'Open Positions', icon: Briefcase, desc: 'Current job openings' },
      { id: 'students', label: 'Students & Graduates', icon: GraduationCap, desc: 'Early career programs' },
      { id: 'experts', label: 'Expert Network', icon: Star, desc: 'Join as a consultant' },
      { id: 'register', label: 'Register as Expert', icon: Users, desc: 'Submit your profile' }
    ]
  }
];

// Flat list of all valid tab IDs for routing
const validTabIds = ['overview', 'why-us', 'life', 'process', 'jobs', 'students', 'experts', 'register'];

// ==================== CAREERS PAGE ====================
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

  const filteredJobs = openPositions.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

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
                    <navItem.icon className="w-4 h-4" />
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
                      <navItem.icon className="w-4 h-4" />
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
                          {navItem.items.map((item) => (
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
                                <item.icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className={`text-sm font-medium ${activeTab === item.id ? 'text-[#e63946]' : 'text-[#0a1628]'}`}>
                                  {item.label}
                                </div>
                                <div className="text-xs text-[#64748b]">{item.desc}</div>
                              </div>
                            </button>
                          ))}
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

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ setActiveTab }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Hero Section */}
    <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, #e63946 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, #2a9d8f 0%, transparent 40%)`
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#e63946] px-4 py-2 rounded-full mb-6">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-semibold">Join Our Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Big Challenges.<br />
              Bigger Impact.
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Join Africa's leading research consultancy and shape the future of 
              data-driven development. Your work here will influence policies and 
              programs affecting millions of lives.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('jobs')}
                className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                data-testid="search-jobs-btn"
              >
                <Search className="w-4 h-4" />
                Search Jobs
              </button>
              <button 
                onClick={() => setActiveTab('why-us')}
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
              >
                <Play className="w-4 h-4" />
                Why DataVision
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Floating stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '200+', label: 'Team Members', icon: Users },
                  { value: '25+', label: 'Years of Excellence', icon: Award },
                  { value: '15+', label: 'Countries Served', icon: Globe },
                  { value: '95%', label: 'Employee Retention', icon: Heart }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all"
                  >
                    <stat.icon className="w-8 h-8 mb-2 text-[#e63946]" />
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Featured Jobs Preview */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-2">Opportunities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">Featured Positions</h2>
          </div>
          <button 
            onClick={() => setActiveTab('jobs')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
          >
            View All Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openPositions.filter(j => j.featured).map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] hover:shadow-lg hover:border-[#e63946] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-[#e63946]/10 text-[#e63946] text-xs font-semibold rounded-full">
                  {job.department}
                </span>
                <Star className="w-5 h-5 text-[#f59e0b]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-2 group-hover:text-[#e63946] transition-colors">
                {job.title}
              </h3>
              <p className="text-[#64748b] text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-3 text-sm text-[#64748b] mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {job.type}
                </span>
              </div>
              <button 
                onClick={() => setActiveTab('jobs')}
                className="text-[#e63946] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Join Us Preview */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Why DataVision</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
              Build Your Career While Building Africa's Future
            </h2>
            <p className="text-[#64748b] mb-8 leading-relaxed">
              At DataVision, you won't just have a job—you'll have a mission. Our work 
              directly influences development programs and policies across Tanzania and 
              East Africa. Every dataset tells a story, and you'll help write it.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Globe, text: 'Work across 15+ countries' },
                { icon: Brain, text: 'Continuous learning culture' },
                { icon: Users, text: 'Diverse, inclusive team' },
                { icon: TrendingUp, text: 'Clear growth pathways' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e63946]/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <span className="text-[#0a1628] text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveTab('why-us')}
              className="inline-flex items-center gap-2 text-[#e63946] font-semibold hover:gap-3 transition-all"
            >
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a1628] rounded-2xl p-8 text-white"
          >
            <Quote className="w-12 h-12 text-[#e63946] mb-6 opacity-50" />
            <p className="text-xl leading-relaxed mb-6 italic">
              "The impact we make here is tangible. When I see a policy change based on 
              our research, or a program improve because of our data—that's what makes 
              this work meaningful."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#e63946] flex items-center justify-center text-xl font-bold">
                SM
              </div>
              <div>
                <p className="font-semibold">Dr. Sarah Mwangi</p>
                <p className="text-white/60 text-sm">Director of Research • 8 years at DataVision</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Expert Network Preview */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Expert Network</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
              Are You a Sector Expert?
            </h2>
            <p className="text-[#64748b] mb-6 leading-relaxed">
              We're always looking for experienced consultants to join our network of sector 
              specialists. If you have deep expertise in agriculture, health, education, WASH, 
              or other development sectors, we'd love to hear from you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Flexible, project-based engagements',
                'Competitive daily rates',
                'Work on meaningful development projects',
                'Collaborate with leading organizations'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#64748b]">
                  <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => setActiveTab('experts')}
              className="inline-flex items-center gap-2 bg-[#f59e0b] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
            >
              Join Expert Network <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: '🌾', label: 'Agriculture' },
              { icon: '🏥', label: 'Health' },
              { icon: '📚', label: 'Education' },
              { icon: '💧', label: 'WASH' },
              { icon: '📊', label: 'Data Science' },
              { icon: '📈', label: 'M&E' }
            ].map((sector, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[#e2e8f0] text-center hover:border-[#f59e0b] transition-all">
                <span className="text-3xl mb-2 block">{sector.icon}</span>
                <span className="text-sm font-medium text-[#0a1628]">{sector.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24 bg-[#e63946] text-white">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join a team of passionate researchers, analysts, and technologists 
            working to solve Africa's most pressing challenges through data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveTab('jobs')}
              className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold hover:bg-[#0a1628] hover:text-white transition-all"
            >
              <Search className="w-5 h-5" />
              Browse Opportunities
            </button>
            <button 
              onClick={() => setActiveTab('experts')}
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-[#e63946] transition-all"
            >
              <Star className="w-5 h-5" />
              Expert Network
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  </motion.div>
);

// ==================== WHY US TAB ====================
const WhyUsTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Hero */}
    <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Why Work Here</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            More Than a Job.<br />A Mission.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            At DataVision, your work directly shapes policies and programs that improve 
            lives across Africa. Join us and be part of something bigger.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Impact Section */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Impact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
            Work That Matters
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BarChart3,
              title: 'Shape Policy',
              desc: 'Our research informs government policies, donor strategies, and development programs across 15+ countries.',
              stat: '30+ policies influenced'
            },
            {
              icon: Users,
              title: 'Reach Millions',
              desc: 'Programs designed with our data reach millions of beneficiaries—farmers, students, patients, and communities.',
              stat: '50M+ lives impacted'
            },
            {
              icon: Lightbulb,
              title: 'Drive Innovation',
              desc: 'We pioneer new methodologies in data collection, analytics, and visualization for the African context.',
              stat: '8 software products built'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 bg-[#f8fafc] rounded-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#e63946]/10 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-[#e63946]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">{item.title}</h3>
              <p className="text-[#64748b] mb-4">{item.desc}</p>
              <p className="text-[#e63946] font-bold">{item.stat}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
              What We Stand For
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Excellence', desc: 'We pursue the highest standards in everything we do—from data quality to client delivery.' },
                { title: 'Integrity', desc: 'We maintain unwavering ethical standards and transparency in all our research.' },
                { title: 'Impact', desc: 'We measure success by the real-world change our work creates.' },
                { title: 'Collaboration', desc: 'We believe the best insights come from diverse perspectives working together.' },
                { title: 'Innovation', desc: 'We continuously explore new methods and technologies to solve complex challenges.' }
              ].map((value, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#e63946] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#0a1628] mb-1">{value.title}</h4>
                    <p className="text-[#64748b]">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Our Commitment to You</h3>
            <div className="space-y-4">
              {[
                'Investment in your professional development',
                'Work that has real-world impact',
                'Collaborative and supportive culture',
                'Competitive compensation and benefits',
                'Work-life balance and flexibility',
                'Clear career progression pathways'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#e63946] rounded-full" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Growth Section */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Growth & Development</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
            Invest in Your Future
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: 'Learning Budget', desc: 'Annual allocation for courses, certifications, and conferences' },
            { icon: Users, title: 'Mentorship', desc: 'Paired with senior colleagues for guidance and growth' },
            { icon: Globe, title: 'International Exposure', desc: 'Work with global partners and across countries' },
            { icon: TrendingUp, title: 'Career Paths', desc: 'Defined progression from analyst to director levels' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-[#e2e8f0] rounded-xl hover:border-[#e63946] transition-all"
            >
              <item.icon className="w-10 h-10 text-[#e63946] mb-4" />
              <h3 className="font-bold text-[#0a1628] mb-2">{item.title}</h3>
              <p className="text-[#64748b] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

// ==================== JOBS TAB ====================
const JobsTab = ({ jobs, searchTerm, setSearchTerm, selectedDepartment, setSelectedDepartment, expandedJob, setExpandedJob, departments }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Search Header */}
    <section className="bg-[#0a1628] text-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Open Positions</h1>
        <p className="text-white/70 mb-8 max-w-2xl">
          Find your next opportunity. We're looking for talented individuals who want to 
          make a difference through data-driven research and analytics.
        </p>
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 max-w-3xl">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-[#0a1628] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              data-testid="job-search-input"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-4 bg-white text-[#0a1628] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e63946]"
            data-testid="department-filter"
          >
            {departments.map(dept => (
              <option key={dept.name} value={dept.name}>
                {dept.name} ({dept.count})
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>

    {/* Job Listings */}
    <section className="py-16 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-6 text-[#64748b]">
          Showing {jobs.length} position{jobs.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-lg transition-all"
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#0a1628]">{job.title}</h3>
                      {job.featured && (
                        <span className="px-2 py-1 bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-semibold rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#64748b]">{job.posted}</span>
                    <ChevronRight className={`w-5 h-5 text-[#64748b] transition-transform ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#e2e8f0]"
                  >
                    <div className="p-6 bg-[#f8fafc]">
                      <p className="text-[#64748b] mb-6">{job.description}</p>
                      
                      <h4 className="font-bold text-[#0a1628] mb-3">Requirements</h4>
                      <ul className="space-y-2 mb-6">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-[#64748b]">
                            <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-[#0a1628] transition-all"
                        data-testid={`apply-btn-${job.id}`}
                      >
                        Apply Now <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 text-[#e2e8f0] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0a1628] mb-2">No positions found</h3>
            <p className="text-[#64748b]">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </section>
  </motion.div>
);

// ==================== EXPERTS TAB ====================
const ExpertsTab = ({ setActiveTab }) => {
  const [selectedSector, setSelectedSector] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, #f59e0b 0%, transparent 40%),
                              radial-gradient(circle at 70% 60%, #8b5cf6 0%, transparent 40%)`
          }} />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a1628] px-4 py-2 rounded-full mb-6">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">Expert Network</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our Network of<br />Sector Experts
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Are you a seasoned professional with deep expertise in a specific sector? 
                Join our network of consultants and contribute to impactful projects 
                across Africa on a flexible, project-by-project basis.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setActiveTab('register')}
                  className="inline-flex items-center gap-2 bg-[#f59e0b] text-[#0a1628] px-6 py-3 font-semibold hover:bg-white transition-all"
                  data-testid="register-expert-hero-btn"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />
                  <span>Flexible engagements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />
                  <span>Competitive rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#f59e0b]" />
                  <span>Meaningful work</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { value: '150+', label: 'Active Experts' },
                { value: '50+', label: 'Projects/Year' },
                { value: '10+', label: 'Sectors Covered' },
                { value: '15+', label: 'Countries' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-[#f59e0b]">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#0a1628]">How the Expert Network Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Submit your profile with sector expertise and experience' },
              { step: '02', title: 'Get Matched', desc: 'We match you with projects that fit your skills' },
              { step: '03', title: 'Contribute', desc: 'Work on specific deliverables with our project teams' },
              { step: '04', title: 'Get Paid', desc: 'Receive competitive compensation for your expertise' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-white flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">{item.title}</h3>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Expertise */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-[#f59e0b] font-semibold uppercase tracking-wider mb-2">Areas of Expertise</p>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-4">We're Looking for Experts In</h2>
            <p className="text-[#64748b] max-w-2xl mx-auto">
              Select a sector below to see the types of expertise we're actively seeking for upcoming projects.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {expertSectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => setSelectedSector(selectedSector === sector.id ? null : sector.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedSector === sector.id
                    ? 'border-[#f59e0b] bg-[#f59e0b]/10'
                    : 'border-[#e2e8f0] bg-white hover:border-[#f59e0b]'
                }`}
                data-testid={`sector-${sector.id}`}
              >
                <span className="text-2xl mb-2 block">{sector.icon}</span>
                <h3 className="font-semibold text-[#0a1628] text-sm">{sector.name}</h3>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedSector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden"
              >
                {expertSectors.filter(s => s.id === selectedSector).map(sector => (
                  <div key={sector.id} className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <span className="text-4xl">{sector.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-[#0a1628] mb-2">{sector.name}</h3>
                        <p className="text-[#64748b]">{sector.description}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-[#0a1628] mb-4">Skills We're Looking For:</h4>
                        <div className="space-y-2">
                          {sector.skills.map((skill, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#f59e0b]" />
                              <span className="text-[#64748b]">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#f8fafc] rounded-xl p-6">
                        <h4 className="font-semibold text-[#0a1628] mb-4">Typical Project Types:</h4>
                        <ul className="space-y-2 text-[#64748b] text-sm">
                          <li>• Baseline and endline surveys</li>
                          <li>• Impact evaluations</li>
                          <li>• Sector assessments</li>
                          <li>• Technical advisory</li>
                          <li>• Training and capacity building</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#f59e0b] font-semibold uppercase tracking-wider mb-4">Ideal Candidates</p>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6">
                Who Thrives in Our Expert Network
              </h2>
              <p className="text-[#64748b] mb-8 leading-relaxed">
                Our expert network is designed for experienced professionals who want to 
                contribute their specialized knowledge to meaningful projects without 
                full-time commitments.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Independent Consultants', desc: 'Experienced professionals running their own practice' },
                  { title: 'Academic Researchers', desc: 'University faculty and researchers with sector expertise' },
                  { title: 'Retired Professionals', desc: 'Former industry leaders with decades of experience' },
                  { title: 'Part-time Contributors', desc: 'Professionals seeking project-based work alongside other roles' },
                  { title: 'Regional Experts', desc: 'Professionals with deep knowledge of specific regions or countries' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-[#0a1628]">{item.title}:</span>
                      <span className="text-[#64748b]"> {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Minimum Requirements</h3>
              <div className="space-y-4">
                {[
                  '7+ years of professional experience in your sector',
                  'Masters degree or equivalent professional qualification',
                  'Track record of delivering high-quality work',
                  'Strong written and verbal communication skills',
                  'Ability to work independently and meet deadlines',
                  'Relevant regional or country experience preferred'
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#f59e0b] rounded-full" />
                    <span className="text-white/80">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Opportunities */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-[#f59e0b] font-semibold uppercase tracking-wider mb-2">Active Opportunities</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Current Expert Needs</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Agricultural Economist',
                sector: 'Agriculture & Food Security',
                location: 'Tanzania / Remote',
                duration: '3-6 months',
                desc: 'Support value chain analysis for horticulture sector development project.'
              },
              { 
                title: 'Health Systems Specialist',
                sector: 'Health & Pharmaceuticals',
                location: 'East Africa',
                duration: '4 months',
                desc: 'Lead health facility assessment across multiple regions.'
              },
              { 
                title: 'M&E Expert',
                sector: 'Monitoring & Evaluation',
                location: 'Remote',
                duration: '2 months',
                desc: 'Design M&E framework for large-scale education program.'
              },
              { 
                title: 'WASH Engineer',
                sector: 'Water, Sanitation & Hygiene',
                location: 'Tanzania',
                duration: '3 months',
                desc: 'Technical assessment of rural water infrastructure.'
              },
              { 
                title: 'Gender Specialist',
                sector: 'Gender & Social Development',
                location: 'East Africa',
                duration: '2 months',
                desc: 'Gender analysis for agricultural development program.'
              },
              { 
                title: 'Data Scientist',
                sector: 'Data Science & Analytics',
                location: 'Remote',
                duration: 'Ongoing',
                desc: 'Machine learning support for survey data analysis.'
              }
            ].map((opp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-[#e2e8f0] hover:shadow-lg hover:border-[#f59e0b] transition-all"
              >
                <span className="px-3 py-1 bg-[#f59e0b]/10 text-[#f59e0b] text-xs font-semibold rounded-full">
                  {opp.sector}
                </span>
                <h3 className="text-xl font-bold text-[#0a1628] mt-4 mb-2">{opp.title}</h3>
                <p className="text-[#64748b] text-sm mb-4">{opp.desc}</p>
                <div className="flex flex-wrap gap-3 text-sm text-[#64748b] mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {opp.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {opp.duration}
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="text-[#f59e0b] font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Express Interest <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#f59e0b] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Share Your Expertise?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Join our network of 150+ sector experts and contribute to projects that 
            shape development outcomes across Africa.
          </p>
          <button
            onClick={() => setActiveTab('register')}
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
            data-testid="register-expert-btn"
          >
            Register as an Expert <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};

// ==================== REGISTER TAB ====================
const RegisterTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="py-12 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">Expert Registration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
            Join Our Expert Network
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Complete the form below to register as a sector expert. Our team will review 
            your profile and match you with relevant project opportunities.
          </p>
        </div>
        <ExpertRegistrationForm />
      </div>
    </section>
  </motion.div>
);

// ==================== PROCESS TAB ====================
const ProcessTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">How We Hire</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Hiring Process</h1>
          <p className="text-xl text-white/80">
            We've designed our process to be transparent, fair, and efficient. Here's what to expect 
            when you apply to join DataVision.
          </p>
        </div>
      </div>
    </section>

    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {[
            {
              step: 1,
              title: 'Application Review',
              duration: '1-2 weeks',
              desc: 'Submit your CV and cover letter through our portal. Our team reviews every application carefully, looking for alignment with our values and the role requirements.',
              tips: ['Tailor your CV to the specific role', 'Highlight relevant projects and impact', 'Include a thoughtful cover letter']
            },
            {
              step: 2,
              title: 'Initial Screening',
              duration: '30-45 minutes',
              desc: 'A phone or video call with our HR team to discuss your background, motivations, and answer any questions about the role and DataVision.',
              tips: ['Research DataVision thoroughly', 'Prepare questions about the role', 'Be ready to discuss your career goals']
            },
            {
              step: 3,
              title: 'Technical Assessment',
              duration: 'Varies by role',
              desc: 'Depending on the position, you may complete a case study, data analysis exercise, or technical task that demonstrates your skills.',
              tips: ['Take time to understand the problem', 'Show your working and reasoning', 'Ask clarifying questions if needed']
            },
            {
              step: 4,
              title: 'Team Interviews',
              duration: '2-3 hours',
              desc: 'Meet with potential colleagues and leadership. This is your chance to learn about day-to-day work and for us to assess cultural fit.',
              tips: ['Prepare examples using STAR method', 'Show curiosity and ask insightful questions', 'Be authentic and yourself']
            },
            {
              step: 5,
              title: 'Offer & Onboarding',
              duration: '1-2 weeks',
              desc: 'Successful candidates receive a detailed offer. Our comprehensive onboarding ensures you are set up for success from day one.',
              tips: ['Review the offer carefully', 'Ask about growth opportunities', 'Prepare for an exciting journey!']
            }
          ].map((stage, index) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12 pb-12 border-l-2 border-[#e2e8f0] last:border-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-[#e63946] text-white flex items-center justify-center font-bold">
                {stage.step}
              </div>
              <div className="ml-8">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#0a1628]">{stage.title}</h3>
                  <span className="px-3 py-1 bg-[#f8fafc] text-[#64748b] text-sm rounded-full">
                    {stage.duration}
                  </span>
                </div>
                <p className="text-[#64748b] mb-4">{stage.desc}</p>
                <div className="bg-[#f8fafc] rounded-lg p-4">
                  <h4 className="font-semibold text-[#0a1628] mb-2 text-sm">Tips for Success:</h4>
                  <ul className="space-y-1">
                    {stage.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#64748b] text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ Section */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0a1628]">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'How long does the hiring process typically take?', a: 'From application to offer, our process typically takes 3-4 weeks depending on the role and availability of all parties.' },
            { q: 'Can I apply for multiple positions?', a: 'Yes, you can apply for multiple roles that match your skills and interests. We review each application independently.' },
            { q: 'Do you offer remote work options?', a: 'We offer hybrid arrangements for many roles. Some positions may require full-time presence in Dar es Salaam.' },
            { q: 'What should I include in my cover letter?', a: 'Focus on why you\'re interested in DataVision specifically, how your experience aligns with the role, and what unique perspective you bring.' }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="font-bold text-[#0a1628] mb-2">{faq.q}</h3>
              <p className="text-[#64748b]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

// ==================== STUDENTS TAB ====================
const StudentsTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Students & Graduates</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Launch Your Career in Research</h1>
            <p className="text-xl text-white/80 mb-8">
              Start your career with Africa's leading research consultancy. Our graduate programs 
              offer hands-on experience, mentorship, and a fast track to meaningful work.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
            >
              Apply for Graduate Program <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '20+', label: 'Graduates hired/year' },
                  { value: '90%', label: 'Retention rate' },
                  { value: '18', label: 'Months to first promotion' },
                  { value: '100%', label: 'Mentorship coverage' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-[#e63946]">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Programs */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0a1628]">Our Programs</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Graduate Research Associate',
              duration: '2-year program',
              icon: GraduationCap,
              desc: 'Full-time role for recent graduates. Work on real projects while receiving structured training and mentorship.',
              features: ['Rotations across departments', 'Dedicated mentor', 'Training curriculum', 'Performance-based progression']
            },
            {
              title: 'Summer Internship',
              duration: '3 months',
              icon: Calendar,
              desc: 'Intensive summer program for penultimate year students. Gain hands-on experience with live projects.',
              features: ['Real project work', 'Networking events', 'Skills workshops', 'Full-time offer pathway']
            },
            {
              title: 'Research Fellowship',
              duration: '6-12 months',
              icon: Award,
              desc: 'For exceptional postgraduate researchers. Conduct original research while contributing to our projects.',
              features: ['Independent research', 'Publication support', 'Conference attendance', 'Transition to full-time']
            }
          ].map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <program.icon className="w-12 h-12 text-[#e63946] mb-4" />
              <h3 className="text-xl font-bold text-[#0a1628] mb-1">{program.title}</h3>
              <p className="text-[#e63946] text-sm font-semibold mb-4">{program.duration}</p>
              <p className="text-[#64748b] mb-6">{program.desc}</p>
              <ul className="space-y-2">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#64748b] text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Look For */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">What We Look For</p>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">
              Your Degree is Just the Start
            </h2>
            <p className="text-[#64748b] mb-8">
              We look beyond grades to find candidates with the curiosity, drive, and potential 
              to become future leaders in research and analytics.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Intellectual Curiosity', desc: 'Genuine interest in understanding complex problems' },
                { title: 'Analytical Thinking', desc: 'Ability to break down problems and work with data' },
                { title: 'Communication Skills', desc: 'Clear written and verbal communication' },
                { title: 'Team Orientation', desc: 'Collaborative spirit and willingness to learn' },
                { title: 'Initiative', desc: 'Proactive approach to challenges and opportunities' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#e63946] flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#0a1628]">{item.title}:</span>
                    <span className="text-[#64748b]"> {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Eligible Degrees</h3>
            <p className="text-white/70 mb-6">
              We welcome applications from various academic backgrounds, including:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Statistics', 'Economics', 'Data Science', 'Public Health',
                'Development Studies', 'Social Sciences', 'Computer Science', 'Mathematics',
                'Agriculture', 'Environmental Science', 'Public Policy', 'Business'
              ].map((degree, i) => (
                <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-center">
                  {degree}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

// ==================== LIFE TAB ====================
const LifeTab = ({ teamMembers, benefits }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Life at DataVision</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Where Work Meets Purpose</h1>
          <p className="text-xl text-white/80">
            Get a glimpse into what it's really like to work here—from our culture 
            and benefits to the people who make DataVision special.
          </p>
        </div>
      </div>
    </section>

    {/* Team Testimonials */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our People</p>
          <h2 className="text-3xl font-bold text-[#0a1628]">Hear From the Team</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f8fafc] rounded-2xl p-8"
            >
              <Quote className="w-10 h-10 text-[#e63946] mb-4 opacity-30" />
              <p className="text-[#64748b] mb-6 italic">"{member.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e63946] flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-[#0a1628]">{member.name}</p>
                  <p className="text-[#64748b] text-sm">{member.role} • {member.years} years</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Benefits & Perks</p>
          <h2 className="text-3xl font-bold text-[#0a1628]">Taking Care of Our Team</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#e63946]/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-7 h-7 text-[#e63946]" />
              </div>
              <h3 className="font-bold text-[#0a1628] mb-2">{benefit.title}</h3>
              <p className="text-[#64748b] text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Culture */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Culture</p>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">
              Collaboration, Growth, Impact
            </h2>
            <p className="text-[#64748b] mb-6 leading-relaxed">
              Our culture is built on three pillars: genuine collaboration across teams, 
              continuous growth and learning, and a shared commitment to creating real-world impact.
            </p>
            <p className="text-[#64748b] mb-8 leading-relaxed">
              We celebrate wins together, support each other through challenges, and maintain 
              a healthy work-life balance. Whether it's a team lunch, knowledge-sharing session, 
              or field research trip—there's always something bringing us together.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Team Events', value: 'Monthly' },
                { label: 'Learning Sessions', value: 'Weekly' },
                { label: 'Feedback Cycles', value: 'Quarterly' }
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-[#f8fafc] rounded-lg">
                  <div className="text-xl font-bold text-[#e63946]">{item.value}</div>
                  <div className="text-[#64748b] text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, title: 'Team Lunches', desc: 'Regular team meals and celebrations' },
              { icon: BookOpen, title: 'Learning Days', desc: 'Dedicated time for skill development' },
              { icon: Globe, title: 'Field Visits', desc: 'See the impact of your work firsthand' },
              { icon: Zap, title: 'Innovation Time', desc: 'Space to explore new ideas' }
            ].map((item, i) => (
              <div key={i} className="bg-[#f8fafc] rounded-xl p-6">
                <item.icon className="w-8 h-8 text-[#e63946] mb-3" />
                <h4 className="font-bold text-[#0a1628] mb-1">{item.title}</h4>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export default CareersPage;
