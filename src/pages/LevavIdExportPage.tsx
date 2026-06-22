/**
 * ============================================================
 * LEVAV ID™ PDF EXPORT (/export)
 * ============================================================
 * One-click export of the full Levav ID™ portfolio as a
 * beautifully formatted PDF. Uses jspdf + html2canvas for
 * high-quality rendering. Talent can share with any employer.
 * ============================================================
 */

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { trpc } from "@/providers/trpc";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Download, FileText, Shield, Award, Star,
  TrendingUp, CheckCircle2, Loader2,
} from "lucide-react";

const WRI_LABELS: Record<string, string> = {
  culture: "Culture", critical_thinking: "Critical Thinking",
  reliability: "Reliability", communication: "Communication",
  learning: "Learning", leadership: "Leadership", impact: "Impact",
};

const WRI_COLORS: Record<string, string> = {
  culture: "#C6FF34", critical_thinking: "#7E3BED", reliability: "#C6FF34",
  communication: "#7E3BED", learning: "#C6FF34", leadership: "#7E3BED", impact: "#C6FF34",
};

export default function LevavIdExportPage() {
  const { isDemoMode } = useDemoAuth();
  const { isAuthenticated } = useAuth();
  const [generating, setGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { data: profile, isLoading: profileLoading } = trpc.profile.me.useQuery(
    undefined, { enabled: isAuthenticated },
  );
  const { data: wriData } = trpc.wri.me.useQuery(
    undefined, { enabled: isAuthenticated },
  );
  const { data: skillsData } = trpc.profile.skills.useQuery(
    undefined, { enabled: isAuthenticated },
  );
  const { data: badgesData } = trpc.badge.myBadges.useQuery(
    undefined, { enabled: isAuthenticated },
  );

  const handleExport = useCallback(async () => {
    if (!pdfRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: "#000000",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Levav-ID-${profile?.firstName ?? "Talent"}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (e) {
      if (import.meta.env.DEV) console.error("PDF export failed:", e);
    } finally {
      setGenerating(false);
    }
  }, [profile?.firstName]);

  /* Auth gate */
  if (!isAuthenticated && !isDemoMode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <FileText className="w-8 h-8 text-[#C6FF34] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Levav ID™ Export</h1>
          <p className="text-sm text-white/50 mb-4">Sign in to export your portfolio as PDF.</p>
          <a href="#/login" className="btn-lime inline-flex items-center gap-2">Sign In</a>
        </div>
      </div>
    );
  }

  const wriScore = wriData ? parseFloat(wriData.wriScore) : 0;
  const tier = (wriData?.goldKeyTier ?? "bronze") as string;
  const skills = skillsData ?? [];
  const badges = badgesData ?? [];
  const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Talent";

  const wriComponents = wriData ? [
    { key: "culture", score: parseFloat(wriData.cultureScore) },
    { key: "critical_thinking", score: parseFloat(wriData.criticalThinkingScore) },
    { key: "reliability", score: parseFloat(wriData.reliabilityScore) },
    { key: "communication", score: parseFloat(wriData.communicationScore) },
    { key: "learning", score: parseFloat(wriData.learningScore) },
    { key: "leadership", score: parseFloat(wriData.leadershipScore) },
    { key: "impact", score: parseFloat(wriData.impactScore) },
  ] : [];

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-3xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-lime">PDF Export</span>
              </div>
              <h1 className="text-hero text-2xl sm:text-3xl">Levav ID™ Export</h1>
              <p className="text-body mt-1">Share your verified portfolio with any employer</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={generating || profileLoading}
              className="btn-lime flex items-center gap-2 disabled:opacity-30"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {generating ? "Generating..." : "Export PDF"}
            </motion.button>
          </div>
        </motion.div>

        {/* Preview */}
        <GlassCard variant="glow" delay={0.1}>
          <p className="text-xs text-white/30 mb-4">Preview — this is how your PDF will look</p>

          {/* ─── PDF CONTENT (captured by html2canvas) ─── */}
          <div
            ref={pdfRef}
            className="bg-black border border-white/10 rounded-xl p-8 space-y-6"
            style={{ width: "210mm", maxWidth: "100%", margin: "0 auto" }}
          >
            {/* Header */}
            <div className="text-center pb-6 border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-4">
                <Shield className="w-4 h-4 text-[#C6FF34]" />
                <span className="text-sm font-bold text-[#C6FF34] tracking-wider">LEVAV ID™</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{displayName}</h1>
              <p className="text-sm text-white/50">
                {profile?.headline ?? profile?.customProfessionText ?? "Professional"}
              </p>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/30">
                {profile?.city && <span>{profile.city}, Zambia</span>}
                {profile?.phone && <span>{profile.phone}</span>}
              </div>
            </div>

            {/* WRI Score */}
            <div className="flex items-center gap-6 py-4 border-b border-white/5">
              <div className="text-center">
                <p className="text-5xl font-bold text-[#C6FF34] tabular-nums">{wriScore.toFixed(1)}</p>
                <p className="text-xs text-white/40 mt-1">WRI™</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-bold uppercase tier-${tier}`}>{tier} Key</span>
                  <span className="text-xs text-white/30">— Africa&apos;s Workforce Intelligence Ecosystem™</span>
                </div>
                <p className="text-xs text-white/40">
                  Verified by the Levav 28™ crucible, QuickWork™ ratings, and Impact validation.
                </p>
              </div>
            </div>

            {/* Component Breakdown */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C6FF34]" />
                WRI™ Component Breakdown
              </h2>
              <div className="space-y-3">
                {wriComponents.map((comp) => (
                  <div key={comp.key} className="flex items-center gap-3">
                    <span className="text-xs text-white/50 w-28 flex-shrink-0">{WRI_LABELS[comp.key]}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(comp.score, 100)}%`,
                          backgroundColor: WRI_COLORS[comp.key],
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white/60 w-8 text-right tabular-nums">
                      {Math.round(comp.score)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#C6FF34]" />
                  Skills ({skills.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/10"
                    >
                      {skill.skillName}
                      <span className="text-white/30 ml-1">{skill.proficiencyLevel}</span>
                      {skill.verifiedBy && (
                        <CheckCircle2 className="w-3 h-3 text-[#C6FF34] inline ml-1" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C6FF34]" />
                  Achievements ({badges.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {badges.slice(0, 8).map((badge) => (
                    <span
                      key={badge.id}
                      className="text-xs px-3 py-1.5 rounded-full bg-[#C6FF34]/5 text-[#C6FF34]/80 border border-[#C6FF34]/10"
                    >
                      {badge.badgeName}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-6 border-t border-white/5 text-center">
              <p className="text-[10px] text-white/20">
                Generated by Levav Talent Afrika™ — Africa&apos;s Workforce Intelligence Ecosystem
              </p>
              <p className="text-[10px] text-white/20">
                Verified on {new Date().toLocaleDateString()} — levav.africa
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
