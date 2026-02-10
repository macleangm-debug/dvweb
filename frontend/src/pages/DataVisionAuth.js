import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

// Country list
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria", "Bangladesh", 
  "Belgium", "Botswana", "Brazil", "Burundi", "Cambodia", "Cameroon", "Canada", "Chile", 
  "China", "Colombia", "Congo (DRC)", "Costa Rica", "Croatia", "Czech Republic", "Denmark", 
  "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece", "Guatemala", 
  "Honduras", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", 
  "Jordan", "Kenya", "Liberia", "Libya", "Madagascar", "Malawi", "Malaysia", "Mali", "Mexico", 
  "Morocco", "Mozambique", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", 
  "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Romania", "Russia", 
  "Rwanda", "Saudi Arabia", "Senegal", "Sierra Leone", "Singapore", "Somalia", "South Africa", 
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", 
  "Tanzania", "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", 
  "United Kingdom", "United States", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const INDUSTRIES = [
  { value: "agriculture", label: "Agriculture & Food Security" },
  { value: "healthcare", label: "Healthcare & Public Health" },
  { value: "education", label: "Education & Training" },
  { value: "government", label: "Government & Public Sector" },
  { value: "ngo", label: "NGO & Non-Profit" },
  { value: "research", label: "Research & Academia" },
  { value: "finance", label: "Financial Services" },
  { value: "environment", label: "Environment & Conservation" },
  { value: "wash", label: "WASH (Water, Sanitation, Hygiene)" },
  { value: "humanitarian", label: "Humanitarian Aid" },
  { value: "other", label: "Other" }
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" }
];

const HOW_HEARD = [
  { value: "search", label: "Search Engine (Google, Bing)" },
  { value: "social", label: "Social Media" },
  { value: "referral", label: "Referral from colleague" },
  { value: "conference", label: "Conference or Event" },
  { value: "article", label: "Article or Blog" },
  { value: "other", label: "Other" }
];

export const DataVisionLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/api/auth/login`, { email, password });
      const { access_token, user } = response.data;
      
      // Store DataVision tokens with multiple keys for compatibility
      localStorage.setItem('datavision_token', access_token);
      localStorage.setItem('dv_token', access_token);
      localStorage.setItem('token', access_token);
      localStorage.setItem('datavision_user', JSON.stringify(user));
      
      if (redirect.includes('fieldforce')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/fieldforce`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        // Store FieldForce token with all keys used by the app
        localStorage.setItem('fieldforce_token', ssoResponse.data.access_token);
        localStorage.setItem('ff_token', ssoResponse.data.access_token);
        localStorage.setItem('ff_user', JSON.stringify(ssoResponse.data.user));
        // Set Zustand auth-storage for FieldForce app compatibility
        localStorage.setItem('auth-storage', JSON.stringify({
          state: { user: ssoResponse.data.user, token: ssoResponse.data.access_token, isAuthenticated: true },
          version: 0
        }));
        // Use window.location for full page reload to initialize Zustand stores
        window.location.href = '/solutions/fieldforce/app/dashboard';
      } else if (redirect.includes('survey360')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/survey360`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        // Store Survey360 token with all keys used by the app
        localStorage.setItem('survey360_token', ssoResponse.data.access_token);
        localStorage.setItem('survey360_user', JSON.stringify(ssoResponse.data.user));
        // Set Zustand auth-storage for Survey360 app compatibility
        localStorage.setItem('auth-storage', JSON.stringify({
          state: { user: ssoResponse.data.user, token: ssoResponse.data.access_token, isAuthenticated: true },
          version: 0
        }));
        if (ssoResponse.data.user.org_id) {
          localStorage.setItem('org-storage', JSON.stringify({
            state: { currentOrg: { id: ssoResponse.data.user.org_id, name: ssoResponse.data.user.name + "'s Organization" }, organizations: [] },
            version: 0
          }));
        }
        // Use window.location for full page reload to initialize Zustand stores
        window.location.href = '/solutions/survey360/app/dashboard';
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-white rounded-lg px-4 py-2 inline-block">
              <img src="/datavision-logo-cropped.png" alt="DataVision" className="h-8 w-auto" />
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to your DataVision account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="datavision-login-form">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                data-testid="datavision-login-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                data-testid="datavision-login-password"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="datavision-login-submit"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to={`/auth/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-red-400 hover:text-red-300 font-medium">
                Sign up
              </Link>
            </p>
            <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Website
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs mb-3">Access all DataVision products with one account</p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-6 h-6 bg-teal-500/20 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              FieldForce
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-6 h-6 bg-purple-500/20 rounded flex items-center justify-center">
                <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              Survey360
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DataVisionRegister = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  
  // Step 2 fields
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [phone, setPhone] = useState('');
  const [howHeard, setHowHeard] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/api/auth/register`, { name, email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('datavision_token', access_token);
      localStorage.setItem('datavision_user', JSON.stringify(user));
      setToken(access_token);
      
      // Move to step 2
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API}/api/auth/profile`, {
        country,
        industry,
        organization,
        job_title: jobTitle,
        company_size: companySize,
        phone,
        how_heard: howHeard
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      completeRegistration();
    } catch (err) {
      console.error('Profile update error:', err);
      // Still proceed even if profile update fails
      completeRegistration();
    }
  };

  const completeRegistration = async () => {
    try {
      if (redirect.includes('fieldforce')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/fieldforce`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('ff_token', ssoResponse.data.access_token);
        localStorage.setItem('ff_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/fieldforce/app/dashboard');
      } else if (redirect.includes('survey360')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/survey360`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.setItem('survey360_token', ssoResponse.data.access_token);
        localStorage.setItem('survey360_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/survey360/app/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      navigate('/');
    }
  };

  const skipStep2 = () => {
    completeRegistration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-white rounded-lg px-4 py-2 inline-block">
              <img src="/datavision-logo-cropped.png" alt="DataVision" className="h-8 w-auto" />
            </div>
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-500'}`}>1</div>
          <div className={`w-12 h-1 rounded ${step >= 2 ? 'bg-red-600' : 'bg-white/10'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-500'}`}>2</div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                <p className="text-gray-400 text-sm mt-2">Step 1: Basic Information</p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-4" data-testid="datavision-register-form">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    data-testid="datavision-register-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    data-testid="datavision-register-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    data-testid="datavision-register-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    data-testid="datavision-register-confirm-password"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                  data-testid="datavision-register-submit"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Continue
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link to={`/auth/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-red-400 hover:text-red-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Complete Your Profile</h1>
                <p className="text-gray-400 text-sm mt-2">Step 2: Tell us about yourself (optional)</p>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    >
                      <option value="" className="bg-slate-800">Select country</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c} className="bg-slate-800">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    >
                      <option value="" className="bg-slate-800">Select industry</option>
                      {INDUSTRIES.map(i => (
                        <option key={i.value} value={i.value} className="bg-slate-800">{i.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Your company or organization"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Your role"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    >
                      <option value="" className="bg-slate-800">Select size</option>
                      {COMPANY_SIZES.map(s => (
                        <option key={s.value} value={s.value} className="bg-slate-800">{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">How did you hear about us?</label>
                    <select
                      value={howHeard}
                      onChange={(e) => setHowHeard(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    >
                      <option value="" className="bg-slate-800">Select one</option>
                      {HOW_HEARD.map(h => (
                        <option key={h.value} value={h.value} className="bg-slate-800">{h.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={skipStep2}
                    className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl font-medium hover:bg-white/5 transition-all"
                  >
                    Skip for now
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Complete
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/" className="mt-6 text-gray-500 hover:text-gray-300 text-sm flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Website
        </Link>
      </motion.div>
    </div>
  );
};

export default DataVisionLogin;
