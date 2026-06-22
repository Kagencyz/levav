/**
 * ============================================================
 * LOGIN / REGISTER PAGE — Levav™ Authentication Gateway
 * ============================================================
 * Glass-themed auth portal:
 * - Email & Password (local auth)
 * - Quick Test Login (instant dev access)
 * - Levav Sign-In (Kimi OAuth)
 * ============================================================
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Globe,
  Eye,
  EyeOff,
  Chrome,
  Fingerprint,
  Server,
  ServerOff,
  Play,
} from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

type AuthMode = "signin" | "signup";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const { enableDemo } = useDemoAuth();

  /* Form state */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Check backend health on mount */
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "/api";
        const resp = await fetch(`${apiUrl}/health`, { method: "GET", signal: AbortSignal.timeout(5000) });
        setBackendOnline(resp.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
  }, []);

  const utils = trpc.useUtils();

  /* ─── Register ─── */
  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        /* Dev mode: instant login */
        localStorage.setItem("levav_token", data.token);
        toast.success("Account created! Welcome to Levav.");
        setTimeout(() => {
          window.location.href = "/#/onboarding";
        }, 400);
      } else {
        /* Production: redirect to verify */
        toast.success(data.message);
        setTimeout(() => {
          window.location.href = `/#/verify-email?email=${encodeURIComponent(email)}`;
        }, 400);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Registration failed. Please try again.");
    },
  });

  /* ─── Login ─── */
  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("levav_token", data.token);
        toast.success(data.user?.name ? `Welcome back, ${data.user.name}!` : "Welcome back!");
        setTimeout(() => {
          window.location.href = "/#/talent";
        }, 400);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Sign in failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!name.trim() || !email.trim() || !password) {
        toast.error("Please fill in all fields");
        return;
      }
      registerMutation.mutate({ name: name.trim(), email: email.trim(), password });
    } else {
      if (!email.trim() || !password) {
        toast.error("Please enter your email and password");
        return;
      }
      loginMutation.mutate({ email: email.trim(), password });
    }
  };

  const isPending = registerMutation.isPending || loginMutation.isPending;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(126,59,237,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(198,255,52,0.06) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#C6FF34] flex items-center justify-center">
              <span className="text-black font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-semibold">
              Levav<span className="text-[#C6FF34]">™</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-white/40">
            {mode === "signin"
              ? "Sign in to access your Levav ID™"
              : "Join Africa's Workforce Intelligence Ecosystem™"}
          </p>
        </motion.div>

        {/* Backend Status Banner */}
        {backendOnline === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <ServerOff className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Backend Server Offline</span>
            </div>
            <p className="text-[11px] text-white/40">
              Authentication requires the backend server to be running.
            </p>
          </motion.div>
        )}

        {backendOnline === true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-2 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Server className="w-3.5 h-3.5 text-[#C6FF34]" />
              <span className="text-[11px] text-[#C6FF34]">Backend Connected</span>
            </div>
          </motion.div>
        )}

        {/* Demo Mode — Explore Without Backend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <button
            onClick={() => {
              enableDemo();
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6FF34]/20 to-[#7E3BED]/20 border border-[#C6FF34]/30 text-[#C6FF34] font-medium text-sm hover:from-[#C6FF34]/30 hover:to-[#7E3BED]/30 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Enter Demo Mode — Explore All Pages
          </button>
          <p className="text-[10px] text-white/30 text-center mt-1.5">
            Browse the entire platform with sample data — no backend required
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6" glow={false}>
            {/* Mode Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-5">
              <button
                onClick={() => setMode("signin")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "signin"
                    ? "bg-[#C6FF34] text-black"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "signup"
                    ? "bg-[#C6FF34] text-black"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Get Started
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Banda"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/50">Password</label>
                  {mode === "signin" && (
                    <Link to="/reset-password" className="text-[10px] text-[#C6FF34]/60 hover:text-[#C6FF34] transition-colors">
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={() => {
                toast.info("Google OAuth coming soon. Use email/password or Quick Test Login.");
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white/70 mb-2"
            >
              <Chrome className="w-4 h-4" />
              Continue with Google
            </button>

            <button
              onClick={() => { window.location.href = getOAuthUrl(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white/70"
            >
              <Fingerprint className="w-4 h-4" />
              Continue with Levav Sign-In
            </button>
          </GlassCard>
        </motion.div>

        <p className="text-center text-xs text-white/30 mt-5">
          <Globe className="w-3 h-3 inline mr-1" />
          Africa's Workforce Intelligence Ecosystem™
        </p>
      </div>
    </div>
  );
}
