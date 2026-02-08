/**
 * Process Tab Component
 * Explains the hiring process with stages and tips
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ProcessTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="bg-[#0a1628] text-white py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">How We Hire</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Hiring Process</h1>
          <p className="text-xl text-white/80">
            We've designed our process to be transparent, fair, and efficient. Here's what to expect 
            when you apply to join DataVision.
          </p>
        </div>
      </div>
    </section>

    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {[
            {
              step: 1,
              title: 'Application Review',
              duration: '1-2 weeks',
              desc: 'Submit your CV and cover letter through our portal. Our team reviews every application carefully, looking for alignment with our values and the role requirements.',
              tips: ['Tailor your CV to the specific role', 'Highlight relevant projects and impact', 'Include a thoughtful cover letter']
            },
            {
              step: 2,
              title: 'Initial Screening',
              duration: '30-45 minutes',
              desc: 'A phone or video call with our HR team to discuss your background, motivations, and answer any questions about the role and DataVision.',
              tips: ['Research DataVision thoroughly', 'Prepare questions about the role', 'Be ready to discuss your career goals']
            },
            {
              step: 3,
              title: 'Technical Assessment',
              duration: 'Varies by role',
              desc: 'Depending on the position, you may complete a case study, data analysis exercise, or technical task that demonstrates your skills.',
              tips: ['Take time to understand the problem', 'Show your working and reasoning', 'Ask clarifying questions if needed']
            },
            {
              step: 4,
              title: 'Team Interviews',
              duration: '2-3 hours',
              desc: 'Meet with potential colleagues and leadership. This is your chance to learn about day-to-day work and for us to assess cultural fit.',
              tips: ['Prepare examples using STAR method', 'Show curiosity and ask insightful questions', 'Be authentic and yourself']
            },
            {
              step: 5,
              title: 'Offer & Onboarding',
              duration: '1-2 weeks',
              desc: 'Successful candidates receive a detailed offer. Our comprehensive onboarding ensures you are set up for success from day one.',
              tips: ['Review the offer carefully', 'Ask about growth opportunities', 'Prepare for an exciting journey!']
            }
          ].map((stage, index) => (
            <motion.div
              key={stage.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12 pb-12 border-l-2 border-[#e2e8f0] last:border-0 last:pb-0"
            >
              <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-[#e63946] text-white flex items-center justify-center font-bold">
                {stage.step}
              </div>
              <div className="ml-8">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-[#0a1628]">{stage.title}</h3>
                  <span className="px-3 py-1 bg-[#f8fafc] text-[#64748b] text-sm rounded-full">
                    {stage.duration}
                  </span>
                </div>
                <p className="text-[#64748b] mb-4">{stage.desc}</p>
                <div className="bg-[#f8fafc] rounded-lg p-4">
                  <h4 className="font-semibold text-[#0a1628] mb-2 text-sm">Tips for Success:</h4>
                  <ul className="space-y-1">
                    {stage.tips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#64748b] text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#2a9d8f]" />
                        {tip}
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

    {/* FAQ Section */}
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0a1628]">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: 'How long does the hiring process typically take?', a: 'From application to offer, our process typically takes 3-4 weeks depending on the role and availability of all parties.' },
            { q: 'Can I apply for multiple positions?', a: 'Yes, you can apply for multiple roles that match your skills and interests. We review each application independently.' },
            { q: 'Do you offer remote work options?', a: 'We offer hybrid arrangements for many roles. Some positions may require full-time presence in Dar es Salaam.' },
            { q: 'What should I include in my cover letter?', a: 'Focus on why you\'re interested in DataVision specifically, how your experience aligns with the role, and what unique perspective you bring.' }
          ].map((faq, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-[#e2e8f0]">
              <h3 className="font-bold text-[#0a1628] mb-2">{faq.q}</h3>
              <p className="text-[#64748b]">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

export default ProcessTab;
