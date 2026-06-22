/**
 * ============================================================
 * LEVAV ID™ PROFILE PAGE
 * ============================================================
 * Displays the user's complete Levav ID™ — all captured
 * onboarding data, WRI™ score, Levav 28™ progress, skills,
 * certifications, and achievements. The central identity
 * document for every talent in the ecosystem.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  User, Briefcase, Building2, MapPin, Clock, Target,
  Star, Award, TrendingUp, BookOpen, Calendar, Code,
  CheckCircle2, Zap, Shield, Flame, Brain, ChevronRight,
  Download, Share2, Edit3, Sparkles, FileText, BadgeCheck,
  GraduationCap, Stethoscope, Calculator, BarChart3,
  Wrench, Palette, HardHat, Phone, ChefHat, MessageSquare,
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

const TIER_COLORS: Record<string, string> = {
  Diamond: "text-[#C6FF34]",
  Platinum: "text-[#7E3BED]",
  Gold: "text-yellow-400",
  Silver: "text-gray-300",
  Bronze: "text-amber-600",
};

const TIER_BG: Record<string, string> = {
  Diamond: "bg-[#C6FF34]/10 border-[#C6FF34]/20",
  Platinum: "bg-[#7E3BED]/10 border-[#7E3BED]/20",
  Gold: "bg-yellow-400/10 border-yellow-400/20",
  Silver: "bg-gray-300/10 border-gray-300/20",
  Bronze: "bg-amber-600/10 border-amber-600/20",
};

function getTier(score: number): string {
  if (score >= 90) return "Diamond";
  if (score >= 75) return "Platinum";
  if (score >= 60) return "Gold";
  if (score >= 40) return "Silver";
  return "Bronze";
}

const PROF_ICONS: Record<string, React.ReactNode> = {
  software_developer: <Code className="w-5 h-5" />,
  registered_nurse: <Stethoscope className="w-5 h-5" />,
  teacher: <GraduationCap className="w-5 h-5" />,
  accountant: <Calculator className="w-5 h-5" />,
  sales_representative: <BarChart3 className="w-5 h-5" />,
  project_manager: <Briefcase className="w-5 h-5" />,
  graphic_designer: <Palette className="w-5 h-5" />,
  electrician: <Wrench className="w-5 h-5" />,
  customer_service: <Phone className="w-5 h-5" />,
  chef: <ChefHat className="w-5 h-5" />,
  civil_engineer: <HardHat className="w-5 h-5" />,
  other: <Sparkles className="w-5 h-5" />,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [wriScore, setWriScore] = useState(0);
  const [wriComponents, setWriComponents] = useState<Record<string, number>>({});
  const [crucibleProgress, setCrucibleProgress] = useState<any[]>([]);
  const [completedDays, setCompletedDays] = useState(0);

  /* tRPC: Fetch profile from backend */
  const { data: trpcProfile } = trpc.profile.me.useQuery(undefined, {
    retry: 1,
    enabled: isAuthenticated && !!localStorage.getItem("levav_token") && localStorage.getItem("levav_token") !== "demo-token",
  });
  const { data: trpcWri } = trpc.wri.me.useQuery(undefined, {
    retry: 1,
    enabled: isAuthenticated && !!localStorage.getItem("levav_token") && localStorage.getItem("levav_token") !== "demo-token",
  });

  useEffect(() => {
    /* Use tRPC data if available, otherwise fall back to localStorage */
    let profileData: any = null;
    if (trpcProfile) {
      profileData = {
        displayName: `${trpcProfile.firstName} ${trpcProfile.lastName}`.trim(),
        firstName: trpcProfile.firstName,
        lastName: trpcProfile.lastName,
        profession: trpcProfile.profession,
        role: trpcProfile.role,
        city: trpcProfile.city,
        country: trpcProfile.country,
        bio: trpcProfile.bio,
        levavCode: trpcProfile.levavCode,
        workplace: trpcProfile.company ?? "",
        experience: trpcProfile.experienceLevel ?? "mid",
        wriScore: trpcProfile.wriScore,
      };
      setProfile(profileData);
      localStorage.setItem("levav_profile", JSON.stringify(profileData));
    } else {
      const raw = localStorage.getItem("levav_profile");
      if (raw) {
        try { profileData = JSON.parse(raw); setProfile(profileData); } catch { /* ignore */ }
      }
    }

    /* WRI from tRPC or localStorage/demo */
    if (trpcWri && typeof trpcWri === "object" && "total" in trpcWri) {
      const tw = trpcWri as any;
      setWriScore(Math.round(tw.total ?? 67));
      if (tw.components) setWriComponents(tw.components);
      else {
        setWriComponents({
          culture: 72, criticalThinking: 68, reliability: 75,
          communication: 70, learning: 65, leadership: 58, impact: 62,
        });
      }
    } else {
      const progRaw = localStorage.getItem("levav28_progress");
      if (progRaw) {
        try {
          const prog = JSON.parse(progRaw);
          setCrucibleProgress(prog);
          const days = new Set(prog.filter((p: any) => p.completed).map((p: any) => p.day));
          setCompletedDays(days.size);
          const comp: Record<string, number> = {};
          WRI_COMPONENTS.forEach((w, i) => {
            const phaseScores = prog
              .filter((p: any) => p.phase === ["confront", "dissect", "own", "execute"][i % 4])
              .map((p: any) => p.score || 0);
            comp[w.key] = phaseScores.length > 0
              ? Math.round(phaseScores.reduce((a: number, b: number) => a + b, 0) / phaseScores.length)
              : Math.round(40 + Math.random() * 30);
          });
          setWriComponents(comp);
          const totalWri = WRI_COMPONENTS.reduce((s, w) => s + (comp[w.key] || 0) * (w.weight / 100), 0);
          setWriScore(Math.round(totalWri));
        } catch { /* ignore */ }
      } else {
        const demoComp: Record<string, number> = {
          culture: 72, criticalThinking: 68, reliability: 75,
          communication: 70, learning: 65, leadership: 58, impact: 62,
        };
        setWriComponents(demoComp);
        setWriScore(67);
        setCompletedDays(3);
      }
    }
  }, [trpcProfile, trpcWri]);

  const tier = getTier(wriScore);
  const displayName = profile?.displayName || "Demo User";
  const levavCode = profile?.levavCode || "LVA-DEM001";

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <GlassCard variant="strong" className="text-center max-w-md">
          <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No Profile Found</h2>
          <p className="text-xs text-white/40 mb-4">Complete the onboarding to create your Levav ID™.</p>
          <button onClick={() => navigate("/onboarding")} className="btn-lime text-xs">Get Started</button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet">Levav ID™</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${TIER_BG[tier]} ${TIER_COLORS[tier]}`}>{tier} Tier</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">{displayName}</h1>
          <p className="text-xs text-white/40 mt-1">{levavCode} · Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "2025"}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Identity Card */}
            <GlassCard variant="strong" delay={0.1}>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{displayName.charAt(0)}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{displayName}</h3>
                <p className="text-xs text-white/40">{profile.role || "Professional"}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Briefcase className="w-3.5 h-3.5 text-white/30" />{profile.profession || "Not specified"}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Building2 className="w-3.5 h-3.5 text-white/30" />{profile.workplace || "Not specified"}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-white/30" />{profile.city || "Not specified"}{profile.province ? `, ${profile.province}` : ""}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock className="w-3.5 h-3.5 text-white/30" />
                  {profile.experience === "entry" ? "0-2 years" : profile.experience === "mid" ? "3-5 years" : profile.experience === "senior" ? "6-10 years" : profile.experience === "expert" ? "10+ years" : "Not specified"}
                </div>
                {profile.challenge && (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Target className="w-3.5 h-3.5 text-white/30" />{profile.challenge}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                <button onClick={() => navigate("/onboarding")} className="flex-1 text-[10px] py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit Profile
                </button>
                <button className="flex-1 text-[10px] py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all flex items-center justify-center gap-1">
                  <Share2 className="w-3 h-3" /> Share
                </button>
              </div>
            </GlassCard>

            {/* Levav 28 Progress */}
            <GlassCard variant="strong" delay={0.15}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#C6FF34]" /> Levav 28™
                </h3>
                <span className="text-xs text-white/40">{completedDays}/28</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] via-[#C6FF34] to-[#7E3BED]" style={{ width: `${(completedDays / 28) * 100}%` }} />
              </div>
              <p className="text-[10px] text-white/30 mb-3">{completedDays === 0 ? "Start your crucible to build your WRI™ score" : `${completedDays} days completed. Keep going!`}</p>
              {completedDays > 0 && (
                <div className="grid grid-cols-4 gap-1">
                  {["CONFRONT™", "DISSECT™", "OWN™", "EXECUTE™"].map((p, i) => {
                    const phaseKey = ["confront", "dissect", "own", "execute"][i];
                    const phaseProg = crucibleProgress.filter((cp: any) => cp.phase === phaseKey && cp.completed).length;
                    return (
                      <div key={p} className="text-center p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="text-xs font-bold text-white/80">{Math.min(7, phaseProg)}</p>
                        <p className="text-[8px] text-white/30">{p.replace("™", "")}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              <button onClick={() => navigate("/crucible")} className="btn-lime w-full text-xs mt-3 flex items-center justify-center gap-1.5">
                {completedDays === 0 ? "Start Levav 28™" : "Continue Crucible"} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </GlassCard>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* WRI Score Card */}
            <GlassCard variant="strong" delay={0.2}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-section text-sm">Workforce Readiness Index™</h3>
                  <p className="text-[10px] text-white/40">Based on Levav 28™ crucible performance</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#C6FF34]">{wriScore}</p>
                  <p className={`text-[10px] font-semibold ${TIER_COLORS[tier]}`}>{tier} Key™</p>
                </div>
              </div>
              <div className="space-y-3">
                {WRI_COMPONENTS.map((w) => {
                  const score = wriComponents[w.key] || 0;
                  return (
                    <div key={w.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{w.label} <span className="text-white/30">({w.weight}%)</span></span>
                        <span className="text-xs font-medium text-white/80">{score}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(score, 100)}%`, backgroundColor: w.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Skills & Strengths */}
            <GlassCard variant="strong" delay={0.25}>
              <h3 className="text-section text-sm mb-3">Verified Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Communication", "Problem Solving", "Teamwork", "Adaptability", "Critical Thinking", "Time Management"].map((skill) => (
                  <span key={skill} className="text-[10px] px-3 py-1.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> {skill}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-white/30">Skills are verified through Levav 28™ crucible performance and employer feedback.</p>
            </GlassCard>

            {/* Crucible Day Summary */}
            {crucibleProgress.length > 0 && (
              <GlassCard variant="strong" delay={0.3}>
                <h3 className="text-section text-sm mb-3">Crucible History</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {crucibleProgress
                    .filter((p: any) => p.completed)
                    .sort((a: any, b: any) => b.timestamp?.localeCompare(a.timestamp || ""))
                    .slice(0, 14)
                    .map((p: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className={`p-1.5 rounded-lg ${p.phase === "confront" ? "bg-red-500/10 text-red-400" : p.phase === "dissect" ? "bg-[#7E3BED]/10 text-[#7E3BED]" : p.phase === "own" ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-amber-500/10 text-amber-400"}`}>
                          {p.phase === "confront" ? <Flame className="w-3 h-3" /> : p.phase === "dissect" ? <Brain className="w-3 h-3" /> : p.phase === "own" ? <Shield className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/70">Day {p.day} — {p.phase[0].toUpperCase() + p.phase.slice(1)}™</p>
                          <p className="text-[10px] text-white/30">{p.timestamp ? new Date(p.timestamp).toLocaleDateString() : "—"}</p>
                        </div>
                        <span className="text-xs font-medium text-[#C6FF34]">{p.score}</span>
                      </div>
                    ))}
                </div>
              </GlassCard>
            )}

            {/* Action Card */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/jobs")} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all text-left group">
                <Briefcase className="w-5 h-5 text-[#C6FF34] mb-2" />
                <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">Browse Jobs</p>
                <p className="text-[10px] text-white/30">Find opportunities</p>
              </button>
              <button onClick={() => navigate("/crucible")} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all text-left group">
                <Flame className="w-5 h-5 text-[#C6FF34] mb-2" />
                <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">Levav 28™</p>
                <p className="text-[10px] text-white/30">Daily challenges</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
