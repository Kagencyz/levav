/**
 * ============================================================
 * APPLICANT TRACKING SYSTEM (/employer/applicants)
 * ============================================================
 * Employer dashboard for managing job applicants.
 * Uses demo data for offline development mode.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { GlassCard } from "@/components/ui/GlassCard";
import { demoApplicants } from "@/lib/demo-data";
import {
  Users, Filter, Star, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Clock, Briefcase, ArrowRight,
  Loader2,
} from "lucide-react";

const STATUS_STAGES = [
  { key: "applied", label: "Applied", color: "bg-white/5 text-white/50" },
  { key: "screening", label: "Screening", color: "bg-amber-500/10 text-amber-400" },
  { key: "interview", label: "Interview", color: "bg-[#7E3BED]/10 text-[#7E3BED]" },
  { key: "offer", label: "Offer", color: "bg-[#C6FF34]/10 text-[#C6FF34]" },
  { key: "hired", label: "Hired", color: "bg-[#C6FF34]/20 text-[#C6FF34]" },
  { key: "rejected", label: "Rejected", color: "bg-red-500/10 text-red-400" },
];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  applied: <Clock className="w-3.5 h-3.5" />,
  screening: <Filter className="w-3.5 h-3.5" />,
  interview: <Users className="w-3.5 h-3.5" />,
  offer: <CheckCircle2 className="w-3.5 h-3.5" />,
  hired: <CheckCircle2 className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
};

export default function ApplicantTrackingPage() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number>(0);
  const [statusNotes, setStatusNotes] = useState<Record<number, string>>({});
  const [localApplicants, setLocalApplicants] = useState(demoApplicants);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  /* tRPC: Load applicants from backend */
  const { data: trpcApplicants } = trpc.application.myApplicants.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  const applicants = (trpcApplicants && Array.isArray(trpcApplicants) && trpcApplicants.length > 0)
    ? trpcApplicants.map((a: any) => ({
        id: a.id,
        name: a.talentName || "Candidate",
        role: a.jobTitle || "Applicant",
        wriScore: a.wriScore || 0,
        goldKeyTier: a.goldKeyTier || "Gold",
        status: a.status || "applied",
        appliedDate: a.appliedAt ? a.appliedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        experience: "3-5 years",
        skills: a.skills ? JSON.parse(a.skills) : [],
        avatar: null,
      }))
    : localApplicants;

  /* Filter */
  const filtered = applicants.filter((a) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return !["hired", "rejected"].includes(a.status);
    return a.status === statusFilter;
  });

  /* Stats */
  const stats = {
    total: applicants.length,
    active: applicants.filter((a) => !["hired", "rejected"].includes(a.status)).length,
    hired: applicants.filter((a) => a.status === "hired").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  const handleStatusChange = (appId: number, newStatus: string) => {
    setUpdatingId(appId);
    setTimeout(() => {
      setLocalApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      setUpdatingId(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-5xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet">ATS</span>
            <span className="text-xs text-white/30">{stats.active} active applicants</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Applicant Tracking</h1>
          <p className="text-body mt-1">Manage candidates across all your job postings</p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Applicants", value: stats.total, icon: <Users className="w-5 h-5" /> },
            { label: "Active Pipeline", value: stats.active, icon: <Filter className="w-5 h-5" /> },
            { label: "Hired", value: stats.hired, icon: <CheckCircle2 className="w-5 h-5" /> },
            { label: "Rejected", value: stats.rejected, icon: <XCircle className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4"
            >
              <div className="text-white/40 mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
              <p className="text-[10px] text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Visual */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
          {STATUS_STAGES.map((stage, i) => {
            const count = applicants.filter((a) => a.status === stage.key).length;
            return (
              <button
                key={stage.key}
                onClick={() => setStatusFilter(statusFilter === stage.key ? "all" : stage.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  statusFilter === stage.key
                    ? stage.color + " border border-current"
                    : "bg-white/[0.02] text-white/30 border border-white/5 hover:bg-white/5"
                }`}
              >
                {STATUS_ICONS[stage.key]}
                {stage.label}
                <span className="text-[10px] opacity-60">({count})</span>
                {i < STATUS_STAGES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-white/10 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Applicant List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((app, i) => {
              const isExpanded = expandedId === app.id;
              const profile = app.profile as Record<string, unknown> | null;
              const wriScore = profile?.currentWriScore
                ? parseFloat(profile.currentWriScore as string)
                : 0;
              const stage = STATUS_STAGES.find((s) => s.key === app.status) ?? STATUS_STAGES[0];

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <GlassCard variant={isExpanded ? "glow" : "interactive"}>
                    {/* Main Row */}
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? 0 : app.id)}
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {String(profile?.firstName ?? "?").charAt(0)}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {profile ? `${profile.firstName} ${profile.lastName}` : `Profile #${app.profileId}`}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${stage.color}`}>
                            {stage.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] text-white/30">
                            <Briefcase className="w-3 h-3 inline mr-1" />
                            {app.jobTitle as string ?? `Job #${app.jobId}`}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-[#C6FF34]">
                            <Star className="w-3 h-3" />
                            WRI™ {wriScore.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* WRI Ring mini */}
                      <div className="flex-shrink-0 text-right">
                        <svg viewBox="0 0 36 36" className="w-10 h-10">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15" fill="none"
                            stroke={wriScore >= 60 ? "#C6FF34" : wriScore >= 40 ? "#7E3BED" : "#FFFFFF"}
                            strokeWidth="3"
                            strokeDasharray={`${(wriScore / 100) * 94} 94`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                      </div>

                      {/* Expand */}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/30 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" />
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-white/5"
                      >
                        {/* Cover Letter */}
                        {app.coverLetter && (
                          <div className="mb-4 p-3 rounded-lg bg-white/[0.02]">
                            <p className="text-[10px] text-white/30 mb-1">Cover Letter</p>
                            <p className="text-xs text-white/60 leading-relaxed">{app.coverLetter as string}</p>
                          </div>
                        )}

                        {/* Employer Notes */}
                        <div className="mb-4">
                          <label className="text-[10px] text-white/30 mb-1 block">Your Notes</label>
                          <textarea
                            className="glass-input w-full text-xs resize-none"
                            rows={2}
                            value={statusNotes[app.id] ?? (app.employerNotes as string) ?? ""}
                            onChange={(e) => setStatusNotes((prev) => ({ ...prev, [app.id]: e.target.value }))}
                            placeholder="Add notes about this candidate..."
                          />
                        </div>

                        {/* Status Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-white/30 mr-1">Move to:</span>
                          {STATUS_STAGES.filter((s) => s.key !== app.status).map((s) => (
                            <button
                              key={s.key}
                              onClick={() => handleStatusChange(app.id, s.key)}
                              disabled={updatingId === app.id}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all disabled:opacity-30 ${s.color} hover:opacity-80`}
                            >
                              {updatingId === app.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                s.label
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <GlassCard variant="strong" className="text-center py-12">
            <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              {statusFilter !== "all" ? "No applicants in this stage" : "No applicants yet"}
            </h3>
            <p className="text-xs text-white/40">
              {statusFilter !== "all"
                ? "Applicants will appear here as they move through the pipeline."
                : "Post a job to start receiving applications."}
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
