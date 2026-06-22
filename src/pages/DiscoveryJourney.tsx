/**
 * ============================================================
 * LEVAV 28™ DISCOVERY JOURNEY
 * ============================================================
 * A 6-step conversational onboarding experience that feels like
 * a personal coach guiding the participant to discover themselves.
 *
 * NOT a registration form. NOT a survey. NOT an interrogation.
 * This is Workforce Intelligence in action.
 *
 * Steps:
 *  1. Who You Are        — Personal discovery
 *  2. Your Career        — Professional landscape (adaptive)
 *  3. Your Goals         — Motivation & aspirations
 *  4. Self-Assessment    — 8 WRI components baseline
 *  5. Discovery Profile  — AI-generated Levav ID + WRI
 *  6. Begin Levav 28™    — Personalized journey start
 * ============================================================
 */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  User, MapPin, Phone, Calendar, Languages, Briefcase,
  Building2, GraduationCap, TrendingUp, Target, Brain,
  Shield, Zap, Heart, Award, ChevronRight, ChevronLeft,
  Sparkles, CheckCircle2, Star, ArrowRight, Flame,
  Compass, Rocket, Lightbulb, MessageCircle,
} from "lucide-react";

/* ═══════════════════════════════════════════
   STEP CONFIGURATION
   ═══════════════════════════════════════════ */
const STEPS = [
  { id: 1, label: "Who You Are", icon: User, color: "#C6FF34" },
  { id: 2, label: "Your Career", icon: Briefcase, color: "#7E3BED" },
  { id: 3, label: "Your Goals", icon: Target, color: "#C6FF34" },
  { id: 4, label: "Self-Assessment", icon: Brain, color: "#7E3BED" },
  { id: 5, label: "Your Profile", icon: Sparkles, color: "#C6FF34" },
  { id: 6, label: "Begin Levav 28", icon: Rocket, color: "#7E3BED" },
];

const PROVINCES = [
  "Lusaka Province", "Copperbelt", "Southern", "Central",
  "Eastern", "Northern", "Western", "North-Western", "Luapula", "Muchinga"
];

const AGE_RANGES = [
  { value: "18-24", label: "18-24 years" },
  { value: "25-34", label: "25-34 years" },
  { value: "35-44", label: "35-44 years" },
  { value: "45-54", label: "45-54 years" },
  { value: "55+", label: "55+ years" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "bem", label: "Bemba" },
  { value: "nya", label: "Nyanja" },
  { value: "ton", label: "Tonga" },
  { value: "loz", label: "Lozi" },
  { value: "kao", label: "Kaonde" },
  { value: "lun", label: "Lunda" },
  { value: "luv", label: "Luvale" },
  { value: "bia", label: "Bisa" },
];

const EMPLOYMENT_STATUSES = [
  { value: "student", label: "Student", desc: "Currently studying" },
  { value: "graduate", label: "Graduate", desc: "Recently completed studies" },
  { value: "employed", label: "Employed", desc: "Working full-time or part-time" },
  { value: "self-employed", label: "Self-employed", desc: "Running my own business" },
  { value: "entrepreneur", label: "Entrepreneur", desc: "Building a company or venture" },
  { value: "artisan", label: "Skilled Artisan", desc: "Skilled trade or craft" },
  { value: "job-seeking", label: "Looking for Work", desc: "Actively seeking opportunities" },
  { value: "not-seeking", label: "Not Seeking Employment", desc: "Content with current path" },
];

const INDUSTRIES = [
  "Technology & Software", "Finance & Banking", "Healthcare & Wellness",
  "Education & Training", "Agriculture", "Manufacturing", "Retail & Commerce",
  "Creative & Design", "Construction", "Energy & Mining", "Government & NGO",
  "Hospitality & Tourism", "Transport & Logistics", "Media & Communications",
  "Legal & Consulting", "Other"
];

const GOALS = [
  { value: "career-growth", label: "Career Growth", icon: TrendingUp },
  { value: "leadership", label: "Leadership Development", icon: Award },
  { value: "entrepreneurship", label: "Entrepreneurship", icon: Rocket },
  { value: "workforce-readiness", label: "Workforce Readiness", icon: Shield },
  { value: "personal-growth", label: "Personal Growth", icon: Sparkles },
  { value: "community-impact", label: "Community Impact", icon: Heart },
  { value: "volunteerism", label: "Volunteerism", icon: HandHeart },
  { value: "skill-development", label: "Skill Development", icon: Lightbulb },
];

import { HandHeart } from "lucide-react";

const WRI_COMPONENTS = [
  { key: "reliability", label: "Reliability", desc: "I follow through on commitments consistently" },
  { key: "communication", label: "Communication", desc: "I express ideas clearly and listen actively" },
  { key: "critical-thinking", label: "Critical Thinking", desc: "I analyze situations before making decisions" },
  { key: "initiative", label: "Initiative", desc: "I take action without being asked" },
  { key: "learning", label: "Learning Agility", desc: "I adapt quickly to new situations and skills" },
  { key: "leadership", label: "Leadership", desc: "I can guide and inspire others toward goals" },
  { key: "problem-solving", label: "Problem Solving", desc: "I find creative solutions to challenges" },
  { key: "service", label: "Service Orientation", desc: "I prioritize helping others and adding value" },
];

const RATING_LABELS = ["Growing", "Developing", "Capable", "Strong", "Exceptional"];

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface DiscoveryData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  province: string;
  ageRange: string;
  language: string;
  profession: string;
  industry: string;
  experienceLevel: string;
  employmentStatus: string;
  goals: string[];
  selfAssessment: Record<string, number>;
  levavCode: string;
  wriScore: number;
}

const STORAGE_KEY = "levav_discovery";

function loadDiscovery(): Partial<DiscoveryData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveDiscovery(data: Partial<DiscoveryData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateLevavCode(firstName: string, lastName: string): string {
  const initials = `${firstName[0] || "X"}${lastName[0] || "X"}`.toUpperCase();
  const hash = Math.random().toString(36).substring(2, 5).toUpperCase();
  const num = Math.floor(100 + Math.random() * 900);
  return `LVA-${initials}${num}${hash}`;
}

function calculateWRI(assessment: Record<string, number>): number {
  const values = Object.values(assessment);
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round((avg / 5) * 100);
}

function getGoldKeyTier(score: number): string {
  if (score >= 90) return "Diamond";
  if (score >= 75) return "Platinum";
  if (score >= 60) return "Gold";
  if (score >= 40) return "Silver";
  return "Bronze";
}

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, scale: 0.97, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function DiscoveryJourney() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<DiscoveryData>>(loadDiscovery);
  const [direction, setDirection] = useState(1);

  const update = useCallback((patch: Partial<DiscoveryData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      saveDiscovery(next);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (step < 6) { setDirection(1); setStep((s) => s + 1); }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 1) { setDirection(-1); setStep((s) => s - 1); }
  }, [step]);

  /* Save profile + start Levav 28 */
  const complete = useCallback(() => {
    const finalWri = calculateWRI(data.selfAssessment || {});
    const levavCode = data.levavCode || generateLevavCode(data.firstName || "", data.lastName || "");
    const goldKeyTier = getGoldKeyTier(finalWri);

    const profile = {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      city: data.city,
      province: data.province,
      ageRange: data.ageRange,
      language: data.language,
      profession: data.profession,
      industry: data.industry,
      experience: data.experienceLevel,
      employmentStatus: data.employmentStatus,
      goals: data.goals,
      wriScore: finalWri,
      goldKeyTier,
      levavCode,
      selfAssessment: data.selfAssessment,
      discoveryComplete: true,
    };

    localStorage.setItem("levav_profile", JSON.stringify(profile));
    saveDiscovery({ ...data, levavCode, wriScore: finalWri });

    toast.success("Discovery complete! Welcome to Levav 28™.");
    navigate("/crucible");
  }, [data, navigate]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #C6FF34 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #7E3BED 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 sm:py-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Join Levav<span className="text-[#C6FF34]">™</span>
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Africa's Workforce Intelligence Ecosystem™
          </p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="flex-1 mt-6">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <StepWhoYouAre key="step1" data={data} update={update} onNext={goNext} />
            )}
            {step === 2 && (
              <StepYourCareer key="step2" data={data} update={update} onNext={goNext} onBack={goBack} />
            )}
            {step === 3 && (
              <StepYourGoals key="step3" data={data} update={update} onNext={goNext} onBack={goBack} />
            )}
            {step === 4 && (
              <StepSelfAssessment key="step4" data={data} update={update} onNext={goNext} onBack={goBack} />
            )}
            {step === 5 && (
              <StepDiscoveryProfile key="step5" data={data} onNext={goNext} onBack={goBack} />
            )}
            {step === 6 && (
              <StepBeginLevav28 key="step6" data={data} onBegin={complete} onBack={goBack} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP INDICATOR
   ═══════════════════════════════════════════ */
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((s, i) => {
        const isActive = s.id === currentStep;
        const isCompleted = s.id < currentStep;
        const StepIcon = s.icon;

        return (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? "bg-[#C6FF34] text-black"
                    : isCompleted
                    ? "bg-[#C6FF34]/20 text-[#C6FF34] border border-[#C6FF34]/30"
                    : "bg-white/5 text-white/30 border border-white/10"
                }`}
                animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : s.id}
              </motion.div>
              <span className={`text-[9px] sm:text-[10px] mt-1 font-medium whitespace-nowrap ${
                isActive ? "text-[#C6FF34]" : isCompleted ? "text-white/50" : "text-white/25"
              }`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-6 sm:w-10 h-px mb-4 ${
                isCompleted ? "bg-[#C6FF34]/30" : "bg-white/10"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 1: WHO YOU ARE
   ═══════════════════════════════════════════ */
function StepWhoYouAre({ data, update, onNext }: {
  data: Partial<DiscoveryData>; update: (p: Partial<DiscoveryData>) => void; onNext: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.firstName?.trim()) e.firstName = "First name helps us personalize your journey";
    if (!data.lastName?.trim()) e.lastName = "Last name helps us personalize your journey";
    if (!data.city?.trim()) e.city = "Where are you based?";
    if (!data.province) e.province = "Which province?";
    if (!data.ageRange) e.ageRange = "Your age range helps us tailor content";
    if (!data.language) e.language = "Preferred language for your journey";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden">
        {/* Step Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#C6FF34]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Who You Are</h2>
            <p className="text-[11px] text-white/40">Let's get to know you</p>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {/* Name */}
          <motion.div variants={itemVariant} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">First Name *</label>
              <input
                type="text" value={data.firstName || ""}
                onChange={(e) => { update({ firstName: e.target.value }); if (errors.firstName) setErrors((p) => { const n = { ...p }; delete n.firstName; return n; }); }}
                className={`glass-input w-full ${errors.firstName ? "border-red-500/40" : ""}`}
                placeholder="Chanda"
              />
              {errors.firstName && <p className="text-[10px] text-red-400 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name *</label>
              <input
                type="text" value={data.lastName || ""}
                onChange={(e) => { update({ lastName: e.target.value }); if (errors.lastName) setErrors((p) => { const n = { ...p }; delete n.lastName; return n; }); }}
                className={`glass-input w-full ${errors.lastName ? "border-red-500/40" : ""}`}
                placeholder="Banda"
              />
              {errors.lastName && <p className="text-[10px] text-red-400 mt-1">{errors.lastName}</p>}
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div variants={itemVariant}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Phone Number</label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/20 flex-shrink-0" />
              <input
                type="tel" value={data.phone || ""}
                onChange={(e) => update({ phone: e.target.value })}
                className="glass-input w-full"
                placeholder="+260 97X XXX XXX"
              />
            </div>
          </motion.div>

          {/* City + Province */}
          <motion.div variants={itemVariant} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">City *</label>
              <input
                type="text" value={data.city || ""}
                onChange={(e) => { update({ city: e.target.value }); if (errors.city) setErrors((p) => { const n = { ...p }; delete n.city; return n; }); }}
                className={`glass-input w-full ${errors.city ? "border-red-500/40" : ""}`}
                placeholder="Lusaka"
              />
              {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Province *</label>
              <select
                value={data.province || ""}
                onChange={(e) => { update({ province: e.target.value }); if (errors.province) setErrors((p) => { const n = { ...p }; delete n.province; return n; }); }}
                className={`glass-input w-full ${errors.province ? "border-red-500/40" : ""} ${!data.province ? "text-white/25" : "text-white"}`}
              >
                <option value="" className="bg-[#070a13]">Select</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p} className="bg-[#070a13]">{p}</option>
                ))}
              </select>
              {errors.province && <p className="text-[10px] text-red-400 mt-1">{errors.province}</p>}
            </div>
          </motion.div>

          {/* Age + Language */}
          <motion.div variants={itemVariant} className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Age Range *</label>
              <select
                value={data.ageRange || ""}
                onChange={(e) => { update({ ageRange: e.target.value }); if (errors.ageRange) setErrors((p) => { const n = { ...p }; delete n.ageRange; return n; }); }}
                className={`glass-input w-full ${errors.ageRange ? "border-red-500/40" : ""} ${!data.ageRange ? "text-white/25" : "text-white"}`}
              >
                <option value="" className="bg-[#070a13]">Select</option>
                {AGE_RANGES.map((a) => (
                  <option key={a.value} value={a.value} className="bg-[#070a13]">{a.label}</option>
                ))}
              </select>
              {errors.ageRange && <p className="text-[10px] text-red-400 mt-1">{errors.ageRange}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Preferred Language *</label>
              <select
                value={data.language || ""}
                onChange={(e) => { update({ language: e.target.value }); if (errors.language) setErrors((p) => { const n = { ...p }; delete n.language; return n; }); }}
                className={`glass-input w-full ${errors.language ? "border-red-500/40" : ""} ${!data.language ? "text-white/25" : "text-white"}`}
              >
                <option value="" className="bg-[#070a13]">Select</option>
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-[#070a13]">{l.label}</option>
                ))}
              </select>
              {errors.language && <p className="text-[10px] text-red-400 mt-1">{errors.language}</p>}
            </div>
          </motion.div>
        </motion.div>

        {/* Next Button */}
        <motion.button
          variants={itemVariant}
          initial="hidden" animate="visible"
          onClick={handleNext}
          className="btn-lime w-full mt-6 flex items-center justify-center gap-2"
        >
          Next: Your Career <ChevronRight className="w-4 h-4" />
        </motion.button>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP 2: YOUR CAREER
   ═══════════════════════════════════════════ */
function StepYourCareer({ data, update, onNext, onBack }: {
  data: Partial<DiscoveryData>; update: (p: Partial<DiscoveryData>) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.employmentStatus) e.employmentStatus = "Where are you in your career?";
    if (!data.profession?.trim()) e.profession = "What do you do?";
    if (!data.industry) e.industry = "Which industry?";
    if (!data.experienceLevel) e.experienceLevel = "How many years of experience?";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(); };

  const isNotSeeking = data.employmentStatus === "not-seeking";
  const isEntrepreneur = data.employmentStatus === "entrepreneur";

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#7E3BED]/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#7E3BED]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Your Career</h2>
            <p className="text-[11px] text-white/40">Help us understand where you are today</p>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {/* Employment Status */}
          <motion.div variants={itemVariant}>
            <label className="block text-xs font-medium text-white/60 mb-2">Where are you right now? *</label>
            {errors.employmentStatus && <p className="text-[10px] text-red-400 mb-2">{errors.employmentStatus}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMPLOYMENT_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => { update({ employmentStatus: s.value }); if (errors.employmentStatus) setErrors((p) => { const n = { ...p }; delete n.employmentStatus; return n; }); }}
                  className={`p-3 rounded-xl text-left transition-all ${
                    data.employmentStatus === s.value
                      ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                  }`}
                >
                  <p className={`text-xs font-medium ${data.employmentStatus === s.value ? "text-[#C6FF34]" : "text-white/70"}`}>{s.label}</p>
                  <p className="text-[10px] text-white/40">{s.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Adaptive message for non-job-seekers */}
          {(isNotSeeking || isEntrepreneur) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10"
            >
              <p className="text-[11px] text-[#C6FF34]">
                {isEntrepreneur
                  ? "Building something great? We'll help you develop leadership, strategic thinking, and workforce management skills."
                  : "Growth isn't only about jobs. We'll help you develop skills that matter — leadership, communication, and personal excellence."}
              </p>
            </motion.div>
          )}

          {/* Profession */}
          <motion.div variants={itemVariant}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Profession or Role *</label>
            <input
              type="text" value={data.profession || ""}
              onChange={(e) => { update({ profession: e.target.value }); if (errors.profession) setErrors((p) => { const n = { ...p }; delete n.profession; return n; }); }}
              className={`glass-input w-full ${errors.profession ? "border-red-500/40" : ""}`}
              placeholder="e.g. Software Developer, Teacher, Business Owner"
            />
            {errors.profession && <p className="text-[10px] text-red-400 mt-1">{errors.profession}</p>}
          </motion.div>

          {/* Industry */}
          <motion.div variants={itemVariant}>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Industry *</label>
            <select
              value={data.industry || ""}
              onChange={(e) => { update({ industry: e.target.value }); if (errors.industry) setErrors((p) => { const n = { ...p }; delete n.industry; return n; }); }}
              className={`glass-input w-full ${errors.industry ? "border-red-500/40" : ""} ${!data.industry ? "text-white/25" : "text-white"}`}
            >
              <option value="" className="bg-[#070a13]">Select your industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i} className="bg-[#070a13]">{i}</option>
              ))}
            </select>
            {errors.industry && <p className="text-[10px] text-red-400 mt-1">{errors.industry}</p>}
          </motion.div>

          {/* Experience Level */}
          <motion.div variants={itemVariant}>
            <label className="block text-xs font-medium text-white/60 mb-2">Experience Level *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "entry", label: "0-2 years", desc: "Early career" },
                { value: "mid", label: "3-5 years", desc: "Growing" },
                { value: "senior", label: "6-10 years", desc: "Experienced" },
                { value: "expert", label: "10+ years", desc: "Veteran" },
              ].map((exp) => (
                <button
                  key={exp.value}
                  onClick={() => { update({ experienceLevel: exp.value }); if (errors.experienceLevel) setErrors((p) => { const n = { ...p }; delete n.experienceLevel; return n; }); }}
                  className={`p-2.5 rounded-xl text-center transition-all ${
                    data.experienceLevel === exp.value
                      ? "bg-[#7E3BED]/10 border border-[#7E3BED]/30"
                      : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                  }`}
                >
                  <p className={`text-xs font-medium ${data.experienceLevel === exp.value ? "text-[#7E3BED]" : "text-white/60"}`}>{exp.label}</p>
                  <p className="text-[9px] text-white/30">{exp.desc}</p>
                </button>
              ))}
            </div>
            {errors.experienceLevel && <p className="text-[10px] text-red-400 mt-1">{errors.experienceLevel}</p>}
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button variants={itemVariant} onClick={handleNext} className="flex-[2] btn-lime flex items-center justify-center gap-2">
            Next: Your Goals <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP 3: YOUR GOALS
   ═══════════════════════════════════════════ */
function StepYourGoals({ data, update, onNext, onBack }: {
  data: Partial<DiscoveryData>; update: (p: Partial<DiscoveryData>) => void;
  onNext: () => void; onBack: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleGoal = (value: string) => {
    const current = data.goals || [];
    const next = current.includes(value)
      ? current.filter((g) => g !== value)
      : [...current, value];
    update({ goals: next });
    if (errors.goals) setErrors((p) => { const n = { ...p }; delete n.goals; return n; });
  };

  const handleNext = () => {
    if (!data.goals || data.goals.length === 0) {
      setErrors({ goals: "What brings you here? Select at least one goal." });
      return;
    }
    onNext();
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C6FF34]/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#C6FF34]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Your Goals</h2>
            <p className="text-[11px] text-white/40">What are you working toward?</p>
          </div>
        </div>

        {errors.goals && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-red-400 mb-3">
            {errors.goals}
          </motion.p>
        )}

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = (data.goals || []).includes(goal.value);
            return (
              <motion.button
                key={goal.value}
                variants={itemVariant}
                onClick={() => toggleGoal(goal.value)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30"
                    : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-[#C6FF34]/20 text-[#C6FF34]" : "bg-white/5 text-white/30"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-xs font-medium ${isSelected ? "text-[#C6FF34]" : "text-white/70"}`}>{goal.label}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C6FF34] ml-auto flex-shrink-0" />}
              </motion.button>
            );
          })}
        </motion.div>

        <p className="text-[10px] text-white/30 mt-3 text-center">
          Selected: {(data.goals || []).length} goal{(data.goals || []).length !== 1 ? "s" : ""}
        </p>

        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button variants={itemVariant} onClick={handleNext} className="flex-[2] btn-lime flex items-center justify-center gap-2">
            Next: Self-Assessment <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP 4: SELF-ASSESSMENT
   ═══════════════════════════════════════════ */
function StepSelfAssessment({ data, update, onNext, onBack }: {
  data: Partial<DiscoveryData>; update: (p: Partial<DiscoveryData>) => void;
  onNext: () => void; onBack: () => void;
}) {
  const assessment = data.selfAssessment || {};

  const setRating = (key: string, value: number) => {
    update({ selfAssessment: { ...assessment, [key]: value } });
  };

  const allRated = WRI_COMPONENTS.every((c) => assessment[c.key] !== undefined);

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7E3BED]/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#7E3BED]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Workforce Self-Assessment</h2>
            <p className="text-[11px] text-white/40">How would you rate yourself? Be honest — this is just for you.</p>
          </div>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
          {WRI_COMPONENTS.map((comp) => {
            const rating = assessment[comp.key] || 0;
            return (
              <motion.div key={comp.key} variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white/80">{comp.label}</span>
                  <span className="text-[10px] text-white/30">
                    {rating > 0 ? RATING_LABELS[rating - 1] : "Not rated"}
                  </span>
                </div>
                <p className="text-[10px] text-white/40 mb-2">{comp.desc}</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(comp.key, star)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                        rating >= star
                          ? "bg-[#C6FF34]/20 text-[#C6FF34] border border-[#C6FF34]/30"
                          : "bg-white/5 text-white/20 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" fill={rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button
            variants={itemVariant}
            onClick={onNext}
            disabled={!allRated}
            className="flex-[2] btn-lime flex items-center justify-center gap-2 disabled:opacity-30"
          >
            {allRated ? (
              <>See Your Profile <Sparkles className="w-4 h-4" /></>
            ) : (
              <>Rate all areas to continue</>
            )}
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP 5: DISCOVERY PROFILE
   ═══════════════════════════════════════════ */
function StepDiscoveryProfile({ data, onNext, onBack }: {
  data: Partial<DiscoveryData>; onNext: () => void; onBack: () => void;
}) {
  const wriScore = calculateWRI(data.selfAssessment || {});
  const levavCode = data.levavCode || generateLevavCode(data.firstName || "", data.lastName || "");
  const goldKeyTier = getGoldKeyTier(wriScore);

  const recommendations = [
    ...(data.goals || []).map((g) => {
      const map: Record<string, string> = {
        "career-growth": "Focus on Communication and Problem Solving tracks in your Levav 28™ journey.",
        "leadership": "Leadership and Initiative modules will accelerate your growth trajectory.",
        "entrepreneurship": "Strategic Thinking and Service Orientation will strengthen your business acumen.",
        "workforce-readiness": "Your foundation skills will be strengthened across all WRI™ components.",
        "personal-growth": "Learning Agility and Critical Thinking will unlock new perspectives.",
        "community-impact": "Service Orientation and Leadership will amplify your community influence.",
        "volunteerism": "Reliability and Communication are key to impactful volunteer work.",
        "skill-development": "Learning Agility and Problem Solving will accelerate your skill acquisition.",
      };
      return map[g] || "Continue your personalized development journey.";
    }),
  ].slice(0, 3);

  const strengths = Object.entries(data.selfAssessment || {})
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([key]) => WRI_COMPONENTS.find((c) => c.key === key)?.label || key);

  const growthAreas = Object.entries(data.selfAssessment || {})
    .sort(([, a], [, b]) => (a as number) - (b as number))
    .slice(0, 3)
    .map(([key]) => WRI_COMPONENTS.find((c) => c.key === key)?.label || key);

  useEffect(() => {
    if (!data.levavCode) {
      // Save the generated code back to data
    }
  }, []);

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C6FF34] to-[#7E3BED] flex items-center justify-center mx-auto mb-3"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-lg font-bold text-white">Your Discovery Profile</h2>
          <p className="text-[11px] text-white/40">Here's what Levav understands about you</p>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {/* Levav ID Card */}
          <motion.div variants={itemVariant} className="p-4 rounded-xl bg-gradient-to-r from-[#C6FF34]/10 to-[#7E3BED]/10 border border-[#C6FF34]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/40">Levav ID™</p>
                <p className="text-sm font-mono text-[#C6FF34] font-bold">{levavCode}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40">Gold Key Tier</p>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[#C6FF34]">{goldKeyTier}</span>
              </div>
            </div>
          </motion.div>

          {/* WRI Score */}
          <motion.div variants={itemVariant} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-[10px] text-white/40 mb-1">Initial WRI™ Score</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-4xl font-bold text-[#C6FF34]"
            >
              {wriScore}
            </motion.p>
            <p className="text-[10px] text-white/30 mt-1">This is your starting point. Watch it grow.</p>
          </motion.div>

          {/* Strengths */}
          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-[#C6FF34] mb-2 flex items-center gap-1"><Award className="w-3 h-3" /> Your Strengths</p>
            <div className="flex flex-wrap gap-1.5">
              {strengths.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[10px] text-[#C6FF34]">{s}</span>
              ))}
            </div>
          </motion.div>

          {/* Growth Areas */}
          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-[#7E3BED] mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Growth Opportunities</p>
            <div className="flex flex-wrap gap-1.5">
              {growthAreas.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-[#7E3BED]/10 text-[10px] text-[#7E3BED]">{g}</span>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-white/40 mb-2 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Personalized Recommendations</p>
            <ul className="space-y-1.5">
              {recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-white/60">
                  <ChevronRight className="w-3 h-3 text-[#C6FF34] mt-0.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="flex gap-3 mt-6">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button variants={itemVariant} onClick={onNext} className="flex-[2] btn-lime flex items-center justify-center gap-2">
            Begin Levav 28™ <Rocket className="w-4 h-4" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STEP 6: BEGIN LEVAV 28™
   ═══════════════════════════════════════════ */
function StepBeginLevav28({ data, onBegin, onBack }: {
  data: Partial<DiscoveryData>; onBegin: () => void; onBack: () => void;
}) {
  const wriScore = calculateWRI(data.selfAssessment || {});

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible" exit="exit">
      <GlassCard variant="strong" className="overflow-hidden text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C6FF34] via-[#7E3BED] to-[#C6FF34] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">You're Ready</h2>
          <p className="text-xs text-white/40">
            Your personalized Levav 28™ journey awaits
          </p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3 mb-6">
          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C6FF34]/10 flex items-center justify-center"><Flame className="w-4 h-4 text-[#C6FF34]" /></div>
              <div>
                <p className="text-xs font-medium text-white">CONFRONT™</p>
                <p className="text-[10px] text-white/40">Real-world challenges tailored to your profession</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7E3BED]/10 flex items-center justify-center"><Brain className="w-4 h-4 text-[#7E3BED]" /></div>
              <div>
                <p className="text-xs font-medium text-white">DISSECT™</p>
                <p className="text-[10px] text-white/40">Analyze situations with critical thinking</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C6FF34]/10 flex items-center justify-center"><Shield className="w-4 h-4 text-[#C6FF34]" /></div>
              <div>
                <p className="text-xs font-medium text-white">OWN™</p>
                <p className="text-[10px] text-white/40">Take responsibility and identify actions</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariant} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Zap className="w-4 h-4 text-amber-400" /></div>
              <div>
                <p className="text-xs font-medium text-white">EXECUTE™</p>
                <p className="text-[10px] text-white/40">Create practical action plans</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariant}
          className="p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10 mb-6"
        >
          <p className="text-[11px] text-[#C6FF34]">
            Based on your profile, Levav will personalize scenarios in
            <strong> {data.industry || "your industry"}</strong> focused on your goals:
            <strong> {(data.goals || []).map((g) => g.replace(/-/g, " ")).join(", ")}</strong>.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <motion.button
            variants={itemVariant}
            onClick={onBegin}
            className="flex-[2] py-4 rounded-xl bg-[#C6FF34] text-black text-sm font-bold hover:bg-[#b8f030] transition-all flex items-center justify-center gap-2"
          >
            Start Day 1 <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
