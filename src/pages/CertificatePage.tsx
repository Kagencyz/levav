/**
 * ============================================================
 * CERTIFICATE PAGE — Course Completion Certificates
 * ============================================================
 * View and verify Levav™ course completion certificates.
 * Displays certificate details with verification link.
 * ============================================================
 */

import { useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { demoCertificates } from "@/lib/demo-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import {
  Award,
  Loader2,
  CheckCircle,
  Search,
  Shield,
  Calendar,
  FileCheck,
  AlertCircle,
} from "lucide-react";

/* ─── Certificate Card ─── */
function CertificateCard({
  cert,
}: {
  cert: {
    id: number;
    certificateNumber: string;
    courseTitle: string;
    instructorName: string | null;
    issueDate: Date | string;
    verificationUrl: string | null;
  };
}) {
  return (
    <GlassCard className="p-5 relative overflow-hidden" glow={false}>
      {/* Decorative border */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#C6FF34] via-[#7E3BED] to-[#C6FF34]" />

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#C6FF34]/10 border border-[#C6FF34]/20 flex items-center justify-center shrink-0">
          <Award className="w-7 h-7 text-[#C6FF34]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white/90 mb-1">
            {cert.courseTitle}
          </h3>
          <p className="text-xs text-white/40 mb-2">
            Certificate No: {cert.certificateNumber}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-white/40">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(cert.issueDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {cert.instructorName && (
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {cert.instructorName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Badge */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-[#C6FF34]">
          <CheckCircle className="w-3 h-3" />
          Verified Levav™ Credential
        </div>
        {cert.verificationUrl && (
          <button
            onClick={() => navigator.clipboard.writeText(cert.verificationUrl!)}
            className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
          >
            Copy Link
          </button>
        )}
      </div>
    </GlassCard>
  );
}

/* ─── Main Certificate Page ─── */
export default function CertificatePage() {
  const { isDemoMode } = useDemoAuth();
  const { certNumber } = useParams<{ certNumber: string }>();
  const { isAuthenticated } = useAuth();
  const [verifyInput, setVerifyInput] = useState("");

  /* My certificates (authenticated) */
  const { data: myCertsQuery, isLoading: myCertsLoading } =
    trpc.certificate.mine.useQuery(undefined, {
      enabled: isAuthenticated && !isDemoMode,
    });
  const myCerts = isDemoMode ? demoCerts : (myCertsQuery ?? []);

  /* Public verification */
  const [verifyCertNumber, setVerifyCertNumber] = useState(certNumber ?? "");
  const { data: verifyResult, isLoading: verifyLoading } =
    trpc.certificate.verify.useQuery(
      { certNumber: verifyCertNumber },
      { enabled: verifyCertNumber.length > 0 },
    );

  const handleVerify = () => {
    if (verifyInput.trim()) {
      setVerifyCertNumber(verifyInput.trim());
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
            <FileCheck className="w-8 h-8 text-[#C6FF34]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Certificate Center</h1>
          <p className="text-sm text-white/50">
            Verify and showcase your Levav™ credentials.
          </p>
        </div>

        {/* Verification Section */}
        <GlassCard className="p-5 mb-8" glow={false}>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C6FF34]" />
            Verify a Certificate
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Enter certificate number (e.g., LEVAV-2026-0001)"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#C6FF34]/30"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleVerify();
              }}
            />
            <button
              onClick={handleVerify}
              className="px-4 py-3 rounded-xl bg-[#C6FF34] text-black text-sm font-medium hover:shadow-lime transition-all"
            >
              Verify
            </button>
          </div>

          {/* Verification Result */}
          {verifyLoading && (
            <div className="mt-4 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-[#C6FF34]" />
            </div>
          )}
          {verifyResult && !verifyLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl border ${
                verifyResult.valid
                  ? "bg-[#C6FF34]/5 border-[#C6FF34]/20"
                  : "bg-red-500/5 border-red-500/20"
              }`}
            >
              {verifyResult.valid ? (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#C6FF34] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#C6FF34]">
                      Valid Certificate
                    </p>
                    <p className="text-xs text-white/60">
                      Issued to{" "}
                      <span className="text-white/80">
                        {verifyResult.recipient}
                      </span>{" "}
                      for{" "}
                      <span className="text-white/80">
                        {verifyResult.certificate?.courseTitle}
                      </span>
                    </p>
                    <p className="text-[10px] text-white/30 mt-1">
                      {new Date(
                        verifyResult.certificate?.issueDate ?? "",
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400">
                      Invalid Certificate
                    </p>
                    <p className="text-xs text-white/40">
                      {verifyResult.message}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </GlassCard>

        {/* My Certificates */}
        {isAuthenticated && (
          <div>
            <h2 className="text-sm font-semibold mb-3">My Certificates</h2>
            {myCertsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-[#C6FF34]" />
              </div>
            ) : !myCerts || myCerts.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <Award className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1">
                  No certificates yet
                </p>
                <p className="text-xs text-white/40">
                  Complete courses to earn your first certificate.
                </p>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {myCerts.map((cert) => (
                  <CertificateCard key={cert.id} cert={cert} />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
