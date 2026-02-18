/**
 * Taxxa - Government Tax Collection Solution
 * Landing page for the tax management platform
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Receipt,
  Building2,
  Shield,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  PieChart,
  Database,
  Smartphone,
  Play,
  ChevronRight
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const TaxxaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('collection');

  const features = [
    {
      icon: Receipt,
      title: 'Automated Tax Collection',
      description: 'Streamline tax collection with automated billing, reminders, and payment processing across multiple channels.'
    },
    {
      icon: Database,
      title: 'Taxpayer Registry',
      description: 'Comprehensive database of taxpayers with complete profiles, tax history, and compliance tracking.'
    },
    {
      icon: BarChart3,
      title: 'Revenue Analytics',
      description: 'Real-time dashboards showing collection rates, compliance metrics, and revenue forecasts.'
    },
    {
      icon: Shield,
      title: 'Fraud Detection',
      description: 'AI-powered algorithms to detect tax evasion, anomalies, and suspicious filing patterns.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Payments',
      description: 'Accept tax payments via mobile money, bank transfers, and card payments with instant receipts.'
    },
    {
      icon: FileText,
      title: 'Compliance Management',
      description: 'Track filing deadlines, send automated reminders, and manage penalties for non-compliance.'
    }
  ];

  const modules = [
    { id: 'collection', name: 'Tax Collection', icon: Receipt },
    { id: 'registry', name: 'Taxpayer Registry', icon: Users },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'analytics', name: 'Analytics', icon: PieChart },
    { id: 'mobile', name: 'Mobile Services', icon: Smartphone }
  ];

  const stats = [
    { value: '45%', label: 'Increase in Collection' },
    { value: '99.9%', label: 'System Uptime' },
    { value: '2M+', label: 'Taxpayers Managed' },
    { value: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-slate-900" data-testid="taxxa-landing">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Taxxa</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Sales
            </Link>
            <Button 
              onClick={() => navigate('/solutions/taxxa/demo')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
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
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-6">
                Government Tax Solution
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Modern Tax Collection for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Digital Governments
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Transform your tax administration with Taxxa - the comprehensive platform for 
                automated collection, compliance monitoring, and revenue optimization.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/solutions/taxxa/demo')}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8"
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
                  <span className="ml-4 text-slate-400 text-sm">Taxxa Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <p className="text-emerald-400 text-sm">Today's Collection</p>
                      <p className="text-2xl font-bold text-white">TZS 2.4B</p>
                      <p className="text-emerald-400 text-xs">+12% from yesterday</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Compliance Rate</p>
                      <p className="text-2xl font-bold text-white">94.2%</p>
                      <p className="text-teal-400 text-xs">+3.1% this month</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Monthly Target Progress</span>
                      <span className="text-emerald-400 font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
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
                <p className="text-4xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need for Modern Tax Administration
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From collection to compliance, Taxxa provides a complete suite of tools for government tax agencies.
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
              <Card className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Integrated Modules</h2>
            <p className="text-slate-400">Choose the modules that fit your needs</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
                  activeTab === module.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <module.icon className="w-5 h-5" />
                {module.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-br from-emerald-900/50 to-slate-800 border border-emerald-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Tax Administration?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join government agencies across Africa who have modernized their tax collection with Taxxa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
            >
              Contact Sales
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-slate-400">Taxxa by DataVision International</span>
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

export default TaxxaPage;
