import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

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

// Response interceptor - Handle token refresh and errors
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    // If error is 401 and we have a refresh token - try to refresh
    if (
      error.response?.status === 401 &&
      originalRequest?.url &&
      !originalRequest.url.includes('auth/refresh') &&
      localStorage.getItem('refreshToken')
    ) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call refresh token endpoint
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const { token, refreshToken: newRefreshToken } = response.data;

          // Update tokens in storage
          localStorage.setItem('token', token);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${token}`,
            };
          }

          // Process queued requests
          processQueue(null, token);

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Token refresh failed - clear tokens and redirect to login
          processQueue(refreshError, null);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // If refresh is already in progress, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              } else {
                originalRequest.headers = {
                  Authorization: `Bearer ${token}`,
                };
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }
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
