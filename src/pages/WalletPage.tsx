/**
 * ============================================================
 * LEVAV WALLET™ (/wallet) — LIVE DATA
 * ============================================================
 */

import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { SkeletonCard, SkeletonStatCard } from "@/components/ui/Skeletons";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { demoWalletTransactions } from "@/lib/demo-data";
import { demoProfile } from "@/lib/demo-data";
import { trpc } from "@/providers/trpc";
import { motion } from "framer-motion";
import {
  ArrowDownLeft, Clock, CheckCircle2,
  Zap, BookOpen, Heart, Briefcase, Banknote, Smartphone, Lock,
} from "lucide-react";
import { useState } from "react";

const typeIcons: Record<string, React.ReactNode> = {
  quickwork_earning: <Zap className="w-4 h-4" />,
  course_sale: <BookOpen className="w-4 h-4" />,
  platform_commission: <Briefcase className="w-4 h-4" />,
  donation: <Heart className="w-4 h-4" />,
  withdrawal: <Banknote className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  quickwork_earning: "bg-[#C6FF34]/10 text-[#C6FF34]",
  course_sale: "bg-[#7E3BED]/10 text-[#7E3BED]",
  platform_commission: "bg-white/5 text-white/40",
  donation: "bg-red-500/10 text-red-400",
  withdrawal: "bg-amber-500/10 text-amber-400",
};

const methodLabels: Record<string, string> = {
  momo_airtel: "Airtel Money",
  momo_mtn: "MTN MoMo",
  momo_zamtel: "Zamtel Money",
  internal: "Internal",
  flutterwave: "Flutterwave",
};

const inTypes = ["quickwork_earning", "course_sale", "subscription_revenue", "deposit"];

export default function WalletPage() {
  const { isDemoMode } = useDemoAuth();
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");

  const { data: stats, isLoading: statsLoading } = trpc.wallet.stats.useQuery(
    undefined,
    { enabled: isAuthenticated, staleTime: 1000 * 30 },
  );

  const { data: transactionsQuery, isLoading: txLoading } = trpc.wallet.transactions.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated && !isDemoMode, staleTime: 1000 * 30 },
  );
  const transactions = isDemoMode ? demoWalletTx : (transactionsQuery ?? []);

  if (!isAuthenticated && !isDemoMode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Lock className="w-8 h-8 text-[#C6FF34] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Wallet Access</h1>
          <p className="text-sm text-white/50">Sign in to view your Levav Wallet™.</p>
        </div>
      </div>
    );
  }

  const balance = stats?.balance ?? 0;
  const totalIn = stats?.totalIn ?? 0;

  const filteredTx = (transactions ?? []).filter((t: { transactionType: string }) => {
    if (filter === "in") return inTypes.includes(t.transactionType);
    if (filter === "out") return !inTypes.includes(t.transactionType);
    return true;
  });

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1"><span className="badge-lime">ZMW</span></div>
          <h1 className="text-hero text-2xl sm:text-3xl">Levav Wallet™</h1>
          <p className="text-body mt-1">Internal settlement and earnings</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="glass-card-strong p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, #C6FF34 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
            />
            <div className="relative z-10">
              <p className="text-xs text-white/40 mb-1">Available Balance</p>
              <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                ZMW {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              {statsLoading && <p className="text-xs text-white/30 mt-1">Loading...</p>}
            </div>
          </div>
        </motion.div>

        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard /><SkeletonStatCard />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard label="Total In" value={`ZMW ${totalIn.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} icon={<ArrowDownLeft className="w-5 h-5 text-[#C6FF34]" />} delay={0} />
            <StatCard label="Balance" value={`ZMW ${balance.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} icon={<CheckCircle2 className="w-5 h-5 text-[#7E3BED]" />} delay={0.05} />
            <StatCard label="Pending" value={`ZMW ${stats?.pendingIn ?? 0}`} icon={<Clock className="w-5 h-5 text-amber-400" />} delay={0.1} />
            <StatCard label="Transactions" value={stats?.transactionCount ?? 0} icon={<Banknote className="w-5 h-5 text-white/60" />} delay={0.15} />
          </div>
        )}

        <GlassCard variant="strong" delay={0.25}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-section text-base">Transaction History</h2>
            <div className="flex items-center gap-1">
              {(["all", "in", "out"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    filter === f ? "bg-[#C6FF34]/10 text-[#C6FF34]" : "text-white/30 hover:text-white/60"
                  }`}>
                  {f === "all" ? "All" : f === "in" ? "In" : "Out"}
                </button>
              ))}
            </div>
          </div>

          {txLoading ? (
            <div className="space-y-2"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : filteredTx.length > 0 ? (
            <div className="space-y-2">
              {filteredTx.map((tx: Record<string, unknown>, i: number) => (
                <motion.div key={tx.id as number} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <div className={`p-2 rounded-lg ${typeColors[(tx.transactionType as string) ?? ""] ?? "bg-white/5 text-white/40"}`}>
                    {typeIcons[(tx.transactionType as string) ?? ""] ?? <Banknote className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90">{(tx.description as string) ?? (tx.transactionType as string)}</p>
                    <p className="text-xs text-white/40">
                      {methodLabels[(tx.paymentMethod as string) ?? ""] ?? (tx.paymentMethod as string)} &middot; {tx.status as string}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-medium tabular-nums ${inTypes.includes(tx.transactionType as string) ? "text-[#C6FF34]" : "text-red-400"}`}>
                      {inTypes.includes(tx.transactionType as string) ? "+" : "-"}ZMW {Math.abs(Number(tx.amount)).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-white/30">{tx.createdAt ? new Date(tx.createdAt as string).toLocaleDateString() : ""}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Banknote className="w-8 h-8 text-white/10 mx-auto mb-2" />
              <p className="text-sm text-white/30">No transactions yet.</p>
              <p className="text-xs text-white/20 mt-1">Earnings will appear here.</p>
            </div>
          )}
        </GlassCard>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-6">
          <GlassCard variant="strong">
            <h2 className="text-section text-base mb-4">Withdraw Funds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Airtel Money", icon: <Smartphone className="w-4 h-4" />, color: "bg-red-500/10 text-red-400" },
                { label: "MTN MoMo", icon: <Smartphone className="w-4 h-4" />, color: "bg-yellow-500/10 text-yellow-400" },
                { label: "Zamtel Money", icon: <Smartphone className="w-4 h-4" />, color: "bg-sky-500/10 text-sky-400" },
              ].map((method) => (
                <button key={method.label}
                  className="flex items-center gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#C6FF34]/20 transition-all text-left group"
                >
                  <div className={`p-2 rounded-lg ${method.color}`}>{method.icon}</div>
                  <div>
                    <p className="text-sm text-white/80 group-hover:text-white transition-colors">{method.label}</p>
                    <p className="text-[10px] text-white/30">Instant withdrawal</p>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
