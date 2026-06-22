/**
 * ============================================================
 * JOB BROADCAST ROUTER (Agent 2 — Integration & Triggers)
 * ============================================================
 * Employer job posting management with Trigger A integration.
 * Trigger A: Job published → talent pool broadcast notification.
 * ============================================================ */

import { z } from "zod";
import { createRouter, employerQuery, authedQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  listJobPostings,
  findJobPostingById,
  createJobPosting,
  updateJobPostingStatus,
  incrementJobApplicationCount,
  listJobApplications,
  createJobApplication,
  updateApplicationStatus,
  findJobApplicationById,
} from "../queries/employers";
import { findEmployerByUserId } from "../queries/employers";
import { findProfileByUserId } from "../queries/levav-profiles";
import {
  CreateJobPostingSchema,
  ApplyToJobSchema,
  UpdateJobApplicationStatusSchema,
  PaginationSchema,
} from "@contracts/schemas";
import { triggerJobBroadcast } from "../services/trigger-dispatcher";

export const jobBroadcastRouter = createRouter({
  /* ─── PUBLIC: BROWSE JOBS ─── */

  listJobs: authedQuery
    .input(
      z
        .object({
          city: z.string().optional(),
          jobType: z.string().optional(),
          status: z.string().default("published"),
        })
        .merge(PaginationSchema)
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listJobPostings({
          city: input?.city,
          jobType: input?.jobType,
          status: input?.status ?? "published",
          limit: input?.pageSize ?? 20,
          offset: input ? (input.page - 1) * input.pageSize : 0,
        });
      }, "INTERNAL_ERROR");
    }),

  jobById: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const job = await findJobPostingById(input.id);
        if (!job) throwLevavError("JOB_NOT_FOUND");
        return job;
      }, "JOB_NOT_FOUND");
    }),

  /* ─── EMPLOYER: MANAGE POSTINGS ─── */

  createJob: employerQuery
    .input(CreateJobPostingSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const employer = await findEmployerByUserId(ctx.user.id);
        if (!employer) throwLevavError("FORBIDDEN_ROLE", "Employer profile required.");

        const jobId = await createJobPosting({
          employerId: employer.id,
          title: input.title,
          description: input.description,
          requirements: input.requirements,
          responsibilities: input.responsibilities,
          location: input.location,
          city: input.city,
          province: input.province,
          country: input.country,
          jobType: input.jobType,
          experienceLevel: input.experienceLevel,
          salaryMin: input.salaryMin?.toFixed(2) ?? null,
          salaryMax: input.salaryMax?.toFixed(2) ?? null,
          skillsRequired: input.skillsRequired ?? [],
          minWriScore: input.minWriScore?.toFixed(2) ?? null,
          status: "draft",
        });

        return { jobId, success: true, status: "draft" };
      }, "FORBIDDEN_ROLE");
    }),

  myJobs: employerQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const employer = await findEmployerByUserId(ctx.user.id);
      if (!employer) throwLevavError("FORBIDDEN_ROLE");

      return listJobPostings({ employerId: employer.id });
    }, "FORBIDDEN_ROLE");
  }),

  /**
   * Publish a job posting.
   * TRIGGER A: Broadcasts to matched talent pool.
   */
  publishJob: employerQuery
    .input(z.object({ jobId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const employer = await findEmployerByUserId(ctx.user.id);
        if (!employer) throwLevavError("FORBIDDEN_ROLE");

        const job = await findJobPostingById(input.jobId);
        if (!job) throwLevavError("JOB_NOT_FOUND");
        if (job.employerId !== employer.id) throwLevavError("UNAUTHORIZED_ACTION");

        await updateJobPostingStatus(input.jobId, "published");

        // TRIGGER A: Broadcast to talent pool
        const broadcastResult = await triggerJobBroadcast(input.jobId, employer.id);

        return {
          success: true,
          status: "published",
          broadcast: {
            matchedProfiles: broadcastResult.matchedProfileIds?.length ?? 0,
            notificationsSent: broadcastResult.notificationIds?.length ?? 0,
          },
        };
      }, "JOB_NOT_FOUND");
    }),

  updateJobStatus: employerQuery
    .input(
      z.object({
        jobId: z.number().int().positive(),
        status: z.enum(["draft", "published", "paused", "closed", "filled"]),
      }),
    )
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await updateJobPostingStatus(input.jobId, input.status);
        return { success: true, status: input.status };
      }, "JOB_NOT_FOUND");
    }),

  jobApplications: employerQuery
    .input(z.object({ jobId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listJobApplications({ jobId: input.jobId });
      }, "INTERNAL_ERROR");
    }),

  updateApplication: employerQuery
    .input(UpdateJobApplicationStatusSchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const application = await findJobApplicationById(input.applicationId);
        if (!application) throwLevavError("APPLICATION_NOT_FOUND");

        await updateApplicationStatus(
          input.applicationId,
          input.status,
          input.employerNotes,
          input.rating,
        );

        return { success: true, status: input.status };
      }, "APPLICATION_NOT_FOUND");
    }),

  /* ─── TALENT: SUBMIT APPLICATION ─── */

  submitApplication: authedQuery
    .input(ApplyToJobSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const job = await findJobPostingById(input.jobId);
        if (!job) throwLevavError("JOB_NOT_FOUND");
        if (job.status !== "published") throwLevavError("JOB_CLOSED");

        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        // Check WRI minimum if specified
        if (job.minWriScore && profile.currentWriScore) {
          if (Number(profile.currentWriScore) < Number(job.minWriScore)) {
            throwLevavError("VALIDATION_FAILED", `This position requires a minimum WRI score of ${job.minWriScore}.`);
          }
        }

        const applicationId = await createJobApplication({
          jobId: input.jobId,
          profileId: profile.id,
          coverLetter: input.coverLetter ?? null,
          status: "applied",
        });

        await incrementJobApplicationCount(input.jobId);

        return { applicationId, success: true, status: "applied" };
      }, "JOB_NOT_FOUND");
    }),

  myApplications: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) throwLevavError("PROFILE_NOT_FOUND");

      return listJobApplications({ profileId: profile.id });
    }, "PROFILE_NOT_FOUND");
  }),
});
