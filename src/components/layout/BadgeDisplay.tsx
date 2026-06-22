/**
 * ============================================================
 * BADGE DISPLAY COMPONENT
 * ============================================================
 * Shows earned achievement badges on the talent dashboard.
 * Fetches from the badge router and renders as a badge grid.
 * ============================================================
 */

import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { Award, Lock, Loader2 } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  bronze: "from-amber-700 to-amber-900",
  silver: "from-gray-400 to-gray-600",
  gold: "from-yellow-400 to-yellow-600",
  platinum: "from-[#C6FF34] to-[#7E3BED]",
};

const TIER_GLOWS: Record<string, string> = {
  bronze: "shadow-amber-900/20",
  silver: "shadow-gray-500/20",
  gold: "shadow-yellow-500/20",
  platinum: "shadow-[#C6FF34]/30",
};

export function BadgeDisplay() {
  const { data: myBadges, isLoading } = trpc.badge.myBadges.useQuery();
  const { data: eligibility } = trpc.badge.checkEligibility.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
      </div>
    );
  }

  const earned = myBadges ?? [];
  const eligible = eligibility?.eligible ?? [];

  return (
    <div>
      {/* Earned Badges */}
      {earned.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {earned.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${TIER_COLORS[badge.badgeTier] ?? TIER_COLORS.bronze} flex items-center justify-center shadow-lg ${TIER_GLOWS[badge.badgeTier] ?? ""} border border-white/10`}>
                <Award className="w-4 h-4 text-white" />
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#070a13] border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="text-xs font-medium text-white">{badge.badgeName}</p>
                <p className="text-[10px] text-white/40">{badge.badgeDescription}</p>
                <p className="text-[10px] text-[#C6FF34] mt-0.5">+{badge.badgePoints} pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/30 mb-3">No badges earned yet. Complete milestones to unlock badges.</p>
      )}

      {/* Eligible badges */}
      {eligible.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-[#C6FF34]">Claimable:</span>
          {eligible.map((badge) => (
            <div key={badge.id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#C6FF34]/5 border border-[#C6FF34]/10">
              <Lock className="w-3 h-3 text-[#C6FF34]" />
              <span className="text-[10px] text-white/50">{badge.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
