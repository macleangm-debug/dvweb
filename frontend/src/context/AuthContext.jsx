import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ==================== AUTH CONTEXT ====================
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Check for Survey360 auth token in localStorage
const getSurvey360Token = () => {
  try {
    return localStorage.getItem('survey360_token');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dv_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // First try DataVision token
      if (token) {
        try {
          const res = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('dv_token');
          setToken(null);
        }
      }
      
      // Try Survey360 SSO exchange (reverse SSO)
      const survey360Token = getSurvey360Token();
      if (survey360Token) {
        try {
          const res = await axios.post(`${API}/auth/sso-exchange`, {}, {
            headers: { Authorization: `Bearer ${survey360Token}` }
          });
          if (res.data.access_token) {
            localStorage.setItem('dv_token', res.data.access_token);
            setToken(res.data.access_token);
            setUser(res.data.user);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('Survey360 SSO exchange failed:', error.message);
        }
      }
      
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('dv_token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('dv_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
