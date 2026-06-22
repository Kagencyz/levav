/**
 * ============================================================
 * TALENT DASHBOARD — Identity & Workforce Intelligence Team
 * ============================================================
 * Central hub for talent. Shows WRI™, Levav 28™ progress,
 * recommended jobs, skills, earnings, quick actions.
 * Route: /dashboard
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { GlassCard } from "@/components/ui/GlassCard";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { loadJobBoard } from "@/lib/job-store";
import {
  Star, Flame, Briefcase, TrendingUp, Award,
  Target, Zap, BookOpen, MessageSquare, ChevronRight,
  Users, Clock, DollarSign, MapPin, Send,
  BarChart3, Sparkles, Crown, BadgeCheck,
} from "lucide-react";

const WRI_COMPONENTS = [
  { key: "culture", label: "Culture Fit", weight: 15, color: "#C6FF34" },
  { key: "criticalThinking", label: "Critical Thinking", weight: 15, color: "#7E3BED" },
  { key: "reliability", label: "Reliability", weight: 15, color: "#C6FF34" },
  { key: "communication", label: "Communication", weight: 15, color: "#7E3BED" },
  { key: "learning", label: "Learning Agility", weight: 15, color: "#C6FF34" },
  { key: "leadership", label: "Leadership", weight: 12, color: "#7E3BED" },
  { key: "impact", label: "Impact", weight: 13, color: "#C6FF34" },
];

function getTier(score: number) { return score >= 90 ? "Diamond" : score >= 75 ? "Platinum" : score >= 60 ? "Gold" : score >= 40 ? "Silver" : "Bronze"; }
const TIER_COLORS: Record<string, string> = { Diamond: "text-[#C6FF34]", Platinum: "text-[#7E3BED]", Gold: "text-yellow-400", Silver: "text-gray-300", Bronze: "text-amber-600" };

export default function TalentDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>({});
  const [wriScore, setWriScore] = useState(67);
  const [wriComponents, setWriComponents] = useState<Record<string, number>>({});
  const [completedDays, setCompletedDays] = useState(0);
  const [jobs, setJobs] = useState<any[]>([]);

  /* tRPC: Fetch from backend with localStorage fallback */
  const hasRealToken = isAuthenticated && !!localStorage.getItem("levav_token") && localStorage.getItem("levav_token") !== "demo-token";
  const { data: trpcProfile } = trpc.profile.me.useQuery(undefined, { retry: 1, enabled: hasRealToken });
  const { data: trpcWri } = trpc.wri.me.useQuery(undefined, { retry: 1, enabled: hasRealToken });
  const { data: trpcJobs } = trpc.job.listJobs.useQuery(undefined, { retry: 1, enabled: hasRealToken });

  useEffect(() => {
    /* Profile: tRPC first, then localStorage */
    if (trpcProfile) {
      const p = {
        displayName: `${trpcProfile.firstName} ${trpcProfile.lastName}`.trim(),
        firstName: trpcProfile.firstName,
        lastName: trpcProfile.lastName,
        profession: trpcProfile.profession,
        role: trpcProfile.role,
        city: trpcProfile.city,
        levavCode: trpcProfile.levavCode,
        wriScore: trpcProfile.wriScore,
      };
      setProfile(p);
      localStorage.setItem("levav_profile", JSON.stringify(p));
    } else {
      const raw = localStorage.getItem("levav_profile");
      if (raw) try { setProfile(JSON.parse(raw)); } catch { /* ok */ }
    }

    /* WRI: tRPC first, then localStorage */
    if (trpcWri && typeof trpcWri === "object" && "total" in trpcWri) {
      const tw = trpcWri as any;
      setWriScore(Math.round(tw.total ?? 67));
      setWriComponents(tw.components ?? {});
    } else {
      const progRaw = localStorage.getItem("levav28_progress");
      if (progRaw) {
        try {
          const prog = JSON.parse(progRaw);
          const days = new Set(prog.filter((p: any) => p.completed).map((p: any) => p.day));
          setCompletedDays(days.size);
          const comp: Record<string, number> = {};
          WRI_COMPONENTS.forEach((w, i) => {
            const phaseScores = prog.filter((p: any) => p.phase === ["confront", "dissect", "own", "execute"][i % 4]).map((p: any) => p.score || 0);
            comp[w.key] = phaseScores.length > 0 ? Math.round(phaseScores.reduce((a: number, b: number) => a + b, 0) / phaseScores.length) : Math.round(50 + Math.random() * 20);
          });
          setWriComponents(comp);
          setWriScore(Math.round(WRI_COMPONENTS.reduce((s, w) => s + (comp[w.key] || 0) * (w.weight / 100), 0)));
        } catch { /* ok */ }
      } else {
        const demoComp = { culture: 72, criticalThinking: 68, reliability: 75, communication: 70, learning: 65, leadership: 58, impact: 62 };
        setWriComponents(demoComp);
        setWriScore(67);
      }
    }

    /* Jobs: tRPC first, then localStorage */
    if (trpcJobs && Array.isArray(trpcJobs) && trpcJobs.length > 0) {
      setJobs(trpcJobs.filter((j: any) => j.status === "active").slice(0, 4));
    } else {
      setJobs(loadJobBoard().filter((j: any) => j.status === "active").slice(0, 4));
    }
  }, [trpcProfile, trpcWri, trpcJobs]);

  const tier = getTier(wriScore);
  const displayName = profile?.displayName || "Talent";
  const profession = profile?.profession || "Professional";

  const quickActions = [
    { label: "Levav 28\u2122", sub: `${completedDays}/28 days`, icon: <Flame className="w-5 h-5" />, color: "text-[#C6FF34]", bg: "bg-[#C6FF34]/10", path: "/crucible" },
    { label: "Browse Jobs", sub: `${jobs.length} open`, icon: <Briefcase className="w-5 h-5" />, color: "text-[#7E3BED]", bg: "bg-[#7E3BED]/10", path: "/jobs" },
    { label: "My Advisor", sub: "Swarm AI", icon: <Zap className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10", path: "/advisor" },
    { label: "Learn", sub: "Courses", icon: <BookOpen className="w-5 h-5" />, color: "text-cyan-400", bg: "bg-cyan-500/10", path: "/learn" },
  ];

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-5xl mx-auto py-6 sm:py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="badge-violet">Talent Dashboard</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20 font-semibold ${TIER_COLORS[tier]}`}>{tier} Key\u2122</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Welcome back, {displayName.split(" ")[0]}</h1>
          <p className="text-body mt-1">Your workforce intelligence at a glance</p>
        </motion.div>

        {/* WRI Score Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard variant="strong" className="mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Score Circle */}
              <div className="flex-shrink-0 relative">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#C6FF34" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(wriScore / 100) * 264} 264`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#C6FF34]">{wriScore}</span>
                  <span className="text-[9px] text-white/40">WRI\u2122</span>
                </div>
              </div>

              {/* WRI Components */}
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">Workforce Readiness Index\u2122</h3>
                  <button onClick={() => navigate("/wri-history")} className="text-[10px] text-[#C6FF34] hover:underline flex items-center gap-1"><TrendingUp className="w-3 h-3" /> History</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WRI_COMPONENTS.map((w) => (
                    <div key={w.key} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-white/40">{w.label}</span>
                        <span className="text-[10px] font-medium" style={{ color: w.color }}>{wriComponents[w.key] || 0}</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(wriComponents[w.key] || 0, 100)}%`, backgroundColor: w.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, i) => (
            <motion.button key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => navigate(action.path)} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-left group">
              <div className={`p-2 rounded-lg ${action.bg} ${action.color} w-fit mb-2`}>{action.icon}</div>
              <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">{action.label}</p>
              <p className="text-[10px] text-white/40">{action.sub}</p>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Levav 28 Progress */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard variant="strong">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Flame className="w-4 h-4 text-[#C6FF34]" /> Levav 28\u2122 Progress</h3>
                <span className="text-xs text-white/40">{completedDays}/28</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-3">
                <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] via-[#C6FF34] to-[#7E3BED]" style={{ width: `${(completedDays / 28) * 100}%` }} />
              </div>
              {completedDays === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-white/40 mb-2">Start your 28-day transformation</p>
                  <button onClick={() => navigate("/crucible")} className="btn-lime text-xs">Begin Day 1</button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {["CONFRONT\u2122", "DISSECT\u2122", "OWN\u2122", "EXECUTE\u2122"].map((p, i) => (
                    <div key={p} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-sm font-bold text-white/80">{Math.min(7, Math.max(0, completedDays - i * 7))}</p>
                      <p className="text-[8px] text-white/30">{p.replace("\u2122", "")}</p>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => navigate("/crucible")} className="btn-outline w-full text-xs flex items-center justify-center gap-1.5">
                {completedDays === 0 ? "Start Crucible" : "Continue"} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          </motion.div>

          {/* Center: Recommended Jobs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard variant="strong">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#7E3BED]" /> For You</h3>
                <button onClick={() => navigate("/jobs")} className="text-[10px] text-[#C6FF34] hover:underline">View All</button>
              </div>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div key={job.id} onClick={() => navigate("/jobs")}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer group">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{job.company[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate group-hover:text-[#C6FF34] transition-colors">{job.title}</p>
                      <p className="text-[10px] text-white/40">{job.company} · {job.location}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#C6FF34] flex-shrink-0" />
                  </div>
                ))}
                {jobs.length === 0 && <p className="text-xs text-white/30 text-center py-4">No active job postings</p>}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: Activity & Stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard variant="strong">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-[#C6FF34]" /> Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34]"><Target className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-white/70">Profile Completion</p>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-1">
                      <div className="h-full rounded-full bg-[#C6FF34]" style={{ width: `${profile?.profession ? 85 : 45}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-white/50">{profile?.profession ? "85%" : "45%"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#7E3BED]/10 text-[#7E3BED]"><Award className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-white/70">Skills Verified</p>
                    <p className="text-[10px] text-white/30">6 core competencies</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-white/70">Time on Platform</p>
                    <p className="text-[10px] text-white/30">{completedDays} active days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400"><Sparkles className="w-4 h-4" /></div>
                  <div className="flex-1">
                    <p className="text-xs text-white/70">WRI\u2122 Trend</p>
                    <p className="text-[10px] text-[#C6FF34]">+{Math.round(wriScore * 0.05)} points this week</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom: More Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "My Profile", desc: "Levav ID\u2122 & settings", icon: <BadgeCheck className="w-4 h-4" />, path: "/profile" },
              { label: "Messages", desc: "2 unread", icon: <MessageSquare className="w-4 h-4" />, path: "/messages" },
              { label: "Leaderboard", desc: "Rank #247", icon: <Crown className="w-4 h-4" />, path: "/leaderboard" },
              { label: "Quickwork\u2122", desc: "Earn now", icon: <DollarSign className="w-4 h-4" />, path: "/quickwork" },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(item.path)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group text-left">
                <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:text-[#C6FF34] transition-colors">{item.icon}</div>
                <div>
                  <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">{item.label}</p>
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
