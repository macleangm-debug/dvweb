import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Sprout, GraduationCap, Heart, Droplets, Building2,
  Zap, Factory, Truck, Globe, Pickaxe, Utensils, Landmark, Plane,
  Smartphone, ChevronRight, BarChart3, Target, Lightbulb, TrendingUp,
  CheckCircle2, Users, Database, PieChart, LineChart, Brain
} from 'lucide-react';

// ==================== INDUSTRIES DATA ====================
const industriesData = [
  {
    id: 'agriculture',
    name: 'Agriculture & Agribusiness',
    shortDesc: 'Data-driven solutions for food security and agricultural productivity',
    icon: Sprout,
    color: '#22c55e',
    stats: { projects: '75+', farmers: '500K+', regions: '20+' }
  },
  {
    id: 'education',
    name: 'Education & Training',
    shortDesc: 'Evidence-based insights for learning outcomes and institutional performance',
    icon: GraduationCap,
    color: '#f59e0b',
    stats: { projects: '100+', schools: '2,000+', students: '1M+' }
  },
  {
    id: 'health',
    name: 'Health & Pharmaceuticals',
    shortDesc: 'Healthcare analytics for improved service delivery and outcomes',
    icon: Heart,
    color: '#ef4444',
    stats: { projects: '60+', facilities: '500+', patients: '2M+' }
  },
  {
    id: 'wash',
    name: 'Water & Sanitation',
    shortDesc: 'WASH sector analytics for sustainable water access and hygiene',
    icon: Droplets,
    color: '#0ea5e9',
    stats: { projects: '45+', communities: '1,000+', beneficiaries: '3M+' }
  },
  {
    id: 'public-sector',
    name: 'Public Sector & Government',
    shortDesc: 'Policy research and governance analytics for effective public service',
    icon: Landmark,
    color: '#6366f1',
    stats: { projects: '50+', ministries: '15+', policies: '30+' }
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    shortDesc: 'Energy access research and utility performance optimization',
    icon: Zap,
    color: '#eab308',
    stats: { projects: '25+', households: '200K+', utilities: '10+' }
  },
  {
    id: 'financial-services',
    name: 'Financial Services & Microfinance',
    shortDesc: 'Financial inclusion research and market intelligence',
    icon: Building2,
    color: '#14b8a6',
    stats: { projects: '35+', institutions: '25+', clients: '500K+' }
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Construction',
    shortDesc: 'Infrastructure planning and project impact assessments',
    icon: Factory,
    color: '#64748b',
    stats: { projects: '30+', value: '$2B+', assessments: '100+' }
  },
  {
    id: 'transport',
    name: 'Transport & Logistics',
    shortDesc: 'Mobility analytics and supply chain optimization',
    icon: Truck,
    color: '#8b5cf6',
    stats: { projects: '20+', routes: '500+', efficiency: '+35%' }
  },
  {
    id: 'tourism',
    name: 'Tourism & Hospitality',
    shortDesc: 'Tourism market research and destination analytics',
    icon: Plane,
    color: '#ec4899',
    stats: { projects: '15+', destinations: '25+', visitors: '1M+' }
  },
  {
    id: 'technology',
    name: 'Technology & Telecommunications',
    shortDesc: 'Digital transformation research and tech adoption analytics',
    icon: Smartphone,
    color: '#3b82f6',
    stats: { projects: '25+', users: '5M+', platforms: '30+' }
  },
  {
    id: 'mining',
    name: 'Mining & Extractives',
    shortDesc: 'ESG assessments and community impact research',
    icon: Pickaxe,
    color: '#a855f7',
    stats: { projects: '20+', sites: '15+', communities: '50+' }
  },
  {
    id: 'nutrition',
    name: 'Food & Nutrition',
    shortDesc: 'Nutrition assessments and food systems analytics',
    icon: Utensils,
    color: '#f97316',
    stats: { projects: '40+', programs: '25+', beneficiaries: '1M+' }
  },
  {
    id: 'ngos',
    name: 'NGOs & Development',
    shortDesc: 'Program evaluation and development impact measurement',
    icon: Globe,
    color: '#06b6d4',
    stats: { projects: '150+', partners: '50+', countries: '10+' }
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    shortDesc: 'Industrial analytics and workforce optimization',
    icon: Factory,
    color: '#84cc16',
    stats: { projects: '15+', factories: '30+', efficiency: '+25%' }
  }
];

// ==================== INDUSTRIES HUB PAGE ====================
export const IndustriesHubPage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #e63946 0%, transparent 40%),
                              radial-gradient(circle at 80% 70%, #2a9d8f 0%, transparent 40%)`
          }} />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-[#e63946]" />
              <span className="text-sm font-medium text-white">Industry Expertise</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Industries We Serve
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Leveraging 25+ years of sector expertise to deliver data-driven insights 
              and strategic solutions across Tanzania's key industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Database, title: 'Data Excellence', desc: 'Rigorous data collection and analytics across all sectors' },
              { icon: Brain, title: 'Strategic Insights', desc: 'Actionable intelligence for informed decision-making' },
              { icon: Target, title: 'Sector Expertise', desc: 'Deep understanding of industry-specific challenges' },
              { icon: TrendingUp, title: 'Measurable Impact', desc: 'Evidence-based solutions that drive real outcomes' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#e63946]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#e63946]" />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{item.title}</h3>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              Explore Our Industries
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628]"
            >
              Sector-Specific Solutions
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industriesData.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/industries/${industry.id}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Header with Icon */}
                  <div 
                    className="h-32 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: industry.color + '15' }}
                  >
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: `radial-gradient(circle at 80% 20%, ${industry.color}40 0%, transparent 50%)`
                    }} />
                    <industry.icon 
                      className="w-16 h-16 transition-transform group-hover:scale-110" 
                      style={{ color: industry.color }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#0a1628] mb-2 group-hover:text-[#e63946] transition-colors">
                      {industry.name}
                    </h3>
                    <p className="text-[#64748b] text-sm mb-4">
                      {industry.shortDesc}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#64748b] mb-4 pt-4 border-t border-[#e2e8f0]">
                      {Object.entries(industry.stats).map(([key, value], i) => (
                        <div key={key} className="flex items-center gap-1">
                          <span className="font-bold" style={{ color: industry.color }}>{value}</span>
                          <span className="capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#0a1628] group-hover:text-[#e63946] transition-colors">
                      Explore Solutions
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
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
              Don't See Your Industry?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Our methodology expertise transfers across sectors. Contact us to discuss 
              how we can apply our data analytics and research capabilities to your specific industry.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ==================== INDUSTRY DETAIL PAGE TEMPLATE ====================
const IndustryDetailPage = ({ industry }) => {
  // Generate solutions based on industry
  const solutions = [
    {
      title: 'Market Intelligence & Analytics',
      desc: `Comprehensive market research and competitive analysis for the ${industry.name.toLowerCase()} sector to identify growth opportunities.`,
      icon: LineChart
    },
    {
      title: 'Performance Monitoring',
      desc: 'Real-time dashboards and KPI tracking to measure operational efficiency and program effectiveness.',
      icon: BarChart3
    },
    {
      title: 'Strategic Planning Support',
      desc: 'Data-driven insights and scenario modeling to inform strategic decisions and resource allocation.',
      icon: Target
    },
    {
      title: 'Impact Assessment',
      desc: 'Rigorous evaluation frameworks to measure outcomes and demonstrate value to stakeholders.',
      icon: TrendingUp
    }
  ];

  const capabilities = [
    'Large-scale survey design and implementation',
    'Real-time data collection and quality assurance',
    'Advanced statistical modeling and analysis',
    'Interactive dashboard development',
    'Geographic Information System (GIS) mapping',
    'Qualitative research and stakeholder engagement',
    'Policy analysis and recommendations',
    'Capacity building and knowledge transfer'
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            style={{ backgroundColor: industry.color }}
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link to="/industries" className="hover:text-white transition-colors">Industries</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{industry.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ backgroundColor: industry.color }}
              >
                <industry.icon className="w-4 h-4" />
                Industry Solutions
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                {industry.name}
              </h1>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                {industry.shortDesc}. Empowering organizations with actionable data insights 
                and strategic intelligence for sustainable growth.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                >
                  Discuss Your Needs
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
                >
                  View Our Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div 
                className="w-72 h-72 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: industry.color + '20' }}
              >
                <industry.icon className="w-40 h-40" style={{ color: industry.color }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap justify-center gap-12">
            {Object.entries(industry.stats).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold" style={{ color: industry.color }}>{value}</div>
                <div className="text-[#64748b] capitalize text-sm">{key}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
                Industry Challenges
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
                Navigating Complexity with Data
              </h2>
              <p className="text-[#64748b] mb-6 leading-relaxed">
                The {industry.name.toLowerCase()} sector in Tanzania faces unique challenges 
                that require evidence-based decision making. From resource constraints to 
                rapidly changing market dynamics, organizations need reliable data to stay competitive.
              </p>
              <div className="space-y-4">
                {[
                  'Limited access to reliable, actionable data',
                  'Difficulty measuring program impact and ROI',
                  'Complex stakeholder environments',
                  'Rapidly evolving regulatory landscape',
                  'Need for strategic foresight and planning'
                ].map((challenge, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: industry.color + '20' }}
                    >
                      <CheckCircle2 className="w-4 h-4" style={{ color: industry.color }} />
                    </div>
                    <span className="text-[#0a1628]">{challenge}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0a1628] rounded-2xl p-8 text-white"
            >
              <Lightbulb className="w-12 h-12 text-[#e63946] mb-6" />
              <h3 className="text-2xl font-bold mb-4">The DataVision Advantage</h3>
              <p className="text-white/70 mb-6">
                We transform these challenges into opportunities through rigorous research 
                methodologies, advanced analytics, and deep sector expertise. Our approach 
                combines quantitative precision with qualitative insight.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Years Experience', value: '25+' },
                  { label: 'Trained Analysts', value: '500+' },
                  { label: 'Projects Delivered', value: '1,000+' },
                  { label: 'Client Satisfaction', value: '98%' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-[#e63946]">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm"
            >
              How We Help
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-[#0a1628]"
            >
              Solutions for {industry.name}
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-[#f8fafc] rounded-xl p-8 hover:bg-[#0a1628] transition-all duration-500"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors"
                  style={{ backgroundColor: industry.color + '20' }}
                >
                  <solution.icon className="w-7 h-7" style={{ color: industry.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] group-hover:text-white mb-3 transition-colors">
                  {solution.title}
                </h3>
                <p className="text-[#64748b] group-hover:text-white/70 transition-colors">
                  {solution.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4 text-sm">
                Our Capabilities
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Technology-Enabled Research Excellence
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                We leverage cutting-edge technology and proven methodologies to deliver 
                insights that drive real business outcomes. Our capabilities span the 
                entire research and analytics value chain.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
              >
                Explore All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid gap-3">
                {capabilities.map((cap, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#2a9d8f] flex-shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Industries */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0a1628]">Explore Related Industries</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {industriesData
              .filter(ind => ind.id !== industry.id)
              .slice(0, 4)
              .map((ind, index) => (
                <motion.div
                  key={ind.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/industries/${ind.id}`}
                    className="group block bg-[#f8fafc] rounded-xl p-6 hover:bg-[#0a1628] transition-all duration-300"
                  >
                    <ind.icon className="w-10 h-10 mb-4" style={{ color: ind.color }} />
                    <h3 className="font-bold text-[#0a1628] group-hover:text-white mb-2 transition-colors">
                      {ind.name}
                    </h3>
                    <span className="flex items-center gap-1 text-sm text-[#64748b] group-hover:text-white/70 transition-colors">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
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
              Ready to Transform Your {industry.name} Operations?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Let's discuss how data-driven insights can help you achieve your strategic objectives 
              and drive measurable impact.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#e63946] px-8 py-4 font-semibold uppercase tracking-wider hover:bg-[#0a1628] hover:text-white transition-all"
              >
                Schedule a Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/insights"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-[#e63946] transition-all"
              >
                Read Industry Insights
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ==================== INDIVIDUAL INDUSTRY PAGES ====================
export const AgricultureIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'agriculture')} />;
export const EducationIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'education')} />;
export const HealthIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'health')} />;
export const WASHIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'wash')} />;
export const PublicSectorIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'public-sector')} />;
export const EnergyIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'energy')} />;
export const FinancialServicesIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'financial-services')} />;
export const InfrastructureIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'infrastructure')} />;
export const TransportIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'transport')} />;
export const TourismIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'tourism')} />;
export const TechnologyIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'technology')} />;
export const MiningIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'mining')} />;
export const NutritionIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'nutrition')} />;
export const NGOsIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'ngos')} />;
export const ManufacturingIndustryPage = () => <IndustryDetailPage industry={industriesData.find(i => i.id === 'manufacturing')} />;

// Export industries data for navigation
export { industriesData };
