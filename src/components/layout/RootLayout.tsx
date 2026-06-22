/**
 * ============================================================
 * ROOT LAYOUT WRAPPER
 * ============================================================
 * Global layout with:
 * - Absolute midnight black canvas (#000000)
 * - Animated violet glow background layer
 * - Mobile-first responsive container
 * - Safe area insets for mobile devices
 * - Glass navigation bar
 * ============================================================
 */

import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { VioletGlow } from "./VioletGlow";
import { NotificationCenter } from "./NotificationCenter";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  UserCircle,
  Briefcase,
  BookOpen,
  Heart,
  Zap,
  Wallet,
  LogOut,
  Trophy,
  Star,
  Globe,
  Search,
  Sparkles,
  MessageCircle,
  Users,
  Award,
  Gift,
  Calendar,
  Bell,
  Building2,
  Shield,
  Settings,
} from "lucide-react";

interface RootLayoutProps {
  children: ReactNode;
}

/* ─── Navigation Items — EXACT per Blueprint v1.0.0 ─── */
const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/talent", label: "Levav ID™", icon: UserCircle },
  { path: "/jobs", label: "Jobs", icon: Globe },
  { path: "/employer", label: "Employers", icon: Briefcase },
  { path: "/learn", label: "Levav Learn™", icon: BookOpen },
  { path: "/contribute", label: "Levav Impact™", icon: Heart },
  { path: "/quickwork", label: "QuickWork™", icon: Zap },
  { path: "/wallet", label: "Levav Wallet™", icon: Wallet },
];

const secondaryNavItems = [
  { path: "/champions", label: "Levav Champions™", icon: Trophy },
  { path: "/skillspace", label: "Levav SkillSpace™", icon: Star },
  { path: "/advisor", label: "Levav Advisor™", icon: Sparkles },
  { path: "/messages", label: "Messages", icon: MessageCircle },
  { path: "/feed", label: "Community", icon: Users },
  { path: "/certificates", label: "Certificates", icon: Award },
  { path: "/refer", label: "Refer & Earn", icon: Gift },
  { path: "/interviews", label: "Interviews", icon: Calendar },
  { path: "/notifications", label: "Notifications", icon: Bell },
  { path: "/settings", label: "Settings", icon: Settings },
  { path: "/admin", label: "Admin", icon: Shield },
];



export function RootLayout({ children }: RootLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout, isDemoMode } = useAuth();

  /* Unread message count — demo mode always shows 2 */
  const unreadCount = isDemoMode ? 2 : 0;

  /* Track scroll for navbar glass effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Development Mode Banner */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#C6FF34]/10 border-b border-[#C6FF34]/20 backdrop-blur-sm">
        <div className="levav-container flex items-center justify-center gap-2 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF34] animate-pulse" />
          <span className="text-[10px] text-[#C6FF34] font-medium uppercase tracking-wider">
            Dev Mode — Authentication streamlined for testing
          </span>
        </div>
      </div>

      {/* Violet Glow Background */}
      <VioletGlow />

      {/* ─── Top Navigation Bar ─── */}
      <header
        className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
          scrolled
            ? "bg-[#070a13]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="levav-container flex items-center justify-between h-14 sm:h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-select">
            <div className="w-8 h-8 rounded-lg bg-[#C6FF34] flex items-center justify-center">
              <span className="text-black font-bold text-sm">L</span>
            </div>
            <span className="text-sm font-semibold text-white tracking-wide hidden sm:inline">
              Levav<span className="text-[#C6FF34]">™</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-[#C6FF34]/10 text-[#C6FF34]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {secondaryNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 relative ${
                  location.pathname === item.path
                    ? "bg-[#7E3BED]/10 text-[#7E3BED]"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {item.label}
                {item.path === "/messages" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C6FF34] text-black text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search + Notification Bell + Auth */}
            <div className="flex items-center gap-2">
              <Link
                to="/search"
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
              <NotificationCenter />
              {isAuthenticated || isDemoMode ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/talent"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">{user?.name ?? "Demo User"}</span>
                    {isDemoMode && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] text-[9px] font-bold uppercase tracking-wider">
                        Demo
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-[#C6FF34] text-black hover:shadow-lime transition-all duration-300"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer ─── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-[#070a13]/95 backdrop-blur-2xl border-r border-white/5"
            >
              <div className="flex flex-col h-full p-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#C6FF34] flex items-center justify-center">
                      <span className="text-black font-bold text-sm">L</span>
                    </div>
                    <span className="text-sm font-semibold">
                      Levav<span className="text-[#C6FF34]">™</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Nav Links */}
                <nav className="flex-1 space-y-1">
                  {navItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.1 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-[#C6FF34]/10 text-[#C6FF34] border border-[#C6FF34]/20"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Secondary Links */}
                <div className="pt-4 border-t border-white/5 space-y-1 mb-4">
                  {secondaryNavItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.05 + i * 0.05 + 0.1 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-[#7E3BED]/10 text-[#7E3BED] border border-[#7E3BED]/20"
                              : "text-white/40 hover:text-white/60 hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="flex-1">{item.label}</span>
                          {item.path === "/messages" && unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#C6FF34] text-black text-[10px] font-bold min-w-[18px] text-center">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Drawer Footer */}
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-white/30 text-center leading-relaxed">
                    Africa&apos;s Workforce Intelligence Ecosystem™
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content Area ─── */}
      <main className="relative z-10 pt-14 sm:pt-16 min-h-screen">
        {children}
      </main>

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070a13]/90 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                  isActive ? "text-[#C6FF34]" : "text-white/40"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{item.label.replace("™", "")}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 md:hidden" />

      {/* PWA Install Prompt + Offline Indicator */}
      <PWAInstallPrompt />
    </div>
  );
}