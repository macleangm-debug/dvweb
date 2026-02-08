/**
 * Careers Overview Tab Component
 * Main landing view for the careers section
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Briefcase, Users, Globe, Heart, Award, 
  Search, Star, MapPin, Clock, Brain, TrendingUp,
  Quote, CheckCircle2, Play
} from 'lucide-react';
import { openPositions } from './careersData';

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

export default OverviewTab;
