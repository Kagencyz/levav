/**
 * ============================================================
 * PROFILE SETUP — Levav ID™ Creation Step
 * ============================================================
 * Second step of the onboarding pipeline. User selects their
 * profession with animated "Other" field reveal.
 * Midnight black canvas, neon lime active triggers.
 * ============================================================
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronDown, UserCircle, MapPin, Phone, Briefcase } from "lucide-react";

const PROFESSIONS = [
  { value: "", label: "Select your profession" },
  { value: "software_developer", label: "Software Developer" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "registered_nurse", label: "Registered Nurse" },
  { value: "civil_engineer", label: "Civil Engineer" },
  { value: "accountant", label: "Accountant" },
  { value: "graphic_designer", label: "Graphic Designer" },
  { value: "project_manager", label: "Project Manager" },
  { value: "teacher", label: "Teacher / Educator" },
  { value: "electrician", label: "Electrician" },
  { value: "other", label: "Other Profession" },
];

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profession: "",
    customProfession: "",
    city: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showOther = form.profession === "other";
  const isValid =
    form.firstName.trim().length >= 1 &&
    form.lastName.trim().length >= 1 &&
    form.profession !== "" &&
    (!showOther || form.customProfession.trim().length >= 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-3">
          <UserCircle className="w-6 h-6 text-[#C6FF34]" />
        </div>
        <h2 className="text-xl font-bold text-white">Create Your Levav ID™</h2>
        <p className="text-xs text-white/50 mt-1">
          Step 2 of 3 — Your professional identity in the ecosystem
        </p>
      </div>

      <GlassCard variant="strong" animate={false}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-white/50 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="glass-input w-full"
                placeholder="John"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-white/50 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="glass-input w-full"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1.5 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="glass-input w-full"
              placeholder="+260 97X XXX XXX"
            />
          </div>

          {/* ─── PROFESSION DROPDOWN WITH "OTHER" FIELD ─── */}
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Profession
            </label>
            <div className="relative">
              <select
                value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value })}
                className="glass-input w-full appearance-none cursor-pointer"
                required
              >
                {PROFESSIONS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-[#070a13] text-white">
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>

            {/* Animated "Other" field reveal */}
            <AnimatePresence>
              {showOther && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="glass-card-strong p-4 rounded-lg border-[#C6FF34]/20">
                    <label className="block text-[11px] font-medium text-[#C6FF34] mb-1.5">
                      Your Profession
                    </label>
                    <input
                      type="text"
                      value={form.customProfession}
                      onChange={(e) => setForm({ ...form, customProfession: e.target.value })}
                      className="glass-input w-full border-[#C6FF34]/30 focus:border-[#C6FF34]"
                      placeholder="e.g. Renewable Energy Technician"
                      autoFocus
                      required={showOther}
                    />
                    <p className="mt-2 text-[10px] text-white/40">
                      This customizes your Levav 28™ daily challenges.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* City */}
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> City
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="glass-input w-full"
              placeholder="Lusaka"
            />
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!isValid || isSubmitting}
            className="btn-lime w-full flex items-center justify-center gap-2 disabled:opacity-30"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
              />
            ) : (
              <>Create Levav ID™</>
            )}
          </motion.button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
