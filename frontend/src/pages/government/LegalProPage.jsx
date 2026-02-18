/**
 * LegalPro - Lawyers Management & Digital Stamps System
 * Landing page for the legal profession registry platform
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale,
  FileText,
  Users,
  Shield,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Lock,
  Zap,
  Database,
  Smartphone,
  Play,
  ChevronRight,
  Award,
  Stamp,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
  BadgeCheck,
  QrCode
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const LegalProPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registry');

  const features = [
    {
      icon: Users,
      title: 'Lawyer Registry',
      description: 'Comprehensive database of all registered lawyers with credentials, practice areas, and disciplinary records.'
    },
    {
      icon: Stamp,
      title: 'Digital Stamps',
      description: 'Secure, verifiable digital stamps for legal documents with blockchain-backed authenticity verification.'
    },
    {
      icon: BadgeCheck,
      title: 'License Management',
      description: 'Streamlined process for license applications, renewals, and continuing education tracking.'
    },
    {
      icon: Building2,
      title: 'Law Firm Registry',
      description: 'Track law firms, partnerships, and legal entities with associated practitioners.'
    },
    {
      icon: GraduationCap,
      title: 'CLE Tracking',
      description: 'Monitor continuing legal education requirements and compliance for all registered lawyers.'
    },
    {
      icon: QrCode,
      title: 'Document Verification',
      description: 'QR code-based verification system for validating digitally stamped legal documents.'
    }
  ];

  const modules = [
    { id: 'registry', name: 'Lawyer Registry', icon: Users },
    { id: 'stamps', name: 'Digital Stamps', icon: Stamp },
    { id: 'licensing', name: 'Licensing', icon: Award },
    { id: 'firms', name: 'Law Firms', icon: Building2 },
    { id: 'cle', name: 'CLE Tracking', icon: GraduationCap }
  ];

  const stats = [
    { value: '15K+', label: 'Registered Lawyers' },
    { value: '2M+', label: 'Documents Stamped' },
    { value: '99.99%', label: 'Verification Accuracy' },
    { value: '< 5s', label: 'Stamp Generation' }
  ];

  const stampFeatures = [
    'Unique cryptographic signature for each stamp',
    'Instant verification via QR code',
    'Tamper-proof blockchain record',
    'Integration with court systems',
    'Mobile stamp generation',
    'Audit trail for all stamps'
  ];

  return (
    <div className="min-h-screen bg-slate-900" data-testid="legalpro-landing">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LegalPro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Sales
            </Link>
            <Button 
              onClick={() => navigate('/solutions/legalpro/demo')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Request Demo
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-6">
                Legal Profession Management
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Digitize Legal Practice with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Smart Stamps
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                LegalPro transforms how law societies manage lawyer registrations and document 
                authentication with secure digital stamps and comprehensive registry management.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/solutions/legalpro/demo')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
                >
                  Schedule Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Overview
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-slate-400 text-sm">LegalPro Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-400 text-sm">Active Lawyers</p>
                      <p className="text-2xl font-bold text-white">15,428</p>
                      <p className="text-blue-400 text-xs">+89 this month</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Stamps Today</p>
                      <p className="text-2xl font-bold text-white">3,847</p>
                      <p className="text-cyan-400 text-xs">+12% from yesterday</p>
                    </div>
                  </div>
                  
                  {/* Digital Stamp Preview */}
                  <div className="bg-gradient-to-br from-blue-900/50 to-slate-800 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-300 text-sm font-medium">Latest Digital Stamp</span>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Verified</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center border-2 border-blue-500/50">
                        <Stamp className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">John K. Mwangi</p>
                        <p className="text-slate-400 text-sm">ADV/2024/15428</p>
                        <p className="text-slate-500 text-xs">Stamped 2 mins ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">CLE Compliance Rate</span>
                      <span className="text-blue-400 font-medium">92.1%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[92.1%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-blue-400">{stat.value}</p>
                <p className="text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Comprehensive Legal Profession Management
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From registration to document verification, LegalPro provides complete management of the legal profession.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Digital Stamps Section */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
                Digital Stamps
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-6">
                Secure, Verifiable Digital Stamps
              </h2>
              <p className="text-slate-300 mb-6">
                Replace traditional paper stamps with cryptographically secure digital stamps 
                that can be instantly verified by anyone.
              </p>
              <div className="space-y-3">
                {stampFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activeTab === module.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <module.icon className="w-6 h-6" />
                  <span className="text-xs">{module.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-br from-blue-900/50 to-slate-800 border border-blue-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Modernize Your Legal Profession Registry
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join law societies and bar associations that have transformed their operations with LegalPro.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              Contact Sales
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-slate-400">LegalPro by DataVision International</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalProPage;
