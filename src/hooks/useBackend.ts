/**
 * ============================================================
 * BACKEND HOOK — tRPC + localStorage Fallback
 * ============================================================
 * Universal hook for all pages. Checks if user has a real token
 * and the backend is online. If yes → uses tRPC. If no → falls
 * back to localStorage via the data layer.
 *
 * Usage:
 *   const { isOnline } = useBackend();
 *   // In components:
 *   const { data } = trpc.job.listJobs.useQuery(undefined, {
 *     enabled: isOnline,
 *   });
 *   const jobs = data ?? getJobBoard(); // fallback
 * ============================================================
 */

import { useState, useEffect } from "react";

export function useBackend() {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("levav_token");
      const isDemo = !token || token === "demo-token";
      if (isDemo) { setIsOnline(false); setIsChecking(false); return; }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        if (!apiUrl) { setIsOnline(false); setIsChecking(false); return; }
        const resp = await fetch(`${apiUrl.replace("/trpc", "")}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        });
        setIsOnline(resp.ok);
      } catch {
        setIsOnline(false);
      }
      setIsChecking(false);
    };
    check();
  }, []);

  return { isOnline, isChecking };
}

/* ─── Helper: should we enable tRPC queries? ─── */
export function shouldUseTrpc(): boolean {
  const token = localStorage.getItem("levav_token");
  return !!token && token !== "demo-token";
}
