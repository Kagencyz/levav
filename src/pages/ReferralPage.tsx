/**
 * ============================================================
 * REFERRAL PAGE — Invite Friends & Earn
 * ============================================================
 * Share your unique referral code, track signups, and
 * climb the referral leaderboard. Earn ZMW per successful invite.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { demoReferralStats } from "@/lib/demo-data";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Share2,
  Copy,
  Check,
  Users,
  Trophy,
  Zap,
  Loader2,
  Gift,
  TrendingUp,
} from "lucide-react";

export default function ReferralPage() {
  const { isDemoMode } = useDemoAuth();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: myCode, isLoading: codeLoading } =
    trpc.referral.myCode.useQuery(undefined, { enabled: isAuthenticated });

  const { data: statsQuery, isLoading: statsLoading } =
    trpc.referral.stats.useQuery(undefined, { enabled: isAuthenticated && !isDemoMode });
  const stats = isDemoMode ? demoRefStats : (statsQuery ?? null);

  const { data: leaderboard } = trpc.referral.leaderboard.useQuery();

  const referralLink = myCode?.code
    ? `${window.location.origin}/#/onboarding?ref=${myCode.code}`
    : "";

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      await navigator.share({
        title: "Join Levav Talent Afrika",
        text: `Sign up with my referral code ${myCode?.code} and start your journey!`,
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="levav-container pt-6 pb-24 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-[#C6FF34]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Refer & Earn</h1>
          <p className="text-sm text-white/50">
            Invite friends to Levav™ and earn ZMW 5 per successful signup.
          </p>
        </div>

        {/* My Referral Code */}
        <GlassCard className="p-5 mb-6" glow={false}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#C6FF34]" />
            Your Referral Link
          </h2>

          {codeLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#C6FF34]" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 truncate">
                  {referralLink || "Sign in to get your code"}
                </div>
                <button
                  onClick={handleCopy}
                  disabled={!referralLink}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#C6FF34]" />
                  ) : (
                    <Copy className="w-5 h-5 text-white/50" />
                  )}
                </button>
              </div>

              <button
                onClick={handleShare}
                disabled={!referralLink}
                className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-30 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Invite Link
              </button>
            </>
          )}
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <GlassCard className="p-3 text-center" glow={false}>
            <Users className="w-5 h-5 text-[#7E3BED] mx-auto mb-1" />
            <p className="text-xl font-bold text-white/90">
              {stats?.totalReferrals ?? 0}
            </p>
            <p className="text-[10px] text-white/40">Invites Sent</p>
          </GlassCard>
          <GlassCard className="p-3 text-center" glow={false}>
            <Check className="w-5 h-5 text-[#C6FF34] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#C6FF34]">
              {stats?.completed ?? 0}
            </p>
            <p className="text-[10px] text-white/40">Completed</p>
          </GlassCard>
          <GlassCard className="p-3 text-center" glow={false}>
            <Zap className="w-5 h-5 text-[#F59E0B] mx-auto mb-1" />
            <p className="text-xl font-bold text-[#F59E0B]">
              ZMW {stats?.earned ?? "0.00"}
            </p>
            <p className="text-[10px] text-white/40">Earned</p>
          </GlassCard>
        </div>

        {/* How It Works */}
        <GlassCard className="p-5 mb-6" glow={false}>
          <h2 className="text-sm font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: "1", text: "Share your unique referral link with friends", color: "#C6FF34" },
              { step: "2", text: "They sign up and complete their Levav ID™ profile", color: "#7E3BED" },
              { step: "3", text: "You earn ZMW 5 credited to your wallet instantly", color: "#F59E0B" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  {item.step}
                </div>
                <p className="text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Leaderboard */}
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#C6FF34]" />
          Top Referrers
        </h2>
        {!leaderboard || leaderboard.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/40">No referrals yet. Be the first!</p>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((ref, i) => (
              <GlassCard key={ref.referrerId} className="p-3" glow={false}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      i === 0
                        ? "bg-[#FCD116]/10 text-[#FCD116]"
                        : i === 1
                          ? "bg-gray-400/10 text-gray-400"
                          : i === 2
                            ? "bg-amber-700/10 text-amber-600"
                            : "bg-white/5 text-white/30"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#7E3BED]/20 flex items-center justify-center shrink-0 text-xs font-bold text-[#7E3BED]">
                    {(ref.profileName ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      {ref.profileName}
                    </p>
                    <p className="text-[10px] text-white/30">
                      {ref.totalReferrals} successful referrals
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#C6FF34]">
                    ZMW {Number(ref.totalEarned).toFixed(2)}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
