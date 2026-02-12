import { useAuthStore } from "../stores/authStore";
import { API_ENDPOINTS } from "./endpoints";
import type { AuthTokensResponse, TokenPair } from "./types";

async function refreshTokens(currentRefreshToken: string): Promise<TokenPair | null> {
  try {
    const response = await fetch(API_ENDPOINTS.authRefresh, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: currentRefreshToken }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as TokenPair;
    useAuthStore.getState().setTokens(data);
    return data;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<T> {
  const { tokens, clear } = useAuthStore.getState();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (tokens?.access_token) {
    headers.set("Authorization", `Bearer ${tokens.access_token}`);
  }

  const doRequest = async (): Promise<Response> =>
    fetch(input, {
      ...init,
      headers,
    });

  let response = await doRequest();

  if (response.status === 401 && tokens?.refresh_token) {
    const newTokens = await refreshTokens(tokens.refresh_token);
    if (!newTokens) {
      clear();
      throw new Error("AUTH_EXPIRED");
    }
    headers.set("Authorization", `Bearer ${newTokens.access_token}`);
    response = await doRequest();
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

