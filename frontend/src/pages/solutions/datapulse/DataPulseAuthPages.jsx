/**
 * DataPulse Auth Pages - Redirects to DataVision SSO
 * Single Sign-On Architecture: All auth goes through DataVision
 */
import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';

// Redirect to DataVision SSO for login
export function DataPulseLoginPage() {
  useEffect(() => {
    // Check if already authenticated with DataVision
    const dvToken = localStorage.getItem('dv_token') || localStorage.getItem('datavision_token');
    
    if (dvToken) {
      // Already logged in with DataVision, try to get DataPulse token
      exchangeSSOToken(dvToken);
    } else {
      // Redirect to DataVision SSO
      window.location.href = '/auth/login?redirect=datapulse';
    }
  }, []);

  const exchangeSSOToken = async (dvToken) => {
    try {
      const API = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API}/api/auth/sso/datapulse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dvToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('dp_token', data.access_token);
        localStorage.setItem('datapulse_user', JSON.stringify(data.user));
        window.location.href = '/solutions/datapulse/app/dashboard';
      } else {
        window.location.href = '/auth/login?redirect=datapulse';
      }
    } catch (error) {
      console.error('SSO exchange failed:', error);
      window.location.href = '/auth/login?redirect=datapulse';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">DataPulse</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
          <span>Redirecting to DataVision Login...</span>
        </div>
      </div>
    </div>
  );
}

// Redirect to DataVision SSO for registration
export function DataPulseRegisterPage() {
  useEffect(() => {
    window.location.href = '/auth/register?redirect=datapulse';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">DataPulse</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></div>
          <span>Redirecting to DataVision Registration...</span>
        </div>
      </div>
    </div>
  );
}

export default DataPulseLoginPage;
