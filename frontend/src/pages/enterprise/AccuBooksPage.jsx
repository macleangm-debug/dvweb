/**
 * AccuBooks - Accounting & Finance Management System
 * Landing page for the enterprise accounting platform
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calculator,
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
  Play,
  ChevronRight,
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  PieChart,
  Wallet,
  Building2,
  Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const AccuBooksPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Receipt,
      title: 'Invoicing & Billing',
      description: 'Create professional invoices, track payments, and automate recurring billing cycles.'
    },
    {
      icon: Calculator,
      title: 'General Ledger',
      description: 'Complete double-entry accounting with chart of accounts, journal entries, and audit trails.'
    },
    {
      icon: Wallet,
      title: 'Expense Management',
      description: 'Track expenses, manage budgets, and automate expense approvals and reimbursements.'
    },
    {
      icon: TrendingUp,
      title: 'Financial Reporting',
      description: 'Generate balance sheets, income statements, cash flow, and custom financial reports.'
    },
    {
      icon: CreditCard,
      title: 'Bank Reconciliation',
      description: 'Automatic bank feeds, smart matching, and one-click reconciliation.'
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Support for multiple currencies with automatic exchange rate updates.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Businesses' },
    { value: '99.9%', label: 'Uptime' },
    { value: '$2B+', label: 'Transactions Processed' },
    { value: '50+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen bg-slate-900" data-testid="accubooks-landing">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AccuBooks</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Sales
            </Link>
            <Button 
              onClick={() => navigate('/solutions/accubooks/demo')}
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
                Enterprise Accounting
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Accounting Made{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Simple & Powerful
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                AccuBooks is the complete accounting solution for growing businesses. 
                From invoicing to financial reporting, manage your finances with confidence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/solutions/accubooks/inquiry')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
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
                  <span className="ml-4 text-slate-400 text-sm">AccuBooks Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-400 text-sm">Revenue (MTD)</p>
                      <p className="text-2xl font-bold text-white">$847,320</p>
                      <p className="text-green-400 text-xs">+18.2% from last month</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Outstanding</p>
                      <p className="text-2xl font-bold text-white">$124,580</p>
                      <p className="text-amber-400 text-xs">23 pending invoices</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Cash Flow Health</span>
                      <span className="text-green-400 font-medium">Healthy</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
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
            Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            From small businesses to enterprises, AccuBooks scales with your needs.
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

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-br from-blue-900/50 to-slate-800 border border-blue-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Your Accounting?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses managing their finances with AccuBooks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/solutions/accubooks/inquiry')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-500/50 text-blue-300 hover:bg-blue-500/10"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-slate-400">AccuBooks by DataVision International</span>
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

export default AccuBooksPage;
