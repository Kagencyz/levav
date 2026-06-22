/**
 * ============================================================
 * LEADERBOARD — Gamification & Recognition
 * ============================================================
 * Rankings by WRI score, Levav 28 progress, skill badges,
 * and community contributions. Drives engagement.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Crown, Medal, Star, Flame, TrendingUp, Users,
  Award, Zap, Target, ChevronRight,
} from "lucide-react";

const TABS = ["WRI Score", "Levav 28", "Contributions", "QuickWork"] as const;

const WRI_LEADERS = [
  { rank: 1, name: "David Phiri", profession: "Senior Developer", wri: 94.2, tier: "Diamond", city: "Lusaka", streak: 28, change: "up" },
  { rank: 2, name: "Grace Mulenga", profession: "Product Designer", wri: 91.7, tier: "Diamond", city: "Lusaka", streak: 24, change: "same" },
  { rank: 3, name: "James Kabwe", profession: "Data Scientist", wri: 89.3, tier: "Platinum", city: "Ndola", streak: 21, change: "up" },
  { rank: 4, name: "Natasha Mwamba", profession: "UX Researcher", wri: 87.1, tier: "Platinum", city: "Kitwe", streak: 19, change: "up" },
  { rank: 5, name: "Brian Tembo", profession: "DevOps Engineer", wri: 84.6, tier: "Platinum", city: "Lusaka", streak: 15, change: "down" },
  { rank: 6, name: "Lisa Zulu", profession: "Nurse Manager", wri: 82.3, tier: "Platinum", city: "Livingstone", streak: 12, change: "same" },
  { rank: 7, name: "Michael Banda", profession: "Finance Analyst", wri: 79.8, tier: "Gold", city: "Lusaka", streak: 10, change: "up" },
  { rank: 8, name: "Sarah Chileshe", profession: "Teacher", wri: 76.4, tier: "Gold", city: "Chingola", streak: 8, change: "up" },
  { rank: 9, name: "Patrick Lungu", profession: "Project Manager", wri: 74.1, tier: "Gold", city: "Lusaka", streak: 6, change: "down" },
  { rank: 10, name: "Emma Mutale", profession: "Customer Success", wri: 71.9, tier: "Gold", city: "Kabwe", streak: 5, change: "same" },
];

const TIER_COLORS: Record<string, string> = {
  Diamond: "text-[#C6FF34]",
  Platinum: "text-[#7E3BED]",
  Gold: "text-yellow-400",
  Silver: "text-gray-300",
  Bronze: "text-amber-600",
};

const RANK_ICONS = [
  <Crown key="1" className="w-5 h-5 text-[#C6FF34]" />,
  <Medal key="2" className="w-5 h-5 text-gray-300" />,
  <Award key="3" className="w-5 h-5 text-amber-500" />,
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("WRI Score");

  const myRank = 247;
  const myWri = 67.0;
  const myTier = "Gold";

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-3xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><Crown className="w-3 h-3" /> Leaderboard</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Top Performers</h1>
          <p className="text-body mt-1">Where you rank across Africa's workforce</p>
        </motion.div>

        {/* My Rank Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard variant="strong" className="mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-white">#{myRank}</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-white/40">Your Rank</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{myWri} WRI\u2122</span>
                  <span className={`text-[10px] font-semibold ${TIER_COLORS[myTier]}`}>{myTier}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-[#C6FF34]" style={{ width: `${myWri}%` }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-white/40">Top 5% need</p>
                <p className="text-xs text-[#C6FF34]">+{(90 - myWri).toFixed(1)} pts</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-medium transition-all border-b-2 whitespace-nowrap ${activeTab === t ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Leaders List */}
        <div className="space-y-2">
          {WRI_LEADERS.map((leader, i) => (
            <motion.div key={leader.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${leader.rank <= 3 ? "bg-white/[0.03] border border-white/10" : "bg-white/[0.01] border border-transparent hover:bg-white/[0.02]"}`}>
                {/* Rank */}
                <div className="w-8 flex-shrink-0 flex justify-center">
                  {leader.rank <= 3 ? RANK_ICONS[leader.rank - 1] : <span className="text-xs text-white/30">{leader.rank}</span>}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{leader.name[0]}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white">{leader.name}</span>
                    <span className={`text-[9px] font-semibold ${TIER_COLORS[leader.tier]}`}>{leader.tier}</span>
                  </div>
                  <p className="text-[10px] text-white/40">{leader.profession} · {leader.city}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#C6FF34]">{leader.wri.toFixed(1)}</p>
                    <p className="text-[9px] text-white/30">WRI\u2122</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-white/30">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {leader.streak}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 text-center">
          <p className="text-xs text-white/30">Complete your Levav 28\u2122 crucible daily to climb the rankings</p>
        </motion.div>
      </div>
    </div>
  );
}
