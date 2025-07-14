import axios from 'axios';
import type { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Debug the actual environment variable value
console.log('VITE_API_URL value:', import.meta.env.VITE_API_URL);

// Request interceptor - Add auth header and debugging
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Debug outgoing requests
  const fullUrl = `${config.baseURL || ''}${config.url}`;
  console.log(
    `API Request: ${config.method?.toUpperCase() || 'GET'} ${fullUrl}`,
    {
      params: config.params,
      headers: config.headers,
    }
  );

  return config;
});

// Response interceptor - Handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // If error is 401 (Unauthorized) - redirect to login
    if (error.response?.status === 401) {
      // Clear token and redirect to login page
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }

    // For OAuth2 token length errors, show a cleaner error message
    if (
      error.response?.status === 500 &&
      typeof error.response?.data === 'object' &&
      error.response?.data !== null &&
      'message' in error.response.data &&
      typeof error.response.data.message === 'string' &&
      error.response.data.message.includes('value too long for type')
    ) {
      console.error('OAuth token length error:', error.response.data);
      const betterError = new Error('Authentication error: Token size exceeds database limits');
      return Promise.reject(betterError);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
