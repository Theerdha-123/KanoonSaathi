import { useState, useCallback, useEffect } from 'react';

/**
 * Authentication hook using the real backend API.
 * Manages JWT tokens, login, signup, logout, and profile updates.
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ks_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  // Validate session on mount
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('ks_user');
          setUser(null);
        }
        return res.json();
      })
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem('ks_user', JSON.stringify(data.user));
        }
      })
      .catch(() => {});
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setUser(data.user);
      localStorage.setItem('ks_user', JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async ({ name, email, phone, password, state, language }) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, phone, password, state, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setUser(data.user);
      localStorage.setItem('ks_user', JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout error', e);
    }
    setUser(null);
    localStorage.removeItem('ks_user');
  }, []);

  const updateProfile = useCallback(async ({ name, phone, state, language }) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, phone, state, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setUser(data.user);
      localStorage.setItem('ks_user', JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email, newPassword) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      return true;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send analytics pageview
  const trackPage = useCallback((page, language, state) => {
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ page, language, state }),
    }).catch(() => {});
  }, []);

  // Send analytics law search
  const trackLawSearch = useCallback((term, category, section, language) => {
    fetch('/api/analytics/law-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ term, category, section, language }),
    }).catch(() => {});
  }, []);

  // Send analytics draft usage
  const trackDraft = useCallback((templateType, language) => {
    fetch('/api/analytics/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ templateType, language }),
    }).catch(() => {});
  }, []);

  return {
    token: null, user, isLoggedIn, isAdmin,
    loading, error,
    login, signup, logout,
    updateProfile, resetPassword,
    trackPage, trackLawSearch, trackDraft,
  };
}
