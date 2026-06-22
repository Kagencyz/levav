/**
 * ============================================================
 * CHAMPION ONBOARDING — Application Flow
 * ============================================================
 * Multi-step application to become a Levav Champion™:
 *   Step 1: Verify Identity & Levav ID™
 *   Step 2: Expertise & Experience
 *   Step 3: Mentorship Preferences
 *   Step 4: Motivation & Portfolio
 *   Step 5: Review & Submit
 * Connected to data-layer.ts — stores application in Champions store.
 * ============================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Crown, ChevronRight, ChevronLeft, CheckCircle2, UserCheck,
  BookOpen, Clock, Users, Star, Shield, Zap, Heart,
  Briefcase, MapPin, Award, TrendingUp, AlertCircle,
  FileText, Video, Mic, Globe, Linkedin,
} from "lucide-react";
import { getProfile, submitChampionApplication } from "@/lib/data-layer";

const EXPERTISE_AREAS = [
  "Career Coaching",
  "Technical Mentorship",
  "Interview Preparation",
  "Resume Building",
  "Portfolio Review",
  "Leadership Development",
  "Design Career Guidance",
  "Business Skills",
  "Academic Guidance",
  "Workplace Communication",
];

const MENTORSHIP_STYLES = [
  { value: "one-on-one", label: "One-on-One", desc: "Personal 1:1 mentorship sessions with individual talents" },
  { value: "group", label: "Group Sessions", desc: "Mentor small groups (3-8 people) with shared interests" },
  { value: "async", label: "Asynchronous", desc: "Review submissions, provide written feedback on your own schedule" },
];

const AVAILABILITY_OPTIONS = [
  { value: "3-5 hours/week", label: "3-5 hours/week", desc: "Light commitment" },
  { value: "5-10 hours/week", label: "5-10 hours/week", desc: "Moderate commitment" },
  { value: "10+ hours/week", label: "10+ hours/week", desc: "Heavy commitment" },
];

export default function ChampionOnboardingPage() {
  const navigate = useNavigate();
  const profile = getProfile();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    profession: profile?.profession || "",
    role: profile?.role || "",
    experience: profile?.experience || "",
    wriScore: profile?.wriScore || 72.5,
    goldKeyTier: profile?.goldKeyTier || "Gold",
    levavCode: profile?.levavCode || "",
    expertiseAreas: [] as string[],
    mentorshipStyle: "",
    availability: "",
    motivation: "",
    contentInterest: false,
    linkedinUrl: "",
    portfolioUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (s === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.city) newErrors.city = "City is required";
    }

    if (s === 2) {
      if (formData.expertiseAreas.length === 0) newErrors.expertiseAreas = "Select at least one expertise area";
      if (!formData.profession) newErrors.profession = "Profession is required";
      if (!formData.role) newErrors.role = "Role is required";
    }

    if (s === 3) {
      if (!formData.mentorshipStyle) newErrors.mentorshipStyle = "Select a mentorship style";
      if (!formData.availability) newErrors.availability = "Select your availability";
    }

    if (s === 4) {
      if (!formData.motivation || formData.motivation.length < 50) newErrors.motivation = "Please write at least 50 characters about your motivation";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    const application = submitChampionApplication({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      profession: formData.profession,
      role: formData.role,
      experience: formData.experience,
      wriScore: formData.wriScore,
      goldKeyTier: formData.goldKeyTier,
      levavCode: formData.levavCode || `LVA-${formData.firstName.slice(0, 1)}${formData.lastName.slice(0, 2)}${Math.floor(Math.random() * 900) + 100}`.toUpperCase(),
      expertiseAreas: formData.expertiseAreas,
      mentorshipStyle: formData.mentorshipStyle,
      availability: formData.availability,
      motivation: formData.motivation,
      contentInterest: formData.contentInterest,
      linkedinUrl: formData.linkedinUrl,
      portfolioUrl: formData.portfolioUrl,
    });

    toast.success("Application submitted! Our team will review within 5 business days.");
    setIsSubmitting(false);
    navigate("/champions");
  };

  const toggleExpertise = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(area)
        ? prev.expertiseAreas.filter((a) => a !== area)
        : [...prev.expertiseAreas, area],
    }));
    if (errors.expertiseAreas) setErrors((e) => { const ne = { ...e }; delete ne.expertiseAreas; return ne; });
  };

  return (
    <div className="min-h-screen bg-black py-6 sm:py-12">
      <div className="levav-container max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C6FF34]/10 mb-3">
            <Crown className="w-7 h-7 text-[#C6FF34]" />
          </div>
          <h1 className="text-hero text-xl sm:text-2xl">Become a Champion</h1>
          <p className="text-body mt-1">Apply to join Africa's premier mentorship program</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                step >= s ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/30"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {i < totalSteps - 1 && (
                <div className={`w-6 h-px ${step > s ? "bg-[#C6FF34]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <GlassCard variant="strong">
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: IDENTITY ─── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Verify Your Identity</h2>
                </div>
                <p className="text-xs text-white/40">Confirm your details from your Levav ID™ profile.</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">First Name *</label>
                    <input type="text" value={formData.firstName}
                      onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }); if (errors.firstName) setErrors((err) => { const n = { ...err }; delete n.firstName; return n; }); }}
                      className={`glass-input w-full ${errors.firstName ? "border-red-500/50" : ""}`} placeholder="Chanda" />
                    {errors.firstName && <p className="text-[10px] text-red-400 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Last Name *</label>
                    <input type="text" value={formData.lastName}
                      onChange={(e) => { setFormData({ ...formData, lastName: e.target.value }); if (errors.lastName) setErrors((err) => { const n = { ...err }; delete n.lastName; return n; }); }}
                      className={`glass-input w-full ${errors.lastName ? "border-red-500/50" : ""}`} placeholder="Banda" />
                    {errors.lastName && <p className="text-[10px] text-red-400 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Email *</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors((err) => { const n = { ...err }; delete n.email; return n; }); }}
                    className={`glass-input w-full ${errors.email ? "border-red-500/50" : ""}`} placeholder="chanda@email.zm" />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Phone</label>
                    <input type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="glass-input w-full" placeholder="+260 97X XXX XXX" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">City *</label>
                    <input type="text" value={formData.city}
                      onChange={(e) => { setFormData({ ...formData, city: e.target.value }); if (errors.city) setErrors((err) => { const n = { ...err }; delete n.city; return n; }); }}
                      className={`glass-input w-full ${errors.city ? "border-red-500/50" : ""}`} placeholder="Lusaka" />
                    {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Levav Code Display */}
                {formData.levavCode && (
                  <div className="p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#C6FF34]" />
                      <div>
                        <p className="text-[10px] text-white/40">Levav ID™ Code</p>
                        <p className="text-xs font-mono text-[#C6FF34]">{formData.levavCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── STEP 2: EXPERTISE ─── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Your Expertise</h2>
                </div>
                <p className="text-xs text-white/40">Tell us about your professional background.</p>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Profession *</label>
                  <input type="text" value={formData.profession}
                    onChange={(e) => { setFormData({ ...formData, profession: e.target.value }); if (errors.profession) setErrors((err) => { const n = { ...err }; delete n.profession; return n; }); }}
                    className={`glass-input w-full ${errors.profession ? "border-red-500/50" : ""}`} placeholder="e.g. Technology & Software" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Current Role *</label>
                  <input type="text" value={formData.role}
                    onChange={(e) => { setFormData({ ...formData, role: e.target.value }); if (errors.role) setErrors((err) => { const n = { ...err }; delete n.role; return n; }); }}
                    className={`glass-input w-full ${errors.role ? "border-red-500/50" : ""}`} placeholder="e.g. Senior Frontend Developer" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-2">Expertise Areas * <span className="text-white/30">({formData.expertiseAreas.length} selected)</span></label>
                  {errors.expertiseAreas && <p className="text-[10px] text-red-400 mb-2">{errors.expertiseAreas}</p>}
                  <div className="flex flex-wrap gap-2">
                    {EXPERTISE_AREAS.map((area) => (
                      <button key={area} onClick={() => toggleExpertise(area)}
                        className={`px-3 py-1.5 rounded-full text-[11px] transition-all ${
                          formData.expertiseAreas.includes(area)
                            ? "bg-[#C6FF34] text-black font-medium"
                            : "bg-white/5 text-white/50 hover:bg-white/10"
                        }`}>
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Experience Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "entry", label: "0-2 years" },
                      { value: "mid", label: "3-5 years" },
                      { value: "senior", label: "6-10 years" },
                      { value: "expert", label: "10+ years" },
                    ].map((level) => (
                      <button key={level.value} onClick={() => setFormData({ ...formData, experience: level.value })}
                        className={`p-2.5 rounded-xl text-left transition-all ${
                          formData.experience === level.value
                            ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30"
                            : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                        }`}>
                        <span className={`text-[11px] font-medium ${formData.experience === level.value ? "text-[#C6FF34]" : "text-white/60"}`}>{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: MENTORSHIP STYLE ─── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Mentorship Preferences</h2>
                </div>
                <p className="text-xs text-white/40">How would you like to mentor?</p>

                <div className="space-y-2">
                  {errors.mentorshipStyle && <p className="text-[10px] text-red-400">{errors.mentorshipStyle}</p>}
                  {MENTORSHIP_STYLES.map((style) => (
                    <button key={style.value} onClick={() => { setFormData({ ...formData, mentorshipStyle: style.value }); if (errors.mentorshipStyle) setErrors((err) => { const n = { ...err }; delete n.mentorshipStyle; return n; }); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        formData.mentorshipStyle === style.value
                          ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30"
                          : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                      }`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        formData.mentorshipStyle === style.value ? "bg-[#C6FF34]/20 text-[#C6FF34]" : "bg-white/5 text-white/30"
                      }`}>
                        {style.value === "one-on-one" ? <UserCheck className="w-4 h-4" /> :
                         style.value === "group" ? <Users className="w-4 h-4" /> :
                         <FileText className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${formData.mentorshipStyle === style.value ? "text-[#C6FF34]" : "text-white/70"}`}>{style.label}</p>
                        <p className="text-[10px] text-white/40">{style.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-medium text-white/60 mb-2">Weekly Availability *</label>
                  {errors.availability && <p className="text-[10px] text-red-400 mb-2">{errors.availability}</p>}
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => { setFormData({ ...formData, availability: opt.value }); if (errors.availability) setErrors((err) => { const n = { ...err }; delete n.availability; return n; }); }}
                        className={`p-2.5 rounded-xl text-center transition-all ${
                          formData.availability === opt.value
                            ? "bg-[#C6FF34]/10 border border-[#C6FF34]/30"
                            : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                        }`}>
                        <p className={`text-[10px] font-medium ${formData.availability === opt.value ? "text-[#C6FF34]" : "text-white/60"}`}>{opt.label}</p>
                        <p className="text-[9px] text-white/30">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Interest */}
                <button onClick={() => setFormData((prev) => ({ ...prev, contentInterest: !prev.contentInterest }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    formData.contentInterest ? "bg-[#7E3BED]/10 border border-[#7E3BED]/30" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    formData.contentInterest ? "bg-[#7E3BED]/20 text-[#7E3BED]" : "bg-white/5 text-white/30"
                  }`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${formData.contentInterest ? "text-[#7E3BED]" : "text-white/70"}`}>Also Interested in Content Creation</p>
                    <p className="text-[10px] text-white/40">Publish courses, articles & videos on Levav Learn™</p>
                  </div>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    formData.contentInterest ? "bg-[#7E3BED] border-[#7E3BED]" : "border-white/20"
                  }`}>
                    {formData.contentInterest && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </button>
              </motion.div>
            )}

            {/* ─── STEP 4: MOTIVATION ─── */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Your Motivation</h2>
                </div>
                <p className="text-xs text-white/40">Help us understand why you want to become a Champion.</p>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Why do you want to mentor? *</label>
                  <textarea value={formData.motivation}
                    onChange={(e) => { setFormData({ ...formData, motivation: e.target.value }); if (errors.motivation) setErrors((err) => { const n = { ...err }; delete n.motivation; return n; }); }}
                    rows={4}
                    className={`glass-input w-full resize-none ${errors.motivation ? "border-red-500/50" : ""}`}
                    placeholder="Share your story. Why do you want to help others grow? What impact do you hope to make? (min 50 characters)" />
                  <div className="flex justify-between mt-1">
                    {errors.motivation && <p className="text-[10px] text-red-400">{errors.motivation}</p>}
                    <p className="text-[10px] text-white/30 ml-auto">{formData.motivation.length} chars</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">LinkedIn Profile</label>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input type="url" value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      className="glass-input w-full" placeholder="https://linkedin.com/in/yourprofile" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Portfolio / Website</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <input type="url" value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="glass-input w-full" placeholder="https://yourwebsite.com" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 5: REVIEW ─── */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C6FF34]" />
                  <h2 className="text-sm font-semibold text-white">Review Your Application</h2>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Name</span>
                    <span className="text-xs text-white/80">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Email</span>
                    <span className="text-xs text-white/80">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Location</span>
                    <span className="text-xs text-white/80">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Profession</span>
                    <span className="text-xs text-white/80">{formData.profession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Role</span>
                    <span className="text-xs text-white/80">{formData.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Experience</span>
                    <span className="text-xs text-white/80 capitalize">{formData.experience}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-xs text-white/40">Expertise</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.expertiseAreas.map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded-full bg-[#C6FF34]/10 text-[10px] text-[#C6FF34]">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Mentorship Style</span>
                    <span className="text-xs text-white/80 capitalize">{formData.mentorshipStyle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Availability</span>
                    <span className="text-xs text-white/80">{formData.availability}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/40">Content Creation</span>
                    <span className="text-xs text-white/80">{formData.contentInterest ? "Yes" : "No"}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#C6FF34]" />
                    <span className="text-xs font-medium text-[#C6FF34]">What Happens Next</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Our team will review your application within 5 business days. If approved, you'll receive an onboarding package and your Champion dashboard will be activated. You'll earn ZMW 100-200 per mentorship session.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
            {step > 1 && (
              <button onClick={handleBack}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={handleNext}
                className="flex-[2] btn-lime flex items-center justify-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex-[2] btn-lime flex items-center justify-center gap-2 disabled:opacity-30">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full" />
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Submit Application</>
                )}
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
