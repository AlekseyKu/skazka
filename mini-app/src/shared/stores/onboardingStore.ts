import { create } from "zustand";

const STORAGE_KEY = "skazka_onboarding_v1";

interface OnboardingState {
  completed: boolean;
  childName: string;
  childAge: number;
  interests: string[];
  hydrate: () => void;
  complete: (payload: {
    childName: string;
    childAge: number;
    interests: string[];
  }) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  childName: "Маша",
  childAge: 5,
  interests: [],
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        childName?: string;
        childAge?: number;
        interests?: string[];
      };
      set({
        completed: true,
        childName: parsed.childName ?? "Маша",
        childAge: parsed.childAge ?? 5,
        interests: parsed.interests ?? [],
      });
    } catch {
      // ignore corrupted storage
    }
  },
  complete: ({ childName, childAge, interests }) => {
    const payload = { childName, childAge, interests };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    set({ completed: true, ...payload });
  },
}));

