/**
 * PeopleHub - HR Management System
 * Landing page for the human resources platform
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
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
  Calendar,
  Award,
  Briefcase,
  UserPlus,
  Heart,
  TrendingUp,
  Building2,
  DollarSign,
  ClipboardList,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const PeopleHubPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: UserPlus,
      title: 'Recruitment & Onboarding',
      description: 'Streamline hiring with applicant tracking, interview scheduling, and automated onboarding workflows.'
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Centralized employee database with profiles, documents, and organizational hierarchy.'
    },
    {
      icon: Clock,
      title: 'Time & Attendance',
      description: 'Track working hours, manage shifts, and automate attendance with biometric integration.'
    },
    {
      icon: DollarSign,
      title: 'Payroll Processing',
      description: 'Automated payroll calculations, tax compliance, and direct deposit management.'
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      description: 'Handle leave requests, track balances, and manage absence policies effortlessly.'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Training programs, skill assessments, and career development tracking.'
    }
  ];

  const stats = [
    { value: '5K+', label: 'Companies' },
    { value: '500K+', label: 'Employees Managed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '30+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen bg-slate-900" data-testid="peoplehub-landing">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">PeopleHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
              Contact Sales
            </Link>
            <Button 
              onClick={() => navigate('/solutions/peoplehub/demo')}
              className="bg-purple-500 hover:bg-purple-600 text-white"
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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6">
                HR Management System
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your People,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Your Greatest Asset
                </span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                PeopleHub is the all-in-one HR platform that helps you hire, manage, 
                and develop your workforce. From recruitment to retirement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/solutions/peoplehub/inquiry')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
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
                  <span className="ml-4 text-slate-400 text-sm">PeopleHub Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <p className="text-purple-400 text-sm">Total Employees</p>
                      <p className="text-2xl font-bold text-white">2,847</p>
                      <p className="text-green-400 text-xs">+42 this month</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Open Positions</p>
                      <p className="text-2xl font-bold text-white">23</p>
                      <p className="text-pink-400 text-xs">156 applications</p>
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Employee Satisfaction</span>
                      <span className="text-purple-400 font-medium">4.6/5.0</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <Award className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300 text-sm font-medium">5 Employee Anniversaries</p>
                      <p className="text-green-400/70 text-xs">This week - Don't forget to celebrate!</p>
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
                <p className="text-4xl font-bold text-purple-400">{stat.value}</p>
                <p className="text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
            Features
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Complete HR Solution for Modern Businesses
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage your workforce effectively and efficiently.
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
              <Card className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-purple-400" />
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
        <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 border border-purple-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your HR Operations?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that trust PeopleHub to manage their most valuable asset.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/solutions/peoplehub/inquiry')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
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
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-slate-400">PeopleHub by DataVision International</span>
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

export default PeopleHubPage;
