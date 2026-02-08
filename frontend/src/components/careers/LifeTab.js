/**
 * Life Tab Component
 * Showcases company culture, benefits, and team testimonials
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Users, BookOpen, Globe, Zap } from 'lucide-react';

const LifeTab = ({ teamMembers, benefits }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Life at DataVision</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Where Work Meets Purpose</h1>
          <p className="text-xl text-white/80">
            Get a glimpse into what it's really like to work here—from our culture 
            and benefits to the people who make DataVision special.
          </p>
        </div>
      </div>
    </section>

    {/* Team Testimonials */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our People</p>
          <h2 className="text-3xl font-bold text-[#0a1628]">Hear From the Team</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f8fafc] rounded-2xl p-8"
            >
              <Quote className="w-10 h-10 text-[#e63946] mb-4 opacity-30" />
              <p className="text-[#64748b] mb-6 italic">"{member.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e63946] flex items-center justify-center text-white font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-[#0a1628]">{member.name}</p>
                  <p className="text-[#64748b] text-sm">{member.role} • {member.years} years</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Benefits & Perks</p>
          <h2 className="text-3xl font-bold text-[#0a1628]">Taking Care of Our Team</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-[#e63946]/10 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-7 h-7 text-[#e63946]" />
              </div>
              <h3 className="font-bold text-[#0a1628] mb-2">{benefit.title}</h3>
              <p className="text-[#64748b] text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Culture */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Our Culture</p>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">
              Collaboration, Growth, Impact
            </h2>
            <p className="text-[#64748b] mb-6 leading-relaxed">
              Our culture is built on three pillars: genuine collaboration across teams, 
              continuous growth and learning, and a shared commitment to creating real-world impact.
            </p>
            <p className="text-[#64748b] mb-8 leading-relaxed">
              We celebrate wins together, support each other through challenges, and maintain 
              a healthy work-life balance. Whether it's a team lunch, knowledge-sharing session, 
              or field research trip—there's always something bringing us together.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Team Events', value: 'Monthly' },
                { label: 'Learning Sessions', value: 'Weekly' },
                { label: 'Feedback Cycles', value: 'Quarterly' }
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-[#f8fafc] rounded-lg">
                  <div className="text-xl font-bold text-[#e63946]">{item.value}</div>
                  <div className="text-[#64748b] text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Users, title: 'Team Lunches', desc: 'Regular team meals and celebrations' },
              { icon: BookOpen, title: 'Learning Days', desc: 'Dedicated time for skill development' },
              { icon: Globe, title: 'Field Visits', desc: 'See the impact of your work firsthand' },
              { icon: Zap, title: 'Innovation Time', desc: 'Space to explore new ideas' }
            ].map((item, i) => (
              <div key={i} className="bg-[#f8fafc] rounded-xl p-6">
                <item.icon className="w-8 h-8 text-[#e63946] mb-3" />
                <h4 className="font-bold text-[#0a1628] mb-1">{item.title}</h4>
                <p className="text-[#64748b] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export default LifeTab;
