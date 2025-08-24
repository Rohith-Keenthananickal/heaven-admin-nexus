import { toast } from '@/modules/shared/hooks/use-toast';
import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // Important for XSRF token handling
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Force headers object to exist
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }

    // Only set Content-Type to application/json if it's not FormData
    if (!(config.data instanceof FormData)) {
      config.headers.set('Content-Type', 'application/json');
    }
    config.headers.set('Accept', 'application/json');

    if (config.method?.toLowerCase() === 'get' || config.method?.toLowerCase() === 'delete') {
      // This prevents Axios from removing the Content-Type header
      config.data = config.data || '';
    }

    // Add auth/session headers if available
    const session = localStorage.getItem('SESSION');
    if (session) {
      try {
        const sessionObj = JSON.parse(session);
        if (sessionObj.userToken) {
          config.headers['x-xsrf-token'] = sessionObj.userToken;
        }
        if (sessionObj.userId) {
          config.headers['userid'] = sessionObj.userId;
        }
        if (sessionObj.sessionId) {
          config.headers['sessionId'] = sessionObj.sessionId;
        }
      } catch (err) {
        console.warn('Invalid session format:', session);
      }
    }

    // Ensure GET params are serialized
    if (config.method?.toLowerCase() === 'get' && config.params) {
      config.paramsSerializer = params => {
        return Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
          .join('&');
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle authentication errors
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      const session = localStorage.getItem('SESSION');
      if (session) {
        try {
          const sessionObj = JSON.parse(session);
          if (sessionObj.userToken) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/';
          }
        } catch (err) {
          console.warn('Invalid session format:', session);
        }
      }
      return Promise.reject(error);
    }

    // Handle other errors with toast notifications
    if (error.response?.status !== 417) {
      if (error.response?.data?.message) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
        error.message = error.response.data.message;
      } else if (error.response?.data?.data) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.data,
        });
        error.message = error.response.data.data;
      } else if (error.message) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: 'An unexpected error occurred',
        });
        error.message = 'An unexpected error occurred';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
