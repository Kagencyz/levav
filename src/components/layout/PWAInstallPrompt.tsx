/**
 * ============================================================
 * PWA INSTALL PROMPT + OFFLINE INDICATOR
 * ============================================================
 * Shows an install banner when the PWA is installable.
 * Also displays an offline indicator when connection is lost.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, WifiOff } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export function PWAInstallPrompt() {
  const { isInstallable, isOffline, isInstalled, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  /* Remember dismissal */
  useEffect(() => {
    if (localStorage.getItem("levav-pwa-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("levav-pwa-dismissed", "1");
  };

  /* Show nothing if installed or dismissed */
  if (isInstalled || dismissed) {
    return (
      /* Still show offline indicator */
      <OfflineIndicator isOffline={isOffline} />
    );
  }

  return (
    <>
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-[360px]"
          >
            <div className="glass-card-strong border border-[#C6FF34]/20 p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34] flex-shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white">Install Levav™</p>
                <p className="text-[10px] text-white/40">Add to home screen for offline access</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={install}
                  className="px-3 py-1.5 rounded-lg bg-[#C6FF34] text-black text-[10px] font-medium hover:shadow-lime transition-all"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <OfflineIndicator isOffline={isOffline} />
    </>
  );
}

function OfflineIndicator({ isOffline }: { isOffline: boolean }) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-amber-500/90 backdrop-blur-sm text-black text-center py-1.5"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">You are offline. Some features may be limited.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
