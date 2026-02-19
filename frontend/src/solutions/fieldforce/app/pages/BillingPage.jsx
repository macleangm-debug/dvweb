/**
 * FieldForce Billing Page - Integrated with Canva-style Layout
 * Dark theme with Manrope font
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  Zap,
  Building2,
  Sparkles,
  Smartphone,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  RefreshCw,
  Database,
  MapPin,
  FileText,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { FieldForceCanvaLayout } from '../../../../pages/solutions/fieldforce/FieldForceAppLayout';
import '../App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// FieldForce-specific pricing plans
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals testing the platform',
    monthlyPrice: 0,
    icon: Smartphone,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-400',
    limits: { users: 1, submissions: 100, storage: '500MB' },
    features: ['1 user', '100 submissions/month', '500MB storage', 'Basic forms', 'GPS tracking']
  },
  {
    id: 'team',
    name: 'Team',
    description: 'For small field teams',
    monthlyPrice: 29,
    icon: Users,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    limits: { users: 5, submissions: 1000, storage: '5GB' },
    features: ['Up to 5 users', '1,000 submissions/month', '5GB storage', 'Offline sync', 'Photo capture', 'Basic analytics']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing organizations',
    monthlyPrice: 79,
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    popular: true,
    limits: { users: 20, submissions: 5000, storage: '25GB' },
    features: ['Up to 20 users', '5,000 submissions/month', '25GB storage', 'Advanced forms', 'Real-time tracking', 'Custom branding']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large operations',
    monthlyPrice: 199,
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    limits: { users: -1, submissions: -1, storage: 'Unlimited' },
    features: ['Unlimited users', 'Unlimited submissions', 'Unlimited storage', 'API access', 'SSO integration', 'Dedicated support', 'SLA guarantee']
  }
];

// Usage Progress Bar Component
const UsageBar = ({ used, limit, label }) => {
  const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === -1;
  const isWarning = percentage > 70;
  const isCritical = percentage > 90;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">{label}</span>
        <span className={`text-sm font-medium ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white/90'}`}>
          {isUnlimited ? 'Unlimited' : `${used} / ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isCritical ? 'bg-gradient-to-r from-red-500 to-red-400' :
              isWarning ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
              'bg-gradient-to-r from-emerald-500 to-teal-400'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export function FieldForceBillingPage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadUsage();
  }, []);

  const loadUsage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('fieldforce_token') || localStorage.getItem('ff_token') || localStorage.getItem('dv_token');
      const response = await axios.get(`${API_URL}/api/fieldforce/billing/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsage(response.data);
    } catch (error) {
      console.error('Failed to load usage:', error);
      // Set mock usage data for demo
      setUsage({
        current_plan: 'free',
        billing_period: { start: new Date().toISOString(), end: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
        submissions: { used: 45, limit: 100 },
        users: { used: 1, limit: 1 },
        storage: { used: 125, limit: 500 }
      });
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = PLANS.find(p => p.id === (usage?.current_plan || 'free')) || PLANS[0];

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  const confirmUpgrade = async () => {
    setUpgrading(true);
    try {
      // Mock upgrade - would integrate with Stripe in production
      toast.success(`Upgraded to ${selectedPlan.name} plan! (Demo mode - Stripe integration pending)`);
      setUpgradeDialogOpen(false);
      await loadUsage();
    } catch (error) {
      toast.error('Failed to upgrade plan');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <FieldForceCanvaLayout>
        <div className="space-y-6 animate-pulse" data-testid="billing-loading">
          <div className="h-8 w-48 bg-white/5 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl"></div>)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white/5 rounded-xl"></div>)}
          </div>
        </div>
      </FieldForceCanvaLayout>
    );
  }

  return (
    <FieldForceCanvaLayout>
      <div className="space-y-8 font-['Manrope',sans-serif]" data-testid="fieldforce-billing-page">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Billing & Subscription</h1>
            <p className="text-white/60 mt-1 text-sm">Manage your FieldForce subscription and monitor usage</p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${currentPlan.color} text-white text-sm font-medium shadow-lg`}>
            <currentPlan.icon className="w-4 h-4" />
            {currentPlan.name} Plan
          </div>
        </div>

        {/* Current Usage Overview */}
        <div className="bg-[#1e293b] rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Current Usage</h2>
                <p className="text-white/50 text-sm">This billing period</p>
              </div>
              <button 
                onClick={loadUsage}
                className="ml-auto p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/70">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Submissions</span>
              </div>
              <UsageBar 
                used={usage?.submissions?.used || 0} 
                limit={currentPlan.limits.submissions}
                label="Monthly submissions"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/70">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Team Members</span>
              </div>
              <UsageBar 
                used={usage?.users?.used || 0} 
                limit={currentPlan.limits.users}
                label="Active users"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/70">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <UsageBar 
                used={usage?.storage?.used || 0} 
                limit={typeof currentPlan.limits.storage === 'string' ? parseInt(currentPlan.limits.storage) : currentPlan.limits.storage}
                label="Storage (MB)"
              />
            </div>
          </div>
        </div>

        {/* Billing Period Card */}
        <div className="bg-[#1e293b] rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Billing Period</p>
              <p className="text-xs text-white/50">
                {usage?.billing_period?.start ? new Date(usage.billing_period.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'} 
                {' — '}
                {usage?.billing_period?.end ? new Date(usage.billing_period.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
            {currentPlan.monthlyPrice > 0 && (
              <div className="text-right">
                <p className="text-sm text-white/50">Monthly cost</p>
                <p className="text-xl font-bold text-white">${currentPlan.monthlyPrice}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan, index) => {
              const Icon = plan.icon;
              const isCurrentPlan = plan.id === currentPlan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium shadow-lg">
                        <Zap className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className={`h-full bg-[#1e293b] rounded-2xl border transition-all duration-300 ${
                    plan.popular ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 
                    isCurrentPlan ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 
                    'border-white/10 hover:border-white/20'
                  }`}>
                    <div className="p-6 space-y-4">
                      {/* Plan Icon & Name */}
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{plan.name}</h3>
                          <p className="text-xs text-white/50">{plan.description}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-white">${plan.monthlyPrice}</span>
                          <span className="text-white/50 text-sm">/month</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 pt-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.textColor}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Button */}
                      <div className="pt-4">
                        {isCurrentPlan ? (
                          <div className="w-full py-2.5 px-4 rounded-xl bg-white/5 text-center text-white/50 text-sm font-medium border border-white/10">
                            Current Plan
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleUpgrade(plan)}
                            className={`w-full py-2.5 px-4 rounded-xl bg-gradient-to-r ${plan.color} text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg`}
                            data-testid={`upgrade-to-${plan.id}`}
                          >
                            {plan.monthlyPrice > currentPlan.monthlyPrice ? 'Upgrade' : 'Downgrade'}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-200">Demo Mode</p>
              <p className="text-xs text-amber-300/70 mt-1">
                Payment processing is currently in demo mode. Stripe integration will be enabled when API keys are configured.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="bg-[#1e293b] rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
                <p className="text-white/50 text-sm">Manage your billing information</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-white/50">Expires 12/26</p>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Upgrade Dialog */}
        {upgradeDialogOpen && selectedPlan && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">
                  {selectedPlan.monthlyPrice > currentPlan.monthlyPrice ? 'Upgrade' : 'Change'} to {selectedPlan.name}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  {selectedPlan.monthlyPrice > currentPlan.monthlyPrice 
                    ? `You'll be charged $${selectedPlan.monthlyPrice}/month starting today.`
                    : `Your plan will change at the end of your current billing period.`
                  }
                </p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-sm text-white/60">New monthly cost</p>
                    <p className="text-2xl font-bold text-white">${selectedPlan.monthlyPrice}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${selectedPlan.color} text-white text-sm font-medium`}>
                    {selectedPlan.name}
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-0 flex gap-3">
                <button 
                  onClick={() => setUpgradeDialogOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmUpgrade}
                  disabled={upgrading}
                  className={`flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r ${selectedPlan.color} text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50`}
                >
                  {upgrading ? 'Processing...' : 'Confirm Change'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </FieldForceCanvaLayout>
  );
}

export default FieldForceBillingPage;
