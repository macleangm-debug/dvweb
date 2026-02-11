import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_BACKEND_URL;

export const DataPulseLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API}/api/datapulse/auth/login`, { email, password });
      localStorage.setItem("datapulse_token", response.data.access_token);
      localStorage.setItem("datapulse_user", JSON.stringify(response.data.user));
      navigate("/solutions/datapulse/app/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = () => {
    const redirectUri = `${window.location.origin}/solutions/datapulse/auth/callback`;
    window.location.href = `${API}/api/auth/sso/initiate?product=datapulse&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex" data-testid="datapulse-login-page">
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">DataPulse</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">Enterprise Data<br />Collection Platform</h1>
            <p className="text-lg text-slate-400 max-w-md">Trusted by 500+ organizations for research, monitoring and evaluation.</p>
          </motion.div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/solutions/datapulse" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" />Back to DataPulse
          </Link>
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-slate-400 mb-8">Sign in to your DataPulse account</p>
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="you@organization.com" required data-testid="email-input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="Enter your password" required data-testid="password-input" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="login-submit-btn">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In<ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
          <div className="mt-6">
            <button onClick={handleSSOLogin} className="w-full py-3 border border-slate-700 rounded-lg font-medium hover:bg-slate-900 flex items-center justify-center gap-2" data-testid="sso-login-btn">
              Continue with DataVision SSO
            </button>
          </div>
          <p className="mt-8 text-center text-slate-400">Do not have an account? <Link to="/solutions/datapulse/register" className="text-indigo-400 hover:text-indigo-300">Request access</Link></p>
        </motion.div>
      </div>
    </div>
  );
};

export const DataPulseRegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/api/datapulse/auth/register`, { name, email, organization, password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Activity className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Request Submitted!</h2>
          <p className="text-slate-400 mb-8">Thank you for your interest in DataPulse. Our team will contact you within 24-48 hours.</p>
          <Link to="/solutions/datapulse"><button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium">Back to DataPulse</button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8" data-testid="datapulse-register-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/solutions/datapulse" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8"><ArrowLeft className="w-4 h-4" />Back to DataPulse</Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"><Activity className="w-6 h-6 text-white" /></div>
          <span className="text-2xl font-bold">DataPulse</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Request Enterprise Access</h2>
        <p className="text-slate-400 mb-8">Fill in your details and our team will reach out.</p>
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="John Doe" required data-testid="name-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Work Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="you@organization.com" required data-testid="email-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
            <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="Your organization name" required data-testid="organization-input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500" placeholder="Create a password" required minLength={8} data-testid="password-input" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" data-testid="register-submit-btn">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Request Access<ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
        <p className="mt-8 text-center text-slate-400">Already have an account? <Link to="/solutions/datapulse/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link></p>
      </motion.div>
    </div>
  );
};

export default DataPulseLoginPage;
