/**
 * ============================================================
 * WRI RECALCULATION ENGINE
 * ============================================================
 * Automated Workforce Readiness Index calculation service.
 *
 * The WRI formula: weighted average of 7 component scores.
 * Default weights (configurable per version):
 *   - Culture:          15% (0.15)
 *   - Critical Thinking: 15% (0.15)
 *   - Reliability:      15% (0.15)
 *   - Communication:    15% (0.15)
 *   - Learning:         15% (0.15)
 *   - Leadership:       12% (0.12)
 *   - Impact:           13% (0.13)
 *
 * Gold Key Tiers:
 *   Bronze:    0.00 - 39.99
 *   Silver:   40.00 - 59.99
 *   Gold:     60.00 - 74.99
 *   Platinum: 75.00 - 89.99
 *   Diamond:  90.00 - 100.00
 *
 * Triggered by: volunteer validation, Levav 28 completion,
 *               course completion, QuickWork shift ratings,
 *               employer reviews, skill verifications.
 * ============================================================
 */

import * as schema from "@db/schema";
import { getDb } from "../queries/connection";
import {
  findWriByProfile,
  updateWriScore,
  updateWriGoldKey,
  addComponentScore,
  initializeWriForProfile,
} from "../queries/wri";
import { getTotalVolunteerHours } from "../queries/impact";
import { eq, and, sql } from "drizzle-orm";

const db = getDb;

/* ─── WEIGHT CONFIGURATION ─── */

const DEFAULT_WEIGHTS: Record<string, number> = {
  culture: 0.15,
  critical_thinking: 0.15,
  reliability: 0.15,
  communication: 0.15,
  learning: 0.15,
  leadership: 0.12,
  impact: 0.13,
};

function getTierFromScore(score: number): "bronze" | "silver" | "gold" | "platinum" | "diamond" {
  if (score >= 90) return "diamond";
  if (score >= 75) return "platinum";
  if (score >= 60) return "gold";
  if (score >= 40) return "silver";
  return "bronze";
}

function formatScore(value: number): string {
  return value.toFixed(2);
}

/* ─── COMPONENT SCORE CALCULATORS ─── */

interface ScoreInputs {
  profileId: number;
  levav28Day: number;
  levav28Completed: boolean;
  totalVolunteerHours: number;
  totalCoursesCompleted: number;
  totalQuickworkShifts: number;
  averageQuickworkRating: number;
  totalJobApplications: number;
  skillsCount: number;
  verifiedSkillsCount: number;
}

async function gatherScoreInputs(profileId: number): Promise<ScoreInputs> {
  // Get profile snapshot
  const profile = await db()
    .query.levavProfiles.findFirst({
      where: eq(schema.levavProfiles.id, profileId),
    });

  // Count completed courses
  const courseCount = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.courseEnrollments)
    .where(
      and(
        eq(schema.courseEnrollments.profileId, profileId),
        eq(schema.courseEnrollments.status, "completed"),
      ),
    );

  // Count QuickWork shifts completed + average rating
  const shiftStats = await db()
    .select({
      count: sql<number>`COUNT(*)`,
      avgRating: sql<number>`COALESCE(AVG(${schema.quickworkApplications.talentRating}), 0)`,
    })
    .from(schema.quickworkApplications)
    .where(eq(schema.quickworkApplications.profileId, profileId));

  // Count job applications
  const jobAppCount = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.jobApplications)
    .where(eq(schema.jobApplications.profileId, profileId));

  // Count skills
  const skillsCount = await db()
    .select({
      total: sql<number>`COUNT(*)`,
      verified: sql<number>`SUM(CASE WHEN ${schema.skillsInventory.verifiedBy} != 'self' THEN 1 ELSE 0 END)`,
    })
    .from(schema.skillsInventory)
    .where(eq(schema.skillsInventory.profileId, profileId));

  const volunteerHours = await getTotalVolunteerHours(profileId);

  return {
    profileId,
    levav28Day: profile?.levav28Day ?? 0,
    levav28Completed: profile?.levav28Completed ?? false,
    totalVolunteerHours: volunteerHours,
    totalCoursesCompleted: courseCount[0]?.count ?? 0,
    totalQuickworkShifts: shiftStats[0]?.count ?? 0,
    averageQuickworkRating: shiftStats[0]?.avgRating ?? 0,
    totalJobApplications: jobAppCount[0]?.count ?? 0,
    skillsCount: skillsCount[0]?.total ?? 0,
    verifiedSkillsCount: skillsCount[0]?.verified ?? 0,
  };
}

// Calculate each component score (0-100)
function calculateCultureScore(inputs: ScoreInputs): number {
  let score = 0;
  // Levav 28 completion is the primary driver
  if (inputs.levav28Completed) score += 40;
  else score += Math.min(inputs.levav28Day * 1.4, 35); // Partial credit
  // Professional completeness bonus
  if (inputs.skillsCount > 0) score += 20;
  if (inputs.verifiedSkillsCount >= 3) score += 20;
  // Course completion
  score += Math.min(inputs.totalCoursesCompleted * 10, 20);
  return Math.min(score, 100);
}

function calculateCriticalThinkingScore(inputs: ScoreInputs): number {
  let score = 0;
  // Levav 28 DISSECT phase completion
  if (inputs.levav28Completed) score += 50;
  else score += Math.min(inputs.levav28Day * 1.5, 45);
  // Skill diversity
  score += Math.min(inputs.skillsCount * 5, 25);
  // Job applications show initiative
  score += Math.min(inputs.totalJobApplications * 3, 15);
  // Course engagement
  score += Math.min(inputs.totalCoursesCompleted * 5, 10);
  return Math.min(score, 100);
}

function calculateReliabilityScore(inputs: ScoreInputs): number {
  let score = 0;
  // Levav 28 EXECUTE phase
  if (inputs.levav28Completed) score += 35;
  else score += Math.min(inputs.levav28Day * 1.2, 30);
  // QuickWork shift completion (employer-rated)
  if (inputs.totalQuickworkShifts > 0) {
    score += Math.min(inputs.totalQuickworkShifts * 8, 30);
    score += Math.min(inputs.averageQuickworkRating * 3.5, 15);
  }
  // Volunteer consistency
  if (inputs.totalVolunteerHours >= 20) score += 20;
  else if (inputs.totalVolunteerHours > 0) score += 10;
  return Math.min(score, 100);
}

function calculateCommunicationScore(inputs: ScoreInputs): number {
  let score = 0;
  // Levav 28 (overall)
  if (inputs.levav28Completed) score += 30;
  else score += Math.min(inputs.levav28Day, 25);
  // Employer reviews via QuickWork
  score += Math.min(inputs.averageQuickworkRating * 8, 25);
  // Course completions
  score += Math.min(inputs.totalCoursesCompleted * 5, 20);
  // Job application follow-through
  score += Math.min(inputs.totalJobApplications * 2, 15);
  // Skills with endorsements
  score += Math.min(inputs.verifiedSkillsCount * 3, 10);
  return Math.min(score, 100);
}

function calculateLearningScore(inputs: ScoreInputs): number {
  let score = 0;
  // Course completions are the primary driver
  score += Math.min(inputs.totalCoursesCompleted * 12, 40);
  // Levav 28 shows learning discipline
  if (inputs.levav28Completed) score += 30;
  else score += Math.min(inputs.levav28Day, 25);
  // Skill breadth
  score += Math.min(inputs.skillsCount * 4, 20);
  // Verified skills (assessed learning)
  score += Math.min(inputs.verifiedSkillsCount * 5, 10);
  return Math.min(score, 100);
}

function calculateLeadershipScore(inputs: ScoreInputs): number {
  let score = 0;
  // Levav 28 OWN phase (accountability)
  if (inputs.levav28Completed) score += 25;
  else score += Math.min(inputs.levav28Day * 0.8, 20);
  // Volunteer hours demonstrate service leadership
  score += Math.min(inputs.totalVolunteerHours * 1.5, 30);
  // QuickWork shifts (reliability under management)
  score += Math.min(inputs.totalQuickworkShifts * 5, 15);
  // Course completion (self-driven)
  score += Math.min(inputs.totalCoursesCompleted * 4, 15);
  // Job applications show career initiative
  score += Math.min(inputs.totalJobApplications * 1.5, 10);
  // Verified skills (peer validation)
  score += Math.min(inputs.verifiedSkillsCount * 2, 10);
  return Math.min(score, 100);
}

function calculateImpactScore(inputs: ScoreInputs): number {
  let score = 0;
  // Volunteer hours are the primary driver
  score += Math.min(inputs.totalVolunteerHours * 2, 50);
  // Levav Code acceptance (service pillar)
  if (inputs.levav28Completed) score += 25;
  else score += Math.min(inputs.levav28Day * 0.6, 15);
  // QuickWork (direct economic contribution)
  score += Math.min(inputs.totalQuickworkShifts * 5, 15);
  // Course completions (knowledge contribution to self)
  score += Math.min(inputs.totalCoursesCompleted * 3, 10);
  return Math.min(score, 100);
}

/* ─── MAIN RECALCULATION FUNCTION ─── */

export interface WriRecalculationResult {
  profileId: number;
  previousScore: string | null;
  newScore: string;
  goldKeyTier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  componentScores: Record<string, { score: string; weight: number }>;
  changes: Array<{ component: string; previous: string | null; current: string }>;
}

/**
 * Recalculate the full WRI score for a profile.
 * Call this after any significant portfolio event.
 */
export async function recalculateWri(profileId: number): Promise<WriRecalculationResult> {
  // Ensure WRI record exists
  let wriRecord = await findWriByProfile(profileId);
  if (!wriRecord) {
    await initializeWriForProfile(profileId);
    wriRecord = await findWriByProfile(profileId);
  }

  const previousScore = wriRecord?.wriScore ?? null;

  // Gather inputs
  const inputs = await gatherScoreInputs(profileId);

  // Calculate each component
  const componentScores = {
    culture: calculateCultureScore(inputs),
    critical_thinking: calculateCriticalThinkingScore(inputs),
    reliability: calculateReliabilityScore(inputs),
    communication: calculateCommunicationScore(inputs),
    learning: calculateLearningScore(inputs),
    leadership: calculateLeadershipScore(inputs),
    impact: calculateImpactScore(inputs),
  };

  // Calculate weighted WRI
  let weightedSum = 0;
  for (const [component, score] of Object.entries(componentScores)) {
    weightedSum += score * (DEFAULT_WEIGHTS[component] ?? 0.14);
  }

  const newScore = Math.min(Math.max(weightedSum, 0), 100);
  const goldKeyTier = getTierFromScore(newScore);

  const changes: Array<{ component: string; previous: string | null; current: string }> = [];

  // Update WRI record
  await updateWriScore(profileId, {
    wriScore: formatScore(newScore),
    goldKeyTier,
    cultureScore: formatScore(componentScores.culture),
    criticalThinkingScore: formatScore(componentScores.critical_thinking),
    reliabilityScore: formatScore(componentScores.reliability),
    communicationScore: formatScore(componentScores.communication),
    learningScore: formatScore(componentScores.learning),
    leadershipScore: formatScore(componentScores.leadership),
    impactScore: formatScore(componentScores.impact),
  });

  // Update denormalized profile snapshot
  await updateWriGoldKey(profileId, formatScore(newScore), goldKeyTier);

  // Log component score changes
  for (const [component, score] of Object.entries(componentScores)) {
    const prevValue = wriRecord?.[`${component}Score` as keyof typeof wriRecord] as string | null;
    const currentValue = formatScore(score);

    if (prevValue !== currentValue) {
      changes.push({ component, previous: prevValue, current: currentValue });

      await addComponentScore({
        profileId,
        componentType: component as any,
        score: currentValue,
        weight: (DEFAULT_WEIGHTS[component] ?? 0.14).toFixed(2),
        sourceEvent: "manual_update",
        sourceDescription: `WRI recalculation: ${component} changed from ${prevValue ?? "0"} to ${currentValue}`,
      });
    }
  }

  return {
    profileId,
    previousScore,
    newScore: formatScore(newScore),
    goldKeyTier,
    componentScores: Object.fromEntries(
      Object.entries(componentScores).map(([k, v]) => [k, { score: formatScore(v), weight: DEFAULT_WEIGHTS[k] ?? 0.14 }]),
    ),
    changes,
  };
}
