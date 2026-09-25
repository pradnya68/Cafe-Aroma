import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cafe_aroma_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cafe_aroma_token'));
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const savedToken = localStorage.getItem('cafe_aroma_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('cafe_aroma_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('cafe_aroma_token', token);
      localStorage.setItem('cafe_aroma_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.success) {
      const { token, user } = res.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('cafe_aroma_token', token);
      localStorage.setItem('cafe_aroma_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cafe_aroma_token');
    localStorage.removeItem('cafe_aroma_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
