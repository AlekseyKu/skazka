import { create } from "zustand";

const STORAGE_KEY = "skazka_saved_lullabies_v1";

interface SavedLullabiesState {
  savedIds: string[];
  hydrate: () => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

function persist(ids: string[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedIds: ids }));
  }
}

export const useSavedLullabiesStore = create<SavedLullabiesState>((set, get) => ({
  savedIds: [],
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { savedIds?: string[] };
      if (Array.isArray(parsed.savedIds)) {
        set({ savedIds: parsed.savedIds });
      }
    } catch {
      // ignore
    }
  },
  add: (id) =>
    set((state) => {
      if (state.savedIds.includes(id)) return state;
      const next = [...state.savedIds, id];
      persist(next);
      return { savedIds: next };
    }),
  remove: (id) =>
    set((state) => {
      const next = state.savedIds.filter((s) => s !== id);
      persist(next);
      return { savedIds: next };
    }),
  has: (id) => get().savedIds.includes(id),
}));
