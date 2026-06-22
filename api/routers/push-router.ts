/**
 * ============================================================
 * PUSH NOTIFICATION ROUTER
 * ============================================================
 * tRPC endpoints for browser push notification subscriptions
 * and preference management.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { getDb } from "../queries/connection";
import { eq } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

export const pushRouter = createRouter({
  /* ─── Subscribe to push notifications ─── */
  subscribe: authedQuery
    .input(
      z.object({
        endpoint: z.string(),
        p256dh: z.string(),
        auth: z.string(),
        preferences: z.object({
          jobAlerts: z.boolean().default(true),
          messages: z.boolean().default(true),
          wriUpdates: z.boolean().default(true),
          courseUpdates: z.boolean().default(true),
          systemAnnouncements: z.boolean().default(false),
        }).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        /* Check if subscription already exists */
        const existing = await db()
          .select()
          .from(schema.pushSubscriptions)
          .where(eq(schema.pushSubscriptions.endpoint, input.endpoint))
          .limit(1);

        if (existing[0]) {
          /* Update existing */
          await db()
            .update(schema.pushSubscriptions)
            .set({
              userId: ctx.user.id,
              p256dh: input.p256dh,
              auth: input.auth,
              preferences: input.preferences ?? existing[0].preferences,
            })
            .where(eq(schema.pushSubscriptions.id, existing[0].id));

          return { updated: true, subscriptionId: existing[0].id };
        }

        /* Create new */
        const result = await db()
          .insert(schema.pushSubscriptions)
          .values({
            userId: ctx.user.id,
            endpoint: input.endpoint,
            p256dh: input.p256dh,
            auth: input.auth,
            preferences: input.preferences ?? {
              jobAlerts: true,
              messages: true,
              wriUpdates: true,
              courseUpdates: true,
              systemAnnouncements: false,
            },
          })
          .$returningId();

        return { subscriptionId: result[0].id, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Update preferences ─── */
  updatePreferences: authedQuery
    .input(
      z.object({
        jobAlerts: z.boolean().optional(),
        messages: z.boolean().optional(),
        wriUpdates: z.boolean().optional(),
        courseUpdates: z.boolean().optional(),
        systemAnnouncements: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const sub = await db()
          .select()
          .from(schema.pushSubscriptions)
          .where(eq(schema.pushSubscriptions.userId, ctx.user.id))
          .limit(1);

        if (!sub[0]) throw new Error("No subscription found");

        const prefs = (sub[0].preferences as any) ?? {};
        const updated = { ...prefs, ...input };

        await db()
          .update(schema.pushSubscriptions)
          .set({ preferences: updated })
          .where(eq(schema.pushSubscriptions.id, sub[0].id));

        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Get my preferences ─── */
  preferences: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const sub = await db()
        .select()
        .from(schema.pushSubscriptions)
        .where(eq(schema.pushSubscriptions.userId, ctx.user.id))
        .limit(1);

      if (!sub[0]) return null;

      return sub[0].preferences as {
        jobAlerts: boolean;
        messages: boolean;
        wriUpdates: boolean;
        courseUpdates: boolean;
        systemAnnouncements: boolean;
      };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Unsubscribe ─── */
  unsubscribe: authedQuery.mutation(async ({ ctx }) => {
    return safeOperation(async () => {
      await db()
        .delete(schema.pushSubscriptions)
        .where(eq(schema.pushSubscriptions.userId, ctx.user.id));
      return { success: true };
    }, "INTERNAL_ERROR");
  }),
});
