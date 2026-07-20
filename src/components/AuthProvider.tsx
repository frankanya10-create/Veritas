"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { insforge } from "@/lib/insforge/client";

interface User {
  id: string;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, refresh: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await insforge.auth.getCurrentUser();
    setUser(error ? null : data?.user ? { id: data.user.id, email: data.user.email } : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (cancelled) return;
      setUser(error ? null : data?.user ? { id: data.user.id, email: data.user.email } : null);
      setLoading(false);
    }
    void hydrate();
    return () => { cancelled = true; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
