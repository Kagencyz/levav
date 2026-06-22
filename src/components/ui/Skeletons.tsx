/**
 * ============================================================
 * LOADING SKELETON STATES — Shimmer Components
 * ============================================================
 * Shimmer skeleton screens for all async data loading states.
 * Used in: talent cards, job listings, WRI ring, stats.
 * ============================================================
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Shimmer({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer-bg rounded-lg bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] bg-[length:200%_100%] animate-shimmer",
        className,
      )}
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("glass-card p-5 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <Shimmer className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3.5 w-3/4" />
          <Shimmer className="h-2.5 w-1/2" />
        </div>
      </div>
      <Shimmer className="h-2 w-full" />
      <Shimmer className="h-2 w-2/3" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Shimmer className="h-2.5 w-20" />
          <Shimmer className="h-8 w-16" />
        </div>
        <Shimmer className="w-10 h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonWriRing() {
  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <Shimmer className="w-32 h-32 rounded-full" />
      <div className="mt-3 space-y-1.5 text-center">
        <Shimmer className="h-4 w-16 mx-auto" />
        <Shimmer className="h-3 w-12 mx-auto" />
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <Shimmer className="w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Shimmer className="h-2.5 w-2/3" />
        <Shimmer className="h-2 w-1/3" />
      </div>
      <Shimmer className="w-4 h-4 rounded flex-shrink-0" />
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4 animate-pulse">
      <Shimmer className="h-8 w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <SkeletonCard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
