/**
 * Register Tab Component
 * Expert registration form wrapper
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import ExpertRegistrationForm from '../ExpertRegistrationForm';

const RegisterTab = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <section className="py-12 bg-[#f8fafc]">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#f59e0b]/10 text-[#f59e0b] px-4 py-2 rounded-full mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">Expert Registration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">
            Join Our Expert Network
          </h1>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Complete the form below to register as a sector expert. Our team will review 
            your profile and match you with relevant project opportunities.
          </p>
        </div>
        <ExpertRegistrationForm />
      </div>
    </section>
  </motion.div>
);

export default RegisterTab;
