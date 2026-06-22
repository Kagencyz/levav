/**
 * ============================================================
 * SEARCH — Universal Discovery
 * ============================================================
 * Search across jobs, courses, talent, employers, and content.
 * Filtered results with category tabs.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { GlassCard } from "@/components/ui/GlassCard";
import { loadJobBoard } from "@/lib/job-store";
import {
  Search, X, Briefcase, BookOpen, Users, Building2,
  Star, MapPin, Clock, Zap, ChevronRight, Filter,
} from "lucide-react";

const CATEGORIES = ["All", "Jobs", "Courses", "Talent", "Employers"] as const;

const DEMO_TALENT = [
  { id: 1, name: "David Phiri", role: "Senior Developer", wri: 94.2, tier: "Diamond", skills: ["React", "Node.js", "TypeScript"], city: "Lusaka" },
  { id: 2, name: "Grace Mulenga", role: "Product Designer", wri: 91.7, tier: "Diamond", skills: ["Figma", "User Research", "Prototyping"], city: "Lusaka" },
  { id: 3, name: "James Kabwe", role: "Data Scientist", wri: 89.3, tier: "Platinum", skills: ["Python", "ML", "SQL"], city: "Ndola" },
];

const DEMO_EMPLOYERS = [
  { id: 1, name: "BongoHive", industry: "Technology", location: "Lusaka", jobs: 8, logo: "BH" },
  { id: 2, name: "Fintech Zambia", industry: "Financial Services", location: "Lusaka", jobs: 5, logo: "FZ" },
  { id: 3, name: "ZamHealth", industry: "Healthcare", location: "Kitwe", jobs: 3, logo: "ZH" },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("All");

  const jobs = loadJobBoard().filter((j: any) => j.status === "active");

  const hasQuery = query.length >= 2;

  const filteredJobs = hasQuery && category !== "Talent" && category !== "Employers" ? jobs.filter((j: any) =>
    j.title.toLowerCase().includes(query.toLowerCase()) ||
    j.company.toLowerCase().includes(query.toLowerCase()) ||
    j.location.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const filteredTalent = hasQuery && category !== "Jobs" && category !== "Employers" ? DEMO_TALENT.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.role.toLowerCase().includes(query.toLowerCase()) ||
    t.skills.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  ) : [];

  const filteredEmployers = hasQuery && category !== "Jobs" && category !== "Talent" ? DEMO_EMPLOYERS.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.industry.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const totalResults = filteredJobs.length + filteredTalent.length + filteredEmployers.length;

  const recentSearches = ["Software Developer", "Lusaka", "Remote", "Designer", "Data Science"];

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-hero text-2xl sm:text-3xl">Search</h1>
          <p className="text-body mt-1">Find jobs, courses, talent, and employers</p>
        </motion.div>

        {/* Search Input */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jobs, people, skills, companies..."
              className="glass-input w-full pl-12 pr-10 py-4 text-base"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-white/5 hover:bg-white/10">
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${category === c ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
              {c}
            </button>
          ))}
        </div>

        {!hasQuery ? (
          /* Recent Searches & Quick Categories */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Searches</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {recentSearches.map((s) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="text-xs px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-white/50 hover:border-[#C6FF34]/20 hover:text-white/80 transition-all">
                  {s}
                </button>
              ))}
            </div>

            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Browse by Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Jobs", count: "12 openings", icon: <Briefcase className="w-5 h-5" />, color: "text-[#C6FF34]", bg: "bg-[#C6FF34]/10", path: "/jobs" },
                { label: "Courses", count: "8 courses", icon: <BookOpen className="w-5 h-5" />, color: "text-[#7E3BED]", bg: "bg-[#7E3BED]/10", path: "/learn" },
                { label: "Talent", count: "2,400+", icon: <Users className="w-5 h-5" />, color: "text-cyan-400", bg: "bg-cyan-500/10", path: "/dashboard" },
                { label: "Employers", count: "48 companies", icon: <Building2 className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10", path: "/employer" },
              ].map((cat) => (
                <button key={cat.label} onClick={() => navigate(cat.path)}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-left group">
                  <div className={`p-2 rounded-lg ${cat.bg} ${cat.color} w-fit mb-2`}>{cat.icon}</div>
                  <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">{cat.label}</p>
                  <p className="text-[10px] text-white/40">{cat.count}</p>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Search Results */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-white/40 mb-4">{totalResults} results for "{query}"</p>

            {/* Jobs */}
            {filteredJobs.length > 0 && (category === "All" || category === "Jobs") && (
              <div className="mb-6">
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> Jobs ({filteredJobs.length})
                </h3>
                <div className="space-y-2">
                  {filteredJobs.map((job: any) => (
                    <div key={job.id} onClick={() => navigate("/jobs")}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{job.company[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white group-hover:text-[#C6FF34] transition-colors">{job.title}</p>
                        <p className="text-[10px] text-white/40">{job.company} · {job.location}</p>
                      </div>
                      <span className="text-[10px] text-[#C6FF34] flex-shrink-0">{job.salary}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Talent */}
            {filteredTalent.length > 0 && (category === "All" || category === "Talent") && (
              <div className="mb-6">
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Talent ({filteredTalent.length})
                </h3>
                <div className="space-y-2">
                  {filteredTalent.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{t.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{t.name}</p>
                        <p className="text-[10px] text-white/40">{t.role} · {t.city}</p>
                        <div className="flex gap-1 mt-1">
                          {t.skills.slice(0, 3).map((s) => <span key={s} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">{s}</span>)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-bold text-[#C6FF34]">{t.wri}</p>
                        <p className="text-[9px] text-white/30">WRI\u2122</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employers */}
            {filteredEmployers.length > 0 && (category === "All" || category === "Employers") && (
              <div className="mb-6">
                <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Employers ({filteredEmployers.length})
                </h3>
                <div className="space-y-2">
                  {filteredEmployers.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{e.logo}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">{e.name}</p>
                        <p className="text-[10px] text-white/40">{e.industry} · {e.location}</p>
                      </div>
                      <span className="text-[10px] text-[#C6FF34] flex-shrink-0">{e.jobs} jobs</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">No results for "{query}"</p>
                <p className="text-xs text-white/20 mt-1">Try different keywords or browse categories</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
