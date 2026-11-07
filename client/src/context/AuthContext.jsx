import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, clearToken, getToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api.me()
      .then(({ user: u }) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      login: async (creds) => {
        const { token, user: u } = await api.login(creds);
        setToken(token);
        setUser(u);
        return u;
      },
      register: async (data) => {
        const { token, user: u } = await api.register(data);
        setToken(token);
        setUser(u);
        return u;
      },
      logout: () => {
        clearToken();
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};