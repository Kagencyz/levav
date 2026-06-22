/**
 * ============================================================
 * RESET PASSWORD PAGE — Password Recovery
 * ============================================================
 * Enter email to receive reset link, then set new password
 * using the token from the URL.
 * ============================================================
 */

import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [reset, setReset] = useState(false);

  const forgotMutation = trpc.localAuth.forgotPassword.useMutation({
    onSuccess: (data) => {
      setSent(true);
      toast.success(data.message);
      if (data.devUrl) {
        toast.info(`Reset URL: ${data.devUrl}`, { duration: 15000 });
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const resetMutation = trpc.localAuth.resetPassword.useMutation({
    onSuccess: (data) => {
      setReset(true);
      toast.success(data.message);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Enter your email"); return; }
    forgotMutation.mutate({ email: email.trim() });
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenFromUrl) { toast.error("Invalid reset link"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    resetMutation.mutate({ token: tokenFromUrl, newPassword });
  };

  /* ─── Success: Password Reset ─── */
  if (reset) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#C6FF34]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Updated!</h1>
          <p className="text-sm text-white/50 mb-8">Your password has been reset successfully.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C6FF34] text-black font-medium hover:shadow-lime transition-all">
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ─── Reset Form (with token) ─── */
  if (tokenFromUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(126,59,237,0.1) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 w-full max-w-md px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#7E3BED]/10 border border-[#7E3BED]/20 flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-6 h-6 text-[#7E3BED]" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
              <p className="text-sm text-white/50">Enter your new password below.</p>
            </div>
            <GlassCard className="p-6" glow={false}>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C6FF34]/40 transition-colors"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {resetMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── Request Reset Form ─── */
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(126,59,237,0.1) 0%, transparent 70%)" }} />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C6FF34] flex items-center justify-center"><span className="text-black font-bold">L</span></div>
              <span className="text-lg font-semibold">Levav<span className="text-[#C6FF34]">™</span></span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-sm text-white/50">Enter your email and we&apos;ll send you a reset link.</p>
          </div>

          <GlassCard className="p-6" glow={false}>
            {sent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#C6FF34]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-[#C6FF34]" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Check Your Email</h2>
                <p className="text-sm text-white/50 mb-4">If an account exists, we&apos;ve sent a password reset link.</p>
                <Link to="/login" className="text-sm text-[#C6FF34] hover:underline">Back to Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleSendLink} className="space-y-4">
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
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {forgotMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </GlassCard>

          <p className="text-center text-xs text-white/30 mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-[#C6FF34] hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
