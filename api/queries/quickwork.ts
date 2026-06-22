/**
 * ============================================================
 * QUICKWORK QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for QuickWork shift marketplace.
 * Includes: quickwork_shifts, quickwork_applications
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertQuickworkShift, InsertQuickworkApplication } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── QUICKWORK SHIFTS ─── */

export async function listShifts(filters?: {
  employerId?: number;
  status?: string;
  city?: string;
  shiftDate?: string;
  minWriScore?: number;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (filters?.employerId) conditions.push(eq(schema.quickworkShifts.employerId, filters.employerId));
  if (filters?.status) conditions.push(eq(schema.quickworkShifts.status, filters.status as any));
  if (filters?.city) conditions.push(eq(schema.quickworkShifts.city, filters.city));
  if (filters?.shiftDate) conditions.push(eq(schema.quickworkShifts.shiftDate, new Date(filters.shiftDate)));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.quickworkShifts)
    .where(whereClause)
    .orderBy(desc(schema.quickworkShifts.createdAt))
    .limit(filters?.limit ?? 20)
    .offset(filters?.offset ?? 0);
}

export async function findShiftById(id: number) {
  return db()
    .query.quickworkShifts.findFirst({
      where: eq(schema.quickworkShifts.id, id),
    });
}

export async function createShift(data: InsertQuickworkShift) {
  const result = await db()
    .insert(schema.quickworkShifts)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateShiftStatus(
  shiftId: number,
  status: "open" | "filled" | "in_progress" | "completed" | "cancelled",
) {
  await db()
    .update(schema.quickworkShifts)
    .set({ status })
    .where(eq(schema.quickworkShifts.id, shiftId));
}

export async function fillShift(shiftId: number, profileId: number) {
  await db()
    .update(schema.quickworkShifts)
    .set({
      status: "filled",
      spotsFilled: sql`${schema.quickworkShifts.spotsFilled} + 1`,
      filledByProfileId: profileId,
    })
    .where(eq(schema.quickworkShifts.id, shiftId));
}

/* ─── QUICKWORK APPLICATIONS ─── */

export async function listApplications(filters?: {
  shiftId?: number;
  profileId?: number;
  status?: string;
}) {
  const conditions = [];
  if (filters?.shiftId) conditions.push(eq(schema.quickworkApplications.shiftId, filters.shiftId));
  if (filters?.profileId) conditions.push(eq(schema.quickworkApplications.profileId, filters.profileId));
  if (filters?.status) conditions.push(eq(schema.quickworkApplications.status, filters.status as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.quickworkApplications)
    .where(whereClause)
    .orderBy(desc(schema.quickworkApplications.appliedAt));
}

export async function findApplicationById(id: number) {
  return db()
    .query.quickworkApplications.findFirst({
      where: eq(schema.quickworkApplications.id, id),
    });
}

export async function findApplicationByShiftAndProfile(shiftId: number, profileId: number) {
  return db()
    .query.quickworkApplications.findFirst({
      where: and(
        eq(schema.quickworkApplications.shiftId, shiftId),
        eq(schema.quickworkApplications.profileId, profileId),
      ),
    });
}

export async function createApplication(data: InsertQuickworkApplication) {
  const result = await db()
    .insert(schema.quickworkApplications)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function acceptApplication(applicationId: number) {
  await db()
    .update(schema.quickworkApplications)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
    })
    .where(eq(schema.quickworkApplications.id, applicationId));
}

export async function completeApplication(
  applicationId: number,
  data: { employerRating?: number; employerReview?: string; talentRating?: number; talentReview?: string },
) {
  await db()
    .update(schema.quickworkApplications)
    .set({
      ...data,
      status: data.employerRating || data.talentRating ? "accepted" : undefined,
      completedAt: new Date(),
    })
    .where(eq(schema.quickworkApplications.id, applicationId));
}

export async function rateApplication(
  applicationId: number,
  rating: { employerRating?: number; employerReview?: string; talentRating?: number; talentReview?: string },
) {
  await db()
    .update(schema.quickworkApplications)
    .set(rating)
    .where(eq(schema.quickworkApplications.id, applicationId));
}
