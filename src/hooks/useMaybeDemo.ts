/**
 * ============================================================
 * USE MAYBE DEMO — Query Wrapper with Demo Fallback
 * ============================================================
 * When the backend is offline (dev mode), returns demo data
 * instead of making API calls. When backend is online, returns
 * real data from tRPC queries.
 * ============================================================
 */

import { useDemoAuth } from "./useDemoAuth";
import {
  demoProfile, demoWri, demoJobs, demoCourses,
  demoNotifications, demoWalletTransactions, demoFeedPosts,
  demoCertificates, demoReferralStats,
} from "@/lib/demo-data";

/**
 * Returns demo data if in demo mode, otherwise undefined.
 * Pages should use this to provide fallback content.
 */
export function useMaybeDemo<T>(type: DemoDataType): T | undefined {
  const { isDemoMode } = useDemoAuth();
  if (!isDemoMode) return undefined;
  return DEMO_DATA_MAP[type] as T;
}

export type DemoDataType =
  | "profile"
  | "wri"
  | "jobs"
  | "courses"
  | "notifications"
  | "wallet"
  | "feed"
  | "certificates"
  | "referrals";

const DEMO_DATA_MAP: Record<DemoDataType, unknown> = {
  profile: demoProfile,
  wri: demoWri,
  jobs: demoJobs,
  courses: demoCourses,
  notifications: demoNotifications,
  wallet: demoWalletTransactions,
  feed: demoFeedPosts,
  certificates: demoCertificates,
  referrals: demoReferralStats,
};
