/**
 * ============================================================
 * BUILD PORTFOLIO (/build)
 * ============================================================
 * Talent portfolio builder with WRI™ data, skills,
 * and achievements. Uses demo data for offline development.
 * ============================================================
 */

import { GlassCard, WriRingCard } from "@/components/ui/GlassCard";
import { SkeletonWriRing } from "@/components/ui/Skeletons";
import { demoWri, demoProfile } from "@/lib/demo-data";
import { motion } from "framer-motion";
import {
  Rocket, Star, Award, Shield, CheckCircle2,
  Zap, BookOpen, Heart, Briefcase, TrendingUp,
} from "lucide-react";

export default function BuildPage() {
  /* Use demo data directly */
  const wriData = demoWri;
  const profile = demoProfile;
  const isLoading = false;

  const skills = [
    { name: "React", level: 85, category: "Technical" },
    { name: "TypeScript", level: 80, category: "Technical" },
    { name: "Communication", level: 70, category: "Soft" },
    { name: "Leadership", level: 65, category: "Soft" },
    { name: "Problem Solving", level: 75, category: "Cognitive" },
    { name: "Teamwork", level: 78, category: "Soft" },
  ];

  const achievements = [
    { icon: <Award className="w-4 h-4" />, label: "Gold WRI™", desc: "72.5 — Top 25%" },
    { icon: <BookOpen className="w-4 h-4" />, label: "2 Courses Completed", desc: "React & Customer Excellence" },
    { icon: <Heart className="w-4 h-4" />, label: "20 Impact Hours", desc: "Community mentorship" },
    { icon: <Zap className="w-4 h-4" />, label: "5 QuickWork Shifts", desc: "100% attendance rate" },
  ];

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-lime">Build™</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Your Portfolio</h1>
          <p className="text-body mt-1">Levav ID™ profile and Workforce Readiness Index™</p>
        </motion.div>

        {/* WRI Ring */}
        {isLoading ? (
          <SkeletonWriRing />
        ) : wriData ? (
          <WriRingCard
            score={parseFloat(wriData.overallScore)}
            tier={wriData.goldKeyTier}
            components={{
              culture: wriData.componentCulture,
              criticalThinking: wriData.componentCriticalThinking,
              reliability: wriData.componentReliability,
              communication: wriData.componentCommunication,
              learning: wriData.componentLearning,
              leadership: wriData.componentLeadership,
              impact: wriData.componentImpact,
            }}
          />
        ) : null}

        {/* Profile Info */}
        <GlassCard variant="strong" delay={0.2} className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C6FF34] to-[#7E3BED] flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {profile?.displayName?.charAt(0) ?? "?"}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{profile?.displayName ?? "Talent"}</h2>
              <p className="text-xs text-white/40">{profile?.professionTitle ?? "No profession set"}</p>
              <p className="text-xs text-white/30">{profile?.location ?? ""}</p>
              {profile?.levavCode && (
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-[#C6FF34]/10 text-[#C6FF34]">
                  {profile.levavCode}
                </span>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Skills */}
        <GlassCard variant="strong" delay={0.3} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#C6FF34]" />
            <h2 className="text-section text-base">Skills Inventory</h2>
          </div>
          <div className="space-y-3">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/70">{skill.name}</span>
                  <span className="text-[10px] text-white/40">{skill.level}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#C6FF34] to-[#7E3BED] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Achievements */}
        <GlassCard variant="strong" delay={0.4}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#C6FF34]" />
            <h2 className="text-section text-base">Achievements</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34]">
                  {ach.icon}
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">{ach.label}</p>
                  <p className="text-[10px] text-white/40">{ach.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
