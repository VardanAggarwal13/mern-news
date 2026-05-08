import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [bookmarkIds, setBookmarkIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const refreshBookmarks = useCallback(async () => {
    try {
      const { data } = await api.get('/users/me/bookmarks');
      const ids = new Set((data.stories || []).map((s) => s._id));
      setBookmarkIds(ids);
    } catch {
      setBookmarkIds(new Set());
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        refreshBookmarks();
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [refreshBookmarks]);

  const persist = (nextToken, nextUser) => {
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    await refreshBookmarks();
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data.token, data.user);
    setBookmarkIds(new Set());
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setBookmarkIds(new Set());
  };

  const toggleBookmark = async (storyId) => {
    const { data } = await api.post(`/stories/${storyId}/bookmark`);
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      if (data.bookmarked) next.add(storyId);
      else next.delete(storyId);
      return next;
    });
    return data.bookmarked;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    bookmarkIds,
    login,
    register,
    logout,
    toggleBookmark,
    refreshBookmarks,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
