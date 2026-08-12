import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { syncUserToSupabase } from '../services/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('linksphere_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('linksphere_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me');
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem('linksphere_user', JSON.stringify(res.data.data));
        // Sync with Supabase users table
        syncUserToSupabase(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch current user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('linksphere_token', jwtToken);
      localStorage.setItem('linksphere_user', JSON.stringify(userData));
      // Store user record in Supabase users table
      await syncUserToSupabase(userData);
      return userData;
    }
  };

  const register = async (registerData) => {
    const res = await api.post('/auth/register', registerData);
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data.data;
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('linksphere_token', jwtToken);
      localStorage.setItem('linksphere_user', JSON.stringify(userData));
      // Store user record in Supabase users table upon account creation
      await syncUserToSupabase(userData);
      return userData;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('linksphere_token');
    localStorage.removeItem('linksphere_user');
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
