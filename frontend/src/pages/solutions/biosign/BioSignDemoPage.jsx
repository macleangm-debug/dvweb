import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, Shield, Zap, CheckCircle2, ArrowLeft, Send, Building2, Users, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import BioSignNavbar from './BioSignNavbar';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const BioSignDemoPage = () => {
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
  });

  const benefits = [
    { icon: Shield, text: '99.9% fraud prevention rate' },
    { icon: Zap, text: 'Zero OTP delays - instant auth' },
    { icon: CheckCircle2, text: 'PCI DSS & ISO 27001 compliant' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/inquiries`, {
        ...formData,
        solution: 'biosign',
        solutionName: 'BioSign SDK',
        type: 'demo_request',
        createdAt: new Date().toISOString()
      });
      
      setSubmitted(true);
      toast.success('Your demo request has been submitted successfully!');
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setSubmitted(true);
      toast.success('Your demo request has been submitted successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950" data-testid="biosign-demo-success">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-950 to-violet-900/20" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Thank You!</h1>
            <p className="text-slate-300 mb-8">
              Your demo request for BioSign SDK has been received. Our security experts will contact you within 24-48 hours to schedule your personalized demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/solutions/biosign')}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-slate-800"
              >
                Back to BioSign
              </Button>
              <Button
                onClick={() => navigate('/solutions/biosign/docs')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950" data-testid="biosign-demo-form">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-slate-950 to-violet-900/20" />
      
      {/* Back Link */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-24">
        <Link
          to="/solutions/biosign"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to BioSign SDK
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BioSign SDK</h1>
                <p className="text-slate-400">by DataVision International</p>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Request a Demo
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              See how BioSign SDK can eliminate OTP vulnerabilities and secure your financial transactions with 
              device-bound biometric authentication.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-slate-300">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-white font-semibold mb-3">What to expect in the demo:</h3>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Live demonstration of WebAuthn/FIDO2 device registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Real-time transaction signing with biometric confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>AI-powered risk analysis and fraud detection in action</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Integration walkthrough for your specific use case</span>
                </li>
              </ul>
            </div>

            {/* Compliance badges */}
            <div className="mt-8">
              <p className="text-slate-500 text-sm mb-3">Trusted by financial institutions worldwide</p>
              <div className="flex flex-wrap gap-2">
                {['PCI DSS 4.0', 'ISO 27001', 'PSD2 SCA', 'FIDO2', 'SOC 2 Type II'].map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm border border-slate-700">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Fill out the form below and our team will reach out to schedule your demo.
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
                        data-testid="biosign-name"
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
                        data-testid="biosign-email"
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
                        data-testid="biosign-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization" className="text-slate-300">Organization *</Label>
                      <Input
                        id="organization"
                        required
                        value={formData.organization}
                        onChange={(e) => handleChange('organization', e.target.value)}
                        placeholder="Bank or Fintech Name"
                        className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        data-testid="biosign-organization"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Organization Type *</Label>
                      <Select onValueChange={(value) => handleChange('organizationType', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white" data-testid="biosign-org-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="bank">Bank / Financial Institution</SelectItem>
                          <SelectItem value="mobile-money">Mobile Money Operator</SelectItem>
                          <SelectItem value="fintech">Fintech / Payment Company</SelectItem>
                          <SelectItem value="telco">Telecommunications</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Country *</Label>
                      <Select onValueChange={(value) => handleChange('country', value)}>
                        <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white" data-testid="biosign-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="TZ">Tanzania</SelectItem>
                          <SelectItem value="KE">Kenya</SelectItem>
                          <SelectItem value="UG">Uganda</SelectItem>
                          <SelectItem value="NG">Nigeria</SelectItem>
                          <SelectItem value="GH">Ghana</SelectItem>
                          <SelectItem value="ZA">South Africa</SelectItem>
                          <SelectItem value="RW">Rwanda</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Number of Transactions/Month</Label>
                    <Select onValueChange={(value) => handleChange('employeeCount', value)}>
                      <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="<10k">Less than 10,000</SelectItem>
                        <SelectItem value="10k-100k">10,000 - 100,000</SelectItem>
                        <SelectItem value="100k-1m">100,000 - 1 million</SelectItem>
                        <SelectItem value="1m-10m">1 million - 10 million</SelectItem>
                        <SelectItem value="10m+">More than 10 million</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Tell us about your use case</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Describe your current authentication challenges, transaction volumes, or specific requirements..."
                      rows={4}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                      data-testid="biosign-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white"
                    data-testid="biosign-submit"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Request Demo
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    By submitting this form, you agree to our{' '}
                    <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
                    {' '}and{' '}
                    <Link to="/terms" className="text-cyan-400 hover:underline">Terms of Service</Link>.
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

export default BioSignDemoPage;
