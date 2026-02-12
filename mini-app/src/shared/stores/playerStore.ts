import { create } from "zustand";

interface PlayerState {
  currentTaleId: number | null;
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  setTale: (id: number | null) => void;
  setPlayback: (isPlaying: boolean) => void;
  setProgress: (position: number, duration?: number) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTaleId: null,
  isPlaying: false,
  position: 0,
  duration: 0,
  setTale: (id) =>
    set({
      currentTaleId: id,
      position: 0,
      duration: 0,
      isPlaying: false,
    }),
  setPlayback: (isPlaying) => set({ isPlaying }),
  setProgress: (position, duration) =>
    set((state) => ({
      position,
      duration: typeof duration === "number" ? duration : state.duration,
    })),
  reset: () =>
    set({
      currentTaleId: null,
      isPlaying: false,
      position: 0,
      duration: 0,
    }),
}));

