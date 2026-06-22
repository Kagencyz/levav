/**
 * ============================================================
 * LEVAV TALENT AFRIKA — ZOD VALIDATION SCHEMAS
 * ============================================================
 * All input validation schemas used across tRPC routers.
 * Strict, exhaustive validation aligned with database constraints.
 * ============================================================
 */

import { z } from "zod";

/* ============================================================
   SHARED / UTILITY SCHEMAS
   ============================================================ */

export const LevavCodeSchema = z
  .string()
  .min(6, "Levav Code must be at least 6 characters")
  .max(50, "Levav Code cannot exceed 50 characters")
  .regex(/^[A-Z0-9_-]+$/i, "Levav Code contains invalid characters");

export const PhoneSchema = z
  .string()
  .max(50, "Phone number too long")
  .regex(/^[+0-9\s\-()]+$/, "Invalid phone number format")
  .optional()
  .or(z.literal(""));

export const ZambiaLocationSchema = z.object({
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).default("Zambia"),
});

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const IdParamSchema = z.object({
  id: z.number().int().positive("Invalid ID"),
});

/* ============================================================
   ROLE MANAGEMENT SCHEMAS
   ============================================================ */

export const RoleUpdateSchema = z.object({
  role: z.enum(["talent", "employer", "creator"]),
});

/* ============================================================
   LEVAV PROFILE SCHEMAS
   ============================================================ */

export const CreateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(255),
  lastName: z.string().min(1, "Last name is required").max(255),
  phone: PhoneSchema,
  professionId: z.number().int().positive().optional(),
  customProfessionText: z.string().max(255).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).default("Zambia"),
  bio: z.string().max(2000).optional(),
  headline: z.string().max(500).optional(),
  availabilityStatus: z
    .enum(["available", "open_to_opportunities", "not_available", "in_quickwork"])
    .default("available"),
  lookingForWork: z.boolean().default(true),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  phone: PhoneSchema,
  professionId: z.number().int().positive().optional(),
  customProfessionText: z.string().max(255).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).optional(),
  bio: z.string().max(2000).optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  headline: z.string().max(500).optional(),
  availabilityStatus: z
    .enum(["available", "open_to_opportunities", "not_available", "in_quickwork"])
    .optional(),
  lookingForWork: z.boolean().optional(),
});

export const ProfileByIdSchema = z.object({
  profileId: z.number().int().positive(),
});

export const ProfileByLevavCodeSchema = z.object({
  levavCode: LevavCodeSchema,
});

/* ============================================================
   LEVAV CODE ACCEPTANCE SCHEMAS
   ============================================================ */

export const AcceptLevavCodeSchema = z.object({
  profileId: z.number().int().positive(),
  // All 8 pillars must be explicitly accepted
  ownership: z.literal(true),
  excellence: z.literal(true),
  reliability: z.literal(true),
  initiative: z.literal(true),
  growth: z.literal(true),
  criticalThinking: z.literal(true),
  service: z.literal(true),
  impact: z.literal(true),
  ipAddress: z.string().max(100).optional(),
  userAgent: z.string().optional(),
});

/* ============================================================
   WRI SCHEMAS (Read-only from client)
   ============================================================ */

export const WriHistoryQuerySchema = z.object({
  componentType: z
    .enum([
      "culture",
      "critical_thinking",
      "reliability",
      "communication",
      "learning",
      "leadership",
      "impact",
    ])
    .optional(),
  limit: z.number().int().min(1).max(100).default(50),
});

export const WriLeaderboardSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  minScore: z.number().min(0).max(100).optional(),
  goldKeyTier: z
    .enum(["bronze", "silver", "gold", "platinum", "diamond"])
    .optional(),
});

/* ============================================================
   SKILL INVENTORY SCHEMAS
   ============================================================ */

export const AddSkillSchema = z.object({
  skillName: z.string().min(1, "Skill name is required").max(255),
  proficiencyLevel: z
    .enum(["beginner", "intermediate", "advanced", "expert", "master"])
    .default("beginner"),
  category: z.string().max(255).optional(),
});

export const UpdateSkillSchema = z.object({
  skillId: z.number().int().positive(),
  proficiencyLevel: z
    .enum(["beginner", "intermediate", "advanced", "expert", "master"])
    .optional(),
  category: z.string().max(255).optional(),
});

/* ============================================================
   EXPERIENCE HISTORY SCHEMAS
   ============================================================ */

export const AddExperienceSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  organization: z.string().min(1, "Organization is required").max(255),
  experienceType: z.enum(["work", "volunteer", "project", "internship", "contract"]),
  description: z.string().max(2000).optional(),
  location: z.string().max(255).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),
  isCurrent: z.boolean().default(false),
  skillsUsed: z.array(z.string()).optional(),
});

/* ============================================================
   EDUCATION HISTORY SCHEMAS
   ============================================================ */

export const AddEducationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(255),
  degree: z.string().min(1, "Degree is required").max(255),
  fieldOfStudy: z.string().max(255).optional(),
  grade: z.string().max(50).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD").optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(2000).optional(),
});

/* ============================================================
   VOLUNTEER / IMPACT SCHEMAS
   ============================================================ */

export const CreateImpactPartnerSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(255),
  description: z.string().max(2000).optional(),
  website: z.string().url().max(500).optional().or(z.literal("")),
  contactEmail: z.string().email().max(320).optional().or(z.literal("")),
  contactPhone: PhoneSchema,
  sector: z.string().max(255).optional(),
  registrationNumber: z.string().max(255).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).default("Zambia"),
});

export const CreateImpactOpportunitySchema = z.object({
  partnerId: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(3000).optional(),
  location: z.string().max(500).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  requiredSkills: z.array(z.string()).optional(),
  timeCommitmentHours: z.number().positive().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  spotsAvailable: z.number().int().positive().default(1),
  coordinatorName: z.string().max(255).optional(),
  coordinatorEmail: z.string().email().max(320).optional().or(z.literal("")),
  coordinatorPhone: PhoneSchema,
});

export const LogVolunteerHoursSchema = z.object({
  opportunityId: z.number().int().positive(),
  profileId: z.number().int().positive(),
  hoursLogged: z.number().positive("Hours must be greater than 0").max(24, "Cannot exceed 24 hours per entry"),
  activityDescription: z.string().max(2000).optional(),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export const ValidateVolunteerHoursSchema = z.object({
  ledgerEntryId: z.number().int().positive(),
  coordinatorName: z.string().min(1, "Coordinator name is required").max(255),
  notes: z.string().max(1000).optional(),
});

/* ============================================================
   QUICKWORK SCHEMAS
   ============================================================ */

export const CreateQuickworkShiftSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().max(3000).optional(),
  location: z.string().max(500).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  shiftDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:MM"),
  hourlyRate: z.number().positive("Rate must be positive"),
  totalHours: z.number().positive("Hours must be positive"),
  requiredSkills: z.array(z.string()).optional(),
  requiredProfessions: z.array(z.string()).optional(),
  minWriScore: z.number().min(0).max(100).optional(),
  spotsTotal: z.number().int().positive().default(1),
});

export const ApplyToShiftSchema = z.object({
  shiftId: z.number().int().positive(),
  coverNote: z.string().max(1000).optional(),
});

export const RateShiftSchema = z.object({
  applicationId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
});

/* ============================================================
   JOB POSTING SCHEMAS
   ============================================================ */

export const CreateJobPostingSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().min(1, "Description is required").max(5000),
  requirements: z.string().max(3000).optional(),
  responsibilities: z.string().max(3000).optional(),
  location: z.string().max(500).optional(),
  city: z.string().max(255).optional(),
  province: z.string().max(255).optional(),
  country: z.string().max(255).default("Zambia"),
  jobType: z.enum(["full_time", "part_time", "contract", "internship", "remote"]),
  experienceLevel: z
    .enum(["entry", "mid", "senior", "lead", "executive"])
    .optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  skillsRequired: z.array(z.string()).optional(),
  minWriScore: z.number().min(0).max(100).optional(),
  closesAt: z.string().datetime().optional(),
});

export const ApplyToJobSchema = z.object({
  jobId: z.number().int().positive(),
  coverLetter: z.string().max(3000).optional(),
});

export const UpdateJobApplicationStatusSchema = z.object({
  applicationId: z.number().int().positive(),
  status: z.enum(["screening", "interview", "offer", "hired", "rejected"]),
  employerNotes: z.string().max(1000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

/* ============================================================
   NOTIFICATION SCHEMAS
   ============================================================ */

export const MarkNotificationReadSchema = z.object({
  notificationId: z.number().int().positive(),
});

export const ListNotificationsSchema = z.object({
  unreadOnly: z.boolean().default(false),
  limit: z.number().int().min(1).max(50).default(20),
});
