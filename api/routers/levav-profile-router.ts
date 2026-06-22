/**
 * ============================================================
 * LEVAV PROFILE ROUTER (Agent 1 — Backend & Security)
 * ============================================================
 * tRPC router for Levav ID management.
 * Handles: profile CRUD, skills, experience, education
 * Protected by: authedQuery (talent role or higher)
 * ============================================================
 */

import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { throwLevavError, safeOperation } from "../lib/levav-errors";
import {
  findProfileByUserId,
  findProfileById,
  findProfileByLevavCode,
  createProfile,
  updateProfile,
  updateUserRole,
  generateLevavCode,
  listAvailableProfiles,
  findSkillsByProfile,
  addSkill,
  updateSkill,
  deleteSkill,
  findExperienceByProfile,
  addExperience,
  deleteExperience,
  findEducationByProfile,
  addEducation,
  deleteEducation,
} from "../queries/levav-profiles";
import { initializeWriForProfile } from "../queries/wri";
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  ProfileByIdSchema,
  ProfileByLevavCodeSchema,
  AddSkillSchema,
  UpdateSkillSchema,
  AddExperienceSchema,
  AddEducationSchema,
  PaginationSchema,
  RoleUpdateSchema,
} from "@contracts/schemas";
import { triggerProfileUpdate } from "../services/trigger-dispatcher";

export const levavProfileRouter = createRouter({
  /* ─── ROLE MANAGEMENT ─── */

  /**
   * Select a Levav role (talent/employer/creator) after initial login.
   * This transforms a generic user into an ecosystem participant.
   */
  selectRole: authedQuery
    .input(RoleUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const userId = ctx.user.id;

        // Only allow role selection if currently a generic user
        if (ctx.user.role !== "user" && ctx.user.role !== "admin") {
          throwLevavError("ROLE_UPGRADE_DENIED", "Role has already been selected.");
        }

        await updateUserRole(userId, input.role);

        // If talent, auto-create Levav profile
        if (input.role === "talent") {
          const existing = await findProfileByUserId(userId);
          if (!existing) {
            const levavCode = await generateLevavCode();
            const profile = await createProfile({
              userId,
              levavCode,
              onboardingCompleted: false,
            });
            // Initialize WRI record
            if (profile) {
              await initializeWriForProfile(profile.id);
            }
            return { role: input.role, profile, levavCode };
          }
        }

        return { role: input.role };
      }, "ROLE_INVALID");
    }),

  /* ─── PROFILE CRUD ─── */

  /**
   * Get the current user's Levav profile.
   */
  me: authedQuery.query(async ({ ctx }) => {
    return safeOperation(async () => {
      const profile = await findProfileByUserId(ctx.user.id);
      if (!profile) {
        throwLevavError("PROFILE_NOT_FOUND");
      }
      return profile;
    }, "PROFILE_NOT_FOUND");
  }),

  /**
   * Get a profile by ID (public, for portfolio viewing).
   */
  byId: authedQuery
    .input(ProfileByIdSchema)
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const profile = await findProfileById(input.profileId);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");
        return profile;
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Get a profile by Levav Code (public, for Levav ID lookup).
   */
  byLevavCode: authedQuery
    .input(ProfileByLevavCodeSchema)
    .query(async ({ input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByLevavCode(input.levavCode);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");
        return profile;
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Create the Levav profile (during onboarding).
   */
  create: authedQuery
    .input(CreateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const existing = await findProfileByUserId(ctx.user.id);
        if (existing) throwLevavError("PROFILE_EXISTS");

        const levavCode = await generateLevavCode();
        const profile = await createProfile({
          userId: ctx.user.id,
          levavCode,
          ...input,
          onboardingCompleted: false,
        });

        if (!profile) throwLevavError("INTERNAL_ERROR", "Failed to create profile.");

        // Initialize WRI record for new profile
        await initializeWriForProfile(profile.id);

        return profile;
      }, "PROFILE_EXISTS");
    }),

  /**
   * Update the current user's Levav profile.
   */
  update: authedQuery
    .input(UpdateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const updated = await updateProfile(profile.id, input);

        // Trigger WRI recalculation on significant profile changes
        await triggerProfileUpdate(profile.id);

        return updated;
      }, "PROFILE_NOT_FOUND");
    }),

  /**
   * Search available talent pool (for employers and internal matching).
   */
  search: authedQuery
    .input(
      PaginationSchema.extend({
        city: z.string().optional(),
        professionId: z.number().int().positive().optional(),
        minWriScore: z.number().min(0).max(100).optional(),
        availability: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      return safeOperation(async () => {
        return listAvailableProfiles({
          city: input.city,
          professionId: input.professionId,
          minWriScore: input.minWriScore,
          availability: input.availability,
          limit: input.pageSize,
          offset: (input.page - 1) * input.pageSize,
        });
      }, "INTERNAL_ERROR");
    }),

  /* ─── SKILLS INVENTORY ─── */

  skills: authedQuery
    .input(ProfileByIdSchema.optional())
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        let profileId: number;
        if (input?.profileId) {
          profileId = input.profileId;
        } else {
          const profile = await findProfileByUserId(ctx.user.id);
          if (!profile) throwLevavError("PROFILE_NOT_FOUND");
          profileId = profile.id;
        }
        return findSkillsByProfile(profileId);
      }, "PROFILE_NOT_FOUND");
    }),

  addSkill: authedQuery
    .input(AddSkillSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const skillId = await addSkill({
          profileId: profile.id,
          ...input,
        });

        // Trigger WRI recalculation
        await triggerProfileUpdate(profile.id);

        return { skillId, success: true };
      }, "PROFILE_NOT_FOUND");
    }),

  updateSkill: authedQuery
    .input(UpdateSkillSchema)
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await updateSkill(input.skillId, {
          proficiencyLevel: input.proficiencyLevel,
          category: input.category,
        });
        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  deleteSkill: authedQuery
    .input(z.object({ skillId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await deleteSkill(input.skillId);
        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── EXPERIENCE HISTORY ─── */

  experience: authedQuery
    .input(ProfileByIdSchema.optional())
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        let profileId: number;
        if (input?.profileId) {
          profileId = input.profileId;
        } else {
          const profile = await findProfileByUserId(ctx.user.id);
          if (!profile) throwLevavError("PROFILE_NOT_FOUND");
          profileId = profile.id;
        }
        return findExperienceByProfile(profileId);
      }, "PROFILE_NOT_FOUND");
    }),

  addExperience: authedQuery
    .input(AddExperienceSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const experienceId = await addExperience({
          profileId: profile.id,
          title: input.title,
          organization: input.organization,
          experienceType: input.experienceType,
          description: input.description,
          location: input.location,
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          isCurrent: input.isCurrent,
          skillsUsed: input.skillsUsed ?? [],
        });

        await triggerProfileUpdate(profile.id);

        return { experienceId, success: true };
      }, "PROFILE_NOT_FOUND");
    }),

  deleteExperience: authedQuery
    .input(z.object({ experienceId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await deleteExperience(input.experienceId);
        return { success: true };
      }, "INTERNAL_ERROR");
    }),

  /* ─── EDUCATION HISTORY ─── */

  education: authedQuery
    .input(ProfileByIdSchema.optional())
    .query(async ({ ctx, input }) => {
      return safeOperation(async () => {
        let profileId: number;
        if (input?.profileId) {
          profileId = input.profileId;
        } else {
          const profile = await findProfileByUserId(ctx.user.id);
          if (!profile) throwLevavError("PROFILE_NOT_FOUND");
          profileId = profile.id;
        }
        return findEducationByProfile(profileId);
      }, "PROFILE_NOT_FOUND");
    }),

  addEducation: authedQuery
    .input(AddEducationSchema)
    .mutation(async ({ ctx, input }) => {
      return safeOperation(async () => {
        const profile = await findProfileByUserId(ctx.user.id);
        if (!profile) throwLevavError("PROFILE_NOT_FOUND");

        const educationId = await addEducation({
          profileId: profile.id,
          institution: input.institution,
          degree: input.degree,
          fieldOfStudy: input.fieldOfStudy,
          grade: input.grade,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          isCurrent: input.isCurrent,
          description: input.description,
        });

        await triggerProfileUpdate(profile.id);

        return { educationId, success: true };
      }, "PROFILE_NOT_FOUND");
    }),

  deleteEducation: authedQuery
    .input(z.object({ educationId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return safeOperation(async () => {
        await deleteEducation(input.educationId);
        return { success: true };
      }, "INTERNAL_ERROR");
    }),
});
