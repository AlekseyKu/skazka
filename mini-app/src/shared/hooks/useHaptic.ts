import { getTelegramWebApp } from "./useTelegram";

type ImpactStyle = "light" | "medium" | "heavy" | "rigid" | "soft";
type NotificationType = "success" | "error" | "warning";

export function hapticImpact(style: ImpactStyle = "light") {
  const webApp = getTelegramWebApp();
  try {
    webApp?.HapticFeedback.impactOccurred(style);
  } catch {
    // noop outside Telegram
  }
}

export function hapticSelectionChanged() {
  const webApp = getTelegramWebApp();
  try {
    webApp?.HapticFeedback.selectionChanged();
  } catch {
    // noop
  }
}

export function hapticNotification(type: NotificationType) {
  const webApp = getTelegramWebApp();
  try {
    webApp?.HapticFeedback.notificationOccurred(type);
  } catch {
    // noop
  }
}

