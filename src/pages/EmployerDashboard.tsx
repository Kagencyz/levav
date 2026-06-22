/**
 * ============================================================
 * EMPLOYER DASHBOARD (/employer) — COMPLETE B2B PORTAL
 * ============================================================
 * Fixed: All data safely accessed with fallbacks. Image upload
 * for logos, avatars, job thumbnails. Rich text editor for job
 * descriptions. Push notifications on every action.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { ImageUpload } from "@/components/ImageUpload";
import { RichTextEditor } from "@/components/RichTextEditor";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import {
  demoCompany, demoJobs, demoApplicants, demoInterviews, demoTalentPool,
} from "@/lib/employer-demo-data";
import {
  loadCompany, saveCompany, loadJobs, saveJobs, loadInterviews, saveInterviews, clearEmployerStorage,
} from "@/lib/employer-storage";
import { downloadCV } from "@/lib/cv-download";
import type { CVData } from "@/lib/cv-download";
import { addJobToBoard, editJobOnBoard, removeJobFromBoard, updateJobStatus } from "@/lib/job-store";
import { loadApplications } from "@/lib/application-store";
import type { JobApplication } from "@/lib/application-store";
import { loadBilling, PLANS, upgradePlan, remainingJobs, remainingFeatured, incrementJobPosted } from "@/lib/employer-billing";
import type { BillingState, PlanType } from "@/lib/employer-billing";
import {
  notifyInterviewScheduled, notifyJobPosted, notifyTalentViewed, notifyStatusChanged, notifyApplicationReceived,
} from "@/lib/notifications";
import {
  Building2, Briefcase, Users, Calendar, Star, Search,
  Plus, ChevronRight, ChevronLeft, CheckCircle2, Clock,
  Phone, Video, UserCircle, TrendingUp, Eye, Award, BadgeCheck,
  X, Mail, BarChart3, MessageCircle, Settings, ThumbsUp, Send,
  Bell, ArrowRight, FileText, Sparkles, Globe, MapPin, Edit3, Trash2, PauseCircle, Play, Archive, CreditCard, Zap, Crown,
} from "lucide-react";

type Tab = "overview" | "jobs" | "applicants" | "talent" | "interviews" | "analytics" | "messages" | "billing" | "settings";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400",
  screening: "bg-amber-500/10 text-amber-400",
  interview: "bg-[#7E3BED]/10 text-[#7E3BED]",
  offer: "bg-[#C6FF34]/10 text-[#C6FF34]",
  hired: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
};

const TIER_COLORS: Record<string, string> = {
  Diamond: "text-[#C6FF34]", Platinum: "text-[#7E3BED]", Gold: "text-yellow-400",
  Silver: "text-gray-300", Bronze: "text-amber-600",
};

/* ─── Safe data accessors ─── */
const safe = (v: any, fallback = "—") => v ?? fallback;
const safeArr = (v: any) => Array.isArray(v) ? v : [];

/* ─── Merge incoming applications from talent apply flow ─── */
function mergeIncomingApplicants(base: typeof demoApplicants): typeof demoApplicants {
  const incoming = loadApplications();
  if (incoming.length === 0) return base;
  const converted = incoming.map((app: JobApplication, idx: number) => ({
    id: 1000 + idx,
    firstName: app.firstName,
    lastName: app.lastName,
    levavCode: app.levavCode || `LVA-${app.lastName?.substring(0, 3).toUpperCase() || "XXX"}001`,
    wriScore: app.wriScore,
    goldKeyTier: app.goldKeyTier || "Silver",
    profession: app.profession,
    city: "Zambia",
    appliedFor: app.jobTitle,
    appliedDate: app.appliedDate,
    status: app.status,
    coverLetter: app.coverLetter || `I am applying for the ${app.jobTitle} position at ${app.company}. I believe my skills in ${app.skills?.join(", ") || "various areas"} make me a strong candidate.`,
    skills: app.skills || [],
    experience: app.experience,
    rating: (app.wriScore || 60) / 20,
    cvUploaded: false,
    cvFilename: "",
    portfolioUrl: null,
    certifications: [],
    levav28Progress: Math.floor(Math.random() * 15) + 3,
    levav28AvgScore: app.wriScore - 5,
    wriComponents: {
      culture: Math.min(100, (app.wriScore || 60) + 5),
      criticalThinking: Math.min(100, (app.wriScore || 60) + 3),
      reliability: Math.min(100, (app.wriScore || 60) + 8),
      communication: Math.min(100, (app.wriScore || 60) + 2),
      learning: Math.min(100, (app.wriScore || 60) + 4),
      leadership: Math.min(100, (app.wriScore || 60) - 5),
      impact: Math.min(100, (app.wriScore || 60) + 6),
    },
    education: "BSc / Diploma",
    phone: app.phone,
    email: app.email,
    linkedIn: null,
    languages: ["English"],
    references: [],
  }));
  return [...converted, ...base];
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function EmployerDashboard() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<number | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<number | null>(null);
  const [selectedJobFilter, setSelectedJobFilter] = useState<number | null>(null);
  const [localJobs, setLocalJobs] = useState(() => loadJobs(demoJobs));
  const [localApplicants, setLocalApplicants] = useState(() => mergeIncomingApplicants(demoApplicants));
  const [localInterviews, setLocalInterviews] = useState(() => loadInterviews(demoInterviews));
  const [company, setCompany] = useState(() => loadCompany(demoCompany));
  const [showPostJob, setShowPostJob] = useState(false);
  const [showEditJob, setShowEditJob] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<any>(null);
  const [billing, setBilling] = useState<BillingState>(() => loadBilling());

  /* tRPC: Load employer data from backend */
  const { data: trpcEmployer } = trpc.employer.me.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });
  const { data: trpcApplicants } = trpc.application.myApplicants.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  /* ─── Persist state to localStorage ─── */
  useEffect(() => { saveCompany(company); }, [company]);
  useEffect(() => { saveJobs(localJobs); }, [localJobs]);
  useEffect(() => { saveInterviews(localInterviews); }, [localInterviews]);

  /* Sync tRPC employer data into local state */
  useEffect(() => {
    if (trpcEmployer) {
      const mapped = {
        name: trpcEmployer.companyName || company.name,
        industry: trpcEmployer.industry || company.industry,
        location: trpcEmployer.location || company.location,
        companySize: company.companySize,
        website: company.website,
        description: trpcEmployer.description || company.description,
        contactName: company.contactName,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        logo: company.logo,
      };
      setCompany(mapped);
    }
  }, [trpcEmployer]);

  /* Sync tRPC applicants into local state */
  useEffect(() => {
    if (trpcApplicants && Array.isArray(trpcApplicants) && trpcApplicants.length > 0) {
      const mapped = trpcApplicants.map((a: any) => ({
        id: a.id,
        name: a.talentName || "Candidate",
        role: a.jobTitle || "Applicant",
        wriScore: a.wriScore || 0,
        goldKeyTier: a.goldKeyTier || "Gold",
        status: a.status || "new",
        appliedDate: a.appliedAt ? a.appliedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        experience: "3-5 years",
        skills: a.skills ? JSON.parse(a.skills) : [],
        avatar: null,
      }));
      setLocalApplicants(mapped);
    }
  }, [trpcApplicants]);

  const [notifCount] = useState(() => {
    const raw = localStorage.getItem("levav_notifications");
    if (!raw) return 3;
    try { return JSON.parse(raw).filter((n: any) => !n.read && n.toRole === "employer").length || 3; } catch { return 3; }
  });

  const activeJobs = localJobs.filter((j) => j.status === "active");
  const totalApplicants = localApplicants.length;
  const scheduledInts = localInterviews.filter((i) => i.status === "scheduled").length;
  const avgWri = localApplicants.length > 0 ? (localApplicants.reduce((s, a) => s + (a.wriScore || 0), 0) / localApplicants.length) : 0;

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: "overview", label: "Overview", icon: <Building2 className="w-4 h-4" /> },
    { key: "jobs", label: "Jobs", icon: <Briefcase className="w-4 h-4" />, count: activeJobs.length },
    { key: "applicants", label: "Applicants", icon: <Users className="w-4 h-4" />, count: localApplicants.filter((a) => a.status === "new").length },
    { key: "talent", label: "Talent Pool", icon: <Award className="w-4 h-4" />, count: demoTalentPool.filter((t) => t.available).length },
    { key: "interviews", label: "Interviews", icon: <Calendar className="w-4 h-4" />, count: scheduledInts },
    { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "messages", label: "Messages", icon: <MessageCircle className="w-4 h-4" />, count: 3 },
    { key: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" />, count: billing.plan === "free" ? undefined : 0 },
    { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-6xl mx-auto py-6 sm:py-8">
        {/* ─── HEADER ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center text-xl font-bold text-white">
                {company.name?.charAt(0) || "B"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-hero text-xl sm:text-2xl truncate">{safe(company.name, "Company")}</h1>
                {company.verificationStatus === "verified" && <BadgeCheck className="w-5 h-5 text-[#C6FF34] flex-shrink-0" />}
                <PlanBadge plan={billing.plan} />
              </div>
              <p className="text-xs text-white/50">{safe(company.industry)} · {safe(company.location)} · {safe(company.companySize)}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <span className="badge-violet">Verified Employer</span>
              <Link to="/notifications" className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4 text-white/50" />
                {notifCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C6FF34]" />}
              </Link>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-white/5">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSearch(""); setSelectedApplicant(null); setSelectedTalent(null); }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"
                }`}>
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-white/5 text-white/40"}`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ─── CONTENT ─── */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab key="ov" stats={{ activeJobs: activeJobs.length, totalApplicants, scheduledInts, avgWri }}
              recentApplicants={localApplicants.slice(0, 4)} upcomingInterviews={localInterviews.filter((i) => i.status === "scheduled")}
              onViewApplicant={(id: number) => { setSelectedApplicant(id); setActiveTab("applicants"); }}
              onViewInterviews={() => setActiveTab("interviews")} onPostJob={() => setShowPostJob(true)} onBrowseTalent={() => setActiveTab("talent")} />
          )}
          {activeTab === "jobs" && (
            <JobsTab key="jb" jobs={localJobs} onPostJob={() => setShowPostJob(true)}
              onViewApplicants={(id: number) => { setSelectedJobFilter(id); setActiveTab("applicants"); }}
              onEditJob={(job: any) => { setEditingJob(job); setShowEditJob(true); }}
              onDeleteJob={(jobId: number) => {
                if (confirm("Delete this job posting?")) {
                  setLocalJobs((prev) => prev.filter((j) => j.id !== jobId));
                  removeJobFromBoard(jobId);
                }
              }}
              onToggleStatus={(jobId: number, current: string) => {
                const next = current === "active" ? "paused" : current === "paused" ? "closed" : "active";
                setLocalJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, status: next } : j));
                updateJobStatus(jobId, next as any);
              }} />
          )}
          {activeTab === "applicants" && (
            <ApplicantsTab key="ap" applicants={localApplicants} jobs={localJobs} search={search} setSearch={setSearch}
              selectedFilter={selectedJobFilter} setSelectedFilter={setSelectedJobFilter}
              selectedApplicant={selectedApplicant} setSelectedApplicant={setSelectedApplicant}
              onStatusChange={(id: number, status: string) => {
                setLocalApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: status as any } : a));
                notifyStatusChanged("Applicant", localJobs[0]?.title ?? "", status);
              }}
              onScheduleInterview={(a: any) => { setScheduleTarget(a); setShowSchedule(true); }}
              onSendMessage={(id: number) => { setActiveTab("messages"); }} />
          )}
          {activeTab === "talent" && (
            <TalentTab key="tp" talentPool={demoTalentPool} search={search} setSearch={setSearch}
              selectedTalent={selectedTalent} setSelectedTalent={setSelectedTalent}
              onLikeTalent={(name: string) => notifyTalentViewed(company.name, name)} />
          )}
          {activeTab === "interviews" && (
            <InterviewsTab key="iv" interviews={localInterviews}
              onReschedule={(iv: any) => { setScheduleTarget({ applicantId: iv.id, applicantName: iv.applicantName, jobTitle: iv.jobTitle }); setShowSchedule(true); }}
              onCancel={(id: number) => setLocalInterviews((prev) => prev.map((i) => i.id === id ? { ...i, status: "cancelled" as any } : i))} />
          )}
          {activeTab === "analytics" && <AnalyticsTab key="an" jobs={localJobs} applicants={localApplicants} interviews={localInterviews} />}
          {activeTab === "messages" && <MessagesTab key="ms" applicants={localApplicants} />}
          {activeTab === "billing" && <BillingTab key="bl" billing={billing} onUpgrade={(plan: PlanType) => { const updated = upgradePlan(plan); setBilling(updated); }} />}
          {activeTab === "settings" && <SettingsTab key="st" company={company} onCompanyUpdate={setCompany} />}
        </AnimatePresence>

        {/* ─── MODALS ─── */}
        {showPostJob && (
          <PostJobModal onClose={() => setShowPostJob(false)} onPost={(job: any) => {
            setLocalJobs((prev) => [job, ...prev]);
            // Also publish to the talent-facing job board
            addJobToBoard({
              title: job.title,
              company: company.name,
              location: job.location,
              type: job.type,
              salary: job.salaryRange,
              description: job.description,
              requirements: job.requirements || [],
              postedDate: job.postedDate,
              status: "active",
              thumbnail: job.thumbnail || null,
              logo: company.logo || null,
            });
            notifyJobPosted(company.name, job.title);
            setShowPostJob(false);
          }} />
        )}
        {showEditJob && editingJob && (
          <EditJobModal job={editingJob} companyName={company.name} companyLogo={company.logo}
            onClose={() => { setShowEditJob(false); setEditingJob(null); }}
            onSave={(updated: any) => {
              setLocalJobs((prev) => prev.map((j) => j.id === updated.id ? { ...j, ...updated } : j));
              editJobOnBoard(updated.id, {
                title: updated.title,
                location: updated.location,
                type: updated.type,
                salary: updated.salaryRange,
                description: updated.description,
                requirements: updated.requirements || [],
                thumbnail: updated.thumbnail || null,
                logo: company.logo || null,
                deadline: updated.deadline,
              });
              setShowEditJob(false); setEditingJob(null);
            }} />
        )}
        {showSchedule && scheduleTarget && (
          <ScheduleInterviewModal applicantName={scheduleTarget.applicantName} jobTitle={scheduleTarget.jobTitle}
            onClose={() => { setShowSchedule(false); setScheduleTarget(null); }}
            onSchedule={(iv: any) => {
              setLocalInterviews((prev) => [...prev, iv]);
              notifyInterviewScheduled(company.name, scheduleTarget.applicantName, scheduleTarget.jobTitle, iv.date, iv.time);
              setShowSchedule(false); setScheduleTarget(null); setActiveTab("interviews");
            }} />
        )}
      </div>
    </div>
  );
}

/* ─── Plan badge ─── */
function PlanBadge({ plan }: { plan: PlanType }) {
  if (plan === "free") return null;
  if (plan === "pro") return <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7E3BED]/20 text-[#7E3BED] border border-[#7E3BED]/30 font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> Pro</span>;
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6FF34]/20 text-[#C6FF34] border border-[#C6FF34]/30 font-semibold flex items-center gap-1"><Crown className="w-3 h-3" /> Enterprise</span>;
}

/* ─── Deadline badge helper ─── */
function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return <span className="flex items-center gap-1 text-red-400"><Clock className="w-3 h-3" /> Expired</span>;
  if (days <= 3) return <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3 h-3" /> {days}d left</span>;
  return <span className="flex items-center gap-1 text-white/30"><Clock className="w-3 h-3" /> {days}d left</span>;
}

/* ═══════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════ */
function OverviewTab({ stats, recentApplicants, upcomingInterviews, onViewApplicant, onViewInterviews, onPostJob, onBrowseTalent }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Jobs" value={stats.activeJobs} icon={<Briefcase className="w-5 h-5" />} delay={0} />
        <StatCard label="Applicants" value={stats.totalApplicants} icon={<Users className="w-5 h-5" />} delay={0.05} />
        <StatCard label="Interviews" value={stats.scheduledInts} icon={<Calendar className="w-5 h-5" />} delay={0.1} />
        <StatCard label="Avg WRI™" value={stats.avgWri.toFixed(1)} icon={<TrendingUp className="w-5 h-5" />} delay={0.15} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard variant="strong" delay={0.2} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section text-base">Recent Applicants</h2>
            <button className="text-xs text-[#C6FF34] hover:underline flex items-center gap-1"><ArrowRight className="w-3 h-3" /> View All</button>
          </div>
          <div className="space-y-2">
            {recentApplicants.map((a: any) => (
              <div key={a.id} onClick={() => onViewApplicant(a.id)}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">{(a.firstName || "?")[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/90">{safe(a.firstName)} {safe(a.lastName)}</span>
                    <span className={`text-[10px] font-semibold ${TIER_COLORS[a.goldKeyTier] || ""}`}>{a.goldKeyTier}</span>
                  </div>
                  <p className="text-xs text-white/40">{safe(a.profession)} · {safe(a.appliedFor)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="flex items-center gap-1 justify-end text-sm font-bold text-[#C6FF34]"><Star className="w-3 h-3" /> {(a.wriScore || 0).toFixed(1)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_STYLES[a.status] || ""}`}>{a.status}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#C6FF34]" />
              </div>
            ))}
          </div>
        </GlassCard>
        <div className="space-y-4">
          <GlassCard variant="strong" delay={0.25}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-section text-base">Upcoming</h2>
              <button onClick={onViewInterviews} className="text-xs text-[#C6FF34] hover:underline">All</button>
            </div>
            {upcomingInterviews.length > 0 ? upcomingInterviews.map((iv: any) => (
              <div key={iv.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] mb-2">
                <div className="p-2 rounded-lg bg-[#7E3BED]/10 text-[#7E3BED]"><Video className="w-4 h-4" /></div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-white/90">{iv.applicantName}</p>
                  <p className="text-[10px] text-white/40">{iv.date} at {iv.time}</p>
                </div>
              </div>
            )) : <p className="text-xs text-white/30 text-center py-4">No upcoming interviews</p>}
          </GlassCard>
          <GlassCard variant="strong" delay={0.3}>
            <h2 className="text-section text-base mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[{ label: "Post Job", icon: <Plus className="w-5 h-5" />, action: onPostJob, color: "bg-[#C6FF34]/10 text-[#C6FF34]" },
                { label: "Talent Pool", icon: <Award className="w-5 h-5" />, action: onBrowseTalent, color: "bg-[#7E3BED]/10 text-[#7E3BED]" },
              ].map((a) => (
                <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all group">
                  <div className={`p-2 rounded-lg ${a.color}`}>{a.icon}</div>
                  <span className="text-xs text-white/70">{a.label}</span>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   JOBS TAB
   ═══════════════════════════════════════════ */
function JobsTab({ jobs, onPostJob, onViewApplicants, onEditJob, onDeleteJob, onToggleStatus }: any) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = statusFilter === "all" ? jobs : jobs.filter((j: any) => j.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-section text-base">Job Postings ({filtered.length})</h2>
        <button onClick={onPostJob} className="btn-lime flex items-center gap-2 text-xs"><Plus className="w-3.5 h-3.5" /> Post New Job</button>
      </div>
      {/* Status filter pills */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        {["all", "active", "paused", "closed"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[10px] px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${statusFilter === s ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20" : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"}`}>
            {s[0].toUpperCase() + s.slice(1)} {s !== "all" && `(${jobs.filter((j: any) => j.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((job: any) => (
          <GlassCard key={job.id} variant="interactive" glow={false}>
            {job.thumbnail && (
              <div className="aspect-video rounded-lg overflow-hidden mb-4 -mx-5 -mt-5">
                <img src={job.thumbnail} alt={job.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${job.status === "active" ? "bg-[#C6FF34]/10 text-[#C6FF34]" : job.status === "paused" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/40"}`}>{job.status}</span>
                  {job.status === "paused" && <span className="text-[10px] text-amber-400/60">Hidden from job board</span>}
                  {job.newApplicants > 0 && <span className="badge-lime text-[10px]">{job.newApplicants} new</span>}
                </div>
                <p className="text-xs text-white/40 mb-2">{safe(job.department)} · {safe(job.location)} · {safe(job.type)}</p>
                {job.description && (
                  <div className="text-xs text-white/50 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: job.description }} />
                )}
                <div className="flex items-center gap-4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applicants || 0} applicants</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {job.views || 0} views</span>
                  <span>{safe(job.salaryRange || job.salary)}</span>
                  {job.deadline && <DeadlineBadge deadline={job.deadline} />}
                </div>
              </div>
            </div>
            {/* Action bar */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
              <button onClick={() => onViewApplicants(job.id)} className="text-[10px] text-[#C6FF34] hover:underline flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"><Users className="w-3 h-3" /> Applicants</button>
              <span className="text-white/10">|</span>
              <button onClick={() => onEditJob(job)} className="text-[10px] text-white/40 hover:text-white/80 flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"><Edit3 className="w-3 h-3" /> Edit</button>
              <span className="text-white/10">|</span>
              <button onClick={() => onToggleStatus(job.id, job.status)}
                className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors ${job.status === "active" ? "text-amber-400 hover:text-amber-300" : job.status === "paused" ? "text-white/40 hover:text-white/60" : "text-[#C6FF34] hover:text-[#C6FF34]"}`}
                title={job.status === "active" ? "Pause (hide from job board)" : job.status === "paused" ? "Close posting" : "Reactivate"}>
                {job.status === "active" ? <><PauseCircle className="w-3 h-3" /> Pause</> : job.status === "paused" ? <><Archive className="w-3 h-3" /> Close</> : <><Play className="w-3 h-3" /> Reactivate</>}
              </button>
              <span className="text-white/10">|</span>
              <button onClick={() => onDeleteJob(job.id)} className="text-[10px] text-red-400/50 hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-400/5 transition-colors"><Trash2 className="w-3 h-3" /> Delete</button>
              <span className="text-white/10 ml-auto">|</span>
              <span className="text-[10px] text-white/20">Posted {safe(job.postedDate)}</span>
              {job.deadline && (
                <>
                  <span className="text-white/10">|</span>
                  <span className="text-[10px] text-white/20 flex items-center gap-1">Closes {safe(job.deadline)}</span>
                </>
              )}
            </div>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">No {statusFilter !== "all" ? statusFilter : ""} job postings</p>
            <button onClick={onPostJob} className="btn-lime text-xs mt-3">Post Your First Job</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   APPLICANTS TAB
   ═══════════════════════════════════════════ */
function ApplicantsTab({ applicants, jobs, search, setSearch, selectedFilter, setSelectedFilter, selectedApplicant, setSelectedApplicant, onStatusChange, onScheduleInterview, onSendMessage }: any) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = applicants.filter((a: any) => {
    const matchesSearch = `${a.firstName} ${a.lastName} ${a.profession} ${a.appliedFor}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesJob = selectedFilter === null || a.appliedFor === jobs.find((j: any) => j.id === selectedFilter)?.title;
    return matchesSearch && matchesStatus && matchesJob;
  });

  if (selectedApplicant !== null) {
    const applicant = applicants.find((a: any) => a.id === selectedApplicant);
    if (!applicant) return null;
    return <ApplicantDetail applicant={applicant} onBack={() => setSelectedApplicant(null)} onStatusChange={onStatusChange} onScheduleInterview={onScheduleInterview} onSendMessage={onSendMessage} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-section text-base">Applicants ({filtered.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search applicants..." className="input-levav text-xs pl-8 w-48" />
          </div>
          {selectedFilter !== null && (
            <span className="badge-lime text-[10px] flex items-center gap-1">{jobs.find((j: any) => j.id === selectedFilter)?.title}<button onClick={() => setSelectedFilter(null)}><X className="w-3 h-3" /></button></span>
          )}
        </div>
      </div>
      {/* Status filter pills */}
      <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
        {["all", "new", "screening", "interview", "offer", "hired", "rejected"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[10px] px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${statusFilter === s ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20" : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"}`}>
            {s[0].toUpperCase() + s.slice(1)} {s !== "all" && `(${applicants.filter((a: any) => a.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((a: any) => (
          <div key={a.id} onClick={() => setSelectedApplicant(a.id)}
            className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">{(a.firstName || "?")[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-white/90">{safe(a.firstName)} {safe(a.lastName)}</span>
                <span className={`text-[10px] font-semibold ${TIER_COLORS[a.goldKeyTier] || ""}`}>{a.goldKeyTier}</span>
                <span className="text-[10px] text-white/30">{safe(a.levavCode)}</span>
              </div>
              <p className="text-xs text-white/40">{safe(a.profession)} · {safe(a.appliedFor)} · {safe(a.experience)} exp</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1 text-[10px] text-[#C6FF34]"><Star className="w-3 h-3" /> {(a.wriScore || 0).toFixed(1)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_STYLES[a.status] || ""}`}>{a.status}</span>
                {a.cvUploaded && <span className="flex items-center gap-1 text-[10px] text-white/30"><FileText className="w-3 h-3" /> CV</span>}
                <span className="text-[10px] text-white/20">{safe(a.appliedDate)}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#C6FF34] flex-shrink-0" />
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-white/30 py-12">No applicants match your filters</p>}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   APPLICANT DETAIL VIEW
   ═══════════════════════════════════════════ */
function ApplicantDetail({ applicant, onBack, onStatusChange, onScheduleInterview, onSendMessage }: any) {
  const [subTab, setSubTab] = useState<"profile" | "cv" | "wri" | "crucible" | "notes">("profile");
  const [notes, setNotes] = useState(() => localStorage.getItem(`notes-${applicant.id}`) || "");

  const wriLabels = [
    { key: "culture", label: "Culture Fit", weight: 15 },
    { key: "criticalThinking", label: "Critical Thinking", weight: 15 },
    { key: "reliability", label: "Reliability", weight: 15 },
    { key: "communication", label: "Communication", weight: 15 },
    { key: "learning", label: "Learning Agility", weight: 15 },
    { key: "leadership", label: "Leadership", weight: 12 },
    { key: "impact", label: "Impact", weight: 13 },
  ];

  const saveNotes = (val: string) => {
    setNotes(val);
    localStorage.setItem(`notes-${applicant.id}`, val);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center">
          <span className="text-sm font-bold text-white">{(applicant.firstName || "?")[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-section text-sm sm:text-base">{safe(applicant.firstName)} {safe(applicant.lastName)}</h2>
            <span className={`text-[10px] font-semibold ${TIER_COLORS[applicant.goldKeyTier] || ""}`}>{applicant.goldKeyTier}</span>
          </div>
          <p className="text-[10px] text-white/40">{safe(applicant.levavCode)} · {safe(applicant.profession)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={applicant.status} onChange={(e) => onStatusChange(applicant.id, e.target.value)}
            className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/80 outline-none focus:border-[#C6FF34]/30">
            {["new", "screening", "interview", "offer", "hired", "rejected"].map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 border-b border-white/5 mb-4 overflow-x-auto">
        {(["profile", "cv", "wri", "crucible", "notes"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-all border-b-2 ${subTab === t ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"}`}>
            {t === "wri" ? "WRI™" : t === "crucible" ? "Levav 28™" : t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {/* Content */}
      {subTab === "profile" && (
        <GlassCard variant="strong">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs text-white/40 mb-2">Contact</h3>
              <div className="space-y-2">
                <p className="text-xs text-white/70 flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-white/30" /> {safe(applicant.email)}</p>
                <p className="text-xs text-white/70 flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-white/30" /> {safe(applicant.phone)}</p>
                {applicant.linkedIn && <p className="text-xs text-white/70 flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-white/30" /> {safe(applicant.linkedIn)}</p>}
                <p className="text-xs text-white/70 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-white/30" /> {safe(applicant.city)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs text-white/40 mb-2">Professional</h3>
              <div className="space-y-2">
                <p className="text-xs text-white/70">Education: {safe(applicant.education)}</p>
                <p className="text-xs text-white/70">Experience: {safe(applicant.experience)}</p>
                <p className="text-xs text-white/70">Applied for: {safe(applicant.appliedFor)}</p>
                <p className="text-xs text-white/70">Applied: {safe(applicant.appliedDate)}</p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-xs text-white/40 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {safeArr(applicant.skills).map((s: string, i: number) => <span key={i} className="badge-violet text-[10px]">{s}</span>)}
              </div>
            </div>
            {safeArr(applicant.languages).length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-xs text-white/40 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-1.5">
                  {safeArr(applicant.languages).map((l: string, i: number) => <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/60 border border-white/5">{l}</span>)}
                </div>
              </div>
            )}
            {safeArr(applicant.certifications).length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-xs text-white/40 mb-2">Certifications</h3>
                <div className="space-y-1">
                  {safeArr(applicant.certifications).map((c: string, i: number) => (
                    <p key={i} className="text-xs text-white/70 flex items-center gap-2"><BadgeCheck className="w-3.5 h-3.5 text-[#C6FF34]" /> {c}</p>
                  ))}
                </div>
              </div>
            )}
            {safeArr(applicant.references).length > 0 && (
              <div className="sm:col-span-2">
                <h3 className="text-xs text-white/40 mb-2">References</h3>
                <div className="space-y-2">
                  {safeArr(applicant.references).map((r: any, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <p className="text-xs text-white/70 font-medium">{safe(r.name)} — {safe(r.role)}</p>
                      <p className="text-[10px] text-white/40">{safe(r.contact)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="sm:col-span-2">
              <h3 className="text-xs text-white/40 mb-2">Cover Letter</h3>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/60 whitespace-pre-line leading-relaxed">{safe(applicant.coverLetter, "No cover letter provided.")}</div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2 pt-2">
              <button onClick={() => onScheduleInterview(applicant)} className="btn-lime text-xs flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Schedule Interview</button>
              <button onClick={() => onSendMessage(applicant.id)} className="btn-outline text-xs flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Message</button>
            </div>
          </div>
        </GlassCard>
      )}
      {subTab === "cv" && (
        <GlassCard variant="strong">
          {applicant.cvUploaded ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#C6FF34]/10 flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-[#C6FF34]" /></div>
              <h3 className="text-sm font-medium text-white/80 mb-1">{safe(applicant.cvFilename, "CV.pdf")}</h3>
              <p className="text-xs text-white/40 mb-4">Uploaded by candidate</p>
              <button onClick={() => downloadCV(applicant as CVData)} className="btn-lime text-xs flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Download CV</button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-white/20" /></div>
              <h3 className="text-sm font-medium text-white/40 mb-1">No CV Uploaded</h3>
              <p className="text-xs text-white/30">Candidate has not uploaded a CV yet.</p>
            </div>
          )}
          {applicant.portfolioUrl && (
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-white/40 mb-2">Portfolio</p>
              <a href={`https://${applicant.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#C6FF34] hover:underline flex items-center justify-center gap-1"><Globe className="w-3.5 h-3.5" /> {applicant.portfolioUrl}</a>
            </div>
          )}
        </GlassCard>
      )}
      {subTab === "wri" && (
        <GlassCard variant="strong">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-section text-sm">Workforce Readiness Index™</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#C6FF34]">{(applicant.wriScore || 0).toFixed(1)}</p>
              <p className={`text-[10px] font-semibold ${TIER_COLORS[applicant.goldKeyTier] || ""}`}>{applicant.goldKeyTier} Tier</p>
            </div>
          </div>
          <div className="space-y-3">
            {wriLabels.map((w) => {
              const score = (applicant.wriComponents?.[w.key as keyof typeof applicant.wriComponents] as number) || 0;
              const pct = Math.min(score, 100);
              return (
                <div key={w.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{w.label} <span className="text-white/30">({w.weight}%)</span></span>
                    <span className="text-xs font-medium text-white/80">{score}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] to-[#C6FF34] transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <h4 className="text-xs text-white/40 mb-2">Rating</h4>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(applicant.rating || 0) ? "text-[#C6FF34] fill-[#C6FF34]" : "text-white/10"}`} />
              ))}
              <span className="text-xs text-white/60 ml-2">{(applicant.rating || 0).toFixed(1)} / 5.0</span>
            </div>
          </div>
        </GlassCard>
      )}
      {subTab === "crucible" && (
        <GlassCard variant="strong">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-section text-sm">Levav 28™ Crucible Progress</h3>
            <div className="text-right">
              <p className="text-xl font-bold text-[#C6FF34]">{applicant.levav28Progress || 0}/28</p>
              <p className="text-[10px] text-white/40">days completed</p>
            </div>
          </div>
          <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden mb-4">
            <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] via-[#C6FF34] to-[#7E3BED] transition-all" style={{ width: `${((applicant.levav28Progress || 0) / 28) * 100}%` }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {["CONFRONT™", "DISSECT™", "OWN™", "EXECUTE™"].map((phase, i) => (
              <div key={phase} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-lg font-bold text-white/80">{Math.min(7, Math.max(0, (applicant.levav28Progress || 0) - i * 7))}</p>
                <p className="text-[9px] text-white/40">{phase}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/40 text-center">Average Score: <span className="text-[#C6FF34] font-bold">{(applicant.levav28AvgScore || 0).toFixed(1)}%</span></p>
        </GlassCard>
      )}
      {subTab === "notes" && (
        <GlassCard variant="strong">
          <h3 className="text-section text-sm mb-3">Interview Notes</h3>
          <textarea value={notes} onChange={(e) => saveNotes(e.target.value)} placeholder="Add your notes about this candidate..." rows={10} className="input-levav text-xs w-full resize-none" />
          <p className="text-[10px] text-white/30 mt-2">Notes are saved automatically to your browser.</p>
        </GlassCard>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TALENT POOL TAB
   ═══════════════════════════════════════════ */
function TalentTab({ talentPool, search, setSearch, selectedTalent, setSelectedTalent, onLikeTalent }: any) {
  const [availFilter, setAvailFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const filtered = talentPool.filter((t: any) => {
    const matchesSearch = `${t.firstName} ${t.lastName} ${t.profession} ${t.headline} ${t.skills?.join(" ") || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesAvail = availFilter === "all" || (availFilter === "available" ? t.available : !t.available);
    const matchesTier = tierFilter === "all" || t.goldKeyTier === tierFilter;
    return matchesSearch && matchesAvail && matchesTier;
  });

  if (selectedTalent !== null) {
    const talent = talentPool.find((t: any) => t.id === selectedTalent);
    if (!talent) return null;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setSelectedTalent(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center">
            <span className="text-sm font-bold text-white">{(talent.firstName || "?")[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-section text-sm sm:text-base">{safe(talent.firstName)} {safe(talent.lastName)}</h2>
              <span className={`text-[10px] font-semibold ${TIER_COLORS[talent.goldKeyTier] || ""}`}>{talent.goldKeyTier}</span>
              {talent.verified && <BadgeCheck className="w-4 h-4 text-[#C6FF34]" />}
            </div>
            <p className="text-[10px] text-white/40">{safe(talent.levavCode)} · {safe(talent.profession)}</p>
          </div>
        </div>
        <GlassCard variant="strong">
          <p className="text-xs text-white/60 mb-3">{safe(talent.headline)}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-[#C6FF34]"><Star className="w-3.5 h-3.5" /> {(talent.wriScore || 0).toFixed(1)}</span>
            <span className="text-xs text-white/30">·</span>
            <span className="flex items-center gap-1 text-xs text-white/40"><MapPin className="w-3 h-3" /> {safe(talent.city)}</span>
            <span className="text-xs text-white/30">·</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${talent.available ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-white/5 text-white/40"}`}>{talent.available ? "Available" : "Not Available"}</span>
          </div>
          <h3 className="text-xs text-white/40 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {safeArr(talent.skills).map((s: string, i: number) => <span key={i} className="badge-violet text-[10px]">{s}</span>)}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onLikeTalent(`${talent.firstName} ${talent.lastName}`)} className="btn-lime text-xs flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5" /> Express Interest</button>
            <button className="btn-outline text-xs flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> Message</button>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-section text-base">Talent Pool ({filtered.length})</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills, name..." className="input-levav text-xs pl-8 w-48" />
          </div>
          <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/80 outline-none">
            <option value="all">All</option><option value="available">Available</option><option value="unavailable">Unavailable</option>
          </select>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/80 outline-none">
            <option value="all">All Tiers</option><option value="Diamond">Diamond</option><option value="Platinum">Platinum</option><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Bronze">Bronze</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((t: any) => (
          <div key={t.id} onClick={() => setSelectedTalent(t.id)}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">{(t.firstName || "?")[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white/90">{safe(t.firstName)} {safe(t.lastName)}</span>
                  <span className={`text-[10px] font-semibold ${TIER_COLORS[t.goldKeyTier] || ""}`}>{t.goldKeyTier}</span>
                  {t.verified && <BadgeCheck className="w-3.5 h-3.5 text-[#C6FF34]" />}
                </div>
                <p className="text-[10px] text-white/40">{safe(t.profession)} · {safe(t.city)}</p>
              </div>
            </div>
            <p className="text-xs text-white/50 mb-3 line-clamp-2">{safe(t.headline)}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {safeArr(t.skills).slice(0, 4).map((s: string, i: number) => <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/5">{s}</span>)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="flex items-center gap-1 text-xs text-[#C6FF34]"><Star className="w-3 h-3" /> {(t.wriScore || 0).toFixed(1)}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.available ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-white/5 text-white/30"}`}>{t.available ? "Available" : "Hired"}</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-white/30 py-12">No talent matches your filters</p>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   INTERVIEWS TAB
   ═══════════════════════════════════════════ */
function InterviewsTab({ interviews, onReschedule, onCancel }: any) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const filtered = interviews.filter((iv: any) => statusFilter === "all" || iv.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-section text-base">Interviews ({filtered.length})</h2>
        <div className="flex items-center gap-1.5">
          {["all", "scheduled", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${statusFilter === s ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map((iv: any) => (
          <GlassCard key={iv.id} variant="interactive" glow={false}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${iv.type === "video" ? "bg-[#7E3BED]/10 text-[#7E3BED]" : iv.type === "phone" ? "bg-amber-500/10 text-amber-400" : "bg-[#C6FF34]/10 text-[#C6FF34]"}`}>
                  {iv.type === "video" ? <Video className="w-4 h-4" /> : iv.type === "phone" ? <Phone className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">{iv.applicantName}</p>
                  <p className="text-[10px] text-white/40">{safe(iv.jobTitle)} · {iv.type[0].toUpperCase() + iv.type.slice(1)}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${iv.status === "scheduled" ? "bg-[#7E3BED]/10 text-[#7E3BED]" : iv.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{iv.status}</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-white/40 mb-3">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {safe(iv.date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {safe(iv.time)}</span>
            </div>
            {iv.notes && <p className="text-xs text-white/50 mb-3 bg-white/[0.02] p-2 rounded-lg border border-white/5">{safe(iv.notes)}</p>}
            {iv.status === "scheduled" && (
              <div className="flex items-center gap-2">
                <button onClick={() => onReschedule(iv)} className="text-[10px] text-[#C6FF34] hover:underline flex items-center gap-1"><Calendar className="w-3 h-3" /> Reschedule</button>
                <button onClick={() => onCancel(iv.id)} className="text-[10px] text-red-400 hover:underline flex items-center gap-1"><X className="w-3 h-3" /> Cancel</button>
              </div>
            )}
          </GlassCard>
        ))}
        {filtered.length === 0 && <p className="text-center text-sm text-white/30 py-12">No interviews found</p>}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ANALYTICS TAB
   ═══════════════════════════════════════════ */
function AnalyticsTab({ jobs, applicants, interviews }: any) {
  const statusCounts = ["new", "screening", "interview", "offer", "hired", "rejected"].map((s) => ({
    status: s,
    count: applicants.filter((a: any) => a.status === s).length,
    color: s === "new" ? "#3b82f6" : s === "screening" ? "#f59e0b" : s === "interview" ? "#7E3BED" : s === "offer" ? "#C6FF34" : s === "hired" ? "#22c55e" : "#ef4444",
  }));

  const tierCounts = ["Diamond", "Platinum", "Gold", "Silver", "Bronze"].map((t) => ({
    tier: t,
    count: applicants.filter((a: any) => a.goldKeyTier === t).length,
    color: t === "Diamond" ? "#C6FF34" : t === "Platinum" ? "#7E3BED" : t === "Gold" ? "#facc15" : t === "Silver" ? "#d1d5db" : "#d97706",
  }));

  const totalViews = jobs.reduce((s: number, j: any) => s + (j.views || 0), 0);
  const totalApps = applicants.length;
  const conversionRate = totalViews > 0 ? ((totalApps / totalViews) * 100).toFixed(1) : "0";
  const completedInts = interviews.filter((i: any) => i.status === "completed").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-section text-base mb-4">Hiring Analytics</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Views" value={totalViews.toLocaleString()} icon={<Eye className="w-5 h-5" />} delay={0} />
        <StatCard label="Applications" value={totalApps} icon={<Users className="w-5 h-5" />} delay={0.05} />
        <StatCard label="Conversion" value={`${conversionRate}%`} icon={<TrendingUp className="w-5 h-5" />} delay={0.1} />
        <StatCard label="Interviews Done" value={completedInts} icon={<CheckCircle2 className="w-5 h-5" />} delay={0.15} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel */}
        <GlassCard variant="strong" delay={0.2}>
          <h3 className="text-section text-sm mb-4">Application Funnel</h3>
          <div className="space-y-3">
            {statusCounts.map((sc) => (
              <div key={sc.status} className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 w-16 text-right capitalize">{sc.status}</span>
                <div className="flex-1 h-6 rounded-lg bg-white/5 overflow-hidden relative">
                  <div className="h-full rounded-lg transition-all flex items-center px-2" style={{ width: `${totalApps > 0 ? (sc.count / totalApps) * 100 : 0}%`, backgroundColor: `${sc.color}20` }}>
                    <span className="text-[10px] font-medium" style={{ color: sc.color }}>{sc.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        {/* Tier Distribution */}
        <GlassCard variant="strong" delay={0.25}>
          <h3 className="text-section text-sm mb-4">Gold Key™ Tier Distribution</h3>
          <div className="space-y-3">
            {tierCounts.map((tc) => (
              <div key={tc.tier} className="flex items-center gap-3">
                <span className={`text-[10px] font-semibold w-16 text-right ${TIER_COLORS[tc.tier] || ""}`}>{tc.tier}</span>
                <div className="flex-1 h-6 rounded-lg bg-white/5 overflow-hidden relative">
                  <div className="h-full rounded-lg transition-all flex items-center px-2" style={{ width: `${totalApps > 0 ? (tc.count / totalApps) * 100 : 0}%`, backgroundColor: `${tc.color}30` }}>
                    <span className="text-[10px] font-medium text-white/80">{tc.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        {/* Job Performance */}
        <GlassCard variant="strong" delay={0.3} className="lg:col-span-2">
          <h3 className="text-section text-sm mb-4">Job Performance</h3>
          <div className="space-y-3">
            {jobs.map((job: any, i: number) => {
              const jobApps = applicants.filter((a: any) => a.appliedFor === job.title).length;
              return (
                <div key={job.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80">{job.title}</p>
                    <p className="text-[10px] text-white/30">{safe(job.department)} · {safe(job.location)}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs font-bold text-white/80">{jobApps}</p>
                      <p className="text-[9px] text-white/30">Apps</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-white/80">{job.views || 0}</p>
                      <p className="text-[9px] text-white/30">Views</p>
                    </div>
                    <div className="w-20">
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] to-[#C6FF34]" style={{ width: `${job.views > 0 ? (jobApps / job.views) * 100 : 0}%` }} />
                      </div>
                      <p className="text-[9px] text-white/30 text-right mt-0.5">{job.views > 0 ? ((jobApps / job.views) * 100).toFixed(1) : 0}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGES TAB
   ═══════════════════════════════════════════ */
function MessagesTab({ applicants }: any) {
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, { text: string; from: "employer" | "talent"; time: string }[]>>({
    1: [
      { text: "Hi Mutale, thank you for applying to the Senior Frontend Developer role. Your WRI™ score is impressive!", from: "employer", time: "10:00 AM" },
      { text: "Thank you! I'm very excited about the opportunity to work at BongoHive. When would be a good time for an interview?", from: "talent", time: "10:15 AM" },
      { text: "How does Tuesday at 10 AM sound? We can do a video call.", from: "employer", time: "10:30 AM" },
      { text: "Tuesday 10 AM works perfectly. Looking forward to it!", from: "talent", time: "10:45 AM" },
    ],
    3: [
      { text: "Hello David, your profile caught our attention. Your Diamond tier WRI™ score is exceptional.", from: "employer", time: "Yesterday" },
      { text: "Thank you! I've been following BongoHive's work for a while. Would love to discuss how I can contribute.", from: "talent", time: "Yesterday" },
    ],
  });
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    if (!draft.trim() || activeThread === null) return;
    setMessages((prev) => ({
      ...prev,
      [activeThread]: [...(prev[activeThread] || []), { text: draft, from: "employer", time: "Just now" }],
    }));
    setDraft("");
  };

  const threads = applicants.filter((a: any) => messages[a.id]).map((a: any) => ({
    ...a,
    lastMessage: messages[a.id]?.[messages[a.id].length - 1],
  }));

  if (activeThread !== null) {
    const applicant = applicants.find((a: any) => a.id === activeThread);
    const thread = messages[activeThread] || [];
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-[60vh]">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
          <button onClick={() => setActiveThread(null)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center">
            <span className="text-xs font-bold text-white">{(applicant?.firstName || "?")[0]}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white/90">{safe(applicant?.firstName)} {safe(applicant?.lastName)}</p>
            <p className="text-[10px] text-white/40">{safe(applicant?.appliedFor)}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
          {thread.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "employer" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${msg.from === "employer" ? "bg-[#C6FF34]/10 text-white/80 rounded-br-md" : "bg-white/5 text-white/70 rounded-bl-md"}`}>
                <p>{msg.text}</p>
                <p className="text-[9px] text-white/30 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." className="input-levav text-xs flex-1" />
          <button onClick={sendMessage} className="btn-lime p-2"><Send className="w-4 h-4" /></button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-section text-base mb-4">Messages</h2>
      {threads.length > 0 ? (
        <div className="space-y-2">
          {threads.map((t: any) => (
            <div key={t.id} onClick={() => setActiveThread(t.id)}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">{(t.firstName || "?")[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/90">{safe(t.firstName)} {safe(t.lastName)}</span>
                  <span className="text-[10px] text-white/30">{t.lastMessage?.time}</span>
                </div>
                <p className="text-xs text-white/50 truncate">{t.lastMessage?.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/30">No messages yet</p>
          <p className="text-xs text-white/20">Start a conversation from an applicant's profile</p>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════════ */
function SettingsTab({ company, onCompanyUpdate }: any) {
  const [form, setForm] = useState({ ...company });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onCompanyUpdate(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: any) => setForm((prev: any) => ({ ...prev, [field]: value }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <h2 className="text-section text-base mb-4">Company Settings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard variant="strong">
            <h3 className="text-sm font-medium text-white/80 mb-4">Company Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-2 block">Company Logo</label>
                <ImageUpload label="" currentImage={form.logo} onImageSelect={(url: string | null) => update("logo", url)} shape="rounded" size="lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Company Name</label>
                  <input value={form.name || ""} onChange={(e) => update("name", e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Industry</label>
                  <input value={form.industry || ""} onChange={(e) => update("industry", e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Location</label>
                  <input value={form.location || ""} onChange={(e) => update("location", e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Company Size</label>
                  <select value={form.companySize || ""} onChange={(e) => update("companySize", e.target.value)} className="input-levav text-xs w-full">
                    <option>1-10 employees</option><option>11-50 employees</option><option>50-200 employees</option><option>200-500 employees</option><option>500+ employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Website</label>
                <input value={form.website || ""} onChange={(e) => update("website", e.target.value)} className="input-levav text-xs w-full" placeholder="example.com" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Description</label>
                <textarea value={form.description || ""} onChange={(e) => update("description", e.target.value)} rows={4} className="input-levav text-xs w-full resize-none" />
              </div>
            </div>
          </GlassCard>
          <GlassCard variant="strong">
            <h3 className="text-sm font-medium text-white/80 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Contact Name</label>
                <input value={form.contactName || ""} onChange={(e) => update("contactName", e.target.value)} className="input-levav text-xs w-full" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Email</label>
                <input value={form.contactEmail || ""} onChange={(e) => update("contactEmail", e.target.value)} className="input-levav text-xs w-full" />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Phone</label>
                <input value={form.contactPhone || ""} onChange={(e) => update("contactPhone", e.target.value)} className="input-levav text-xs w-full" />
              </div>
            </div>
          </GlassCard>
        </div>
        <div className="space-y-4">
          <GlassCard variant="strong">
            <h3 className="text-sm font-medium text-white/80 mb-4">Verification</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10">
              <BadgeCheck className="w-8 h-8 text-[#C6FF34]" />
              <div>
                <p className="text-xs font-medium text-[#C6FF34]">Verified Employer</p>
                <p className="text-[10px] text-white/40">Your company is verified on Levav™</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard variant="strong">
            <h3 className="text-sm font-medium text-white/80 mb-4">Actions</h3>
            <div className="space-y-2">
              <button onClick={handleSave} className="btn-lime w-full text-xs flex items-center justify-center gap-2">
                {saved ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved!</> : <><CheckCircle2 className="w-3.5 h-3.5" /> Save Changes</>}
              </button>
              <button onClick={() => { if (confirm("Reset to demo data?")) { clearEmployerStorage(); onCompanyUpdate(demoCompany); setForm(demoCompany); window.location.reload(); } }} className="btn-outline w-full text-xs text-red-400 border-red-400/20 hover:bg-red-400/10">Reset to Defaults</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   POST JOB MODAL
   ═══════════════════════════════════════════ */
function PostJobModal({ onClose, onPost }: { onClose: () => void; onPost: (job: any) => void }) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  const daysRemaining = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handleSubmit = () => {
    if (!title.trim()) return;
    onPost({
      id: Date.now(),
      title,
      department,
      location,
      type,
      salaryRange,
      postedDate: new Date().toISOString().split("T")[0],
      deadline,
      status: "active",
      applicants: 0,
      newApplicants: 0,
      views: 0,
      description,
      requirements: requirements.split("\n").filter((r) => r.trim()),
      thumbnail,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
          <h2 className="text-section text-sm sm:text-base">Post New Job</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Thumbnail Upload */}
          <div>
            <label className="text-xs text-white/40 mb-2 block">Job Thumbnail</label>
            <ImageUpload label="" currentImage={thumbnail} onImageSelect={(url: string | null) => setThumbnail(url)} shape="rounded" size="lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs text-white/40 mb-1 block">Job Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" className="input-levav text-xs w-full" autoFocus />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Department</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" className="input-levav text-xs w-full" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lusaka, Zambia" className="input-levav text-xs w-full" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Employment Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-levav text-xs w-full">
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Salary Range</label>
              <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} placeholder="e.g. ZMW 15,000 - 25,000" className="input-levav text-xs w-full" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block flex items-center gap-1">
                Application Deadline
                {daysRemaining > 0 && <span className="text-[#C6FF34] font-medium">({daysRemaining} days left)</span>}
                {daysRemaining <= 0 && <span className="text-red-400 font-medium">(Expired)</span>}
              </label>
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="input-levav text-xs w-full" />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Job Description</label>
            <RichTextEditor value={description} onChange={setDescription} placeholder="Describe the role, responsibilities, and what success looks like..." rows={6} />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Requirements (one per line)</label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="e.g. 5+ years React experience\nTypeScript proficiency\nTeam leadership" rows={4} className="input-levav text-xs w-full resize-none" />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 p-5 border-t border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
          <button onClick={onClose} className="btn-outline text-xs">Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim()} className="btn-lime text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><CheckCircle2 className="w-3.5 h-3.5" /> Publish Job</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   EDIT JOB MODAL
   ═══════════════════════════════════════════ */
function EditJobModal({ job, companyName, companyLogo, onClose, onSave }: { job: any; companyName: string; companyLogo: string | null; onClose: () => void; onSave: (job: any) => void }) {
  const [title, setTitle] = useState(job.title || "");
  const [department, setDepartment] = useState(job.department || "");
  const [location, setLocation] = useState(job.location || "");
  const [type, setType] = useState(job.type || "Full-time");
  const [salaryRange, setSalaryRange] = useState(job.salaryRange || job.salary || "");
  const [description, setDescription] = useState(job.description || "");
  const [requirements, setRequirements] = useState((job.requirements || []).join("\n"));
  const [thumbnail, setThumbnail] = useState<string | null>(job.thumbnail || null);
  const [deadline, setDeadline] = useState(job.deadline || "");
  const [saved, setSaved] = useState(false);

  const editDaysRemaining = deadline ? Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      ...job,
      id: job.id,
      title,
      department,
      location,
      type,
      salaryRange,
      description,
      requirements: requirements.split("\n").filter((r: string) => r.trim()),
      thumbnail,
      deadline,
    });
    setSaved(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
          <h2 className="text-section text-sm sm:text-base">Edit Job</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          {saved ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#C6FF34]/10 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-[#C6FF34]" /></div>
              <h3 className="text-base font-semibold text-white mb-1">Changes Saved!</h3>
              <p className="text-xs text-white/40">Your job posting has been updated.</p>
            </div>
          ) : (
            <>
              {/* Thumbnail */}
              <div>
                <label className="text-xs text-white/40 mb-2 block">Job Thumbnail</label>
                <ImageUpload label="" currentImage={thumbnail} onImageSelect={(url: string | null) => setThumbnail(url)} shape="rounded" size="lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-white/40 mb-1 block">Job Title *</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-levav text-xs w-full" autoFocus />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Department</label>
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Location</label>
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Employment Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="input-levav text-xs w-full">
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option><option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Salary Range</label>
                  <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="input-levav text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block flex items-center gap-1">
                    Application Deadline
                    {editDaysRemaining > 0 && <span className="text-[#C6FF34] font-medium">({editDaysRemaining} days left)</span>}
                    {editDaysRemaining <= 0 && deadline && <span className="text-red-400 font-medium">(Expired)</span>}
                  </label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-levav text-xs w-full" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block">Job Description</label>
                <RichTextEditor value={description} onChange={setDescription} placeholder="Describe the role..." rows={6} />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Requirements (one per line)</label>
                <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} className="input-levav text-xs w-full resize-none" />
              </div>
            </>
          )}
        </div>
        {!saved && (
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 p-5 border-t border-white/5 bg-[#0a0e1a]/80 backdrop-blur-xl">
            <button onClick={onClose} className="btn-outline text-xs">Cancel</button>
            <button onClick={handleSave} disabled={!title.trim()} className="btn-lime text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><CheckCircle2 className="w-3.5 h-3.5" /> Save Changes</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   BILLING TAB
   ═══════════════════════════════════════════ */
function BillingTab({ billing, onUpgrade }: { billing: BillingState; onUpgrade: (plan: PlanType) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const currentPlan = PLANS[billing.plan];

  const features: { key: keyof PlanConfig; label: string; icon: React.ReactNode }[] = [
    { key: "jobPostingsPerMonth", label: "Job postings / month", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { key: "featuredJobSlots", label: "Featured job slots", icon: <Zap className="w-3.5 h-3.5" /> },
    { key: "messageCredits", label: "Message credits", icon: <MessageCircle className="w-3.5 h-3.5" /> },
    { key: "teamSeats", label: "Team seats", icon: <Users className="w-3.5 h-3.5" /> },
    { key: "analyticsLevel", label: "Analytics", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  const boolFeatures: { key: keyof PlanConfig; label: string }[] = [
    { key: "prioritySupport", label: "Priority support" },
    { key: "customBranding", label: "Custom company branding" },
    { key: "wriVerificationAccess", label: "WRI™ verification access" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      {/* Current Plan Banner */}
      <GlassCard variant="strong" className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <h2 className="text-hero text-lg">{currentPlan.name}</h2>
              {billing.plan !== "free" && <span className="badge-lime text-[10px]">Active</span>}
            </div>
            <p className="text-xs text-white/40 mt-1">{currentPlan.description}</p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{remainingJobs()} jobs remaining</span>
              <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{remainingFeatured()} featured slots</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Renews {billing.renewalDate}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#C6FF34]">${currentPlan.monthlyPriceUSD}<span className="text-xs text-white/30 font-normal">/mo</span></p>
            {billing.plan === "free" && <p className="text-[10px] text-white/30">Upgrade to unlock more</p>}
          </div>
        </div>
      </GlassCard>

      {/* Usage Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Jobs Posted" value={`${billing.jobsPostedThisMonth} / ${currentPlan.jobPostingsPerMonth === 999 ? "\u221E" : currentPlan.jobPostingsPerMonth}`} icon={<Briefcase className="w-5 h-5" />} delay={0} />
        <StatCard label="Featured Used" value={`${billing.featuredSlotsUsed} / ${currentPlan.featuredJobSlots}`} icon={<Zap className="w-5 h-5" />} delay={0.05} />
        <StatCard label="Messages" value={`${billing.messagesSent} / ${currentPlan.messageCredits === 999 ? "\u221E" : currentPlan.messageCredits}`} icon={<MessageCircle className="w-5 h-5" />} delay={0.1} />
        <StatCard label="Add-on Credits" value={billing.credits} icon={<CreditCard className="w-5 h-5" />} delay={0.15} />
      </div>

      {/* Pricing Plans */}
      <h2 className="text-section text-base mb-4">Choose Your Plan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {(["free", "pro", "enterprise"] as PlanType[]).map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = billing.plan === planKey;
          return (
            <div key={planKey} onClick={() => setSelectedPlan(planKey)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                selectedPlan === planKey
                  ? "border-[#C6FF34]/40 bg-[#C6FF34]/5"
                  : isCurrent
                    ? "border-[#7E3BED]/30 bg-[#7E3BED]/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/15"
              }`}>
              {isCurrent && (
                <div className="absolute -top-2 left-3">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C6FF34] text-black font-bold">CURRENT</span>
                </div>
              )}
              {planKey === "pro" && (
                <div className="absolute -top-2 right-3">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7E3BED] text-white font-bold">POPULAR</span>
                </div>
              )}
              <h3 className="text-sm font-semibold text-white mb-1 mt-1">{plan.name}</h3>
              <p className="text-xs text-white/40 mb-3">{plan.description}</p>
              <p className="text-xl font-bold text-white mb-3">${plan.monthlyPriceUSD}<span className="text-[10px] text-white/30 font-normal">/month</span></p>
              <div className="space-y-1.5 mb-3">
                {features.map((f) => (
                  <div key={f.key} className="flex items-center gap-2 text-[10px] text-white/50">
                    <span className="text-white/30">{f.icon}</span>
                    <span>{f.label}:</span>
                    <span className="text-white/80 font-medium">{plan[f.key] === 999 ? "Unlimited" : plan[f.key]}</span>
                  </div>
                ))}
                {boolFeatures.map((f) => (
                  <div key={f.key} className="flex items-center gap-2 text-[10px]">
                    {plan[f.key] ? <CheckCircle2 className="w-3 h-3 text-[#C6FF34]" /> : <X className="w-3 h-3 text-white/20" />}
                    <span className={plan[f.key] ? "text-white/60" : "text-white/30 line-through"}>{f.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); if (!isCurrent) onUpgrade(planKey); }}
                disabled={isCurrent}
                className={`w-full text-xs py-2 rounded-lg font-medium transition-all ${
                  isCurrent
                    ? "bg-white/5 text-white/30 cursor-default"
                    : selectedPlan === planKey
                      ? "bg-[#C6FF34] text-black hover:shadow-lime"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}>
                {isCurrent ? "Active Plan" : planKey === "free" ? "Downgrade" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Revenue Streams Info */}
      <GlassCard variant="strong" delay={0.3}>
        <h3 className="text-section text-sm mb-3">How Levav™ Works for Employers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Job Postings", desc: "Post openings to Africa's verified talent pool. Free tier: 2/month. Pro: 10/month. Enterprise: unlimited.", icon: <Briefcase className="w-4 h-4 text-[#C6FF34]" /> },
            { title: "Featured Listings", desc: "Promote jobs to the top of search results with enhanced visibility badges and larger cards.", icon: <Zap className="w-4 h-4 text-amber-400" /> },
            { title: "Talent Pool Access", desc: "Browse and message pre-verified candidates with WRI™ scores and completed Levav 28™ challenges.", icon: <Users className="w-4 h-4 text-[#7E3BED]" /> },
            { title: "WRI™ Verification", desc: "Access verified Workforce Readiness Index™ scores to make data-driven hiring decisions.", icon: <Award className="w-4 h-4 text-[#C6FF34]" /> },
            { title: "Analytics Suite", desc: "Track application funnels, conversion rates, and talent quality metrics per posting.", icon: <BarChart3 className="w-4 h-4 text-[#7E3BED]" /> },
            { title: "Custom Branding", desc: "Pro and Enterprise plans include company logo on all job cards and a branded company page.", icon: <Building2 className="w-4 h-4 text-[#C6FF34]" /> },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs font-medium text-white/80">{item.title}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   SCHEDULE INTERVIEW MODAL
   ═══════════════════════════════════════════ */
function ScheduleInterviewModal({ applicantName, jobTitle, onClose, onSchedule }: { applicantName: string; jobTitle: string; onClose: () => void; onSchedule: (iv: any) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<"video" | "phone" | "in-person">("video");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!date || !time) return;
    onSchedule({
      id: Date.now(),
      applicantName,
      applicantId: 0,
      jobTitle,
      date,
      time,
      type,
      status: "scheduled",
      notes,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-section text-sm sm:text-base">Schedule Interview</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-xs text-white/40 mb-1">Candidate</p>
            <p className="text-sm font-medium text-white/90">{applicantName}</p>
            <p className="text-xs text-white/40 mt-1">{jobTitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-levav text-xs w-full" />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Time *</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-levav text-xs w-full" />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Interview Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["video", "phone", "in-person"] as const).map((t) => (
                <button key={t} onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${type === t ? "border-[#C6FF34]/30 bg-[#C6FF34]/5" : "border-white/5 bg-white/[0.02] hover:bg-white/5"}`}>
                  {t === "video" ? <Video className="w-5 h-5 text-[#7E3BED]" /> : t === "phone" ? <Phone className="w-5 h-5 text-amber-400" /> : <UserCircle className="w-5 h-5 text-[#C6FF34]" />}
                  <span className="text-[10px] text-white/60 capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes for the interview..." rows={3} className="input-levav text-xs w-full resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-5 border-t border-white/5">
          <button onClick={onClose} className="btn-outline text-xs">Cancel</button>
          <button onClick={handleSubmit} disabled={!date || !time} className="btn-lime text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"><Calendar className="w-3.5 h-3.5" /> Schedule</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
