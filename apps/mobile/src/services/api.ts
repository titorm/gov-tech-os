import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // In a real app, you would get the token from secure storage
    // const token = await SecureStore.getItemAsync('token');
    const token = null; // Placeholder
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      // SecureStore.deleteItemAsync('token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);