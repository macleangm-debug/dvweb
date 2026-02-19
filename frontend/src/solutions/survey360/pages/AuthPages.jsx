/**
 * Survey360 Auth Pages - Redirects to DataVision SSO
 * Single Sign-On Architecture: All auth goes through DataVision
 */
import React, { useEffect } from 'react';
import { ClipboardList } from 'lucide-react';

// Redirect to DataVision SSO for login
export function LoginPage() {
  useEffect(() => {
    // Check if already authenticated with DataVision
    const dvToken = localStorage.getItem('dv_token') || localStorage.getItem('datavision_token');
    
    if (dvToken) {
      // Already logged in with DataVision, try to get Survey360 token
      exchangeSSOToken(dvToken);
    } else {
      // Redirect to DataVision SSO
      window.location.href = '/auth/login?redirect=survey360';
    }
  }, []);

  const exchangeSSOToken = async (dvToken) => {
    try {
      const API = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${API}/api/auth/sso/survey360`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dvToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('survey360_token', data.access_token);
        localStorage.setItem('survey360_user', JSON.stringify(data.user));
        localStorage.setItem('auth-storage', JSON.stringify({
          state: { user: data.user, token: data.access_token, isAuthenticated: true },
          version: 0
        }));
        if (data.user.org_id) {
          localStorage.setItem('org-storage', JSON.stringify({
            state: { currentOrg: { id: data.user.org_id, name: data.user.name + "'s Organization" }, organizations: [] },
            version: 0
          }));
        }
        window.location.href = '/solutions/survey360/app/dashboard';
      } else {
        window.location.href = '/auth/login?redirect=survey360';
      }
    } catch (error) {
      console.error('SSO exchange failed:', error);
      window.location.href = '/auth/login?redirect=survey360';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Survey360</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
          <span>Redirecting to DataVision Login...</span>
        </div>
      </div>
    </div>
  );
}

// Redirect to DataVision SSO for registration
export function RegisterPage() {
  useEffect(() => {
    window.location.href = '/auth/register?redirect=survey360';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1d32] to-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Survey360</span>
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
          <span>Redirecting to DataVision Registration...</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
