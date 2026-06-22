/**
 * ============================================================
 * VOLUNTEER ROUTER (Agent 2 — Integration & Triggers)
 * ============================================================
 * Handles volunteer hour logging and coordinator validation.
 * Trigger B: Validation → WRI Impact Score recalculation.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, adminQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  findVolunteerEntryById,
  listVolunteerEntries,
  logVolunteerHours,
  validateVolunteerHours,
  getCoordinatorStats,
} from "../queries/impact";
import { findProfileByUserId } from "../queries/levav-profiles";
import { LogVolunteerHoursSchema, ValidateVolunteerHoursSchema } from "@contracts/schemas";
import { triggerVolunteerValidation } from "../services/trigger-dispatcher";

export const volunteerRouter = createRouter({
  /**
   * List volunteer entries for the current talent.
   */
  myEntries: authedQuery
    .input(
      z
        .object({
          validated: z.boolean().optional(),
          limit: z.number().int().min(1).max(50).default(20),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        return listVolunteerEntries({
          profileId: profile.id,
          validated: input?.validated,
        });
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Log volunteer hours (talent side).
   * Profile ID is auto-derived from the authenticated user.
   */
  logHours: authedQuery
    .input(LogVolunteerHoursSchema.omit({ profileId: true }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const entryId = await logVolunteerHours({
          opportunityId: input.opportunityId,
          profileId: profile.id,
          hoursLogged: input.hoursLogged.toFixed(1),
          activityDescription: input.activityDescription ?? null,
          logDate: new Date(input.logDate),
          validatedByCoordinator: false,
        });

        return { entryId, success: true, message: "Hours logged and awaiting coordinator validation." };
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Validate volunteer hours (coordinator/admin side).
   * TRIGGER B: Fires WRI recalculation on validation.
   */
  validate: authedQuery
    .input(ValidateVolunteerHoursSchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        const entry = await findVolunteerEntryById(input.ledgerEntryId);
        if (!entry) throwLevavError("VOLUNTEER_NOT_VALIDATED", "Entry not found.");

        if (entry.validatedByCoordinator) {
          return { success: true, alreadyValidated: true, message: "Already validated." };
        }

        // Mark as validated
        await validateVolunteerHours(
          input.ledgerEntryId,
          input.coordinatorName,
          undefined,
          input.notes,
        );

        // TRIGGER B: Recalculate WRI for the volunteer
        const triggerResult = await triggerVolunteerValidation(
          input.ledgerEntryId,
          entry.profileId,
          Number(entry.hoursLogged),
        );

        return {
          success: true,
          alreadyValidated: false,
          validated: true,
          triggerResult: {
            wriScore: triggerResult.wriResult?.newScore,
            goldKeyTier: triggerResult.wriResult?.goldKeyTier,
          },
        };
      }, "VOLUNTEER_NOT_VALIDATED");
    }),

  /**
   * List volunteer entries (coordinator view).
   * Returns pending entries for validation.
   */
  list: authedQuery
    .input(
      z.object({
        validated: z.boolean().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }).optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listVolunteerEntries({
          validated: input?.validated,
        });
      }, "INTERNAL_ERROR");
    }),

  /**
   * Get coordinator validation stats.
   */
  stats: authedQuery.query(async () => {
    return safeOperation(async () => {
      return getCoordinatorStats();
    }, "INTERNAL_ERROR");
  }),

  /**
   * Admin: List all volunteer entries (paginated).
   */
  adminList: adminQuery
    .input(
      z
        .object({
          profileId: z.number().int().positive().optional(),
          opportunityId: z.number().int().positive().optional(),
          validated: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listVolunteerEntries({
          profileId: input?.profileId,
          opportunityId: input?.opportunityId,
          validated: input?.validated,
        });
      }, "INTERNAL_ERROR");
    }),
});
