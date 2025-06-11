import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Create an Axios instance with baseURL pointing to our proxy (/api → http://localhost:4000)
const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // 10s timeout
});

// Request interceptor: attach JWT from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if a 401 comes back, clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');

      const role = localStorage.getItem('role');
      if (role === 'banker') {
        history.push('/banker-login');
      } else {
        history.push('/customer-login');
      }

      window.location.href = history.location.pathname;
    }
    return Promise.reject(error);
  }
);

export default api;
