const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const API_ENDPOINTS = {
  base: API_BASE,
  authTelegram: `${API_BASE}/api/v1/auth/telegram`,
  authRefresh: `${API_BASE}/api/v1/auth/refresh`,
  usersMe: `${API_BASE}/api/v1/users/me`,
  usersStats: `${API_BASE}/api/v1/users/me/stats`,
  tales: `${API_BASE}/api/v1/tales`,
  tale: (id: number | string) => `${API_BASE}/api/v1/tales/${id}`,
  talesGenerate: `${API_BASE}/api/v1/tales/generate`,
  talesGenerateNamed: `${API_BASE}/api/v1/tales/generate/named`,
  talesGenerateNight: `${API_BASE}/api/v1/tales/generate/night`,
  collection: `${API_BASE}/api/v1/collection`,
  collectionItem: (id: number | string) => `${API_BASE}/api/v1/collection/${id}`,
  collectionFavorite: (id: number | string) =>
    `${API_BASE}/api/v1/collection/${id}/favorite`,
} as const;

export type ApiEndpointKey = keyof typeof API_ENDPOINTS;

