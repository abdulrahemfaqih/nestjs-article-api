import axios from 'axios';

// Base API URL with fallback to Vite proxy or standard backend port
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Terjadi kesalahan pada server';
    
    if (error.response) {
      const data = error.response.data;
      if (Array.isArray(data?.message)) {
        message = data.message.join(', ');
      } else if (typeof data?.message === 'string') {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
      
      // Auto logout if 401 Unauthorized
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
      }
    } else if (error.request) {
      message = 'Tidak dapat terhubung ke server backend. Pastikan server NestJS aktif di port 3000.';
    }

    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.original = error;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
