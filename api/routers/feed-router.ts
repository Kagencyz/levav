/**
 * ============================================================
 * FEED ROUTER — Social Feed
 * ============================================================
 * tRPC endpoints for community posts, likes, and comments.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { getDb } from "../queries/connection";
import { eq, desc, sql, and } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

export const feedRouter = createRouter({
  /* ─── List Feed Posts (public) ─── */
  list: publicQuery
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
      }).optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const posts = await db()
          .select()
          .from(schema.posts)
          .orderBy(desc(schema.posts.createdAt))
          .limit(input?.limit ?? 20)
          .offset(input?.offset ?? 0);

        /* Get profile names for each post */
        const postsWithProfiles = await Promise.all(
          posts.map(async (post) => {
            const profile = await db()
              .select({
                name: schema.levavProfiles.displayName,
                avatar: schema.levavProfiles.avatarUrl,
                profession: schema.levavProfiles.professionTitle,
              })
              .from(schema.levavProfiles)
              .where(eq(schema.levavProfiles.id, post.profileId))
              .limit(1);

            return {
              ...post,
              profileName: profile[0]?.name ?? "Anonymous",
              profileAvatar: profile[0]?.avatar,
              profession: profile[0]?.profession,
            };
          }),
        );

        return postsWithProfiles;
      }, "INTERNAL_ERROR");
    }),

  /* ─── Create Post ─── */
  create: authedQuery
    .input(
      z.object({
        content: z.string().min(1).max(2000),
        postType: z.enum(["achievement", "milestone", "update", "peer_endorsement", "course_complete"]).default("update"),
        relatedEntityId: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const result = await db()
          .insert(schema.posts)
          .values({
            profileId: profile.id,
            content: input.content,
            postType: input.postType,
            relatedEntityId: input.relatedEntityId ?? null,
          })
          .$returningId();

        return { postId: result[0].id, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Like / Unlike Post ─── */
  toggleLike: authedQuery
    .input(z.object({ postId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const existing = await db()
          .select()
          .from(schema.postLikes)
          .where(
            and(
              eq(schema.postLikes.postId, input.postId),
              eq(schema.postLikes.profileId, profile.id),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          /* Unlike: remove like record */
          await db()
            .delete(schema.postLikes)
            .where(eq(schema.postLikes.id, existing[0].id));

          /* Decrement like count */
          await db()
            .update(schema.posts)
            .set({ likeCount: sql`${schema.posts.likeCount} - 1` })
            .where(eq(schema.posts.id, input.postId));

          return { liked: false, success: true };
        } else {
          /* Like: add like record */
          await db()
            .insert(schema.postLikes)
            .values({
              postId: input.postId,
              profileId: profile.id,
            });

          /* Increment like count */
          await db()
            .update(schema.posts)
            .set({ likeCount: sql`${schema.posts.likeCount} + 1` })
            .where(eq(schema.posts.id, input.postId));

          return { liked: true, success: true };
        }
      }, "INTERNAL_ERROR");
    }),

  /* ─── Add Comment ─── */
  comment: authedQuery
    .input(
      z.object({
        postId: z.number().int().positive(),
        content: z.string().min(1).max(1000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const result = await db()
          .insert(schema.comments)
          .values({
            postId: input.postId,
            profileId: profile.id,
            content: input.content,
          })
          .$returningId();

        /* Increment comment count */
        await db()
          .update(schema.posts)
          .set({ commentCount: sql`${schema.posts.commentCount} + 1` })
          .where(eq(schema.posts.id, input.postId));

        return { commentId: result[0].id, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Get Comments for a Post ─── */
  comments: publicQuery
    .input(z.object({ postId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const commentsList = await db()
          .select()
          .from(schema.comments)
          .where(eq(schema.comments.postId, input.postId))
          .orderBy(desc(schema.comments.createdAt));

        /* Get profile info for each comment */
        const commentsWithProfiles = await Promise.all(
          commentsList.map(async (comment) => {
            const profile = await db()
              .select({
                name: schema.levavProfiles.displayName,
                avatar: schema.levavProfiles.avatarUrl,
              })
              .from(schema.levavProfiles)
              .where(eq(schema.levavProfiles.id, comment.profileId))
              .limit(1);

            return {
              ...comment,
              profileName: profile[0]?.name ?? "Anonymous",
              profileAvatar: profile[0]?.avatar,
            };
          }),
        );

        return commentsWithProfiles;
      }, "INTERNAL_ERROR");
    }),
});
