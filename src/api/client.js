import axios from 'axios';

// Dynamically target Node.js Express MERN backend on port 5000 regardless of which frontend port (3000, 4000, 5000) is opened
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname || '127.0.0.1';
    return `${window.location.protocol}//${hostname}:5000`;
  }
  return 'http://127.0.0.1:5000';
};

const API_BASE_URL = getApiBaseUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15-second request timeout for database operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Authorization token from localStorage to every outgoing request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global HTTP errors (e.g. 401 Unauthorized token expiration)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint =
        error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/signup');
      if (!isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
    }
    return Promise.reject(error);
  }
);

export default client;
