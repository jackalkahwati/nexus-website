import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        case 500:
          // Handle server error
          break;
        default:
          // Handle other errors
          break;
      }
    }
    return Promise.reject(error);
  }
);

// Type definitions
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface TrackingData {
  // Define tracking data structure
}

interface AnalyticsData {
  // Define analytics data structure  
}

interface ComprehensiveData {
  // Define comprehensive data structure
}

interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
}

interface ErrorReport {
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

// API endpoints
const apiService = {
  // Authentication
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  register: (userData: UserData) => api.post('/auth/register', userData),
  
  // Data endpoints
  getTrackingData: (): Promise<TrackingData> => api.get('/tracking'),
  getAnalyticsData: (): Promise<AnalyticsData> => api.get('/analytics'),
  getComprehensiveData: (): Promise<ComprehensiveData> => api.get('/comprehensive'),
  
  // WebSocket configuration
  getWebSocketConfig: (): Promise<WebSocketConfig> => api.get('/config/websocket'),
  
  // Error reporting
  reportError: (errorData: ErrorReport) => api.post('/errors', errorData),
};

export default apiService;
