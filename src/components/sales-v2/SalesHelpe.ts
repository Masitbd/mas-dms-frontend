import { useEffect, useState } from "react";
import { SalesUser } from "./SalesTypes";

export function money(n: number) {
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  onOutside: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      onOutside();
    };

    document.addEventListener("mousedown", handler, true);
    document.addEventListener("touchstart", handler, true);

    return () => {
      document.removeEventListener("mousedown", handler, true);
      document.removeEventListener("touchstart", handler, true);
    };
  }, [ref, onOutside, enabled]);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function discountMaxPct(user: SalesUser, defaultLimitPct: number) {
  const base = clamp(
    Number.isFinite(defaultLimitPct) ? defaultLimitPct : 0,
    0,
    100
  );
  return user.role === "admin" ? 100 : base;
}

export function calcNetAmount(args: {
  user: SalesUser;
  qty: number;
  rate: number;
  discountPct: number;
  discountDefaultLimitPct: number;
}) {
  const qty = Number.isFinite(args.qty) ? args.qty : 0;
  const rate = Number.isFinite(args.rate) ? args.rate : 0;

  const maxPct = discountMaxPct(args.user, args.discountDefaultLimitPct);
  const pct = clamp(
    Number.isFinite(args.discountPct) ? args.discountPct : 0,
    0,
    maxPct
  );

  const gross = qty * rate;
  const disc = (gross * pct) / 100;
  const net = gross - disc;

  return { gross, discountPctApplied: pct, discountAmount: disc, net, maxPct };
}

// financial helper
export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function safeNum(n: any, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}
