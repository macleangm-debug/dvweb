import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, Users, Award, BookOpen, Droplets, Heart,
  Sprout, Quote, BarChart3, Globe, CheckCircle2, Target, PieChart,
  GraduationCap, Building2, TrendingUp, Shield, Utensils,
  Smartphone, Layers, Activity
} from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [partners, setPartners] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, testimonialsRes, projectsRes, partnersRes] = await Promise.all([
          axios.get(`${API}/statistics`),
          axios.get(`${API}/testimonials?featured=true`),
          axios.get(`${API}/projects?featured=true`),
          axios.get(`${API}/partners`)
        ]);
        setStats(statsRes.data);
        setTestimonials(testimonialsRes.data);
        setProjects(projectsRes.data);
        setPartners(partnersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (testimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [testimonials]);

  const heroMessages = [
    { 
      title: "Data-Driven Insights Driving Global Impact",
      subtitle: "Leading data analytics, research, and development consultancy with deep expertise across agriculture, education, health, and WASH sectors.",
      type: "consulting"
    },
    { 
      title: "FieldForce: Mobile Data Collection Made Simple",
      subtitle: "Powerful offline-first data collection for field teams. GPS tracking, photo capture, and seamless sync - trusted by researchers across Africa.",
      type: "fieldforce",
      cta: "/solutions/fieldforce",
      ctaText: "Try FieldForce Free",
      demoLink: "/solutions/fieldforce/app/login"
    },
    { 
      title: "Survey360: Beautiful Surveys Made Simple",
      subtitle: "Create professional surveys in minutes. Collect responses anywhere. Get insights instantly - all in one powerful platform.",
      type: "survey360",
      cta: "/solutions/survey360",
      ctaText: "Try Survey360 Free",
      demoLink: "/solutions/survey360/login"
    }
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMessages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section with Product Rotation */}
      <section className={`relative min-h-[90vh] flex items-center noise-overlay overflow-hidden transition-colors duration-700 ${
        heroMessages[heroIndex].type === 'fieldforce' 
          ? 'bg-gradient-to-br from-[#0d3d38] via-[#0a2e2a] to-[#061a17]' 
          : heroMessages[heroIndex].type === 'survey360'
          ? 'bg-gradient-to-br from-[#1a1033] via-[#12082a] to-[#0a0515]'
          : 'bg-[#0a1628]'
      }`}>
        <div className="absolute inset-0" style={{
          background: heroMessages[heroIndex].type === 'fieldforce' 
            ? 'radial-gradient(circle at top right, #14524b 0%, #061a17 100%)'
            : heroMessages[heroIndex].type === 'survey360'
            ? 'radial-gradient(circle at top right, #2d1b4e 0%, #0a0515 100%)'
            : 'radial-gradient(circle at top right, #1e293b 0%, #0a1628 100%)'
        }}></div>
        
        {/* Hero indicator dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroMessages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                heroIndex === idx 
                  ? 'bg-[#e63946] w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {heroMessages[heroIndex].type === 'consulting' ? (
                    <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">
                      25 Years of Excellence
                    </p>
                  ) : (
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        heroMessages[heroIndex].type === 'fieldforce' ? 'bg-[#2dd4bf]/20' : 'bg-purple-500/20'
                      }`}>
                        {heroMessages[heroIndex].type === 'fieldforce' ? (
                          <MapPin className="w-5 h-5 text-[#2dd4bf]" />
                        ) : (
                          <FileText className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <span className={`font-semibold uppercase tracking-wider text-sm ${
                        heroMessages[heroIndex].type === 'fieldforce' ? 'text-[#2dd4bf]' : 'text-purple-400'
                      }`}>
                        DataVision Software
                      </span>
                    </div>
                  )}
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-serif text-white"
                    data-testid="hero-title"
                  >
                    {heroMessages[heroIndex].title}
                  </h1>
                  <p className="text-lg text-white/80 mb-8 max-w-lg">
                    {heroMessages[heroIndex].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex flex-wrap gap-4">
                {heroMessages[heroIndex].type === 'consulting' ? (
                  <>
                    <Link 
                      to="/contact" 
                      className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
                      data-testid="hero-partner-btn"
                    >
                      Partner With Us
                    </Link>
                    <Link 
                      to="/contact?type=consultation" 
                      className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#0a1628] transition-all"
                      data-testid="hero-consultation-btn"
                    >
                      Request Consultation
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to={heroMessages[heroIndex].cta} 
                      className={`px-8 py-4 font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-1 ${
                        heroMessages[heroIndex].type === 'fieldforce'
                          ? 'bg-[#2dd4bf] text-[#0a1628] hover:bg-[#14b8a6]'
                          : 'bg-purple-500 text-white hover:bg-purple-600'
                      }`}
                    >
                      {heroMessages[heroIndex].ctaText} →
                    </Link>
                    <Link 
                      to={heroMessages[heroIndex].demoLink}
                      className="border-2 border-white/50 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
                    >
                      Try Interactive Demo
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <AnimatePresence mode="wait">
                {heroMessages[heroIndex].type === 'consulting' ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AfricaMap />
                  </motion.div>
                ) : (
                  <motion.div
                    key={heroMessages[heroIndex].type}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Product Screenshot Mockup */}
                    <div className={`rounded-2xl p-1 shadow-2xl ${
                      heroMessages[heroIndex].type === 'fieldforce'
                        ? 'bg-gradient-to-br from-[#2dd4bf]/30 to-[#14b8a6]/10'
                        : 'bg-gradient-to-br from-purple-500/30 to-purple-600/10'
                    }`}>
                      <div className="bg-[#0a1628] rounded-xl overflow-hidden">
                        <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="ml-4 text-white/50 text-sm">
                            {heroMessages[heroIndex].type === 'fieldforce' ? 'fieldforce.datavision.co.tz' : 'survey360.datavision.co.tz'}
                          </span>
                        </div>
                        <div className="p-6 min-h-[350px] flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                              heroMessages[heroIndex].type === 'fieldforce'
                                ? 'bg-[#2dd4bf]/20'
                                : 'bg-purple-500/20'
                            }`}>
                              {heroMessages[heroIndex].type === 'fieldforce' ? (
                                <MapPin className="w-10 h-10 text-[#2dd4bf]" />
                              ) : (
                                <FileText className="w-10 h-10 text-purple-400" />
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {heroMessages[heroIndex].type === 'fieldforce' ? 'FieldForce' : 'Survey360'}
                            </h3>
                            <p className="text-white/60 text-sm mb-6">Dashboard Preview</p>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { label: heroMessages[heroIndex].type === 'fieldforce' ? 'Projects' : 'Surveys', value: '24' },
                                { label: heroMessages[heroIndex].type === 'fieldforce' ? 'Submissions' : 'Responses', value: '1.2K' },
                                { label: 'Team', value: '12' }
                              ].map((stat, i) => (
                                <div key={i} className="bg-white/5 rounded-lg p-3">
                                  <div className={`text-2xl font-bold ${
                                    heroMessages[heroIndex].type === 'fieldforce' ? 'text-[#2dd4bf]' : 'text-purple-400'
                                  }`}>{stat.value}</div>
                                  <div className="text-white/50 text-xs">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Floating badges */}
                    <motion.div 
                      className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-xl px-4 py-2 flex items-center gap-2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Real-time sync</div>
                        <div className="text-sm font-semibold text-gray-800">100% Offline Ready</div>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="absolute -top-4 -right-4 bg-white rounded-lg shadow-xl px-4 py-2"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800">256-bit Encryption</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
                data-testid={`stat-${index}`}
              >
                <div className="text-5xl md:text-6xl font-bold text-[#0a1628] mb-2 font-serif">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>
                <p className="text-sm text-[#64748b] uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Solutions Section - NEW */}
      <section className="py-24 bg-gradient-to-b from-[#0a1628] to-[#0f1d32] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #2dd4bf 0%, transparent 30%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 30%)'
        }}></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium mb-4">
                Powerful Software Solutions
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif">
                Tools That Power Your Research
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Our suite of software products helps organizations collect, manage, and analyze data at scale. 
                Used by leading research institutions across Africa.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FieldForce Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-[#0d3d38] to-[#061a17] rounded-2xl p-8 border border-[#2dd4bf]/20 hover:border-[#2dd4bf]/50 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#2dd4bf]/20 flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-[#2dd4bf]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">FieldForce</h3>
                      <p className="text-[#2dd4bf] text-sm">Mobile Data Collection</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#2dd4bf]/20 text-[#2dd4bf] text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
                <p className="text-white/70 mb-6">
                  Powerful offline-first data collection for field teams. GPS tracking, photo capture, 
                  and seamless sync - all in one platform trusted by researchers across Africa.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Smartphone, label: '100% Offline Ready' },
                    { icon: MapPin, label: 'GPS & Geofencing' },
                    { icon: Shield, label: '256-bit Encryption' },
                    { icon: Zap, label: 'Real-time Sync' }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <feature.icon className="w-4 h-4 text-[#2dd4bf]" />
                      {feature.label}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Link 
                    to="/solutions/fieldforce"
                    className="bg-[#2dd4bf] text-[#0a1628] px-6 py-3 rounded-lg font-semibold hover:bg-[#14b8a6] transition-all group-hover:translate-x-1"
                  >
                    Start Free Trial →
                  </Link>
                  <Link 
                    to="/solutions/fieldforce/app/login"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Survey360 Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-[#1a1033] to-[#0a0515] rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <FileText className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Survey360</h3>
                      <p className="text-purple-400 text-sm">Survey Management Platform</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                    New
                  </span>
                </div>
                <p className="text-white/70 mb-6">
                  Create professional surveys in minutes. Collect responses anywhere. Get insights 
                  instantly - all in one simple, powerful platform for research teams.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Layers, label: '10+ Question Types' },
                    { icon: BarChart3, label: 'Real-time Analytics' },
                    { icon: Globe, label: 'Multi-language' },
                    { icon: Shield, label: 'GDPR Compliant' }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                      <feature.icon className="w-4 h-4 text-purple-400" />
                      {feature.label}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Link 
                    to="/solutions/survey360"
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all group-hover:translate-x-1"
                  >
                    Start Free Trial →
                  </Link>
                  <Link 
                    to="/solutions/survey360/login"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    View Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-white/50 text-sm uppercase tracking-wider mb-6">Trusted by leading organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['World Bank', 'UNICEF', 'USAID', 'Gates Foundation', 'WHO'].map((org, i) => (
                <div key={i} className="text-white font-semibold text-lg">{org}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Updated for Multi-disciplinary Focus */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">About Us</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
                Research, Technology & Development Excellence Since 1998
              </h2>
              <p className="text-[#64748b] mb-6">
                DataVision International has evolved from a pioneering research consultancy into a 
                comprehensive data solutions company. With over 25 years of experience, we now combine 
                world-class research capabilities with cutting-edge software products to deliver 
                end-to-end solutions for organizations worldwide.
              </p>
              <p className="text-[#64748b] mb-8">
                Our integrated approach spans custom software development, mobile data collection platforms, 
                survey management systems, advanced analytics, and expert consulting services - all backed 
                by deep sector expertise in agriculture, health, education, and development.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
                >
                  Learn More About Us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/solutions" 
                  className="inline-flex items-center gap-2 text-[#2a9d8f] font-semibold hover:text-[#238276] transition-colors"
                >
                  Explore Our Solutions <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Updated cards to reflect multi-disciplinary focus */}
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#e63946] transition-all">
                <Target className="w-8 h-8 text-[#e63946] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Research & M&E</h3>
                <p className="text-sm text-[#64748b]">Complex surveys, impact evaluations & monitoring systems</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#2dd4bf] transition-all">
                <Smartphone className="w-8 h-8 text-[#2dd4bf] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Software Products</h3>
                <p className="text-sm text-[#64748b]">FieldForce, Survey360, DataPulse & custom data platforms</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#a855f7] transition-all">
                <BarChart3 className="w-8 h-8 text-[#a855f7] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Data Analytics</h3>
                <p className="text-sm text-[#64748b]">Advanced analytics, AI/ML & business intelligence</p>
              </div>
              <div className="bg-white p-6 border border-[#e2e8f0] hover:border-l-4 hover:border-l-[#f59e0b] transition-all">
                <GraduationCap className="w-8 h-8 text-[#f59e0b] mb-4" />
                <h3 className="font-semibold text-[#0a1628] mb-2">Capacity Building</h3>
                <p className="text-sm text-[#64748b]">Training, technical assistance & knowledge transfer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-2">Our Work</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif">Featured Projects</h2>
            </div>
            <Link 
              to="/projects" 
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] p-8 hover:border-l-4 hover:border-l-[#e63946] hover:shadow-lg transition-all group"
                data-testid={`project-card-${index}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#2a9d8f] bg-[#2a9d8f]/10 px-2 py-1">
                    {project.sector}
                  </span>
                  <span className="text-xs text-[#64748b]">{project.year}</span>
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-3 font-serif group-hover:text-[#e63946] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#64748b] text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <Building2 className="w-4 h-4" />
                  <span>{project.client}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-[#0a1628] text-white relative noise-overlay">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mx-auto text-center relative">
              <Quote className="w-16 h-16 text-[#e63946] opacity-20 absolute -top-8 left-0" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  data-testid="testimonial-carousel"
                >
                  <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                    "{testimonials[currentTestimonial]?.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-[#e63946]">
                      {testimonials[currentTestimonial]?.author_name}
                    </p>
                    <p className="text-white/70 text-sm">
                      {testimonials[currentTestimonial]?.author_title}, {testimonials[currentTestimonial]?.organization}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-[#e63946] w-8' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="py-12 bg-white border-t">
          <div className="container mx-auto px-6 lg:px-12">
            <p className="text-center text-sm uppercase tracking-wider text-[#64748b] mb-8">
              Trusted by Leading Organizations
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {partners.map((partner) => (
                <img 
                  key={partner.id}
                  src={partner.logo_url} 
                  alt={partner.name}
                  className="h-16 md:h-20 object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
            Ready to Transform Your Data into Impact?
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto mb-8">
            Whether you're planning a large-scale survey, need monitoring and evaluation expertise, 
            or require data analytics and technology solutions, we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
              data-testid="cta-discuss-btn"
            >
              Discuss Your Project
            </Link>
            <Link 
              to="/research" 
              className="border-2 border-[#0a1628] text-[#0a1628] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Explore Our Expertise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// About Page

export default HomePage;
