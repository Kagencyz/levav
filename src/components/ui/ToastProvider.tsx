/**
 * ============================================================
 * TOAST NOTIFICATION SYSTEM
 * ============================================================
 * Real-time toast notifications for WRI™ updates, shift matches,
 * job applications, validation confirmations. Uses sonner with
 * Levav Neon Glass styling.
 * ============================================================
 */

import { Toaster as Sonner } from "sonner";
import { CircleCheck, Info, Loader2, OctagonX, TriangleAlert } from "lucide-react";

export function ToastProvider() {
  return (
    <Sonner
      position="top-right"
      expand={false}
      richColors={false}
      icons={{
        success: <CircleCheck className="w-4 h-4 text-[#C6FF34]" />,
        info: <Info className="w-4 h-4 text-[#7E3BED]" />,
        warning: <TriangleAlert className="w-4 h-4 text-amber-400" />,
        error: <OctagonX className="w-4 h-4 text-red-400" />,
        loading: <Loader2 className="w-4 h-4 animate-spin text-[#7E3BED]" />,
      }}
      toastOptions={{
        style: {
          background: "rgba(7, 10, 19, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#FFFFFF",
          fontSize: "13px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
        },
      }}
    />
  );
}
