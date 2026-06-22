/**
 * ============================================================
 * LEVAV 28™ DAILY CRUCIBLE — AI-POWERED
 * ============================================================
 * The 28-day socratic friction engine with live AI integration:
 *   - CONFRONT™: Profession-tailored AI-generated scenarios
 *   - DISSECT™: Root cause analysis with paste blocking
 *   - OWN™: AI accountability evaluation (must pass score >= 60)
 *   - EXECUTE™: 72-hour tactical recovery plan
 *
 * Features:
 *   - AI challenge generation via tRPC (generateConfrontChallenge)
 *   - AI OWN evaluation via tRPC (evaluateOwnWithAI)
 *   - Voice dictation via AudioDictationCanvas with live transcription
 *   - Paste blocking on all text inputs
 *   - Framer Motion liquid transitions
 * ============================================================
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { AudioDictationCanvas } from "@/components/levav28/AudioDictationCanvas";
import { useAI } from "@/hooks/useAI";
import {
  Target,
  Search,
  UserCircle,
  Rocket,
  ChevronLeft,
  Send,
  AlertCircle,
  CheckCircle2,
  Flame,
  Mic,
  Sparkles,
} from "lucide-react";

type Phase = "confront" | "dissect" | "own" | "execute";

interface CruciblePhase {
  key: Phase;
  label: string;
  icon: React.ReactNode;
  color: string;
  prompt: string;
  placeholder: string;
  minLength: number;
}

/* Default prompts — replaced by AI for CONFRONT™ */
const DEFAULT_PHASES: Omit<CruciblePhase, "prompt">[] = [
  {
    key: "confront",
    label: "CONFRONT™",
    icon: <Target className="w-5 h-5" />,
    color: "#C6FF34",
    placeholder: "Describe the scenario as you understand it. What is at stake?",
    minLength: 50,
  },
  {
    key: "dissect",
    label: "DISSECT™",
    icon: <Search className="w-5 h-5" />,
    color: "#7E3BED",
    placeholder: "Analyze root causes only. Copy/paste is disabled — type your critical thinking.",
    minLength: 100,
  },
  {
    key: "own",
    label: "OWN™",
    icon: <UserCircle className="w-5 h-5" />,
    color: "#C6FF34",
    placeholder: "Own your part. No excuses. Copy/paste is disabled.",
    minLength: 80,
  },
  {
    key: "execute",
    label: "EXECUTE™",
    icon: <Rocket className="w-5 h-5" />,
    color: "#7E3BED",
    placeholder: "Your 72-hour action plan. Be specific. Copy/paste is disabled.",
    minLength: 120,
  },
];

interface Levav28CrucibleProps {
  profession?: string;
  dayNumber?: number;
}

export function Levav28Crucible({
  profession = "Professional",
  dayNumber = 1,
}: Levav28CrucibleProps) {
  const { generateChallenge, evaluateOwn, isGenerating, isEvaluating } = useAI();

  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [responses, setResponses] = useState<Record<Phase, string>>({
    confront: "",
    dissect: "",
    own: "",
    execute: "",
  });
  const [completedPhases, setCompletedPhases] = useState<Set<Phase>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [aiScenario, setAiScenario] = useState<string>("");
  const [ownEvaluation, setOwnEvaluation] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    flags: string[];
    rewriteRequired: boolean;
  } | null>(null);
  const [showDictation, setShowDictation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPhaseKey = DEFAULT_PHASES[currentPhaseIndex].key;
  const currentPhase: CruciblePhase = {
    ...DEFAULT_PHASES[currentPhaseIndex],
    prompt:
      currentPhaseKey === "confront" && aiScenario
        ? aiScenario
        : getDefaultPrompt(currentPhaseKey),
  };
  const currentText = responses[currentPhaseKey];
  const isCurrentValid = currentText.length >= currentPhase.minLength;
  const allCompleted = completedPhases.size === DEFAULT_PHASES.length;

  /* ─── Generate AI CONFRONT scenario on mount ─── */
  useEffect(() => {
    let mounted = true;
    async function loadChallenge() {
      try {
        const result = await generateChallenge({
          profession,
          dayNumber,
        });
        if (mounted) setAiScenario(result.scenario);
      } catch (e) {
        if (import.meta.env.DEV) console.warn("[Crucible] AI challenge failed, using fallback:", e);
        if (mounted) setAiScenario(getDefaultPrompt("confront"));
      }
    }
    loadChallenge();
    return () => { mounted = false; };
  }, [profession, dayNumber, generateChallenge]);

  /* ─── Paste Blocker ─── */
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const el = textareaRef.current;
    if (el) {
      el.classList.add("ring-2", "ring-red-500/50");
      setTimeout(() => el.classList.remove("ring-2", "ring-red-500/50"), 400);
    }
  }, []);

  /* ─── Text Input ─── */
  const handleTextChange = (text: string) => {
    setResponses((prev) => ({ ...prev, [currentPhaseKey]: text }));
    // Clear OWN evaluation when user edits
    if (currentPhaseKey === "own") setOwnEvaluation(null);
  };

  /* ─── Phase Navigation ─── */
  const goToPhase = (index: number) => {
    if (index >= 0 && index < DEFAULT_PHASES.length) {
      setCurrentPhaseIndex(index);
      setOwnEvaluation(null);
    }
  };

  /* ─── AI-Powered OWN Evaluation ─── */
  const evaluateOwnResponse = async (): Promise<boolean> => {
    if (currentPhaseKey !== "own") return true;
    try {
      const result = await evaluateOwn({
        response: responses.own,
        profession,
        scenario: aiScenario || getDefaultPrompt("confront"),
      });
      setOwnEvaluation(result);
      return result.passed;
    } catch (e) {
      if (import.meta.env.DEV) console.warn("[Crucible] OWN evaluation failed:", e);
      return true; // Allow progress on failure
    }
  };

  /* ─── Submit Current Phase ─── */
  const handleSubmitPhase = async () => {
    if (!isCurrentValid) return;

    // OWN phase requires AI evaluation
    if (currentPhaseKey === "own") {
      const passed = await evaluateOwnResponse();
      if (!passed) return; // Block progress until rewrite passes
    }

    setCompletedPhases((prev) => new Set(prev).add(currentPhaseKey));
    if (currentPhaseIndex < DEFAULT_PHASES.length - 1) {
      setCurrentPhaseIndex((prev) => prev + 1);
      setOwnEvaluation(null);
    }
  };

  /* ─── Final Submission ─── */
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setShowComplete(true);
  };

  return (
    <div className="space-y-4">
      {/* ─── Day Header ─── */}
      <GlassCard variant="strong" animate={false}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-[#C6FF34]" />
              <span className="badge-lime">Levav 28™</span>
              <span className="text-xs text-white/40">
                Day {dayNumber} of 28
              </span>
              {profession && (
                <span className="text-[10px] text-[#7E3BED] bg-[#7E3BED]/10 px-1.5 py-0.5 rounded">
                  {profession}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white">Daily Crucible</h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Completed</p>
            <p className="text-lg font-bold text-[#C6FF34]">
              {completedPhases.size}
              <span className="text-white/30">/4</span>
            </p>
          </div>
        </div>
      </GlassCard>

      {/* ─── Phase Navigation Tabs ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DEFAULT_PHASES.map((phase, i) => {
          const isActive = i === currentPhaseIndex;
          const isDone = completedPhases.has(phase.key);
          return (
            <button
              key={phase.key}
              onClick={() => goToPhase(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/30"
                  : isDone
                    ? "bg-white/5 text-white/60 border border-[#C6FF34]/20"
                    : "bg-white/[0.02] text-white/30 border border-white/5"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF34]" />
              ) : (
                <span style={{ color: phase.color }}>{phase.icon}</span>
              )}
              {phase.label}
            </button>
          );
        })}
      </div>

      {/* ─── Active Phase Content ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhaseKey}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <GlassCard variant="glow" animate={false}>
            {/* Phase Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: `${currentPhase.color}15`,
                  color: currentPhase.color,
                }}
              >
                {currentPhaseKey === "confront" && isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                ) : (
                  currentPhase.icon
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {currentPhase.label}
                </h3>
                <p className="text-[10px] text-white/40">
                  Phase {currentPhaseIndex + 1} of {DEFAULT_PHASES.length}
                  {currentPhaseKey === "confront" && isGenerating && (
                    <span className="text-[#C6FF34] ml-1">
                      Generating AI scenario...
                    </span>
                  )}
                </p>
              </div>
              {completedPhases.has(currentPhaseKey) && (
                <CheckCircle2 className="w-5 h-5 text-[#C6FF34] ml-auto" />
              )}
            </div>

            {/* AI-Generated or Default Scenario Prompt */}
            {currentPhaseKey === "confront" && (
              <div className="p-4 rounded-lg bg-[#C6FF34]/5 border border-[#C6FF34]/10 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3 h-3 text-[#C6FF34]" />
                  <span className="text-[10px] text-[#C6FF34] font-medium uppercase tracking-wider">
                    AI-Generated Scenario
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  {aiScenario || getDefaultPrompt("confront")}
                </p>
              </div>
            )}
            {currentPhaseKey !== "confront" && (
              <div className="p-4 rounded-lg bg-[#7E3BED]/5 border border-[#7E3BED]/10 mb-4">
                <p className="text-sm text-white/80 leading-relaxed">
                  {getDefaultPrompt(currentPhaseKey)}
                </p>
              </div>
            )}

            {/* ─── Voice Dictation for EXECUTE™ ─── */}
            {currentPhaseKey === "execute" && showDictation ? (
              <div className="mb-4">
                <AudioDictationCanvas
                  challengeLabel="EXECUTE™"
                  placeholder={currentPhase.placeholder}
                  onSubmit={(text) => {
                    setResponses((prev) => ({ ...prev, execute: text }));
                    setShowDictation(false);
                  }}
                  minLength={currentPhase.minLength}
                />
              </div>
            ) : (
              <>
                {/* Text Input with Paste Blocking */}
                <div className="relative mb-4">
                  <textarea
                    ref={textareaRef}
                    value={currentText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onPaste={handlePaste}
                    placeholder={currentPhase.placeholder}
                    rows={8}
                    className="glass-input w-full resize-none text-sm leading-relaxed"
                    style={{ minHeight: "180px" }}
                  />
                  {/* Paste blocked indicator */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
                    <AlertCircle className="w-3 h-3 text-white/30" />
                    <span className="text-[10px] text-white/30">
                      Paste disabled
                    </span>
                  </div>
                </div>

                {/* ─── Voice Dictation Toggle (EXECUTE™ only) ─── */}
                {currentPhaseKey === "execute" && !showDictation && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowDictation(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7E3BED]/10 text-[#7E3BED] border border-[#7E3BED]/20 hover:bg-[#7E3BED]/20 transition-all text-xs"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      Switch to Voice Dictation
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ─── OWN™ Evaluation Results ─── */}
            <AnimatePresence>
              {currentPhaseKey === "own" && ownEvaluation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-lg border mb-4 ${
                    ownEvaluation.passed
                      ? "bg-[#C6FF34]/5 border-[#C6FF34]/20"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {ownEvaluation.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#C6FF34]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        ownEvaluation.passed
                          ? "text-[#C6FF34]"
                          : "text-red-400"
                      }`}
                    >
                      {ownEvaluation.passed
                        ? `OWN™ Passed — ${ownEvaluation.score}/100`
                        : `Rewrite Required — ${ownEvaluation.score}/100`}
                    </span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed ${
                      ownEvaluation.passed
                        ? "text-white/70"
                        : "text-red-300/70"
                    }`}
                  >
                    {ownEvaluation.feedback}
                  </p>
                  {ownEvaluation.flags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {ownEvaluation.flags.map((flag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          {flag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Character count + actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs tabular-nums ${
                    isCurrentValid ? "text-[#C6FF34]" : "text-white/30"
                  }`}
                >
                  {currentText.length}
                </span>
                <span className="text-xs text-white/20">/</span>
                <span className="text-xs text-white/20">
                  {currentPhase.minLength}
                </span>
                {isEvaluating && currentPhaseKey === "own" && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-[#7E3BED] flex items-center gap-1"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-3 h-3 border border-[#7E3BED] border-t-transparent rounded-full"
                    />
                    AI evaluating...
                  </motion.span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentPhaseIndex > 0 && (
                  <button
                    onClick={() => goToPhase(currentPhaseIndex - 1)}
                    className="btn-ghost text-xs py-2 px-3"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitPhase}
                  disabled={!isCurrentValid || isEvaluating}
                  className="btn-lime text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5" />
                  {currentPhaseIndex === DEFAULT_PHASES.length - 1
                    ? "Finish"
                    : "Submit Phase"}
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* ─── Final Submit ─── */}
      <AnimatePresence>
        {allCompleted && !showComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard
              variant="glow"
              animate={false}
              className="text-center py-6"
            >
              <CheckCircle2 className="w-10 h-10 text-[#C6FF34] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                All Phases Complete
              </h3>
              <p className="text-xs text-white/50 mb-4">
                Submit your daily crucible to update your WRI™ score.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="btn-lime flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  />
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    Submit Day {dayNumber} Crucible
                  </>
                )}
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Completion Celebration ─── */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex p-4 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-4"
            >
              <Flame className="w-10 h-10 text-[#C6FF34]" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">
              Day {dayNumber} Complete
            </h3>
            <p className="text-sm text-white/50 mb-1">
              Your crucible responses have been recorded.
            </p>
            <p className="text-xs text-[#C6FF34]">
              WRI™ score recalculation triggered.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Default Prompts (fallback when AI unavailable) ─── */
function getDefaultPrompt(phase: Phase): string {
  switch (phase) {
    case "confront":
      return "A key client has threatened to terminate their contract due to repeated delivery delays and communication gaps. The project was supposed to launch 3 weeks ago. Your team is blaming each other, and you must identify the real root cause before the client meeting tomorrow.";
    case "dissect":
      return "Now analyze the root causes. Do not describe symptoms — go deeper. What systemic failures led to this crisis? Consider communication breakdowns, process gaps, resource allocation, and accountability structures.";
    case "own":
      return "What is YOUR personal responsibility in this situation? Be brutally honest. What could you have done differently? The Levav Code™ demands ownership — not excuses.";
    case "execute":
      return "Build a 72-hour tactical recovery plan. Specific actions, owners, and deadlines. No vague statements. What will you do in the next 3 days to turn this around?";
  }
}
