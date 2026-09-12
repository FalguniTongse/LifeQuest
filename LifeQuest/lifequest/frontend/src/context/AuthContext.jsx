import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { apiErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lifequest_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lifequest_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('lifequest_user', JSON.stringify(data.user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('lifequest_token');
        localStorage.removeItem('lifequest_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('lifequest_token', data.token);
      localStorage.setItem('lifequest_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: apiErrorMessage(err, 'Could not log in.') };
    }
  }, []);

  const register = useCallback(async (username, email, password, confirmPassword) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password, confirmPassword });
      localStorage.setItem('lifequest_token', data.token);
      localStorage.setItem('lifequest_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: apiErrorMessage(err, 'Could not create your account.') };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lifequest_token');
    localStorage.removeItem('lifequest_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
