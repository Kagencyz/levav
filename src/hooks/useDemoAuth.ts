/**
 * ============================================================
 * DEMO AUTH — Offline Development Mode
 * ============================================================
 * When backend is unavailable, this hook provides a mock
 * authenticated user so all pages can be navigated and tested.
 * Toggle: Click "Enter Demo Mode" on login page.
 * ============================================================
 */

import { useState, useCallback, useEffect } from "react";

const DEMO_KEY = "levav_demo_mode";
const DEMO_USER = {
  id: 999,
  name: "Demo User",
  email: "demo@levav.dev",
  role: "talent" as const,
  avatar: null,
};

export function useDemoAuth() {
  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem(DEMO_KEY) === "true";
  });

  useEffect(() => {
    const handler = () => {
      setIsDemo(localStorage.getItem(DEMO_KEY) === "true");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const enableDemo = useCallback(() => {
    localStorage.setItem(DEMO_KEY, "true");
    localStorage.setItem("levav_token", "demo-token");
    setIsDemo(true);
    window.location.reload();
  }, []);

  const disableDemo = useCallback(() => {
    localStorage.removeItem(DEMO_KEY);
    localStorage.removeItem("levav_token");
    setIsDemo(false);
    window.location.reload();
  }, []);

  return {
    isDemoMode: isDemo,
    demoUser: isDemo ? DEMO_USER : null,
    enableDemo,
    disableDemo,
  };
}
