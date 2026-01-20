import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (savedUser && token) {
      try {
        setState({
          user: JSON.parse(savedUser),
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (e) {
        localStorage.clear();
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await authService.login(credentials);
      const data = response.data || response;
      const user = data.user || data;
      const token = data.token || data.access_token || response.token;

      if (!token) throw new Error("No token received from server");

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData: any) => {
    try {
      const response = await authService.register(formData);
      const data = response.data || response;
      const user = data.user;
      const token = data.token || data.access_token;

      if (token && user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setState({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    // 1. Check if token exists before trying to notify backend
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        // CALL BACKEND FIRST: Token is still in headers thanks to interceptor
        await authService.logout();
      } catch (e) {
        // If 401 happens, the server already cleared the session
        console.log("Backend session already cleared.");
      }
    }

    // 2. CLEAR LOCAL DATA SECOND: Only now do we remove the token
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};