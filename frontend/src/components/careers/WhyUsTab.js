/**
 * Why Us Tab Component
 * Showcases company values, impact, and growth opportunities
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Lightbulb, CheckCircle2, 
  BookOpen, Globe, TrendingUp 
} from 'lucide-react';

const WhyUsTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Hero */}
    <section className="relative bg-[#0a1628] text-white py-24 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Why Work Here</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            More Than a Job.<br />A Mission.
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            At DataVision, your work directly shapes policies and programs that improve 
            lives across Africa. Join us and be part of something bigger.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Impact Section */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Impact</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
            Work That Matters
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BarChart3,
              title: 'Shape Policy',
              desc: 'Our research informs government policies, donor strategies, and development programs across 15+ countries.',
              stat: '30+ policies influenced'
            },
            {
              icon: Users,
              title: 'Reach Millions',
              desc: 'Programs designed with our data reach millions of beneficiaries—farmers, students, patients, and communities.',
              stat: '50M+ lives impacted'
            },
            {
              icon: Lightbulb,
              title: 'Drive Innovation',
              desc: 'We pioneer new methodologies in data collection, analytics, and visualization for the African context.',
              stat: '8 software products built'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 bg-[#f8fafc] rounded-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#e63946]/10 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-8 h-8 text-[#e63946]" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">{item.title}</h3>
              <p className="text-[#64748b] mb-4">{item.desc}</p>
              <p className="text-[#e63946] font-bold">{item.stat}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-6">
              What We Stand For
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Excellence', desc: 'We pursue the highest standards in everything we do—from data quality to client delivery.' },
                { title: 'Integrity', desc: 'We maintain unwavering ethical standards and transparency in all our research.' },
                { title: 'Impact', desc: 'We measure success by the real-world change our work creates.' },
                { title: 'Collaboration', desc: 'We believe the best insights come from diverse perspectives working together.' },
                { title: 'Innovation', desc: 'We continuously explore new methods and technologies to solve complex challenges.' }
              ].map((value, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#e63946] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#0a1628] mb-1">{value.title}</h4>
                    <p className="text-[#64748b]">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Our Commitment to You</h3>
            <div className="space-y-4">
              {[
                'Investment in your professional development',
                'Work that has real-world impact',
                'Collaborative and supportive culture',
                'Competitive compensation and benefits',
                'Work-life balance and flexibility',
                'Clear career progression pathways'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#e63946] rounded-full" />
                  <span className="text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Growth Section */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Growth & Development</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">
            Invest in Your Future
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, title: 'Learning Budget', desc: 'Annual allocation for courses, certifications, and conferences' },
            { icon: Users, title: 'Mentorship', desc: 'Paired with senior colleagues for guidance and growth' },
            { icon: Globe, title: 'International Exposure', desc: 'Work with global partners and across countries' },
            { icon: TrendingUp, title: 'Career Paths', desc: 'Defined progression from analyst to director levels' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-[#e2e8f0] rounded-xl hover:border-[#e63946] transition-all"
            >
              <item.icon className="w-10 h-10 text-[#e63946] mb-4" />
              <h3 className="font-bold text-[#0a1628] mb-2">{item.title}</h3>
              <p className="text-[#64748b] text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export default WhyUsTab;
