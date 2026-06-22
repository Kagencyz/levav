/**
 * ============================================================
 * GLASS CARD — Frosted Liquid-Glass Architecture
 * ============================================================
 * Floating translucent glass sheet component.
 * Uses: bg-[#070a13]/40 backdrop-blur-xl border border-white/5 shadow-2xl
 * Variants: default, strong, interactive, glow
 * ============================================================
 */

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "interactive" | "glow";
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
}

const variants = {
  default: "bg-[#070a13]/40 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50",
  strong: "bg-[#070a13]/60 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60",
  interactive: "bg-[#070a13]/40 backdrop-blur-xl border border-white/5 shadow-2xl shadow-black/50 cursor-pointer transition-all duration-300 hover:border-[#C6FF34]/30 hover:shadow-lime/20",
  glow: "bg-[#070a13]/40 backdrop-blur-xl border border-[#7E3BED]/20 shadow-2xl shadow-[#7E3BED]/10 animate-glow-pulse",
};

export function GlassCard({
  children,
  className,
  variant = "default",
  animate = true,
  delay = 0,
  onClick,
}: GlassCardProps) {
  const baseClasses = cn(
    "rounded-xl p-4 sm:p-6 relative overflow-hidden",
    variants[variant],
    className,
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className={baseClasses}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
}

/** Compact stat card for dashboard grids */
export function StatCard({
  label,
  value,
  suffix,
  icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  icon: ReactNode;
  delay?: number;
}) {
  return (
    <GlassCard variant="strong" delay={delay}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-caption">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
            {value}
            {suffix && <span className="text-sm font-normal text-white/50 ml-1">{suffix}</span>}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34]">
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}

/** WRI Score Ring Card */
export function WriRingCard({
  score,
  tier,
  delay = 0,
}: {
  score: string | number;
  tier?: string;
  delay?: number;
}) {
  const numericScore = typeof score === "string" ? parseFloat(score) : score;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (numericScore / 100) * circumference;

  const tierClass = tier
    ? `tier-${tier.toLowerCase()}`
    : numericScore >= 90
      ? "tier-diamond"
      : numericScore >= 75
        ? "tier-platinum"
        : numericScore >= 60
          ? "tier-gold"
          : numericScore >= 40
            ? "tier-silver"
            : "tier-bronze";

  return (
    <GlassCard variant="strong" delay={delay} className="flex flex-col items-center py-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          {/* Score ring */}
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#C6FF34"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: delay + 0.3 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(198,255,52,0.4))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{numericScore.toFixed(1)}</span>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">WRI</span>
        </div>
      </div>
      {tier && (
        <div className="mt-3 text-center">
          <span className={`text-sm font-semibold uppercase tracking-widest ${tierClass}`}>
            {tier}
          </span>
        </div>
      )}
    </GlassCard>
  );
}
