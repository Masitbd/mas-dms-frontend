import type { AvailableStockDoc, LineItem, SalesUser } from "./SalesTypes";

export function safeNum(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function money(n: number) {
  const x = safeNum(n, 0);
  return x.toFixed(2);
}

export function discountMaxPct(user: SalesUser, defaultLimitPct: number) {
  const base = clamp(safeNum(defaultLimitPct, 0), 0, 100);
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
  const pct = clamp(safeNum(args.discountPct, 0), 0, maxPct);

  const gross = qty * rate;
  const disc = (gross * pct) / 100;
  const net = gross - disc;

  return { gross, discountPctApplied: pct, discountAmount: disc, net, maxPct };
}

export function sortStocksLIFO(stocks: AvailableStockDoc[]) {
  return [...(stocks || [])].sort((a, b) => {
    const ta = Date.parse(a.createdAt || a.updatedAt || "") || 0;
    const tb = Date.parse(b.createdAt || b.updatedAt || "") || 0;
    return tb - ta;
  });
}

export function reservedByStockId(lines: LineItem[]) {
  const m: Record<string, number> = {};
  for (const li of lines)
    m[li.stockId] = (m[li.stockId] ?? 0) + safeNum(li.qty, 0);
  return m;
}

/** Max qty for this row within its batch (subtract other rows reserving same stockId) */
export function maxQtyForLine(all: LineItem[], li: LineItem) {
  const reservedTotal = all
    .filter((x) => x.stockId === li.stockId)
    .reduce((s, x) => s + safeNum(x.qty, 0), 0);

  const reservedOther = reservedTotal - safeNum(li.qty, 0);
  const batchTotal = Math.max(safeNum(li.stockCurrentQty, 0), 0);
  return Math.max(batchTotal - reservedOther, 0);
}

/** Financial summary (VAT per line percent, extra discount allocated proportionally) */
export function computeFinancial(lines: LineItem[], extraDiscount: number) {
  const total = round2(lines.reduce((s, li) => s + safeNum(li.amount, 0), 0));
  const extra = round2(clamp(safeNum(extraDiscount, 0), 0, total));

  // VAT proportional allocation to respect per-line vatPct
  let vatSum = 0;
  const subtotal = total;

  for (const li of lines) {
    const net = safeNum(li.amount, 0);
    const share = subtotal > 0 ? net / subtotal : 0;
    const netAfterExtra = Math.max(net - extra * share, 0);
    const vatPct = clamp(safeNum(li.vatPct, 0), 0, 100);
    vatSum += (netAfterExtra * vatPct) / 100;
  }

  const vat = round2(vatSum);

  const netPayableRaw = Math.max(total - extra, 0) + vat;
  const adjustment = round2(round2(netPayableRaw) - netPayableRaw);
  const netPayable = round2(netPayableRaw + adjustment);

  return { total, vat, extraDiscount: extra, adjustment, netPayable };
}
