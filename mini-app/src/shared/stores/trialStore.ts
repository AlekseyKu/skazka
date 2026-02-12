import { create } from "zustand";

const STORAGE_KEY = "skazka_free_trial_v1";

interface TrialState {
  freeCustomUsed: number;
  maxFreeCustom: number;
  hydrate: () => void;
  incrementFreeCustom: () => void;
}

export const useTrialStore = create<TrialState>((set) => ({
  freeCustomUsed: 0,
  maxFreeCustom: 3,
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { freeCustomUsed?: number };
      set({
        freeCustomUsed: parsed.freeCustomUsed ?? 0,
      });
    } catch {
      // ignore corrupted storage
    }
  },
  incrementFreeCustom: () =>
    set((state) => {
      const next = Math.min(state.maxFreeCustom, state.freeCustomUsed + 1);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ freeCustomUsed: next }),
        );
      }
      return { freeCustomUsed: next };
    }),
}));

