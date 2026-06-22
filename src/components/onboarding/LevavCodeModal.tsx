/**
 * ============================================================
 * THE LEVAV CODE™ MODAL — Full-Screen Covenant Overlay
 * ============================================================
 * Unskippable full-screen modal presenting all 8 pillars of
 * The Levav Code™. User must explicitly check each pillar
 * and sign their name before proceeding.
 *
 * Visual: Absolute midnight black canvas with neon laser lime
 * checkmarks and frosted glass pillar cards.
 * ============================================================
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock, ArrowRight, Sparkles } from "lucide-react";

interface LevavCodeModalProps {
  onAccepted: () => void;
}

const PILLARS = [
  {
    key: "ownership",
    title: "Ownership",
    description: "I take full responsibility for my actions, decisions, and their outcomes. I do not deflect blame.",
  },
  {
    key: "excellence",
    title: "Excellence",
    description: "I commit to delivering work of the highest standard. Good enough is never enough.",
  },
  {
    key: "reliability",
    title: "Reliability",
    description: "I honor my commitments. If I say I will do something, I do it — on time, every time.",
  },
  {
    key: "initiative",
    title: "Initiative",
    description: "I identify problems before I am told about them and propose solutions before being asked.",
  },
  {
    key: "growth",
    title: "Growth",
    description: "I embrace continuous learning. Every day is an opportunity to become more capable.",
  },
  {
    key: "criticalThinking",
    title: "Critical Thinking",
    description: "I question assumptions, analyze root causes, and make decisions based on evidence, not emotion.",
  },
  {
    key: "service",
    title: "Service",
    description: "I exist to create value for others. My work serves a purpose greater than myself.",
  },
  {
    key: "impact",
    title: "Impact",
    description: "I measure success by the tangible difference I make in my community and beyond.",
  },
];

export function LevavCodeModal({ onAccepted }: LevavCodeModalProps) {
  const [acceptedPillars, setAcceptedPillars] = useState<Record<string, boolean>>({});
  const [signature, setSignature] = useState("");
  const [showSignature, setShowSignature] = useState(false);

  const allAccepted = PILLARS.every((p) => acceptedPillars[p.key]);

  const togglePillar = (key: string) => {
    setAcceptedPillars((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProceedToSignature = () => {
    if (allAccepted) setShowSignature(true);
  };

  const handleFinalAccept = () => {
    if (signature.trim().length >= 2) onAccepted();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      >
        {/* Animated violet glow background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(126,59,237,0.4) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(198,255,52,0.15) 0%, transparent 70%)" }}
          />
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-4">
                <Lock className="w-6 h-6 text-[#C6FF34]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                The Levav Code™
              </h1>
              <p className="text-sm text-white/50">
                A covenant of professional excellence. All 8 pillars must be accepted to proceed.
              </p>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/40 uppercase tracking-wider">
                  Covenant Progress
                </span>
                <span className="text-[10px] text-[#C6FF34] font-medium">
                  {Object.values(acceptedPillars).filter(Boolean).length} / {PILLARS.length}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#C6FF34]"
                  animate={{ width: `${(Object.values(acceptedPillars).filter(Boolean).length / PILLARS.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Pillar Cards */}
            <div className="space-y-3 mb-8">
              {PILLARS.map((pillar, i) => {
                const isAccepted = !!acceptedPillars[pillar.key];
                return (
                  <motion.button
                    key={pillar.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    onClick={() => togglePillar(pillar.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                      isAccepted
                        ? "bg-[#C6FF34]/5 border-[#C6FF34]/30 shadow-[0_0_20px_rgba(198,255,52,0.1)]"
                        : "bg-[#070a13]/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                          isAccepted
                            ? "bg-[#C6FF34] border-[#C6FF34]"
                            : "border-white/20"
                        }`}
                      >
                        {isAccepted && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3
                          className={`text-sm font-semibold transition-colors ${
                            isAccepted ? "text-[#C6FF34]" : "text-white/80"
                          }`}
                        >
                          {pillar.title}
                        </h3>
                        <p className="text-xs text-white/40 mt-1 leading-relaxed">
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Signature Section */}
            <AnimatePresence>
              {allAccepted && !showSignature && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToSignature}
                    className="btn-lime w-full flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Proceed to Signature
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Signature Input */}
            <AnimatePresence>
              {showSignature && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-8"
                >
                  <div className="glass-card-strong p-5">
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Digital Signature
                    </h3>
                    <p className="text-xs text-white/40 mb-4">
                      Type your full name to digitally sign The Levav Code™ covenant.
                    </p>
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Your full name"
                      className="glass-input w-full mb-4"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFinalAccept}
                      disabled={signature.trim().length < 2}
                      className="btn-lime w-full flex items-center justify-center gap-2 disabled:opacity-30"
                    >
                      <Lock className="w-4 h-4" />
                      I Accept The Levav Code™
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer seal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-[10px] text-white/20 pb-4"
            >
              Africa&apos;s Workforce Intelligence Ecosystem™ — Levav™
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
