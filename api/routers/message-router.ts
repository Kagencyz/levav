/**
 * ============================================================
 * MESSAGE ROUTER — Direct Messaging
 * ============================================================
 * tRPC endpoints for real-time chat between users.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import {
  listConversationsForUser,
  getConversationParticipants,
  sendMessage,
  listMessages,
  markMessagesAsRead,
  getUnreadCount,
} from "../queries/messages";

export const messageRouter = createRouter({
  /* ─── List my conversations ─── */
  conversations: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const convs = await listConversationsForUser(ctx.user.id);
      return convs;
    }, "INTERNAL_ERROR");
  }),

  /* ─── List messages in a conversation ─── */
  list: authedQuery
    .input(z.object({ conversationId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        /* Verify user is a participant */
        const participants = await getConversationParticipants(input.conversationId);
        if (!participants.some((p) => p.userId === ctx.user.id)) {
          throw new Error("Not a participant");
        }
        return listMessages(input.conversationId, 50);
      }, "UNAUTHORIZED");
    }),

  /* ─── Send a message ─── */
  send: authedQuery
    .input(
      z.object({
        conversationId: z.number().int().positive(),
        content: z.string().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        /* Verify user is a participant */
        const participants = await getConversationParticipants(input.conversationId);
        if (!participants.some((p) => p.userId === ctx.user.id)) {
          throw new Error("Not a participant");
        }

        const messageId = await sendMessage({
          conversationId: input.conversationId,
          senderId: ctx.user.id,
          content: input.content,
          isRead: false,
        });
        return { messageId, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Mark messages as read ─── */
  markRead: authedQuery
    .input(z.object({ conversationId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        await markMessagesAsRead(input.conversationId, ctx.user.id);
        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Get unread count ─── */
  unreadCount: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const count = await getUnreadCount(ctx.user.id);
      return { count };
    }, "INTERNAL_ERROR");
  }),
});
