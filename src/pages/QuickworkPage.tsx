/**
 * ============================================================
 * QUICKWORK™ — Workforce Activation Team
 * ============================================================
 * Shift-based micro-work marketplace. Instant workforce
 * matching for short-term gigs, freelance tasks, and
 * shift-based opportunities across Zambia.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Zap, Clock, MapPin, DollarSign, Star, Filter,
  Briefcase, ChevronRight, CheckCircle2, TrendingUp,
  Users, Search, Calendar,
} from "lucide-react";

const GIG_TYPES = ["All", "Delivery", "Event Staff", "Data Entry", "Design", "Writing", "Support"];

const DEMO_GIGS = [
  { id: 1, title: "Delivery Driver — Weekend Shift", company: "Yango Delivery", location: "Lusaka", pay: "ZMW 150/day", type: "Delivery", duration: "2 days", urgent: true, applicants: 4, posted: "2 hours ago", rating: 4.2 },
  { id: 2, title: "Event Usher — Corporate Gala", company: "EventZambia", location: "Lusaka", pay: "ZMW 200/day", type: "Event Staff", duration: "1 day", urgent: true, applicants: 12, posted: "5 hours ago", rating: 4.5 },
  { id: 3, title: "Data Entry Clerk", company: "BongoHive", location: "Remote", pay: "ZMW 80/day", type: "Data Entry", duration: "5 days", urgent: false, applicants: 8, posted: "1 day ago", rating: 4.8 },
  { id: 4, title: "Social Media Graphics", company: "ZamHealth", location: "Remote", pay: "ZMW 500/project", type: "Design", duration: "3 days", urgent: false, applicants: 6, posted: "1 day ago", rating: 4.3 },
  { id: 5, title: "Blog Writer — Health Content", company: "HealthFirst NGO", location: "Remote", pay: "ZMW 300/article", type: "Writing", duration: "Ongoing", urgent: false, applicants: 15, posted: "2 days ago", rating: 4.1 },
  { id: 6, title: "Customer Support Agent", company: "Fintech Zambia", location: "Lusaka", pay: "ZMW 120/day", type: "Support", duration: "7 days", urgent: true, applicants: 3, posted: "3 hours ago", rating: 4.6 },
];

const MY_EARNINGS = {
  thisWeek: 450,
  thisMonth: 1200,
  totalGigs: 8,
  completionRate: 100,
  avgRating: 4.7,
};

export default function QuickworkPage() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [activeTab, setActiveTab] = useState<"browse" | "my-gigs">("browse");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [appliedIds, setAppliedIds] = useState<number[]>([]);

  /* tRPC: Load quickwork shifts from backend */
  const { data: trpcShifts } = trpc.quickwork.availableShifts.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  const gigs = (trpcShifts && Array.isArray(trpcShifts) && trpcShifts.length > 0)
    ? trpcShifts.map((s: any) => ({
        id: s.id,
        title: s.title,
        company: s.employerName || "Employer",
        location: s.location || "Zambia",
        pay: `ZMW ${s.payRate || 0}`,
        type: s.category || "General",
        duration: s.duration || "Flexible",
        urgent: s.urgent || false,
        applicants: s.applicantCount || 0,
        posted: s.createdAt ? `${Math.ceil((Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60))} hours ago` : "Recently",
        rating: 4.5,
      }))
    : DEMO_GIGS;

  const filtered = gigs.filter((g: any) => {
    const matchesType = selectedType === "All" || g.type === selectedType;
    const matchesSearch = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.company.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleApply = (id: number) => {
    if (!appliedIds.includes(id)) setAppliedIds((p) => [...p, id]);
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><Zap className="w-3 h-3" /> QuickWork\u2122</span>
            <span className="text-xs text-white/30">{DEMO_GIGS.length} gigs available</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Quick Work, Quick Pay</h1>
          <p className="text-body mt-1">Short-term gigs and shift-based opportunities</p>
        </motion.div>

        {/* Earnings Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard variant="strong" className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">ZMW {MY_EARNINGS.thisWeek}</p>
                <p className="text-[10px] text-white/40">This Week</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">ZMW {MY_EARNINGS.thisMonth}</p>
                <p className="text-[10px] text-white/40">This Month</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{MY_EARNINGS.totalGigs}</p>
                <p className="text-[10px] text-white/40">Gigs Completed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">{MY_EARNINGS.avgRating}</p>
                <p className="text-[10px] text-white/40">Avg Rating</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/5">
          {(["browse", "my-gigs"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-medium transition-all border-b-2 ${activeTab === t ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"}`}>
              {t === "browse" ? "Browse Gigs" : "My Gigs"}
            </button>
          ))}
        </div>

        {activeTab === "browse" ? (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gigs..." className="glass-input w-full pl-10 text-sm" />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {GIG_TYPES.map((t) => (
                  <button key={t} onClick={() => setSelectedType(t)}
                    className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${selectedType === t ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Gig List */}
            <div className="space-y-3">
              {filtered.map((gig, i) => (
                <motion.div key={gig.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-white">{gig.title}</h3>
                        {gig.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Urgent</span>}
                      </div>
                      <span className="text-xs font-medium text-[#C6FF34] flex-shrink-0">{gig.pay}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-[10px] text-white/40 flex-wrap">
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{gig.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{gig.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{gig.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#C6FF34]" />{gig.rating}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{gig.applicants} applied</span>
                      <span>{gig.posted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleApply(gig.id)}
                        disabled={appliedIds.includes(gig.id)}
                        className={`text-xs px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${appliedIds.includes(gig.id) ? "bg-[#C6FF34]/10 text-[#C6FF34] cursor-default" : "bg-[#C6FF34] text-black hover:shadow-lime"}`}>
                        {appliedIds.includes(gig.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Applied</> : <>Apply Now</>}
                      </button>
                      <span className="text-[10px] text-white/20">{gig.type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">My Gigs</h3>
            <p className="text-xs text-white/40">Track your active and completed gigs here.</p>
            <div className="mt-4 space-y-2">
              {[
                { title: "Delivery Driver — Weekend Shift", status: "active", pay: "ZMW 150/day" },
                { title: "Data Entry Clerk", status: "completed", pay: "ZMW 400 total" },
                { title: "Event Usher — Corporate Gala", status: "completed", pay: "ZMW 200" },
              ].map((gig, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 mx-auto max-w-md">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${gig.status === "active" ? "bg-[#C6FF34]" : "bg-white/20"}`} />
                  <div className="flex-1 text-left">
                    <p className="text-xs text-white/70">{gig.title}</p>
                    <p className="text-[10px] text-white/30">{gig.pay}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${gig.status === "active" ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-white/5 text-white/30"}`}>{gig.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
