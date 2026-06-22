/**
 * ============================================================
 * CERTIFICATE ROUTER — Course Completion Certificates
 * ============================================================
 * tRPC endpoints for generating and verifying course completion
 * certificates with unique certificate numbers.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import { safeOperation } from "../lib/levav-errors";
import { findProfileByUserId } from "../queries/levav-profiles";
import { getDb } from "../queries/connection";
import { eq, and } from "drizzle-orm";
import * as schema from "@db/schema";

const db = getDb;

function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LEVAV-${year}-${random}`;
}

export const certificateRouter = createRouter({
  /* ─── Generate Certificate (on course completion) ─── */
  generate: authedQuery
    .input(z.object({ courseId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throw new Error("Profile required");

        /* Check if certificate already exists */
        const existing = await db()
          .select()
          .from(schema.certificates)
          .where(
            and(
              eq(schema.certificates.profileId, profile.id),
              eq(schema.certificates.courseId, input.courseId),
            ),
          )
          .limit(1);

        if (existing[0] && !existing[0].isRevoked) {
          return { certificate: existing[0], alreadyExists: true };
        }

        /* Get course info */
        const course = await db()
          .select()
          .from(schema.creatorStudioCourses)
          .where(eq(schema.creatorStudioCourses.id, input.courseId))
          .limit(1);

        if (!course[0]) throw new Error("Course not found");

        /* Get enrollment to verify completion */
        const enrollment = await db()
          .select()
          .from(schema.courseEnrollments)
          .where(
            and(
              eq(schema.courseEnrollments.profileId, profile.id),
              eq(schema.courseEnrollments.courseId, input.courseId),
            ),
          )
          .limit(1);

        if (!enrollment[0]) throw new Error("Not enrolled in this course");

        const certNumber = generateCertificateNumber();

        const result = await db()
          .insert(schema.certificates)
          .values({
            profileId: profile.id,
            courseId: input.courseId,
            certificateNumber: certNumber,
            courseTitle: course[0].title,
            instructorName: null,
            verificationUrl: `https://levavtalent.com/verify/${certNumber}`,
          })
          .$returningId();

        return {
          certificateId: result[0].id,
          certificateNumber: certNumber,
          success: true,
        };
      }, "INTERNAL_ERROR");
    }),

  /* ─── My Certificates ─── */
  mine: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) return [];

      return db()
        .select()
        .from(schema.certificates)
        .where(eq(schema.certificates.profileId, profile.id))
        .orderBy(schema.certificates.createdAt);
    }, "INTERNAL_ERROR");
  }),

  /* ─── Public: Verify Certificate by Number ─── */
  verify: publicQuery
    .input(z.object({ certNumber: z.string() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const cert = await db()
          .select()
          .from(schema.certificates)
          .where(eq(schema.certificates.certificateNumber, input.certNumber))
          .limit(1);

        if (!cert[0]) return { valid: false, message: "Certificate not found" };
        if (cert[0].isRevoked) return { valid: false, message: "Certificate has been revoked" };

        /* Get profile info */
        const profile = await db()
          .select({
            name: schema.levavProfiles.displayName,
            avatar: schema.levavProfiles.avatarUrl,
          })
          .from(schema.levavProfiles)
          .where(eq(schema.levavProfiles.id, cert[0].profileId))
          .limit(1);

        return {
          valid: true,
          certificate: cert[0],
          recipient: profile[0]?.name ?? "Unknown",
        };
      }, "INTERNAL_ERROR");
    }),
});
