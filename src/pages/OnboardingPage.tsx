/**
 * ============================================================
 * ONBOARDING PAGE — Levav ID™ Creation
 * ============================================================
 * The entry point to the Levav™ ecosystem. Captures rich
 * profile data to personalize the Levav 28™ Crucible:
 *   - Profession & specific role
 *   - Current workplace & experience level
 *   - Career stage & current challenges
 * Completing this creates your Levav ID™ and redirects to
 * the Levav 28™ Crucible — the core assessment engine.
 * ============================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  ChevronDown, Sparkles, BookOpen, Heart, Zap,
  User, Briefcase, Building2, MapPin, ArrowRight,
  CheckCircle2, Clock, AlertCircle, TrendingUp,
  GraduationCap, Wrench, Stethoscope, Code, Calculator,
  Palette, HardHat, Phone, ChefHat, Truck, BarChart3,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router";

interface ProfessionOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const PROFESSIONS: ProfessionOption[] = [
  { value: "software_developer", label: "Technology & Software", icon: <Code className="w-5 h-5" />, roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "DevOps Engineer", "QA Engineer", "Data Engineer", "Cybersecurity Analyst", "IT Support Specialist", "Other (specify)"] },
  { value: "registered_nurse", label: "Healthcare & Medicine", icon: <Stethoscope className="w-5 h-5" />, roles: ["Registered Nurse", "Clinical Officer", "Pharmacist", "Lab Technician", "Healthcare Assistant", "Midwife", "Community Health Worker", "Medical Records Clerk", "Other (specify)"] },
  { value: "teacher", label: "Education & Training", icon: <GraduationCap className="w-5 h-5" />, roles: ["Primary School Teacher", "Secondary School Teacher", "High School Teacher", "University Lecturer", "Private Tutor", "School Administrator", "Special Education Teacher", "Other (specify)"] },
  { value: "accountant", label: "Finance & Accounting", icon: <Calculator className="w-5 h-5" />, roles: ["Accountant", "Financial Analyst", "Auditor", "Tax Consultant", "Bookkeeper", "Bank Teller", "Loan Officer", "Insurance Agent", "Other (specify)"] },
  { value: "sales_representative", label: "Sales & Marketing", icon: <BarChart3 className="w-5 h-5" />, roles: ["Sales Representative", "Marketing Manager", "Digital Marketer", "Brand Manager", "Business Development", "Customer Relations", "Social Media Manager", "Other (specify)"] },
  { value: "project_manager", label: "Management & Operations", icon: <Briefcase className="w-5 h-5" />, roles: ["Project Manager", "Operations Manager", "Office Administrator", "Human Resources", "Supply Chain Manager", "Quality Assurance Manager", "Other (specify)"] },
  { value: "graphic_designer", label: "Creative & Design", icon: <Palette className="w-5 h-5" />, roles: ["Graphic Designer", "UI/UX Designer", "Video Editor", "Photographer", "Content Creator", "Fashion Designer", "Interior Designer", "Other (specify)"] },
  { value: "electrician", label: "Trades & Technical", icon: <Wrench className="w-5 h-5" />, roles: ["Electrician", "Plumber", "Carpenter", "Mason/Builder", "Auto Mechanic", "HVAC Technician", "Welder", "Tailor/Seamstress", "Other (specify)"] },
  { value: "customer_service", label: "Customer Service", icon: <Phone className="w-5 h-5" />, roles: ["Customer Service Rep", "Call Center Agent", "Receptionist", "Help Desk Support", "Client Success Manager", "Other (specify)"] },
  { value: "chef", label: "Hospitality & Food", icon: <ChefHat className="w-5 h-5" />, roles: ["Chef/Cook", "Restaurant Manager", "Hotel Receptionist", "Housekeeping Supervisor", "Event Coordinator", "Bartender", "Waiter/Waitress", "Other (specify)"] },
  { value: "civil_engineer", label: "Engineering", icon: <HardHat className="w-5 h-5" />, roles: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Structural Engineer", "Surveying Technician", "Architect", "Quantity Surveyor", "Other (specify)"] },
  { value: "other", label: "Other Profession", icon: <Sparkles className="w-5 h-5" />, roles: ["Agricultural Officer", "Legal Assistant", "Security Officer", "Driver/Logistics", "Social Worker", "Journalist/Writer", "Musician/Artist", "Entrepreneur", "Unemployed / Looking for work", "Student", "Other (specify)"] },
];

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "0-2 years — Entry Level", desc: "Just starting or early career" },
  { value: "mid", label: "3-5 years — Mid Level", desc: "Building expertise" },
  { value: "senior", label: "6-10 years — Senior Level", desc: "Leading and mentoring others" },
  { value: "expert", label: "10+ years — Expert/Leadership", desc: "Strategic decision maker" },
];

const CHALLENGES = [
  "Finding a job", "Advancing my career", "Learning new skills",
  "Switching careers", "Starting a business", "Improving my performance",
  "Leadership development", "Work-life balance",
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProf, setSelectedProf] = useState<ProfessionOption | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [experience, setExperience] = useState("");
  const [challenge, setChallenge] = useState("");
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", city: "", province: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showCustomRole = selectedRole === "Other (specify)";
  const canSubmit = formData.firstName && formData.lastName && selectedProf && selectedRole && (selectedRole !== "Other (specify)" || customRole) && experience;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const finalRole = selectedRole === "Other (specify)" ? customRole : selectedRole;
    const profile = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: `${formData.firstName} ${formData.lastName}`,
      profession: selectedProf?.label ?? "Professional",
      professionValue: selectedProf?.value ?? "other",
      role: finalRole,
      workplace: workplace || "Not specified",
      experience: experience,
      challenge: challenge || "General career growth",
      phone: formData.phone,
      city: formData.city,
      province: formData.province,
      levavCode: `LVA-${formData.firstName.slice(0, 1)}${formData.lastName.slice(0, 2)}${Math.floor(Math.random() * 900) + 100}`.toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("levav_profile", JSON.stringify(profile));
    toast.success("Levav ID™ created! Your personalized journey begins now.");
    setIsSubmitting(false);
    navigate("/crucible");
  };

  return (
    <div className="min-h-screen bg-black py-6 sm:py-12">
      <div className="levav-container max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C6FF34]/10 mb-4">
            <Sparkles className="w-8 h-8 text-[#C6FF34]" />
          </div>
          <h1 className="text-hero mb-2">Join Levav™</h1>
          <p className="text-body">Africa&apos;s Workforce Intelligence Ecosystem™</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { num: 1, label: "Who You Are" },
            { num: 2, label: "Your Career" },
            { num: 3, label: "Levav 28™" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= s.num ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/30"}`}>{s.num}</div>
              <span className={`text-[10px] ${step >= s.num ? "text-[#C6FF34]" : "text-white/30"}`}>{s.label}</span>
              {i < 2 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        <GlassCard variant="strong" delay={0.1}>
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: WHO YOU ARE ─── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Who You Are</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">First Name *</label>
                    <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="glass-input w-full" placeholder="Chanda" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name *</label>
                    <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="glass-input w-full" placeholder="Banda" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="glass-input w-full" placeholder="+260 97X XXX XXX" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">City</label>
                    <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="glass-input w-full" placeholder="Lusaka" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Province</label>
                    <input type="text" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className="glass-input w-full" placeholder="Lusaka Province" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!formData.firstName || !formData.lastName}
                  className="btn-lime w-full flex items-center justify-center gap-2 disabled:opacity-30">
                  Next: Your Career <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* ─── STEP 2: YOUR CAREER ─── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Tell Us About Your Career</h2>
                </div>
                <p className="text-xs text-white/40">This helps us personalize your Levav 28™ experience.</p>

                {/* Profession */}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Your Field *</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {PROFESSIONS.map((prof) => (
                      <button key={prof.value} onClick={() => { setSelectedProf(prof); setSelectedRole(""); }}
                        className={`flex items-center gap-2 p-3 rounded-xl text-left transition-all ${
                          selectedProf?.value === prof.value ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                        }`}>
                        <div className={selectedProf?.value === prof.value ? "text-[#C6FF34]" : "text-white/40"}>{prof.icon}</div>
                        <span className={`text-[11px] font-medium ${selectedProf?.value === prof.value ? "text-[#C6FF34]" : "text-white/70"}`}>{prof.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specific Role */}
                <AnimatePresence>
                  {selectedProf && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-medium text-white/60 mb-2">Your Specific Role *</label>
                      <div className="relative">
                        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="glass-input w-full appearance-none cursor-pointer" required>
                          <option value="" className="bg-[#070a13]">Select your role...</option>
                          {selectedProf.roles.map((r) => <option key={r} value={r} className="bg-[#070a13]">{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Custom Role */}
                <AnimatePresence>
                  {showCustomRole && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <input type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)} className="glass-input w-full border-[#C6FF34]/30" placeholder="Enter your specific role..." autoFocus required={showCustomRole} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Workplace */}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Where Do You Work? (Optional)</label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input type="text" value={workplace} onChange={(e) => setWorkplace(e.target.value)} className="glass-input w-full" placeholder="Company, school, hospital, or 'Between jobs'" />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Experience Level *</label>
                  <div className="space-y-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button key={level.value} onClick={() => setExperience(level.value)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          experience === level.value ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                        }`}>
                        <Clock className={`w-4 h-4 ${experience === level.value ? "text-[#C6FF34]" : "text-white/30"}`} />
                        <div>
                          <p className={`text-xs font-medium ${experience === level.value ? "text-[#C6FF34]" : "text-white/70"}`}>{level.label}</p>
                          <p className="text-[10px] text-white/40">{level.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Challenge */}
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Your Biggest Career Challenge Right Now</label>
                  <div className="flex flex-wrap gap-2">
                    {CHALLENGES.map((c) => (
                      <button key={c} onClick={() => setChallenge(c)}
                        className={`px-3 py-1.5 rounded-full text-[11px] transition-all ${
                          challenge === c ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/50 hover:bg-white/10"
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all">Back</button>
                  <button onClick={() => setStep(3)} disabled={!selectedProf || !selectedRole || !experience}
                    className="flex-[2] btn-lime flex items-center justify-center gap-2 disabled:opacity-30">
                    Next: Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: REVIEW & CREATE ─── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Review Your Profile</h2>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between"><span className="text-xs text-white/40">Name</span><span className="text-xs text-white/80">{formData.firstName} {formData.lastName}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Field</span><span className="text-xs text-white/80">{selectedProf?.label}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Role</span><span className="text-xs text-white/80">{selectedRole === "Other (specify)" ? customRole : selectedRole}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Experience</span><span className="text-xs text-white/80">{EXPERIENCE_LEVELS.find((e) => e.value === experience)?.label}</span></div>
                  {workplace && <div className="flex justify-between"><span className="text-xs text-white/40">Workplace</span><span className="text-xs text-white/80">{workplace}</span></div>}
                  {challenge && <div className="flex justify-between"><span className="text-xs text-white/40">Focus</span><span className="text-xs text-white/80">{challenge}</span></div>}
                  <div className="flex justify-between"><span className="text-xs text-white/40">City</span><span className="text-xs text-white/80">{formData.city || "—"}</span></div>
                </div>

                <div className="p-4 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#C6FF34]" />
                    <span className="text-xs font-medium text-[#C6FF34]">What Happens Next</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Your Levav 28™ Crucible will be personalized for a <strong className="text-white/70">{selectedRole === "Other (specify)" ? customRole : selectedRole}</strong> with <strong className="text-white/70">{EXPERIENCE_LEVELS.find((e) => e.value === experience)?.label.split(" — ")[1]}</strong> experience. 
                    Each day you will face real workplace scenarios tailored to your field — CONFRONT™, DISSECT™, OWN™, and EXECUTE™.
                  </p>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting}
                  className="btn-lime w-full flex items-center justify-center gap-2 disabled:opacity-30">
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Create Levav ID™ & Start Crucible</>
                  )}
                </button>
                <button onClick={() => setStep(2)} className="w-full py-2 text-xs text-white/40 hover:text-white/60 transition-all">Edit Profile</button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
}
