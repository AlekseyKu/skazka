import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { apiFetch } from "../api/client";
import { useTelegram } from "../hooks/useTelegram";

export type User = {
  user_id: number;
  subscription: string;
  subscription_end: string | null;
  coins: number;
  daily_limit: number;
  audio_limit: number;
};

type TokenPair = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

type AuthState = {
  status: "idle" | "guest" | "authorized" | "error";
  user: User | null;
  tokens: TokenPair | null;
  error: string | null;
  loginWithTelegram: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initData } = useTelegram();
  const [status, setStatus] = useState<AuthState["status"]>("idle");
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<TokenPair | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    if (!accessToken) {
      setStatus("guest");
      return;
    }
    apiFetch<User>("/api/v1/users/me")
      .then((data) => {
        setUser(data);
        setStatus("authorized");
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        setStatus("guest");
      });
  }, []);

  const loginWithTelegram = async () => {
    if (!initData) {
      setStatus("guest");
      setError("initData недоступен вне Telegram");
      return;
    }
    setStatus("idle");
    setError(null);
    const response = await apiFetch<{ tokens: TokenPair; user: User }>("/api/v1/auth/telegram", {
      method: "POST",
      body: JSON.stringify({ init_data: initData }),
    });
    localStorage.setItem(ACCESS_KEY, response.tokens.access_token);
    localStorage.setItem(REFRESH_KEY, response.tokens.refresh_token);
    setTokens(response.tokens);
    setUser(response.user);
    setStatus("authorized");
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setTokens(null);
    setUser(null);
    setStatus("guest");
  };

  const value = useMemo<AuthState>(
    () => ({ status, user, tokens, error, loginWithTelegram, logout }),
    [status, user, tokens, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
