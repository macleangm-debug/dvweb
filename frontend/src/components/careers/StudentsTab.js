/**
 * Students Tab Component
 * Information for students and graduates about career programs
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, GraduationCap, Calendar, Award, CheckCircle2 
} from 'lucide-react';

const StudentsTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Students & Graduates</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Launch Your Career in Research</h1>
            <p className="text-xl text-white/80 mb-8">
              Start your career with Africa's leading research consultancy. Our graduate programs 
              offer hands-on experience, mentorship, and a fast track to meaningful work.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 font-semibold hover:bg-white hover:text-[#0a1628] transition-all"
            >
              Apply for Graduate Program <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '20+', label: 'Graduates hired/year' },
                  { value: '90%', label: 'Retention rate' },
                  { value: '18', label: 'Months to first promotion' },
                  { value: '100%', label: 'Mentorship coverage' }
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-bold text-[#e63946]">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Programs */}
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0a1628]">Our Programs</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Graduate Research Associate',
              duration: '2-year program',
              icon: GraduationCap,
              desc: 'Full-time role for recent graduates. Work on real projects while receiving structured training and mentorship.',
              features: ['Rotations across departments', 'Dedicated mentor', 'Training curriculum', 'Performance-based progression']
            },
            {
              title: 'Summer Internship',
              duration: '3 months',
              icon: Calendar,
              desc: 'Intensive summer program for penultimate year students. Gain hands-on experience with live projects.',
              features: ['Real project work', 'Networking events', 'Skills workshops', 'Full-time offer pathway']
            },
            {
              title: 'Research Fellowship',
              duration: '6-12 months',
              icon: Award,
              desc: 'For exceptional postgraduate researchers. Conduct original research while contributing to our projects.',
              features: ['Independent research', 'Publication support', 'Conference attendance', 'Transition to full-time']
            }
          ].map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#f8fafc] rounded-2xl p-8 hover:shadow-lg transition-all"
            >
              <program.icon className="w-12 h-12 text-[#e63946] mb-4" />
              <h3 className="text-xl font-bold text-[#0a1628] mb-1">{program.title}</h3>
              <p className="text-[#e63946] text-sm font-semibold mb-4">{program.duration}</p>
              <p className="text-[#64748b] mb-6">{program.desc}</p>
              <ul className="space-y-2">
                {program.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#64748b] text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* What We Look For */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">What We Look For</p>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">
              Your Degree is Just the Start
            </h2>
            <p className="text-[#64748b] mb-8">
              We look beyond grades to find candidates with the curiosity, drive, and potential 
              to become future leaders in research and analytics.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Intellectual Curiosity', desc: 'Genuine interest in understanding complex problems' },
                { title: 'Analytical Thinking', desc: 'Ability to break down problems and work with data' },
                { title: 'Communication Skills', desc: 'Clear written and verbal communication' },
                { title: 'Team Orientation', desc: 'Collaborative spirit and willingness to learn' },
                { title: 'Initiative', desc: 'Proactive approach to challenges and opportunities' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#e63946] flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-[#0a1628]">{item.title}:</span>
                    <span className="text-[#64748b]"> {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a1628] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Eligible Degrees</h3>
            <p className="text-white/70 mb-6">
              We welcome applications from various academic backgrounds, including:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Statistics', 'Economics', 'Data Science', 'Public Health',
                'Development Studies', 'Social Sciences', 'Computer Science', 'Mathematics',
                'Agriculture', 'Environmental Science', 'Public Policy', 'Business'
              ].map((degree, i) => (
                <div key={i} className="bg-white/10 rounded-lg px-3 py-2 text-sm text-center">
                  {degree}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

export default StudentsTab;
