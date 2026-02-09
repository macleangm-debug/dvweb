import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, Mail, Lock, User, Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api/fieldforce`;

// Check for SSO token from DataVision
const checkSSOToken = async () => {
  const dvToken = localStorage.getItem('dv_token');
  if (dvToken) {
    try {
      const res = await axios.post(`${API}/auth/sso-exchange`, {}, {
        headers: { Authorization: `Bearer ${dvToken}` }
      });
      if (res.data.access_token) {
        return res.data;
      }
    } catch (error) {
      console.log('SSO exchange failed:', error.message);
    }
  }
  return null;
};

export const FieldForceLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for SSO on mount
  useEffect(() => {
    const initSSO = async () => {
      const ssoResult = await checkSSOToken();
      if (ssoResult) {
        localStorage.setItem('fieldforce_token', ssoResult.access_token);
        localStorage.setItem('fieldforce_user', JSON.stringify(ssoResult.user));
        navigate('/solutions/fieldforce/app/dashboard');
      }
      setSsoLoading(false);
    };
    initSSO();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('fieldforce_token', res.data.access_token);
      localStorage.setItem('fieldforce_user', JSON.stringify(res.data.user));
      navigate('/solutions/fieldforce/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (ssoLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-cyan-600/20"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <div>
            <Link to="/solutions/fieldforce" className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-white text-xl font-bold">FieldForce</span>
            </Link>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Complete Survey<br />Lifecycle Management
            </h1>
            <p className="text-white/70 max-w-md">
              From design to analysis, FieldForce handles every aspect of your 
              field data operations. Built for research teams and data-driven organizations.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                <span className="text-teal-400 text-sm">✓</span>
              </div>
              <span>Offline-first mobile apps</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                <span className="text-teal-400 text-sm">✓</span>
              </div>
              <span>GPS & photo verification</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-8 h-8 bg-teal-500/30 rounded-full flex items-center justify-center">
                <span className="text-teal-400 text-sm">✓</span>
              </div>
              <span>Real-time analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e293b] rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-white/60 mb-6">Sign in to your account to continue</p>

            {/* Demo credentials info */}
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-teal-400 font-medium text-sm">Demo Credentials</p>
                  <p className="text-white/70 text-sm mt-1">
                    Email: <code className="text-teal-300">demo@fieldforce.io</code>
                  </p>
                  <p className="text-white/70 text-sm">
                    Password: <code className="text-teal-300">Test123!</code>
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="you@example.com"
                    required
                    data-testid="ff-login-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="Enter your password"
                    required
                    data-testid="ff-login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="ff-login-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-white/50 mt-6 text-sm">
              Don't have an account?{' '}
              <Link to="/solutions/fieldforce/app/register" className="text-teal-400 hover:text-teal-300">
                Sign up
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <Link 
                to="/solutions/fieldforce" 
                className="text-white/50 hover:text-white/70 text-sm flex items-center justify-center gap-1"
              >
                ← Back to FieldForce Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const FieldForceRegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      localStorage.setItem('fieldforce_token', res.data.access_token);
      localStorage.setItem('fieldforce_user', JSON.stringify(res.data.user));
      navigate('/solutions/fieldforce/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1e293b] rounded-2xl p-8 shadow-xl"
      >
        <Link to="/solutions/fieldforce" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-teal-400" />
          </div>
          <span className="text-white text-xl font-bold">FieldForce</span>
        </Link>

        <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
        <p className="text-white/60 mb-6">Start collecting data in the field today</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Your name"
                required
                data-testid="ff-register-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="you@example.com"
                required
                data-testid="ff-register-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-10 text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Create a password"
                required
                minLength={6}
                data-testid="ff-register-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            data-testid="ff-register-submit"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/50 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/solutions/fieldforce/app/login" className="text-teal-400 hover:text-teal-300">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default FieldForceLoginPage;
