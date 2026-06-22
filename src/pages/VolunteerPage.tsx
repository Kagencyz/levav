/**
 * ============================================================
 * VOLUNTEER / LEVAV IMPACT™ — Impact Team
 * ============================================================
 * Volunteer ecosystem with NGO opportunities, impact tracking,
 * community service hours, and verified impact certificates.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Heart, MapPin, Clock, Users, Star, CheckCircle2,
  Globe, TreePine, GraduationCap, Stethoscope, Search,
  ChevronRight, TrendingUp, Award, Calendar, Zap,
} from "lucide-react";

const CAUSES = ["All", "Education", "Health", "Environment", "Community", "Youth"];

const DEMO_OPPORTUNITIES = [
  { id: 1, title: "Teach Coding to Rural Youth", org: "CodeZambia", location: "Chongwe, Lusaka", type: "Education", hours: "4 hrs/week", duration: "3 months", spots: 5, volunteers: 12, impact: "120 students trained", logo: "CZ" },
  { id: 2, title: "Community Health Screening", org: "Zambia Health Initiative", location: "Kafue", type: "Health", hours: "6 hrs/week", duration: "6 months", spots: 8, volunteers: 24, impact: "500+ screenings", logo: "ZHI" },
  { id: 3, title: "Tree Planting Campaign", org: "GreenZambia", location: "Lusaka Provincial", type: "Environment", hours: "3 hrs/week", duration: "2 months", spots: 20, volunteers: 45, impact: "2,000 trees planted", logo: "GZ" },
  { id: 4, title: "Mentor High School Students", org: "Education Empowerment", location: "Lusaka", type: "Youth", hours: "2 hrs/week", duration: "Ongoing", spots: 10, volunteers: 18, impact: "85 mentees placed", logo: "EE" },
  { id: 5, title: "Clean Water Project Support", org: "Water for Africa", location: "Southern Province", type: "Community", hours: "5 hrs/week", duration: "4 months", spots: 6, volunteers: 9, impact: "3 communities served", logo: "WA" },
  { id: 6, title: "Digital Literacy Trainer", org: "BongoHive Foundation", location: "Lusaka (Remote)", type: "Education", hours: "3 hrs/week", duration: "3 months", spots: 4, volunteers: 7, impact: "200 adults trained", logo: "BH" },
];

const MY_IMPACT = {
  totalHours: 48,
  opportunities: 3,
  peopleHelped: 156,
  certificates: 2,
  streakWeeks: 8,
};

export default function VolunteerPage() {
  const { isAuthenticated } = useAuth();
  const { isOnline } = useBackend();
  const [selectedCause, setSelectedCause] = useState("All");
  const [search, setSearch] = useState("");
  const [joinedIds, setJoinedIds] = useState<number[]>([]);

  /* tRPC: Load impact opportunities from backend */
  const { data: trpcOpportunities } = trpc.impact.opportunities.useQuery(undefined, {
    retry: 1,
    enabled: isOnline && isAuthenticated,
  });

  const opportunities = (trpcOpportunities && Array.isArray(trpcOpportunities) && trpcOpportunities.length > 0)
    ? trpcOpportunities.map((o: any) => ({
        id: o.id,
        title: o.title,
        org: o.partnerName || "Organization",
        location: o.location || "Zambia",
        type: o.cause || "Community",
        hours: o.timeCommitment || "Flexible",
        duration: o.duration || "Ongoing",
        spots: o.spotsAvailable || 5,
        volunteers: o.volunteersCount || 0,
        impact: o.impactMetric || "Making a difference",
        logo: (o.partnerName || "O").slice(0, 2).toUpperCase(),
      }))
    : DEMO_OPPORTUNITIES;

  const filtered = opportunities.filter((o: any) => {
    const matchesCause = selectedCause === "All" || o.type === selectedCause;
    const matchesSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.org.toLowerCase().includes(search.toLowerCase());
    return matchesCause && matchesSearch;
  });

  const handleJoin = (id: number) => { if (!joinedIds.includes(id)) setJoinedIds((p) => [...p, id]); };

  const causeIcon = (cause: string) => {
    switch (cause) {
      case "Education": return <GraduationCap className="w-3.5 h-3.5" />;
      case "Health": return <Stethoscope className="w-3.5 h-3.5" />;
      case "Environment": return <TreePine className="w-3.5 h-3.5" />;
      default: return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><Heart className="w-3 h-3" /> Levav Impact\u2122</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Make an Impact</h1>
          <p className="text-body mt-1">Volunteer opportunities that build your WRI\u2122 and change communities</p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard variant="strong" className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">{MY_IMPACT.totalHours}h</p>
                <p className="text-[10px] text-white/40">Volunteered</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{MY_IMPACT.opportunities}</p>
                <p className="text-[10px] text-white/40">Causes</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{MY_IMPACT.peopleHelped}</p>
                <p className="text-[10px] text-white/40">People Helped</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">{MY_IMPACT.certificates}</p>
                <p className="text-[10px] text-white/40">Certificates</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{MY_IMPACT.streakWeeks}w</p>
                <p className="text-[10px] text-white/40">Streak</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities..." className="glass-input w-full pl-10 text-sm" />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CAUSES.map((c) => (
              <button key={c} onClick={() => setSelectedCause(c)}
                className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${selectedCause === c ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="space-y-3">
          {filtered.map((opp, i) => (
            <motion.div key={opp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{opp.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{opp.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5 flex items-center gap-1">{causeIcon(opp.type)} {opp.type}</span>
                    </div>
                    <p className="text-xs text-white/50 mb-2">{opp.org}</p>
                    <div className="flex items-center gap-3 text-[10px] text-white/30 mb-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp.hours}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{opp.duration}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{opp.volunteers} volunteers</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#C6FF34]/5 border border-[#C6FF34]/10 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-[#C6FF34]" />
                      <span className="text-[10px] text-[#C6FF34]">Impact: {opp.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleJoin(opp.id)} disabled={joinedIds.includes(opp.id)}
                        className={`text-xs px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 ${joinedIds.includes(opp.id) ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-[#C6FF34] text-black hover:shadow-lime"}`}>
                        {joinedIds.includes(opp.id) ? <><CheckCircle2 className="w-3.5 h-3.5" /> Joined</> : <>Join Cause</>}
                      </button>
                      <span className="text-[10px] text-white/20">{opp.spots} spots left</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center">
          <p className="text-xs text-white/30 flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5" /> Volunteering hours count toward your WRI\u2122 Impact score
          </p>
        </motion.div>
      </div>
    </div>
  );
}
