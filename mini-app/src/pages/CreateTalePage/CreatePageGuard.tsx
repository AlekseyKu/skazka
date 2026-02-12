import { Component, type ErrorInfo, type ReactNode } from "react";
import CreateTalePage from "./CreateTalePage";

interface State {
  error: Error | null;
}

/** Ловит ошибки рендера CreateTalePage и логирует их (часто консоль не показывает). */
export default class CreatePageGuard extends Component<object, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[CreateTalePage]", error, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: "#fff", background: "#1c1b33" }}>
          <h2>Ошибка на странице создания</h2>
          <pre style={{ fontSize: 12, overflow: "auto" }}>
            {this.state.error.message}
          </pre>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Открой консоль (F12 → Console) — там будет полный стек.
          </p>
        </div>
      );
    }
    return <CreateTalePage />;
  }
}
