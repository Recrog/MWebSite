import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

function setAxiosAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setToken(parsed.token);
        setAxiosAuthToken(parsed.token);
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data);
      } catch {
        setUser(null);
      }
    }
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setAxiosAuthToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('auth', JSON.stringify({ token: res.data.token }));
  };

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password });
    setToken(res.data.token);
    setAxiosAuthToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('auth', JSON.stringify({ token: res.data.token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAxiosAuthToken(null);
    localStorage.removeItem('auth');
  };

  const value = { user, token, login, register, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


