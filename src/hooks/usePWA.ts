/**
 * ============================================================
 * usePWA HOOK — Progressive Web App Integration
 * ============================================================
 * Handles service worker registration, install prompt,
 * and offline status detection.
 * ============================================================
 */

import { useState, useEffect, useCallback } from "react";

interface PWAState {
  isInstallable: boolean;
  isOffline: boolean;
  isInstalled: boolean;
  install: () => Promise<void>;
}

export function usePWA(): PWAState {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  /* ─── Service Worker Registration ─── */
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => { if (import.meta.env.DEV) console.log("[PWA] SW registered:", reg.scope); })
        .catch((err) => { if (import.meta.env.DEV) console.warn("[PWA] SW failed:", err); });
    }
  }, []);

  /* ─── BeforeInstallPrompt ─── */
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  /* ─── Check if already installed ─── */
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  }, []);

  /* ─── Online/Offline Detection ─── */
  useEffect(() => {
    const online = () => setIsOffline(false);
    const offline = () => setIsOffline(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  /* ─── Install Prompt ─── */
  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  return { isInstallable, isOffline, isInstalled, install };
}
