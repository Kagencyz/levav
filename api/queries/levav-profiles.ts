/**
 * ============================================================
 * LEVAV PROFILE QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for levav_profiles table.
 * All foreign keys use bigint({ mode: "number", unsigned: true }).
 * ============================================================
 */

import { eq, and, sql, desc, like } from "drizzle-orm";
import * as schema from "@db/schema";
import type {
  InsertLevavProfile,
  InsertSkillsInventory,
  InsertExperienceHistory,
  InsertEducationHistory,
  InsertLevavCodeAcceptance,
} from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── PROFILE CRUD ─── */

export async function findProfileByUserId(userId: number) {
  return db()
    .query.levavProfiles.findFirst({
      where: eq(schema.levavProfiles.userId, userId),
    });
}

export async function findProfileById(profileId: number) {
  return db()
    .query.levavProfiles.findFirst({
      where: eq(schema.levavProfiles.id, profileId),
    });
}

export async function findProfileByLevavCode(levavCode: string) {
  return db()
    .query.levavProfiles.findFirst({
      where: eq(schema.levavProfiles.levavCode, levavCode),
    });
}

export async function createProfile(data: InsertLevavProfile) {
  const result = await db()
    .insert(schema.levavProfiles)
    .values(data)
    .$returningId();
  const id = result[0]?.id;
  if (!id) throw new Error("Failed to create profile");
  return findProfileById(id);
}

export async function updateProfile(profileId: number, data: Partial<InsertLevavProfile>) {
  await db()
    .update(schema.levavProfiles)
    .set(data)
    .where(eq(schema.levavProfiles.id, profileId));
  return findProfileById(profileId);
}

export async function updateUserRole(userId: number, role: "talent" | "employer" | "creator") {
  await db()
    .update(schema.users)
    .set({ role })
    .where(eq(schema.users.id, userId));
}

/* ─── PROFILE LISTINGS (for employer search) ─── */

export async function listAvailableProfiles(filters: {
  city?: string;
  professionId?: number;
  minWriScore?: number;
  availability?: string;
  limit?: number;
  offset?: number;
}) {
  const { city, professionId, minWriScore, availability, limit = 20, offset = 0 } = filters;

  const conditions = [eq(schema.levavProfiles.lookingForWork, true)];

  if (city) conditions.push(like(schema.levavProfiles.city, `%${city}%`));
  if (professionId) conditions.push(eq(schema.levavProfiles.professionId, professionId));
  if (minWriScore)
    conditions.push(sql`${schema.levavProfiles.currentWriScore} >= ${minWriScore}`);
  if (availability) conditions.push(eq(schema.levavProfiles.availabilityStatus, availability as any));

  return db()
    .select({
      id: schema.levavProfiles.id,
      userId: schema.levavProfiles.userId,
      levavCode: schema.levavProfiles.levavCode,
      firstName: schema.levavProfiles.firstName,
      lastName: schema.levavProfiles.lastName,
      headline: schema.levavProfiles.headline,
      city: schema.levavProfiles.city,
      province: schema.levavProfiles.province,
      professionId: schema.levavProfiles.professionId,
      customProfessionText: schema.levavProfiles.customProfessionText,
      currentWriScore: schema.levavProfiles.currentWriScore,
      wriGoldKey: schema.levavProfiles.wriGoldKey,
      availabilityStatus: schema.levavProfiles.availabilityStatus,
      avatarUrl: schema.levavProfiles.avatarUrl,
    })
    .from(schema.levavProfiles)
    .where(and(...conditions))
    .orderBy(desc(schema.levavProfiles.currentWriScore))
    .limit(limit)
    .offset(offset);
}

/* ─── SKILLS INVENTORY ─── */

export async function findSkillsByProfile(profileId: number) {
  return db()
    .select()
    .from(schema.skillsInventory)
    .where(eq(schema.skillsInventory.profileId, profileId));
}

export async function addSkill(data: InsertSkillsInventory) {
  const result = await db()
    .insert(schema.skillsInventory)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateSkill(skillId: number, data: Partial<InsertSkillsInventory>) {
  await db()
    .update(schema.skillsInventory)
    .set(data)
    .where(eq(schema.skillsInventory.id, skillId));
}

export async function deleteSkill(skillId: number) {
  await db()
    .delete(schema.skillsInventory)
    .where(eq(schema.skillsInventory.id, skillId));
}

/* ─── EXPERIENCE HISTORY ─── */

export async function findExperienceByProfile(profileId: number) {
  return db()
    .select()
    .from(schema.experienceHistory)
    .where(eq(schema.experienceHistory.profileId, profileId));
}

export async function addExperience(data: InsertExperienceHistory) {
  const result = await db()
    .insert(schema.experienceHistory)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function deleteExperience(experienceId: number) {
  await db()
    .delete(schema.experienceHistory)
    .where(eq(schema.experienceHistory.id, experienceId));
}

/* ─── EDUCATION HISTORY ─── */

export async function findEducationByProfile(profileId: number) {
  return db()
    .select()
    .from(schema.educationHistory)
    .where(eq(schema.educationHistory.profileId, profileId));
}

export async function addEducation(data: InsertEducationHistory) {
  const result = await db()
    .insert(schema.educationHistory)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function deleteEducation(educationId: number) {
  await db()
    .delete(schema.educationHistory)
    .where(eq(schema.educationHistory.id, educationId));
}

/* ─── LEVAV CODE ACCEPTANCE ─── */

export async function findLevavCodeAcceptance(profileId: number) {
  return db()
    .query.levavCodeAcceptances.findFirst({
      where: eq(schema.levavCodeAcceptances.profileId, profileId),
    });
}

export async function recordLevavCodeAcceptance(data: InsertLevavCodeAcceptance) {
  await db()
    .insert(schema.levavCodeAcceptances)
    .values(data);
}

/* ─── GENERATE UNIQUE LEVAV CODE ─── */

export async function generateLevavCode(): Promise<string> {
  const prefix = "LVA";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `${prefix}-${randomPart}`;

  // Ensure uniqueness
  const existing = await findProfileByLevavCode(code);
  if (existing) {
    return generateLevavCode(); // Retry
  }
  return code;
}
