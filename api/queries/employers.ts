/**
 * ============================================================
 * EMPLOYER B2B QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for employer portal.
 * Includes: employer_profiles, job_postings, job_applications
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type {
  InsertEmployerProfile,
  InsertJobPosting,
  InsertJobApplication,
} from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── EMPLOYER PROFILES ─── */

export async function listAllEmployers(filters?: {
  verificationStatus?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (filters?.verificationStatus)
    conditions.push(eq(schema.employerProfiles.verificationStatus, filters.verificationStatus as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return getDb()
    .select()
    .from(schema.employerProfiles)
    .where(whereClause)
    .orderBy(desc(schema.employerProfiles.createdAt))
    .limit(filters?.limit ?? 50)
    .offset(filters?.offset ?? 0);
}

export async function findEmployerByUserId(userId: number) {
  return db()
    .query.employerProfiles.findFirst({
      where: eq(schema.employerProfiles.userId, userId),
    });
}

export async function findEmployerById(id: number) {
  return db()
    .query.employerProfiles.findFirst({
      where: eq(schema.employerProfiles.id, id),
    });
}

export async function createEmployerProfile(data: InsertEmployerProfile) {
  const result = await db()
    .insert(schema.employerProfiles)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateEmployerProfile(employerId: number, data: Partial<InsertEmployerProfile>) {
  await db()
    .update(schema.employerProfiles)
    .set(data)
    .where(eq(schema.employerProfiles.id, employerId));
  return findEmployerById(employerId);
}

/* ─── JOB POSTINGS ─── */

export async function listJobPostings(filters?: {
  employerId?: number;
  status?: string;
  city?: string;
  jobType?: string;
  minWriScore?: number;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (filters?.employerId) conditions.push(eq(schema.jobPostings.employerId, filters.employerId));
  if (filters?.status) conditions.push(eq(schema.jobPostings.status, filters.status as any));
  if (filters?.city) conditions.push(eq(schema.jobPostings.city, filters.city));
  if (filters?.jobType) conditions.push(eq(schema.jobPostings.jobType, filters.jobType as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.jobPostings)
    .where(whereClause)
    .orderBy(desc(schema.jobPostings.createdAt))
    .limit(filters?.limit ?? 20)
    .offset(filters?.offset ?? 0);
}

export async function findJobPostingById(id: number) {
  return db()
    .query.jobPostings.findFirst({
      where: eq(schema.jobPostings.id, id),
    });
}

export async function createJobPosting(data: InsertJobPosting) {
  const result = await db()
    .insert(schema.jobPostings)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateJobPostingStatus(
  jobId: number,
  status: "draft" | "published" | "paused" | "closed" | "filled",
) {
  await db()
    .update(schema.jobPostings)
    .set({ status })
    .where(eq(schema.jobPostings.id, jobId));
}

export async function incrementJobApplicationCount(jobId: number) {
  await db()
    .update(schema.jobPostings)
    .set({
      totalApplications: sql`${schema.jobPostings.totalApplications} + 1`,
    })
    .where(eq(schema.jobPostings.id, jobId));
}

/* ─── JOB APPLICATIONS ─── */

export async function listJobApplications(filters?: {
  jobId?: number;
  profileId?: number;
  status?: string;
}) {
  const conditions = [];
  if (filters?.jobId) conditions.push(eq(schema.jobApplications.jobId, filters.jobId));
  if (filters?.profileId) conditions.push(eq(schema.jobApplications.profileId, filters.profileId));
  if (filters?.status) conditions.push(eq(schema.jobApplications.status, filters.status as any));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.jobApplications)
    .where(whereClause)
    .orderBy(desc(schema.jobApplications.appliedAt));
}

export async function findJobApplicationById(id: number) {
  return db()
    .query.jobApplications.findFirst({
      where: eq(schema.jobApplications.id, id),
    });
}

export async function createJobApplication(data: InsertJobApplication) {
  const result = await db()
    .insert(schema.jobApplications)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateApplicationStatus(
  applicationId: number,
  status: string,
  notes?: string,
  rating?: number,
) {
  const updateData: Record<string, unknown> = { status };
  if (notes) updateData.employerNotes = notes;
  if (rating) updateData.rating = rating;

  // Set the appropriate timestamp
  const now = new Date();
  switch (status) {
    case "screening": updateData.screenedAt = now; break;
    case "interview": updateData.interviewedAt = now; break;
    case "offer": updateData.offeredAt = now; break;
    case "hired": updateData.hiredAt = now; break;
    case "rejected": updateData.rejectedAt = now; break;
  }

  await db()
    .update(schema.jobApplications)
    .set(updateData)
    .where(eq(schema.jobApplications.id, applicationId));
}
