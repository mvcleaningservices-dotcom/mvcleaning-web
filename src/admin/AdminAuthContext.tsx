import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const TOKEN_KEY = 'mv_admin_token';
const ROLE_KEY = 'mv_admin_role';
const USER_KEY = 'mv_admin_user';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}

interface AdminAuthState {
  isAuthed: boolean;
  loading: boolean;
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AdminAuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => {
    try { const s = localStorage.getItem(USER_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) { setLoading(false); return; }
    fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const roles = ['super_admin', 'sub_admin'];
        if (!roles.includes(data.role)) { clear(); return; }
        setToken(t);
        setUser(data.admin ?? null);
      })
      .catch(clear)
      .finally(() => setLoading(false));
  }, [clear]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? 'Login failed');
    const { accessToken, admin } = data as { accessToken: string; admin: AdminUser };
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(ROLE_KEY, admin.role);
    localStorage.setItem(USER_KEY, JSON.stringify(admin));
    setToken(accessToken);
    setUser(admin);
  }, []);

  const logout = useCallback(() => { clear(); }, [clear]);

  return (
    <Ctx.Provider value={{ isAuthed: !!token, loading, user, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAdminAuth must be inside <AdminAuthProvider>');
  return ctx;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
