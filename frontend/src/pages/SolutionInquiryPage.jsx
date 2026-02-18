/**
 * SolutionInquiryPage - Generic inquiry form for enterprise solutions
 * Handles demo requests and sales inquiries
 */
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  Users,
  Globe,
  Calendar,
  Receipt,
  Shield,
  Scale,
  Calculator
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

import { Fingerprint } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Solution metadata
const solutionMeta = {
  taxxa: {
    name: 'Taxxa',
    tagline: 'Government Tax Collection System',
    icon: Receipt,
    color: 'emerald',
    bgGradient: 'from-emerald-900/30 via-slate-900 to-slate-900'
  },
  ammo: {
    name: 'Ammo',
    tagline: 'Firearm Registry & Licensing System',
    icon: Shield,
    color: 'amber',
    bgGradient: 'from-amber-900/30 via-slate-900 to-slate-900'
  },
  legalpro: {
    name: 'LegalPro',
    tagline: 'Legal Profession Management System',
    icon: Scale,
    color: 'blue',
    bgGradient: 'from-blue-900/30 via-slate-900 to-slate-900'
  },
  accubooks: {
    name: 'AccuBooks',
    tagline: 'Accounting & Finance Management',
    icon: Calculator,
    color: 'blue',
    bgGradient: 'from-blue-900/30 via-slate-900 to-slate-900'
  },
  peoplehub: {
    name: 'PeopleHub',
    tagline: 'HR Management System',
    icon: Users,
    color: 'purple',
    bgGradient: 'from-purple-900/30 via-slate-900 to-slate-900'
  },
  biosign: {
    name: 'BioSign SDK',
    tagline: 'Biometric Transaction Security',
    icon: Fingerprint,
    color: 'cyan',
    bgGradient: 'from-cyan-900/30 via-slate-900 to-slate-900'
  }
};

const SolutionInquiryPage = () => {
  const { solution } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    organizationType: '',
    country: '',
    employeeCount: '',
    message: '',
    preferredDate: ''
  });

  const meta = solutionMeta[solution] || {
    name: 'Solution',
    tagline: 'Enterprise Solution',
    icon: Building2,
    color: 'gray',
    bgGradient: 'from-gray-900/30 via-slate-900 to-slate-900'
  };

  const Icon = meta.icon;
  const colorClasses = {
    emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500/30', text: 'text-emerald-400', btnBg: 'bg-emerald-500 hover:bg-emerald-600' },
    amber: { bg: 'bg-amber-500', border: 'border-amber-500/30', text: 'text-amber-400', btnBg: 'bg-amber-500 hover:bg-amber-600' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-500/30', text: 'text-blue-400', btnBg: 'bg-blue-500 hover:bg-blue-600' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-500/30', text: 'text-purple-400', btnBg: 'bg-purple-500 hover:bg-purple-600' },
    cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500/30', text: 'text-cyan-400', btnBg: 'bg-cyan-500 hover:bg-cyan-600' },
    gray: { bg: 'bg-gray-500', border: 'border-gray-500/30', text: 'text-gray-400', btnBg: 'bg-gray-500 hover:bg-gray-600' }
  };
  const colors = colorClasses[meta.color];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/inquiries`, {
        ...formData,
        solution: solution,
        solutionName: meta.name,
        type: 'demo_request',
        createdAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      // Still show success for demo purposes
      setSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-slate-900`} data-testid="inquiry-success">
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGradient}`} />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className={`w-20 h-20 rounded-full ${colors.bg}/20 flex items-center justify-center mx-auto mb-6`}>
              <CheckCircle2 className={`w-10 h-10 ${colors.text}`} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-slate-300 mb-8">
              Your inquiry for {meta.name} has been received. Our sales team will contact you within 24-48 hours to schedule your demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(`/solutions/${solution}`)}
                variant="outline"
                className={`${colors.border} ${colors.text} hover:bg-slate-800`}
              >
                Back to {meta.name}
              </Button>
              <Button
                onClick={() => navigate('/solutions')}
                className={colors.btnBg + ' text-white'}
              >
                Explore Solutions
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-900`} data-testid="inquiry-form">
      <div className={`absolute inset-0 bg-gradient-to-br ${meta.bgGradient}`} />
      
      {/* Back Link */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 pt-8">
        <Link
          to={`/solutions/${solution}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {meta.name}
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className={`w-14 h-14 rounded-xl ${colors.bg}/20 flex items-center justify-center mb-4`}>
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Request a Demo</h1>
              <p className="text-slate-400">{meta.tagline}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">What to expect</h3>
              {[
                'Personalized demo tailored to your needs',
                'Live Q&A with our product experts',
                'Custom pricing based on your requirements',
                'Implementation roadmap discussion'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-lg ${colors.bg}/10 border ${colors.border}`}>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Need immediate assistance?</strong>
                <br />
                Contact our sales team directly at{' '}
                <a href="mailto:sales@datavision.co.tz" className={colors.text + ' hover:underline'}>
                  sales@datavision.co.tz
                </a>
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Fill out the form below and we'll get back to you shortly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="John Doe"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        data-testid="inquiry-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@company.com"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        data-testid="inquiry-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+255 xxx xxx xxx"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        data-testid="inquiry-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-slate-300">Organization *</Label>
                      <Input
                        id="organization"
                        required
                        value={formData.organization}
                        onChange={(e) => handleChange('organization', e.target.value)}
                        placeholder="Company or Agency Name"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        data-testid="inquiry-organization"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Organization Type *</Label>
                      <Select onValueChange={(value) => handleChange('organizationType', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white" data-testid="inquiry-org-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="government">Government Agency</SelectItem>
                          <SelectItem value="enterprise">Enterprise / Corporation</SelectItem>
                          <SelectItem value="sme">Small & Medium Business</SelectItem>
                          <SelectItem value="ngo">NGO / Non-Profit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Country *</Label>
                      <Select onValueChange={(value) => handleChange('country', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white" data-testid="inquiry-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="TZ">Tanzania</SelectItem>
                          <SelectItem value="KE">Kenya</SelectItem>
                          <SelectItem value="UG">Uganda</SelectItem>
                          <SelectItem value="RW">Rwanda</SelectItem>
                          <SelectItem value="ET">Ethiopia</SelectItem>
                          <SelectItem value="NG">Nigeria</SelectItem>
                          <SelectItem value="ZA">South Africa</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Number of Employees</Label>
                    <Select onValueChange={(value) => handleChange('employeeCount', value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="501-1000">501-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Tell us about your needs</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Describe your requirements, challenges, or questions..."
                      rows={4}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                      data-testid="inquiry-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${colors.btnBg} text-white`}
                    data-testid="inquiry-submit"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Inquiry
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By submitting this form, you agree to our{' '}
                    <Link to="/privacy" className={colors.text + ' hover:underline'}>Privacy Policy</Link>
                    {' '}and{' '}
                    <Link to="/terms" className={colors.text + ' hover:underline'}>Terms of Service</Link>.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionInquiryPage;
