import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type Profile } from '../api';
import { session } from '../lib/session';

/**
 * App-wide auth state for the consumer web app.
 * Holds the token + profile + selected pincode, and exposes login/logout.
 * The token lives in localStorage (see session.ts); this context mirrors it in
 * React state and hydrates the profile on load.
 */
interface AuthState {
  isAuthed: boolean;
  loading: boolean;
  profile: Profile | null;
  pincode: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  setPincode: (pincode: string) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(session.getToken());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pincode, setPincodeState] = useState<string | null>(session.getPincode());
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!session.getToken()) {
      setProfile(null);
      return;
    }
    try {
      const p = await api.getProfile();
      setProfile(p);
      if (p.pincode && !session.getPincode()) {
        session.setPincode(p.pincode);
        setPincodeState(p.pincode);
      }
    } catch {
      // Token invalid/expired — clear it.
      session.clear();
      setToken(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshProfile();
      setLoading(false);
    })();
  }, [refreshProfile]);

  const login = useCallback(async (t: string) => {
    session.setToken(t);
    setToken(t);
    await refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(() => {
    session.clear();
    setToken(null);
    setProfile(null);
    setPincodeState(null);
  }, []);

  const setPincode = useCallback((p: string) => {
    session.setPincode(p);
    setPincodeState(p);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthed: !!token, loading, profile, pincode, login, logout, setPincode, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
