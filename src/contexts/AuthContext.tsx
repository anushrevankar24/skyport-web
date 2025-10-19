'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authAPI, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = Cookies.get('token');
      
      if (token) {
        const userData = await authAPI.getProfile();
        setUser(userData);
      }
    } catch {
      // Token is invalid, clear cookies
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Store tokens and user data with explicit cookie options
      const cookieOptions = { 
        expires: 1, // 1 day
        sameSite: 'lax' as const,
        path: '/',
        secure: false // Allow on localhost HTTP
      };
      const longCookieOptions = {
        expires: 7, // 7 days
        sameSite: 'lax' as const,
        path: '/',
        secure: false // Allow on localhost HTTP
      };
      
      Cookies.set('token', response.token, cookieOptions);
      Cookies.set('refreshToken', response.refresh_token, longCookieOptions);
      Cookies.set('user', JSON.stringify(response.user), longCookieOptions);
      
      // Update user state
      setUser(response.user);
      
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      throw new Error(errorMessage || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup({ name, email, password });
      
      // Store tokens and user data with explicit cookie options
      const cookieOptions = { 
        expires: 1, // 1 day
        sameSite: 'lax' as const,
        path: '/',
        secure: false // Allow on localhost HTTP
      };
      const longCookieOptions = {
        expires: 7, // 7 days
        sameSite: 'lax' as const,
        path: '/',
        secure: false // Allow on localhost HTTP
      };
      
      Cookies.set('token', response.token, cookieOptions);
      Cookies.set('refreshToken', response.refresh_token, longCookieOptions);
      Cookies.set('user', JSON.stringify(response.user), longCookieOptions);
      
      setUser(response.user);
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : undefined;
      throw new Error(errorMessage || 'Signup failed');
    }
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('user', { path: '/' });
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}




