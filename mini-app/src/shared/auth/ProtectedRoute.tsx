import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./useAuth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isLoading, isAuthorized } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

