import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Globe, Users, Award, Target, Briefcase, Building2,
  CheckCircle, MapPin, Star, Lightbulb, Shield, Zap, TrendingUp,
  Heart, GraduationCap, Droplets, Leaf, BarChart3, Database,
  Smartphone, PieChart, Play, ChevronRight, Quote
} from 'lucide-react';

// Expert profiles showcasing global talent
const expertProfiles = [
  {
    name: 'Dr. Amina Okonkwo',
    role: 'Lead Data Scientist',
    location: 'Lagos, Nigeria',
    expertise: 'Machine Learning & AI',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    flag: '🇳🇬'
  },
  {
    name: 'James Mwangi',
    role: 'Senior Solutions Architect',
    location: 'Nairobi, Kenya',
    expertise: 'Enterprise Systems',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    flag: '🇰🇪'
  },
  {
    name: 'Sarah van der Berg',
    role: 'M&E Specialist',
    location: 'Cape Town, South Africa',
    expertise: 'Impact Assessment',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    flag: '🇿🇦'
  },
  {
    name: 'Dr. Emmanuel Mensah',
    role: 'Health Systems Expert',
    location: 'Accra, Ghana',
    expertise: 'Healthcare Analytics',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    flag: '🇬🇭'
  },
  {
    name: 'Fatima Hassan',
    role: 'Agricultural Data Lead',
    location: 'Dar es Salaam, Tanzania',
    expertise: 'Food Security',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
    flag: '🇹🇿'
  },
  {
    name: 'Pierre Ndayisaba',
    role: 'WASH Sector Specialist',
    location: 'Kigali, Rwanda',
    expertise: 'Water & Sanitation',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    flag: '🇷🇼'
  }
];

// Industries served with rich data
const industries = [
  {
    id: 'health',
    name: 'Healthcare & Public Health',
    icon: Heart,
    color: '#e63946',
    description: 'Digital health solutions, disease surveillance, and health systems strengthening',
    stats: { projects: '120+', countries: '15', beneficiaries: '5M+' },
    solutions: ['HealthPulse', 'Survey360', 'M&E Tracker']
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food Security',
    icon: Leaf,
    color: '#2a9d8f',
    description: 'Farmer registries, market intelligence, and agricultural value chain analytics',
    stats: { projects: '85+', countries: '12', farmers: '2M+' },
    solutions: ['AgriData Pro', 'FieldForce', 'DataViz Studio']
  },
  {
    id: 'education',
    name: 'Education & Skills',
    icon: GraduationCap,
    color: '#8b5cf6',
    description: 'Learning assessments, teacher effectiveness, and education quality monitoring',
    stats: { projects: '65+', schools: '5K+', students: '3M+' },
    solutions: ['EduInsights', 'Survey360', 'M&E Tracker']
  },
  {
    id: 'wash',
    name: 'Water, Sanitation & Hygiene',
    icon: Droplets,
    color: '#0ea5e9',
    description: 'Water point mapping, service delivery tracking, and SDG 6 progress monitoring',
    stats: { projects: '45+', waterPoints: '10K+', communities: '8K+' },
    solutions: ['WASH Monitor', 'FieldForce', 'DataPulse']
  },
  {
    id: 'governance',
    name: 'Governance & Public Sector',
    icon: Building2,
    color: '#f59e0b',
    description: 'Citizen feedback, service delivery assessment, and policy impact evaluation',
    stats: { projects: '55+', agencies: '200+', surveys: '500K+' },
    solutions: ['Survey360', 'DataPulse', 'DataViz Studio']
  },
  {
    id: 'finance',
    name: 'Financial Inclusion',
    icon: TrendingUp,
    color: '#6366f1',
    description: 'Financial access research, mobile money analytics, and economic studies',
    stats: { projects: '40+', institutions: '80+', respondents: '1M+' },
    solutions: ['Survey360', 'DataViz Studio', 'M&E Tracker']
  }
];

// Software solutions showcase
const softwareProducts = [
  {
    id: 'fieldforce',
    name: 'FieldForce',
    tagline: 'Mobile Data Collection',
    description: 'Powerful offline-first mobile app for field teams',
    icon: Smartphone,
    color: '#14b8a6',
    link: '/solutions/fieldforce'
  },
  {
    id: 'survey360',
    name: 'Survey360',
    tagline: 'Survey Management',
    description: 'End-to-end survey lifecycle management',
    icon: Target,
    color: '#e63946',
    link: '/solutions/survey360'
  },
  {
    id: 'datapulse',
    name: 'DataPulse',
    tagline: 'Enterprise Platform',
    description: 'Enterprise-grade data collection infrastructure',
    icon: Database,
    color: '#8b5cf6',
    link: '/solutions/datapulse'
  },
  {
    id: 'dataviz',
    name: 'DataViz Studio',
    tagline: 'Analytics & Visualization',
    description: 'Transform data into visual insights',
    icon: PieChart,
    color: '#f59e0b',
    link: '/solutions/dataviz-studio'
  }
];

// Client testimonials
const testimonials = [
  {
    quote: "DataVision's solutions transformed how we collect and analyze health data across 8 countries. Their expert team understood our unique challenges.",
    author: 'Dr. Christine Kaseba',
    role: 'Regional Director',
    org: 'Global Health Initiative',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop'
  },
  {
    quote: "The combination of cutting-edge technology and deep local expertise made DataVision the perfect partner for our agricultural transformation program.",
    author: 'Michael Ochieng',
    role: 'Program Manager',
    org: 'East Africa Agricultural Fund',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
  },
  {
    quote: "Their M&E solutions helped us demonstrate real impact to our donors. The team's expertise in development sector data is unmatched.",
    author: 'Sophia Mbeki',
    role: 'Executive Director',
    org: 'Ubuntu Development Foundation',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop'
  }
];

// Stats for social proof
const globalStats = [
  { value: '50+', label: 'Countries Served', icon: Globe },
  { value: '500+', label: 'Projects Delivered', icon: Briefcase },
  { value: '200+', label: 'Technical Experts', icon: Users },
  { value: '50M+', label: 'Data Points Collected', icon: Database }
];

const SolutionsLandingPage = () => {
  const [activeIndustry, setActiveIndustry] = useState(null);

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-slate-950 to-slate-950" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-8"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white/80">Global Expertise, Local Impact</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Elite Technical Experts.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                World-Class Solutions.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              We partner with the brightest minds across the globe to build transformative 
              data solutions that drive impact across healthcare, agriculture, education, 
              and beyond.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/contact" data-testid="solutions-contact-btn">
                <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
                  Partner With Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/solutions/fieldforce/demo">
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  See Our Solutions
                </button>
              </Link>
            </motion.div>

            {/* Global Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {globalStats.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <stat.icon className="w-6 h-6 text-indigo-400 mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expert Network Section */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-6"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Our Expert Network</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Powered by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                African Excellence
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400"
            >
              Our network spans the continent and beyond, bringing together data scientists, 
              engineers, sector specialists, and researchers who understand local contexts.
            </motion.p>
          </div>

          {/* Expert Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {expertProfiles.map((expert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <div className="relative mb-3">
                  <img 
                    src={expert.image} 
                    alt={expert.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <div className="absolute top-2 right-2 text-xl">{expert.flag}</div>
                </div>
                <h4 className="font-semibold text-white text-sm group-hover:text-indigo-400 transition-colors">{expert.name}</h4>
                <p className="text-xs text-slate-400 mb-1">{expert.role}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {expert.location}
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Experts CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/experts" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
              Explore Our Expert Network
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30 mb-6"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Industries We Serve</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Solutions for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Every Sector
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400"
            >
              Deep domain expertise across the sectors that matter most for development impact.
            </motion.p>
          </div>

          {/* Industry Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, idx) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => setActiveIndustry(industry.id)}
                onMouseLeave={() => setActiveIndustry(null)}
                className="group relative bg-slate-900/50 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* Hover gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${industry.color}10 0%, transparent 50%)`
                  }}
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${industry.color}20` }}
                  >
                    <industry.icon className="w-7 h-7" style={{ color: industry.color }} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{industry.description}</p>
                  
                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-4 text-xs">
                    {Object.entries(industry.stats).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-bold text-white">{value}</span>
                        <span className="text-slate-500 ml-1 capitalize">{key}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Solutions Used */}
                  <div className="flex flex-wrap gap-2">
                    {industry.solutions.map((sol, i) => (
                      <span 
                        key={i} 
                        className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded-lg"
                      >
                        {sol}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Products Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-6"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Our Software Products</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Performance
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-400"
            >
              Purpose-built software platforms that power data-driven decision making.
            </motion.p>
          </div>

          {/* Products Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {softwareProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={product.link} className="block group">
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800 transition-all h-full">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${product.color}20` }}
                    >
                      <product.icon className="w-6 h-6" style={{ color: product.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm font-medium mb-2" style={{ color: product.color }}>
                      {product.tagline}
                    </p>
                    <p className="text-sm text-slate-400 mb-4">{product.description}</p>
                    <div className="flex items-center gap-2 text-sm text-indigo-400 group-hover:text-indigo-300">
                      Learn more
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 mb-6"
            >
              <Star className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-300">Client Success Stories</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Trusted by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                Industry Leaders
              </span>
            </motion.h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800"
              >
                <Quote className="w-10 h-10 text-indigo-500/30 mb-4" />
                <p className="text-slate-300 mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.author}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}, {testimonial.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 via-indigo-950/50 to-slate-950">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 mb-8">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">Ready to Transform Your Data?</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Let's Build Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Extraordinary
              </span>
            </h2>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Whether you need a custom solution, want to leverage our platforms, 
              or are looking to join our expert network — we'd love to hear from you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <button className="group px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all flex items-center gap-2">
                  Start a Conversation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/experts/join">
                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Join Our Expert Network
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsLandingPage;
