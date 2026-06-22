/**
 * ============================================================
 * CREATOR ONBOARDING — Content Creator Application
 * ============================================================
 * Multi-step application to become a verified content creator:
 *   Step 1: Profile & Identity
 *   Step 2: Content Focus & Categories
 *   Step 3: Equipment & Setup
 *   Step 4: Commitment & Monetization
 *   Step 5: Review & Submit
 * Connected to data-layer.ts — stores application, unlocks
 * Creator Studio on approval.
 * ============================================================
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Video, ChevronRight, ChevronLeft, CheckCircle2, Mic,
  FileText, BookOpen, Camera, Monitor, Headphones, Wifi,
  Zap, DollarSign, TrendingUp, Shield, Star, Globe,
  Award, Clock, AlertCircle,
} from "lucide-react";
import { getProfile, submitCreatorApplication } from "@/lib/data-layer";

const CONTENT_TYPES = [
  { value: "video" as const, label: "Video Courses", icon: <Video className="w-5 h-5" />, desc: "Recorded video lessons and tutorials" },
  { value: "audio" as const, label: "Audio / Podcast", icon: <Mic className="w-5 h-5" />, desc: "Audio lessons, interviews, discussions" },
  { value: "article" as const, label: "Articles", icon: <FileText className="w-5 h-5" />, desc: "Written guides, case studies, thought pieces" },
  { value: "document" as const, label: "Documents", icon: <BookOpen className="w-5 h-5" />, desc: "Templates, worksheets, checklists" },
];

const CATEGORIES = [
  "Career Development",
  "Technical Skills",
  "Leadership",
  "Design",
  "Business",
  "Finance",
  "Healthcare",
  "Education",
  "Communication",
  "Personal Growth",
];

const EQUIPMENT_LEVELS = [
  { value: "basic", label: "Basic", desc: "Smartphone + natural light", icon: <Camera className="w-4 h-4" /> },
  { value: "good", label: "Good", desc: "Webcam + microphone + lighting", icon: <Monitor className="w-4 h-4" /> },
  { value: "professional", label: "Professional", desc: "DSLR + studio mic + lighting kit", icon: <Video className="w-4 h-4" /> },
];

const POSTING_FREQUENCIES = [
  { value: "weekly", label: "Weekly", desc: "1 piece / week" },
  { value: "biweekly", label: "Bi-Weekly", desc: "2 pieces / week" },
  { value: "monthly", label: "Monthly", desc: "2-4 pieces / month" },
  { value: "flexible", label: "Flexible", desc: "As schedules allow" },
];

export default function CreatorOnboardingPage() {
  const navigate = useNavigate();
  const profile = getProfile();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    city: profile?.city || "",
    profession: profile?.profession || "",
    role: profile?.role || "",
    contentTypes: [] as ("video" | "audio" | "article" | "document")[],
    categories: [] as string[],
    bio: "",
    sampleUrl: "",
    equipment: "",
    postingFrequency: "",
    monetizationInterest: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 5;

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (s === 1) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
    }

    if (s === 2) {
      if (formData.contentTypes.length === 0) newErrors.contentTypes = "Select at least one content type";
      if (formData.categories.length === 0) newErrors.categories = "Select at least one category";
    }

    if (s === 3) {
      if (!formData.equipment) newErrors.equipment = "Select your equipment level";
    }

    if (s === 4) {
      if (!formData.postingFrequency) newErrors.postingFrequency = "Select posting frequency";
      if (!formData.bio || formData.bio.length < 30) newErrors.bio = "Please write at least 30 characters about yourself";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    submitCreatorApplication({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      profession: formData.profession,
      role: formData.role,
      contentTypes: formData.contentTypes,
      categories: formData.categories,
      bio: formData.bio,
      sampleUrl: formData.sampleUrl,
      equipment: formData.equipment,
      postingFrequency: formData.postingFrequency,
      monetizationInterest: formData.monetizationInterest,
    });

    toast.success("Creator application submitted! You'll be notified when approved.");
    setIsSubmitting(false);
    navigate("/champions");
  };

  const toggleContentType = (type: "video" | "audio" | "article" | "document") => {
    setFormData((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }));
    if (errors.contentTypes) setErrors((e) => { const n = { ...e }; delete n.contentTypes; return n; });
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
    if (errors.categories) setErrors((e) => { const n = { ...e }; delete n.categories; return n; });
  };

  return (
    <div className="min-h-screen bg-black py-6 sm:py-12">
      <div className="levav-container max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7E3BED]/10 mb-3">
            <Video className="w-7 h-7 text-[#7E3BED]" />
          </div>
          <h1 className="text-hero text-xl sm:text-2xl">Become a Creator</h1>
          <p className="text-body mt-1">Create content. Build your brand. Earn revenue.</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                step >= s ? "bg-[#7E3BED] text-white" : "bg-white/5 text-white/30"
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {i < totalSteps - 1 && <div className={`w-6 h-px ${step > s ? "bg-[#7E3BED]" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <GlassCard variant="strong">
          <AnimatePresence mode="wait">
            {/* ─── STEP 1: IDENTITY ─── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#7E3BED]" />
                  <h2 className="text-sm font-semibold text-white">Your Profile</h2>
                </div>
                <p className="text-xs text-white/40">Tell us who you are.</p>

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
                    <label className="block text-xs font-medium text-white/60 mb-1">City</label>
                    <input type="text" value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="glass-input w-full" placeholder="Lusaka" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Profession</label>
                  <input type="text" value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="glass-input w-full" placeholder="e.g. Technology & Software" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Your Role</label>
                  <input type="text" value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="glass-input w-full" placeholder="e.g. Senior Frontend Developer" />
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: CONTENT FOCUS ─── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-[#7E3BED]" />
                  <h2 className="text-sm font-semibold text-white">Content Types</h2>
                </div>
                <p className="text-xs text-white/40">What type of content will you create?</p>

                {errors.contentTypes && <p className="text-[10px] text-red-400">{errors.contentTypes}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONTENT_TYPES.map((type) => (
                    <button key={type.value} onClick={() => toggleContentType(type.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        formData.contentTypes.includes(type.value)
                          ? "bg-[#7E3BED]/10 border border-[#7E3BED]/30"
                          : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                      }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        formData.contentTypes.includes(type.value) ? "bg-[#7E3BED]/20 text-[#7E3BED]" : "bg-white/5 text-white/30"
                      }`}>
                        {type.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${formData.contentTypes.includes(type.value) ? "text-[#7E3BED]" : "text-white/70"}`}>{type.label}</p>
                        <p className="text-[10px] text-white/40">{type.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-medium text-white/60 mb-2">Categories * <span className="text-white/30">({formData.categories.length} selected)</span></label>
                  {errors.categories && <p className="text-[10px] text-red-400 mb-2">{errors.categories}</p>}
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[11px] transition-all ${
                          formData.categories.includes(cat)
                            ? "bg-[#7E3BED] text-white font-medium"
                            : "bg-white/5 text-white/50 hover:bg-white/10"
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: EQUIPMENT ─── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-[#7E3BED]" />
                  <h2 className="text-sm font-semibold text-white">Your Setup</h2>
                </div>
                <p className="text-xs text-white/40">What equipment do you have for content creation?</p>

                {errors.equipment && <p className="text-[10px] text-red-400 mb-2">{errors.equipment}</p>}
                <div className="space-y-2">
                  {EQUIPMENT_LEVELS.map((eq) => (
                    <button key={eq.value} onClick={() => { setFormData({ ...formData, equipment: eq.value }); if (errors.equipment) setErrors((err) => { const n = { ...err }; delete n.equipment; return n; }); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        formData.equipment === eq.value
                          ? "bg-[#7E3BED]/10 border border-[#7E3BED]/30"
                          : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                      }`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        formData.equipment === eq.value ? "bg-[#7E3BED]/20 text-[#7E3BED]" : "bg-white/5 text-white/30"
                      }`}>
                        {eq.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${formData.equipment === eq.value ? "text-[#7E3BED]" : "text-white/70"}`}>{eq.label}</p>
                        <p className="text-[10px] text-white/40">{eq.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <label className="block text-xs font-medium text-white/60 mb-1">Sample Work URL (Optional)</label>
                  <p className="text-[10px] text-white/30 mb-2">Link to a portfolio, YouTube channel, or previous content</p>
                  <input type="url" value={formData.sampleUrl}
                    onChange={(e) => setFormData({ ...formData, sampleUrl: e.target.value })}
                    className="glass-input w-full" placeholder="https://..." />
                </div>
              </motion.div>
            )}

            {/* ─── STEP 4: COMMITMENT ─── */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#7E3BED]" />
                  <h2 className="text-sm font-semibold text-white">Commitment</h2>
                </div>
                <p className="text-xs text-white/40">How often will you publish?</p>

                {errors.postingFrequency && <p className="text-[10px] text-red-400 mb-2">{errors.postingFrequency}</p>}
                <div className="grid grid-cols-2 gap-2">
                  {POSTING_FREQUENCIES.map((freq) => (
                    <button key={freq.value} onClick={() => { setFormData({ ...formData, postingFrequency: freq.value }); if (errors.postingFrequency) setErrors((err) => { const n = { ...err }; delete n.postingFrequency; return n; }); }}
                      className={`p-3 rounded-xl text-center transition-all ${
                        formData.postingFrequency === freq.value
                          ? "bg-[#7E3BED]/10 border border-[#7E3BED]/30"
                          : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                      }`}>
                      <p className={`text-xs font-medium ${formData.postingFrequency === freq.value ? "text-[#7E3BED]" : "text-white/60"}`}>{freq.label}</p>
                      <p className="text-[9px] text-white/30">{freq.desc}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">About You *</label>
                  <p className="text-[10px] text-white/30 mb-2">Tell potential learners who you are and what they'll gain from your content</p>
                  <textarea value={formData.bio}
                    onChange={(e) => { setFormData({ ...formData, bio: e.target.value }); if (errors.bio) setErrors((err) => { const n = { ...err }; delete n.bio; return n; }); }}
                    rows={4}
                    className={`glass-input w-full resize-none ${errors.bio ? "border-red-500/50" : ""}`}
                    placeholder="I'm a software developer with 5 years of experience building products for the African market..." />
                  <div className="flex justify-between mt-1">
                    {errors.bio && <p className="text-[10px] text-red-400">{errors.bio}</p>}
                    <p className="text-[10px] text-white/30 ml-auto">{formData.bio.length} chars</p>
                  </div>
                </div>

                {/* Monetization Toggle */}
                <button onClick={() => setFormData((prev) => ({ ...prev, monetizationInterest: !prev.monetizationInterest }))}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    formData.monetizationInterest ? "bg-[#C6FF34]/5 border border-[#C6FF34]/20" : "bg-white/[0.02] border border-white/5 hover:bg-white/5"
                  }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    formData.monetizationInterest ? "bg-[#C6FF34]/20 text-[#C6FF34]" : "bg-white/5 text-white/30"
                  }`}>
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${formData.monetizationInterest ? "text-[#C6FF34]" : "text-white/70"}`}>Enable Monetization</p>
                    <p className="text-[10px] text-white/40">Earn revenue from paid courses and premium content</p>
                  </div>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                    formData.monetizationInterest ? "bg-[#C6FF34] border-[#C6FF34]" : "border-white/20"
                  }`}>
                    {formData.monetizationInterest && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                </button>
              </motion.div>
            )}

            {/* ─── STEP 5: REVIEW ─── */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7E3BED]" />
                  <h2 className="text-sm font-semibold text-white">Review Application</h2>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between"><span className="text-xs text-white/40">Name</span><span className="text-xs text-white/80">{formData.firstName} {formData.lastName}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Email</span><span className="text-xs text-white/80">{formData.email}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Profession</span><span className="text-xs text-white/80">{formData.profession || "—"}</span></div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-xs text-white/40">Content Types</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.contentTypes.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-[#7E3BED]/10 text-[10px] text-[#7E3BED] capitalize">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-white/5 pt-2">
                    <span className="text-xs text-white/40">Categories</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.categories.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-white/60">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Equipment</span><span className="text-xs text-white/80 capitalize">{formData.equipment}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Frequency</span><span className="text-xs text-white/80 capitalize">{formData.postingFrequency}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-white/40">Monetization</span><span className="text-xs text-white/80">{formData.monetizationInterest ? "Enabled" : "Disabled"}</span></div>
                </div>

                <div className="p-3 rounded-xl bg-[#7E3BED]/5 border border-[#7E3BED]/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#7E3BED]" />
                    <span className="text-xs font-medium text-[#7E3BED]">Creator Benefits</span>
                  </div>
                  <ul className="text-[11px] text-white/50 space-y-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#C6FF34]" /> Revenue share on all paid content</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#C6FF34]" /> Featured placement on Levav Learn™</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#C6FF34]" /> Analytics dashboard for all content</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#C6FF34]" /> Direct learner messaging</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-white/5">
            {step > 1 && (
              <button onClick={handleBack}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button onClick={handleNext}
                className="flex-[2] py-3 rounded-xl bg-[#7E3BED] text-white text-xs font-medium hover:bg-[#6b32c7] transition-all flex items-center justify-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting}
                className="flex-[2] py-3 rounded-xl bg-[#7E3BED] text-white text-xs font-medium hover:bg-[#6b32c7] transition-all flex items-center justify-center gap-2 disabled:opacity-30">
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
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
