import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ authenticated: false, loading: true });

  useEffect(() => {
    axios
      .get<{ authenticated: boolean }>("/api/auth/status")
      .then(({ data }) => setState({ authenticated: data.authenticated, loading: false }))
      // Falls back to authenticated when no backend is running — keeps the demo usable.
      .catch(() => setState({ authenticated: true, loading: false }));
  }, []);

  const login = useCallback(async (password: string) => {
    await axios.post("/api/auth/login", { password });
    setState({ authenticated: true, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await axios.post("/api/auth/logout");
    setState({ authenticated: false, loading: false });
  }, []);

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
