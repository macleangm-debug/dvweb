/**
 * Experts Tab Component
 * Information about the Expert Network with sector expertise areas
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Star, CheckCircle2, MapPin, Clock 
} from 'lucide-react';
import { expertSectors } from './careersData';

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
              { title: 'Agricultural Economist', sector: 'Agriculture & Food Security', location: 'Tanzania / Remote', duration: '3-6 months', desc: 'Support value chain analysis for horticulture sector development project.' },
              { title: 'Health Systems Specialist', sector: 'Health & Pharmaceuticals', location: 'East Africa', duration: '4 months', desc: 'Lead health facility assessment across multiple regions.' },
              { title: 'M&E Expert', sector: 'Monitoring & Evaluation', location: 'Remote', duration: '2 months', desc: 'Design M&E framework for large-scale education program.' },
              { title: 'WASH Engineer', sector: 'Water, Sanitation & Hygiene', location: 'Tanzania', duration: '3 months', desc: 'Technical assessment of rural water infrastructure.' },
              { title: 'Gender Specialist', sector: 'Gender & Social Development', location: 'East Africa', duration: '2 months', desc: 'Gender analysis for agricultural development program.' },
              { title: 'Data Scientist', sector: 'Data Science & Analytics', location: 'Remote', duration: 'Ongoing', desc: 'Machine learning support for survey data analysis.' }
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

export default ExpertsTab;
