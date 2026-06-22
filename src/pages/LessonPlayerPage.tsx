/**
 * ============================================================
 * LESSON PLAYER PAGE — Course Video Player
 * ============================================================
 * Secure media player for Levav Learn courses. Features:
 * - Video playback area with glass overlay controls
 * - Lesson navigation sidebar
 * - Progress tracking per lesson
 * - Mark complete / continue functionality
 * - Uses demo data for offline development
 * ============================================================
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useAuth } from "@/hooks/useAuth";
import { demoCourse, demoLessons } from "@/lib/demo-data";
import {
  Play,
  Pause,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Volume2,
  Maximize,
} from "lucide-react";

/* ─── Video Player Component ─── */
function VideoPlayer({
  lessonTitle,
  onProgressUpdate,
}: {
  lessonTitle: string;
  onProgressUpdate: (percent: number, timeSpent: number) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Simulate playback progress */
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + 1, 100);
          onProgressUpdate(next, timeSpent + 1);
          return next;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, timeSpent]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Placeholder / Poster */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#070a13] to-[#0d1221] flex items-center justify-center">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(126,59,237,0.15)_0%,_transparent_70%)]" />
        </div>
        <div className="text-center z-10">
          <div className="w-20 h-20 rounded-full bg-[#C6FF34]/20 border-2 border-[#C6FF34]/40 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Play className="w-8 h-8 text-[#C6FF34] ml-1" />
          </div>
          <p className="text-white/60 text-sm font-medium">{lessonTitle}</p>
          <p className="text-white/30 text-xs mt-1">
            Secure Levav Media Frame
          </p>
        </div>
      </div>

      {/* Playback Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
          className="h-full bg-[#C6FF34]"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Overlay Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#C6FF34] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lime"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-1" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-4 left-4 right-4 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          <span className="text-xs text-white/70">
            {formatTime(timeSpent)} / ~10:00
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Lesson List Item ─── */
function LessonListItem({
  lesson,
  index,
  isActive,
  isCompleted,
  onClick,
}: {
  lesson: {
    id: number;
    title: string;
    durationMinutes: number | null;
    contentType: string;
    isFreePreview: boolean;
  };
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[#C6FF34]/10 border border-[#C6FF34]/20"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-[#C6FF34]" />
        ) : isActive ? (
          <div className="w-5 h-5 rounded-full border-2 border-[#C6FF34] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#C6FF34]" />
          </div>
        ) : (
          <Circle className="w-5 h-5 text-white/20" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isActive ? "text-[#C6FF34]" : "text-white/80"
          }`}
        >
          {index + 1}. {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-white/40 flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {lesson.durationMinutes ?? "~"} min
          </span>
          <span className="text-[10px] text-white/30 uppercase">
            {lesson.contentType}
          </span>
          {lesson.isFreePreview && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7E3BED]/20 text-[#7E3BED]">
              Free
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ─── Main Lesson Player Page ─── */
export default function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeLessonId, setActiveLessonId] = useState<number>(
    Number(lessonId) || 0,
  );
  const [lessonProgress, setLessonProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  /* Use demo data */
  const course = demoCourse;
  const lessons = demoLessons;
  const enrollment = { id: 1, courseId: 1 }; // Mock enrollment

  /* Set first lesson as active if none selected */
  useEffect(() => {
    if (lessons.length > 0 && activeLessonId === 0) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId);

  /* Completed lessons tracking */
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(
    new Set([1]), // Mark first lesson as completed for demo
  );

  const handleProgressUpdate = (percent: number, time: number) => {
    setLessonProgress(percent);
    setTimeSpent(time);
  };

  const handleMarkComplete = () => {
    if (!activeLesson) return;
    setCompletedLessons((prev) => new Set(prev).add(activeLesson.id));
  };

  /* Navigate between lessons */
  const goToLesson = (offset: number) => {
    const currentIndex = lessons.findIndex((l) => l.id === activeLessonId);
    const nextIndex = currentIndex + offset;
    if (nextIndex >= 0 && nextIndex < lessons.length) {
      setActiveLessonId(lessons[nextIndex].id);
      setLessonProgress(0);
      setTimeSpent(0);
    }
  };

  /* Overall progress */
  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const overallProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (!course) {
    return (
      <div className="levav-container pt-6 pb-24">
        <GlassCard className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Course not found.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="levav-container pt-4 pb-24 lg:pb-8">
      {/* Course Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <button
          onClick={() => navigate("/learn")}
          className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Levav Learn
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">{course.title}</h1>
            <p className="text-xs text-white/50 mt-0.5">
              {course.category} • {totalLessons} lessons
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C6FF34]" />
            <span className="text-sm font-medium text-[#C6FF34]">
              {overallProgress}%
            </span>
          </div>
        </div>
        {/* Overall Progress Bar */}
        <div className="h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C6FF34] to-[#7E3BED] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Video Area */}
        <div className="flex-1 min-w-0">
          <GlassCard className="p-0 overflow-hidden" glow={false}>
            {activeLesson ? (
              <>
                <VideoPlayer
                  lessonTitle={activeLesson.title}
                  onProgressUpdate={handleProgressUpdate}
                />
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-base font-semibold">
                        {activeLesson.title}
                      </h2>
                      {activeLesson.description && (
                        <p className="text-xs text-white/50 mt-1 leading-relaxed">
                          {activeLesson.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleMarkComplete}
                      disabled={completedLessons.has(activeLesson.id)}
                      className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                        completedLessons.has(activeLesson.id)
                          ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20"
                          : "bg-[#C6FF34] text-black hover:shadow-lime"
                      }`}
                    >
                      {completedLessons.has(activeLesson.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Mark Complete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Lesson Navigation */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => goToLesson(-1)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <span className="text-xs text-white/30">
                      {lessons.findIndex((l) => l.id === activeLessonId) + 1} of {totalLessons}
                    </span>
                    <button
                      onClick={() => goToLesson(1)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="aspect-video flex items-center justify-center">
                <p className="text-white/40 text-sm">Select a lesson to begin</p>
              </div>
            )}
          </GlassCard>

          {/* Enrolled banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-2xl bg-[#7E3BED]/10 border border-[#7E3BED]/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">
                  Enrolled — tracking progress
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  Your progress is saved and contributes to your WRI score.
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#C6FF34]/10 text-[#C6FF34] text-xs font-medium">
                {overallProgress}% complete
              </div>
            </div>
          </motion.div>
        </div>

        {/* Lesson Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <GlassCard className="p-0 overflow-hidden" glow={false}>
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold">Course Content</h3>
              <p className="text-[10px] text-white/40 mt-0.5">
                {completedCount}/{totalLessons} completed • {overallProgress}% done
              </p>
            </div>
            <div className="max-h-[calc(100vh-20rem)] overflow-y-auto p-2 space-y-1">
              {lessons.length === 0 ? (
                <div className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-xs text-white/40">No lessons yet</p>
                </div>
              ) : (
                lessons.map((lesson, idx) => (
                  <LessonListItem
                    key={lesson.id}
                    lesson={lesson}
                    index={idx}
                    isActive={lesson.id === activeLessonId}
                    isCompleted={completedLessons.has(lesson.id)}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setLessonProgress(0);
                      setTimeSpent(0);
                    }}
                  />
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
