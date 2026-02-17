import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiry_type: 'general',
    honeypot: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/inquiries`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        inquiry_type: 'general',
        honeypot: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[#0a1628] text-white py-24 relative noise-overlay">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-[#e63946] font-semibold uppercase tracking-wider mb-4">Get in Touch</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Let's Discuss Your Project
            </h1>
            <p className="text-white/80">
              Whether you're planning a research project, seeking a local partner, or 
              exploring collaboration opportunities, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#2a9d8f]/10 border border-[#2a9d8f] p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-[#2a9d8f] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-2 font-serif">Message Sent!</h3>
                  <p className="text-[#64748b]">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                  {/* Honeypot - Hidden from users */}
                  <div className="honeypot-field" aria-hidden="true">
                    <input
                      type="text"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({...formData, honeypot: e.target.value})}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Company/Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0a1628] mb-2">Inquiry Type</label>
                      <select
                        value={formData.inquiry_type}
                        onChange={(e) => setFormData({...formData, inquiry_type: e.target.value})}
                        className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                        data-testid="contact-type"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="consultation">Request Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all"
                      data-testid="contact-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0a1628] mb-2">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-[#e2e8f0] focus:border-[#e63946] focus:ring-1 focus:ring-[#e63946] outline-none transition-all resize-none"
                      data-testid="contact-message"
                    />
                  </div>

                  {error && (
                    <p className="text-[#e63946] text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#e63946] text-white px-8 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#d02835] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="contact-submit"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-[#f8fafc] p-8">
                <h3 className="text-lg font-bold text-[#0a1628] mb-6 font-serif">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Address</p>
                      <p className="text-sm text-[#64748b]">Garden Road, Mikocheni Area<br />Dar es Salaam, Tanzania</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Phone</p>
                      <p className="text-sm text-[#64748b]">+255 754 869 302 (24/7)</p>
                      <p className="text-sm text-[#64748b]">+255 22 2701845/6</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#e63946] mt-0.5" />
                    <div>
                      <p className="font-medium text-[#0a1628]">Email</p>
                      <a href="mailto:info@datavision.co.tz" className="text-sm text-[#e63946] hover:underline">
                        info@datavision.co.tz
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a1628] text-white p-8">
                <h3 className="text-lg font-bold mb-4 font-serif">Quick Response</h3>
                <p className="text-white/80 text-sm">
                  Our team typically responds within 24 hours. For urgent matters, 
                  please call our 24/7 support line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
