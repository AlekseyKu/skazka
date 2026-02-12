import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

import { API_ENDPOINTS } from "../api/endpoints";
import type { AuthTokensResponse } from "../api/types";
import { useAuthStore } from "../stores/authStore";
import { getTelegramWebApp } from "../hooks/useTelegram";

interface AuthContextValue {
  isLoading: boolean;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function authorizeViaTelegram() {
  const webApp = getTelegramWebApp();
  const initData = webApp?.initData;

  if (!initData) {
    throw new Error("INIT_DATA_MISSING");
  }

  const response = await fetch(API_ENDPOINTS.authTelegram, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ init_data: initData }),
  });

  if (!response.ok) {
    throw new Error("AUTH_FAILED");
  }

  const data = (await response.json()) as AuthTokensResponse;
  const { setTokens, setUser } = useAuthStore.getState();
  setTokens(data.tokens);
  setUser(data.user);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const tokens = useAuthStore((s) => s.tokens);

  const bootstrap = useCallback(async () => {
    try {
      if (!tokens) {
        await authorizeViaTelegram();
      }
    } catch {
      // Keep unauthenticated state; UI may show limited modes or errors
    } finally {
      setIsLoading(false);
    }
  }, [tokens]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const value: AuthContextValue = {
    isLoading,
    isAuthorized: Boolean(useAuthStore.getState().tokens),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

