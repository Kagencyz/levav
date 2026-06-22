/**
 * ============================================================
 * NOTIFICATION SETTINGS — Push Notification Preferences
 * ============================================================
 * Manage push notification subscription and per-category
 * preferences. Uses browser Web Push API.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Bell,
  BellRing,
  BellOff,
  Briefcase,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Megaphone,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface NotificationPref {
  jobAlerts: boolean;
  messages: boolean;
  wriUpdates: boolean;
  courseUpdates: boolean;
  systemAnnouncements: boolean;
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white/50" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-[10px] text-white/30">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-[#C6FF34]" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationSettingsPage() {
  const { isAuthenticated } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { data: serverPrefs, isLoading } = trpc.push.preferences.useQuery(
    undefined,
    { enabled: isAuthenticated && isSubscribed },
  );

  const subscribeMutation = trpc.push.subscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(true);
      toast.success("Push notifications enabled!");
    },
    onError: () => toast.error("Failed to enable notifications"),
  });

  const updateMutation = trpc.push.updatePreferences.useMutation({
    onSuccess: () => toast.success("Preferences saved"),
  });

  const unsubscribeMutation = trpc.push.unsubscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(false);
      toast.success("Notifications disabled");
    },
  });

  const [prefs, setPrefs] = useState<NotificationPref>({
    jobAlerts: true,
    messages: true,
    wriUpdates: true,
    courseUpdates: true,
    systemAnnouncements: false,
  });

  useEffect(() => {
    setIsSupported("Notification" in window && "serviceWorker" in navigator);
    if ("Notification" in window) {
      setIsSubscribed(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    if (serverPrefs) {
      setPrefs(serverPrefs);
    }
  }, [serverPrefs]);

  const handleSubscribe = async () => {
    if (!isSupported) {
      toast.error("Push notifications not supported in this browser");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("Permission denied for notifications");
        return;
      }

      /* Mock subscription - production would use real VAPID keys */
      subscribeMutation.mutate({
        endpoint: `https://mock-push.levav.com/${Date.now()}`,
        p256dh: "mock-p256dh-key",
        auth: "mock-auth-key",
        preferences: prefs,
      });
    } catch {
      toast.error("Failed to subscribe to notifications");
    }
  };

  const handleToggle = (key: keyof NotificationPref) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    if (isSubscribed) {
      updateMutation.mutate({ [key]: next[key] });
    }
  };

  return (
    <div className="levav-container pt-6 pb-24 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Bell className="w-6 h-6 text-[#C6FF34]" />
          Notifications
        </h1>
        <p className="text-sm text-white/50 mb-6">
          Control what you get notified about.
        </p>

        {/* Subscription Status */}
        <GlassCard className="p-5 mb-6" glow={false}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isSubscribed
                  ? "bg-[#C6FF34]/10"
                  : "bg-white/5"
              }`}
            >
              {isSubscribed ? (
                <BellRing className="w-6 h-6 text-[#C6FF34]" />
              ) : (
                <BellOff className="w-6 h-6 text-white/30" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/80">
                Push Notifications {isSubscribed ? "Enabled" : "Disabled"}
              </p>
              <p className="text-[10px] text-white/40">
                {isSupported
                  ? isSubscribed
                    ? "You'll receive notifications even when the app is closed"
                    : "Enable to stay updated on jobs, messages & more"
                  : "Your browser doesn't support push notifications"}
              </p>
            </div>
            {isSubscribed ? (
              <button
                onClick={() => unsubscribeMutation.mutate()}
                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs hover:bg-white/10 transition-colors"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={!isSupported || subscribeMutation.isPending}
                className="px-3 py-1.5 rounded-lg bg-[#C6FF34] text-black text-xs font-medium hover:shadow-lime disabled:opacity-30 transition-all"
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Enable"
                )}
              </button>
            )}
          </div>
        </GlassCard>

        {/* Preference Toggles */}
        {isSubscribed && (
          <GlassCard className="p-4" glow={false}>
            <h2 className="text-sm font-semibold mb-2">Notification Types</h2>
            <ToggleRow
              icon={Briefcase}
              label="Job Alerts"
              description="New job postings matching your profession"
              enabled={prefs.jobAlerts}
              onToggle={() => handleToggle("jobAlerts")}
            />
            <ToggleRow
              icon={MessageCircle}
              label="Messages"
              description="New direct messages and replies"
              enabled={prefs.messages}
              onToggle={() => handleToggle("messages")}
            />
            <ToggleRow
              icon={TrendingUp}
              label="WRI Updates"
              description="Score changes and tier upgrades"
              enabled={prefs.wriUpdates}
              onToggle={() => handleToggle("wriUpdates")}
            />
            <ToggleRow
              icon={BookOpen}
              label="Course Updates"
              description="New lessons, course completions, certificates"
              enabled={prefs.courseUpdates}
              onToggle={() => handleToggle("courseUpdates")}
            />
            <ToggleRow
              icon={Megaphone}
              label="Announcements"
              description="Platform updates and feature releases"
              enabled={prefs.systemAnnouncements}
              onToggle={() => handleToggle("systemAnnouncements")}
            />
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
}
