/**
 * ============================================================
 * AI CAREER ADVISOR ROUTER
 * ============================================================
 * Personalized career guidance using the talent's WRI data.
 * Pattern-matching advice without requiring OpenAI API key.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { findWriByProfile } from "../queries/wri";

export const advisorRouter = createRouter({
  advise: authedQuery
    .input(z.object({ question: z.string().min(1).max(500) }))
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        const wriRow = profile ? await findWriByProfile(profile.id) : null;

        const wriScore = wriRow ? parseFloat(wriRow.wriScore) : 0;
        const tier = wriRow?.goldKeyTier ?? "bronze";
        const q = input.question.toLowerCase();

        if (q.includes("focus") || q.includes("improve") || q.includes("better")) {
          return genImprovement(wriScore, tier, wriRow);
        }
        if (q.includes("job") || q.includes("career") || q.includes("work")) {
          return genCareer(wriScore, tier, profile);
        }
        if (q.includes("wri") || q.includes("score")) {
          return genWri(wriScore, tier, wriRow);
        }
        if (q.includes("skill") || q.includes("learn")) {
          return genSkills(wriScore, profile);
        }
        return genOverview(wriScore, tier, wriRow, profile);
      }, "INTERNAL_ERROR");
    }),
});

/* ─── Advice Generators ─── */

function genImprovement(wriScore: number, tier: string, wri: Record<string, unknown> | null | undefined) {
  const components = wri ? [
    { name: "Culture", score: parseFloat(wri.cultureScore as string), weight: 15 },
    { name: "Critical Thinking", score: parseFloat(wri.criticalThinkingScore as string), weight: 15 },
    { name: "Reliability", score: parseFloat(wri.reliabilityScore as string), weight: 15 },
    { name: "Communication", score: parseFloat(wri.communicationScore as string), weight: 15 },
    { name: "Learning", score: parseFloat(wri.learningScore as string), weight: 15 },
    { name: "Leadership", score: parseFloat(wri.leadershipScore as string), weight: 12 },
    { name: "Impact", score: parseFloat(wri.impactScore as string), weight: 13 },
  ] : [];
  const weakest = components.length > 0 ? components.sort((a, b) => a.score - b.score)[0] : null;

  let advice: string;
  if (wriScore < 40) {
    advice = "Your WRI is in the Bronze range. Focus on completing the Levav 28 crucible daily. Consistency is the fastest way to build your score. Each day you complete all 4 phases (CONFRONT, DISSECT, OWN, EXECUTE), your Reliability and Critical Thinking scores improve.";
  } else if (wriScore < 60) {
    advice = `Your weakest area is ${weakest?.name} (score: ${weakest?.score}/100). Since it carries ${weakest?.weight}% weight in your WRI, improving this component will have the biggest impact. Pick up QuickWork shifts to boost practical skills, or volunteer for Impact opportunities.`;
  } else if (wriScore < 75) {
    advice = `You are in the ${tier} tier — solid performance. To reach Gold or Platinum, focus on deepening your ${weakest?.name} score. Consider enrolling in Levav Learn courses targeted at this area. Also aim for higher ratings on QuickWork shifts.`;
  } else {
    advice = `You are in the top tier. To maintain your ${tier} status, continue daily Levav 28 practice and seek leadership opportunities through Impact volunteering. Your expertise could make you a Levav Champion mentor.`;
  }

  return { type: "improvement", wriScore, tier, weakestComponent: weakest?.name ?? null, advice,
    actions: ["Complete today's Levav 28 crucible", weakest?.name === "Impact" ? "Log volunteer hours" : "Pick up a QuickWork shift", "Browse Levav Learn courses", "Review your full WRI breakdown"],
  };
}

function genCareer(wriScore: number, tier: string, profile: Record<string, unknown> | null | undefined) {
  const profession = profile?.customProfessionText ?? "your field";
  let advice: string;
  if (wriScore < 40) {
    advice = `At your current WRI level, focus on entry-level QuickWork shifts in ${profession} to build practical experience. Each completed shift with a good rating raises your score.`;
  } else if (wriScore < 60) {
    advice = `With your current ${tier} tier, you qualify for mid-level QuickWork shifts and can apply to jobs requiring a minimum WRI of ${Math.floor(wriScore)}. Highlight your Levav ID in applications.`;
  } else if (wriScore < 75) {
    advice = `Your ${tier} tier makes you competitive for professional roles. Your Levav ID portfolio is visible to employers. Ensure your skills inventory is complete and up-to-date.`;
  } else {
    advice = `As a ${tier} tier talent, you are among the top candidates. Platinum and Diamond talent are featured on the WRI Leaderboard and receive priority matching from employers.`;
  }
  return { type: "career", wriScore, tier, advice,
    actions: wriScore < 40
      ? ["Browse QuickWork shifts", "Find Impact opportunities", "Start Levav 28 crucible"]
      : wriScore < 75
      ? ["Browse Job Board", "Update skills inventory", "Browse Levav Learn courses"]
      : ["Browse Job Board", "Explore Creator Studio", "View WRI Leaderboard"],
  };
}

function genWri(wriScore: number, tier: string, wri: Record<string, unknown> | null | undefined) {
  return { type: "wri", wriScore, tier,
    components: wri ? {
      culture: parseFloat(wri.cultureScore as string),
      criticalThinking: parseFloat(wri.criticalThinkingScore as string),
      reliability: parseFloat(wri.reliabilityScore as string),
      communication: parseFloat(wri.communicationScore as string),
      learning: parseFloat(wri.learningScore as string),
      leadership: parseFloat(wri.leadershipScore as string),
      impact: parseFloat(wri.impactScore as string),
    } : null,
    advice: `Your current WRI score is ${wriScore.toFixed(1)}, placing you in the ${tier} tier. The WRI is calculated from 7 weighted components: Culture (15%), Critical Thinking (15%), Reliability (15%), Communication (15%), Learning (15%), Leadership (12%), and Impact (13%).`,
    actions: ["View full WRI breakdown", "Complete Levav 28 today", "Check Leaderboard"],
  };
}

function genSkills(wriScore: number, profile: Record<string, unknown> | null | undefined) {
  const prof = profile?.customProfessionText ?? "not set";
  return { type: "skills", wriScore, tier: "",
    advice: `Building your skills inventory strengthens your Levav ID and improves your Learning component score. Your current profession is listed as ${prof}.`,
    actions: ["Add new skills", "Browse Levav Learn courses", "Find verified QuickWork shifts"],
  };
}

function genOverview(wriScore: number, tier: string, _wri: Record<string, unknown> | null | undefined, _profile: Record<string, unknown> | null | undefined) {
  return { type: "overview", wriScore, tier,
    advice: `Welcome to your AI Career Advisor. Your current WRI score is ${wriScore.toFixed(1)} (${tier} tier). Ask me about: improving your score, career paths, skill development, or WRI breakdown analysis.`,
    actions: ["How can I improve my WRI?", "What careers match my profile?", "What skills should I learn?"],
  };
}
