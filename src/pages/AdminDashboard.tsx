/**
 * ============================================================
 * ADMIN DASHBOARD v2 — Platform Management Console
 * ============================================================
 * Complete admin panel with:
 * - Platform overview KPIs
 * - User management table
 * - Content moderation flags
 * - System health status
 * - Quick actions
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { toast } from "sonner";
import {
  Shield, Users, Briefcase, BookOpen, AlertTriangle,
  CheckCircle, XCircle, Clock, TrendingUp, Search,
  MoreHorizontal, Lock, Globe, Zap,
} from "lucide-react";

const demoStats = {
  totalUsers: 1247,
  newUsersToday: 23,
  totalJobs: 156,
  pendingJobs: 8,
  totalCourses: 42,
  flaggedContent: 3,
  wriAssessments: 892,
  revenueZmw: "12,450",
};

const demoUsers = [
  { id: 1, name: "Chanda Banda", email: "chanda@email.com", role: "talent", status: "active", joined: "2 days ago", wri: 78 },
  { id: 2, name: "BongoHive Ltd", email: "admin@bongohive.co.zm", role: "employer", status: "active", joined: "1 week ago", wri: null },
  { id: 3, name: "Mutale Mwanza", email: "mutale@email.com", role: "talent", status: "active", joined: "3 days ago", wri: 72 },
  { id: 4, name: "Grace Lungu", email: "grace@email.com", role: "creator", status: "pending", joined: "1 day ago", wri: 81 },
  { id: 5, name: "Spam Bot", email: "spam@temp.com", role: "talent", status: "suspended", joined: "5 hours ago", wri: 12 },
];

const demoFlags = [
  { id: 1, type: "job", content: "Work from home - earn $500/day", reason: "Suspicious salary", reportedBy: "3 users", status: "pending" },
  { id: 2, type: "post", content: "Check out my crypto scheme!", reason: "Spam", reportedBy: "5 users", status: "pending" },
  { id: 3, type: "profile", content: "Fake company profile", reason: "False information", reportedBy: "2 users", status: "resolved" },
];

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-[#C6FF34]",
    pending: "bg-[#F59E0B]",
    suspended: "bg-red-500",
    resolved: "bg-[#C6FF34]",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status] ?? "bg-white/20"}`} />;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isDemoMode } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "moderation">("overview");

  /* Admin guard - only allow admin role */
  const isAdmin = user?.role === "admin" || isDemoMode;

  if (!isAdmin) {
    return (
      <PageTransition className="levav-container pt-6 pb-24">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Lock className="w-12 h-12 text-white/20 mb-4" />
          <h2 className="text-lg font-semibold text-white/60 mb-2">Admin Access Required</h2>
          <p className="text-sm text-white/40 max-w-xs">You need administrator privileges to access this panel.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="levav-container pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#C6FF34]" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Admin Console</h1>
            <p className="text-xs text-white/40">Platform management</p>
          </div>
        </div>
        <span className="px-2 py-1 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34] text-[10px] font-medium">
          Demo Mode
        </span>
      </div>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StaggerItem><StatCard label="Total Users" value={demoStats.totalUsers} icon={Users} /></StaggerItem>
        <StaggerItem><StatCard label="Active Jobs" value={demoStats.totalJobs} icon={Briefcase} /></StaggerItem>
        <StaggerItem><StatCard label="Courses" value={demoStats.totalCourses} icon={BookOpen} /></StaggerItem>
        <StaggerItem><StatCard label="Flagged" value={demoStats.flaggedContent} icon={AlertTriangle} /></StaggerItem>
      </StaggerContainer>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6">
        {(["overview", "users", "moderation"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? "bg-[#C6FF34] text-black" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Revenue */}
          <GlassCard className="p-5" glow={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/50 mb-1">Platform Revenue</p>
                <p className="text-2xl font-bold text-[#C6FF34]">ZMW {demoStats.revenueZmw}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">WRI Assessments</p>
                <p className="text-xl font-bold">{demoStats.wriAssessments}</p>
              </div>
            </div>
          </GlassCard>

          {/* System Health */}
          <GlassCard className="p-5" glow={false}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C6FF34]" /> System Status
            </h3>
            <div className="space-y-2">
              {[
                { name: "Frontend", status: "Operational", health: "good" },
                { name: "API Server", status: "Operational", health: "good" },
                { name: "Database", status: "Operational", health: "good" },
                { name: "Email Service", status: "Not Configured", health: "warn" },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/60">{svc.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${svc.health === "good" ? "bg-[#C6FF34]" : "bg-[#F59E0B]"}`} />
                    <span className="text-xs text-white/40">{svc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Users ({demoUsers.length})</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
              <input type="text" placeholder="Search users..." className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/30 w-48" />
            </div>
          </div>
          {demoUsers.map((u) => (
            <GlassCard key={u.id} className="p-3" glow={false}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">{u.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate">{u.name}</p>
                  <p className="text-[10px] text-white/30">{u.email}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 capitalize">{u.role}</span>
                <StatusDot status={u.status} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "moderation" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-2">Flagged Content ({demoFlags.length})</h3>
          {demoFlags.map((flag) => (
            <GlassCard key={flag.id} className="p-4" glow={false}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${flag.status === "pending" ? "text-[#F59E0B]" : "text-[#C6FF34]"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/80 capitalize">{flag.type}</span>
                    <StatusDot status={flag.status} />
                  </div>
                  <p className="text-sm text-white/60 mb-1">{flag.content}</p>
                  <p className="text-[10px] text-white/30">{flag.reason} • {flag.reportedBy}</p>
                  {flag.status === "pending" && (
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => toast.success("Content approved")} className="px-3 py-1.5 rounded-lg bg-[#C6FF34] text-black text-[10px] font-medium">Approve</button>
                      <button onClick={() => toast.error("Content removed")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-medium">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
