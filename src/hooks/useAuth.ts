/**
 * ============================================================
 * AUTH HOOK — tRPC First, Demo Fallback
 * ============================================================
 * Real authentication flow:
 * 1. Try to fetch current user from backend via tRPC
 * 2. If backend online + user logged in → return real user
 * 3. If backend offline → check demo mode → return demo user
 * 4. If no token + no demo → return unauthenticated
 * ============================================================
 */

import { useCallback, useMemo } from "react";
import { trpc } from "@/providers/trpc";

const DEMO_USER = {
  id: 999,
  name: "Demo User",
  email: "demo@levav.dev",
  role: "talent" as const,
  avatar: null,
  unionId: "demo",
  loginType: "local" as const,
};

export function useAuth() {
  /* Try to get real user from backend */
  const { data: backendUser, isLoading: backendLoading } = trpc.localAuth.me.useQuery(
    undefined,
    {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      /* Don't fail loudly if backend is offline */
      meta: { suppressErrorToast: true },
    }
  );

  /* Check for demo mode */
  const isDemoMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("levav_demo_mode") === "true";
  }, []);

  /* Determine final user */
  const user = useMemo(() => {
    if (backendUser) {
      return {
        id: backendUser.id,
        name: backendUser.name ?? "User",
        email: backendUser.email ?? "",
        role: (backendUser.role as "talent" | "employer" | "creator" | "admin") ?? "talent",
        avatar: backendUser.avatar ?? null,
        unionId: backendUser.unionId ?? "",
        loginType: (backendUser.loginType as "local" | "oauth") ?? "local",
      };
    }
    if (isDemoMode) return DEMO_USER;
    return null;
  }, [backendUser, isDemoMode]);

  const isAuthenticated = !!user;
  const isLoading = backendLoading && !isDemoMode;

  /* Logout clears everything */
  const logout = useCallback(() => {
    localStorage.removeItem("levav_token");
    localStorage.removeItem("levav_demo_mode");
    localStorage.removeItem("levav_profile");
    window.location.reload();
  }, []);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isDemoMode: isDemoMode || (!backendUser && isAuthenticated),
      logout,
    }),
    [user, isAuthenticated, isLoading, isDemoMode, backendUser, logout]
  );
}
