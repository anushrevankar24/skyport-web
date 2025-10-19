import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { token, refresh_token } = response.data;
          
          Cookies.set('token', token, { expires: 1 }); // 1 day
          Cookies.set('refreshToken', refresh_token, { expires: 7 }); // 7 days

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          Cookies.remove('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: User;
}

export interface Tunnel {
  id: string;
  user_id: string;
  name: string;
  subdomain: string;
  local_port: number;
  auth_token: string;
  is_active: boolean;
  last_seen?: string;
  connected_ip?: string;
  created_at: string;
  updated_at: string;
}

// Auth API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/profile');
    return response.data;
  },

  agentAuth: async (token: string): Promise<{ valid: boolean; user: User }> => {
    const response = await api.post('/auth/agent-auth', { token });
    return response.data;
  },
};

// Tunnels API
export const tunnelsAPI = {
  getTunnels: async (): Promise<{ tunnels: Tunnel[] }> => {
    const response = await api.get('/tunnels');
    return response.data;
  },

  createTunnel: async (data: { name: string; subdomain: string; local_port: number }): Promise<Tunnel> => {
    const response = await api.post('/tunnels', data);
    return response.data;
  },

  deleteTunnel: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tunnels/${id}`);
    return response.data;
  },
};

export default api;




