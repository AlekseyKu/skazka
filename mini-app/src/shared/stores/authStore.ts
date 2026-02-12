import { create } from "zustand";

export type SubscriptionType = "free" | "gold" | "family" | "premium";

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserRead {
  user_id: number;
  subscription: SubscriptionType;
  subscription_end: string | null;
  coins: number;
  daily_limit: number;
  audio_limit: number;
}

interface AuthState {
  tokens: TokenPair | null;
  user: UserRead | null;
  setTokens: (tokens: TokenPair | null) => void;
  setUser: (user: UserRead | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  tokens: null,
  user: null,
  setTokens: (tokens) => set({ tokens }),
  setUser: (user) => set({ user }),
  clear: () => set({ tokens: null, user: null }),
}));

