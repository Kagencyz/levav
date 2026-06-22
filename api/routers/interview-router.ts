/**
 * ============================================================
 * INTERVIEW ROUTER — Interview Scheduling
 * ============================================================
 * tRPC endpoints for scheduling, confirming, and managing
 * employer-talent interviews.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { getDb } from "../queries/connection";
import { eq, desc, and, gte } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

export const interviewRouter = createRouter({
  /* ─── Schedule an interview (employer) ─── */
  schedule: authedQuery
    .input(
      z.object({
        applicationId: z.number().int().positive(),
        talentProfileId: z.number().int().positive(),
        scheduledAt: z.string().datetime(),
        durationMinutes: z.number().int().min(5).max(180).default(30),
        interviewType: z.enum(["video", "audio", "in_person"]).default("video"),
        meetingLink: z.string().url().optional().or(z.literal("")),
        employerNotes: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const result = await db()
          .insert(schema.interviews)
          .values({
            applicationId: input.applicationId,
            employerProfileId: profile.id,
            talentProfileId: input.talentProfileId,
            scheduledAt: new Date(input.scheduledAt),
            durationMinutes: input.durationMinutes,
            interviewType: input.interviewType,
            meetingLink: input.meetingLink || null,
            employerNotes: input.employerNotes || null,
            status: "scheduled",
          })
          .$returningId();

        return { interviewId: result[0].id, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── List my interviews (talent or employer) ─── */
  myInterviews: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      const asTalent = await db()
        .select()
        .from(schema.interviews)
        .where(eq(schema.interviews.talentProfileId, profile.id))
        .orderBy(desc(schema.interviews.scheduledAt));

      const asEmployer = await db()
        .select()
        .from(schema.interviews)
        .where(eq(schema.interviews.employerProfileId, profile.id))
        .orderBy(desc(schema.interviews.scheduledAt));

      /* Get profile names for each */
      const allInterviews = [...asTalent, ...asEmployer];
      const withProfiles = await Promise.all(
        allInterviews.map(async (interview) => {
          const otherId =
            interview.talentProfileId === profile.id
              ? interview.employerProfileId
              : interview.talentProfileId;
          const otherProfile = await db()
            .select({
              name: schema.levavProfiles.displayName,
            })
            .from(schema.levavProfiles)
            .where(eq(schema.levavProfiles.id, otherId))
            .limit(1);

          return {
            ...interview,
            otherPartyName: otherProfile[0]?.name ?? "Unknown",
            myRole: interview.talentProfileId === profile.id ? "talent" : "employer",
          };
        }),
      );

      return withProfiles;
    }, "INTERNAL_ERROR");
  }),

  /* ─── Upcoming interviews ─── */
  upcoming: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      return db()
        .select()
        .from(schema.interviews)
        .where(
          and(
            eq(schema.interviews.talentProfileId, profile.id),
            gte(schema.interviews.scheduledAt, new Date()),
          ),
        )
        .orderBy(schema.interviews.scheduledAt)
        .limit(5);
    }, "INTERNAL_ERROR");
  }),

  /* ─── Update interview status ─── */
  updateStatus: authedQuery
    .input(
      z.object({
        interviewId: z.number().int().positive(),
        status: z.enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"]),
        talentNotes: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const update: any = { status: input.status };
        if (input.talentNotes) update.talentNotes = input.talentNotes;

        await db()
          .update(schema.interviews)
          .set(update)
          .where(eq(schema.interviews.id, input.interviewId));

        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Cancel interview ─── */
  cancel: authedQuery
    .input(z.object({ interviewId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await db()
          .update(schema.interviews)
          .set({ status: "cancelled" })
          .where(eq(schema.interviews.id, input.interviewId));
        return { success: true };
      }, "INTERNAL_ERROR");
    }),
});
