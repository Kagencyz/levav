/**
 * ============================================================
 * ANALYTICS DASHBOARD — Admin Platform Metrics
 * ============================================================
 * Visual charts and KPIs for platform performance monitoring.
 * Uses Recharts for data visualization.
 * ============================================================
 */

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Users,
  BookOpen,
  Globe,
  FileText,
  TrendingUp,
  Award,
  Loader2,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const PIE_COLORS = ["#C6FF34", "#7E3BED", "#3B82F6", "#F59E0B", "#EF4444"];

/* Demo Data */
const demoOverview = {
  totalUsers: 1247,
  totalProfiles: 1183,
  totalCourses: 42,
  totalJobs: 156,
  totalApplications: 892,
  recentEnrollments: 67,
  wriDistribution: [
    { tier: "diamond", count: 23 },
    { tier: "platinum", count: 89 },
    { tier: "gold", count: 234 },
    { tier: "silver", count: 412 },
    { tier: "bronze", count: 425 },
  ],
};

const demoWeeklyActivity = {
  signups: [
    { date: "06-09", count: 12 },
    { date: "06-10", count: 18 },
    { date: "06-11", count: 15 },
    { date: "06-12", count: 22 },
    { date: "06-13", count: 19 },
    { date: "06-14", count: 25 },
    { date: "06-15", count: 23 },
  ],
  applications: [
    { date: "06-09", count: 8 },
    { date: "06-10", count: 14 },
    { date: "06-11", count: 11 },
    { date: "06-12", count: 16 },
    { date: "06-13", count: 13 },
    { date: "06-14", count: 18 },
    { date: "06-15", count: 15 },
  ],
  wriUpdates: [
    { date: "06-09", count: 5 },
    { date: "06-10", count: 9 },
    { date: "06-11", count: 7 },
    { date: "06-12", count: 11 },
    { date: "06-13", count: 8 },
    { date: "06-14", count: 12 },
    { date: "06-15", count: 10 },
  ],
};

const demoTopContent = {
  topCourses: [
    { id: 1, title: "React & TypeScript Mastery", enrollments: 342, rating: "4.8" },
    { id: 2, title: "Customer Excellence", enrollments: 518, rating: "4.6" },
    { id: 3, title: "Data Science with Python", enrollments: 189, rating: "4.9" },
    { id: 4, title: "Leadership Fundamentals", enrollments: 267, rating: "4.7" },
    { id: 5, title: "Digital Marketing", enrollments: 156, rating: "4.5" },
  ],
  professionCounts: [
    { profession: "Software Developer", count: 234 },
    { profession: "Customer Service", count: 187 },
    { profession: "Data Analyst", count: 98 },
    { profession: "Sales Representative", count: 156 },
    { profession: "Project Manager", count: 112 },
  ],
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function KpiCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-xs text-white/50">{label}</p>
          <p className="text-xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function AnalyticsPage() {
  /* Use demo data directly - no backend needed */
  const overview = demoOverview;
  const weeklyData = demoWeeklyActivity;
  const topContent = demoTopContent;

  /* Format WRI distribution for pie chart */
  const wriPieData = overview.wriDistribution.map((d) => ({
    name: d.tier ? `${d.tier.charAt(0).toUpperCase()}${d.tier.slice(1)}` : "Unranked",
    value: d.count,
  }));

  /* Format weekly data for line chart */
  const activityLineData = weeklyData.signups.map((s) => ({
    date: s.date,
    signups: s.count,
    applications: weeklyData.applications.find((a) => a.date === s.date)?.count ?? 0,
    wriUpdates: weeklyData.wriUpdates.find((w) => w.date === s.date)?.count ?? 0,
  }));

  return (
    <div className="levav-container pt-6 pb-24">
      <motion.div variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={item} className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#C6FF34]" />
            Platform Analytics
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Real-time metrics for the Levav™ ecosystem.
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          variants={item}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          <KpiCard
            icon={Users}
            label="Total Users"
            value={overview?.totalUsers ?? 0}
            color="#C6FF34"
          />
          <KpiCard
            icon={BookOpen}
            label="Courses"
            value={overview?.totalCourses ?? 0}
            color="#7E3BED"
          />
          <KpiCard
            icon={Globe}
            label="Job Postings"
            value={overview?.totalJobs ?? 0}
            color="#3B82F6"
          />
          <KpiCard
            icon={FileText}
            label="Applications"
            value={overview?.totalApplications ?? 0}
            color="#F59E0B"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Weekly Activity Chart */}
          <motion.div variants={item}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C6FF34]" />
                Weekly Activity
              </h3>
              {activityLineData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-white/40 text-xs">
                  No activity data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={activityLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0e1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="signups" stroke="#C6FF34" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="applications" stroke="#7E3BED" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="wriUpdates" stroke="#3B82F6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </GlassCard>
          </motion.div>

          {/* WRI Distribution Pie Chart */}
          <motion.div variants={item}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C6FF34]" />
                WRI™ Tier Distribution
              </h3>
              {wriPieData.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-white/40 text-xs">
                  No WRI data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={wriPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                      fontSize={10}
                    >
                      {wriPieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0e1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </GlassCard>
          </motion.div>
        </div>

        {/* Top Content */}
        <motion.div variants={item}>
          <GlassCard className="p-4">
            <h3 className="text-sm font-semibold mb-4">
              Top Performing Content
            </h3>
            {contentLoading ? (
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#C6FF34]" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top Courses */}
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wide">
                    Top Courses by Enrollment
                  </p>
                  {topContent?.topCourses.length === 0 ? (
                    <p className="text-xs text-white/30">No courses yet</p>
                  ) : (
                    <div className="space-y-2">
                      {topContent?.topCourses.map((course, i) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white/30 w-4">
                              {i + 1}
                            </span>
                            <p className="text-sm text-white/80">
                              {course.title}
                            </p>
                          </div>
                          <span className="text-xs text-[#C6FF34]">
                            {course.enrollments} enrolled
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Professions */}
                <div className="pt-2 border-t border-white/5">
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wide">
                    Top Professions
                  </p>
                  {topContent?.professionCounts.length === 0 ? (
                    <p className="text-xs text-white/30">No data yet</p>
                  ) : (
                    <div className="space-y-2">
                      {topContent?.professionCounts.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-white/30 w-4">
                              {i + 1}
                            </span>
                            <p className="text-sm text-white/80">
                              {p.profession}
                            </p>
                          </div>
                          <span className="text-xs text-[#7E3BED]">
                            {p.count} talent
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
