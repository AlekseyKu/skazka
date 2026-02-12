import { useEffect } from "react";
import type { WebApp } from "@twa-dev/sdk";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

export function getTelegramWebApp(): WebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function useTelegramBootstrap() {
  useEffect(() => {
    const webApp = getTelegramWebApp();
    if (!webApp) return;

    try {
      webApp.ready();
      webApp.expand();
      webApp.setHeaderColor("#1c1b33");
      webApp.setBackgroundColor("#1c1b33");
    } catch {
      // ignore sdk errors in non-Telegram environments
    }
  }, []);
}

