/**
 * ============================================================
 * WRI™ HISTORY TIMELINE (/wri-history)
 * ============================================================
 * Visual timeline of WRI™ score progression with component
 * breakdown, source events, and milestone markers.
 * Uses demo data for offline development mode.
 * ============================================================
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { demoWriHistory, demoWriTrends } from "@/lib/demo-data";
import {
  TrendingUp, Clock, Target, Zap, BookOpen, Heart, Shield,
  Star, Award,
} from "lucide-react";

const COMPONENT_COLORS: Record<string, string> = {
  culture: "#C6FF34",
  critical_thinking: "#7E3BED",
  reliability: "#C6FF34",
  communication: "#FFFFFF",
  learning: "#7E3BED",
  leadership: "#FFFFFF",
  impact: "#C6FF34",
};

const COMPONENT_LABELS: Record<string, string> = {
  culture: "Culture Score™",
  critical_thinking: "Critical Thinking Score™",
  reliability: "Reliability Score™",
  communication: "Communication Score™",
  learning: "Learning Score™",
  leadership: "Leadership Score™",
  impact: "Impact Score™",
};

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  levav_28_session: <Target className="w-3 h-3" />,
  volunteer_validation: <Heart className="w-3 h-3" />,
  course_completion: <BookOpen className="w-3 h-3" />,
  quickwork_shift: <Zap className="w-3 h-3" />,
  employer_review: <Star className="w-3 h-3" />,
  skill_verification: <Shield className="w-3 h-3" />,
  admin_override: <Award className="w-3 h-3" />,
  manual_update: <Clock className="w-3 h-3" />,
};

const SOURCE_LABELS: Record<string, string> = {
  levav_28_session: "Levav 28",
  volunteer_validation: "Impact",
  course_completion: "Course",
  quickwork_shift: "QuickWork",
  employer_review: "Review",
  skill_verification: "Skill",
  admin_override: "Admin",
  manual_update: "Manual",
};

/* Simple sparkline SVG */
function Sparkline({ data, color, height = 40 }: { data: number[]; color: string; height?: number }) {
  if (data.length < 2) return <div className="h-[40px] bg-white/5 rounded" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-[40px]" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

export default function WriHistoryPage() {
  /* Use demo data */
  const history = demoWriHistory;
  const trends = demoWriTrends;

  /* Compute milestones */
  const milestones = useMemo(() => {
    const ms: Array<{ label: string; date: string; type: string }> = [];
    if (!history || history.length === 0) return ms;

    const seen = new Set<string>();
    const sorted = [...history].sort((a, b) =>
      new Date(a.recordedAt ?? 0).getTime() - new Date(b.recordedAt ?? 0).getTime()
    );
    sorted.forEach((h) => {
      const key = h.componentType;
      if (!seen.has(key)) {
        seen.add(key);
        ms.push({
          label: `${COMPONENT_LABELS[key]} tracked`,
          date: h.recordedAt ? new Date(h.recordedAt).toLocaleDateString() : "",
          type: "first",
        });
      }
    });
    return ms.slice(0, 7);
  }, [history]);

  /* Group by date for timeline */
  const timelineEntries = useMemo(() => {
    if (!history) return [];
    const grouped: Record<string, typeof history> = {};
    history.forEach((h) => {
      const date = h.recordedAt ? new Date(h.recordedAt).toLocaleDateString() : "Unknown";
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(h);
    });
    return Object.entries(grouped).slice(0, 30);
  }, [history]);

  /* Sparkline data per component */
  const sparklines = useMemo(() => {
    if (!trends) return {} as Record<string, number[]>;
    const result: Record<string, number[]> = {};
    Object.entries(trends).forEach(([key, scores]) => {
      result[key] = (scores as Array<{ score: string }>).map((s) => parseFloat(s.score));
    });
    return result;
  }, [trends]);

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-lime">Analytics</span>
            <span className="text-xs text-white/30">{history?.length ?? 0} events</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">WRI™ History</h1>
          <p className="text-body mt-1">Track your Workforce Readiness Index™ progression over time</p>
        </motion.div>

        {/* Component Sparklines */}
        <GlassCard variant="strong" delay={0.1} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#C6FF34]" />
            <h2 className="text-section text-base">Component Trends</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(sparklines).map(([key, data], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/60">{COMPONENT_LABELS[key]}</span>
                  <span className="text-xs font-medium tabular-nums" style={{ color: COMPONENT_COLORS[key] }}>
                    {data.length > 0 ? data[data.length - 1].toFixed(1) : "0.0"}
                  </span>
                </div>
                <Sparkline data={data} color={COMPONENT_COLORS[key]} />
              </motion.div>
            ))}
            {Object.keys(sparklines).length === 0 && (
              <p className="text-sm text-white/30 col-span-full text-center py-4">Complete your first Levav 28™ crucible to start tracking.</p>
            )}
          </div>
        </GlassCard>

        {/* Milestones */}
        {milestones.length > 0 && (
          <GlassCard variant="strong" delay={0.2} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#C6FF34]" />
              <h2 className="text-section text-base">Milestones</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#C6FF34]/5 border border-[#C6FF34]/10"
                >
                  <Award className="w-3 h-3 text-[#C6FF34]" />
                  <span className="text-xs text-white/70">{m.label}</span>
                  <span className="text-[10px] text-white/30">{m.date}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Timeline */}
        <GlassCard variant="strong" delay={0.3}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#7E3BED]" />
            <h2 className="text-section text-base">Score Change Timeline</h2>
          </div>
          {timelineEntries.length > 0 ? (
            <div className="space-y-4">
              {timelineEntries.map(([date, entries], dateIdx) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#C6FF34]" />
                    <span className="text-xs font-medium text-white/50">{date}</span>
                  </div>
                  <div className="ml-1 pl-3 border-l border-white/5 space-y-2">
                    {entries.map((entry, i) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: dateIdx * 0.03 + i * 0.02 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02]"
                      >
                        <div className="p-1.5 rounded-md bg-white/5 text-white/40">
                          {SOURCE_ICONS[entry.sourceEvent] ?? <Clock className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/80">{COMPONENT_LABELS[entry.componentType]}</span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: `${COMPONENT_COLORS[entry.componentType]}15`,
                                color: COMPONENT_COLORS[entry.componentType],
                              }}
                            >
                              +{parseFloat(entry.score).toFixed(1)}
                            </span>
                          </div>
                          {entry.sourceDescription && (
                            <p className="text-[10px] text-white/30 mt-0.5">{entry.sourceDescription}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-white/20">
                            {SOURCE_LABELS[entry.sourceEvent] ?? entry.sourceEvent}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-sm text-white/30">No history yet.</p>
              <p className="text-xs text-white/20 mt-1">Complete activities to start tracking your WRI™ progression.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
