/**
 * ============================================================
 * LEVAV TALENT AFRIKA — DRIZZLE RELATIONS
 * ============================================================
 * Defines all table relationships for type-safe relational queries.
 * Enables: db.query.levavProfiles.findMany({ with: { wriAnalytics: true } })
 *
 * All relations mirror the foreign key structure defined in schema.ts.
 * ============================================================
 */

import { relations } from "drizzle-orm";
import {
  users,
  levavProfiles,
  professions,
  wriAnalytics,
  wriComponentScores,
  levavCodeAcceptances,
  levav28Sessions,
  levav28Responses,
  skillsInventory,
  experienceHistory,
  educationHistory,
  creatorStudioCourses,
  courseLessons,
  courseEnrollments,
  courseProgress,
  quickworkShifts,
  quickworkApplications,
  impactPartners,
  impactOpportunities,
  volunteerLedger,
  employerProfiles,
  jobPostings,
  jobApplications,
  transactionsWallet,
  notifications,
} from "./schema";

/* ============================================================
   USERS RELATIONS
   ============================================================ */

export const usersRelations = relations(users, ({ one, many }) => ({
  // A user has one Levav profile (if role = talent)
  levavProfile: one(levavProfiles, {
    fields: [users.id],
    references: [levavProfiles.userId],
  }),
  // A user has one employer profile (if role = employer)
  employerProfile: one(employerProfiles, {
    fields: [users.id],
    references: [employerProfiles.userId],
  }),
  // A creator can have many courses
  creatorCourses: many(creatorStudioCourses),
  // Notifications sent to this user
  notifications: many(notifications),
}));

/* ============================================================
   PROFESSIONS RELATIONS
   ============================================================ */

export const professionsRelations = relations(professions, ({ many }) => ({
  // A profession can be assigned to many profiles
  profiles: many(levavProfiles),
}));

/* ============================================================
   LEVAV PROFILES RELATIONS (Central Identity Hub)
   ============================================================ */

export const levavProfilesRelations = relations(levavProfiles, ({ one, many }) => ({
  // Belongs to one user
  user: one(users, {
    fields: [levavProfiles.userId],
    references: [users.id],
  }),
  // Belongs to one profession (optional)
  profession: one(professions, {
    fields: [levavProfiles.professionId],
    references: [professions.id],
  }),
  // Has one WRI analytics record
  wriAnalytics: one(wriAnalytics, {
    fields: [levavProfiles.id],
    references: [wriAnalytics.profileId],
  }),
  // Has many WRI component score history entries
  wriComponentScores: many(wriComponentScores),
  // Has one Levav Code acceptance
  levavCodeAcceptance: one(levavCodeAcceptances, {
    fields: [levavProfiles.id],
    references: [levavCodeAcceptances.profileId],
  }),
  // Has many Levav 28 sessions
  levav28Sessions: many(levav28Sessions),
  // Has many skills
  skills: many(skillsInventory),
  // Has many experience entries
  experiences: many(experienceHistory),
  // Has many education entries
  educations: many(educationHistory),
  // Has many course enrollments
  courseEnrollments: many(courseEnrollments),
  // Has many QuickWork applications
  quickworkApplications: many(quickworkApplications),
  // Has many job applications
  jobApplications: many(jobApplications),
  // Has many volunteer ledger entries
  volunteerEntries: many(volunteerLedger),
  // Has many wallet transactions
  walletTransactions: many(transactionsWallet),
}));

/* ============================================================
   WRI ANALYTICS RELATIONS
   ============================================================ */

export const wriAnalyticsRelations = relations(wriAnalytics, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [wriAnalytics.profileId],
    references: [levavProfiles.id],
  }),
}));

export const wriComponentScoresRelations = relations(wriComponentScores, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [wriComponentScores.profileId],
    references: [levavProfiles.id],
  }),
}));

/* ============================================================
   LEVAV 28 ONBOARDING RELATIONS
   ============================================================ */

export const levavCodeAcceptancesRelations = relations(levavCodeAcceptances, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [levavCodeAcceptances.profileId],
    references: [levavProfiles.id],
  }),
}));

export const levav28SessionsRelations = relations(levav28Sessions, ({ one, many }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [levav28Sessions.profileId],
    references: [levavProfiles.id],
  }),
  // Has many responses
  responses: many(levav28Responses),
}));

export const levav28ResponsesRelations = relations(levav28Responses, ({ one }) => ({
  // Belongs to one session
  session: one(levav28Sessions, {
    fields: [levav28Responses.sessionId],
    references: [levav28Sessions.id],
  }),
}));

/* ============================================================
   PROFESSIONAL DATA RELATIONS
   ============================================================ */

export const skillsInventoryRelations = relations(skillsInventory, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [skillsInventory.profileId],
    references: [levavProfiles.id],
  }),
}));

export const experienceHistoryRelations = relations(experienceHistory, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [experienceHistory.profileId],
    references: [levavProfiles.id],
  }),
}));

export const educationHistoryRelations = relations(educationHistory, ({ one }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [educationHistory.profileId],
    references: [levavProfiles.id],
  }),
}));

/* ============================================================
   CREATOR STUDIO RELATIONS
   ============================================================ */

export const creatorStudioCoursesRelations = relations(creatorStudioCourses, ({ one, many }) => ({
  // Created by one user (creator)
  creator: one(users, {
    fields: [creatorStudioCourses.creatorId],
    references: [users.id],
  }),
  // Has many lessons
  lessons: many(courseLessons),
  // Has many enrollments
  enrollments: many(courseEnrollments),
}));

export const courseLessonsRelations = relations(courseLessons, ({ one, many }) => ({
  // Belongs to one course
  course: one(creatorStudioCourses, {
    fields: [courseLessons.courseId],
    references: [creatorStudioCourses.id],
  }),
  // Has many progress records
  progressRecords: many(courseProgress),
}));

export const courseEnrollmentsRelations = relations(courseEnrollments, ({ one, many }) => ({
  // Belongs to one profile
  profile: one(levavProfiles, {
    fields: [courseEnrollments.profileId],
    references: [levavProfiles.id],
  }),
  // Belongs to one course
  course: one(creatorStudioCourses, {
    fields: [courseEnrollments.courseId],
    references: [creatorStudioCourses.id],
  }),
  // Has many progress records
  progressRecords: many(courseProgress),
}));

export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
  // Belongs to one enrollment
  enrollment: one(courseEnrollments, {
    fields: [courseProgress.enrollmentId],
    references: [courseEnrollments.id],
  }),
  // Belongs to one lesson
  lesson: one(courseLessons, {
    fields: [courseProgress.lessonId],
    references: [courseLessons.id],
  }),
}));

/* ============================================================
   QUICKWORK RELATIONS
   ============================================================ */

export const quickworkShiftsRelations = relations(quickworkShifts, ({ one, many }) => ({
  // Posted by one employer
  employer: one(employerProfiles, {
    fields: [quickworkShifts.employerId],
    references: [employerProfiles.id],
  }),
  // Has many applications
  applications: many(quickworkApplications),
}));

export const quickworkApplicationsRelations = relations(quickworkApplications, ({ one }) => ({
  // Belongs to one shift
  shift: one(quickworkShifts, {
    fields: [quickworkApplications.shiftId],
    references: [quickworkShifts.id],
  }),
  // Belongs to one profile (the applicant)
  profile: one(levavProfiles, {
    fields: [quickworkApplications.profileId],
    references: [levavProfiles.id],
  }),
}));

/* ============================================================
   IMPACT RELATIONS
   ============================================================ */

export const impactPartnersRelations = relations(impactPartners, ({ many }) => ({
  // Has many opportunities
  opportunities: many(impactOpportunities),
}));

export const impactOpportunitiesRelations = relations(impactOpportunities, ({ one, many }) => ({
  // Belongs to one partner
  partner: one(impactPartners, {
    fields: [impactOpportunities.partnerId],
    references: [impactPartners.id],
  }),
  // Has many volunteer ledger entries
  volunteerEntries: many(volunteerLedger),
}));

export const volunteerLedgerRelations = relations(volunteerLedger, ({ one }) => ({
  // Belongs to one opportunity
  opportunity: one(impactOpportunities, {
    fields: [volunteerLedger.opportunityId],
    references: [impactOpportunities.id],
  }),
  // Belongs to one profile (the volunteer)
  profile: one(levavProfiles, {
    fields: [volunteerLedger.profileId],
    references: [levavProfiles.id],
  }),
}));

/* ============================================================
   EMPLOYER B2B RELATIONS
   ============================================================ */

export const employerProfilesRelations = relations(employerProfiles, ({ one, many }) => ({
  // Belongs to one user
  user: one(users, {
    fields: [employerProfiles.userId],
    references: [users.id],
  }),
  // Has many job postings
  jobPostings: many(jobPostings),
  // Has many QuickWork shifts
  quickworkShifts: many(quickworkShifts),
  // Has many wallet transactions
  walletTransactions: many(transactionsWallet),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  // Posted by one employer
  employer: one(employerProfiles, {
    fields: [jobPostings.employerId],
    references: [employerProfiles.id],
  }),
  // Has many applications
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  // Belongs to one job posting
  jobPosting: one(jobPostings, {
    fields: [jobApplications.jobId],
    references: [jobPostings.id],
  }),
  // Belongs to one profile (the applicant)
  profile: one(levavProfiles, {
    fields: [jobApplications.profileId],
    references: [levavProfiles.id],
  }),
}));

/* ============================================================
   FINANCIAL RELATIONS
   ============================================================ */

export const transactionsWalletRelations = relations(transactionsWallet, ({ one }) => ({
  // Belongs to one profile (if talent/creator transaction)
  profile: one(levavProfiles, {
    fields: [transactionsWallet.profileId],
    references: [levavProfiles.id],
  }),
  // Belongs to one employer (if employer transaction)
  employer: one(employerProfiles, {
    fields: [transactionsWallet.employerId],
    references: [employerProfiles.id],
  }),
}));

/* ============================================================
   NOTIFICATIONS RELATIONS
   ============================================================ */

export const notificationsRelations = relations(notifications, ({ one }) => ({
  // Belongs to one user (recipient)
  recipient: one(users, {
    fields: [notifications.recipientId],
    references: [users.id],
  }),
}));
