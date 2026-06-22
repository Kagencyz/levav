/**
 * ============================================================
 * LEVAV TALENT AFRIKA — tRPC APP ROUTER
 * ============================================================
 * Central router registration for all tRPC endpoints.
 *
 * Router Map:
 *   auth        — OAuth session (me, logout) [built-in]
 *   profile     — Levav ID CRUD, skills, experience, education
 *   profession  — Public profession catalog
 *   wri         — Workforce Readiness Index read + leaderboard
 *   levavCode   — The Levav Code covenant acceptance
 *   employer    — Employer profile setup
 *   job         — Job postings and applications (Trigger A)
 *   quickwork   — On-demand shifts (Trigger C)
 *   impact      — Impact partners and opportunities
 *   volunteer   — Volunteer hours logging (Trigger B)
 *   notification — User notification center
 *   ai          — AI services (challenge gen, OWN eval, transcription)
 * ============================================================
 */

import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { levavProfileRouter } from "./routers/levav-profile-router";
import { professionRouter } from "./routers/profession-router";
import { wriRouter } from "./routers/wri-router";
import { levavCodeRouter } from "./routers/levav-code-router";
import { employerRouter } from "./routers/employer-router";
import { jobBroadcastRouter } from "./routers/job-broadcast-router";
import { quickworkRouter } from "./routers/quickwork-router";
import { impactRouter } from "./routers/impact-router";
import { volunteerRouter } from "./routers/volunteer-router";
import { notificationRouter } from "./routers/notification-router";
import { aiRouter } from "./routers/ai-router";
import { walletRouter } from "./routers/wallet-router";
import { courseRouter } from "./routers/course-router";
import { searchRouter } from "./routers/search-router";
import { advisorRouter } from "./routers/advisor-router";
import { badgeRouter } from "./routers/badge-router";
import { jobApplicationRouter } from "./routers/job-application-router";
import { messageRouter } from "./routers/message-router";
import { whatsappRouter } from "./routers/whatsapp-router";
import { feedRouter } from "./routers/feed-router";
import { paymentRouter } from "./routers/payment-router";
import { certificateRouter } from "./routers/certificate-router";
import { analyticsRouter } from "./routers/analytics-router";
import { referralRouter } from "./routers/referral-router";
import { pushRouter } from "./routers/push-router";
import { interviewRouter } from "./routers/interview-router";
import { championsRouter } from "./routers/champions-router";
import { creatorRouter } from "./routers/creator-router";
import { localAuthRouter } from "./local-auth-router";

export const appRouter = createRouter({
  // Health check
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  // Built-in auth (OAuth)
  auth: authRouter,

  // Agent 1 — Backend & Security Routers
  profile: levavProfileRouter,
  profession: professionRouter,
  wri: wriRouter,
  levavCode: levavCodeRouter,
  employer: employerRouter,
  notification: notificationRouter,

  // Agent 2 — Integration & Trigger Routers
  job: jobBroadcastRouter,
  quickwork: quickworkRouter,
  impact: impactRouter,
  volunteer: volunteerRouter,

  // Agent 3 — AI Services Router
  ai: aiRouter,

  // Agent 4 — Wallet & Course Routers
  wallet: walletRouter,
  course: courseRouter,

  // Agent 5 — Search, Advisor & Badge Routers
  search: searchRouter,
  advisor: advisorRouter,
  badge: badgeRouter,

  // Agent 6 — Applicant Tracking
  application: jobApplicationRouter,

  // Agent 7 — Direct Messaging & WhatsApp
  message: messageRouter,
  whatsapp: whatsappRouter,

  // Agent 8 — Social Feed, Payments, Certificates & Analytics
  feed: feedRouter,
  payment: paymentRouter,
  certificate: certificateRouter,
  analytics: analyticsRouter,

  // Agent 9 — Referrals, Push Notifications & Interviews
  referral: referralRouter,
  push: pushRouter,
  interview: interviewRouter,

  // Agent 11 — Champions Program
  champions: championsRouter,

  // Agent 12 — Creator Program
  creator: creatorRouter,

  // Local Auth — Email & Password
  localAuth: localAuthRouter,
});

export type AppRouter = typeof appRouter;
