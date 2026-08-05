"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api";
import { clearStoredUser, clearToken, getStoredUser, getToken, setStoredUser, setToken } from "@/lib/auth";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // One-time session hydration on mount: reads the token, optimistically shows
  // the cached user, then verifies against the server. This synchronizes React
  // state with an external system (cookie storage + network), which is exactly
  // what effects are for; it can't be computed during render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Show the cached user immediately, then verify against the server.
    setUser(getStoredUser());

    authApi
      .me()
      .then((freshUser) => {
        setUser(freshUser);
        setStoredUser(freshUser);
      })
      .catch(() => {
        setUser(null);
        clearToken();
        clearStoredUser();
      })
      .finally(() => setIsLoading(false));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authApi.login(data);
    setToken(response.access_token, response.expires_in_minutes);
    setStoredUser(response.user);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    setToken(response.access_token, response.expires_in_minutes);
    setStoredUser(response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the API call fails, clear local session state.
    }
    clearToken();
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
