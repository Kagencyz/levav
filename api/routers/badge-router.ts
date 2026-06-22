/**
 * ============================================================
 * BADGE ROUTER — Achievement & Gamification
 * ============================================================
 * tRPC endpoints for badge management.
 *   - listBadges: All active badge definitions
 *   - myBadges: Current user's earned badges
 *   - checkEligibility: Check if user qualifies for new badges
 * ============================================================
 */

import { createRouter, publicQuery, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { getDb } from "../queries/connection";
import { achievementBadges, userBadges } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { findProfileByUserId } from "../queries/levav-profiles";
import { findWriByProfile } from "../queries/wri";

export const badgeRouter = createRouter({
  /* ─── Public: List all active badges ─── */
  list: publicQuery.query(async () => {
    return safeOperation(async () => {
      return getDb()
        .select()
        .from(achievementBadges)
        .where(eq(achievementBadges.isActive, true))
        .orderBy(desc(achievementBadges.pointsAwarded));
    }, "INTERNAL_ERROR");
  }),

  /* ─── Auth: Get my earned badges ─── */
  myBadges: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const db = getDb();
      const myBadges = await db
        .select({
          id: userBadges.id,
          awardedAt: userBadges.awardedAt,
          awardedBy: userBadges.awardedBy,
          contextData: userBadges.contextData,
          badgeSlug: achievementBadges.slug,
          badgeName: achievementBadges.name,
          badgeDescription: achievementBadges.description,
          badgeCategory: achievementBadges.category,
          badgeTier: achievementBadges.tier,
          badgePoints: achievementBadges.pointsAwarded,
        })
        .from(userBadges)
        .innerJoin(achievementBadges, eq(userBadges.badgeId, achievementBadges.id))
        .where(eq(userBadges.userId, ctx.user.id))
        .orderBy(desc(userBadges.awardedAt));

      return myBadges;
    }, "INTERNAL_ERROR");
  }),

  /* ─── Auth: Check badge eligibility ─── */
  checkEligibility: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return { eligible: [], totalPoints: 0 };

      const wri = await findWriByProfile(profile.id);
      const wriScore = wri ? parseFloat(wri.wriScore) : 0;

      const db = getDb();
      const allBadges = await db
        .select()
        .from(achievementBadges)
        .where(eq(achievementBadges.isActive, true));

      const myBadgeIds = (await db
        .select({ badgeId: userBadges.badgeId })
        .from(userBadges)
        .where(eq(userBadges.userId, ctx.user.id)))
        .map((b) => b.badgeId);

      const eligible = allBadges.filter((badge) => {
        if (myBadgeIds.includes(badge.id)) return false;

        switch (badge.conditionType) {
          case "wri_score_reached":
            return wriScore >= parseFloat(badge.conditionValue ?? "0");
          case "wri_tier_reached":
            return (wri?.goldKeyTier ?? "bronze") === (badge.conditionValue ?? "bronze");
          default:
            return false;
        }
      });

      const totalPoints = eligible.reduce((sum, b) => sum + b.pointsAwarded, 0);

      return { eligible, totalPoints };
    }, "INTERNAL_ERROR");
  }),
});
