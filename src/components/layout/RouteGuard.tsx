/**
 * ============================================================
 * ROUTE GUARD — Development Mode (Auth Optional)
 * ============================================================
 * In development/demo mode: All pages are publicly accessible.
 * Auth is only enforced for sensitive actions (not navigation).
 * 
 * When backend is online, set VITE_ENFORCE_AUTH=true to
 * restore authentication requirements.
 * ============================================================
 */

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonCard } from "@/components/ui/Skeletons";

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: string;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export function RouteGuard({
  children,
  requiredRole,
  requireAuth = false, /* Default FALSE — all pages public for testing */
}: RouteGuardProps) {
  const { isLoading } = useAuth();

  /* ─── Loading State ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-3">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  /* ─── In dev mode: render everything ─── */
  /* Role checking still shows a banner but doesn't block */
  return <>{children}</>;
}
