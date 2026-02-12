import { useAuthStore } from "../stores/authStore";
import { useAuthContext } from "./AuthContext";

export function useAuth() {
  const { isLoading, isAuthorized } = useAuthContext();
  const user = useAuthStore((s) => s.user);

  return {
    isLoading,
    isAuthorized,
    user,
  };
}

