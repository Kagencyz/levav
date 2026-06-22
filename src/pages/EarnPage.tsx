/**
 * ============================================================
 * EARN PAGE (/earn)
 * ============================================================
 * Earnings overview combining wallet balance + QuickWork™
 * earnings + course sales. Uses demo data.
 * ============================================================
 */

import { GlassCard, StatCard } from "@/components/ui/GlassCard";
import { demoWalletTransactions, demoProfile } from "@/lib/demo-data";
import { motion } from "framer-motion";
import {
  Banknote, Zap, TrendingUp, Wallet, ArrowDownLeft, ArrowUpRight,
} from "lucide-react";

export default function EarnPage() {
  /* Use demo data */
  const transactions = demoWalletTransactions;
  const stats = {
    balance: parseFloat(demoProfile.balanceZmw),
    totalEarned: 450.00,
    totalSpent: 125.00,
    quickWorkEarnings: 325.00,
  };

  return (
    <div className="min-h-screen bg-black pb-8">
      <div className="levav-container max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-lime">Earn™</span>
          </div>
          <h1 className="text-hero text-2xl sm:text-3xl">Earnings</h1>
          <p className="text-body mt-1">Track your income across all Levav™ pathways</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Balance" value={`ZMW ${stats.balance.toFixed(2)}`} icon={<Wallet className="w-5 h-5" />} delay={0} />
          <StatCard label="Total Earned" value={`ZMW ${stats.totalEarned.toFixed(2)}`} icon={<TrendingUp className="w-5 h-5" />} delay={0.05} />
          <StatCard label="QuickWork™" value={`ZMW ${stats.quickWorkEarnings.toFixed(2)}`} icon={<Zap className="w-5 h-5" />} delay={0.1} />
          <StatCard label="Total Spent" value={`ZMW ${stats.totalSpent.toFixed(2)}`} icon={<Banknote className="w-5 h-5" />} delay={0.15} />
        </div>

        {/* Transaction History */}
        <GlassCard variant="strong" delay={0.2}>
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-4 h-4 text-[#C6FF34]" />
            <h2 className="text-section text-base">Transaction History</h2>
          </div>
          <div className="space-y-2">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    tx.amount.startsWith("-") ? "bg-red-500/10 text-red-400" : "bg-[#C6FF34]/10 text-[#C6FF34]"
                  }`}>
                    {tx.amount.startsWith("-") ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/80">{tx.description}</p>
                    <p className="text-[10px] text-white/30">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  tx.amount.startsWith("-") ? "text-red-400" : "text-[#C6FF34]"
                }`}>
                  {tx.amount.startsWith("-") ? "" : "+"}{tx.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
