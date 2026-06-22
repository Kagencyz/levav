/**
 * ============================================================
 * INTERVIEW PAGE — Interview Scheduling Center
 * ============================================================
 * View upcoming interviews, manage scheduling, and track
 * interview status for both talent and employers.
 * ============================================================
 */

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Calendar, Clock, Video, Phone, MapPin,
  CheckCircle, XCircle, Briefcase, AlertCircle,
  Users, Plus,
} from "lucide-react";

/* Demo Interview Data */
const demoInterviews = [
  {
    id: 1, scheduledAt: new Date(Date.now() + 86400000),
    durationMinutes: 30, interviewType: "video", status: "confirmed",
    meetingLink: "https://meet.zoom.us/demo", employerNotes: "Please prepare a 5-min presentation on your recent projects.",
    otherPartyName: "BongoHive HR", myRole: "talent",
  },
  {
    id: 2, scheduledAt: new Date(Date.now() + 3 * 86400000),
    durationMinutes: 45, interviewType: "video", status: "scheduled",
    meetingLink: null, employerNotes: null,
    otherPartyName: "MTN Zambia", myRole: "talent",
  },
  {
    id: 3, scheduledAt: new Date(Date.now() - 2 * 86400000),
    durationMinutes: 30, interviewType: "audio", status: "completed",
    meetingLink: null, employerNotes: "Strong candidate. Recommend second round.",
    otherPartyName: "FSD Zambia", myRole: "talent",
  },
  {
    id: 4, scheduledAt: new Date(Date.now() - 5 * 86400000),
    durationMinutes: 60, interviewType: "in_person", status: "cancelled",
    meetingLink: null, employerNotes: null,
    otherPartyName: "Zamtel", myRole: "talent",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string; icon: React.ElementType }> = {
    scheduled: { color: "#3B82F6", label: "Scheduled", icon: Calendar },
    confirmed: { color: "#C6FF34", label: "Confirmed", icon: CheckCircle },
    completed: { color: "#10B981", label: "Completed", icon: CheckCircle },
    cancelled: { color: "#EF4444", label: "Cancelled", icon: XCircle },
    no_show: { color: "#F59E0B", label: "No Show", icon: AlertCircle },
  };
  const c = config[status] ?? config.scheduled;
  const Icon = c.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${c.color}15`, color: c.color }}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

function TypeIcon({ type }: { type: string }) {
  if (type === "video") return <Video className="w-4 h-4 text-[#7E3BED]" />;
  if (type === "audio") return <Phone className="w-4 h-4 text-[#3B82F6]" />;
  return <MapPin className="w-4 h-4 text-[#F59E0B]" />;
}

function InterviewCard({ interview }: { interview: typeof demoInterviews[0] }) {
  const timeStr = interview.scheduledAt
    ? new Date(interview.scheduledAt).toLocaleString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "Not set";

  return (
    <GlassCard className="p-4" glow={false}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7E3BED]/10 flex items-center justify-center shrink-0">
          <TypeIcon type={interview.interviewType} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-white/90">Interview with {interview.otherPartyName}</p>
            <StatusBadge status={interview.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40 mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{timeStr}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{interview.durationMinutes} min</span>
            <span className="capitalize">{interview.interviewType}</span>
          </div>
          {interview.employerNotes && (
            <p className="text-xs text-white/50 mb-2 bg-white/5 rounded-lg p-2">{interview.employerNotes}</p>
          )}
          {interview.meetingLink && (
            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer"
              className="text-xs text-[#7E3BED] hover:text-[#9B6BF0] transition-colors mb-2 inline-block">
              Join Meeting →
            </a>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default function InterviewPage() {
  const upcoming = demoInterviews.filter((i) => i.status === "scheduled" || i.status === "confirmed");
  const past = demoInterviews.filter((i) => i.status === "completed" || i.status === "cancelled" || i.status === "no_show");

  return (
    <div className="levav-container pt-6 pb-24 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#C6FF34]" />
              My Interviews
            </h1>
            <p className="text-sm text-white/50">Scheduled interviews with employers.</p>
          </div>
          <button onClick={() => toast.info("Schedule Interview — coming soon")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C6FF34] text-black text-xs font-medium hover:shadow-lime transition-all">
            <Plus className="w-3.5 h-3.5" /> Schedule
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-bold text-[#C6FF34]">{upcoming.length}</p>
            <p className="text-[10px] text-white/40">Upcoming</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-bold text-[#7E3BED]">{past.length}</p>
            <p className="text-[10px] text-white/40">Past</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg font-bold text-[#3B82F6]">2</p>
            <p className="text-[10px] text-white/40">Offers</p>
          </div>
        </div>

        {upcoming.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C6FF34]" /> Upcoming ({upcoming.length})
            </h2>
            <div className="space-y-3">{upcoming.map((i) => <InterviewCard key={i.id} interview={i} />)}</div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-white/50 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/30" /> Past ({past.length})
            </h2>
            <div className="space-y-3 opacity-60">{past.map((i) => <InterviewCard key={i.id} interview={i} />)}</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
