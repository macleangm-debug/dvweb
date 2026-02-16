import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Target, Users, Globe, Award, BookOpen, ChevronRight,
  MapPin, Calendar, ExternalLink, Linkedin, Twitter,
  Building2, GraduationCap, Heart, Lightbulb, Shield,
  Handshake, TrendingUp, CheckCircle
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AboutPage = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    axios.get(`${API}/team`).then(res => setTeam(res.data)).catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif max-w-3xl">
              Going the Extra Mile Since 1998
            </h1>
            <p className="text-white/80 max-w-2xl">
              DataVision International is headquartered in Dar es Salaam with a global reach, 
              offering professional consulting services in Data Analytics, Research & Statistics, 
              Technology Solutions, and Professional Training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6 font-serif">Our Story</h2>
              <p className="text-[#64748b] mb-4">
                Founded in 1998, DataVision International is an outcome of the recognition that sustainable 
                development can be accelerated by providing requirement-driven, data-focused solutions.
              </p>
              <p className="text-[#64748b] mb-4">
                Since its establishment, the company has been fast growing in terms of delivery of 
                services and customer base across Africa and globally. The best part of our history includes our ability to 
                adapt to the fast-changing demands of our clients.
              </p>
              <p className="text-[#64748b]">
                We work with a "Customer First, Open Mind" philosophy. This relates to our 
                implementation process which makes our clients an integral part of the project 
                to ensure effective capacity building and transfer of the deliverables.
              </p>
            </div>
            <div className="bg-[#f8fafc] p-8">
              <h3 className="text-xl font-bold text-[#0a1628] mb-6 font-serif">Our Values</h3>
              <div className="space-y-4">
                {[
                  { title: 'Excellence', desc: 'Delivering the highest quality in everything we do', icon: Award },
                  { title: 'Innovation', desc: 'Embracing new technologies and methodologies', icon: Lightbulb },
                  { title: 'Integrity', desc: 'Operating with transparency and ethical standards', icon: Shield },
                  { title: 'Collaboration', desc: 'Partnering closely with clients and stakeholders', icon: Handshake },
                  { title: 'Impact', desc: 'Creating meaningful change through our work', icon: TrendingUp }
                ].map((value, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#e63946]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-5 h-5 text-[#e63946]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0a1628]">{value.title}</h4>
                      <p className="text-sm text-[#64748b]">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 border-l-4 border-[#e63946]"
            >
              <Target className="w-12 h-12 text-[#e63946] mb-4" />
              <h3 className="text-2xl font-bold text-[#0a1628] mb-4 font-serif">Our Mission</h3>
              <p className="text-[#64748b]">
                To accelerate Africa's development by providing cutting-edge data solutions, 
                research capabilities, and technology tools that enable evidence-based decision making 
                and sustainable impact across all sectors.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 border-l-4 border-[#2a9d8f]"
            >
              <Globe className="w-12 h-12 text-[#2a9d8f] mb-4" />
              <h3 className="text-2xl font-bold text-[#0a1628] mb-4 font-serif">Our Vision</h3>
              <p className="text-[#64748b]">
                To be Africa's leading data and research company, recognized globally for our 
                innovative solutions, exceptional quality, and transformative impact on development 
                outcomes across the continent and beyond.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] font-serif">
              Comprehensive Solutions for Data-Driven Impact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: 'Research & M&E', 
                desc: 'Baseline surveys, impact evaluations, monitoring systems, and complex research design',
                icon: BookOpen
              },
              { 
                title: 'Data Analytics', 
                desc: 'Advanced analytics, AI/ML modeling, data visualization, and business intelligence',
                icon: TrendingUp
              },
              { 
                title: 'Software Solutions', 
                desc: 'FieldForce, Survey360, DataPulse, and custom software development',
                icon: Building2
              },
              { 
                title: 'Capacity Building', 
                desc: 'Professional training, technical assistance, and knowledge transfer programs',
                icon: GraduationCap
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] p-6 hover:border-l-4 hover:border-l-[#e63946] transition-all group"
              >
                <service.icon className="w-10 h-10 text-[#e63946] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{service.title}</h3>
                <p className="text-sm text-[#64748b]">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-[#0a1628] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Leadership</p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif">Meet Our Team</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.slice(0, 6).map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur rounded-lg overflow-hidden group"
              >
                <div className="aspect-square bg-gradient-to-br from-[#e63946]/20 to-[#2a9d8f]/20 flex items-center justify-center">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-20 h-20 text-white/30" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-[#e63946] text-sm mb-3">{member.title}</p>
                  {member.bio && (
                    <p className="text-white/70 text-sm line-clamp-3">{member.bio}</p>
                  )}
                  <div className="flex gap-3 mt-4">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {team.length > 6 && (
            <div className="text-center mt-12">
              <Link 
                to="/team"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold"
              >
                View Full Team <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Global Presence</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
                Working Across Africa and Beyond
              </h2>
              <p className="text-[#64748b] mb-8">
                With headquarters in Dar es Salaam, Tanzania, we've successfully delivered projects 
                across 20+ African countries and worked with partners globally. Our local expertise 
                combined with international standards ensures exceptional outcomes.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#f8fafc] p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#e63946] mb-1">20+</div>
                  <p className="text-sm text-[#64748b]">Countries Served</p>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#2a9d8f] mb-1">500+</div>
                  <p className="text-sm text-[#64748b]">Projects Delivered</p>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#0a1628] mb-1">50+</div>
                  <p className="text-sm text-[#64748b]">Global Partners</p>
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-lg">
                  <div className="text-3xl font-bold text-[#f59e0b] mb-1">25+</div>
                  <p className="text-sm text-[#64748b]">Years of Excellence</p>
                </div>
              </div>
            </div>
            <div className="bg-[#f8fafc] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-[#0a1628] mb-6 font-serif">Our Offices</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-[#e63946] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#0a1628]">Headquarters</h4>
                    <p className="text-sm text-[#64748b]">
                      Plot 15, Block 45, Mikocheni B<br />
                      P.O. Box 79094, Dar es Salaam, Tanzania
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-[#2a9d8f] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#0a1628]">Regional Office</h4>
                    <p className="text-sm text-[#64748b]">
                      Westlands, Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6 font-serif">
            Ready to Work With Us?
          </h2>
          <p className="text-[#64748b] max-w-2xl mx-auto mb-8">
            Whether you need research services, data solutions, or technology platforms, 
            our team is ready to help you achieve your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact" 
              className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all hover:-translate-y-1"
            >
              Contact Us
            </Link>
            <Link 
              to="/careers" 
              className="border-2 border-[#0a1628] text-[#0a1628] px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#0a1628] hover:text-white transition-all"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
