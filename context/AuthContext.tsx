import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
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
        // Clear storage if data is corrupted
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await authService.login(credentials);
      
      // Handle different backend response structures
      const user = data.user || data.data?.user || data.data;
      const token = data.token || data.data?.token || data.access_token;

      if (!token) throw new Error("No token received from server");

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      throw error; // Re-throw so the Login page can show the 422 error message
    }
  };

  const register = async (formData: any) => {
    try {
      const response = await authService.register(formData);
      
      // If your backend automatically logs in after registration:
      const user = response.data?.user || response.data;
      const token = response.data?.token || response.data?.access_token;

      if (token && user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setState({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      throw error; // Re-throw so Register page can show validation errors
    }
  };

  const logout = () => {
    // Optionally call backend logout endpoint
    authService.logout().catch(() => console.warn("Backend logout failed"));
    
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