"use client"
import api, { authApi } from '@/lib/api';
import { User } from '@/types/user';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (token && refreshToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        logout();
      }
    }
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const response = await authApi.post('/auth/login/', { email, senha });
    const { access: token, refresh, usuario } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(usuario));

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setUser(usuario);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/auth/login';
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
