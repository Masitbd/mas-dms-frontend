import React, { memo } from "react";
import { Loader2 } from "lucide-react";

export type LoadingSize = "full" | "md" | "small";

export interface LoadingProps {
  loading: boolean;
  size?: LoadingSize; // defaults to "md"
}

/**
 * Modern, reusable loading component
 * - size="full": page overlay
 * - size="md": overlays ONLY the parent container (parent must have `relative`)
 * - size="small": compact inline spinner (e.g., inside buttons)
 */
const Loading: React.FC<LoadingProps> = memo(({ loading, size = "md" }) => {
  if (!loading) return null;

  if (size === "full") {
    return (
      <div className="absolute inset-0 z-50 grid place-items-center bg-black/10 backdrop-blur-sm">
        <div className="rounded-2xl bg-white/80 px-6 py-5 shadow-lg ring-1 ring-black/5 dark:bg-neutral-900/80">
          <ModernSpinner px={84} />
        </div>
        <span className="sr-only" role="status" aria-busy="true">
          Loading
        </span>
      </div>
    );
  }

  if (size === "small") {
    // Small inline lucide spinner for compact UI
    return (
      <span
        className="inline-flex items-center align-middle"
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </span>
    );
  }

  // size === "md"
  // NOTE: To ensure this covers ONLY the component it lives in, make the parent container `relative`.
  return (
    <div
      className="absolute inset-0 z-40 grid place-items-center bg-white "
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <ModernSpinner px={64} />
      <span className="sr-only">Loading</span>
    </div>
  );
});

Loading.displayName = "Loading";

export default Loading;

/* ------------------------- Modern spinner (bars) ------------------------- */
const ModernSpinner: React.FC<{ px?: number }> = ({ px = 64 }) => {
  const barCount = 5;
  const barWidth = Math.max(4, Math.round(px / 11));
  const barRadius = Math.max(3, Math.round(barWidth / 2));
  const barGap = Math.max(3, Math.round(barWidth / 2));
  const containerWidth = barCount * barWidth + (barCount - 1) * barGap;

  return (
    <div className="text-neutral-800 dark:text-neutral-800">
      <div
        className="flex items-end justify-center"
        style={{ width: containerWidth, height: px, gap: barGap }}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <span
            key={i}
            className="inline-block bg-current"
            style={{
              width: barWidth,
              height: Math.max(10, Math.round(px * 0.42)),
              borderRadius: barRadius,
              animation: `loading-wave 1.05s ease-in-out ${i * 0.08}s infinite`,
              transformOrigin: "center bottom",
            }}
          />
        ))}
      </div>
      {/* Keyframes once per page render */}
      <style>{`
        @keyframes loading-wave {
          0%, 40%, 100% { transform: scaleY(0.35); opacity: 0.7; }
          20% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
