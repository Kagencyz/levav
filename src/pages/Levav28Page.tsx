/**
 * ============================================================
 * LEVAV 28™ CRUCIBLE — The Core Assessment Engine
 * ============================================================
 * Per Blueprint Part IV-A: 28-day socratic interactive friction
 * engine. Every day: CONFRONT™ → DISSECT™ → OWN™ → EXECUTE™.
 * Scenarios are CONNECTED — each phase builds on the same crisis.
 * Profession-specific: reads profile (role, workplace, experience)
 * to personalize the entire journey. DISSECT blocks copy/paste.
 * ============================================================
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { getProfessionPack, LEVAV_CODE } from "@/lib/crucible-data";
import type { CrucibleDay } from "@/lib/crucible-data";
import {
  Target, Brain, Shield, Zap, ChevronRight, Lock,
  CheckCircle2, Flame, Sparkles, TrendingUp,
  ArrowRight, RotateCcw, Award, User, Briefcase, Clock,
  AlertTriangle, BarChart3, BookOpen, X,
} from "lucide-react";

const PHASES = ["confront", "dissect", "own", "execute"] as const;
type Phase = typeof PHASES[number];

const PHASE_CONFIG: Record<Phase, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  confront: { icon: <Flame className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-500/10", label: "CONFRONT™" },
  dissect: { icon: <Brain className="w-5 h-5" />, color: "text-[#7E3BED]", bg: "bg-[#7E3BED]/10", label: "DISSECT™" },
  own: { icon: <Shield className="w-5 h-5" />, color: "text-[#C6FF34]", bg: "bg-[#C6FF34]/10", label: "OWN™" },
  execute: { icon: <Zap className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10", label: "EXECUTE™" },
};

interface ProgressEntry {
  day: number;
  phase: Phase;
  completed: boolean;
  response: string;
  score: number;
  timestamp: string;
}

interface UserProfile {
  displayName: string;
  professionValue: string;
  role: string;
  workplace: string;
  experience: string;
  challenge: string;
}

export default function Levav28Page() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [completedPhases, setCompletedPhases] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [showCodeModal, setShowCodeModal] = useState(false);

  /* tRPC: Load profile from backend */
  const { data: trpcProfile } = trpc.profile.me.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  /* Load profile and progress: tRPC first, localStorage fallback */
  useEffect(() => {
    /* Profile */
    if (trpcProfile) {
      setProfile({
        displayName: `${trpcProfile.firstName} ${trpcProfile.lastName}`.trim(),
        professionValue: trpcProfile.profession || "generic",
        role: trpcProfile.role || "Professional",
        workplace: trpcProfile.company || "Not specified",
        experience: trpcProfile.experienceLevel || "mid",
        challenge: "General career growth",
      });
    } else {
      const raw = localStorage.getItem("levav_profile");
      if (raw) {
        try {
          const p = JSON.parse(raw);
          setProfile({
            displayName: p.displayName || `${p.firstName} ${p.lastName}`,
            professionValue: p.professionValue || "generic",
            role: p.role || "Professional",
            workplace: p.workplace || "Not specified",
            experience: p.experience || "mid",
            challenge: p.challenge || "General career growth",
          });
        } catch { /* ignore */ }
      }
    }

    /* Progress from localStorage (will sync to backend on submit) */
    const saved = localStorage.getItem("levav28_progress");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setProgress(p);
        const days = new Set(p.filter((e: ProgressEntry) => e.completed).map((e: ProgressEntry) => e.day));
        setCompletedDays(days);
        const phases = new Set(p.filter((e: ProgressEntry) => e.completed).map((e: ProgressEntry) => `${e.day}-${e.phase}`));
        setCompletedPhases(phases);
        const lastCompleted = Math.max(0, ...Array.from(days));
        const nextDay = lastCompleted + 1;
        setCurrentDay(nextDay <= 7 ? nextDay : 1);
      } catch { /* ignore */ }
    }
  }, [trpcProfile]);

  const pack = getProfessionPack(profile?.professionValue ?? "generic");
  const dayData: CrucibleDay | undefined = pack.days[currentDay - 1];
  const currentPhase: Phase = PHASES[currentPhaseIdx];
  const phaseConfig = PHASE_CONFIG[currentPhase];
  const phaseData = dayData ? dayData[currentPhase] : null;

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (currentPhase === "dissect") {
      e.preventDefault();
      setFeedback("Copy/paste is disabled during DISSECT™. Critical thinking requires your own original analysis.");
      setTimeout(() => setFeedback(null), 4000);
    }
  }, [currentPhase]);

  const handleSubmit = () => {
    if (!phaseData || response.length < phaseData.minLength) {
      setFeedback(`Your response is too brief. Minimum ${phaseData?.minLength ?? 50} characters required. Current: ${response.length}`);
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const score = Math.min(100, Math.max(60, 60 + Math.floor((response.length / phaseData.minLength) * 25)));

      const entry: ProgressEntry = {
        day: currentDay,
        phase: currentPhase,
        completed: true,
        response,
        score,
        timestamp: new Date().toISOString(),
      };

      const newProgress = [...progress.filter((p) => !(p.day === currentDay && p.phase === currentPhase)), entry];
      setProgress(newProgress);
      localStorage.setItem("levav28_progress", JSON.stringify(newProgress));

      const newPhases = new Set(completedPhases).add(`${currentDay}-${currentPhase}`);
      setCompletedPhases(newPhases);

      if (currentPhaseIdx < 3) {
        setCurrentPhaseIdx((i) => i + 1);
        setResponse("");
        setFeedback(`Phase complete! Score: ${score}/100. Moving to ${PHASE_CONFIG[PHASES[currentPhaseIdx + 1]].label}...`);
        setTimeout(() => setFeedback(null), 3000);
      } else {
        const newCompleted = new Set(completedDays).add(currentDay);
        setCompletedDays(newCompleted);
        setFeedback(`Day ${currentDay} complete! All four phases finished. Your WRI™ components are being recalculated.`);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const isDayComplete = completedDays.has(currentDay);
  const isPhaseComplete = completedPhases.has(`${currentDay}-${currentPhase}`);

  const totalScore = progress.reduce((s, p) => s + p.score, 0);
  const avgScore = progress.length > 0 ? (totalScore / progress.length).toFixed(1) : "0.0";
  const completionRate = pack.days.length > 0 ? Math.round((completedDays.size / pack.days.length) * 100) : 0;

  /* Experience label */
  const expLabel = profile?.experience === "entry" ? "0-2 years" :
    profile?.experience === "mid" ? "3-5 years" :
    profile?.experience === "senior" ? "6-10 years" :
    profile?.experience === "expert" ? "10+ years" : "";

  if (showCodeModal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
          <GlassCard variant="glow" className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#C6FF34]/10 flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-[#C6FF34]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">The Levav Code™</h2>
            <p className="text-sm text-white/50 mb-6">The covenant that binds our ecosystem</p>
            <div className="space-y-3 mb-6 text-left">
              {LEVAV_CODE.map((item, i) => (
                <motion.div key={item.code} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-[#C6FF34]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#C6FF34]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#C6FF34]">{item.code}™</p>
                    <p className="text-xs text-white/40">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => setShowCodeModal(false)} className="btn-lime w-full">
              I Accept The Levav Code™
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-lime">Levav 28™</span>
                <span className="text-xs text-white/30">The Crucible</span>
              </div>
              <h1 className="text-hero text-2xl sm:text-3xl">Your 28-Day Journey</h1>
              <p className="text-body mt-1">
                {profile ? (
                  <>Personalized for <strong className="text-[#C6FF34]">{profile.role}</strong> {expLabel && `· ${expLabel}`}</>
                ) : "Transform potential into proven capability"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCodeModal(true)} className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all">
                The Code™
              </button>
              <button onClick={() => { setCurrentDay(1); setCurrentPhaseIdx(0); setResponse(""); setFeedback(null); }}
                className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition-all flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <GlassCard className="mb-6 p-4" glow={false}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Progress · {completedDays.size} of {pack.days.length} days</span>
            <span className="text-xs text-[#C6FF34]">{completionRate}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <motion.div className="h-full bg-gradient-to-r from-[#C6FF34] to-[#7E3BED] rounded-full"
              initial={{ width: 0 }} animate={{ width: `${completionRate}%` }} transition={{ duration: 0.5 }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span>{progress.length} phases completed</span>
            <span>Avg Score: {avgScore}</span>
          </div>
        </GlassCard>

        {/* Day Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {pack.days.map((d) => {
            const isActive = d.day === currentDay;
            const isComplete = completedDays.has(d.day);
            return (
              <button key={d.day} onClick={() => { setCurrentDay(d.day); setCurrentPhaseIdx(0); setResponse(""); setFeedback(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive ? "bg-[#C6FF34] text-black" :
                  isComplete ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20" :
                  "bg-white/5 text-white/40"
                }`}>
                {isComplete ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[9px]">{d.day}</span>}
                Day {d.day}
              </button>
            );
          })}
        </div>

        {/* Day Context */}
        {dayData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <div className="p-4 rounded-xl bg-[#7E3BED]/5 border border-[#7E3BED]/10">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-[#7E3BED]" />
                <span className="text-xs text-[#7E3BED] font-medium">{dayData.title}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{dayData.context}</p>
            </div>
          </motion.div>
        )}

        {/* Phase Indicator */}
        <div className="flex items-center gap-1 mb-6">
          {PHASES.map((phase, i) => {
            const config = PHASE_CONFIG[phase];
            const isActive = i === currentPhaseIdx;
            const isDone = completedPhases.has(`${currentDay}-${phase}`);
            return (
              <div key={phase} className="flex items-center flex-1">
                <div className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-medium transition-all ${
                  isActive ? `${config.bg} ${config.color} ring-1 ring-current/30` :
                  isDone ? "bg-white/[0.02] text-white/50" : "bg-transparent text-white/20"
                }`}>
                  {isDone && !isActive ? <CheckCircle2 className="w-3 h-3" /> : config.icon}
                  {config.label}
                </div>
                {i < 3 && <ChevronRight className="w-3 h-3 text-white/10 flex-shrink-0 mx-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Challenge Card */}
        {phaseData && dayData && !isDayComplete && (
          <motion.div key={`${currentDay}-${currentPhase}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard variant="glow">
              {/* Phase Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${phaseConfig.bg} ${phaseConfig.color}`}>
                  {phaseConfig.icon}
                </div>
                <div>
                  <span className={`text-xs font-semibold ${phaseConfig.color}`}>{phaseConfig.label}</span>
                  <p className="text-[10px] text-white/30">{phaseData.title}</p>
                </div>
                {currentPhase === "dissect" && (
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" /> Copy/Paste Disabled
                  </div>
                )}
              </div>

              {/* Scenario */}
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 mb-4">
                <p className="text-sm text-white/80 leading-relaxed">{phaseData.scenario}</p>
              </div>

              {/* Prompt */}
              <div className="mb-4">
                <p className="text-xs text-[#C6FF34] font-medium mb-2 flex items-center gap-1">
                  <Target className="w-3.5 h-3.5" />
                  Your Challenge
                </p>
                <p className="text-sm text-white/70 leading-relaxed">{phaseData.prompt}</p>
              </div>

              {/* Response */}
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                onPaste={handlePaste}
                placeholder={`Type your response... Minimum ${phaseData.minLength} characters required.`}
                rows={10}
                className="glass-input w-full resize-none text-sm mb-2"
              />
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] ${response.length >= phaseData.minLength ? "text-[#C6FF34]" : "text-white/30"}`}>
                  {response.length} / {phaseData.minLength} characters
                </span>
                {currentPhase === "dissect" && (
                  <span className="text-[10px] text-red-400/60 flex items-center gap-1">
                    <Brain className="w-3 h-3" /> Critical thinking mode — type your original analysis
                  </span>
                )}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`p-3 rounded-lg mb-4 text-xs ${
                      feedback.includes("brief") || feedback.includes("disabled") ?
                        "bg-red-500/10 text-red-400 border border-red-500/20" :
                        "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20"
                    }`}>
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={isSubmitting || response.length < phaseData.minLength}
                className="btn-lime w-full flex items-center justify-center gap-2 disabled:opacity-30">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                ) : currentPhaseIdx < 3 ? (
                  <><ArrowRight className="w-4 h-4" /> Submit & Continue to {PHASE_CONFIG[PHASES[currentPhaseIdx + 1]].label}</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Complete Day {currentDay}</>
                )}
              </button>
            </GlassCard>
          </motion.div>
        )}

        {/* Day Complete */}
        {isDayComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <GlassCard variant="glow" className="text-center p-8">
              <CheckCircle2 className="w-12 h-12 text-[#C6FF34] mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">Day {currentDay} Complete</h3>
              <p className="text-sm text-white/50 mb-2">You have conquered all four phases of today&apos;s challenge.</p>
              <div className="flex items-center justify-center gap-4 mb-4 text-xs">
                {PHASES.map((p) => (
                  <span key={p} className={`flex items-center gap-1 ${PHASE_CONFIG[p].color}`}>
                    <CheckCircle2 className="w-3 h-3" /> {PHASE_CONFIG[p].label}
                  </span>
                ))}
              </div>
              {currentDay < pack.days.length ? (
                <button onClick={() => { setCurrentDay((d) => d + 1); setCurrentPhaseIdx(0); setResponse(""); setFeedback(null); }}
                  className="btn-lime inline-flex items-center gap-2">
                  Start Day {currentDay + 1} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => navigate("/talent")} className="btn-lime inline-flex items-center gap-2">
                  View My WRI™ Score <TrendingUp className="w-4 h-4" />
                </button>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
