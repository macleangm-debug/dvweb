import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  Zap,
  Building2,
  Sparkles,
  Activity,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  RefreshCw,
  Database,
  Clock,
  Server
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { Progress } from '../../../../components/ui/progress';
import { Skeleton } from '../../../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// DataPulse-specific pricing plans
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'For testing and evaluation',
    monthlyPrice: 0,
    icon: Activity,
    color: 'from-gray-500 to-gray-600',
    limits: { dataSources: 2, eventsPerDay: 1000, retentionDays: 7, users: 1 },
    features: ['2 data sources', '1K events/day', '7-day retention', 'Basic alerts', 'Email notifications']
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For startups and small teams',
    monthlyPrice: 49,
    icon: Zap,
    color: 'from-indigo-500 to-blue-500',
    limits: { dataSources: 10, eventsPerDay: 50000, retentionDays: 30, users: 5 },
    features: ['10 data sources', '50K events/day', '30-day retention', '5 team members', 'Slack integration', 'Custom dashboards']
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'For growing businesses',
    monthlyPrice: 149,
    icon: Sparkles,
    color: 'from-purple-500 to-violet-500',
    popular: true,
    limits: { dataSources: 50, eventsPerDay: 500000, retentionDays: 90, users: 20 },
    features: ['50 data sources', '500K events/day', '90-day retention', '20 team members', 'API access', 'Advanced analytics']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    monthlyPrice: 499,
    icon: Building2,
    color: 'from-slate-600 to-slate-700',
    limits: { dataSources: -1, eventsPerDay: -1, retentionDays: 365, users: -1 },
    features: ['Unlimited sources', 'Unlimited events', '1-year retention', 'Unlimited users', 'SSO/SAML', 'Dedicated support', 'SLA guarantee']
  }
];

export function DataPulseBillingPage() {
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
      const token = localStorage.getItem('dp_token') || localStorage.getItem('dv_token');
      const response = await axios.get(`${API_URL}/api/datapulse/billing/usage`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsage(response.data);
    } catch (error) {
      console.error('Failed to load usage:', error);
      // Set mock usage data for demo
      setUsage({
        current_plan: 'free',
        billing_period: { start: new Date().toISOString(), end: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
        dataSources: { used: 1, limit: 2 },
        eventsToday: { used: 432, limit: 1000 },
        retentionDays: 7,
        users: { used: 1, limit: 1 }
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

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num/1000).toFixed(1)}K`;
    return num.toString();
  };

  const UsageCard = ({ title, used, limit, icon: Icon, suffix = '' }) => {
    const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
    const isUnlimited = limit === -1;
    
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{title}</span>
            </div>
            <Badge variant={percentage > 80 ? 'destructive' : 'secondary'} className="text-xs">
              {isUnlimited ? 'Unlimited' : `${formatNumber(used)}/${formatNumber(limit)}${suffix}`}
            </Badge>
          </div>
          {!isUnlimited && (
            <Progress value={percentage} className="h-2" />
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-900 min-h-screen" data-testid="datapulse-billing-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-slate-400 mt-1">Manage your DataPulse subscription and usage</p>
        </div>
        <Badge className={`bg-gradient-to-r ${currentPlan.color} text-white px-4 py-1`}>
          {currentPlan.name} Plan
        </Badge>
      </div>

      {/* Current Usage */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Current Usage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <UsageCard 
            title="Data Sources" 
            used={usage?.dataSources?.used || 0} 
            limit={currentPlan.limits.dataSources}
            icon={Database}
          />
          <UsageCard 
            title="Events Today" 
            used={usage?.eventsToday?.used || 0} 
            limit={currentPlan.limits.eventsPerDay}
            icon={Activity}
          />
          <UsageCard 
            title="Team Members" 
            used={usage?.users?.used || 0} 
            limit={currentPlan.limits.users}
            icon={Users}
          />
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Data Retention</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {currentPlan.limits.retentionDays} days
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing Period */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white">Billing Period</p>
                <p className="text-xs text-slate-400">
                  {usage?.billing_period?.start ? new Date(usage.billing_period.start).toLocaleDateString() : 'N/A'} - {usage?.billing_period?.end ? new Date(usage.billing_period.end).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={loadUsage} className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.id === currentPlan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full bg-slate-800/50 border-slate-700 ${plan.popular ? 'ring-2 ring-purple-500' : ''} ${isCurrentPlan ? 'ring-2 ring-indigo-500' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-white">${plan.monthlyPrice}</span>
                      <span className="text-slate-400">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                          <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <Button disabled className="w-full bg-slate-700 text-slate-400">
                        Current Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleUpgrade(plan)}
                        className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                        data-testid={`upgrade-to-${plan.id}`}
                      >
                        {plan.monthlyPrice > currentPlan.monthlyPrice ? 'Upgrade' : 'Downgrade'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedPlan?.monthlyPrice > currentPlan.monthlyPrice ? 'Upgrade' : 'Change'} to {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selectedPlan?.monthlyPrice > currentPlan.monthlyPrice 
                ? `You'll be charged $${selectedPlan?.monthlyPrice}/month starting today.`
                : `Your plan will change at the end of your current billing period.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
              <div>
                <p className="text-sm text-slate-400">New monthly cost</p>
                <p className="text-2xl font-bold text-white">${selectedPlan?.monthlyPrice}</p>
              </div>
              <Badge className={`bg-gradient-to-r ${selectedPlan?.color} text-white`}>
                {selectedPlan?.name}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)} className="border-slate-600 text-slate-300">
              Cancel
            </Button>
            <Button 
              onClick={confirmUpgrade} 
              disabled={upgrading}
              className={`bg-gradient-to-r ${selectedPlan?.color}`}
            >
              {upgrading ? 'Processing...' : 'Confirm Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Notice */}
      <Card className="bg-indigo-500/10 border-indigo-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-indigo-200">Demo Mode</p>
              <p className="text-xs text-indigo-300/70 mt-1">
                Payment processing is currently in demo mode. Stripe integration will be enabled when API keys are configured.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataPulseBillingPage;
