/**
 * DataViz Studio Auth Pages - Redirects to DataVision SSO
 * Single Sign-On Architecture: All auth goes through DataVision
 */
import React, { useState, useEffect } from 'react';
import SSOLoadingOverlay, { STAGES } from '../../../../components/SSOLoadingOverlay';

const API = process.env.REACT_APP_BACKEND_URL;

// Redirect to DataVision SSO for login
export function LoginPage() {
  const [stage, setStage] = useState(STAGES.REDIRECT_TO_SSO);

  useEffect(() => {
    const dvToken = localStorage.getItem('dv_token') || localStorage.getItem('datavision_token');
    
    if (dvToken) {
      setStage(STAGES.EXCHANGING_TOKEN);
      exchangeSSOToken(dvToken);
    } else {
      setTimeout(() => {
        window.location.href = '/auth/login?redirect=dataviz';
      }, 1500);
    }
  }, []);

  const exchangeSSOToken = async (dvToken) => {
    try {
      const response = await fetch(`${API}/api/auth/sso/dataviz`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${dvToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('dataviz_token', data.access_token);
        localStorage.setItem('dataviz_user', JSON.stringify(data.user));
        
        setStage(STAGES.ENTERING_APP);
        setTimeout(() => {
          setStage(STAGES.COMPLETE);
          setTimeout(() => {
            window.location.href = '/solutions/dataviz/app/dashboard';
          }, 500);
        }, 800);
      } else {
        window.location.href = '/auth/login?redirect=dataviz';
      }
    } catch (error) {
      console.error('SSO exchange failed:', error);
      window.location.href = '/auth/login?redirect=dataviz';
    }
  };

  return <SSOLoadingOverlay product="dataviz" stage={stage} isVisible={true} />;
}

// Redirect to DataVision SSO for registration
export function RegisterPage() {
  const [stage] = useState(STAGES.REDIRECT_TO_SSO);

  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/auth/register?redirect=dataviz';
    }, 1500);
  }, []);

  return <SSOLoadingOverlay product="dataviz" stage={stage} isVisible={true} />;
}

export default LoginPage;
