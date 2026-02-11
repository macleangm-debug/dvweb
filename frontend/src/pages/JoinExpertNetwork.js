import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Globe, Briefcase, TrendingUp, Award, Clock,
  DollarSign, MapPin, CheckCircle, ArrowRight, Star,
  Zap, Shield, Heart, BookOpen, BarChart3, Code,
  Leaf, Building, Stethoscope, GraduationCap
} from 'lucide-react';

const JoinExpertNetwork = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    location: '',
    linkedin: '',
    cv: null
  });
  const [submitted, setSubmitted] = useState(false);

  const benefits = [
    {
      icon: Globe,
      title: 'Global Projects',
      description: 'Work on impactful projects across Africa and beyond with leading development organizations.'
    },
    {
      icon: DollarSign,
      title: 'Competitive Rates',
      description: 'Earn competitive daily rates commensurate with your expertise and experience.'
    },
    {
      icon: Clock,
      title: 'Flexible Engagement',
      description: 'Choose projects that fit your schedule. Work remotely or on-site based on project needs.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Build your portfolio with high-profile clients like World Bank, USAID, and UN agencies.'
    },
    {
      icon: Users,
      title: 'Expert Community',
      description: 'Join a network of 500+ professionals. Collaborate, learn, and grow together.'
    },
    {
      icon: Shield,
      title: 'Professional Support',
      description: 'We handle contracts, payments, and logistics. You focus on delivering excellence.'
    }
  ];

  const expertiseAreas = [
    { icon: BarChart3, name: 'Research & M&E', count: '120+ experts' },
    { icon: Code, name: 'Data Science & AI', count: '45+ experts' },
    { icon: Stethoscope, name: 'Public Health', count: '80+ experts' },
    { icon: Leaf, name: 'Agriculture & Climate', count: '65+ experts' },
    { icon: GraduationCap, name: 'Education', count: '55+ experts' },
    { icon: Building, name: 'Governance & Policy', count: '40+ experts' },
  ];

  const testimonials = [
    {
      quote: "Joining DataVision's expert network opened doors to projects I couldn't access independently. The support team is exceptional.",
      author: "Dr. Amina Okonkwo",
      role: "Senior Health Economist",
      location: "Lagos, Nigeria",
      projects: "25+ projects"
    },
    {
      quote: "The flexibility to choose projects while having stable, well-paying work is exactly what I needed. Highly recommend!",
      author: "James Kamau",
      role: "M&E Specialist",
      location: "Nairobi, Kenya",
      projects: "40+ projects"
    },
    {
      quote: "I've worked with World Bank, UNICEF, and Gates Foundation through DataVision. It's been transformative for my career.",
      author: "Dr. Fatou Diallo",
      role: "Agricultural Researcher",
      location: "Dakar, Senegal",
      projects: "18+ projects"
    }
  ];

  const requirements = [
    "Master's degree or higher in relevant field",
    "5+ years of professional experience",
    "Proven track record in development sector",
    "Strong analytical and communication skills",
    "Fluency in English (French/Swahili a plus)",
    "Ability to work independently and meet deadlines"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // In production, this would submit to the backend
    console.log('Submitting:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#1a2d4a] to-[#0a1628] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#2dd4bf] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#e63946] rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-[#2dd4bf]/20 text-[#2dd4bf] rounded-full text-sm font-medium mb-6">
                Join 500+ Expert Consultants
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-serif text-white">
                Turn Your Expertise Into{' '}
                <span className="text-[#2dd4bf]">Global Impact</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Join DataVision's Expert Network and work on transformative projects with 
                World Bank, USAID, UN agencies, and leading foundations across Africa.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#apply"
                  className="bg-[#e63946] text-white px-8 py-4 font-semibold hover:bg-[#d02835] transition-all inline-flex items-center gap-2"
                >
                  Apply Now <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="#benefits"
                  className="border-2 border-white/50 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-all"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#f8fafc] py-8 border-b">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Expert Consultants' },
              { value: '25+', label: 'Countries Represented' },
              { value: '200+', label: 'Projects Annually' },
              { value: '$2M+', label: 'Paid to Experts Yearly' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#0a1628]">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#e63946] font-semibold uppercase tracking-wider">Why Join Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 font-serif">
              Benefits of Joining Our Network
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:border-[#2dd4bf]/50 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-[#2dd4bf]/10 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-[#2dd4bf]" />
                </div>
                <h3 className="text-xl font-semibold text-[#0a1628] mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#2dd4bf] font-semibold uppercase tracking-wider">Expertise We Seek</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 font-serif">
              Join Experts in These Fields
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2dd4bf]/20 rounded-lg flex items-center justify-center">
                    <area.icon className="w-6 h-6 text-[#2dd4bf]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{area.name}</h3>
                    <p className="text-white/60 text-sm">{area.count}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-white/60 mt-8">
            Don't see your expertise? We're always looking for talented professionals in emerging fields.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-[#e63946] font-semibold uppercase tracking-wider">Success Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 font-serif">
              Hear From Our Experts
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0a1628] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0a1628]">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-[#2dd4bf]">{testimonial.location} • {testimonial.projects}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#e63946] font-semibold uppercase tracking-wider">Requirements</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mt-2 mb-6 font-serif">
                What We Look For
              </h2>
              <p className="text-gray-600 mb-8">
                We maintain high standards to ensure our clients receive world-class expertise. 
                Here's what we look for in our expert network members:
              </p>
              <ul className="space-y-4">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2dd4bf] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2d4a] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Our Clients Include</h3>
              <div className="grid grid-cols-2 gap-4">
                {['World Bank', 'USAID', 'UNICEF', 'Gates Foundation', 'DFID/FCDO', 'African Development Bank', 'WHO', 'FAO'].map((client, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2dd4bf]" />
                    <span className="text-white/80">{client}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 bg-[#0a1628]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#2dd4bf] font-semibold uppercase tracking-wider">Apply Now</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 font-serif">
                Join Our Expert Network
              </h2>
              <p className="text-white/70 mt-4">
                Fill out the form below and our team will review your application within 5 business days.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#2dd4bf]/20 border border-[#2dd4bf]/50 rounded-xl p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-[#2dd4bf] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-white/70">
                  Thank you for your interest. Our team will review your application and 
                  get back to you within 5 business days.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                      placeholder="+255 xxx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                      placeholder="Dar es Salaam, Tanzania"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Expertise *</label>
                  <select
                    required
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                  >
                    <option value="">Select your primary expertise</option>
                    <option value="research_me">Research & M&E</option>
                    <option value="data_science">Data Science & AI/ML</option>
                    <option value="public_health">Public Health</option>
                    <option value="agriculture">Agriculture & Food Security</option>
                    <option value="education">Education & EdTech</option>
                    <option value="climate">Climate & Environment</option>
                    <option value="governance">Governance & Policy</option>
                    <option value="economics">Economics & Finance</option>
                    <option value="gis">GIS & Geospatial Analysis</option>
                    <option value="software">Software Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                  >
                    <option value="">Select experience level</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10-15">10-15 years</option>
                    <option value="15-20">15-20 years</option>
                    <option value="20+">20+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2dd4bf]"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e63946] text-white py-4 font-semibold hover:bg-[#d02835] transition-all flex items-center justify-center gap-2"
                >
                  Submit Application <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2dd4bf]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-[#0a1628] mb-4">
            Have Questions?
          </h2>
          <p className="text-[#0a1628]/80 mb-6">
            Reach out to our expert recruitment team for more information.
          </p>
          <a 
            href="mailto:experts@datavision.co.tz"
            className="inline-flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 font-semibold hover:bg-[#1a2d4a] transition-all"
          >
            Contact Us <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default JoinExpertNetwork;
