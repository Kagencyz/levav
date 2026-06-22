/**
 * ============================================================
 * APPLICATION STORE — Talent applies → Employer sees
 * ============================================================
 * When a talent clicks "Apply" on a job, it creates an entry here.
 * The employer dashboard reads from this store to see incoming
 * applicants. Bidirectional flow.
 * ============================================================
 */

const STORAGE_KEY = "levav_applications";

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

const defaultApplications: JobApplication[] = [];

export function loadApplications(): JobApplication[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultApplications;
  try { return JSON.parse(raw); } catch { return defaultApplications; }
}

export function submitApplication(app: Omit<JobApplication, "id" | "appliedDate" | "status">): JobApplication {
  const all = loadApplications();
  const newApp: JobApplication = {
    ...app,
    id: Date.now(),
    appliedDate: new Date().toISOString().split("T")[0],
    status: "new",
  };
  all.unshift(newApp);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return newApp;
}

export function updateApplicationStatus(id: number, status: JobApplication["status"]): void {
  const all = loadApplications().map((a) => a.id === id ? { ...a, status } : a);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getApplicationsForEmployer(companyName?: string): JobApplication[] {
  const all = loadApplications();
  if (!companyName) return all;
  return all.filter((a) => a.company === companyName);
}

export function clearApplications(): void {
  localStorage.removeItem(STORAGE_KEY);
}
