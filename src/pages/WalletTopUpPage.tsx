/**
 * ============================================================
 * WALLET TOP-UP PAGE — Mobile Money Integration
 * ============================================================
 * MTN MoMo and Airtel Money wallet top-up interface.
 * Zambian mobile-first payment flow with status tracking.
 * Uses demo data for offline development.
 * ============================================================
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { demoPaymentHistory } from "@/lib/demo-data";
import {
  Wallet,
  Smartphone,
  CheckCircle,
  Loader2,
  Clock,
  AlertCircle,
  Zap,
  RefreshCw,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    pending: { color: "#F59E0B", icon: Clock, label: "Pending" },
    processing: { color: "#3B82F6", icon: Loader2, label: "Processing" },
    completed: { color: "#10B981", icon: CheckCircle, label: "Completed" },
    failed: { color: "#EF4444", icon: AlertCircle, label: "Failed" },
  };
  const c = config[status] ?? config.pending;
  const Icon = c.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: `${c.color}15`, color: c.color }}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}

export default function WalletTopUpPage() {
  const [amount, setAmount] = useState("50");
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState<"mtn_momo" | "airtel_money">("mtn_momo");
  const [pendingTx, setPendingTx] = useState<{
    transactionId: number;
    reference: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  /* Use demo payment history */
  const history = demoPaymentHistory;

  const handleTopUp = () => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!phone || phone.length < 9) {
      toast.error("Enter a valid phone number");
      return;
    }
    setIsProcessing(true);
    /* Simulate processing */
    setTimeout(() => {
      setPendingTx({
        transactionId: Math.floor(Math.random() * 10000),
        reference: `REF-${Date.now()}`,
      });
      toast.success("Payment initiated! Check your phone to authorize.");
      setIsProcessing(false);
    }, 1500);
  };

  const handleVerify = () => {
    if (!pendingTx) return;
    setIsVerifying(true);
    setTimeout(() => {
      toast.success(`Wallet topped up with ZMW ${amount}!`);
      setPendingTx(null);
      setIsVerifying(false);
    }, 1000);
  };

  const presetAmounts = [10, 20, 50, 100, 200, 500];

  return (
    <div className="levav-container pt-6 pb-24 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <Wallet className="w-6 h-6 text-[#C6FF34]" />
          Wallet Top-Up
        </h1>
        <p className="text-sm text-white/50 mb-6">
          Add funds via MTN MoMo or Airtel Money.
        </p>

        {/* Top-Up Form */}
        <GlassCard className="p-5 mb-6" glow={false}>
          {/* Provider Selection */}
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">
            Select Provider
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setProvider("mtn_momo")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                provider === "mtn_momo"
                  ? "bg-[#FCD116]/10 border-[#FCD116]/30 text-[#FCD116]"
                  : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              MTN MoMo
            </button>
            <button
              onClick={() => setProvider("airtel_money")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${
                provider === "airtel_money"
                  ? "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                  : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Airtel Money
            </button>
          </div>

          {/* Amount Selection */}
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">
            Amount (ZMW)
          </p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {presetAmounts.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a.toString())}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                  amount === a.toString()
                    ? "bg-[#C6FF34] text-black"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                ZMW {a}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Custom amount"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30 mb-4"
            min="1"
            max="10000"
          />

          {/* Phone Input */}
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wide">
            Phone Number
          </p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., 0971234567 or 0771234567"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30 mb-4"
          />

          {/* Submit */}
          <button
            onClick={handleTopUp}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-[#C6FF34] text-black font-medium text-sm hover:shadow-lime disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Top Up ZMW {amount || "0"}
              </>
            )}
          </button>

          {/* Pending Transaction Status */}
          {pendingTx && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/60">
                  Transaction #{pendingTx.transactionId}
                </p>
                <StatusBadge status="pending" />
              </div>
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="w-full py-2 rounded-lg bg-white/5 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                {isVerifying ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                Check Status
              </button>
            </motion.div>
          )}
        </GlassCard>

        {/* Transaction History */}
        <h2 className="text-sm font-semibold mb-3">Recent Transactions</h2>
        {history.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <Clock className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-xs text-white/40">No transactions yet</p>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 10).map((tx) => (
              <GlassCard key={tx.id} className="p-3" glow={false}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.transactionType === "wallet_topup"
                          ? "bg-[#C6FF34]/10"
                          : "bg-white/5"
                      }`}
                    >
                      <Wallet
                        className={`w-4 h-4 ${
                          tx.transactionType === "wallet_topup"
                            ? "text-[#C6FF34]"
                            : "text-white/40"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/80 capitalize">
                        {tx.transactionType.replace("_", " ")}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#C6FF34]">
                      ZMW {tx.amountZmw}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
