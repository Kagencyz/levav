/**
 * ============================================================
 * QUICKWORK ROUTER (Agent 2 — Integration & Triggers)
 * ============================================================
 * On-demand shift marketplace for employers and talent.
 * Trigger C: Shift rating → WRI recalculation.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, employerQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  listShifts,
  findShiftById,
  createShift,
  fillShift,
  updateShiftStatus,
  listApplications,
  findApplicationById,
  findApplicationByShiftAndProfile,
  createApplication,
  acceptApplication,
  rateApplication,
} from "../queries/quickwork";
import { findEmployerByUserId } from "../queries/employers";
import { findProfileByUserId } from "../queries/levav-profiles";
import {
  CreateQuickworkShiftSchema,
  ApplyToShiftSchema,
  RateShiftSchema,
  PaginationSchema,
} from "@contracts/schemas";
import { triggerQuickworkRating } from "../services/trigger-dispatcher";

export const quickworkRouter = createRouter({
  /* ─── SHIFT LISTING (PUBLIC) ─── */

  listShifts: authedQuery
    .input(
      z
        .object({
          city: z.string().optional(),
          status: z.string().default("open"),
          shiftDate: z.string().optional(),
        })
        .merge(PaginationSchema)
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listShifts({
          city: input?.city,
          status: input?.status ?? "open",
          shiftDate: input?.shiftDate,
          limit: input?.pageSize ?? 20,
          offset: input ? (input.page - 1) * input.pageSize : 0,
        });
      }, "INTERNAL_ERROR");
    }),

  shiftById: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const shift = await findShiftById(input.id);
        if (!shift) throwLevavError("SHIFT_NOT_FOUND");
        return shift;
      }, "SHIFT_NOT_FOUND");
    }),

  /* ─── EMPLOYER: CREATE & MANAGE SHIFTS ─── */

  createShift: employerQuery
    .input(CreateQuickworkShiftSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const employer = await findEmployerByUserId(ctx.user.id);
        if (!employer) throwLevavError("FORBIDDEN_ROLE", "Employer profile required.");

        const shiftId = await createShift({
          employerId: employer.id,
          title: input.title,
          description: input.description,
          location: input.location,
          city: input.city,
          province: input.province,
          shiftDate: new Date(input.shiftDate),
          startTime: input.startTime,
          endTime: input.endTime,
          hourlyRate: input.hourlyRate.toFixed(2),
          totalHours: input.totalHours.toFixed(1),
          estimatedTotalPay: (input.hourlyRate * Number(input.totalHours)).toFixed(2),
          requiredSkills: input.requiredSkills ?? [],
          requiredProfessions: input.requiredProfessions ?? [],
          minWriScore: input.minWriScore?.toFixed(2) ?? null,
          status: "open",
          spotsTotal: input.spotsTotal,
        });

        return { shiftId, success: true };
      }, "FORBIDDEN_ROLE");
    }),

  myShifts: employerQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const employer = await findEmployerByUserId(ctx.user.id);
      if (!employer) throwLevavError("FORBIDDEN_ROLE");

      return listShifts({ employerId: employer.id });
    }, "FORBIDDEN_ROLE");
  }),

  updateShiftStatus: employerQuery
    .input(
      z.object({
        shiftId: z.number().int().positive(),
        status: z.enum(["open", "filled", "in_progress", "completed", "cancelled"]),
      }),
    )
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await updateShiftStatus(input.shiftId, input.status);
        return { success: true };
      }, "SHIFT_NOT_FOUND");
    }),

  /* ─── TALENT: APPLY TO SHIFTS ─── */

  submitApplication: authedQuery
    .input(ApplyToShiftSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const shift = await findShiftById(input.shiftId);
        if (!shift) throwLevavError("SHIFT_NOT_FOUND");

        if (shift.status !== "open") throwLevavError("SHIFT_CLOSED");

        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        // Check if already applied
        const existing = await findApplicationByShiftAndProfile(input.shiftId, profile.id);
        if (existing) throwLevavError("SHIFT_ALREADY_APPLIED");

        const applicationId = await createApplication({
          shiftId: input.shiftId,
          profileId: profile.id,
          status: "applied",
          coverNote: input.coverNote ?? null,
        });

        return { applicationId, success: true, status: "applied" };
      }, "SHIFT_NOT_FOUND");
    }),

  myApplications: authedQuery
    .input(
      z
        .object({
          status: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        return listApplications({
          profileId: profile.id,
          status: input?.status,
        });
      }, "PROFILE_NOT_FOUND");
    }),

  acceptTalent: employerQuery
    .input(z.object({ applicationId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const application = await findApplicationById(input.applicationId);
        if (!application) throwLevavError("APPLICATION_NOT_FOUND");

        await acceptApplication(input.applicationId);
        await fillShift(application.shiftId, application.profileId);

        return { success: true, status: "accepted" };
      }, "APPLICATION_NOT_FOUND");
    }),

  /**
   * Rate a completed shift.
   * TRIGGER C: Fires WRI recalculation on rating.
   */
  rateShift: authedQuery
    .input(RateShiftSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const application = await findApplicationById(input.applicationId);
        if (!application) throwLevavError("APPLICATION_NOT_FOUND");

        // Determine if the current user is employer or talent
        const isTalent = application.profileId === ctx.user.id;

        if (isTalent) {
          // Talent rating the employer/shift
          await rateApplication(input.applicationId, {
            talentRating: input.rating,
            talentReview: input.review,
          });
        } else {
          // Employer rating the talent
          await rateApplication(input.applicationId, {
            employerRating: input.rating,
            employerReview: input.review,
          });

          // TRIGGER C: Recalculate WRI for the talent
          await triggerQuickworkRating(
            application.profileId,
            application.shiftId,
            input.rating,
          );
        }

        return {
          success: true,
          ratedBy: isTalent ? "talent" : "employer",
        };
      }, "APPLICATION_NOT_FOUND");
    }),
});
