import { Component, type ErrorInfo, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface State {
  error: Error | null;
}

/**
 * Оборачивает Outlet и ловит любую ошибку рендера дочерней страницы.
 * Показывает текст ошибки (в dev видно причину «Упс, магия не сработала»).
 */
export default class OutletErrorBoundary extends Component<object, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[Outlet child]", error, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            color: "#fff",
            background: "#1c1b33",
            minHeight: "60vh",
          }}
        >
          <h2 style={{ fontSize: 18 }}>Ошибка на странице</h2>
          <pre
            style={{
              fontSize: 12,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              marginTop: 8,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return <Outlet />;
  }
}
