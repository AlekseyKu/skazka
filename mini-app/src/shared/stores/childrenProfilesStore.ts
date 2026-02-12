import { create } from "zustand";

const STORAGE_KEY = "skazka_children_profiles_v1";

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  birthday: string;
  interests: string[];
}

interface ChildrenProfilesState {
  children: ChildProfile[];
  hydrate: () => void;
  addChild: () => void;
  updateChild: (id: string, data: Partial<Omit<ChildProfile, "id">>) => void;
  getMaxChildren: (subscription: string) => number;
}

function persist(children: ChildProfile[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ children }));
  }
}

export const useChildrenProfilesStore = create<ChildrenProfilesState>((set, get) => ({
  children: [
    {
      id: "1",
      name: "Маша",
      age: 5,
      birthday: "2021-03-15",
      interests: ["🐰 Животные", "🏰 Приключения", "🤝 Дружба"],
    },
  ],
  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { children?: ChildProfile[] };
      if (Array.isArray(parsed.children) && parsed.children.length > 0) {
        set({ children: parsed.children });
      }
    } catch {
      // ignore
    }
  },
  addChild: () =>
    set((state) => {
      const id = String(Date.now());
      const next = [
        ...state.children,
        {
          id,
          name: "",
          age: 5,
          birthday: "",
          interests: [],
        },
      ];
      persist(next);
      return { children: next };
    }),
  updateChild: (id, data) =>
    set((state) => {
      const next = state.children.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      );
      persist(next);
      return { children: next };
    }),
  getMaxChildren: (subscription: string) => {
    if (subscription === "premium") return 5;
    if (subscription === "family") return 3;
    return 1;
  },
}));
