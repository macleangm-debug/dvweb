import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL;

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
      
      // Store token
      localStorage.setItem('datavision_token', access_token);
      localStorage.setItem('datavision_user', JSON.stringify(user));
      
      // Handle redirect to product SSO
      if (redirect.includes('fieldforce')) {
        // Get FieldForce SSO token
        const ssoResponse = await axios.post(`${API}/api/auth/sso/fieldforce`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        localStorage.setItem('ff_token', ssoResponse.data.access_token);
        localStorage.setItem('ff_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/fieldforce/app/dashboard');
      } else if (redirect.includes('survey360')) {
        // Get Survey360 SSO token
        const ssoResponse = await axios.post(`${API}/api/auth/sso/survey360`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        localStorage.setItem('survey360_token', ssoResponse.data.access_token);
        localStorage.setItem('survey360_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/survey360/app/dashboard');
      } else {
        // Default redirect
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-white rounded-lg px-4 py-2 inline-block">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-8 w-auto"
              />
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

        {/* Products */}
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
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
      
      // Store token
      localStorage.setItem('datavision_token', access_token);
      localStorage.setItem('datavision_user', JSON.stringify(user));
      
      // Handle redirect to product SSO
      if (redirect.includes('fieldforce')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/fieldforce`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        localStorage.setItem('ff_token', ssoResponse.data.access_token);
        localStorage.setItem('ff_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/fieldforce/app/dashboard');
      } else if (redirect.includes('survey360')) {
        const ssoResponse = await axios.post(`${API}/api/auth/sso/survey360`, {}, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        localStorage.setItem('survey360_token', ssoResponse.data.access_token);
        localStorage.setItem('survey360_user', JSON.stringify(ssoResponse.data.user));
        navigate('/solutions/survey360/app/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="bg-white rounded-lg px-4 py-2 inline-block">
              <img 
                src="/datavision-logo-cropped.png" 
                alt="DataVision" 
                className="h-8 w-auto"
              />
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Join DataVision to access all our products</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="datavision-register-form">
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
                  Create Account
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to={`/auth/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-red-400 hover:text-red-300 font-medium">
                Sign in
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

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-gray-400">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs">Secure SSO</p>
          </div>
          <div className="text-gray-400">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <p className="text-xs">All Products</p>
          </div>
          <div className="text-gray-400">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-xs">One Billing</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataVisionLogin;
