import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Play,
  ChevronRight,
  FileText,
  Code,
  Database,
  Cloud,
  Lock,
  Target,
  Building2,
  Heart,
  Sprout,
  GraduationCap,
  Droplets,
  Factory,
  Truck,
  Star,
  Quote,
  ClipboardList,
  Camera,
  Mic,
  Fingerprint,
  Map
} from 'lucide-react';

// FieldForce Landing Page with all sections
export const FieldForceLandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: WifiOff,
      title: 'Offline-First Design',
      description: 'Collect data anywhere without internet connectivity. Automatic sync when back online.'
    },
    {
      icon: MapPin,
      title: 'GPS & Geofencing',
      description: 'Capture precise GPS coordinates with every submission. Set up geofences for location verification.'
    },
    {
      icon: Camera,
      title: 'Multimedia Capture',
      description: 'Photos, videos, audio recordings, and signatures - all integrated into your forms.'
    },
    {
      icon: Shield,
      title: 'Data Quality Controls',
      description: 'Built-in validation rules, skip logic, and AI-powered quality checks.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Assign enumerators to specific areas, track progress in real-time.'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Monitor data collection progress with live dashboards and alerts.'
    }
  ];

  const caseStudies = [
    {
      title: 'National Agricultural Census',
      client: 'Ministry of Agriculture, Tanzania',
      industry: 'Government',
      challenge: 'Collecting data from 5 million farming households across remote areas with limited connectivity.',
      solution: 'Deployed FieldForce on 2,500 tablets with offline capability, GPS verification, and photo documentation.',
      results: ['98.5% data accuracy rate', '45% faster than paper-based approach', '2.3M households surveyed in 6 months'],
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    },
    {
      title: 'Health Facility Assessment',
      client: 'USAID Health Program',
      industry: 'Healthcare',
      challenge: 'Assessing service readiness across 1,200 health facilities with complex questionnaires.',
      solution: 'FieldForce with skip logic, calculated fields, and automated quality checks reduced errors by 90%.',
      results: ['1,200 facilities assessed', 'Zero data loss incidents', 'Real-time reporting to stakeholders'],
      image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800'
    },
    {
      title: 'Household Water Access Survey',
      client: 'UNICEF WASH Program',
      industry: 'WASH',
      challenge: 'Mapping water access points and conducting household surveys in 8 districts.',
      solution: 'GPS-enabled surveys with photo verification of water sources and quality testing results.',
      results: ['15,000 water points mapped', '40,000 households surveyed', 'GIS dashboard for planning'],
      image: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800'
    }
  ];

  const industries = [
    { icon: Sprout, name: 'Agriculture', description: 'Farm surveys, crop assessments, livestock monitoring' },
    { icon: Heart, name: 'Healthcare', description: 'Health facility assessments, patient surveys' },
    { icon: GraduationCap, name: 'Education', description: 'School assessments, learning outcomes' },
    { icon: Droplets, name: 'WASH', description: 'Water point mapping, sanitation surveys' },
    { icon: Building2, name: 'Government', description: 'Census, civil registration, social programs' },
    { icon: Factory, name: 'Energy', description: 'Electrification surveys, utility assessments' },
    { icon: Globe, name: 'NGOs', description: 'Impact evaluations, beneficiary tracking' },
    { icon: Truck, name: 'Logistics', description: 'Field inspections, delivery verification' }
  ];

  const apiEndpoints = [
    { method: 'POST', endpoint: '/api/fieldforce/auth/login', description: 'Authenticate users' },
    { method: 'GET', endpoint: '/api/fieldforce/projects', description: 'List all projects' },
    { method: 'POST', endpoint: '/api/fieldforce/forms', description: 'Create a new form' },
    { method: 'GET', endpoint: '/api/fieldforce/forms/{id}', description: 'Get form by ID' },
    { method: 'POST', endpoint: '/api/fieldforce/submissions', description: 'Submit form data' },
    { method: 'GET', endpoint: '/api/fieldforce/submissions', description: 'List submissions' },
    { method: 'GET', endpoint: '/api/fieldforce/dashboard/stats', description: 'Get dashboard stats' }
  ];

  const testimonials = [
    {
      quote: "FieldForce transformed our data collection process. The offline capability was a game-changer for our rural surveys.",
      author: "Dr. Sarah Kimani",
      title: "M&E Director",
      organization: "World Vision East Africa",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "The GPS verification and photo capture features ensure data quality that was impossible with paper forms.",
      author: "James Mwangi",
      title: "Research Manager",
      organization: "Kenya Red Cross",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo on white background */}
            <Link to="/" className="flex items-center">
              <div className="bg-white rounded px-3 py-2">
                <img 
                  src="/datavision-logo-cropped.png" 
                  alt="DataVision International" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>

            {/* Back to Solutions link */}
            <Link 
              to="/solutions" 
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Back to Solutions</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#1e293b] to-[#0f172a] text-white overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 pt-40 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-teal-400 font-semibold uppercase tracking-wider text-sm">FieldForce</span>
              </div>
              
              <h1 className="font-barlow text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight" data-testid="fieldforce-hero-title">
                Mobile Data Collection
                <span className="text-teal-400"> Built for the Field</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Enterprise-grade mobile data collection platform with offline capability, 
                GPS tracking, and real-time analytics. Trusted by organizations globally.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/solutions/fieldforce/app/login"
                  className="bg-teal-500 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-teal-600 transition-all hover:-translate-y-1 flex items-center gap-2"
                  data-testid="fieldforce-start-btn"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => setActiveTab('demo')}
                  className="border-2 border-white/30 text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-white/50 text-sm mb-4">Trusted by leading organizations</p>
                <div className="flex flex-wrap gap-6 items-center">
                  <span className="text-white/60 font-semibold">World Bank</span>
                  <span className="text-white/60 font-semibold">USAID</span>
                  <span className="text-white/60 font-semibold">UNICEF</span>
                  <span className="text-white/60 font-semibold">WHO</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Phone mockup */}
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl mx-auto w-72">
                  <div className="bg-gray-800 rounded-[2.5rem] p-4 h-[500px] relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-b-xl"></div>
                    
                    {/* App UI */}
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">FieldForce</span>
                        <WifiOff className="w-4 h-4 text-orange-400" />
                      </div>
                      
                      <div className="bg-teal-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-teal-400 text-sm font-medium mb-2">
                          <ClipboardList className="w-4 h-4" />
                          Active Survey
                        </div>
                        <div className="text-white text-sm">Household Survey 2024</div>
                        <div className="text-white/60 text-xs mt-1">15/50 completed</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-teal-400" />
                          <div className="text-white text-sm">GPS Captured</div>
                          <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                          <Camera className="w-4 h-4 text-teal-400" />
                          <div className="text-white text-sm">3 Photos</div>
                          <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                          <Mic className="w-4 h-4 text-teal-400" />
                          <div className="text-white text-sm">Audio Note</div>
                          <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                        </div>
                      </div>
                      
                      <button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-sm">
                        Submit Survey
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -right-10 top-20 bg-white rounded-lg p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Data Synced</div>
                      <div className="text-xs text-gray-500">15 submissions uploaded</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="features">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
              Powerful Features for Field Data Collection
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to collect high-quality data in challenging field conditions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors">
                  <feature.icon className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 bg-white" id="case-studies">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">Case Studies</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 mb-4">
              Success Stories from the Field
            </h2>
            <p className="text-gray-600 text-lg">
              See how organizations are using FieldForce to transform their data collection.
            </p>
          </div>
          
          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <img 
                    src={study.image} 
                    alt={study.title}
                    className="rounded-xl shadow-lg w-full h-80 object-cover"
                  />
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
                    {study.industry}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-2">{study.title}</h3>
                  <p className="text-gray-500 mb-4">{study.client}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-[#0a1628] mb-1">Challenge</h4>
                      <p className="text-gray-600 text-sm">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0a1628] mb-1">Solution</h4>
                      <p className="text-gray-600 text-sm">{study.solution}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-[#0a1628] mb-2">Results</h4>
                    <ul className="space-y-2">
                      {study.results.map((result, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" />
                          {result}
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

      {/* Target Industries Section */}
      <section className="py-20 bg-[#0a1628] text-white" id="industries">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-400 font-semibold uppercase tracking-wider text-sm">Industries</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              Built for Every Sector
            </h2>
            <p className="text-white/70 text-lg">
              FieldForce is trusted by organizations across diverse industries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{industry.name}</h3>
                <p className="text-white/60 text-sm">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section className="py-20 bg-gray-50" id="api">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">API</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 mb-4">
                Powerful REST API
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Integrate FieldForce with your existing systems using our comprehensive REST API. 
                Automate workflows, sync data, and build custom integrations.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628]">RESTful Design</h4>
                    <p className="text-sm text-gray-500">Standard HTTP methods and JSON responses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628]">JWT Authentication</h4>
                    <p className="text-sm text-gray-500">Secure token-based authentication</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0a1628]">Real-time Webhooks</h4>
                    <p className="text-sm text-gray-500">Get notified of new submissions instantly</p>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/solutions/fieldforce/docs"
                className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
              >
                View Full Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-[#0a1628] rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white/50 text-sm ml-2">API Endpoints</span>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-white/80 truncate">{endpoint.endpoint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 mb-4">
              What Our Clients Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl"
              >
                <Quote className="w-10 h-10 text-teal-500/20 mb-4" />
                <p className="text-gray-700 text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-[#0a1628]">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                    <div className="text-sm text-teal-600">{testimonial.organization}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
              PRICING
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your field data collection needs. All plans include core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900">$0</div>
                <div className="text-gray-500 text-sm">Forever free</div>
                <p className="text-gray-600 text-sm mt-2">For individuals and small projects</p>
              </div>
              <ul className="space-y-3 mb-6">
                {['1 project', '100 submissions/month', 'Basic form builder', 'GPS capture', 'Photo capture', 'Community support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/solutions/fieldforce/app/login"
                className="block w-full py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Start Free
              </Link>
            </div>

            {/* Starter Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900">$29</div>
                <div className="text-gray-500 text-sm">/month</div>
                <p className="text-gray-600 text-sm mt-2">For growing teams</p>
              </div>
              <ul className="space-y-3 mb-6">
                {['5 projects', '1,000 submissions/month', 'Advanced form builder', 'Skip logic', 'Offline sync', 'Email support', 'Data export'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/solutions/fieldforce/app/login"
                className="block w-full py-3 text-center bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="bg-teal-600 text-white rounded-xl p-6 shadow-xl relative transform scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold">$79</div>
                <div className="text-teal-200 text-sm">/month</div>
                <p className="text-teal-100 text-sm mt-2">For professional teams</p>
              </div>
              <ul className="space-y-3 mb-6">
                {['Unlimited projects', '10,000 submissions/month', 'Everything in Starter', 'Team management', 'Real-time analytics', 'Priority support', 'API access'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-teal-100">
                    <CheckCircle2 className="w-4 h-4 text-teal-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/solutions/fieldforce/app/login"
                className="block w-full py-3 text-center bg-white text-teal-700 font-semibold rounded-lg hover:bg-gray-100 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900">Custom</div>
                <div className="text-gray-500 text-sm">Contact us</div>
                <p className="text-gray-600 text-sm mt-2">For large organizations</p>
              </div>
              <ul className="space-y-3 mb-6">
                {['Unlimited everything', 'Custom integrations', 'Dedicated support', 'On-premise option', 'SLA guarantee', 'Training included', 'White-label option'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to="/contact"
                className="block w-full py-3 text-center border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Field Operations?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations using FieldForce to collect high-quality data in the field.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/solutions/fieldforce/app/login"
              className="bg-white text-teal-700 px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-gray-100 transition-all hover:-translate-y-1 flex items-center gap-2"
              data-testid="fieldforce-cta-btn"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-white/10 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FieldForceLandingPage;
