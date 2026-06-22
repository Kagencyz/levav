/**
 * ============================================================
 * HOME PAGE — Levav™ Landing
 * ============================================================
 * Premium hero landing with animated glass elements,
 * brand trademark identifiers, and portal navigation.
 * Mobile-first with neon lime accents on midnight black.
 * ============================================================
 */

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "react-router";
import {
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  BookOpen,
  Heart,
  Briefcase,
  Target,
  Shield,
  Award,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(126,59,237,0.3) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(198,255,52,0.15) 0%, transparent 70%)" }}
          />
        </div>

        <div className="levav-container relative z-10 text-center max-w-3xl mx-auto px-4">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C6FF34]/10 border border-[#C6FF34]/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#C6FF34]" />
            <span className="text-xs font-medium text-[#C6FF34]">
              Now Launching in Zambia
            </span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Build Your</span>
            <br />
            <span className="text-gradient-lime">Workforce Future</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 max-w-xl mx-auto"
          >
            Africa&apos;s Workforce Intelligence Ecosystem™ transforms
            potential into capability, capability into contribution, and
            contribution into meaningful economic impact across the continent.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link to="/onboarding" className="btn-lime flex items-center gap-2 group">
              Get Your Levav ID™
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/employer" className="btn-ghost">
              I&apos;m an Employer
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { value: "76+", label: "Professions" },
              { value: "4", label: "Pathways" },
              { value: "1", label: "Mission" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-[#C6FF34]" />
          </div>
        </motion.div>
      </section>

      {/* ─── FOUR PATHWAYS SECTION ─── */}
      <section className="py-16 sm:py-24">
        <div className="levav-container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Four Pathways to Impact
            </h2>
            <p className="text-sm text-white/50 max-w-lg mx-auto">
              Every journey through the ecosystem feeds data back to your
              Levav ID™ and Workforce Readiness Index™.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: "Learn",
                path: "/learn",
                desc: "Upskill through Levav Learn™ courses and institutional training.",
                color: "from-[#7E3BED] to-[#5a2dd1]",
              },
              {
                icon: <Briefcase className="w-6 h-6" />,
                title: "Earn",
                path: "/employer",
                desc: "Access career-matched employment through verified WRI™ scores.",
                color: "from-[#C6FF34] to-[#9FE630]",
                textColor: "text-black",
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Contribute",
                path: "/volunteer",
                desc: "Build leadership through Levav Impact™ volunteer opportunities.",
                color: "from-[#7E3BED] to-[#9B59B6]",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Build",
                path: "/build",
                desc: "Launch ventures and access startup incubation programs.",
                color: "from-white/20 to-white/5",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={card.path}>
                  <GlassCard
                    variant="interactive"
                    animate={false}
                    className="h-full p-6 flex flex-col"
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} w-fit mb-4 ${card.textColor ?? "text-white"}`}>
                      {card.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{card.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed flex-1">{card.desc}</p>
                    <div className="flex items-center gap-1 mt-4 text-xs text-[#C6FF34]">
                      Explore <ArrowRight className="w-3 h-3" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-16 sm:py-24 border-t border-white/5">
        <div className="levav-container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How Levav™ Works
            </h2>
            <p className="text-sm text-white/50">
              Potential → Capability → Contribution → Opportunity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                title: "The Levav Code™",
                desc: "Accept the covenant of Ownership, Excellence, Reliability, Initiative, Growth, Critical Thinking, Service, and Impact.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Levav 28™ Onboarding",
                desc: "Complete 28 days of socratic challenges: CONFRONT, DISSECT, OWN, and EXECUTE™ scenarios tailored to your profession.",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "WRI™",
                desc: "Your Workforce Readiness Index™ aggregates 7 component scores into a single verified metric employers trust.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard variant="strong" animate={false} className="h-full text-center p-6">
                  <div className="inline-flex p-3 rounded-xl bg-[#C6FF34]/10 text-[#C6FF34] mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <section className="py-16 sm:py-20 border-t border-white/5">
        <div className="levav-container max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Build Your Future?
            </h2>
            <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">
              Join Africa&apos;s Workforce Intelligence Ecosystem™ and transform
              your potential into verified capability.
            </p>
            <Link to="/onboarding" className="btn-lime inline-flex items-center gap-2 group">
              Create Your Levav ID™
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-8">
        <div className="levav-container max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C6FF34] flex items-center justify-center">
                <span className="text-black font-bold text-xs">L</span>
              </div>
              <span className="text-xs text-white/40">
                Levav™ &middot; Africa&apos;s Workforce Intelligence Ecosystem™
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/20">
              <Globe className="w-3 h-3" />
              <span>Launched in Zambia</span>
              <span className="mx-2">&middot;</span>
              <span>2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
