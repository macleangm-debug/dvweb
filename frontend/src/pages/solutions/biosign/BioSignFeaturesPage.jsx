import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Fingerprint, Shield, Smartphone, Globe, Zap, Lock, Eye, AlertTriangle,
  CheckCircle2, ArrowRight, Server, Key, Activity, FileText, 
  Clock, Users, Cpu, Wifi, WifiOff, MapPin, User, CreditCard, RefreshCw
} from 'lucide-react';

const BioSignFeaturesPage = () => {
  const [activeDemo, setActiveDemo] = useState('webauthn');
  const [registrationStep, setRegistrationStep] = useState(0);
  const [userId, setUserId] = useState('user-demo-123');

  const demos = [
    { id: 'webauthn', name: 'WebAuthn', icon: Fingerprint },
    { id: 'device', name: 'Device', icon: Smartphone },
    { id: 'transaction', name: 'Transaction', icon: CreditCard },
    { id: 'risk', name: 'Risk Analysis', icon: Activity },
    { id: 'audit', name: 'Audit Logs', icon: FileText },
    { id: 'offline', name: 'Offline', icon: WifiOff },
    { id: 'fraud', name: 'Fraud Alerts', icon: AlertTriangle },
    { id: 'behavioral', name: 'Behavioral', icon: User },
  ];

  const registrationSteps = [
    { name: 'Request Options', status: 'pending' },
    { name: 'Generate Keys', status: 'pending' },
    { name: 'Biometric Verify', status: 'pending' },
    { name: 'Server Verify', status: 'pending' },
    { name: 'Complete', status: 'pending' },
  ];

  const apiEndpoints = {
    authentication: [
      { method: 'POST', endpoint: '/api/auth/register', description: 'Register new user' },
      { method: 'POST', endpoint: '/api/auth/login', description: 'Login and get JWT' },
      { method: 'POST', endpoint: '/api/auth/refresh', description: 'Refresh access token' },
      { method: 'GET', endpoint: '/api/auth/me', description: 'Get current user' },
      { method: 'POST', endpoint: '/api/auth/verify-email', description: 'Verify email token' },
    ],
    devices: [
      { method: 'POST', endpoint: '/api/devices/register', description: 'Register device' },
      { method: 'GET', endpoint: '/api/devices/list', description: 'List user devices' },
      { method: 'DELETE', endpoint: '/api/devices/{id}', description: 'Remove device' },
    ],
    webauthn: [
      { method: 'POST', endpoint: '/api/webauthn/register/options', description: 'Get registration options' },
      { method: 'POST', endpoint: '/api/webauthn/register/verify', description: 'Verify registration' },
      { method: 'POST', endpoint: '/api/webauthn/authenticate/options', description: 'Get auth options' },
      { method: 'POST', endpoint: '/api/webauthn/authenticate/verify', description: 'Verify authentication' },
    ],
    transactions: [
      { method: 'POST', endpoint: '/api/transactions/create', description: 'Create transaction' },
      { method: 'POST', endpoint: '/api/transactions/sign', description: 'Sign transaction' },
      { method: 'GET', endpoint: '/api/transactions/{id}', description: 'Get transaction' },
      { method: 'POST', endpoint: '/api/transactions/verify', description: 'Verify signature' },
      { method: 'GET', endpoint: '/api/transactions/history', description: 'Transaction history' },
    ],
    risk: [
      { method: 'POST', endpoint: '/api/risk/analyze', description: 'Analyze transaction risk' },
    ],
    behavioral: [
      { method: 'POST', endpoint: '/api/behavioral/capture', description: 'Capture behavioral data' },
      { method: 'POST', endpoint: '/api/behavioral/analyze', description: 'Analyze behavior patterns' },
    ],
    fraud: [
      { method: 'GET', endpoint: '/api/fraud/alerts', description: 'Get fraud alerts' },
      { method: 'PUT', endpoint: '/api/fraud/alerts/{id}', description: 'Update alert status' },
    ],
    audit: [
      { method: 'GET', endpoint: '/api/audit/logs', description: 'Get audit logs' },
      { method: 'GET', endpoint: '/api/audit/export', description: 'Export logs' },
    ],
  };

  const simulateRegistration = () => {
    setRegistrationStep(0);
    const interval = setInterval(() => {
      setRegistrationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 text-cyan-400 text-sm mb-4">
            <span className="px-2 py-1 bg-cyan-500/10 rounded">0/{demos.length} features explored</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <p className="text-slate-400 mb-2">8 Interactive Demos • 50+ API Endpoints</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Try Every Feature Right Now
              </h1>
              <p className="text-slate-400 mt-2">
                No signup required. Your demo session is ready. Explore bank-grade security features live.
              </p>
            </div>
            <Link 
              to="/solutions/biosign/demo"
              className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all"
            >
              Get API Keys
            </Link>
          </div>

          {/* Compliance Badges */}
          <div className="flex flex-wrap gap-3">
            {['PSD2 Compliant', 'PCI DSS 4.0', 'FIDO2 Certified', 'ISO 27001', 'SOC 2 Type II', 'GDPR'].map((badge, index) => (
              <span key={index} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section className="py-12 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-white mb-8">Interactive Demos</h2>

          {/* Demo Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  activeDemo === demo.id
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <demo.icon className="w-4 h-4" />
                {demo.name}
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
            {activeDemo === 'webauthn' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Register Credential</h3>
                
                <div className="mb-6">
                  <label className="block text-slate-400 text-sm mb-2">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full md:w-96 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Enter user ID"
                  />
                </div>

                <button
                  onClick={simulateRegistration}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-violet-600 transition-all flex items-center gap-2"
                >
                  <Fingerprint className="w-5 h-5" /> Register with Biometrics
                </button>

                {/* Registration Progress */}
                <div className="mt-8">
                  <h4 className="text-sm font-semibold text-slate-400 mb-4">Registration Progress</h4>
                  <div className="flex items-center gap-4 overflow-x-auto pb-4">
                    {registrationSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index < registrationStep
                            ? 'bg-emerald-500 text-white'
                            : index === registrationStep
                            ? 'bg-cyan-500 text-white animate-pulse'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {index < registrationStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                        </div>
                        <span className={`text-sm whitespace-nowrap ${
                          index <= registrationStep ? 'text-white' : 'text-slate-500'
                        }`}>
                          {step.name}
                        </span>
                        {index < registrationSteps.length - 1 && (
                          <div className={`w-8 h-0.5 ${
                            index < registrationStep ? 'bg-emerald-500' : 'bg-slate-700'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'device' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Device Management</h3>
                <p className="text-slate-400 mb-6">Register and manage trusted devices for your users.</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="w-8 h-8 text-cyan-400" />
                      <div>
                        <p className="text-white font-medium">iPhone 14 Pro</p>
                        <p className="text-slate-400 text-sm">Registered 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Active</span>
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">Face ID</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-8 h-8 text-violet-400" />
                      <div>
                        <p className="text-white font-medium">Chrome on MacBook</p>
                        <p className="text-slate-400 text-sm">Registered 5 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Active</span>
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded text-xs">Touch ID</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'transaction' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Transaction Signing</h3>
                <p className="text-slate-400 mb-6">Create and sign transactions with cryptographic security.</p>
                
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Amount</label>
                      <input type="text" value="$1,500.00" readOnly className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Recipient</label>
                      <input type="text" value="ACC-123456 (Jane Doe)" readOnly className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white" />
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Sign Transaction
                  </button>
                </div>
              </div>
            )}

            {activeDemo === 'risk' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">AI Risk Analysis</h3>
                <p className="text-slate-400 mb-6">Real-time transaction risk scoring using advanced AI.</p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <p className="text-emerald-400 text-sm font-medium">Low Risk</p>
                    <p className="text-2xl font-bold text-white mt-1">Score: 15</p>
                    <p className="text-slate-400 text-sm mt-2">Auto-approved</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
                    <p className="text-amber-400 text-sm font-medium">Medium Risk</p>
                    <p className="text-2xl font-bold text-white mt-1">Score: 55</p>
                    <p className="text-slate-400 text-sm mt-2">Biometric required</p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                    <p className="text-red-400 text-sm font-medium">High Risk</p>
                    <p className="text-2xl font-bold text-white mt-1">Score: 85</p>
                    <p className="text-slate-400 text-sm mt-2">Manual review</p>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'audit' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Tamper-Proof Audit Logs</h3>
                <p className="text-slate-400 mb-6">Complete forensic-ready audit trail for compliance.</p>
                
                <div className="space-y-3">
                  {[
                    { time: '2 mins ago', event: 'Transaction signed', user: 'user-123', status: 'success' },
                    { time: '5 mins ago', event: 'Device registered', user: 'user-456', status: 'success' },
                    { time: '12 mins ago', event: 'Risk analysis triggered', user: 'user-123', status: 'warning' },
                    { time: '15 mins ago', event: 'Authentication attempt', user: 'user-789', status: 'failed' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-400' :
                        log.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span className="text-slate-400 text-sm w-24">{log.time}</span>
                      <span className="text-white flex-1">{log.event}</span>
                      <span className="text-slate-500 text-sm">{log.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDemo === 'offline' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Offline Transaction Queue</h3>
                <p className="text-slate-400 mb-6">Queue transactions in rural areas, sync when online.</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/30">
                    <WifiOff className="w-5 h-5 text-amber-400" />
                    <span className="text-amber-400">Offline Mode</span>
                  </div>
                  <span className="text-slate-400">3 transactions queued</span>
                </div>

                <button className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Sync Now
                </button>
              </div>
            )}

            {activeDemo === 'fraud' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Real-Time Fraud Alerts</h3>
                <p className="text-slate-400 mb-6">Instant notifications for suspicious activities.</p>
                
                <div className="space-y-3">
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-medium">High Priority Alert</span>
                    </div>
                    <p className="text-white">Unusual location detected for user-123</p>
                    <p className="text-slate-400 text-sm mt-1">Transaction from new country (Nigeria) - usually Kenya</p>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'behavioral' && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Behavioral Biometrics</h3>
                <p className="text-slate-400 mb-6">Continuous authentication through behavior patterns.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Typing Pattern</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full">
                        <div className="w-4/5 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <span className="text-emerald-400 text-sm">82% match</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                    <p className="text-slate-400 text-sm mb-1">Session Behavior</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full">
                        <div className="w-11/12 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <span className="text-emerald-400 text-sm">94% match</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="text-2xl font-bold text-white mb-2">API Reference</h2>
          <p className="text-slate-400 mb-8">33+ endpoints for complete SDK integration</p>

          <div className="space-y-6">
            {Object.entries(apiEndpoints).map(([category, endpoints]) => (
              <div key={category} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1')}</h3>
                  <span className="text-slate-400 text-sm">{endpoints.length}</span>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {endpoints.map((api, index) => (
                    <div key={index} className="px-6 py-3 flex items-center gap-4 hover:bg-slate-700/20">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                        api.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                        api.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {api.method}
                      </span>
                      <code className="text-cyan-400 text-sm flex-1">{api.endpoint}</code>
                      <span className="text-slate-400 text-sm">{api.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-slate-900/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-cyan-600/20 to-violet-600/20 rounded-2xl p-8 border border-cyan-500/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Integrate?</h2>
            <p className="text-slate-400 mb-6">Get your API keys and start building in minutes. Need help with enterprise features?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/solutions/biosign/demo"
                className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-all"
              >
                Get API Keys
              </Link>
              <Link 
                to="/solutions/biosign/demo"
                className="px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
              >
                Book Enterprise Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BioSignFeaturesPage;
