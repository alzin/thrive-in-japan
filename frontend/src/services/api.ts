import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('token');
      // window.location.href = '/login';
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
