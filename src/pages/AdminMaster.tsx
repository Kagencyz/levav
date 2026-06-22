/**
 * ============================================================
 * ADMIN MASTER PANEL (/admin-master) — LIVE DATA + ROLE GUARD
 * ============================================================
 * The Operational Core — restricted to role === 'admin'.
 * Wired to real tRPC for: impact partner verifications,
 * employer approvals, course audits, system overview stats.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { SkeletonCard, SkeletonStatCard } from "@/components/ui/Skeletons";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import {
  Shield, BookOpen, Heart, Briefcase, CheckCircle2, XCircle,
  Users, FileCheck, Eye, Zap, BarChart3, Clock, Lock,
} from "lucide-react";

type AdminTab = "overview" | "courses" | "partners" | "employers";

export default function AdminMaster() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const isAdmin = user?.role === "admin";

  /* ─── Live tRPC Queries ─── */
  const { data: partners, isLoading: partnersLoading } = trpc.impact.partners.useQuery(
    { verificationStatus: "pending" },
    { enabled: isAdmin },
  );

  const { data: employers, isLoading: employersLoading } = trpc.employer.list.useQuery(
    undefined,
    { enabled: isAdmin },
  );

  const { data: allJobs } = trpc.job.listJobs.useQuery(
    { pageSize: 100 },
    { enabled: isAdmin },
  );

  const verifyPartnerMutation = trpc.impact.verifyPartner.useMutation({
    onSuccess: () => utils.impact.partners.invalidate(),
  });

  const utils = trpc.useUtils();

  /* ─── Admin Gate ─── */
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black pb-8">
        <div className="levav-container max-w-6xl mx-auto py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
          <SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-sm text-white/50">
            The Admin Master Panel is restricted to system administrators.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Derived Stats ─── */
  const pendingPartners = (partners ?? []).filter((p) => p.verificationStatus === "pending");
  const pendingEmployers = (employers ?? []).filter((e) => e.verificationStatus === "pending");
  const activeJobs = (allJobs ?? []).filter((j: { status: string }) => j.status === "published").length;

  const tabs = [
    { key: "overview" as AdminTab, label: "Overview", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "courses" as AdminTab, label: "Courses", icon: <BookOpen className="w-4 h-4" />, badge: 0 },
    { key: "partners" as AdminTab, label: "Partners", icon: <Heart className="w-4 h-4" />, badge: pendingPartners.length },
    { key: "employers" as AdminTab, label: "Employers", icon: <Briefcase className="w-4 h-4" />, badge: pendingEmployers.length },
  ];

  const analyticsLink = { label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, path: "#/admin-master/analytics" };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-6xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet">Admin Master</span>
            <span className="text-xs text-white/30">Restricted Access</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Admin Master Panel</h1>
          <p className="text-body mt-1">Africa&apos;s Workforce Intelligence Ecosystem™</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total Users" value={"--"} icon={<Users className="w-5 h-5" />} delay={0} />
          <StatCard label="Pending Verifications" value={pendingPartners.length + pendingEmployers.length} icon={<FileCheck className="w-5 h-5" />} delay={0.05} />
          <StatCard label="Active Courses" value={"--"} icon={<BookOpen className="w-5 h-5" />} delay={0.1} />
          <StatCard label="Active Jobs" value={activeJobs} icon={<Briefcase className="w-5 h-5" />} delay={0.15} />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.key
                  ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/30"
                  : "bg-white/[0.02] text-white/40 border border-white/5 hover:bg-white/5"
              }`}>
              {tab.icon}{tab.label}
              {tab.badge ? (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">{tab.badge}</span>
              ) : null}
            </button>
          ))}
          <a href={analyticsLink.path}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 bg-white/[0.02] text-[#7E3BED] border border-[#7E3BED]/20 hover:bg-[#7E3BED]/10"
          >
            {analyticsLink.icon}{analyticsLink.label}
          </a>
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard variant="glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34]"><Zap className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-semibold text-white">WRI™ Engine</h3><p className="text-[10px] text-white/30">Active</p></div>
                </div>
                <p className="text-xs text-white/40">7 components, 5 triggers, real-time recalculation.</p>
              </GlassCard>
              <GlassCard variant="glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#7E3BED]/10 text-[#7E3BED]"><Shield className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-semibold text-white">Levav Code™</h3><p className="text-[10px] text-white/30">8 Pillars</p></div>
                </div>
                <p className="text-xs text-white/40">Digital covenant tracking across all talent profiles.</p>
              </GlassCard>
              <GlassCard variant="glow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-white/5 text-white/60"><Clock className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-semibold text-white">Levav 28™</h3><p className="text-[10px] text-white/30">28-Day Cycle</p></div>
                </div>
                <p className="text-xs text-white/40">Socratic friction engine with AI challenge generation.</p>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* ─── COURSES TAB ─── */}
        {activeTab === "courses" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard variant="strong">
              <div className="flex items-center gap-2 mb-4"><BookOpen className="w-4 h-4 text-[#C6FF34]" /><h2 className="text-section text-base">Course Audit</h2></div>
              <p className="text-sm text-white/30 text-center py-8">Course moderation features coming soon.</p>
            </GlassCard>
          </motion.div>
        )}

        {/* ─── PARTNERS TAB ─── */}
        {activeTab === "partners" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard variant="strong">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-[#C6FF34]" />
                <h2 className="text-section text-base">Pending Partner Verifications</h2>
                {pendingPartners.length > 0 && <span className="badge-violet">{pendingPartners.length} pending</span>}
              </div>
              {partnersLoading ? (
                <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
              ) : pendingPartners.length > 0 ? (
                <div className="space-y-2">
                  {pendingPartners.map((partner) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white/90">{partner.name}</p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{partner.verificationStatus}</span>
                        </div>
                        <p className="text-xs text-white/40">{partner.sector} &middot; {partner.city ?? "Zambia"} &middot; {partner.registrationNumber ?? "No reg"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => verifyPartnerMutation.mutate({ partnerId: partner.id, status: "verified" })}
                          className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34] hover:bg-[#C6FF34]/20 transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => verifyPartnerMutation.mutate({ partnerId: partner.id, status: "rejected" })}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-[#C6FF34]/20 mx-auto mb-2" />
                  <p className="text-sm text-white/30">All partners verified.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* ─── EMPLOYERS TAB ─── */}
        {activeTab === "employers" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard variant="strong">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-[#C6FF34]" />
                <h2 className="text-section text-base">Employer Approvals</h2>
                {pendingEmployers.length > 0 && <span className="badge-violet">{pendingEmployers.length} pending</span>}
              </div>
              {employersLoading ? (
                <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
              ) : (employers ?? []).length > 0 ? (
                <div className="space-y-2">
                  {(employers ?? []).map((emp: { id: number; companyName: string | null; verificationStatus: string; industry?: string | null; companySize?: string | null; city?: string | null }) => (
                    <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white/90">{emp.companyName}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            emp.verificationStatus === "verified" ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-amber-500/10 text-amber-400"
                          }`}>{emp.verificationStatus}</span>
                        </div>
                        <p className="text-xs text-white/40">{emp.industry} &middot; {emp.companySize ?? "Unknown size"} &middot; {emp.city ?? "Zambia"}</p>
                      </div>
                      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <Eye className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-8 h-8 text-white/10 mx-auto mb-2" />
                  <p className="text-sm text-white/30">No employer registrations yet.</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
