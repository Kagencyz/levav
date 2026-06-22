/**
 * ============================================================
 * NOTIFICATION CENTER — Bell Icon + Dropdown Panel
 * ============================================================
 * Live notification bell with unread count badge.
 * Dropdown panel showing recent notifications with:
 *   - Mark individual as read
 *   - Mark all as read
 *   - Timestamp display
 *   - Glass card styling matching Levav theme
 * ============================================================
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";

export function NotificationCenter() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ─── Live tRPC Queries ─── */
  const { data: notifications, isLoading } = trpc.notification.list.useQuery(
    undefined,
    { enabled: isAuthenticated, staleTime: 1000 * 15 },
  );

  const { data: unreadData } = trpc.notification.unreadCount.useQuery(
    undefined,
    { enabled: isAuthenticated, staleTime: 1000 * 15, refetchInterval: 30000 },
  );

  const utils = trpc.useUtils();

  const markReadMutation = trpc.notification.markRead.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
      utils.notification.unreadCount.invalidate();
    },
  });

  const markAllReadMutation = trpc.notification.markAllRead.useMutation({
    onSuccess: () => {
      utils.notification.list.invalidate();
      utils.notification.unreadCount.invalidate();
    },
  });

  const unreadCount = unreadData?.count ?? 0;

  /* ─── Close on outside click ─── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ─── Bell Button with Badge ─── */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* ─── Dropdown Panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] glass-card-strong border border-white/10 shadow-2xl shadow-black/50 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C6FF34]" />
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="badge-violet text-[10px]">{unreadCount} new</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllReadMutation.mutate()}
                  disabled={markAllReadMutation.isPending}
                  className="flex items-center gap-1 text-[10px] text-[#C6FF34] hover:text-[#d4ff5c] transition-colors disabled:opacity-30"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
                </div>
              ) : (notifications ?? []).length > 0 ? (
                <div className="divide-y divide-white/5">
                  {(notifications ?? []).map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 p-3 transition-colors ${
                        n.isRead ? "opacity-50" : "bg-white/[0.02]"
                      }`}
                    >
                      {/* Unread indicator */}
                      <div className="mt-1.5 flex-shrink-0">
                        {n.isRead ? (
                          <Check className="w-3 h-3 text-white/20" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C6FF34]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/80 leading-relaxed">{n.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-white/20" />
                          <span className="text-[10px] text-white/30">
                            {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                      </div>

                      {/* Mark read button */}
                      {!n.isRead && (
                        <button
                          onClick={() => markReadMutation.mutate({ notificationId: n.id })}
                          disabled={markReadMutation.isPending}
                          className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/5 transition-colors disabled:opacity-30"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3 text-white/30 hover:text-[#C6FF34]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-white/30">No notifications yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
