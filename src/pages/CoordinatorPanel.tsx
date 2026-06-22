/**
 * ============================================================
 * COORDINATOR VALIDATION PANEL (/contribute/coordinator)
 * ============================================================
 * Impact partner coordinators validate logged volunteer hours.
 * Uses demo data for offline development mode.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { demoVolunteerEntries, demoCoordinatorStats } from "@/lib/demo-data";
import {
  ClipboardCheck, Heart, Users, Clock, CheckCircle2, XCircle,
  MapPin, Calendar,
} from "lucide-react";

export default function CoordinatorPanel() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [validatedIds, setValidatedIds] = useState<Set<number>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<number>>(new Set());

  /* Use demo data */
  const pendingEntries = demoVolunteerEntries;
  const myStats = demoCoordinatorStats;

  const handleValidate = (entryId: number) => {
    setValidatedIds((prev) => new Set(prev).add(entryId));
  };

  const handleReject = (entryId: number) => {
    setRejectedIds((prev) => new Set(prev).add(entryId));
  };

  const visibleEntries = pendingEntries.filter(
    (e) => !validatedIds.has(e.id) && !rejectedIds.has(e.id)
  );
  const pendingCount = visibleEntries.length;

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-lime">Coordinator</span>
            <span className="text-xs text-white/30">{user?.name ?? "Partner"}</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Volunteer Validation</h1>
          <p className="text-body mt-1">Validate hours to trigger WRI Impact Score recalculation</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Pending" value={pendingCount} icon={<ClipboardCheck className="w-5 h-5" />} delay={0} />
          <StatCard label="Validated (All Time)" value={myStats.totalValidated + validatedIds.size} icon={<CheckCircle2 className="w-5 h-5" />} delay={0.05} />
          <StatCard label="Hours Validated" value={myStats.totalHours} suffix="hrs" icon={<Clock className="w-5 h-5" />} delay={0.1} />
          <StatCard label="Active Volunteers" value={myStats.uniqueVolunteers} icon={<Users className="w-5 h-5" />} delay={0.15} />
        </div>

        {/* Pending Validations */}
        <GlassCard variant="strong" delay={0.2}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-[#C6FF34]" />
            <h2 className="text-section text-base">Pending Validations</h2>
            {pendingCount > 0 && <span className="badge-violet">{pendingCount} to review</span>}
          </div>

          {pendingCount > 0 ? (
            <div className="space-y-3">
              {visibleEntries.map((entry, i) => (
                <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                  className="p-4 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  {/* Volunteer Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C6FF34]/20 to-[#7E3BED]/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-white/80">#{entry.profileId}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">Volunteer #{entry.profileId}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] text-white/40"><MapPin className="w-3 h-3" /> Opportunity #{entry.opportunityId}</span>
                          <span className="flex items-center gap-1 text-[10px] text-white/40"><Calendar className="w-3 h-3" /> {entry.logDate ? new Date(entry.logDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#C6FF34] tabular-nums">{entry.hoursLogged}h</p>
                      <p className="text-[10px] text-white/30">logged</p>
                    </div>
                  </div>

                  {/* Description */}
                  {entry.activityDescription && (
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 mb-3">
                      <p className="text-xs text-white/60 leading-relaxed">{entry.activityDescription}</p>
                    </div>
                  )}

                  {/* Coordinator Notes */}
                  <div className="mb-3">
                    <label className="text-[10px] text-white/30 mb-1 block">Coordinator Notes (optional)</label>
                    <input type="text" className="glass-input w-full text-xs py-2"
                      placeholder="Add validation notes..."
                      value={notes[entry.id] ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [entry.id]: e.target.value }))} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => handleValidate(entry.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20 hover:bg-[#C6FF34]/20 transition-all text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Validate & Trigger WRI
                    </motion.button>
                    <button
                      onClick={() => handleReject(entry.id)}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-xs font-medium"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-[#C6FF34]/20 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">All Caught Up</h3>
              <p className="text-xs text-white/40">No pending volunteer validations.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
