import type React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { status } = useAuth();

  if (import.meta.env.DEV) {
    return children;
  }

  if (status === "authorized") {
    return children;
  }

  return <Navigate to="/profile" replace />;
}
