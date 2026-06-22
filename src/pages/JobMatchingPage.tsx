/**
 * ============================================================
 * JOB MATCHING PAGE — AI-Powered Job Recommendations
 * ============================================================
 * Matches talent profiles to jobs based on WRI™ scores.
 * ============================================================
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Sparkles, Target, ArrowRight, MapPin, Clock, Banknote,
} from "lucide-react";

const demoJobs = [
  { id: 1, title: "Senior Frontend Developer", companyName: "BongoHive", location: "Lusaka", salaryRange: "ZMW 15-25k", employmentType: "Full-time", requiredSkills: "React, TypeScript" },
  { id: 2, title: "Customer Success Manager", companyName: "MTN Zambia", location: "Lusaka", salaryRange: "ZMW 8-12k", employmentType: "Full-time", requiredSkills: "CRM, Communication" },
  { id: 3, title: "Data Analyst", companyName: "FSD Zambia", location: "Remote", salaryRange: "ZMW 10-18k", employmentType: "Remote", requiredSkills: "Python, SQL" },
  { id: 4, title: "Mobile App Developer", companyName: "Zamtel", location: "Lusaka", salaryRange: "ZMW 12-20k", employmentType: "Full-time", requiredSkills: "Flutter, Dart" },
  { id: 5, title: "Marketing Manager", companyName: "Proflight", location: "Lusaka", salaryRange: "ZMW 10-15k", employmentType: "Full-time", requiredSkills: "Digital Marketing" },
];

const myWri = { overallScore: 72, goldKeyTier: "gold" };

function MatchScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? "#C6FF34" : score >= 60 ? "#7E3BED" : score >= 40 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${(score / 100) * 94} 94`} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{score}%</span>
    </div>
  );
}

export default function JobMatchingPage() {
  const [professionFilter, setProfessionFilter] = useState("");

  const matchedJobs = useMemo(() => {
    return demoJobs.map((job) => {
      const scores = [78, 65, 82, 71, 88];
      const score = scores[job.id - 1] ?? 60;
      return { job, matchScore: score, reasons: ["WRI match", "Skills aligned"] };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!professionFilter) return matchedJobs;
    return matchedJobs.filter((m) => m.job.title.toLowerCase().includes(professionFilter.toLowerCase()));
  }, [matchedJobs, professionFilter]);

  return (
    <div className="levav-container pt-6 pb-24 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-[#C6FF34]" /> AI Job Matching
          </h1>
          <p className="text-sm text-white/50">Jobs matched to your WRI™ profile and skills.</p>
        </div>

        <div className="mb-4">
          <input type="text" value={professionFilter} onChange={(e) => setProfessionFilter(e.target.value)}
            placeholder="Filter by keyword..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30" />
        </div>

        <div className="space-y-3">
          {filteredJobs.map(({ job, matchScore, reasons }) => (
            <GlassCard key={job.id} className="p-4" glow={false}>
              <div className="flex items-start gap-3">
                <MatchScoreRing score={matchScore} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white/90 truncate">{job.title}</h3>
                  <p className="text-xs text-white/50 mb-2">{job.companyName}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {reasons.map((r, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34]/70 border border-[#C6FF34]/10">{r}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/30">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.employmentType}</span>
                    <span className="flex items-center gap-1"><Banknote className="w-3 h-3" />{job.salaryRange}</span>
                  </div>
                  <button onClick={() => toast.success(`Applied to ${job.title}!`)}
                    className="mt-3 w-full py-2 rounded-xl bg-[#C6FF34] text-black text-xs font-medium hover:shadow-lime transition-all flex items-center justify-center gap-1.5">
                    Apply Now <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
