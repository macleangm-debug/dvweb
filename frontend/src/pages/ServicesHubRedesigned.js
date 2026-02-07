import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, CheckCircle2, BarChart3, Users, Globe, 
  Award, Target, Layers, Zap, Search,
  PieChart, GraduationCap, Compass
} from 'lucide-react';

// Services Overview/Hub Page - Redesigned with rich visuals
const ServicesHubPageRedesigned = () => {
  const [activeService, setActiveService] = React.useState(0);
  const [hoveredStat, setHoveredStat] = React.useState(null);

  const services = [
    {
      title: "Research & Statistics",
      path: "/services/research-statistics",
      description: "Rigorous quantitative and qualitative research that transforms complex questions into actionable evidence.",
      icon: BarChart3,
      color: "#e63946",
      stat: "1M+",
      statLabel: "Interviews Conducted",
      highlights: ["Survey Design", "Statistical Analysis", "Mixed-Methods", "Policy Research"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    },
    {
      title: "Monitoring & Evaluation",
      path: "/services/monitoring-evaluation",
      description: "Evidence-driven M&E systems that generate actionable learning and demonstrate program impact.",
      icon: Target,
      color: "#2a9d8f",
      stat: "200+",
      statLabel: "Evaluations Completed",
      highlights: ["Theory of Change", "Baseline Studies", "Impact Evaluations", "M&E Frameworks"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      title: "Data Collection",
      path: "/services/data-collection",
      description: "Large-scale, high-quality data collection across Tanzania's most challenging environments.",
      icon: Users,
      color: "#f59e0b",
      stat: "500+",
      statLabel: "Trained Enumerators",
      highlights: ["Household Surveys", "Facility Assessments", "Remote Collection", "Quality Assurance"],
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80"
    },
    {
      title: "Data Analytics",
      path: "/services/data-analytics",
      description: "Transform raw data into strategic insight with advanced analytical methods and visualizations.",
      icon: PieChart,
      color: "#8b5cf6",
      stat: "50+",
      statLabel: "Dashboards Built",
      highlights: ["Statistical Modeling", "Dashboards", "GIS Analysis", "Predictive Analytics"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    },
    {
      title: "Capacity Building",
      path: "/services/capacity-building",
      description: "Build lasting organizational capability in research, M&E, and data analytics.",
      icon: GraduationCap,
      color: "#06b6d4",
      stat: "2,000+",
      statLabel: "Professionals Trained",
      highlights: ["Custom Training", "Enumerator Training", "M&E Skills", "Mentorship"],
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80"
    },
    {
      title: "Technical Advisory",
      path: "/services/technical-advisory",
      description: "Expert guidance for evidence-driven decision making from planning to implementation.",
      icon: Compass,
      color: "#ec4899",
      stat: "30+",
      statLabel: "Advisory Engagements",
      highlights: ["Evidence Strategies", "Methodology Review", "Stakeholder Facilitation", "Policy Translation"],
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80"
    }
  ];

  const stats = [
    { value: "25+", label: "Years of Excellence", icon: Award },
    { value: "1,000+", label: "Projects Delivered", icon: CheckCircle2 },
    { value: "15+", label: "Regions Covered", icon: Globe },
    { value: "50+", label: "Partner Organizations", icon: Users }
  ];

  const caseStudies = [
    {
      sector: "Education",
      title: "National Literacy Assessment Program",
      description: "Comprehensive evaluation of early grade reading skills across 1,200+ schools in rural and urban Tanzania, informing national education policy.",
      metrics: ["1,200 Schools", "50,000 Students", "85 Enumerators"],
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
    },
    {
      sector: "WASH",
      title: "Rural Water Infrastructure Verification",
      description: "Four-year data verification project mapping and assessing water points across all regions of Tanzania for improved water sector governance.",
      metrics: ["129,949 Water Points", "124 Enumerators", "26 Regions"],
      image: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=600&q=80"
    },
    {
      sector: "Health",
      title: "Healthcare Access Impact Study",
      description: "Mixed-methods evaluation of community health worker programs measuring service delivery improvements and health outcomes.",
      metrics: ["5,000 Households", "200 Facilities", "12 Districts"],
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80"
    },
    {
      sector: "Agriculture",
      title: "Food Security Monitoring System",
      description: "Longitudinal survey tracking agricultural productivity, market access, and household food security indicators across farming communities.",
      metrics: ["8,000 Farmers", "6 Growing Seasons", "18 Districts"],
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
    }
  ];

  const clients = [
    { name: "World Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/The_World_Bank_logo.svg/200px-The_World_Bank_logo.svg.png" },
    { name: "USAID", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/USAID-Identity.svg/200px-USAID-Identity.svg.png" },
    { name: "UNICEF", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Logo_of_UNICEF.svg/200px-Logo_of_UNICEF.svg.png" },
    { name: "GIZ", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/GIZ_logo.svg/200px-GIZ_logo.svg.png" },
    { name: "EU", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/200px-Flag_of_Europe.svg.png" }
  ];

  // Animated counter component
  const AnimatedStat = ({ value, label, icon: Icon, index }) => {
    const [count, setCount] = React.useState(0);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const suffix = value.replace(/[0-9]/g, '');
    
    React.useEffect(() => {
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }, [numericValue]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={() => setHoveredStat(index)}
        onMouseLeave={() => setHoveredStat(null)}
        className={`relative p-8 text-center cursor-pointer transition-all duration-300 ${
          hoveredStat === index ? 'bg-[#e63946] text-white scale-105' : 'bg-white'
        }`}
      >
        <Icon className={`w-8 h-8 mx-auto mb-4 transition-colors ${
          hoveredStat === index ? 'text-white' : 'text-[#2a9d8f]'
        }`} />
        <div className={`text-4xl md:text-5xl font-bold mb-2 font-serif transition-colors ${
          hoveredStat === index ? 'text-white' : 'text-[#0a1628]'
        }`}>
          {count.toLocaleString()}{suffix}
        </div>
        <div className={`text-sm uppercase tracking-wider transition-colors ${
          hoveredStat === index ? 'text-white/80' : 'text-[#64748b]'
        }`}>
          {label}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="pt-20">
      {/* Hero with Video Background Effect */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0a1628] text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#1e293b] to-[#0a1628]" />
          {/* Animated dots */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#e63946] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-[#e63946] rounded-full animate-pulse" />
                <span className="text-sm font-medium">Tanzania's Leading Research Partner</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif leading-tight">
                Evidence That
                <span className="block text-[#e63946]">Drives Impact</span>
              </h1>
              
              <p className="text-xl text-white/80 leading-relaxed mb-8 max-w-lg">
                From research design to actionable insights—comprehensive services 
                that help organizations understand and improve their impact across Tanzania.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact" 
                  className="group bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#e63946] transition-all inline-flex items-center gap-2"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/projects" 
                  className="border-2 border-white/30 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
                >
                  View Our Work
                </Link>
              </div>
            </motion.div>

            {/* Interactive Service Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main preview card */}
                <motion.div 
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    {services[activeService].icon && (
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: services[activeService].color + '20' }}
                      >
                        {React.createElement(services[activeService].icon, {
                          className: "w-8 h-8",
                          style: { color: services[activeService].color }
                        })}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{services[activeService].title}</h3>
                      <p className="text-white/60 text-sm">{services[activeService].statLabel}</p>
                    </div>
                    <div className="ml-auto text-3xl font-bold" style={{ color: services[activeService].color }}>
                      {services[activeService].stat}
                    </div>
                  </div>
                  
                  <p className="text-white/70 mb-6">{services[activeService].description}</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {services[activeService].highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                        {h}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Service selector dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {services.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveService(i)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === activeService 
                          ? 'bg-[#e63946] w-8' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Animated Stats Bar */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid with Interactive Cards */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              What We Do
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif mb-4"
            >
              Comprehensive Service Portfolio
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#64748b] max-w-2xl mx-auto"
            >
              End-to-end research and evaluation services tailored to your needs
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={service.path}
                  className="group block h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  {/* Icon-based header */}
                  <div 
                    className="relative h-48 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: service.color + '10' }}
                  >
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, ${service.color}40 0%, transparent 50%), 
                                          radial-gradient(circle at 80% 50%, ${service.color}30 0%, transparent 40%),
                                          radial-gradient(circle at 50% 80%, ${service.color}20 0%, transparent 30%)`
                      }} />
                    </div>
                    
                    {/* Main icon */}
                    <motion.div 
                      className="relative z-10 w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{ backgroundColor: service.color + '20' }}
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                    >
                      <service.icon 
                        className="w-12 h-12 transition-colors duration-300" 
                        style={{ color: service.color }}
                      />
                    </motion.div>
                    
                    {/* Stat badge */}
                    <div 
                      className="absolute bottom-4 left-4 px-4 py-2 rounded-full backdrop-blur-sm"
                      style={{ backgroundColor: service.color }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">{service.stat}</span>
                        <span className="text-white/80 text-xs uppercase tracking-wider">{service.statLabel}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0a1628] mb-3 font-serif group-hover:text-[#e63946] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#64748b] text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    {/* Quick highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.highlights.slice(0, 3).map((h, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full bg-[#f8fafc] text-[#64748b]"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#0a1628] font-semibold text-sm group-hover:text-[#e63946] transition-colors">
                      Explore Service
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
              >
                Our Impact in Tanzania
              </motion.p>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold font-serif"
              >
                Featured Case Studies
              </motion.h2>
            </div>
            <Link 
              to="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-white/70 hover:text-[#e63946] transition-colors"
            >
              View All Projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#e63946]/50 transition-all"
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-64 md:h-full overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1628]/80 md:block hidden" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#e63946] text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                        {study.sector}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-3 font-serif group-hover:text-[#e63946] transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-3">
                      {study.description}
                    </p>
                    
                    {/* Metrics */}
                    <div className="flex flex-wrap gap-3">
                      {study.metrics.map((metric, i) => (
                        <div 
                          key={i}
                          className="px-3 py-2 bg-white/5 rounded-lg text-sm"
                        >
                          <span className="text-[#2a9d8f] font-semibold">{metric.split(' ')[0]}</span>
                          <span className="text-white/60 ml-1">{metric.split(' ').slice(1).join(' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Comparison Table */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              Compare Our Services
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif"
            >
              Find the Right Solution
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-[#0a1628]">
                  <th className="text-left py-4 px-4 font-serif text-[#0a1628]">Service</th>
                  <th className="text-center py-4 px-4 font-serif text-[#0a1628]">Best For</th>
                  <th className="text-center py-4 px-4 font-serif text-[#0a1628]">Timeline</th>
                  <th className="text-center py-4 px-4 font-serif text-[#0a1628]">Team Size</th>
                  <th className="text-center py-4 px-4 font-serif text-[#0a1628]">Deliverables</th>
                  <th className="text-center py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Research & Statistics", best: "Baseline surveys, policy research", timeline: "2-6 months", team: "5-50", deliverables: "Reports, datasets", path: "/services/research-statistics" },
                  { name: "Monitoring & Evaluation", best: "Program assessment, impact measurement", timeline: "3-12 months", team: "3-20", deliverables: "M&E frameworks, evaluations", path: "/services/monitoring-evaluation" },
                  { name: "Data Collection", best: "Large-scale field surveys", timeline: "1-4 months", team: "20-200", deliverables: "Clean datasets, QA reports", path: "/services/data-collection" },
                  { name: "Data Analytics", best: "Data-driven insights, dashboards", timeline: "2-8 weeks", team: "2-5", deliverables: "Dashboards, analysis reports", path: "/services/data-analytics" },
                  { name: "Capacity Building", best: "Team skill development", timeline: "1-4 weeks", team: "1-3", deliverables: "Training materials, certifications", path: "/services/capacity-building" },
                  { name: "Technical Advisory", best: "Strategic guidance, quality assurance", timeline: "Ongoing", team: "1-2", deliverables: "Advisory sessions, reviews", path: "/services/technical-advisory" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors">
                    <td className="py-4 px-4 font-semibold text-[#0a1628]">{row.name}</td>
                    <td className="py-4 px-4 text-center text-[#64748b] text-sm">{row.best}</td>
                    <td className="py-4 px-4 text-center text-[#64748b] text-sm">{row.timeline}</td>
                    <td className="py-4 px-4 text-center text-[#64748b] text-sm">{row.team}</td>
                    <td className="py-4 px-4 text-center text-[#64748b] text-sm">{row.deliverables}</td>
                    <td className="py-4 px-4 text-center">
                      <Link 
                        to={row.path}
                        className="inline-flex items-center gap-1 text-[#e63946] hover:underline text-sm font-semibold"
                      >
                        Learn More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-16 bg-[#f8fafc] border-t border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm uppercase tracking-wider text-[#64748b] mb-10"
          >
            Trusted by Leading Development Organizations
          </motion.p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              >
                <img 
                  src={client.logo} 
                  alt={client.name}
                  className="h-10 md:h-12 object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              How We Work
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif"
            >
              Our Engagement Process
            </motion.h2>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#e2e8f0] -translate-y-1/2" />
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { num: "01", title: "Discovery", desc: "Deep dive into your context, objectives, and constraints", icon: Search },
                { num: "02", title: "Design", desc: "Develop tailored methodology and implementation plan", icon: Layers },
                { num: "03", title: "Execute", desc: "Deliver with rigor, transparency, and quality assurance", icon: Zap },
                { num: "04", title: "Impact", desc: "Translate findings into actionable recommendations", icon: Target }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Circle with icon */}
                  <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-white rounded-full border-4 border-[#e63946] flex items-center justify-center shadow-lg">
                    <step.icon className="w-8 h-8 text-[#e63946]" />
                  </div>
                  
                  <div className="text-5xl font-bold text-[#e63946]/10 mb-2">{step.num}</div>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2 font-serif">{step.title}</h3>
                  <p className="text-[#64748b] text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-[#e63946] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 font-serif"
            >
              Ready to Generate Evidence That Matters?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/90 mb-10"
            >
              Let's discuss how we can support your research and evaluation needs in Tanzania.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link 
                to="/contact" 
                className="group bg-white text-[#e63946] px-10 py-5 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all inline-flex items-center gap-2"
              >
                Start a Conversation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/contact?type=consultation" 
                className="border-2 border-white text-white px-10 py-5 font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-[#e63946] transition-all"
              >
                Request Proposal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesHubPageRedesigned;
