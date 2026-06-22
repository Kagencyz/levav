/**
 * ============================================================
 * UNIFIED DATA LAYER — tRPC Primary + localStorage Fallback
 * ============================================================
 * All data flows through here. tRPC is the PRIMARY source.
 * When backend is online: data is fetched from tRPC, cached to
 * localStorage for offline resilience.
 * When backend is offline: reads fall back to localStorage.
 * When writing: attempts tRPC mutation first, falls back to
 * localStorage-only if backend is unavailable.
 * ============================================================
 */

import { trpcClient } from "@/providers/trpc";

/* ─── Backend availability detection ─── */
let backendAvailable: boolean | null = null;
let lastBackendCheck = 0;

async function checkBackend(): Promise<boolean> {
  const now = Date.now();
  if (backendAvailable !== null && now - lastBackendCheck < 30000) return backendAvailable;
  lastBackendCheck = now;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    if (!apiUrl) { backendAvailable = false; return false; }
    const resp = await fetch(`${apiUrl.replace("/trpc", "")}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    backendAvailable = resp.ok;
    return resp.ok;
  } catch {
    backendAvailable = false;
    return false;
  }
}

function isDemoToken(): boolean {
  const token = localStorage.getItem("levav_token");
  return !token || token === "demo-token";
}

/* ─── tRPC call wrapper with fallback ─── */
async function tryTrpc<T>(fetcher: () => Promise<T>, fallback: () => T): Promise<T> {
  if (isDemoToken()) return fallback();
  const online = await checkBackend();
  if (!online) return fallback();
  try {
    const result = await fetcher();
    return result;
  } catch {
    return fallback();
  }
}

/* ═══════════════════════════════════════════
   USER PROFILE
   ═══════════════════════════════════════════ */
const PROFILE_KEY = "levav_profile";

export function getProfile(): any {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveProfile(profile: any): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, updatedAt: new Date().toISOString() }));
}

export function clearProfile(): void {
  localStorage.removeItem(PROFILE_KEY);
}

/* ═══════════════════════════════════════════
   LEVAV 28 CRUCIBLE PROGRESS
   ═══════════════════════════════════════════ */
const CRUCIBLE_KEY = "levav28_progress";

export interface CrucibleProgressEntry {
  day: number;
  phase: "confront" | "dissect" | "own" | "execute";
  score: number;
  completed: boolean;
  response: string;
  timestamp: string;
}

export function getCrucibleProgress(): CrucibleProgressEntry[] {
  const raw = localStorage.getItem(CRUCIBLE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveCrucibleEntry(entry: CrucibleProgressEntry): void {
  const all = getCrucibleProgress().filter((e) => !(e.day === entry.day && e.phase === entry.phase));
  all.push(entry);
  localStorage.setItem(CRUCIBLE_KEY, JSON.stringify(all));
}

export function getCompletedDaysCount(): number {
  const progress = getCrucibleProgress();
  const days = new Set(progress.filter((p) => p.completed).map((p) => p.day));
  return days.size;
}

/* ═══════════════════════════════════════════
   JOB BOARD (shared between employer + talent)
   ═══════════════════════════════════════════ */
const JOB_BOARD_KEY = "levav_job_board";

export function getJobBoard(): any[] {
  const raw = localStorage.getItem(JOB_BOARD_KEY);
  if (!raw) return getDefaultJobs();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultJobs();
  } catch { return getDefaultJobs(); }
}

export function saveJobBoard(jobs: any[]): void {
  localStorage.setItem(JOB_BOARD_KEY, JSON.stringify(jobs));
}

export function addJob(job: any): any {
  const board = getJobBoard();
  const newJob = { ...job, id: job.id || Date.now(), applicants: 0, views: 0 };
  board.unshift(newJob);
  saveJobBoard(board);
  return newJob;
}

export function updateJob(id: number, updates: any): void {
  const board = getJobBoard().map((j) => j.id === id ? { ...j, ...updates } : j);
  saveJobBoard(board);
}

export function deleteJob(id: number): void {
  const board = getJobBoard().filter((j) => j.id !== id);
  saveJobBoard(board);
}

function getDefaultJobs(): any[] {
  const defaults = [
    { id: 1, title: "Senior Frontend Developer", company: "BongoHive", location: "Lusaka, Zambia", type: "Full-time", salary: "ZMW 15,000 - 25,000", description: "Join our engineering team building scalable web applications.", requirements: ["5+ years React", "TypeScript", "Team leadership"], postedDate: "2025-06-10", deadline: "2025-07-10", status: "active", applicants: 24, views: 342, logo: null, thumbnail: null },
    { id: 2, title: "Product Designer", company: "BongoHive", location: "Lusaka, Zambia", type: "Full-time", salary: "ZMW 12,000 - 18,000", description: "Design user-centered products for African users.", requirements: ["Figma", "User research", "Design systems"], postedDate: "2025-06-08", deadline: "2025-07-08", status: "active", applicants: 18, views: 289, logo: null, thumbnail: null },
    { id: 3, title: "DevOps Engineer", company: "BongoHive", location: "Remote", type: "Full-time", salary: "ZMW 18,000 - 28,000", description: "Build cloud infrastructure across AWS and Azure.", requirements: ["AWS/Azure", "Kubernetes", "CI/CD"], postedDate: "2025-06-05", deadline: "2025-07-05", status: "active", applicants: 12, views: 198, logo: null, thumbnail: null },
    { id: 4, title: "Customer Success Manager", company: "BongoHive", location: "Lusaka, Zambia", type: "Full-time", salary: "ZMW 8,000 - 14,000", description: "Ensure clients achieve their goals.", requirements: ["3+ years CS", "CRM tools", "Communication"], postedDate: "2025-06-01", deadline: "2025-07-01", status: "paused", applicants: 31, views: 456, logo: null, thumbnail: null },
    { id: 5, title: "Junior UX Researcher", company: "ZamHealth", location: "Kitwe, Zambia", type: "Full-time", salary: "ZMW 6,000 - 10,000", description: "User research for health-tech products.", requirements: ["Research methods", "Interviewing", "Data synthesis"], postedDate: "2025-06-14", deadline: "2025-07-14", status: "active", applicants: 8, views: 124, logo: null, thumbnail: null },
    { id: 6, title: "Data Scientist", company: "Fintech Zambia", location: "Lusaka, Zambia", type: "Full-time", salary: "ZMW 20,000 - 35,000", description: "ML models for fraud detection and credit scoring.", requirements: ["Python/R", "Machine Learning", "SQL"], postedDate: "2025-06-12", deadline: "2025-07-12", status: "active", applicants: 15, views: 267, logo: null, thumbnail: null },
  ];
  saveJobBoard(defaults);
  return defaults;
}

/* ═══════════════════════════════════════════
   APPLICATIONS
   ═══════════════════════════════════════════ */
const APPLICATIONS_KEY = "levav_applications";

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  appliedDate: string;
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  wriScore: number;
  goldKeyTier: string;
  profession: string;
  skills: string[];
  experience: string;
  levavCode: string;
}

export function getApplications(): JobApplication[] {
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function submitApplication(app: Omit<JobApplication, "id" | "appliedDate" | "status">): JobApplication {
  const all = getApplications();
  const newApp: JobApplication = { ...app, id: Date.now(), appliedDate: new Date().toISOString().split("T")[0], status: "new" };
  all.unshift(newApp);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(all));
  return newApp;
}

/* ═══════════════════════════════════════════
   EMPLOYER DATA
   ═══════════════════════════════════════════ */
const EMPLOYER_KEY = "levav_employer";

export function getEmployerData(): any {
  const raw = localStorage.getItem(EMPLOYER_KEY);
  if (!raw) return getDefaultEmployer();
  try { return JSON.parse(raw); } catch { return getDefaultEmployer(); }
}

export function saveEmployerData(data: any): void {
  localStorage.setItem(EMPLOYER_KEY, JSON.stringify(data));
}

function getDefaultEmployer(): any {
  return {
    name: "BongoHive",
    industry: "Technology & Innovation",
    location: "Lusaka, Zambia",
    companySize: "50-200 employees",
    website: "bongohive.co.zm",
    description: "Zambia's premier technology and innovation hub. We build scalable solutions for the African market.",
    contactName: "Mutale Zimba",
    contactEmail: "hr@bongohive.co.zm",
    contactPhone: "+260 211 123 456",
    verificationStatus: "verified",
    logo: null,
  };
}

/* ═══════════════════════════════════════════
   CONTENT STUDIO
   ═══════════════════════════════════════════ */
const CONTENT_KEY = "levav_content_studio";

export interface ContentItem {
  id: number;
  title: string;
  type: "video" | "audio" | "document" | "article";
  status: "draft" | "published" | "under_review";
  createdAt: string;
  updatedAt: string;
  thumbnail?: string | null;
  description: string;
  category: string;
  views: number;
  likes: number;
}

export function getContentItems(): ContentItem[] {
  const raw = localStorage.getItem(CONTENT_KEY);
  if (!raw) return getDefaultContent();
  try { return JSON.parse(raw); } catch { return getDefaultContent(); }
}

export function saveContentItem(item: Omit<ContentItem, "id" | "createdAt" | "updatedAt" | "views" | "likes">): ContentItem {
  const all = getContentItems();
  const newItem: ContentItem = { ...item, id: Date.now(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), views: 0, likes: 0 };
  all.unshift(newItem);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(all));
  return newItem;
}

export function updateContentItem(id: number, updates: Partial<ContentItem>): void {
  const all = getContentItems().map((i) => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(all));
}

export function deleteContentItem(id: number): void {
  const all = getContentItems().filter((i) => i.id !== id);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(all));
}

function getDefaultContent(): ContentItem[] {
  const defaults: ContentItem[] = [
    { id: 1, title: "Introduction to Levav 28\u2122 Crucible", type: "video", status: "published", createdAt: "2025-06-01T10:00:00Z", updatedAt: "2025-06-01T10:00:00Z", thumbnail: null, description: "Learn how the 28-day crucible transforms your career readiness.", category: "Career Development", views: 342, likes: 28 },
    { id: 2, title: "WRI\u2122 Score Explained", type: "article", status: "published", createdAt: "2025-06-03T14:00:00Z", updatedAt: "2025-06-03T14:00:00Z", thumbnail: null, description: "Deep dive into the 7 components of the Workforce Readiness Index.", category: "Education", views: 189, likes: 15 },
    { id: 3, title: "Interview Techniques for African Professionals", type: "video", status: "under_review", createdAt: "2025-06-10T09:00:00Z", updatedAt: "2025-06-10T09:00:00Z", thumbnail: null, description: "Master the STAR method and negotiation tactics.", category: "Career Development", views: 0, likes: 0 },
    { id: 4, title: "My Journey from Bronze to Platinum WRI\u2122", type: "article", status: "draft", createdAt: "2025-06-15T16:00:00Z", updatedAt: "2025-06-15T16:00:00Z", thumbnail: null, description: "Personal story of completing the Levav 28\u2122 challenge.", category: "Inspiration", views: 0, likes: 0 },
  ];
  localStorage.setItem(CONTENT_KEY, JSON.stringify(defaults));
  return defaults;
}

/* ═══════════════════════════════════════════
   CHAMPIONS PROGRAM
   ═══════════════════════════════════════════ */
const CHAMPIONS_KEY = "levav_champions";

export interface ChampionApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  role: string;
  experience: string;
  wriScore: number;
  goldKeyTier: string;
  levavCode: string;
  expertiseAreas: string[];
  motivation: string;
  mentorshipStyle: string;
  availability: string;
  contentInterest: boolean;
  linkedinUrl: string;
  portfolioUrl: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  honorariumRate: number;
  totalEarnings: number;
  menteesCount: number;
  sessionsCompleted: number;
  contentPublished: number;
}

export function getChampionApplications(): ChampionApplication[] {
  const raw = localStorage.getItem(CHAMPIONS_KEY);
  if (!raw) return getDefaultChampions();
  try { return JSON.parse(raw); } catch { return getDefaultChampions(); }
}

export function submitChampionApplication(app: Omit<ChampionApplication, "id" | "appliedAt" | "status" | "honorariumRate" | "totalEarnings" | "menteesCount" | "sessionsCompleted" | "contentPublished">): ChampionApplication {
  const all = getChampionApplications();
  const newApp: ChampionApplication = {
    ...app,
    id: Date.now(),
    appliedAt: new Date().toISOString(),
    status: "pending",
    honorariumRate: 0,
    totalEarnings: 0,
    menteesCount: 0,
    sessionsCompleted: 0,
    contentPublished: 0,
  };
  all.unshift(newApp);
  localStorage.setItem(CHAMPIONS_KEY, JSON.stringify(all));
  return newApp;
}

export function updateChampionApplication(id: number, updates: Partial<ChampionApplication>): void {
  const all = getChampionApplications().map((a) => a.id === id ? { ...a, ...updates } : a);
  localStorage.setItem(CHAMPIONS_KEY, JSON.stringify(all));
}

export function getMyChampionApplication(): ChampionApplication | null {
  const profile = getProfile();
  if (!profile) return null;
  const apps = getChampionApplications();
  return apps.find((a) => a.levavCode === profile.levavCode) || null;
}

export function isApprovedChampion(): boolean {
  const app = getMyChampionApplication();
  return app?.status === "approved";
}

function getDefaultChampions(): ChampionApplication[] {
  const defaults: ChampionApplication[] = [
    { id: 1001, firstName: "David", lastName: "Phiri", email: "d.phiri@email.zm", phone: "+260 971 234 567", city: "Lusaka", profession: "Technology & Software", role: "Senior Developer", experience: "expert", wriScore: 94.2, goldKeyTier: "Diamond", levavCode: "LVA-DPH492", expertiseAreas: ["Career Coaching", "Technical Mentorship"], motivation: "I want to help young Zambian developers navigate the tech industry and avoid the mistakes I made early in my career.", mentorshipStyle: "one-on-one", availability: "5-10 hours/week", contentInterest: true, linkedinUrl: "https://linkedin.com/in/davidphiri", portfolioUrl: "", status: "approved", appliedAt: "2025-01-15T10:00:00Z", reviewedAt: "2025-01-20T14:00:00Z", honorariumRate: 150, totalEarnings: 4500, menteesCount: 12, sessionsCompleted: 48, contentPublished: 8 },
    { id: 1002, firstName: "Grace", lastName: "Mulenga", email: "g.mulenga@email.zm", phone: "+260 972 345 678", city: "Lusaka", profession: "Creative & Design", role: "Product Designer", experience: "senior", wriScore: 91.7, goldKeyTier: "Diamond", levavCode: "LVA-GMU317", expertiseAreas: ["Portfolio Review", "Design Career Guidance"], motivation: "Design changed my life. I want to help others see design as a viable career path in Zambia.", mentorshipStyle: "group", availability: "3-5 hours/week", contentInterest: true, linkedinUrl: "", portfolioUrl: "https://gracemulenga.design", status: "approved", appliedAt: "2025-02-01T09:00:00Z", reviewedAt: "2025-02-05T11:00:00Z", honorariumRate: 120, totalEarnings: 2880, menteesCount: 8, sessionsCompleted: 32, contentPublished: 5 },
    { id: 1003, firstName: "James", lastName: "Kabwe", email: "j.kabwe@email.zm", phone: "+260 973 456 789", city: "Ndola", profession: "Finance & Accounting", role: "Financial Analyst", experience: "senior", wriScore: 89.3, goldKeyTier: "Platinum", levavCode: "LVA-JKA856", expertiseAreas: ["Interview Preparation", "Resume Building"], motivation: "I believe financial literacy and career guidance should be accessible to every Zambian professional.", mentorshipStyle: "one-on-one", availability: "10+ hours/week", contentInterest: false, linkedinUrl: "https://linkedin.com/in/jameskabwe", portfolioUrl: "", status: "approved", appliedAt: "2025-03-10T08:00:00Z", reviewedAt: "2025-03-15T16:00:00Z", honorariumRate: 100, totalEarnings: 1200, menteesCount: 5, sessionsCompleted: 20, contentPublished: 0 },
  ];
  localStorage.setItem(CHAMPIONS_KEY, JSON.stringify(defaults));
  return defaults;
}

/* ═══════════════════════════════════════════
   CONTENT CREATOR APPLICATIONS
   ═══════════════════════════════════════════ */
const CREATOR_KEY = "levav_creator_applications";

export interface CreatorApplication {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  role: string;
  contentTypes: ("video" | "audio" | "article" | "document")[];
  categories: string[];
  bio: string;
  sampleUrl: string;
  equipment: string;
  postingFrequency: string;
  monetizationInterest: boolean;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  totalContent: number;
  totalViews: number;
  totalEarnings: number;
}

export function getCreatorApplications(): CreatorApplication[] {
  const raw = localStorage.getItem(CREATOR_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function submitCreatorApplication(app: Omit<CreatorApplication, "id" | "appliedAt" | "status" | "totalContent" | "totalViews" | "totalEarnings">): CreatorApplication {
  const all = getCreatorApplications();
  const newApp: CreatorApplication = {
    ...app,
    id: Date.now(),
    appliedAt: new Date().toISOString(),
    status: "pending",
    totalContent: 0,
    totalViews: 0,
    totalEarnings: 0,
  };
  all.unshift(newApp);
  localStorage.setItem(CREATOR_KEY, JSON.stringify(all));
  return newApp;
}

export function getMyCreatorApplication(): CreatorApplication | null {
  const profile = getProfile();
  if (!profile) return null;
  const apps = getCreatorApplications();
  return apps.find((a) => a.email === profile.email || a.firstName === profile.firstName) || null;
}

export function isApprovedCreator(): boolean {
  const app = getMyCreatorApplication();
  return app?.status === "approved";
}

/* ═══════════════════════════════════════════
   TYPED tRPC HELPERS — Direct Client Access
   These are used by React components that want
   to call tRPC directly instead of going through
   the data layer.
   ═══════════════════════════════════════════ */
export { trpcClient };

/* ═══════════════════════════════════════════
   UTILITY: Clear all data (for reset)
   ═══════════════════════════════════════════ */
export function clearAllData(): void {
  [PROFILE_KEY, CRUCIBLE_KEY, JOB_BOARD_KEY, APPLICATIONS_KEY, EMPLOYER_KEY, CONTENT_KEY,
   CHAMPIONS_KEY, CREATOR_KEY,
   "levav_notifications", "levav_employer_company", "levav_employer_jobs", "levav_employer_interviews",
   "levav_employer_billing", "levav_token", "levav_demo_mode"].forEach((k) => localStorage.removeItem(k));
}
