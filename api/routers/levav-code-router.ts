/**
 * ============================================================
 * LEVAV CODE ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * Handles The Levav Code covenant acceptance.
 * Unskippable during onboarding — all 8 pillars must be true.
 * ============================================================
 */

import { createRouter, authedQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  findProfileByUserId,
  findLevavCodeAcceptance,
  recordLevavCodeAcceptance,
} from "../queries/levav-profiles";
import { AcceptLevavCodeSchema } from "@contracts/schemas";

export const levavCodeRouter = createRouter({
  /**
   * Check if the current user has accepted The Levav Code.
   */
  status: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) throwLevavError("PROFILE_NOT_FOUND");

      const acceptance = await findLevavCodeAcceptance(profile.id);
      return {
        accepted: !!acceptance,
        acceptedAt: acceptance?.acceptedAt ?? null,
        pillars: acceptance
          ? {
              ownership: acceptance.ownershipAccepted,
              excellence: acceptance.excellenceAccepted,
              reliability: acceptance.reliabilityAccepted,
              initiative: acceptance.initiativeAccepted,
              growth: acceptance.growthAccepted,
              criticalThinking: acceptance.criticalThinkingAccepted,
              service: acceptance.serviceAccepted,
              impact: acceptance.impactAccepted,
            }
          : null,
      };
    }, "PROFILE_NOT_FOUND");
  }),

  /**
   * Accept The Levav Code — all 8 pillars required.
   * This is a covenant; all values must be explicitly true.
   */
  accept: authedQuery
    .input(AcceptLevavCodeSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        // Verify profile matches the authenticated user
        if (profile.id !== input.profileId) {
          throwLevavError("UNAUTHORIZED_ACTION", "Profile mismatch.");
        }

        // Check if already accepted
        const existing = await findLevavCodeAcceptance(profile.id);
        if (existing) {
          return { accepted: true, alreadyAccepted: true, acceptedAt: existing.acceptedAt };
        }

        // Record acceptance with all 8 pillars
        await recordLevavCodeAcceptance({
          profileId: profile.id,
          ownershipAccepted: input.ownership,
          excellenceAccepted: input.excellence,
          reliabilityAccepted: input.reliability,
          initiativeAccepted: input.initiative,
          growthAccepted: input.growth,
          criticalThinkingAccepted: input.criticalThinking,
          serviceAccepted: input.service,
          impactAccepted: input.impact,
          ipAddress: input.ipAddress ?? null,
          userAgent: input.userAgent ?? null,
        });

        return {
          accepted: true,
          alreadyAccepted: false,
          acceptedAt: new Date(),
        };
      }, "PROFILE_NOT_FOUND");
    }),
});
