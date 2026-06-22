/**
 * ============================================================
 * MESSAGES QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for direct messaging.
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertConversation, InsertMessage, InsertConversationParticipant } from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── CONVERSATIONS ─── */

export async function findOrCreateConversation(userId1: number, userId2: number, jobId?: number) {
  const existing = await db()
    .select({ cp: schema.conversationParticipants, conv: schema.conversations })
    .from(schema.conversationParticipants)
    .innerJoin(
      schema.conversationParticipants,
      eq(schema.conversationParticipants.conversationId, schema.conversationParticipants.conversationId)
    )
    .innerJoin(schema.conversations, eq(schema.conversations.id, schema.conversationParticipants.conversationId))
    .where(
      and(
        eq(schema.conversationParticipants.userId, userId1),
        eq(schema.conversationParticipants.userId, userId2),
        jobId ? eq(schema.conversations.jobId, jobId) : undefined
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return existing[0].conv.id;
  }

  /* Create new conversation */
  const convResult = await db()
    .insert(schema.conversations)
    .values({ jobId: jobId ?? null })
    .$returningId();
  const convId = convResult[0].id;

  /* Add both participants */
  await db().insert(schema.conversationParticipants).values([
    { conversationId: convId, userId: userId1 },
    { conversationId: convId, userId: userId2 },
  ]);

  return convId;
}

export async function listConversationsForUser(userId: number) {
  const participantRows = await db()
    .select()
    .from(schema.conversationParticipants)
    .where(eq(schema.conversationParticipants.userId, userId));

  const convIds = participantRows.map((p) => p.conversationId);
  if (convIds.length === 0) return [];

  const conversations = await db()
    .select()
    .from(schema.conversations)
    .orderBy(desc(schema.conversations.updatedAt));

  return conversations.filter((c) => convIds.includes(c.id));
}

export async function getConversationParticipants(conversationId: number) {
  return db()
    .select()
    .from(schema.conversationParticipants)
    .where(eq(schema.conversationParticipants.conversationId, conversationId));
}

/* ─── MESSAGES ─── */

export async function sendMessage(data: InsertMessage) {
  const result = await db()
    .insert(schema.messages)
    .values(data)
    .$returningId();

  /* Update conversation timestamp */
  await db()
    .update(schema.conversations)
    .set({ updatedAt: new Date() })
    .where(eq(schema.conversations.id, data.conversationId));

  return result[0].id;
}

export async function listMessages(conversationId: number, limit: number = 50, offset: number = 0) {
  return db()
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.conversationId, conversationId))
    .orderBy(desc(schema.messages.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function markMessagesAsRead(conversationId: number, userId: number) {
  await db()
    .update(schema.messages)
    .set({ isRead: true })
    .where(
      and(
        eq(schema.messages.conversationId, conversationId),
        sql`${schema.messages.senderId} != ${userId}`,
      ),
    );

  /* Update participant last read */
  await db()
    .update(schema.conversationParticipants)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(schema.conversationParticipants.conversationId, conversationId),
        eq(schema.conversationParticipants.userId, userId),
      ),
    );
}

export async function getUnreadCount(userId: number): Promise<number> {
  /* Get all conversations the user is in */
  const participantRows = await db()
    .select()
    .from(schema.conversationParticipants)
    .where(eq(schema.conversationParticipants.userId, userId));

  const convIds = participantRows.map((p) => p.conversationId);
  if (convIds.length === 0) return 0;

  /* Count unread messages in those conversations */
  const result = await db()
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.messages)
    .where(
      and(
        sql`${schema.messages.conversationId} IN (${convIds.join(",")})`,
        sql`${schema.messages.senderId} != ${userId}`,
        eq(schema.messages.isRead, false),
      ),
    );

  return result[0]?.count ?? 0;
}
