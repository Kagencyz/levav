/**
 * ============================================================
 * WRI ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * Workforce Readiness Index endpoints.
 * Read-only for talent; full access for employers and admins.
 * ============================================================
 */

import { createRouter, authedQuery, publicQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  findWriByProfile, listComponentScoresByProfile, getWriLeaderboard,
  getComponentScoreTrends,
} from "../queries/wri";
import { findProfileByUserId, findProfileByLevavCode } from "../queries/levav-profiles";
import { WriHistoryQuerySchema, WriLeaderboardSchema, ProfileByLevavCodeSchema } from "@contracts/schemas";
import { recalculateWri } from "../services/wri-calculator";

export const wriRouter = createRouter({
  /**
   * Get the current user's WRI analytics.
   */
  me: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) throwLevavError("PROFILE_NOT_FOUND");

      const wri = await findWriByProfile(profile.id);
      if (!wri) throwLevavError("WRI_NOT_FOUND");

      return wri;
    }, "WRI_NOT_FOUND");
  }),

  /**
   * Get WRI by Levav Code (public portfolio view).
   */
  byLevavCode: publicQuery
    .input(ProfileByLevavCodeSchema)
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByLevavCode(input.levavCode);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const wri = await findWriByProfile(profile.id);
        if (!wri) throwLevavError("WRI_NOT_FOUND");

        return wri;
      }, "WRI_NOT_FOUND");
    }),

  /**
   * Get WRI component score history (audit trail).
   */
  history: authedQuery
    .input(WriHistoryQuerySchema)
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        return listComponentScoresByProfile(profile.id, {
          componentType: input.componentType,
          limit: input.limit,
        });
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * WRI Leaderboard — top talent by score.
   */
  leaderboard: publicQuery
    .input(WriLeaderboardSchema.optional())
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return getWriLeaderboard({
          limit: input?.limit ?? 20,
          minScore: input?.minScore,
          goldKeyTier: input?.goldKeyTier,
        });
      }, "INTERNAL_ERROR");
    }),

  /**
   * Force WRI recalculation (useful for testing/debugging).
   * Only the profile owner can trigger this.
   */
  recalculate: authedQuery.mutation(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) throwLevavError("PROFILE_NOT_FOUND");

      const result = await recalculateWri(profile.id);
      return result;
    }, "INTERNAL_ERROR");
  }),

  /**
   * Get component score trends grouped by component type.
   */
  trends: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return {};

      return getComponentScoreTrends(profile.id);
    }, "INTERNAL_ERROR");
  }),
});
