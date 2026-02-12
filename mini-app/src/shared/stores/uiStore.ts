import { create } from "zustand";

type ToastType = "success" | "error" | "info";

export interface ToastState {
  id: string;
  message: string;
  type: ToastType;
}

interface UIState {
  paywallOpen: boolean;
  paywallContext?: string;
  toasts: ToastState[];
  openPaywall: (context?: string) => void;
  closePaywall: () => void;
  showToast: (toast: Omit<ToastState, "id">) => void;
  hideToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  paywallOpen: false,
  paywallContext: undefined,
  toasts: [],
  openPaywall: (context) => set({ paywallOpen: true, paywallContext: context }),
  closePaywall: () => set({ paywallOpen: false, paywallContext: undefined }),
  showToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: `${Date.now()}-${state.toasts.length}` },
      ],
    })),
  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

