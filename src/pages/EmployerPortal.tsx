/**
 * ============================================================
 * EMPLOYER PORTAL v2 — Complete Employer Experience
 * ============================================================
 * Full-featured employer dashboard with:
 * - Company profile overview
 * - Job posting management
 * - Applicant pipeline
 * - Analytics summary
 * - Quick actions
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { toast } from "sonner";
import {
  Briefcase, Users, Eye, TrendingUp, Plus, ChevronRight,
  Building2, MapPin, Globe, Mail, Phone, Calendar,
  CheckCircle, Clock, XCircle, BarChart3, Star,
  FileText, Settings, Loader2,
} from "lucide-react";

const demoEmployerProfile = {
  companyName: "BongoHive Innovation Hub",
  industry: "Technology & Innovation",
  location: "Lusaka, Zambia",
  website: "bongohive.co.zm",
  email: "careers@bongohive.co.zm",
  phone: "+260 211 234 567",
  description: "Zambia's leading technology and innovation hub. We build startups, train developers, and create opportunities for African tech talent.",
  logo: null,
  verified: true,
  jobsPosted: 12,
  totalApplications: 186,
  hiresMade: 8,
};

const demoPostedJobs = [
  { id: 1, title: "Senior Frontend Developer", applications: 24, status: "active", postedAt: "2 days ago", views: 342 },
  { id: 2, title: "Product Designer", applications: 18, status: "active", postedAt: "5 days ago", views: 215 },
  { id: 3, title: "DevOps Engineer", applications: 8, status: "reviewing", postedAt: "1 week ago", views: 156 },
  { id: 4, title: "Marketing Intern", applications: 42, status: "closed", postedAt: "2 weeks ago", views: 520 },
];

const demoApplicants = [
  { id: 1, name: "Chanda Banda", role: "Senior Frontend Developer", wri: 78, status: "shortlisted", appliedAt: "1 day ago" },
  { id: 2, name: "Mutale Mwanza", role: "Product Designer", wri: 72, status: "new", appliedAt: "2 days ago" },
  { id: 3, name: "Peter Chileshe", role: "Senior Frontend Developer", wri: 65, status: "interview", appliedAt: "3 days ago" },
  { id: 4, name: "Grace Lungu", role: "DevOps Engineer", wri: 81, status: "new", appliedAt: "4 days ago" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string; label: string; icon: any }> = {
    active: { color: "text-[#C6FF34]", bg: "bg-[#C6FF34]/10", label: "Active", icon: CheckCircle },
    reviewing: { color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", label: "Reviewing", icon: Clock },
    closed: { color: "text-white/40", bg: "bg-white/5", label: "Closed", icon: XCircle },
    new: { color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", label: "New", icon: Clock },
    shortlisted: { color: "text-[#C6FF34]", bg: "bg-[#C6FF34]/10", label: "Shortlisted", icon: CheckCircle },
    interview: { color: "text-[#7E3BED]", bg: "bg-[#7E3BED]/10", label: "Interview", icon: Calendar },
  };
  const c = config[status] ?? config.new;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${c.color} ${c.bg}`}>
      <Icon className="w-3 h-3" /> {c.label}
    </span>
  );
}

export default function EmployerPortal() {
  const { isAuthenticated } = useAuth();
  const { isDemoMode } = useDemoAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "applicants">("overview");

  if (!isAuthenticated && !isDemoMode) {
    return (
      <PageTransition>
        <div className="levav-container pt-6 pb-24">
          <EmptyState
            icon={Building2}
            title="Employer Portal"
            description="Sign in to access your employer dashboard, manage job postings, and review applicants."
            action={{ label: "Sign In", onClick: () => { window.location.href = "/#/login"; } }}
          />
        </div>
      </PageTransition>
    );
  }

  const profile = demoEmployerProfile;

  return (
    <PageTransition className="levav-container pt-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#C6FF34]" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              {profile.companyName}
              {profile.verified && <CheckCircle className="w-4 h-4 text-[#C6FF34]" />}
            </h1>
            <p className="text-xs text-white/40 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {profile.location}
              <span className="text-white/20">|</span>
              <Globe className="w-3 h-3" /> {profile.website}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StaggerItem><StatCard label="Jobs Posted" value={profile.jobsPosted} icon={Briefcase} /></StaggerItem>
        <StaggerItem><StatCard label="Applications" value={profile.totalApplications} icon={Users} /></StaggerItem>
        <StaggerItem><StatCard label="Total Views" value="1,233" icon={Eye} /></StaggerItem>
        <StaggerItem><StatCard label="Hires Made" value={profile.hiresMade} icon={TrendingUp} /></StaggerItem>
      </StaggerContainer>

      {/* Tabs */}
      <div className="flex bg-white/5 rounded-xl p-1 mb-6">
        {(["overview", "jobs", "applicants"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? "bg-[#C6FF34] text-black" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Company Info */}
          <GlassCard className="p-5" glow={false}>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#C6FF34]" /> About Company
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{profile.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/40">
              <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {profile.email}</span>
              <span className="flex items-center gap-2"><Phone className="w-3 h-3" /> {profile.phone}</span>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { toast.info("Post a Job — coming soon"); }} className="p-4 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 hover:bg-[#C6FF34]/20 transition-all text-left">
              <Plus className="w-5 h-5 text-[#C6FF34] mb-2" />
              <p className="text-sm font-medium text-[#C6FF34]">Post a Job</p>
              <p className="text-[10px] text-white/40">Create new job listing</p>
            </button>
            <button onClick={() => setActiveTab("applicants")} className="p-4 rounded-2xl bg-[#7E3BED]/10 border border-[#7E3BED]/20 hover:bg-[#7E3BED]/20 transition-all text-left">
              <Users className="w-5 h-5 text-[#7E3BED] mb-2" />
              <p className="text-sm font-medium text-[#7E3BED]">Review Applicants</p>
              <p className="text-[10px] text-white/40">{demoApplicants.length} new applications</p>
            </button>
          </div>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Posted Jobs</h3>
            <button onClick={() => { toast.info("Post a Job — coming soon"); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C6FF34] text-black text-xs font-medium hover:shadow-lime transition-all">
              <Plus className="w-3 h-3" /> Post Job
            </button>
          </div>
          {demoPostedJobs.map((job) => (
            <GlassCard key={job.id} className="p-4" glow={false}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-white/90">{job.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-white/40">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {job.views} views</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applications} apps</span>
                    <span>{job.postedAt}</span>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === "applicants" && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-2">Recent Applicants</h3>
          {demoApplicants.map((app) => (
            <GlassCard key={app.id} className="p-4" glow={false}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7E3BED]/20 flex items-center justify-center text-sm font-bold text-[#7E3BED]">
                  {app.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white/90 truncate">{app.name}</h4>
                  <p className="text-[10px] text-white/40">{app.role} • WRI: {app.wri}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={app.status} />
                  <p className="text-[10px] text-white/30 mt-1">{app.appliedAt}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
