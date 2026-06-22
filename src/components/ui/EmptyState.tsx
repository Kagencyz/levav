/**
 * ============================================================
 * EMPTY STATE — Consistent Empty/No-Data Display
 * ============================================================
 * Shows when a page has no data to display.
 * Provides helpful context and call-to-action.
 * ============================================================
 */

import { motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <GlassCard className="p-8 sm:p-12 text-center" glow={false}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-8 h-8 text-white/20" />
        </div>
        <h3 className="text-base font-semibold text-white/80 mb-2">{title}</h3>
        <p className="text-sm text-white/40 max-w-xs mx-auto mb-5">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="px-5 py-2.5 rounded-xl bg-[#C6FF34] text-black text-sm font-medium hover:shadow-lime transition-all"
          >
            {action.label}
          </button>
        )}
      </motion.div>
    </GlassCard>
  );
}
