/**
 * ============================================================
 * JOB APPLICATIONS QUERY FUNCTIONS
 * ============================================================
 * Employer-facing queries for applicant tracking.
 * ============================================================
 */

import { eq, desc, and } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── LIST APPLICANTS FOR A JOB ─── */

export async function listApplicationsByJob(jobId: number, statusFilter?: string) {
  const conditions = [eq(schema.jobApplications.jobId, jobId)];
  if (statusFilter) {
    conditions.push(eq(schema.jobApplications.status, statusFilter as any));
  }

  return db()
    .select()
    .from(schema.jobApplications)
    .where(and(...conditions))
    .orderBy(desc(schema.jobApplications.appliedAt));
}

/* ─── GET APPLICATION WITH PROFILE DATA ─── */

export async function getApplicationWithProfile(applicationId: number) {
  const app = await db()
    .query.jobApplications.findFirst({
      where: eq(schema.jobApplications.id, applicationId),
    });

  if (!app) return null;

  const profile = await db()
    .query.levavProfiles.findFirst({
      where: eq(schema.levavProfiles.id, app.profileId),
    });

  return { ...app, profile };
}

/* ─── UPDATE APPLICATION STATUS ─── */

export async function updateApplicationStatus(
  applicationId: number,
  status: string,
  notes?: string,
) {
  const updateData: Record<string, unknown> = { status };

  if (notes) updateData.employerNotes = notes;
  if (status === "screening") updateData.screenedAt = new Date();
  if (status === "interview") updateData.interviewedAt = new Date();
  if (status === "offer") updateData.offeredAt = new Date();
  if (status === "hired") updateData.hiredAt = new Date();
  if (status === "rejected") updateData.rejectedAt = new Date();

  await db()
    .update(schema.jobApplications)
    .set(updateData)
    .where(eq(schema.jobApplications.id, applicationId));
}

/* ─── EMPLOYER: LIST ALL APPLICATIONS ACROSS THEIR JOBS ─── */

export async function listApplicationsForEmployer(employerId: number) {
  /* Get all job IDs for this employer */
  const jobs = await db()
    .select({ id: schema.jobPostings.id })
    .from(schema.jobPostings)
    .where(eq(schema.jobPostings.employerId, employerId));

  const jobIds = jobs.map((j) => j.id);
  if (jobIds.length === 0) return [];

  /* Get all applications for those jobs */
  const applications = await db()
    .select()
    .from(schema.jobApplications)
    .orderBy(desc(schema.jobApplications.appliedAt));

  return applications.filter((a) => jobIds.includes(a.jobId));
}
