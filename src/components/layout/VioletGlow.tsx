/**
 * ============================================================
 * VIOLET GLOW BACKGROUND LAYER
 * ============================================================
 * Animated, slow-pulsing background radial glow using deep
 * tech violet #7E3BED positioned behind structural components.
 * Pure CSS animation — zero JS overhead.
 * ============================================================
 */

export function VioletGlow() {
  return (
    <div className="violet-glow" aria-hidden="true">
      {/* Primary glow — top-left */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] animate-violet-pulse pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(126, 59, 237, 0.15) 0%, transparent 70%)",
        }}
      />
      {/* Secondary glow — bottom-right */}
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] animate-violet-pulse pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(126, 59, 237, 0.1) 0%, transparent 60%)",
          animationDirection: "reverse",
          animationDuration: "8s",
        }}
      />
      {/* Subtle center ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(126, 59, 237, 0.03) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
