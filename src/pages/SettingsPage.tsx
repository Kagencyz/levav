/**
 * ============================================================
 * SETTINGS PAGE — Account & Platform Preferences
 * ============================================================
 * User settings with profile editing, preferences,
 * account management, and display options.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageTransition } from "@/components/ui/PageTransition";
import { toast } from "sonner";
import {
  UserCircle, Bell, Shield, Palette, Globe, Save,
  Loader2, CheckCircle, Moon, Sun, Monitor,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "security" | "appearance";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);

  /* Profile form */
  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    bio: "",
    location: "",
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved!");
    }, 800);
  };

  const tabs: { key: SettingsTab; label: string; icon: any }[] = [
    { key: "profile", label: "Profile", icon: UserCircle },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
    { key: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <PageTransition className="levav-container pt-6 pb-24 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-sm text-white/50 mb-6">Manage your account and preferences.</p>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? "bg-[#C6FF34] text-black" : "text-white/50 hover:text-white/80"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          <GlassCard className="p-5" glow={false}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-[#C6FF34]" /> Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/40 cursor-not-allowed"
                />
                <p className="text-[10px] text-white/30 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                />
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <GlassCard className="p-5" glow={false}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C6FF34]" /> Notification Preferences
          </h3>
          <div className="space-y-3">
            {[
              { label: "Job Alerts", desc: "New jobs matching your profile", defaultOn: true },
              { label: "Messages", desc: "New direct messages", defaultOn: true },
              { label: "WRI Updates", desc: "Score changes and achievements", defaultOn: true },
              { label: "Course Updates", desc: "New lessons and completions", defaultOn: true },
              { label: "Marketing", desc: "Promotions and newsletters", defaultOn: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-white/80">{item.label}</p>
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
                <ToggleSwitch defaultOn={item.defaultOn} />
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <GlassCard className="p-5" glow={false}>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C6FF34]" /> Password
            </h3>
            <div className="space-y-3">
              <input type="password" placeholder="Current password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors" />
              <input type="password" placeholder="New password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors" />
              <input type="password" placeholder="Confirm new password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors" />
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-red-500/20" glow={false}>
            <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-xs text-white/40 mb-3">Once you delete your account, there is no going back.</p>
            <button
              onClick={() => toast.error("Account deletion requires confirmation")}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
            >
              Delete Account
            </button>
          </GlassCard>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <GlassCard className="p-5" glow={false}>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#C6FF34]" /> Theme
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Dark", icon: Moon, desc: "Midnight theme", active: true },
              { label: "Light", icon: Sun, desc: "Coming soon", active: false },
              { label: "System", icon: Monitor, desc: "Coming soon", active: false },
            ].map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.label}
                  disabled={!theme.active}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    theme.active
                      ? "bg-[#C6FF34]/10 border-[#C6FF34]/30 text-[#C6FF34]"
                      : "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{theme.label}</p>
                  <p className="text-[10px] opacity-60">{theme.desc}</p>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </PageTransition>
  );
}

/* Toggle Switch */
function ToggleSwitch({ defaultOn = true }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-[#C6FF34]" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}
