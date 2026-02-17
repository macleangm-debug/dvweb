/**
 * Survey360 Product Page
 * A comprehensive, tabbed product page for Survey360 survey management platform
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, ArrowRight, ChevronDown, CheckCircle2, Play, Star,
  Layers, Share2, Activity, BarChart3, Download, Shield,
  Type, AlignLeft, CircleDot, CheckSquare, Calendar, Hash,
  Mail, Phone, PenTool, GitBranch, Send, TrendingUp, Plus, Minus,
  GraduationCap, Heart, Users, MessageSquare, CreditCard, Loader2,
  ChevronRight, ExternalLink, Sparkles, Clock, Globe, Zap
} from 'lucide-react';
import {
  survey360Brand,
  survey360Stats,
  survey360Features,
  questionTypes,
  howItWorks,
  testimonials,
  pricingPlans,
  faqItems,
  useCases,
  survey360NavItems,
  validSurvey360TabIds
} from './survey360Data';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Icon mapping
const iconMap = {
  Layers, Share2, Activity, BarChart3, Download, Shield,
  Type, AlignLeft, CircleDot, CheckSquare, Calendar, Hash,
  Mail, Phone, PenTool, GitBranch, Send, TrendingUp,
  GraduationCap, Heart, Users, MessageSquare, Star, ChevronDown
};

const getIcon = (iconName) => iconMap[iconName] || Target;

// ==================== TAB COMPONENTS ====================

// Overview Tab
const OverviewTab = ({ onNavigate }) => (
  <div className="space-y-24">
    {/* Hero Section */}
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-800" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              End-to-End Survey Management
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Complete Survey Lifecycle Management
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Create, distribute, and analyze surveys with ease. From simple feedback forms 
              to complex research studies, Survey360 handles it all.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/solutions/survey360/app"
                className="inline-flex items-center gap-2 bg-white text-teal-700 px-6 py-3 font-semibold hover:bg-teal-50 transition-all rounded-lg"
                data-testid="start-free-trial-btn"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 py-3 font-semibold hover:bg-white/10 transition-all rounded-lg"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </div>
            <p className="mt-6 text-white/60 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              500+ organizations trust Survey360
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Survey Dashboard</p>
                    <p className="text-sm text-gray-500">Real-time responses</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-teal-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-teal-700">1,234</p>
                    <p className="text-xs text-teal-600">Responses today</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">89%</p>
                    <p className="text-xs text-blue-600">Completion rate</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-700">4.8</p>
                    <p className="text-xs text-purple-600">Avg. rating</p>
                  </div>
                </div>
                <div className="h-24 bg-gradient-to-r from-teal-100 to-teal-50 rounded-lg flex items-end justify-around p-2">
                  {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                    <div key={i} className="bg-teal-500 rounded-t w-6" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="container mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {survey360Stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <p className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">{stat.value}</p>
            <p className="font-semibold text-gray-900">{stat.label}</p>
            <p className="text-sm text-gray-500">{stat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Feature Highlights */}
    <section className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">Why Survey360</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Everything You Need in One Platform
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From creation to analysis, Survey360 provides all the tools you need to run successful surveys.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {survey360Features.slice(0, 6).map((feature, index) => {
          const Icon = getIcon(feature.icon);
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
                <Icon className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => onNavigate('features')}
          className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
        >
          View All Features
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>

    {/* CTA Section */}
    <section className="bg-teal-600 py-20">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Collecting Better Data?
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Join 500+ organizations using Survey360 to gather insights and make data-driven decisions.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/solutions/survey360/app"
            className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-4 font-semibold hover:bg-teal-50 transition-all rounded-lg"
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onNavigate('pricing')}
            className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white/10 transition-all rounded-lg"
          >
            View Pricing
          </button>
        </div>
      </div>
    </section>
  </div>
);

// Features Tab
const FeaturesTab = () => (
  <div className="py-16 space-y-24">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">Features</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Powerful Tools for Every Survey Need
        </h2>
      </div>

      {/* Feature Grid */}
      <div className="space-y-16">
        {survey360Features.map((feature, index) => {
          const Icon = getIcon(feature.icon);
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={isEven ? '' : 'lg:order-2'}>
                <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 ${isEven ? '' : 'lg:order-1'}`}>
                <div className="bg-white rounded-xl shadow-lg p-6 h-64 flex items-center justify-center">
                  <Icon className="w-24 h-24 text-teal-200" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Question Types Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">10 Question Types</h3>
          <p className="text-gray-600">Build any survey with our comprehensive question library</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {questionTypes.map((type, index) => {
            const Icon = getIcon(type.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all text-center"
              >
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <p className="font-medium text-gray-900 text-sm">{type.name}</p>
                <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

// How It Works Tab
const HowItWorksTab = () => (
  <div className="py-16">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">How It Works</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Four Simple Steps to Better Data
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From survey creation to actionable insights, Survey360 makes the entire process seamless.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {howItWorks.map((step, index) => {
          const Icon = getIcon(step.icon);
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6 mb-12 last:mb-0"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {step.step}
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="w-0.5 h-20 bg-teal-200 mx-auto mt-2" />
                )}
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <Link
          to="/solutions/survey360/app"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 font-semibold hover:bg-teal-700 transition-all rounded-lg"
        >
          Try It Now - Free
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

// Use Cases Tab
const UseCasesTab = () => (
  <div className="py-16">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">Use Cases</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Built for Every Industry
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See how organizations across sectors use Survey360 to gather insights and drive decisions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {useCases.map((useCase, index) => {
          const Icon = getIcon(useCase.icon);
          return (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{useCase.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {useCase.examples.map((example, i) => (
                  <span key={i} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
                    {example}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

// Testimonials Tab
const TestimonialsTab = () => (
  <div className="py-16 bg-gray-50">
    <div className="container mx-auto px-6 lg:px-12">
      <div className="text-center mb-16">
        <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">Testimonials</p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Loved by Organizations Worldwide
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-semibold">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.organization}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// Pricing Tab
const PricingTab = () => {
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [purchaseError, setPurchaseError] = useState(null);
  const [plans, setPlans] = useState(pricingPlans); // Start with fallback
  const [pricingLoaded, setPricingLoaded] = useState(false);

  // Fetch pricing from centralized API
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${API}/pricing/survey360`);
        if (response.ok) {
          const data = await response.json();
          if (data.plans && data.plans.length > 0) {
            setPlans(data.plans);
          }
        }
      } catch (error) {
        console.error('Failed to fetch pricing, using fallback:', error);
      } finally {
        setPricingLoaded(true);
      }
    };
    fetchPricing();
  }, []);

  const handlePurchase = async (packageId) => {
    if (!packageId) {
      // Free plan - redirect to signup
      window.location.href = '/solutions/survey360/app';
      return;
    }
    
    setPurchaseLoading(packageId);
    setPurchaseError(null);
    
    try {
      const response = await fetch(`${API}/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: packageId,
          origin_url: window.location.origin,
          metadata: { source: 'survey360_page', product: 'survey360' }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setPurchaseError(error.message);
      setPurchaseLoading(null);
    }
  };

  return (
    <div className="py-16" id="pricing">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {purchaseError && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 text-sm">{purchaseError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-teal-600 text-white ring-4 ring-teal-300 scale-105'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className={`text-lg font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  {plan.price === 0 ? (
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      Free
                    </span>
                  ) : plan.price ? (
                    <>
                      <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                        ${plan.price.toLocaleString()}
                      </span>
                      <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span className={`text-3xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      Custom
                    </span>
                  )}
                </div>
                {plan.savings && (
                  <p className="text-teal-200 text-sm mt-2">{plan.savings}</p>
                )}
                <p className={`text-sm mt-2 ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      plan.popular ? 'text-teal-200' : 'text-teal-500'
                    }`} />
                    <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              {plan.price === 0 ? (
                <Link
                  to="/solutions/survey360/app"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all bg-teal-600 text-white hover:bg-teal-700"
                  data-testid="start-free-btn"
                >
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : plan.price ? (
                <button
                  onClick={() => handlePurchase(plan.package_id)}
                  disabled={purchaseLoading === plan.package_id}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-70 ${
                    plan.popular
                      ? 'bg-white text-teal-700 hover:bg-teal-50'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                  data-testid={`buy-${plan.id}-btn`}
                >
                  {purchaseLoading === plan.package_id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Get Started
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to="/contact"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-teal-700 hover:bg-teal-50'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  Contact Sales
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-500" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-500" />
              <span className="text-sm">Powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-500" />
              <span className="text-sm">14-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQ Tab
const FAQTab = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-semibold uppercase tracking-wider mb-4 text-sm">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-teal-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
          >
            Contact our team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN PAGE COMPONENT ====================

const Survey360ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && validSurvey360TabIds.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return <FeaturesTab />;
      case 'how-it-works':
        return <HowItWorksTab />;
      case 'use-cases':
        return <UseCasesTab />;
      case 'testimonials':
        return <TestimonialsTab />;
      case 'pricing':
        return <PricingTab />;
      case 'faq':
        return <FAQTab />;
      default:
        return <OverviewTab onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DataVision Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* DataVision Logo on white background */}
            <Link to="/" className="flex items-center">
              <div className="bg-white rounded px-3 py-2">
                <img 
                  src="/datavision-logo-cropped.png" 
                  alt="DataVision International" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>

            {/* Back to Solutions */}
            <Link 
              to="/solutions" 
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Solutions
            </Link>
          </div>
        </div>
      </header>

      {/* Product Navigation Bar - Below Header */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0a1628] border-b border-[#1e3a5f]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-12">
            {/* Logo & Brand - Compact */}
            <Link to="/solutions/survey360" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-teal-500 rounded flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white text-sm">Survey360</span>
            </Link>

            {/* Desktop Navigation - Inline */}
            <nav className="hidden md:flex items-center">
              {survey360NavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === item.id
                      ? 'text-teal-400 border-teal-400'
                      : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Buttons - Compact */}
            <div className="flex items-center gap-2">
              <Link
                to="/solutions/survey360/login"
                className="hidden sm:inline-flex text-xs font-medium text-white/70 hover:text-white px-2 py-1"
              >
                Sign In
              </Link>
              <Link
                to="/solutions/survey360/app"
                className="inline-flex items-center gap-1.5 bg-teal-500 text-white px-3 py-1.5 text-xs font-semibold hover:bg-teal-400 transition-all rounded"
                data-testid="get-started-btn"
              >
                Get Started
                <ArrowRight className="w-3 h-3" />
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-white/70 hover:text-white"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-white/10"
              >
                <div className="py-3 space-y-1">
                  {survey360NavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'text-teal-400 bg-white/5'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Tab Content - with padding for fixed headers */}
      <div className="pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey360ProductPage;
