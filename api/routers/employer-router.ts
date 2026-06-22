/**
 * ============================================================
 * EMPLOYER ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * Employer profile setup and management.
 * Role-gated: only users with role='employer' can access
 * most endpoints. The create endpoint handles role selection.
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery, employerQuery, anyRoleQuery, adminQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  findEmployerByUserId,
  findEmployerById,
  createEmployerProfile,
  updateEmployerProfile,
  listAllEmployers,
} from "../queries/employers";
import { updateUserRole } from "../queries/levav-profiles";

const EmployerSetupSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(255),
  registrationNumber: z.string().max(255).optional(),
  industry: z.string().max(255).optional(),
  companySize: z
    .enum(["startup", "small", "medium", "large", "enterprise"])
    .optional(),
  website: z.string().url().max(500).optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  contactName: z.string().max(255).optional(),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email().max(320).optional().or(z.literal("")),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).default("Zambia"),
});

const UpdateEmployerSchema = z.object({
  companyName: z.string().min(1).max(255).optional(),
  industry: z.string().max(255).optional(),
  companySize: z
    .enum(["startup", "small", "medium", "large", "enterprise"])
    .optional(),
  website: z.string().url().max(500).optional().or(z.literal("")),
  description: z.string().max(2000).optional(),
  contactName: z.string().max(255).optional(),
  contactPhone: z.string().max(50).optional(),
  contactEmail: z.string().email().max(320).optional().or(z.literal("")),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

export const employerRouter = createRouter({
  /**
   * Setup employer profile (role selection + profile creation).
   * Can be called by any authenticated user who hasn't selected a role.
   */
  setup: authedQuery
    .input(EmployerSetupSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        // Check if already has employer profile
        const existing = await findEmployerByUserId(ctx.user.id);
        if (existing) {
          return { employerId: existing.id, alreadyExists: true };
        }

        // Update user role to employer
        await updateUserRole(ctx.user.id, "employer");

        // Create employer profile
        const employerId = await createEmployerProfile({
          userId: ctx.user.id,
          companyName: input.companyName,
          registrationNumber: input.registrationNumber ?? null,
          industry: input.industry ?? null,
          companySize: input.companySize ?? null,
          website: input.website ?? null,
          description: input.description ?? null,
          contactName: input.contactName ?? null,
          contactPhone: input.contactPhone ?? null,
          contactEmail: input.contactEmail ?? null,
          city: input.city ?? null,
          province: input.province ?? null,
          country: input.country,
          verificationStatus: "pending",
        });

        return { employerId, alreadyExists: false, status: "pending" };
      }, "INTERNAL_ERROR");
    }),

  /**
   * Get current employer's profile.
   */
  me: employerQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const employer = await findEmployerByUserId(ctx.user.id);
      if (!employer) throwLevavError("PROFILE_NOT_FOUND", "Employer profile not found.");
      return employer;
    }, "PROFILE_NOT_FOUND");
  }),

  /**
   * Get employer by ID (public, for job listing context).
   */
  byId: anyRoleQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const employer = await findEmployerById(input.id);
        if (!employer) throwLevavError("PROFILE_NOT_FOUND");
        return employer;
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Update employer profile.
   */
  update: employerQuery
    .input(UpdateEmployerSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const employer = await findEmployerByUserId(ctx.user.id);
        if (!employer) throwLevavError("PROFILE_NOT_FOUND");

        const updated = await updateEmployerProfile(employer.id, {
          ...input,
        });

        return updated;
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Admin: List all employer profiles.
   */
  list: adminQuery.query(async () => {
    return safeOperation(async () => {
      return listAllEmployers();
    }, "INTERNAL_ERROR");
  }),
});
