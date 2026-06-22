/**
 * ============================================================
 * TALENT LIFECYCLE ONBOARDING PIPELINE (/talent)
 * ============================================================
 * Three-step gated onboarding flow:
 *   Step 1: The Levav Code™ Modal — covenant acceptance (blocking)
 *   Step 2: Profile Setup — Levav ID™ creation with "Other" field
 *   Step 3: Levav 28™ Daily Crucible — 4-phase socratic challenge
 *
 * Visual System:
 *   - Absolute midnight black (#000000) canvas
 *   - Neon laser lime (#C6FF34) active triggers
 *   - Cyber violet (#7E3BED) depth glow
 *   - Frosted glass architecture (bg-[#070a13]/40 backdrop-blur-xl)
 *   - Framer Motion liquid transitions between steps
 *
 * All form inputs: onPaste blocked via e.preventDefault()
 * ============================================================
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LevavCodeModal } from "@/components/onboarding/LevavCodeModal";
import { ProfileSetup } from "@/components/onboarding/ProfileSetup";
import { Levav28Crucible } from "@/components/onboarding/Levav28Crucible";
import { WriRingCard } from "@/components/ui/GlassCard";
import {
  Lock,
  UserCircle,
  Flame,
  CheckCircle2,
  ArrowRight,
  Shield,
  Brain,
  Handshake,
  MessageCircle,
  Lightbulb,
  Users,
  Sparkles,
} from "lucide-react";

type OnboardingStep = "code" | "profile" | "crucible" | "complete";

const wriComponents = [
  { label: "Culture", score: 0, icon: <Shield className="w-3.5 h-3.5" />, color: "#C6FF34" },
  { label: "Critical Thinking", score: 0, icon: <Brain className="w-3.5 h-3.5" />, color: "#7E3BED" },
  { label: "Reliability", score: 0, icon: <Handshake className="w-3.5 h-3.5" />, color: "#C6FF34" },
  { label: "Communication", score: 0, icon: <MessageCircle className="w-3.5 h-3.5" />, color: "#FFFFFF" },
  { label: "Learning", score: 0, icon: <Lightbulb className="w-3.5 h-3.5" />, color: "#7E3BED" },
  { label: "Leadership", score: 0, icon: <Users className="w-3.5 h-3.5" />, color: "#FFFFFF" },
  { label: "Impact", score: 0, icon: <Sparkles className="w-3.5 h-3.5" />, color: "#C6FF34" },
];

export default function TalentOnboarding() {
  const [step, setStep] = useState<OnboardingStep>("code");
  const handleCodeAccepted = () => {
    setStep("profile");
  };

  const handleProfileComplete = () => {
    setStep("crucible");
  };



  /* ─── STEP INDICATOR ─── */
  const steps = [
    { key: "code" as OnboardingStep, label: "The Code", icon: <Lock className="w-4 h-4" /> },
    { key: "profile" as OnboardingStep, label: "Profile", icon: <UserCircle className="w-4 h-4" /> },
    { key: "crucible" as OnboardingStep, label: "Crucible", icon: <Flame className="w-4 h-4" /> },
  ];

  const getStepIndex = (s: OnboardingStep) => {
    if (s === "complete") return 3;
    return steps.findIndex((st) => st.key === s);
  };

  const currentIndex = getStepIndex(step);

  return (
    <div className="min-h-screen bg-black">
      {/* ─── STEP 1: THE LEVAV CODE™ MODAL (Full-Screen Overlay) ─── */}
      <AnimatePresence>
        {step === "code" && <LevavCodeModal onAccepted={handleCodeAccepted} />}
      </AnimatePresence>

      {/* ─── STEPS 2-4: Main Pipeline ─── */}
      {step !== "code" && (
        <div className="levav-container max-w-3xl mx-auto py-6 sm:py-8">
          {/* Pipeline Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-caption mb-1">Talent Onboarding Pipeline</p>
            <h1 className="text-hero text-2xl sm:text-3xl">Levav ID™ Activation</h1>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-8"
          >
            {steps.map((s, i) => {
              const isActive = i === currentIndex;
              const isDone = i < currentIndex;
              return (
                <div key={s.key} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
                      isActive
                        ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/30"
                        : isDone
                          ? "bg-[#C6FF34]/5 text-[#C6FF34]/70 border border-[#C6FF34]/10"
                          : "bg-white/[0.02] text-white/30 border border-white/5"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      s.icon
                    )}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className={`w-3 h-3 flex-shrink-0 ${
                      isDone ? "text-[#C6FF34]/50" : "text-white/10"
                    }`} />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* ─── STEP 2: PROFILE SETUP ─── */}
          <AnimatePresence mode="wait">
            {step === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <ProfileSetup onComplete={handleProfileComplete} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── STEP 3: LEVAV 28™ CRUCIBLE ─── */}
          <AnimatePresence mode="wait">
            {step === "crucible" && (
              <motion.div
                key="crucible"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <Levav28Crucible />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── STEP 4: COMPLETION ─── */}
          <AnimatePresence>
            {step === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md mx-auto"
              >
                {/* Success Header */}
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-flex p-4 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#C6FF34]" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Levav ID™ Activated
                  </h2>
                  <p className="text-sm text-white/50">
                    Your workforce identity is now live in Africa&apos;s Workforce Intelligence Ecosystem™
                  </p>
                </div>

                {/* WRI Ring */}
                <div className="mb-6">
                  <WriRingCard score={0.0} tier={undefined} delay={0.2} />
                </div>

                {/* Component Scores (all at 0) */}
                <div className="space-y-2 mb-6">
                  {wriComponents.map((comp, i) => (
                    <motion.div
                      key={comp.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div style={{ color: comp.color }} className="opacity-60">
                        {comp.icon}
                      </div>
                      <span className="text-xs text-white/50 w-28 flex-shrink-0">
                        {comp.label}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-0 rounded-full" style={{ background: comp.color }} />
                      </div>
                      <span className="text-xs text-white/30 w-6 text-right">0</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep("crucible")}
                  className="btn-lime w-full"
                >
                  Begin Levav 28™ Daily Challenge
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
