import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import { type User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData: User = JSON.parse(savedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<AuthResult> => {
    try {
      const credentials = { username, password };
      const response = await authAPI.login(credentials);
      
      const userData: User = {
        ...response.data.user,
        username,
        password, // Store for Basic Auth
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    try {
      const userData = { username, email, password };
      await authAPI.register(userData);
      
      // Auto-login after registration
      return await login(username, password);
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getCurrentUser();
      const userData: User = {
        ...response.data,
        username: user!.username,
        password: user!.password,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};