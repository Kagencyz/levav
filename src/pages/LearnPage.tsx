/**
 * ============================================================
 * LEVAV LEARN™ — Learning Ecosystem Team
 * ============================================================
 * Course marketplace with learning pathways, progress tracking,
 * and certification integration. Covers technical, leadership,
 * and professional development skills.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  BookOpen, Clock, Award, Star, Users, ChevronRight,
  Play, CheckCircle2, Lock, TrendingUp, Zap, Search,
  Target, BarChart3, GraduationCap, Flame,
} from "lucide-react";

const CATEGORIES = ["All", "Technology", "Leadership", "Finance", "Design", "Communication", "Health"];

const COURSES = [
  { id: 1, title: "Advanced React & TypeScript", instructor: "David Phiri", category: "Technology", level: "Intermediate", duration: "12 hours", lessons: 24, students: 342, rating: 4.8, price: "Free", enrolled: false, image: "RA" },
  { id: 2, title: "Leadership for African Professionals", instructor: "Dr. Chileshe Banda", category: "Leadership", level: "All Levels", duration: "8 hours", lessons: 16, students: 528, rating: 4.9, price: "Free", enrolled: true, progress: 65, image: "LA" },
  { id: 3, title: "Financial Modeling with Excel", instructor: "Mutale Zulu", category: "Finance", level: "Intermediate", duration: "10 hours", lessons: 20, students: 189, rating: 4.6, price: "Free", enrolled: false, image: "FM" },
  { id: 4, title: "UI/UX Design Fundamentals", instructor: "Natasha Mwamba", category: "Design", level: "Beginner", duration: "6 hours", lessons: 12, students: 412, rating: 4.7, price: "Free", enrolled: true, progress: 30, image: "UI" },
  { id: 5, title: "Public Speaking & Presentation", instructor: "James Kabwe", category: "Communication", level: "All Levels", duration: "4 hours", lessons: 8, students: 267, rating: 4.5, price: "Free", enrolled: false, image: "PS" },
  { id: 6, title: "Healthcare Data Analytics", instructor: "Dr. Lisa Mulenga", category: "Health", level: "Advanced", duration: "14 hours", lessons: 28, students: 98, rating: 4.8, price: "Free", enrolled: false, image: "HA" },
  { id: 7, title: "Project Management Professional", instructor: "Robert Tembo", category: "Leadership", level: "Advanced", duration: "16 hours", lessons: 32, students: 156, rating: 4.7, price: "Free", enrolled: false, image: "PM" },
  { id: 8, title: "Python for Data Science", instructor: "David Phiri", category: "Technology", level: "Beginner", duration: "18 hours", lessons: 36, students: 289, rating: 4.6, price: "Free", enrolled: true, progress: 10, image: "PY" },
];

const LEARNING_PATHS = [
  { id: 1, title: "Full-Stack Developer", courses: 6, hours: 48, skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], completion: 0 },
  { id: 2, title: "People Manager", courses: 4, hours: 32, skills: ["Leadership", "Communication", "Conflict Resolution"], completion: 25 },
  { id: 3, title: "Data Analyst", courses: 5, hours: 40, skills: ["Python", "SQL", "Statistics", "Visualization"], completion: 0 },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "my-learning">("courses");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [enrolledIds, setEnrolledIds] = useState<number[]>([2, 4, 8]);

  const filtered = COURSES.filter((c) => {
    const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnroll = (id: number) => { if (!enrolledIds.includes(id)) setEnrolledIds((p) => [...p, id]); };

  const myCourses = COURSES.filter((c) => enrolledIds.includes(c.id));
  const totalProgress = myCourses.length > 0 ? Math.round(myCourses.reduce((s, c) => s + (c.progress || 0), 0) / myCourses.length) : 0;

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-5xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-violet flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Levav Learn\u2122</span>
            <span className="text-xs text-white/30">{COURSES.length} courses</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Learn & Grow</h1>
          <p className="text-body mt-1">Courses that raise your WRI\u2122 and open doors</p>
        </motion.div>

        {/* Learning Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard variant="strong" className="mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">{myCourses.length}</p>
                <p className="text-[10px] text-white/40">Enrolled</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{totalProgress}%</p>
                <p className="text-[10px] text-white/40">Avg Progress</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">3</p>
                <p className="text-[10px] text-white/40">Certificates</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#C6FF34]">{COURSES.reduce((s, c) => s + (enrolledIds.includes(c.id) ? parseInt(c.duration) : 0), 0)}h</p>
                <p className="text-[10px] text-white/40">Learning</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/5">
          {(["courses", "paths", "my-learning"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-xs font-medium transition-all border-b-2 ${activeTab === t ? "border-[#C6FF34] text-[#C6FF34]" : "border-transparent text-white/40 hover:text-white/60"}`}>
              {t === "my-learning" ? "My Learning" : t === "paths" ? "Learning Paths" : "All Courses"}
            </button>
          ))}
        </div>

        {activeTab === "courses" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses..." className="glass-input w-full pl-10 text-sm" />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)}
                    className={`text-[10px] px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${selectedCategory === c ? "bg-[#C6FF34] text-black" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{course.image}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white group-hover:text-[#C6FF34] transition-colors">{course.title}</h3>
                        <p className="text-[10px] text-white/40">{course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3 text-[10px] text-white/30">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#C6FF34]" />{course.rating}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{course.level}</span>
                        <span className="text-[10px] text-[#C6FF34]">{course.price}</span>
                      </div>
                      <button onClick={() => handleEnroll(course.id)} disabled={enrolledIds.includes(course.id)}
                        className={`text-[10px] px-3 py-1.5 rounded-lg font-medium transition-all ${enrolledIds.includes(course.id) ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "bg-[#C6FF34] text-black hover:shadow-lime"}`}>
                        {enrolledIds.includes(course.id) ? "Enrolled" : "Enroll"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeTab === "paths" && (
          <div className="space-y-4">
            {LEARNING_PATHS.map((path, i) => (
              <motion.div key={path.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <GlassCard variant="strong">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#C6FF34]/10 text-[#C6FF34]"><Target className="w-5 h-5" /></div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{path.title}</h3>
                        <p className="text-[10px] text-white/40">{path.courses} courses · {path.hours} hours</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#C6FF34]">{path.completion}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-3">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7E3BED] to-[#C6FF34]" style={{ width: `${path.completion}%` }} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {path.skills.map((s) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5">{s}</span>)}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "my-learning" && (
          <div className="space-y-3">
            {myCourses.length > 0 ? myCourses.map((course, i) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7E3BED] to-[#C6FF34] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{course.image}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white">{course.title}</h3>
                      <p className="text-[10px] text-white/40">{course.instructor} · {course.duration}</p>
                    </div>
                    <button className="p-2 rounded-lg bg-[#C6FF34] text-black hover:shadow-lime transition-all">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#C6FF34]" style={{ width: `${course.progress || 0}%` }} />
                    </div>
                    <span className="text-xs text-white/50">{course.progress || 0}%</span>
                  </div>
                  <p className="text-[10px] text-white/30 mt-2">{Math.round(((course.progress || 0) / 100) * course.lessons)} of {course.lessons} lessons completed</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">No courses enrolled yet</p>
                <button onClick={() => setActiveTab("courses")} className="btn-lime text-xs mt-3">Browse Courses</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
