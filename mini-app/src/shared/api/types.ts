import type { SubscriptionType, TokenPair, UserRead } from "../stores/authStore";

export type { SubscriptionType, TokenPair, UserRead };

export interface TaleRead {
  id: number;
  user_id: number;
  text: string;
  audio_path: string | null;
  type:
    | "text"
    | "audio"
    | "named"
    | "named_audio"
    | "night"
    | "night_audio";
  date: string;
  is_favorite?: boolean;
}

export interface CollectionItemRead {
  id: number;
  tale_id: number;
  title: string;
  created_at: string;
  is_favorite: boolean;
  has_audio: boolean;
}

export interface AuthTokensResponse {
  tokens: TokenPair;
  user: UserRead;
}

