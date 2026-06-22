/**
 * ============================================================
 * ANALYTICS ROUTER — Platform Metrics Dashboard
 * ============================================================
 * tRPC endpoints for admin analytics. Aggregates data from
 * existing tables for charts and KPIs.
 * ============================================================
 */

import { createRouter, adminQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { getDb } from "../queries/connection";
import { sql, desc, eq, gte } from "drizzle-orm";
import * as schema from "@db/schema";
import { z } from "zod";

const db = getDb;

export const analyticsRouter = createRouter({
  /* ─── Public: Platform Overview KPIs ─── */
  overview: publicQuery.query(async () => {
    return safeOperation(async () => {
      /* Total talent profiles */
      const profilesResult = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.levavProfiles);

      /* Total users */
      const usersResult = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.users);

      /* Total courses */
      const coursesResult = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.creatorStudioCourses)
        .where(eq(schema.creatorStudioCourses.isPublished, true));

      /* Total job postings */
      const jobsResult = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.jobPostings);

      /* Total applications */
      const applicationsResult = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.jobApplications);

      /* WRI score distribution */
      const wriDistribution = await db()
        .select({
          tier: schema.wriAnalytics.goldKeyTier,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.wriAnalytics)
        .groupBy(schema.wriAnalytics.goldKeyTier);

      /* Recent enrollments (last 7 days) */
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentEnrollments = await db()
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.courseEnrollments)
        .where(gte(schema.courseEnrollments.enrolledAt, sevenDaysAgo));

      return {
        totalUsers: usersResult[0]?.count ?? 0,
        totalProfiles: profilesResult[0]?.count ?? 0,
        totalCourses: coursesResult[0]?.count ?? 0,
        totalJobs: jobsResult[0]?.count ?? 0,
        totalApplications: applicationsResult[0]?.count ?? 0,
        recentEnrollments: recentEnrollments[0]?.count ?? 0,
        wriDistribution: wriDistribution,
      };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Admin: Weekly Activity Data (for charts) ─── */
  weeklyActivity: adminQuery.query(async () => {
    return safeOperation(async () => {
      /* Signups per day for last 7 days */
      const signups = await db()
        .select({
          date: sql<string>`DATE(created_at)`,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.users)
        .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
        .groupBy(sql`DATE(created_at)`)
        .orderBy(sql`DATE(created_at)`);

      /* Applications per day */
      const applications = await db()
        .select({
          date: sql<string>`DATE(applied_at)`,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.jobApplications)
        .where(sql`applied_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
        .groupBy(sql`DATE(applied_at)`)
        .orderBy(sql`DATE(applied_at)`);

      /* WRI updates per day */
      const wriUpdates = await db()
        .select({
          date: sql<string>`DATE(created_at)`,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.wriAnalytics)
        .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
        .groupBy(sql`DATE(created_at)`)
        .orderBy(sql`DATE(created_at)`);

      return { signups, applications, wriUpdates };
    }, "INTERNAL_ERROR");
  }),

  /* ─── Admin: Top Performing Content ─── */
  topContent: adminQuery.query(async () => {
    return safeOperation(async () => {
      /* Top courses by enrollment */
      const topCourses = await db()
        .select({
          id: schema.creatorStudioCourses.id,
          title: schema.creatorStudioCourses.title,
          enrollments: schema.creatorStudioCourses.totalEnrollments,
          rating: schema.creatorStudioCourses.averageRating,
        })
        .from(schema.creatorStudioCourses)
        .orderBy(desc(schema.creatorStudioCourses.totalEnrollments))
        .limit(5);

      /* Top professions by talent count */
      const professionCounts = await db()
        .select({
          profession: schema.levavProfiles.professionTitle,
          count: sql<number>`COUNT(*)`,
        })
        .from(schema.levavProfiles)
        .groupBy(schema.levavProfiles.professionTitle)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(5);

      return { topCourses, professionCounts };
    }, "INTERNAL_ERROR");
  }),
});
