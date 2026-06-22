/**
 * ============================================================
 * NOTIFICATIONS QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for the notification system.
 * ============================================================
 */

import { eq, and, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertNotification } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

export async function listNotifications(filters: {
  recipientId: number;
  unreadOnly?: boolean;
  limit?: number;
}) {
  const conditions = [eq(schema.notifications.recipientId, filters.recipientId)];
  if (filters.unreadOnly) {
    conditions.push(eq(schema.notifications.isRead, false));
  }

  return db()
    .select()
    .from(schema.notifications)
    .where(and(...conditions))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(filters.limit ?? 20);
}

export async function createNotification(data: InsertNotification) {
  const result = await db()
    .insert(schema.notifications)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function markNotificationRead(notificationId: number) {
  await db()
    .update(schema.notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(schema.notifications.id, notificationId));
}

export async function markAllNotificationsRead(recipientId: number) {
  await db()
    .update(schema.notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(schema.notifications.recipientId, recipientId),
        eq(schema.notifications.isRead, false),
      ),
    );
}

export async function countUnreadNotifications(recipientId: number): Promise<number> {
  const result = await db()
    .select({ count: schema.notifications.id })
    .from(schema.notifications)
    .where(
      and(
        eq(schema.notifications.recipientId, recipientId),
        eq(schema.notifications.isRead, false),
      ),
    );
  return result.length;
}
