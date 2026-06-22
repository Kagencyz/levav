/**
 * ============================================================
 * CREATOR STUDIO / COURSES QUERY FUNCTIONS
 * ============================================================
 * Type-safe Drizzle ORM queries for course management.
 * ============================================================
 */

import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import type {
  InsertCreatorStudioCourse,
  InsertCourseLesson,
  InsertCourseEnrollment,
  InsertCourseProgress,
} from "@db/schema";
import { getDb } from "./connection";

const db = getDb;

/* ─── COURSES ─── */

export async function listCourses(filters?: {
  creatorId?: number;
  category?: string;
  tier?: string;
  isPublished?: boolean;
  limit?: number;
  offset?: number;
}) {
  const conditions = [];
  if (filters?.creatorId) conditions.push(eq(schema.creatorStudioCourses.creatorId, filters.creatorId));
  if (filters?.category) conditions.push(eq(schema.creatorStudioCourses.category, filters.category));
  if (filters?.tier) conditions.push(eq(schema.creatorStudioCourses.tier, filters.tier as any));
  if (filters?.isPublished !== undefined)
    conditions.push(eq(schema.creatorStudioCourses.isPublished, filters.isPublished));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.creatorStudioCourses)
    .where(whereClause)
    .orderBy(desc(schema.creatorStudioCourses.createdAt))
    .limit(filters?.limit ?? 20)
    .offset(filters?.offset ?? 0);
}

export async function findCourseById(id: number) {
  return db()
    .query.creatorStudioCourses.findFirst({
      where: eq(schema.creatorStudioCourses.id, id),
    });
}

export async function createCourse(data: InsertCreatorStudioCourse) {
  const result = await db()
    .insert(schema.creatorStudioCourses)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

export async function updateCourse(courseId: number, data: Partial<InsertCreatorStudioCourse>) {
  await db()
    .update(schema.creatorStudioCourses)
    .set(data)
    .where(eq(schema.creatorStudioCourses.id, courseId));
  return findCourseById(courseId);
}

export async function incrementEnrollmentCount(courseId: number) {
  await db()
    .update(schema.creatorStudioCourses)
    .set({
      totalEnrollments: sql`${schema.creatorStudioCourses.totalEnrollments} + 1`,
    })
    .where(eq(schema.creatorStudioCourses.id, courseId));
}

export async function getCreatorStats(creatorId: number) {
  const coursesResult = await db()
    .select({
      totalCourses: sql<number>`COUNT(*)`,
      totalEnrollments: sql<number>`COALESCE(SUM(${schema.creatorStudioCourses.totalEnrollments}), 0)`,
      avgRating: sql<string>`COALESCE(AVG(${schema.creatorStudioCourses.averageRating}), '0.00')`,
    })
    .from(schema.creatorStudioCourses)
    .where(eq(schema.creatorStudioCourses.creatorId, creatorId));

  return coursesResult[0] ?? {
    totalCourses: 0,
    totalEnrollments: 0,
    avgRating: "0.00",
  };
}

/* ─── LESSONS ─── */

export async function listLessons(courseId: number) {
  return db()
    .select()
    .from(schema.courseLessons)
    .where(eq(schema.courseLessons.courseId, courseId))
    .orderBy(schema.courseLessons.sortOrder);
}

export async function createLesson(data: InsertCourseLesson) {
  const result = await db()
    .insert(schema.courseLessons)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

/* ─── ENROLLMENTS ─── */

export async function listEnrollments(filters?: {
  courseId?: number;
  profileId?: number;
}) {
  const conditions = [];
  if (filters?.courseId) conditions.push(eq(schema.courseEnrollments.courseId, filters.courseId));
  if (filters?.profileId) conditions.push(eq(schema.courseEnrollments.profileId, filters.profileId));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db()
    .select()
    .from(schema.courseEnrollments)
    .where(whereClause)
    .orderBy(desc(schema.courseEnrollments.enrolledAt));
}

export async function createEnrollment(data: InsertCourseEnrollment) {
  const result = await db()
    .insert(schema.courseEnrollments)
    .values(data)
    .$returningId();
  return result[0]?.id;
}

/* ─── PROGRESS ─── */

export async function findProgress(enrollmentId: number) {
  return db()
    .query.courseProgress.findFirst({
      where: eq(schema.courseProgress.enrollmentId, enrollmentId),
    });
}

export async function upsertProgress(data: InsertCourseProgress) {
  const existing = await findProgress(data.enrollmentId);
  if (existing) {
    await db()
      .update(schema.courseProgress)
      .set({
        completed: data.completed,
        completedAt: data.completedAt,
        progressPercent: data.progressPercent,
        timeSpentSeconds: data.timeSpentSeconds,
      })
      .where(eq(schema.courseProgress.enrollmentId, data.enrollmentId));
  } else {
    await db().insert(schema.courseProgress).values(data);
  }
}
