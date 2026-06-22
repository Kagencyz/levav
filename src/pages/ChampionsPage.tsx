/**
 * ============================================================
 * CHAMPIONS PAGE — Levav Champions™ Program Hub
 * ============================================================
 * Community leaders who mentor talent, create content, and earn
 * honorariums. This page serves as:
 *   - Public program overview for prospective champions
 *   - Application portal (routes to /champions/apply)
 *   - Approved champion dashboard (stats, mentees, earnings)
 *   - Directory of current champions
 * ============================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy, Crown, Users, Star, Zap, Heart, Wallet,
  BookOpen, ChevronRight, CheckCircle2, Clock, ArrowRight,
  Award, TrendingUp, MessageCircle, BarChart3, Sparkles,
  Shield, Play, FileText, UserCheck, GraduationCap, X,
} from "lucide-react";
import {
  getChampionApplications,
  getMyChampionApplication,
  isApprovedChampion,
  type ChampionApplication,
} from "@/lib/data-layer";

function isDemoToken(): boolean {
  const token = localStorage.getItem("levav_token");
  return !token || token === "demo-token";
}

const BENEFITS = [
  { icon: <Wallet className="w-5 h-5" />, title: "Earn Honorariums", desc: "ZMW 100-200 per mentorship session. Paid monthly to your Levav Wallet™." },
  { icon: <Users className="w-5 h-5" />, title: "Mentor Talent", desc: "Guide emerging professionals through their Levav 28™ Crucible journey." },
  { icon: <Star className="w-5 h-5" />, title: "Champion Badge", desc: "Diamond tier badge on your Levav ID™ profile. Recognized across the ecosystem." },
  { icon: <Zap className="w-5 h-5" />, title: "Early Access", desc: "First access to new features, employer connections, and exclusive opportunities." },
  { icon: <BookOpen className="w-5 h-5" />, title: "Create Content", desc: "Publish courses, articles, and videos through Levav Learn™. Revenue share on all sales." },
  { icon: <Heart className="w-5 h-5" />, title: "Impact Lives", desc: "Shape the next generation of African professionals. Leave a lasting legacy." },
];

const REQUIREMENTS = [
  "WRI™ Score of 75+ (Platinum or Diamond tier)",
  "Complete Levav 28™ Crucible",
  "3+ years professional experience",
  "Passion for helping others grow",
  "Commit to 3+ hours per week",
];

const MENTORSHIP_STYLES = [
  { value: "one-on-one", label: "One-on-One", desc: "Personal mentorship sessions" },
  { value: "group", label: "Group Sessions", desc: "Mentor multiple talents" },
  { value: "async", label: "Asynchronous", desc: "Review submissions, give feedback" },
];

export default function ChampionsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "champions" | "dashboard">("overview");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState<ChampionApplication | null>(null);

  /* tRPC: Fetch champions from backend with localStorage fallback */
  const { data: trpcChampions } = trpc.champions.listChampions.useQuery(undefined, {
    retry: 1,
    enabled: !isDemoToken(),
  });
  const { data: trpcMyApp } = trpc.champions.myApplication.useQuery(undefined, {
    retry: 1,
    enabled: isAuthenticated && !isDemoToken(),
  });

  /* Merge: tRPC data takes priority, fallback to localStorage */
  const localChampions = getChampionApplications().filter((c) => c.status === "approved");
  const allChampions = (trpcChampions as ChampionApplication[] | undefined)?.length
    ? trpcChampions as ChampionApplication[]
    : localChampions;
  const myApplication = (trpcMyApp as ChampionApplication | null | undefined) ?? getMyChampionApplication();
  const isApproved = myApplication?.status === "approved";

  // If approved, default to dashboard tab
  useState(() => {
    if (isApproved) setActiveTab("dashboard");
  });

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><Crown className="w-3 h-3" /> Levav Champions™</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">
            {isApproved ? "Champion Dashboard" : "Levav Champions™ Program"}
          </h1>
          <p className="text-body mt-1">
            {isApproved
              ? "Welcome back, Champion. Your impact is measurable."
              : "Mentor talent. Create content. Earn honorariums. Shape Africa's workforce."}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/5 overflow-x-auto">
          {[
            { key: "overview" as const, label: "Program Overview", show: !isApproved },
            { key: "champions" as const, label: "Our Champions", show: true },
            { key: "dashboard" as const, label: "My Dashboard", show: !!myApplication },
          ].filter((t) => t.show).map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-xs font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === t.key ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════
              OVERVIEW TAB
              ═══════════════════════════════════════════ */}
          {activeTab === "overview" && !isApproved && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Hero CTA */}
              <GlassCard variant="strong" className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#7E3BED]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#C6FF34]/10 flex items-center justify-center">
                      <Crown className="w-7 h-7 text-[#C6FF34]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Become a Levav Champion™</h2>
                      <p className="text-xs text-white/50">Africa's most impactful mentorship program</p>
                    </div>
                  </div>

                  {myApplication?.status === "pending" ? (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-medium text-amber-400">Application Under Review</span>
                      </div>
                      <p className="text-xs text-white/50">
                        Your application was submitted on {new Date(myApplication.appliedAt).toLocaleDateString()}. 
                        Our team reviews all applications within 5 business days. You'll be notified via email and in-app messaging.
                      </p>
                    </div>
                  ) : (
                    <button onClick={() => navigate("/champions/apply")}
                      className="btn-lime w-full sm:w-auto flex items-center justify-center gap-2">
                      Apply to Become a Champion <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </GlassCard>

              {/* Benefits Grid */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C6FF34]" /> Why Become a Champion?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BENEFITS.map((b, i) => (
                    <motion.div key={b.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                      <GlassCard className="h-full">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 flex items-center justify-center flex-shrink-0 text-[#C6FF34]">
                            {b.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-white mb-1">{b.title}</h4>
                            <p className="text-[11px] text-white/50 leading-relaxed">{b.desc}</p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <GlassCard>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#7E3BED]" /> Requirements
                </h3>
                <div className="space-y-2">
                  {REQUIREMENTS.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                      className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#C6FF34]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3 text-[#C6FF34]" />
                      </div>
                      <span className="text-xs text-white/70">{r}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* Mentorship Styles */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C6FF34]" /> Mentorship Styles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MENTORSHIP_STYLES.map((m, i) => (
                    <motion.div key={m.value} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                      <GlassCard className="text-center">
                        <div className="w-10 h-10 rounded-xl bg-[#7E3BED]/10 flex items-center justify-center mx-auto mb-2">
                          <UserCheck className="w-5 h-5 text-[#7E3BED]" />
                        </div>
                        <h4 className="text-xs font-semibold text-white mb-1">{m.label}</h4>
                        <p className="text-[10px] text-white/50">{m.desc}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              CHAMPIONS DIRECTORY TAB
              ═══════════════════════════════════════════ */}
          {activeTab === "champions" && (
            <motion.div key="champions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Champions", value: allChampions.length, icon: <Crown className="w-4 h-4" /> },
                  { label: "Mentees Guided", value: allChampions.reduce((a, c) => a + c.menteesCount, 0), icon: <Users className="w-4 h-4" /> },
                  { label: "Sessions", value: allChampions.reduce((a, c) => a + c.sessionsCompleted, 0), icon: <MessageCircle className="w-4 h-4" /> },
                  { label: "Content Pieces", value: allChampions.reduce((a, c) => a + c.contentPublished, 0), icon: <FileText className="w-4 h-4" /> },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <GlassCard className="text-center">
                      <div className="flex justify-center mb-1 text-[#C6FF34]">{s.icon}</div>
                      <p className="text-xl font-bold text-white">{s.value}</p>
                      <p className="text-[10px] text-white/40">{s.label}</p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {/* Champions List */}
              <div className="space-y-3">
                {allChampions.map((champion, i) => (
                  <motion.div key={champion.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <GlassCard className="group cursor-pointer" onClick={() => setSelectedChampion(champion)}>
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{champion.firstName[0]}{champion.lastName[0]}</span>
                          </div>
                          {champion.goldKeyTier === "Diamond" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C6FF34] flex items-center justify-center">
                              <Crown className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{champion.firstName} {champion.lastName}</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34]">{champion.goldKeyTier}</span>
                          </div>
                          <p className="text-[11px] text-white/50">{champion.role} · {champion.city}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                              <Users className="w-3 h-3" /> {champion.menteesCount} mentees
                            </span>
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" /> {champion.sessionsCompleted} sessions
                            </span>
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {champion.contentPublished} content
                            </span>
                          </div>
                        </div>

                        {/* WRI + Arrow */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[#C6FF34]">{champion.wriScore.toFixed(1)}</p>
                          <p className="text-[9px] text-white/30">WRI™</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                      </div>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/5">
                        {champion.expertiseAreas.map((area) => (
                          <span key={area} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/50">{area}</span>
                        ))}
                        <span className="px-2 py-0.5 rounded-full bg-[#7E3BED]/10 text-[10px] text-[#7E3BED]">{champion.mentorshipStyle}</span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>

              {!isApproved && (
                <div className="text-center pt-4">
                  <p className="text-xs text-white/40 mb-3">Want to join these exceptional professionals?</p>
                  <button onClick={() => navigate("/champions/apply")} className="btn-lime inline-flex items-center gap-2">
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════
              CHAMPION DASHBOARD TAB
              ═══════════════════════════════════════════ */}
          {activeTab === "dashboard" && myApplication && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {isApproved ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Total Earnings", value: `ZMW ${myApplication.totalEarnings.toLocaleString()}`, icon: <Wallet className="w-4 h-4" />, color: "text-[#C6FF34]" },
                      { label: "Mentees", value: myApplication.menteesCount.toString(), icon: <Users className="w-4 h-4" />, color: "text-[#7E3BED]" },
                      { label: "Sessions", value: myApplication.sessionsCompleted.toString(), icon: <MessageCircle className="w-4 h-4" />, color: "text-white" },
                      { label: "Content", value: myApplication.contentPublished.toString(), icon: <FileText className="w-4 h-4" />, color: "text-amber-400" },
                    ].map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                        <GlassCard className="text-center">
                          <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
                          <p className="text-lg font-bold text-white">{s.value}</p>
                          <p className="text-[10px] text-white/40">{s.label}</p>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>

                  {/* Rate Card */}
                  <GlassCard variant="strong">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 flex items-center justify-center">
                          <Award className="w-5 h-5 text-[#C6FF34]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Your Honorarium Rate</p>
                          <p className="text-[10px] text-white/50">ZMW {myApplication.honorariumRate} per session</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#C6FF34]">ZMW {myApplication.honorariumRate}</p>
                        <p className="text-[9px] text-white/30">/session</p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { icon: <Users className="w-5 h-5" />, title: "Start Mentorship Session", desc: "Begin a one-on-one or group session", action: () => toast.info("Mentorship sessions coming soon") },
                        { icon: <FileText className="w-5 h-5" />, title: "Create Content", desc: "Publish to Levav Learn™", action: () => navigate("/creator-dashboard") },
                        { icon: <BarChart3 className="w-5 h-5" />, title: "View Analytics", desc: "Track your impact metrics", action: () => toast.info("Analytics dashboard coming soon") },
                        { icon: <Wallet className="w-5 h-5" />, title: "Withdraw Earnings", desc: "Transfer to your Levav Wallet™", action: () => navigate("/wallet") },
                      ].map((action, i) => (
                        <motion.button key={action.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                          onClick={action.action}
                          className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all text-left">
                          <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 flex items-center justify-center text-[#C6FF34] flex-shrink-0">
                            {action.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white">{action.title}</h4>
                            <p className="text-[10px] text-white/50">{action.desc}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              ) : myApplication.status === "pending" ? (
                <GlassCard variant="strong" className="text-center py-8">
                  <Clock className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-1">Application Under Review</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Your application was submitted on {new Date(myApplication.appliedAt).toLocaleDateString()}. 
                    Our team is reviewing your profile. You'll hear back within 5 business days.
                  </p>
                </GlassCard>
              ) : (
                <GlassCard variant="strong" className="text-center py-8">
                  <X className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-white mb-1">Application Not Approved</h3>
                  <p className="text-xs text-white/50 max-w-md mx-auto mb-4">
                    Your application was not approved at this time. Continue building your WRI™ score and reapply in 30 days.
                  </p>
                  <button onClick={() => navigate("/crucible")} className="btn-lime inline-flex items-center gap-2">
                    Continue Your Crucible <ArrowRight className="w-4 h-4" />
                  </button>
                </GlassCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Champion Detail Modal */}
      <AnimatePresence>
        {selectedChampion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedChampion(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#070a13]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Champion Profile</h3>
                <button onClick={() => setSelectedChampion(null)} className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{selectedChampion.firstName[0]}{selectedChampion.lastName[0]}</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">{selectedChampion.firstName} {selectedChampion.lastName}</h4>
                  <p className="text-xs text-white/50">{selectedChampion.role} · {selectedChampion.city}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34]">{selectedChampion.goldKeyTier}</span>
                    <span className="text-[10px] text-white/40">WRI™ {selectedChampion.wriScore.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] text-white/40 mb-1">Why I Mentor</p>
                  <p className="text-xs text-white/70 leading-relaxed">{selectedChampion.motivation}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-bold text-[#C6FF34]">{selectedChampion.menteesCount}</p>
                    <p className="text-[10px] text-white/40">Mentees</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="text-lg font-bold text-[#7E3BED]">{selectedChampion.sessionsCompleted}</p>
                    <p className="text-[10px] text-white/40">Sessions</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-white/40 mb-1">Expertise Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChampion.expertiseAreas.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-[#7E3BED]/10 text-[10px] text-[#7E3BED]">{a}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-white/40">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedChampion.availability}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {selectedChampion.experience} level</span>
                </div>
              </div>

              <button onClick={() => { setSelectedChampion(null); toast.success("Mentorship request sent! The champion will respond within 48 hours."); }}
                className="btn-lime w-full flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Request Mentorship
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
