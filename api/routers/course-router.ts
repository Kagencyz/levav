/**
 * ============================================================
 * COURSE ROUTER (Creator Studio)
 * ============================================================
 * tRPC endpoints for course management, enrollment, and progress.
 * Protected by: authedQuery (creators for CRUD, any for viewing)
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import {
  listCourses,
  findCourseById,
  createCourse,
  updateCourse,
  getCreatorStats,
  listLessons,
  createEnrollment,
  listEnrollments,
  upsertProgress,
} from "../queries/courses";

export const courseRouter = createRouter({
  /* ─── Public: List Published Courses ─── */
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        tier: z.string().optional(),
        limit: z.number().int().min(1).max(50).default(20),
        offset: z.number().int().min(0).default(0),
      }).optional(),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listCourses({
          category: input?.category,
          tier: input?.tier,
          isPublished: true,
          limit: input?.limit,
          offset: input?.offset,
        });
      }, "INTERNAL_ERROR");
    }),

  /* ─── Public: Get Course Detail ─── */
  byId: publicQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const course = await findCourseById(input.id);
        if (!course) throw new Error("Course not found");
        return course;
      }, "INTERNAL_ERROR");
    }),

  /* ─── Creator: List My Courses ─── */
  myCourses: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      return listCourses({ creatorId: profile.id });
    }, "INTERNAL_ERROR");
  }),

  /* ─── Creator: Create Course ─── */
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(500),
        description: z.string().max(3000).optional(),
        category: z.string().max(255).optional(),
        tier: z.enum(["free", "subscription", "paid"]).default("free"),
        priceZmw: z.number().nonnegative().optional(),
        coverImageUrl: z.string().url().optional().or(z.literal("")),
        language: z.string().max(50).default("English"),
        targetAudience: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const courseId = await createCourse({
          creatorId: profile.id,
          ...input,
          isPublished: false,
          totalEnrollments: 0,
          averageRating: "0.00",
        });
        return { courseId, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Creator: Update Course ─── */
  update: authedQuery
    .input(
      z.object({
        courseId: z.number().int().positive(),
        title: z.string().min(1).max(500).optional(),
        description: z.string().max(3000).optional(),
        category: z.string().max(255).optional(),
        tier: z.enum(["free", "subscription", "paid"]).optional(),
        priceZmw: z.number().nonnegative().optional(),
        isPublished: z.boolean().optional(),
        coverImageUrl: z.string().url().optional().or(z.literal("")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const { courseId, ...data } = input;
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const updated = await updateCourse(courseId, data);
        return { course: updated, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── Creator: Dashboard Stats ─── */
  creatorStats: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) {
        return {
          totalCourses: 0,
          totalEnrollments: 0,
          avgRating: "0.00",
          totalRevenue: 0,
        };
      }

      return getCreatorStats(profile.id);
    }, "INTERNAL_ERROR");
  }),

  /* ─── Lessons for a Course ─── */
  lessons: publicQuery
    .input(z.object({ courseId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listLessons(input.courseId);
      }, "INTERNAL_ERROR");
    }),

  /* ─── Enroll in a Course ─── */
  enroll: authedQuery
    .input(z.object({ courseId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        const enrollmentId = await createEnrollment({
          profileId: profile.id,
          courseId: input.courseId,
          status: "active",
        });
        return { enrollmentId, success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── My Enrollments ─── */
  myEnrollments: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      return listEnrollments({ profileId: profile.id });
    }, "INTERNAL_ERROR");
  }),

  /* ─── Update Lesson Progress ─── */
  updateProgress: authedQuery
    .input(
      z.object({
        enrollmentId: z.number().int().positive(),
        lessonId: z.number().int().positive(),
        completed: z.boolean(),
        progressPercent: z.number().int().min(0).max(100),
        timeSpentSeconds: z.number().int().min(0),
      }),
    )
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await upsertProgress({
          enrollmentId: input.enrollmentId,
          lessonId: input.lessonId,
          completed: input.completed,
          progressPercent: input.progressPercent,
          timeSpentSeconds: input.timeSpentSeconds,
          completedAt: input.completed ? new Date() : null,
        });
        return { success: true };
      }, "INTERNAL_ERROR");
    }),
});
