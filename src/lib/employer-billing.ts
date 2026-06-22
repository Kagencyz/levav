/**
 * ============================================================
 * EMPLOYER BILLING — Subscription Tiers & Credits
 * ============================================================
 * Free / Pro / Enterprise plans with job posting credits,
 * featured job slots, analytics access, and team seats.
 * ============================================================
 */

const STORAGE_KEY = "levav_employer_billing";

export type PlanType = "free" | "pro" | "enterprise";

export interface BillingState {
  plan: PlanType;
  jobsPostedThisMonth: number;
  featuredSlotsUsed: number;
  messagesSent: number;
  credits: number;        /* universal credits for add-ons */
  renewalDate: string;
}

export interface PlanConfig {
  name: string;
  monthlyPriceUSD: number;
  jobPostingsPerMonth: number;
  featuredJobSlots: number;
  messageCredits: number;
  analyticsLevel: "basic" | "advanced" | "full";
  teamSeats: number;
  prioritySupport: boolean;
  customBranding: boolean;
  wriVerificationAccess: boolean;
  description: string;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: "Free",
    monthlyPriceUSD: 0,
    jobPostingsPerMonth: 2,
    featuredJobSlots: 0,
    messageCredits: 10,
    analyticsLevel: "basic",
    teamSeats: 1,
    prioritySupport: false,
    customBranding: false,
    wriVerificationAccess: false,
    description: "For small teams just getting started with hiring.",
  },
  pro: {
    name: "Pro",
    monthlyPriceUSD: 49,
    jobPostingsPerMonth: 10,
    featuredJobSlots: 3,
    messageCredits: 100,
    analyticsLevel: "advanced",
    teamSeats: 3,
    prioritySupport: true,
    customBranding: true,
    wriVerificationAccess: true,
    description: "For growing companies with regular hiring needs.",
  },
  enterprise: {
    name: "Enterprise",
    monthlyPriceUSD: 149,
    jobPostingsPerMonth: 999, /* unlimited */
    featuredJobSlots: 10,
    messageCredits: 999,
    analyticsLevel: "full",
    teamSeats: 10,
    prioritySupport: true,
    customBranding: true,
    wriVerificationAccess: true,
    description: "For large organizations hiring at scale across Africa.",
  },
};

export function loadBilling(): BillingState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const defaults: BillingState = {
      plan: "free",
      jobsPostedThisMonth: 0,
      featuredSlotsUsed: 0,
      messagesSent: 0,
      credits: 0,
      renewalDate: getNextMonthDate(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try { return JSON.parse(raw); } catch { return loadBilling(); } // reset
}

export function saveBilling(state: BillingState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function upgradePlan(plan: PlanType): BillingState {
  const state = loadBilling();
  state.plan = plan;
  state.renewalDate = getNextMonthDate();
  saveBilling(state);
  return state;
}

export function incrementJobPosted(isFeatured: boolean = false): BillingState {
  const state = loadBilling();
  state.jobsPostedThisMonth += 1;
  if (isFeatured) state.featuredSlotsUsed += 1;
  saveBilling(state);
  return state;
}

export function canPostJob(): boolean {
  const { plan, jobsPostedThisMonth } = loadBilling();
  return jobsPostedThisMonth < PLANS[plan].jobPostingsPerMonth;
}

export function canFeatureJob(): boolean {
  const { plan, featuredSlotsUsed } = loadBilling();
  return featuredSlotsUsed < PLANS[plan].featuredJobSlots;
}

export function remainingJobs(): number {
  const { plan, jobsPostedThisMonth } = loadBilling();
  return Math.max(0, PLANS[plan].jobPostingsPerMonth - jobsPostedThisMonth);
}

export function remainingFeatured(): number {
  const { plan, featuredSlotsUsed } = loadBilling();
  return Math.max(0, PLANS[plan].featuredJobSlots - featuredSlotsUsed);
}

function getNextMonthDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}
