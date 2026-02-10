import axios from 'axios';

// Survey360 uses the main backend's /api/survey360 routes
// In browser context, use window location origin or the REACT_APP_BACKEND_URL
const getApiBase = () => {
  // For production/preview, use the same origin
  if (typeof window !== 'undefined' && window.location.hostname.includes('preview.emergentagent.com')) {
    return window.location.origin;
  }
  return process.env.REACT_APP_BACKEND_URL || '';
};

const SURVEY360_API_URL = `${getApiBase()}/api/survey360`;

const survey360Api = axios.create({
  baseURL: SURVEY360_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and org_id
survey360Api.interceptors.request.use((config) => {
  // Get token from auth-storage (the main auth store)
  const authData = localStorage.getItem('auth-storage');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
      // Add org_id from user data if available
      if (state?.user?.org_id) {
        // Add org_id as query param for GET requests, or in body for POST/PUT
        if (config.method === 'get') {
          config.params = config.params || {};
          if (!config.params.org_id) {
            config.params.org_id = state.user.org_id;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse auth data:', e);
    }
  }
  
  // Also check org-storage for current org
  const orgData = localStorage.getItem('org-storage');
  if (orgData) {
    try {
      const { state } = JSON.parse(orgData);
      if (state?.currentOrg?.id) {
        if (config.method === 'get') {
          config.params = config.params || {};
          if (!config.params.org_id) {
            config.params.org_id = state.currentOrg.id;
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse org data:', e);
    }
  }
  
  return config;
});

// Response interceptor for error handling
survey360Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('survey360-auth');
      window.location.href = '/solutions/survey360/login';
    }
    return Promise.reject(error);
  }
);

export default survey360Api;
