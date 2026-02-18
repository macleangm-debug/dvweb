/**
 * Ammo - Private Firearm Owners Management System
 * Landing page for the firearm registry and licensing platform
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Target,
  Users,
  FileText,
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
  AlertTriangle,
  MapPin,
  Calendar,
  Fingerprint,
  Eye,
  Bell
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const AmmoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registry');

  const features = [
    {
      icon: Database,
      title: 'Firearm Registry',
      description: 'Comprehensive database of all registered firearms with ownership history, specifications, and compliance status.'
    },
    {
      icon: Users,
      title: 'Owner Management',
      description: 'Complete profiles of licensed firearm owners including background checks, training records, and renewal status.'
    },
    {
      icon: FileText,
      title: 'License Processing',
      description: 'Streamlined application, renewal, and revocation workflows with automated background verification.'
    },
    {
      icon: AlertTriangle,
      title: 'Incident Tracking',
      description: 'Track and investigate incidents involving registered firearms with full audit trails.'
    },
    {
      icon: MapPin,
      title: 'Dealer Management',
      description: 'Monitor authorized dealers, track inventory, and ensure compliance with sales regulations.'
    },
    {
      icon: Bell,
      title: 'Automated Alerts',
      description: 'Real-time notifications for license expirations, compliance issues, and security concerns.'
    }
  ];

  const modules = [
    { id: 'registry', name: 'Firearm Registry', icon: Database },
    { id: 'licensing', name: 'Licensing', icon: FileText },
    { id: 'owners', name: 'Owner Management', icon: Users },
    { id: 'dealers', name: 'Dealer Portal', icon: Target },
    { id: 'compliance', name: 'Compliance', icon: Shield }
  ];

  const stats = [
    { value: '500K+', label: 'Firearms Registered' },
    { value: '99.8%', label: 'Database Accuracy' },
    { value: '72hrs', label: 'Avg. License Processing' },
    { value: '24/7', label: 'Monitoring' }
  ];

  return (
    <div className="min-h-screen bg-slate-900" data-testid="ammo-landing">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Ammo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Sales
            </Link>
            <Button 
              onClick={() => navigate('/solutions/ammo/demo')}
              className="bg-amber-500 hover:bg-amber-600 text-white"
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
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-6">
                Government Security Solution
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Secure Firearm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                  Registry & Licensing
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Ammo provides government agencies with a comprehensive platform for managing 
                private firearm ownership, licensing, and compliance monitoring.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/solutions/ammo/demo')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8"
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
                  <span className="ml-4 text-slate-400 text-sm">Ammo Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-amber-400 text-sm">Active Licenses</p>
                      <p className="text-2xl font-bold text-white">45,892</p>
                      <p className="text-amber-400 text-xs">+234 this month</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Pending Applications</p>
                      <p className="text-2xl font-bold text-white">1,247</p>
                      <p className="text-orange-400 text-xs">12 urgent reviews</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Compliance Rate</span>
                      <span className="text-amber-400 font-medium">96.4%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[96.4%] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-red-300 text-sm font-medium">3 Expiring Licenses</p>
                      <p className="text-red-400/70 text-xs">Require immediate attention</p>
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
                <p className="text-4xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Complete Firearm Management Solution
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From registration to compliance, Ammo provides end-to-end management of private firearm ownership.
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
              <Card className="bg-slate-800/50 border-slate-700 hover:border-amber-500/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-slate-800/30 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4">
                Security & Compliance
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-6">
                Built for Government Security Standards
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: 'End-to-end encryption for all data' },
                  { icon: Fingerprint, text: 'Multi-factor authentication' },
                  { icon: Eye, text: 'Complete audit trail for all actions' },
                  { icon: Shield, text: 'Role-based access controls' },
                  { icon: Database, text: 'Secure data backup and recovery' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                    activeTab === module.id
                      ? 'bg-amber-500 text-white'
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
        <div className="bg-gradient-to-br from-amber-900/50 to-slate-800 border border-amber-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure Your Nation's Firearm Management
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join government agencies that trust Ammo for secure, compliant firearm registry management.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/contact')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8"
            >
              Contact Sales
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-amber-500/50 text-amber-300 hover:bg-amber-500/10"
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
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-slate-400">Ammo by DataVision International</span>
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

export default AmmoPage;
