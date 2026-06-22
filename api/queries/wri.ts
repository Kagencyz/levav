/**
 * ============================================================
 * WRI (WORKFORCE READINESS INDEX) QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for WRI analytics tables.
 * ============================================================
 */

import { eq, desc, and, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertWriAnalytics, InsertWriComponentScore } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── WRI ANALYTICS CRUD ─── */

export async function findWriByProfile(profileId: number) {
  return db()
    .query.wriAnalytics.findFirst({
      where: eq(schema.wriAnalytics.profileId, profileId),
    });
}

export async function createWriRecord(data: InsertWriAnalytics) {
  const result = await db()
    .insert(schema.wriAnalytics)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateWriScore(
  profileId: number,
  scores: {
    wriScore: string;
    goldKeyTier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
    cultureScore: string;
    criticalThinkingScore: string;
    reliabilityScore: string;
    communicationScore: string;
    learningScore: string;
    leadershipScore: string;
    impactScore: string;
  },
) {
  await db()
    .update(schema.wriAnalytics)
    .set({
      ...scores,
      lastCalculatedAt: new Date(),
      calculationVersion: sql`${schema.wriAnalytics.calculationVersion} + 1`,
    })
    .where(eq(schema.wriAnalytics.profileId, profileId));
}

export async function updateWriGoldKey(
  profileId: number,
  wriScore: string,
  goldKeyTier: string,
) {
  // Update the denormalized snapshot on levav_profiles
  await db()
    .update(schema.levavProfiles)
    .set({
      currentWriScore: wriScore,
      wriGoldKey: goldKeyTier as any,
    })
    .where(eq(schema.levavProfiles.id, profileId));
}

/* ─── COMPONENT SCORE HISTORY ─── */

export async function addComponentScore(data: InsertWriComponentScore) {
  await db().insert(schema.wriComponentScores).values(data);
}

export async function listComponentScoresByProfile(
  profileId: number,
  filters?: { componentType?: string; limit?: number },
) {
  const conditions = [eq(schema.wriComponentScores.profileId, profileId)];
  if (filters?.componentType) {
    conditions.push(
      eq(schema.wriComponentScores.componentType, filters.componentType as any),
    );
  }
  return db()
    .select()
    .from(schema.wriComponentScores)
    .where(and(...conditions))
    .orderBy(desc(schema.wriComponentScores.recordedAt))
    .limit(filters?.limit ?? 50);
}

/* ─── LEADERBOARD ─── */

export async function getWriLeaderboard(filters: {
  limit?: number;
  minScore?: number;
  goldKeyTier?: string;
}) {
  const { limit = 20, minScore, goldKeyTier } = filters;

  const conditions = [];
  if (minScore !== undefined)
    conditions.push(sql`${schema.wriAnalytics.wriScore} >= ${minScore}`);
  if (goldKeyTier)
    conditions.push(eq(schema.wriAnalytics.goldKeyTier, goldKeyTier as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select({
      profileId: schema.wriAnalytics.profileId,
      wriScore: schema.wriAnalytics.wriScore,
      goldKeyTier: schema.wriAnalytics.goldKeyTier,
      cultureScore: schema.wriAnalytics.cultureScore,
      criticalThinkingScore: schema.wriAnalytics.criticalThinkingScore,
      reliabilityScore: schema.wriAnalytics.reliabilityScore,
      communicationScore: schema.wriAnalytics.communicationScore,
      learningScore: schema.wriAnalytics.learningScore,
      leadershipScore: schema.wriAnalytics.leadershipScore,
      impactScore: schema.wriAnalytics.impactScore,
      lastCalculatedAt: schema.wriAnalytics.lastCalculatedAt,
    })
    .from(schema.wriAnalytics)
    .where(whereClause)
    .orderBy(desc(schema.wriAnalytics.wriScore))
    .limit(limit);
}

/* ─── COMPONENT SCORE HISTORY ─── */

export async function getComponentScoreHistory(profileId: number, limit: number = 100) {
  return getDb()
    .select()
    .from(schema.wriComponentScores)
    .where(eq(schema.wriComponentScores.profileId, profileId))
    .orderBy(desc(schema.wriComponentScores.recordedAt))
    .limit(limit);
}

export async function getComponentScoreTrends(profileId: number) {
  const scores = await getDb()
    .select()
    .from(schema.wriComponentScores)
    .where(eq(schema.wriComponentScores.profileId, profileId))
    .orderBy(schema.wriComponentScores.recordedAt);

  const grouped: Record<string, typeof scores> = {};
  scores.forEach((s) => {
    const key = s.componentType;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  });

  return grouped;
}

/* ─── INITIALIZE WRI FOR NEW PROFILE ─── */

export async function initializeWriForProfile(profileId: number) {
  const existing = await findWriByProfile(profileId);
  if (existing) return existing;

  await createWriRecord({
    profileId,
    wriScore: "0.00",
    goldKeyTier: "bronze",
    cultureScore: "0.00",
    criticalThinkingScore: "0.00",
    reliabilityScore: "0.00",
    communicationScore: "0.00",
    learningScore: "0.00",
    leadershipScore: "0.00",
    impactScore: "0.00",
    calculationVersion: 1,
  });

  return findWriByProfile(profileId);
}
