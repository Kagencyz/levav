/**
 * ============================================================
 * CHAMPIONS ROUTER — Levav Champions™ Program
 * ============================================================
 * tRPC router for the Champions mentorship program:
 * - Champion applications (submit, list, review)
 * - Champion profiles (read, update)
 * - Mentorship sessions (log, list)
 * - Content tracking for champions who also create
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { TRPCError } from "@trpc/server";

export const championsRouter = createRouter({
  /* ─── SUBMIT APPLICATION ─── */
  submit: publicQuery
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      city: z.string().min(1),
      profession: z.string().min(1),
      role: z.string().min(1),
      experience: z.string(),
      wriScore: z.number().min(0).max(100),
      goldKeyTier: z.string(),
      levavCode: z.string(),
      expertiseAreas: z.array(z.string()),
      mentorshipStyle: z.enum(["one-on-one", "group", "async"]),
      availability: z.string(),
      motivation: z.string().min(50),
      contentInterest: z.boolean(),
      linkedinUrl: z.string().optional(),
      portfolioUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db().insert(schema.championApplications).values({
        ...input,
        status: "pending",
        honorariumRate: 0,
        totalEarnings: 0,
        menteesCount: 0,
        sessionsCompleted: 0,
        contentPublished: 0,
      }).$returningId();
      return { success: true, id: result[0].id };
    }),

  /* ─── LIST ALL APPLICATIONS (admin) ─── */
  listApplications: adminQuery.query(async () => {
    const db = getDb();
    return db().select().from(schema.championApplications).orderBy(desc(schema.championApplications.appliedAt));
  }),

  /* ─── LIST APPROVED CHAMPIONS ─── */
  listChampions: publicQuery.query(async () => {
    const db = getDb();
    return db()
      .select()
      .from(schema.championApplications)
      .where(eq(schema.championApplications.status, "approved"))
      .orderBy(desc(schema.championApplications.wriScore));
  }),

  /* ─── GET MY APPLICATION ─── */
  myApplication: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const apps = await db()
      .select()
      .from(schema.championApplications)
      .where(eq(schema.championApplications.email, ctx.user.email))
      .limit(1);
    return apps[0] ?? null;
  }),

  /* ─── REVIEW APPLICATION (admin) ─── */
  review: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["approved", "rejected"]),
      honorariumRate: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const updates: any = { status: input.status, reviewedAt: new Date() };
      if (input.honorariumRate !== undefined) updates.honorariumRate = input.honorariumRate;
      await db().update(schema.championApplications).set(updates).where(eq(schema.championApplications.id, input.id));
      return { success: true };
    }),

  /* ─── UPDATE CHAMPION STATS ─── */
  updateStats: authedQuery
    .input(z.object({
      sessionsCompleted: z.number().optional(),
      menteesCount: z.number().optional(),
      contentPublished: z.number().optional(),
      totalEarnings: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db()
        .update(schema.championApplications)
        .set(input)
        .where(eq(schema.championApplications.email, ctx.user.email));
      return { success: true };
    }),
});
