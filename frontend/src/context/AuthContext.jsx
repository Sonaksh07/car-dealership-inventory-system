import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, getStoredUser, setStoredUser } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    setStoredToken(data.access_token);
    setStoredUser(data.user);
    setAuthModalOpen(false);
    return data;
  };

  const register = async (payload) => {
    const newUser = await api.register(payload);
    // Automatically log in after registration
    const data = await api.login({ email: payload.email, password: payload.password });
    setToken(data.access_token);
    setUser(data.user);
    setStoredToken(data.access_token);
    setStoredUser(data.user);
    setAuthModalOpen(false);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setStoredToken(null);
    setStoredUser(null);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: !!user?.is_admin,
    login,
    register,
    logout,
    authModalOpen,
    authMode,
    openAuth,
    closeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
