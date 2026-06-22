/**
 * ============================================================
 * EMPLOYER STORAGE — localStorage Persistence
 * ============================================================
 * Saves company profile, jobs, and interviews to localStorage
 * so data survives page refreshes. Base64 images are preserved.
 * ============================================================
 */

const KEYS = {
  company: "levav_employer_company",
  jobs: "levav_employer_jobs",
  interviews: "levav_employer_interviews",
};

export function loadCompany<T>(fallback: T): T {
  const raw = localStorage.getItem(KEYS.company);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function saveCompany(data: any): void {
  localStorage.setItem(KEYS.company, JSON.stringify(data));
}

export function loadJobs<T>(fallback: T): T {
  const raw = localStorage.getItem(KEYS.jobs);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function saveJobs(data: any[]): void {
  localStorage.setItem(KEYS.jobs, JSON.stringify(data));
}

export function loadInterviews<T>(fallback: T): T {
  const raw = localStorage.getItem(KEYS.interviews);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function saveInterviews(data: any[]): void {
  localStorage.setItem(KEYS.interviews, JSON.stringify(data));
}

export function clearEmployerStorage(): void {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
