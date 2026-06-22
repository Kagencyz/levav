/**
 * ============================================================
 * JOB APPLICATION ROUTER (Employer ATS)
 * ============================================================
 * Applicant Tracking System endpoints for employers.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, employerQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findEmployerByUserId } from "../queries/employers";
import {
  listApplicationsByJob,
  listApplicationsForEmployer,
  updateApplicationStatus,
} from "../queries/job-applications";
import { getDb } from "../queries/connection";
import { jobPostings, levavProfiles } from "@db/schema";
import { eq } from "drizzle-orm";

export const jobApplicationRouter = createRouter({
  /* ─── List applicants for a specific job ─── */
  listByJob: employerQuery
    .input(z.object({ jobId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const apps = await listApplicationsByJob(input.jobId);

        /* Enrich with profile data */
        const db = getDb();
        const enriched = await Promise.all(
          apps.map(async (app) => {
            const profile = await db
              .query.levavProfiles.findFirst({
                where: eq(levavProfiles.id, app.profileId),
              });
            return { ...app, profile };
          }),
        );

        return enriched;
      }, "INTERNAL_ERROR");
    }),

  /* ─── List all applicants across employer's jobs ─── */
  myApplicants: employerQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const employer = await findEmployerByUserId(ctx.user.id);
      if (!employer) return [];

      const apps = await listApplicationsForEmployer(employer.id);

      /* Enrich with profile data */
      const db = getDb();
      const enriched = await Promise.all(
        apps.map(async (app) => {
          const [profile, job] = await Promise.all([
            db.query.levavProfiles.findFirst({
              where: eq(levavProfiles.id, app.profileId),
            }),
            db.query.jobPostings.findFirst({
              where: eq(jobPostings.id, app.jobId),
            }),
          ]);
          return { ...app, profile, jobTitle: job?.title ?? "Unknown" };
        }),
      );

      return enriched;
    }, "INTERNAL_ERROR");
  }),

  /* ─── Update application status ─── */
  updateStatus: employerQuery
    .input(
      z.object({
        applicationId: z.number().int().positive(),
        status: z.enum(["applied", "screening", "interview", "offer", "hired", "rejected"]),
        notes: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await updateApplicationStatus(input.applicationId, input.status, input.notes);
        return { success: true, status: input.status };
      }, "INTERNAL_ERROR");
    }),
});
