/**
 * ============================================================
 * REFERRAL ROUTER — Invite Friends & Earn
 * ============================================================
 * tRPC endpoints for generating referral codes, tracking
 * signups, and processing rewards.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { getDb } from "../queries/connection";
import { eq, desc, sql, count } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

function generateReferralCode(profileId: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LV${profileId}${code}`;
}

export const referralRouter = createRouter({
  /* ─── Get or create my referral code ─── */
  myCode: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return null;

      /* Check for existing code */
      const existing = await db()
        .select()
        .from(schema.referrals)
        .where(eq(schema.referrals.referrerProfileId, profile.id))
        .limit(1);

      if (existing[0]) {
        return { code: existing[0].referralCode, reward: existing[0].rewardAmountZmw };
      }

      /* Generate new code */
      const code = generateReferralCode(profile.id);
      await db()
        .insert(schema.referrals)
        .values({
          referrerProfileId: profile.id,
          referralCode: code,
          status: "pending",
        })
        .$returningId();

      return { code, reward: "5.00" };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Track referral signup (called on registration) ─── */
  trackSignup: publicQuery
    .input(z.object({ referralCode: z.string().min(6).max(20) }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        /* Find the referral record */
        const ref = await db()
          .select()
          .from(schema.referrals)
          .where(eq(schema.referrals.referralCode, input.referralCode))
          .limit(1);

        if (!ref[0]) throw new Error("Invalid referral code");

        await db()
          .update(schema.referrals)
          .set({ status: "signed_up" })
          .where(eq(schema.referrals.id, ref[0].id));

        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Complete referral + reward (when referred user completes onboarding) ─── */
  complete: authedQuery
    .input(z.object({ referralCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        /* Find referral by code */
        const ref = await db()
          .select()
          .from(schema.referrals)
          .where(eq(schema.referrals.referralCode, input.referralCode))
          .limit(1);

        if (!ref[0]) throw new Error("Invalid referral code");
        if (ref[0].referrerProfileId === profile.id) throw new Error("Cannot refer yourself");

        /* Update referral */
        await db()
          .update(schema.referrals)
          .set({
            referredProfileId: profile.id,
            status: "completed",
          })
          .where(eq(schema.referrals.id, ref[0].id));

        /* Credit referrer wallet */
        await db()
          .update(schema.levavProfiles)
          .set({
            balanceZmw: sql`${schema.levavProfiles.balanceZmw} + ${ref[0].rewardAmountZmw}`,
          })
          .where(eq(schema.levavProfiles.id, ref[0].referrerProfileId));

        return { success: true, reward: ref[0].rewardAmountZmw };
      }, "INTERNAL_ERROR");
    }),

  /* ─── My referral stats ─── */
  stats: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return { totalReferrals: 0, completed: 0, earned: "0.00", code: "" };

      const myReferrals = await db()
        .select()
        .from(schema.referrals)
        .where(eq(schema.referrals.referrerProfileId, profile.id));

      const completed = myReferrals.filter((r) => r.status === "completed" || r.status === "rewarded");
      const totalEarned = completed.reduce((sum, r) => sum + Number(r.rewardAmountZmw), 0);

      return {
        totalReferrals: myReferrals.length,
        completed: completed.length,
        earned: totalEarned.toFixed(2),
        code: myReferrals[0]?.referralCode ?? "",
      };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Leaderboard: Top referrers ─── */
  leaderboard: publicQuery.query(async () => {
    return safeOperation(async () => {
      const topReferrers = await db()
        .select({
          referrerId: schema.referrals.referrerProfileId,
          totalReferrals: sql<number>`COUNT(*)`,
          totalEarned: sql<string>`COALESCE(SUM(${schema.referrals.rewardAmountZmw}), '0.00')`,
        })
        .from(schema.referrals)
        .where(eq(schema.referrals.status, "completed"))
        .groupBy(schema.referrals.referrerProfileId)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10);

      /* Get profile names */
      const withNames = await Promise.all(
        topReferrers.map(async (ref) => {
          const profile = await db()
            .select({
              name: schema.levavProfiles.displayName,
              avatar: schema.levavProfiles.avatarUrl,
            })
            .from(schema.levavProfiles)
            .where(eq(schema.levavProfiles.id, ref.referrerId))
            .limit(1);

          return {
            ...ref,
            profileName: profile[0]?.name ?? "Anonymous",
            profileAvatar: profile[0]?.avatar,
          };
        }),
      );

      return withNames;
    }, "INTERNAL_ERROR");
  }),
});
