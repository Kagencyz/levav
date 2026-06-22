/**
 * ============================================================
 * VERIFY EMAIL PAGE — Email Verification Gateway
 * ============================================================
 * Enter the 6-digit verification code sent to your email.
 * Also supports resending the code.
 * ============================================================
 */

import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Mail,
  Loader2,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verifyMutation = trpc.localAuth.verifyEmail.useMutation({
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("levav_token", data.token);
      }
      setVerified(true);
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const resendMutation = trpc.localAuth.resendCode.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      /* Development: show code */
      if (data.devCode) {
        toast.info(`Development code: ${data.devCode}`, { duration: 10000 });
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  /* Auto-focus first input */
  useEffect(() => {
    if (!emailFromUrl) {
      inputRefs.current[0]?.focus();
    }
  }, [emailFromUrl]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    /* Auto-advance to next input */
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    verifyMutation.mutate({ email: email.trim(), code: fullCode });
  };

  const handleResend = () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    resendMutation.mutate({ email: email.trim() });
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(198,255,52,0.1) 0%, transparent 70%)" }} />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#C6FF34]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
          <p className="text-sm text-white/50 mb-8">
            Your account is now active. Welcome to Levav.
          </p>
          <a
            href="/#/talent"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C6FF34] text-black font-medium hover:shadow-lime transition-all"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(126,59,237,0.1) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C6FF34] flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
              <span className="text-lg font-semibold">Levav<span className="text-[#C6FF34]">™</span></span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-sm text-white/50">
              Enter the 6-digit code we sent to your email.
            </p>
          </div>

          <GlassCard className="p-6" glow={false}>
            {/* Email input (if not pre-filled) */}
            {!emailFromUrl && (
              <div className="mb-6">
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
            )}

            {/* Code display if email provided */}
            {emailFromUrl && (
              <div className="mb-6 p-3 rounded-xl bg-[#C6FF34]/5 border border-[#C6FF34]/10 flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C6FF34] shrink-0" />
                <div>
                  <p className="text-xs text-white/40">Code sent to</p>
                  <p className="text-sm text-white/80">{emailFromUrl}</p>
                </div>
              </div>
            )}

            {/* Code Inputs */}
            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value.replace(/\D/, ""))}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center bg-white/5 border border-white/10 rounded-xl text-xl font-bold text-white focus:outline-none focus:border-[#C6FF34] focus:bg-white/10 transition-all"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {verifyMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify Email
                </>
              )}
            </button>

            {/* Resend */}
            <button
              onClick={handleResend}
              disabled={resendMutation.isPending}
              className="w-full mt-3 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm hover:text-white/80 hover:bg-white/10 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              {resendMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Resend Code
                </>
              )}
            </button>
          </GlassCard>

          <p className="text-center text-xs text-white/30 mt-6">
            Didn&apos;t receive a code? Check your spam folder or{" "}
            <button onClick={handleResend} className="text-[#C6FF34] hover:underline">
              resend
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
