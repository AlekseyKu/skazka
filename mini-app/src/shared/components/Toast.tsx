import { useEffect } from "react";

import { useUIStore } from "../stores/uiStore";

export default function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  const hideToast = useUIStore((s) => s.hideToast);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => hideToast(toast.id), 3500),
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, hideToast]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type} anim-slide-up`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

