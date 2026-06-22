/**
 * ============================================================
 * CREATOR ROUTER — Content Creator Program
 * ============================================================
 * tRPC router for content creator applications and management.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";

export const creatorRouter = createRouter({
  /* ─── SUBMIT APPLICATION ─── */
  submit: publicQuery
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      city: z.string().optional(),
      profession: z.string().optional(),
      role: z.string().optional(),
      contentTypes: z.array(z.enum(["video", "audio", "article", "document"])),
      categories: z.array(z.string()),
      bio: z.string().min(30),
      sampleUrl: z.string().optional(),
      equipment: z.string(),
      postingFrequency: z.string(),
      monetizationInterest: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db().insert(schema.creatorApplications).values({
        ...input,
        status: "pending",
        totalContent: 0,
        totalViews: 0,
        totalEarnings: 0,
      }).$returningId();
      return { success: true, id: result[0].id };
    }),

  /* ─── LIST APPLICATIONS (admin) ─── */
  listApplications: adminQuery.query(async () => {
    const db = getDb();
    return db().select().from(schema.creatorApplications).orderBy(desc(schema.creatorApplications.appliedAt));
  }),

  /* ─── GET MY APPLICATION ─── */
  myApplication: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const apps = await db()
      .select()
      .from(schema.creatorApplications)
      .where(eq(schema.creatorApplications.email, ctx.user.email))
      .limit(1);
    return apps[0] ?? null;
  }),

  /* ─── REVIEW APPLICATION (admin) ─── */
  review: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["approved", "rejected"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db()
        .update(schema.creatorApplications)
        .set({ status: input.status, reviewedAt: new Date() })
        .where(eq(schema.creatorApplications.id, input.id));
      return { success: true };
    }),
});
