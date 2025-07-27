import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  national_id?: string;
  birth_date?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Set authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/login', { email, password });
      
      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      
      // Store in localStorage
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/register', userData);
      
      const { user: newUser, token: userToken } = response.data;
      
      setUser(newUser);
      setToken(userToken);
      
      // Store in localStorage
      localStorage.setItem('auth_token', userToken);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
      
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// API client with authentication
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default AuthContext;