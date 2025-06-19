import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterData, LoginCredentials } from '../types';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          logout();
        }
      }
    };

    fetchUser();
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await apiLogin(username, password);
    setToken(response.access_token);
    localStorage.setItem('token', response.access_token);
    const userData = await getCurrentUser();
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    await apiRegister(data);
    await login(data.email, data.password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 