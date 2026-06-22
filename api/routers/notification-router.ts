/**
 * ============================================================
 * NOTIFICATION ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * User notification center — read, mark as read, list.
 * ============================================================
 */

import { createRouter, authedQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  countUnreadNotifications,
} from "../queries/notifications";
import { MarkNotificationReadSchema, ListNotificationsSchema } from "@contracts/schemas";

export const notificationRouter = createRouter({
  /**
   * List notifications for the current user.
   */
  list: authedQuery
    .input(ListNotificationsSchema.optional())
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        return listNotifications({
          recipientId: ctx.user.id,
          unreadOnly: input?.unreadOnly,
          limit: input?.limit ?? 20,
        });
      }, "INTERNAL_ERROR");
    }),

  /**
   * Count unread notifications.
   */
  unreadCount: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const count = await countUnreadNotifications(ctx.user.id);
      return { count };
    }, "INTERNAL_ERROR");
  }),

  /**
   * Mark a single notification as read.
   */
  markRead: authedQuery
    .input(MarkNotificationReadSchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await markNotificationRead(input.notificationId);
        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /**
   * Mark all notifications as read.
   */
  markAllRead: authedQuery.mutation(async ({ ctx }) => {
    return safeOperation(async () => {
      await markAllNotificationsRead(ctx.user.id);
      return { success: true };
    }, "INTERNAL_ERROR");
  }),
});
