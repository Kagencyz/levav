/**
 * ============================================================
 * SEARCH ROUTER — Unified Full-Text Search
 * ============================================================
 * Searches across jobs, courses, quickwork shifts, and
 * impact opportunities in a single query.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { getDb } from "../queries/connection";
import { jobPostings, creatorStudioCourses, quickworkShifts, impactOpportunities } from "@db/schema";
import { like, or, and, eq, desc } from "drizzle-orm";

export const searchRouter = createRouter({
  /* ─── Unified Search ─── */
  unified: publicQuery
    .input(
      z.object({
        q: z.string().min(1).max(200),
        type: z.enum(["all", "jobs", "courses", "shifts", "opportunities"]).default("all"),
        city: z.string().optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const db = getDb();
        const searchTerm = `%${input.q}%`;
        const results: Array<{
          id: number;
          type: string;
          title: string;
          description: string | null;
          city: string | null;
          badge: string;
          meta: Record<string, unknown>;
        }> = [];

        /* Search Jobs */
        if (input.type === "all" || input.type === "jobs") {
          const jobs = await db
            .select()
            .from(jobPostings)
            .where(
              and(
                eq(jobPostings.status, "published"),
                or(
                  like(jobPostings.title, searchTerm),
                  like(jobPostings.description, searchTerm),
                ),
              ),
            )
            .limit(input.limit)
            .orderBy(desc(jobPostings.createdAt));

          jobs.forEach((j) => results.push({
            id: j.id,
            type: "job",
            title: j.title,
            description: j.description,
            city: j.city,
            badge: j.jobType ?? "job",
            meta: { salaryMin: j.salaryMin, salaryMax: j.salaryMax, minWriScore: j.minWriScore },
          }));
        }

        /* Search Courses */
        if (input.type === "all" || input.type === "courses") {
          const courses = await db
            .select()
            .from(creatorStudioCourses)
            .where(
              and(
                eq(creatorStudioCourses.isPublished, true),
                or(
                  like(creatorStudioCourses.title, searchTerm),
                  like(creatorStudioCourses.description, searchTerm),
                  like(creatorStudioCourses.category, searchTerm),
                ),
              ),
            )
            .limit(input.limit)
            .orderBy(desc(creatorStudioCourses.createdAt));

          courses.forEach((c) => results.push({
            id: c.id,
            type: "course",
            title: c.title,
            description: c.description,
            city: null,
            badge: c.tier,
            meta: { category: c.category, totalEnrollments: c.totalEnrollments, avgRating: c.averageRating },
          }));
        }

        /* Search Shifts */
        if (input.type === "all" || input.type === "shifts") {
          const shifts = await db
            .select()
            .from(quickworkShifts)
            .where(
              and(
                eq(quickworkShifts.status, "open"),
                or(
                  like(quickworkShifts.title, searchTerm),
                  like(quickworkShifts.description, searchTerm),
                  like(quickworkShifts.city, searchTerm),
                ),
              ),
            )
            .limit(input.limit)
            .orderBy(desc(quickworkShifts.createdAt));

          shifts.forEach((s) => results.push({
            id: s.id,
            type: "shift",
            title: s.title,
            description: s.description,
            city: s.city,
            badge: "QuickWork",
            meta: { hourlyRate: s.hourlyRate, totalHours: s.totalHours, shiftDate: s.shiftDate },
          }));
        }

        /* Search Opportunities */
        if (input.type === "all" || input.type === "opportunities") {
          const opps = await db
            .select()
            .from(impactOpportunities)
            .where(
              and(
                eq(impactOpportunities.status, "open"),
                or(
                  like(impactOpportunities.title, searchTerm),
                  like(impactOpportunities.description, searchTerm),
                  like(impactOpportunities.city, searchTerm),
                ),
              ),
            )
            .limit(input.limit)
            .orderBy(desc(impactOpportunities.createdAt));

          opps.forEach((o) => results.push({
            id: o.id,
            type: "opportunity",
            title: o.title,
            description: o.description,
            city: o.city,
            badge: "Impact",
            meta: { timeCommitmentHours: o.timeCommitmentHours, spotsAvailable: o.spotsAvailable },
          }));
        }

        /* Optional: city filter post-search */
        let filtered = results;
        if (input.city) {
          filtered = results.filter((r) => r.city?.toLowerCase().includes(input.city!.toLowerCase()));
        }

        return filtered.slice(0, input.limit);
      }, "INTERNAL_ERROR");
    }),
});
