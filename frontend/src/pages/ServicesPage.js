import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Brain, Globe, Code, Database, LineChart,
  Users, GraduationCap, Shield, Cpu, Cloud, MapPin,
  FileText, Target, Zap, ArrowRight, CheckCircle,
  Building, Leaf, Heart, BookOpen, Smartphone, Layers,
  TrendingUp, PieChart, Network, Bot, Lock, Sparkles
} from 'lucide-react';

const ServicesPage = () => {
  const serviceCategories = [
    {
      id: 'research',
      title: 'Research & M&E',
      subtitle: 'Evidence-based insights for impact',
      icon: BarChart3,
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      description: 'Comprehensive research and monitoring & evaluation services to measure impact and drive evidence-based decision making.',
      services: [
        { name: 'Baseline & Endline Surveys', description: 'Rigorous impact measurement' },
        { name: 'Impact Evaluations', description: 'RCTs, quasi-experimental designs' },
        { name: 'Process Evaluations', description: 'Implementation fidelity assessment' },
        { name: 'Qualitative Research', description: 'FGDs, KIIs, ethnographic studies' },
        { name: 'Real-time Monitoring', description: 'Digital M&E systems' },
        { name: 'Theory of Change', description: 'Logic models & results frameworks' }
      ]
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics & AI',
      subtitle: 'Transform data into decisions',
      icon: Brain,
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      description: 'Advanced analytics, machine learning, and AI solutions to unlock insights from your data.',
      services: [
        { name: 'Predictive Analytics', description: 'Forecast trends & outcomes' },
        { name: 'Machine Learning Models', description: 'Custom ML solutions' },
        { name: 'Natural Language Processing', description: 'Text analysis & sentiment' },
        { name: 'Computer Vision', description: 'Image & video analysis' },
        { name: 'BI Dashboards', description: 'Interactive visualizations' },
        { name: 'Data Engineering', description: 'ETL, pipelines, data lakes' }
      ],
      trending: true
    },
    {
      id: 'software',
      title: 'Software Solutions',
      subtitle: 'Custom digital tools',
      icon: Code,
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      description: 'Build powerful software solutions tailored to your needs, from mobile apps to enterprise systems.',
      services: [
        { name: 'FieldForce', description: 'Mobile data collection platform', product: true },
        { name: 'Survey360', description: 'Survey management system', product: true },
        { name: 'Custom Web Apps', description: 'Bespoke web applications' },
        { name: 'Mobile Applications', description: 'iOS & Android development' },
        { name: 'API Development', description: 'RESTful APIs & integrations' },
        { name: 'Database Design', description: 'Scalable data architecture' }
      ]
    },
    {
      id: 'geospatial',
      title: 'Geospatial & GIS',
      subtitle: 'Location intelligence',
      icon: MapPin,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Leverage spatial data for better planning, targeting, and resource allocation.',
      services: [
        { name: 'GIS Mapping', description: 'Custom maps & visualizations' },
        { name: 'Spatial Analysis', description: 'Hotspot & cluster analysis' },
        { name: 'Remote Sensing', description: 'Satellite imagery analysis' },
        { name: 'GPS Data Collection', description: 'Field-based geo-tagging' },
        { name: 'Territory Planning', description: 'Optimize coverage areas' },
        { name: 'Location Analytics', description: 'Movement & accessibility' }
      ],
      trending: true
    },
    {
      id: 'digital-transformation',
      title: 'Digital Transformation',
      subtitle: 'Modernize your operations',
      icon: Zap,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600',
      description: 'Guide your organization through digital transformation with strategy, implementation, and change management.',
      services: [
        { name: 'Digital Strategy', description: 'Roadmap & vision development' },
        { name: 'Process Automation', description: 'RPA & workflow automation' },
        { name: 'Cloud Migration', description: 'Move to modern infrastructure' },
        { name: 'Legacy Modernization', description: 'Update outdated systems' },
        { name: 'Digital Capacity', description: 'Staff training & adoption' },
        { name: 'Change Management', description: 'Smooth transitions' }
      ],
      trending: true
    },
    {
      id: 'capacity-building',
      title: 'Capacity Building',
      subtitle: 'Empower your team',
      icon: GraduationCap,
      color: 'blue',
      gradient: 'from-blue-500 to-sky-600',
      description: 'Build organizational and individual capacity through training, mentoring, and technical assistance.',
      services: [
        { name: 'Data Literacy Training', description: 'Analytics skills for all' },
        { name: 'M&E System Design', description: 'Build internal M&E capacity' },
        { name: 'Research Methods', description: 'Quantitative & qualitative' },
        { name: 'Software Training', description: 'FieldForce, Survey360, etc.' },
        { name: 'Leadership Development', description: 'Management & strategy' },
        { name: 'Technical Assistance', description: 'Embedded support' }
      ]
    }
  ];

  const additionalServices = [
    { icon: Heart, name: 'Health Systems', description: 'Health facility assessments, HMIS, disease surveillance' },
    { icon: Leaf, name: 'Climate & Environment', description: 'Environmental impact, climate adaptation, sustainability' },
    { icon: Building, name: 'Governance', description: 'Institutional assessments, policy analysis, reforms' },
    { icon: TrendingUp, name: 'Economic Analysis', description: 'Cost-benefit, value for money, economic modeling' },
    { icon: Shield, name: 'Social Protection', description: 'Safety nets, targeting, vulnerability assessments' },
    { icon: BookOpen, name: 'Education', description: 'Learning assessments, EdTech, curriculum development' }
  ];

  const whyChooseUs = [
    { icon: Globe, title: '25+ Years Experience', description: 'Deep expertise across Africa and beyond' },
    { icon: Users, title: '500+ Expert Network', description: 'Access to specialized consultants' },
    { icon: Target, title: '200+ Projects/Year', description: 'Proven track record of delivery' },
    { icon: Shield, title: 'Trusted by Leaders', description: 'World Bank, USAID, UN agencies' }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2d4a] to-[#0a1628] text-white py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[#2dd4bf] font-semibold uppercase tracking-wider">Our Services</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6 font-serif">
                Comprehensive Solutions for{' '}
                <span className="text-[#2dd4bf]">Data & Development</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                From research and analytics to software development and capacity building — 
                we provide end-to-end solutions that drive impact.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#e63946] text-white px-8 py-4 font-semibold hover:bg-[#d02835] transition-all"
              >
                Discuss Your Project <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-24">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    {category.trending && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Trending
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold text-[#0a1628] mb-2 font-serif">{category.title}</h2>
                  <p className="text-[#2dd4bf] font-medium mb-4">{category.subtitle}</p>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <Link 
                    to={`/services/${category.id}`}
                    className="inline-flex items-center gap-2 text-[#0a1628] font-semibold hover:text-[#e63946] transition-colors"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className={`grid grid-cols-2 gap-4 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  {category.services.map((service, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-xl border hover:shadow-md transition-all ${
                        service.product 
                          ? `bg-gradient-to-br ${category.gradient} text-white border-transparent` 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className={`font-semibold mb-1 ${service.product ? 'text-white' : 'text-[#0a1628]'}`}>
                        {service.name}
                      </h4>
                      <p className={`text-sm ${service.product ? 'text-white/80' : 'text-gray-600'}`}>
                        {service.description}
                      </p>
                      {service.product && (
                        <Link 
                          to={`/solutions/${service.name.toLowerCase().replace(/\s/g, '')}`}
                          className="inline-flex items-center gap-1 text-xs mt-2 text-white/90 hover:text-white"
                        >
                          View Product <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#e63946] font-semibold uppercase tracking-wider">Sector Expertise</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 font-serif">
              Deep Experience Across Sectors
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#2dd4bf]/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#0a1628] rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-[#2dd4bf]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0a1628] mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#2dd4bf] font-semibold uppercase tracking-wider">Why DataVision</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 font-serif">
              Your Partner for Impact
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#2dd4bf]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#2dd4bf]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#e63946] to-[#d02835] text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how our services can help you achieve your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact"
              className="bg-white text-[#e63946] px-8 py-4 font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
            >
              Request a Proposal <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/network/join"
              className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-all"
            >
              Join Expert Network
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
