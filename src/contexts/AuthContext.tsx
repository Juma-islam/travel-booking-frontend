"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const user = authService.getCurrentUser();
      const isAuthenticated = authService.isAuthenticated();

      if (!isAuthenticated || !user) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // If role is missing from stored user, fetch fresh profile from backend
      if (!user.role) {
        try {
          const { authApi } = await import('@/services/api.service');
          const profile = await authApi.getProfile();
          const updatedUser: User = { ...user, role: profile.role };
          localStorage.setItem('auth-user', JSON.stringify(updatedUser));
          setAuthState({ user: updatedUser, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          // Backend unreachable — default role to 'user'
          const updatedUser: User = { ...user, role: 'user' };
          localStorage.setItem('auth-user', JSON.stringify(updatedUser));
          setAuthState({ user: updatedUser, isAuthenticated: true, isLoading: false });
          return;
        }
      }

      setAuthState({ user, isAuthenticated: true, isLoading: false });
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.login(credentials);

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.register(data);

      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    } catch (error) {
      // Even if logout fails, clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}