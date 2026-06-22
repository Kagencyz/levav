/**
 * ============================================================
 * JOB DISCOVERY (/jobs) — Full Detail + Connected Apply
 * ============================================================
 * Talent sees job cards with thumbnails → clicks to view full
 * detail → clicks Apply → submits form → application flows to
 * employer dashboard. Employer sees new applicant instantly.
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { loadJobBoard, incrementApplicantCount } from "@/lib/job-store";
import { submitApplication } from "@/lib/application-store";
import type { JobBoardEntry } from "@/lib/job-store";
import {
  Briefcase, Search, MapPin, Clock, Send, X, Building2,
  CheckCircle2, ListChecks, DollarSign, Users, ChevronLeft,
  Filter, Globe, Award, CalendarClock,
} from "lucide-react";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];

/* ─── Deadline helper ─── */
function DeadlineBadge({ deadline }: { deadline: string }) {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return <span className="flex items-center gap-1 text-red-400 text-[10px]"><Clock className="w-3 h-3" /> Expired</span>;
  if (days <= 3) return <span className="flex items-center gap-1 text-amber-400 text-[10px]"><Clock className="w-3 h-3" /> {days}d left</span>;
  return <span className="flex items-center gap-1 text-white/30 text-[10px]"><Clock className="w-3 h-3" /> {days}d left</span>;
}

/* ═══════════════════════════════════════════ */
export default function JobDiscoveryPage() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [detailJob, setDetailJob] = useState<JobBoardEntry | null>(null);
  const [applyJob, setApplyJob] = useState<JobBoardEntry | null>(null);
  const [applied, setApplied] = useState(false);

  /* tRPC: Fetch jobs from backend with localStorage fallback */
  const { data: trpcJobs } = trpc.job.listJobs.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  /* ─── Read from shared job store (tRPC first, localStorage fallback) ─── */
  const [localJobs, setLocalJobs] = useState(() => loadJobBoard());
  const jobs: JobBoardEntry[] = (trpcJobs && Array.isArray(trpcJobs) && trpcJobs.length > 0)
    ? trpcJobs.map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.companyName || "Company",
        location: j.location || "Zambia",
        type: j.type || "Full-time",
        salary: j.salaryRange || "Competitive",
        description: j.description || "",
        requirements: j.requirements ? JSON.parse(j.requirements) : [],
        postedDate: j.postedAt ? j.postedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        deadline: j.deadline ? j.deadline.split("T")[0] : "",
        status: j.status || "active",
        applicants: j.applicantCount || 0,
        views: j.viewCount || 0,
        logo: null,
        thumbnail: null,
      }))
    : localJobs;

  const refreshJobs = () => setLocalJobs(loadJobBoard());

  const filteredJobs = jobs.filter((job) => {
    const s = search.toLowerCase();
    const matchesSearch = !s ||
      job.title.toLowerCase().includes(s) ||
      job.company.toLowerCase().includes(s) ||
      job.location.toLowerCase().includes(s) ||
      job.description.toLowerCase().includes(s);
    const matchesType = selectedType === "All" || job.type === selectedType;
    const isActive = job.status === "active";
    const notExpired = !job.deadline || new Date(job.deadline) >= new Date(new Date().toISOString().split("T")[0]);
    return matchesSearch && matchesType && isActive && notExpired;
  });

  const handleApplied = () => {
    setApplied(true);
    if (applyJob) incrementApplicantCount(applyJob.id);
    refreshJobs();
    setTimeout(() => { setApplied(false); setApplyJob(null); }, 2000);
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet">Job Board</span>
            <span className="text-xs text-white/30">{filteredJobs.length} openings</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Discover Opportunities</h1>
          <p className="text-body mt-1">Find your next role across Africa&apos;s top employers</p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="glass-input w-full pl-10 text-white placeholder-white/30"
            placeholder="Search by title, company, location..."
          />
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          {JOB_TYPES.map((type) => (
            <button key={type} onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedType === type ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}>
              {type}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job, i) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}>
                <div onClick={() => setDetailJob(job)}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer group">
                  <div className="flex items-start gap-3">
                    {/* Logo / Thumbnail */}
                    {job.thumbnail ? (
                      <img src={job.thumbnail} alt={job.title} className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                    ) : job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-white">{(job.company || "?")[0]}</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-white group-hover:text-[#C6FF34] transition-colors">{job.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34]">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-[10px] text-white/50 font-medium">{job.company}</span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40"><MapPin className="w-3 h-3" />{job.location}</span>
                        <span className="flex items-center gap-1 text-[10px] text-white/40"><Clock className="w-3 h-3" />{job.postedDate}</span>
                      </div>
                      {job.description && (
                        <div className="text-xs text-white/40 line-clamp-2 mb-3" dangerouslySetInnerHTML={{ __html: job.description }} />
                      )}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-2">
                          {job.requirements.slice(0, 3).map((r) => (
                            <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40">{r}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-[#C6FF34]/70 font-medium">{job.salary}</span>
                        {job.deadline && <DeadlineBadge deadline={job.deadline} />}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-white/20">{job.applicants} applied</span>
                          <span className="text-[10px] text-[#C6FF34] group-hover:underline">View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <GlassCard variant="strong" className="text-center py-12">
            <Globe className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No jobs found</h3>
            <p className="text-xs text-white/40">Try adjusting your search or filters.</p>
          </GlassCard>
        )}
      </div>

      {/* ─── JOB DETAIL MODAL ─── */}
      <AnimatePresence>
        {detailJob && (
          <JobDetailModal job={detailJob} onClose={() => setDetailJob(null)} onApply={() => { setDetailJob(null); setApplyJob(detailJob); }} />
        )}
      </AnimatePresence>

      {/* ─── APPLY MODAL ─── */}
      <AnimatePresence>
        {applyJob && (
          <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} applied={applied} onApplied={handleApplied} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOB DETAIL MODAL
   ═══════════════════════════════════════════ */
function JobDetailModal({ job, onClose, onApply }: { job: JobBoardEntry; onClose: () => void; onApply: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative">
          {job.thumbnail ? (
            <div className="aspect-[3/1] w-full overflow-hidden rounded-t-2xl">
              <img src={job.thumbnail} alt={job.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-[#7E3BED]/20 to-[#C6FF34]/10 rounded-t-2xl" />
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 -mt-8 relative">
          {/* Company + Title */}
          <div className="flex items-start gap-3 mb-4">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-14 h-14 rounded-xl object-cover border border-white/10 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-white">{(job.company || "?")[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-section text-base sm:text-lg">{job.title}</h2>
              <p className="text-xs text-white/50 flex items-center gap-2 flex-wrap">
                <Building2 className="w-3 h-3" />{job.company}
                <span className="text-white/20">|</span>
                <MapPin className="w-3 h-3" />{job.location}
              </p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20">{job.type}</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1"><Clock className="w-3 h-3" />Posted {job.postedDate}</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 flex items-center gap-1"><Users className="w-3 h-3" />{job.applicants} applicants</span>
            {job.deadline && (
              <span className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${new Date(job.deadline) < new Date() ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                <CalendarClock className="w-3 h-3" />Closes {job.deadline}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <h3 className="text-xs text-white/40 mb-2 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />Job Description</h3>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: job.description || "No description provided." }} />
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs text-white/40 mb-2 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5" />Requirements</h3>
              <ul className="space-y-1.5">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF34] flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
            <button onClick={onApply} className="btn-lime flex items-center gap-2 text-xs flex-1 justify-center">
              <Send className="w-3.5 h-3.5" /> Quick Apply
            </button>
            <button onClick={onClose} className="btn-outline text-xs">Close</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   APPLY MODAL
   ═══════════════════════════════════════════ */
function ApplyModal({ job, onClose, applied, onApplied }: { job: JobBoardEntry; onClose: () => void; applied: boolean; onApplied: () => void }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    coverLetter: "", profession: "Software Developer", experience: "2-5 years",
  });

  const update = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.email.trim()) return;
    submitApplication({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      coverLetter: form.coverLetter,
      wriScore: Math.floor(Math.random() * 30) + 55, // 55-85 range
      goldKeyTier: "Silver",
      profession: form.profession,
      skills: job.requirements.slice(0, 3),
      experience: form.experience,
      levavCode: `LVA-${form.lastName?.substring(0, 3).toUpperCase() || "XXX"}001`,
    });
    onApplied();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0a0e1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/5 bg-[#0a0e1a]/90 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {job.thumbnail ? (
              <img src={job.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : job.logo ? (
              <img src={job.logo} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center text-sm font-bold text-white">
                {job.company[0]}
              </div>
            )}
            <div>
              <h3 className="text-sm font-semibold text-white">Apply for {job.title}</h3>
              <p className="text-[10px] text-white/40">{job.company} · {job.location}</p>
              {job.deadline && (
                <p className="text-[10px] mt-0.5">
                  <DeadlineBadge deadline={job.deadline} />
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5">
          {applied ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#C6FF34]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#C6FF34]" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Application Sent!</h3>
              <p className="text-xs text-white/40">{job.company} will review your application.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">First Name *</label>
                  <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                    className="input-levav text-xs w-full" placeholder="Chanda" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Last Name *</label>
                  <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                    className="input-levav text-xs w-full" placeholder="Banda" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Email *</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  className="input-levav text-xs w-full" placeholder="chanda@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Phone</label>
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                    className="input-levav text-xs w-full" placeholder="+260 97X XXX XXX" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Profession</label>
                  <input value={form.profession} onChange={(e) => update("profession", e.target.value)}
                    className="input-levav text-xs w-full" placeholder="e.g. Developer" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Experience</label>
                <select value={form.experience} onChange={(e) => update("experience", e.target.value)}
                  className="input-levav text-xs w-full">
                  <option>0-1 years</option><option>1-2 years</option><option>2-5 years</option><option>5-8 years</option><option>8+ years</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Cover Letter</label>
                <textarea value={form.coverLetter} onChange={(e) => update("coverLetter", e.target.value)}
                  rows={4} className="input-levav text-xs w-full resize-none" placeholder="Tell us why you're a great fit..." />
              </div>
              <div className="pt-2">
                <button onClick={handleSubmit}
                  disabled={!form.firstName.trim() || !form.email.trim()}
                  className="btn-lime w-full text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-3.5 h-3.5" /> Submit Application
                </button>
                <p className="text-[10px] text-white/20 text-center mt-2">Your Levav ID™ will be attached automatically</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
