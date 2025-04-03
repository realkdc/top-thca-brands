import axios from 'axios';

// Make sure the API URL always has /api at the end if it doesn't already
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;

// For debugging - remove in production
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL from env:', baseUrl);
console.log('API URL used:', API_URL);
console.log('All env vars:', import.meta.env);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios request to:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('Axios response error:', error);
    console.error('Response data:', error.response?.data);
    console.error('Response status:', error.response?.status);
    console.error('Response headers:', error.response?.headers);
    
    // Handle 401 (Unauthorized) by redirecting to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 