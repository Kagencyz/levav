/**
 * ============================================================
 * SHARED JOB STORE — Employer posts → Talent sees
 * ============================================================
 * Single source of truth for job postings. Employers write here
 * when posting jobs. The talent-facing Jobs page reads from here.
 * Data is stored as base64 objects so images survive localStorage.
 * ============================================================
 */

const STORAGE_KEY = "levav_job_board";
const BOARD_VERSION = "v2"; // bump to force re-seed on deadline/format changes
const VERSION_KEY = "levav_job_board_version";

export interface JobBoardEntry {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  status: "active" | "paused" | "closed";
  applicants: number;
  views: number;
  logo?: string | null;
  thumbnail?: string | null;
}

const defaultJobs: JobBoardEntry[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "BongoHive",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salary: "ZMW 15,000 - 25,000",
    description: "Join our engineering team building scalable web applications for the African market.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Team leadership"],
    postedDate: "2025-06-10",
    deadline: "2026-08-30",
    status: "active",
    applicants: 24,
    views: 342,
    logo: null,
    thumbnail: null,
  },
  {
    id: 2,
    title: "Product Designer",
    company: "BongoHive",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salary: "ZMW 12,000 - 18,000",
    description: "Design user-centered products that solve real problems for African users.",
    requirements: ["Figma expertise", "User research", "Design systems"],
    postedDate: "2025-06-08",
    deadline: "2026-08-25",
    status: "active",
    applicants: 18,
    views: 289,
    logo: null,
    thumbnail: null,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "BongoHive",
    location: "Remote",
    type: "Full-time",
    salary: "ZMW 18,000 - 28,000",
    description: "Build and maintain our cloud infrastructure across AWS and Azure.",
    requirements: ["AWS/Azure certified", "Kubernetes", "CI/CD pipelines"],
    postedDate: "2025-06-05",
    deadline: "2026-08-20",
    status: "active",
    applicants: 12,
    views: 198,
    logo: null,
    thumbnail: null,
  },
  {
    id: 4,
    title: "Customer Success Manager",
    company: "BongoHive",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salary: "ZMW 8,000 - 14,000",
    description: "Ensure our clients achieve their goals with our products.",
    requirements: ["3+ years CS experience", "CRM tools", "Communication"],
    postedDate: "2025-06-01",
    deadline: "2026-08-15",
    status: "paused",
    applicants: 31,
    views: 456,
    logo: null,
    thumbnail: null,
  },
  {
    id: 5,
    title: "Junior UX Researcher",
    company: "ZamHealth",
    location: "Kitwe, Zambia",
    type: "Full-time",
    salary: "ZMW 6,000 - 10,000",
    description: "Conduct user research for health-tech products serving rural communities.",
    requirements: ["User research methods", "Interview facilitation", "Data synthesis"],
    postedDate: "2025-06-14",
    deadline: "2026-09-10",
    status: "active",
    applicants: 8,
    views: 124,
    logo: null,
    thumbnail: null,
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Fintech Zambia",
    location: "Lusaka, Zambia",
    type: "Full-time",
    salary: "ZMW 20,000 - 35,000",
    description: "Build ML models for fraud detection and credit scoring.",
    requirements: ["Python/R", "Machine Learning", "SQL", "Statistics"],
    postedDate: "2025-06-12",
    deadline: "2026-09-05",
    status: "active",
    applicants: 15,
    views: 267,
    logo: null,
    thumbnail: null,
  },
];

export function loadJobBoard(): JobBoardEntry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const version = localStorage.getItem(VERSION_KEY);

  // Re-seed if: no data, version mismatch, or empty array
  if (!raw || version !== BOARD_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultJobs));
    localStorage.setItem(VERSION_KEY, BOARD_VERSION);
    return defaultJobs;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    // Corrupted — reset
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
}

export function addJobToBoard(job: Omit<JobBoardEntry, "id" | "applicants" | "views">): JobBoardEntry {
  const board = loadJobBoard();
  const newJob: JobBoardEntry = {
    ...job,
    id: Date.now(),
    applicants: 0,
    views: 0,
  };
  board.unshift(newJob);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  return newJob;
}

export function saveJobBoard(jobs: JobBoardEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function incrementApplicantCount(jobId: number): void {
  const board = loadJobBoard();
  const updated = board.map((j) => j.id === jobId ? { ...j, applicants: j.applicants + 1 } : j);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function editJobOnBoard(jobId: number, updates: Partial<JobBoardEntry>): JobBoardEntry | null {
  const board = loadJobBoard();
  let updatedJob: JobBoardEntry | null = null;
  const updated = board.map((j) => {
    if (j.id === jobId) {
      updatedJob = { ...j, ...updates };
      return updatedJob;
    }
    return j;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedJob;
}

export function removeJobFromBoard(jobId: number): void {
  const board = loadJobBoard().filter((j) => j.id !== jobId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function updateJobStatus(jobId: number, status: JobBoardEntry["status"]): void {
  const board = loadJobBoard().map((j) => j.id === jobId ? { ...j, status } : j);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function clearJobBoard(): void {
  localStorage.removeItem(STORAGE_KEY);
}
