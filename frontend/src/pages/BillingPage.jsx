import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  CreditCard, Calendar, Receipt, ArrowUp, ArrowDown, 
  Check, AlertCircle, Loader2, ChevronRight, Shield,
  Clock, X, Sparkles
} from 'lucide-react';

const API = process.env.REACT_APP_BACKEND_URL;

const BillingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('survey360');

  useEffect(() => {
    fetchBillingData();
  }, [selectedProduct]);

  const fetchBillingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('dv_token');
      const userEmail = localStorage.getItem('dv_user_email') || localStorage.getItem('userEmail');
      
      if (!token) {
        setError('Please log in to view billing information');
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch subscription, pricing, and invoices in parallel
      const [subRes, pricingRes, invoicesRes] = await Promise.all([
        axios.get(`${API}/api/billing/subscription?product_id=${selectedProduct}`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API}/api/pricing/${selectedProduct}`).catch(() => ({ data: null })),
        axios.get(`${API}/api/billing/invoices?product_id=${selectedProduct}`, { headers }).catch(() => ({ data: { invoices: [] } }))
      ]);

      setSubscription(subRes.data);
      setPricing(pricingRes.data);
      setInvoices(invoicesRes.data?.invoices || []);
    } catch (err) {
      setError('Failed to load billing information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlanId, packageId) => {
    setActionLoading(newPlanId);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('dv_token');
      const response = await axios.post(
        `${API}/api/billing/upgrade`,
        { 
          product_id: selectedProduct,
          new_plan_id: newPlanId,
          package_id: packageId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.checkout_url) {
        // Redirect to Stripe for payment of difference
        window.location.href = response.data.checkout_url;
      } else {
        setSuccessMessage(response.data.message || 'Upgrade successful!');
        fetchBillingData();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process upgrade');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDowngrade = async (newPlanId) => {
    setActionLoading(newPlanId);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('dv_token');
      const response = await axios.post(
        `${API}/api/billing/downgrade`,
        { 
          product_id: selectedProduct,
          new_plan_id: newPlanId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.message || 'Downgrade scheduled for end of billing period');
      fetchBillingData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to schedule downgrade');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    setActionLoading('cancel');
    setError(null);

    try {
      const token = localStorage.getItem('dv_token');
      await axios.post(
        `${API}/api/billing/cancel`,
        { product_id: selectedProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage('Subscription cancelled. Access continues until end of billing period.');
      setShowCancelModal(false);
      fetchBillingData();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const getCurrentPlanIndex = () => {
    if (!subscription || !pricing?.plans) return -1;
    return pricing.plans.findIndex(p => p.id === subscription.plan_id || p.name.toLowerCase() === subscription.plan?.toLowerCase());
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const currentPlanIndex = getCurrentPlanIndex();

  return (
    <div className="min-h-screen bg-[#0a1628] py-12">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
          <p className="text-gray-400">Manage your subscription, view invoices, and update your plan</p>
        </div>

        {/* Product Selector */}
        <div className="flex gap-2 mb-8">
          {['survey360', 'fieldforce', 'datapulse'].map((product) => (
            <button
              key={product}
              onClick={() => setSelectedProduct(product)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedProduct === product
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {product === 'survey360' ? 'Survey360' : product === 'fieldforce' ? 'FieldForce' : 'DataPulse'}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <p className="text-green-400">{successMessage}</p>
          </div>
        )}

        {/* Current Subscription Card */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Current Subscription</h2>
              <p className="text-gray-400 text-sm">{pricing?.product_name || selectedProduct}</p>
            </div>
            {subscription?.status === 'active' && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                Active
              </span>
            )}
            {subscription?.status === 'cancelled' && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                Cancelling
              </span>
            )}
            {subscription?.pending_downgrade && (
              <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium">
                Downgrade Pending
              </span>
            )}
          </div>

          {subscription ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Current Plan</p>
                  <p className="text-white font-semibold">{subscription.plan_name || subscription.plan}</p>
                  <p className="text-teal-400 font-bold">{formatCurrency(subscription.amount || 0)}/mo</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Next Billing Date</p>
                  <p className="text-white font-semibold">{formatDate(subscription.expires_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-semibold">{formatDate(subscription.started_at)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No active subscription for {pricing?.product_name || selectedProduct}</p>
              <button
                onClick={() => navigate(`/solutions/${selectedProduct}#pricing`)}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                View Plans
              </button>
            </div>
          )}

          {/* Pending Downgrade Notice */}
          {subscription?.pending_downgrade && (
            <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-medium">Downgrade Scheduled</p>
                  <p className="text-gray-400 text-sm">
                    Your plan will change to <strong className="text-white">{subscription.pending_downgrade.new_plan}</strong> on {formatDate(subscription.expires_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Plan Comparison / Change Plan */}
        {subscription && pricing?.plans && (
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Change Plan</h2>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pricing.plans.map((plan, index) => {
                const isCurrentPlan = index === currentPlanIndex;
                const isUpgrade = index > currentPlanIndex;
                const isDowngrade = index < currentPlanIndex && index !== 0;
                const isFree = plan.price === 0;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl p-5 border transition-all ${
                      isCurrentPlan
                        ? 'bg-teal-600/20 border-teal-500'
                        : plan.popular
                        ? 'bg-slate-700/50 border-purple-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {plan.popular && !isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}

                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Current
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-4 mt-2">
                      <h3 className="text-white font-semibold mb-1">{plan.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-bold text-white">
                          {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-gray-400 text-sm">/mo</span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4 text-sm">
                      {plan.features?.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <button disabled className="w-full py-2 bg-slate-600 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        Current Plan
                      </button>
                    ) : isUpgrade ? (
                      <button
                        onClick={() => handleUpgrade(plan.id, plan.package_id)}
                        disabled={actionLoading === plan.id}
                        className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ArrowUp className="w-4 h-4" />
                            Upgrade
                          </>
                        )}
                      </button>
                    ) : isDowngrade ? (
                      <button
                        onClick={() => handleDowngrade(plan.id)}
                        disabled={actionLoading === plan.id || subscription.pending_downgrade}
                        className="w-full py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ArrowDown className="w-4 h-4" />
                            Downgrade
                          </>
                        )}
                      </button>
                    ) : isFree ? (
                      <button
                        onClick={() => handleDowngrade(plan.id)}
                        disabled={actionLoading === plan.id}
                        className="w-full py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Switch to Free
                      </button>
                    ) : null}

                    {isUpgrade && subscription && (
                      <p className="text-center text-xs text-gray-500 mt-2">
                        Pay {formatCurrency(plan.price - (subscription.amount || 0))} difference
                      </p>
                    )}

                    {isDowngrade && (
                      <p className="text-center text-xs text-gray-500 mt-2">
                        Takes effect {formatDate(subscription.expires_at)}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Invoice History */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Invoice History</h2>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>

          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice, index) => (
                <div
                  key={invoice.id || index}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{invoice.description || invoice.package_name}</p>
                      <p className="text-gray-400 text-sm">{formatDate(invoice.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatCurrency(invoice.amount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      invoice.status === 'paid' || invoice.payment_status === 'paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {invoice.status || invoice.payment_status || 'Paid'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No invoices yet</p>
            </div>
          )}
        </div>

        {/* Cancel Subscription */}
        {subscription && subscription.status === 'active' && (
          <div className="bg-slate-800/50 rounded-2xl border border-red-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Cancel Subscription</h2>
                <p className="text-gray-400 text-sm">
                  You'll retain access until {formatDate(subscription.expires_at)}
                </p>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Cancel Subscription?</h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">
                Are you sure you want to cancel? You'll continue to have access until <strong className="text-white">{formatDate(subscription?.expires_at)}</strong>, after which your subscription will not renew.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === 'cancel' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Yes, Cancel'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
