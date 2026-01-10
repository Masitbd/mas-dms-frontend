import { useEffect, useState } from "react";
import {
  AvailableStockDoc,
  CustomerInfo,
  CustomerMode,
  LineItem,
  PaymentMethod,
  SalesPayload,
  SalesUser,
} from "./SalesTypes";

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

// LIFO sort: most recent stock first
export function sortStocksLIFO(stocks: AvailableStockDoc[]) {
  return [...stocks].sort((a, b) => {
    const da = Date.parse(a.createdAt || a.updatedAt || "");
    const db = Date.parse(b.createdAt || b.updatedAt || "");
    return (Number.isFinite(db) ? db : 0) - (Number.isFinite(da) ? da : 0);
  });
}
// financial helper
export function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function safeNum(n: any, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

export const calcMaxQtyForLine = (all: LineItem[], li: LineItem) => {
  // total reserved in this batch across cart
  const reservedTotal = all
    .filter((x) => x.stockId === li.stockId)
    .reduce((s, x) => s + safeNum(x.qty, 0), 0);

  // reserved by other rows (exclude this row's own qty)
  const reservedOther = reservedTotal - safeNum(li.qty, 0);

  const batchTotal = Math.max(safeNum(li.stockCurrentQty, 0), 0);
  const maxForThisRow = Math.max(batchTotal - reservedOther, 0);

  return maxForThisRow;
};

export function buildSalesPayload(args: {
  customerMode: CustomerMode;
  customer: CustomerInfo;
  lineItems: LineItem[];

  // finance inputs from state
  paymentMethod: PaymentMethod;
  extraDiscount: number; // already committed number (not draft string)
  paid: number; // already committed number (not draft string)

  // computed numbers (use your existing memos)
  total: number;
  vat: number;
  adjustment: number;
  netPayable: number;
  due: number;
  totalDiscount: number;
}): SalesPayload {
  const { customerMode, customer, lineItems } = args;

  // ---- hard validation (no silent corruption) ----
  if (!Array.isArray(lineItems) || lineItems.length === 0) {
    throw new Error("Cannot submit: no products added.");
  }

  if (
    customerMode === "registered" &&
    !String(customer.customerId ?? "").trim()
  ) {
    throw new Error("Cannot submit: registered customer must be selected.");
  }

  // indoor required fields
  if (customer.patientType === "indoor") {
    if (!String(customer.bedNo ?? "").trim())
      throw new Error("Cannot submit: Bed No is required for indoor.");
    if (!String(customer.indoorBillNo ?? "").trim())
      throw new Error("Cannot submit: Indoor Bill No is required for indoor.");
  }

  // basic customer requirements for invoice snapshot
  if (!String(customer.name ?? "").trim())
    throw new Error("Cannot submit: customer name is required.");
  if (!String(customer.contactNo ?? "").trim())
    throw new Error("Cannot submit: customer contact no is required.");

  // paid cannot exceed due-before-payment (netPayable)
  const paid = round2(clamp(safeNum(args.paid, 0), 0, args.netPayable));
  const extraDiscount = round2(
    clamp(safeNum(args.extraDiscount, 0), 0, args.total)
  );

  const items = lineItems.map((li) => {
    const qty = safeNum(li.qty, NaN);
    const rate = safeNum(li.rate, NaN);

    if (!Number.isFinite(qty) || qty <= 0)
      throw new Error(`Invalid qty for item ${li.name} (${li.batchNo}).`);
    if (!Number.isFinite(rate) || rate < 0)
      throw new Error(`Invalid rate for item ${li.name} (${li.batchNo}).`);

    const discountPct = clamp(safeNum(li.discountPct, 0), 0, 100);
    const vatPct = clamp(safeNum(li.vatPct, 0), 0, 100);

    // stockId/batch are mandatory in your design
    if (!String(li.stockId ?? "").trim())
      throw new Error(`Missing stockId for ${li.name}.`);
    if (!String(li.batchNo ?? "").trim())
      throw new Error(`Missing batchNo for ${li.name}.`);

    return {
      medicineObjectId: String(li.medicineObjectId),
      stockId: String(li.stockId),
      batchNo: String(li.batchNo),
      expiryDate: String(li.expiryDate),

      qty: round2(qty),
      rate: round2(rate),

      discountPct: round2(discountPct),
      vatPct: round2(vatPct),
    };
  });

  return {
    customerMode,
    customer: {
      ...customer,
      // normalize optional fields
      bedNo: customer.patientType === "indoor" ? customer.bedNo ?? "" : "",
      indoorBillNo:
        customer.patientType === "indoor" ? customer.indoorBillNo ?? "" : "",
      mode: customerMode,
    },
    items,
    finance: {
      extraDiscount,
      paymentMethod: args.paymentMethod,
      paid,
    },
    summary: {
      total: round2(args.total),
      vat: round2(args.vat),
      adjustment: round2(args.adjustment),
      netPayable: round2(args.netPayable),
      due: round2(Math.max(args.netPayable - paid, 0)),
      totalDiscount: round2(args.totalDiscount),
    },
  };
}

/** Generic sender (works with RTK Query .unwrap() OR plain fetch wrapper) */
export async function sendSaleToServer(params: {
  mode: "create" | "edit";
  saleId?: string;

  build: () => SalesPayload;

  // Option A (recommended): RTK Query mutation callers
  createFn?: (payload: any) => { unwrap: () => Promise<any> };
  updateFn?: (args: { saleId: string; payload: any }) => {
    unwrap: () => Promise<any>;
  };

  // Option B: fallback fetch URL if you don’t have mutations yet
  fetchUrl?: string; // e.g. "/api/sales"
  fetchEditUrl?: (saleId: string) => string; // e.g. (id)=>`/api/sales/${id}`
}): Promise<any> {
  const payload = params.build();

  console.log(params.saleId, "Sale id");
  // ---- RTK Query path ----
  if (params.mode === "create" && params.createFn) {
    return await params.createFn(payload).unwrap();
  }

  if (params.mode === "edit") {
    if (!params.saleId) throw new Error("Missing saleId for edit mode.");
    if (params.updateFn) {
      return await params.updateFn({ saleId: params.saleId, payload }).unwrap();
    }
  }

  // ---- fetch fallback path ----
  if (!params.fetchUrl) {
    throw new Error(
      "No createFn/updateFn provided and no fetchUrl fallback configured."
    );
  }

  const url =
    params.mode === "edit"
      ? params.fetchEditUrl
        ? params.fetchEditUrl(String(params.saleId))
        : `${params.fetchUrl}/${params.saleId}`
      : params.fetchUrl;

  const res = await fetch(url, {
    method: params.mode === "edit" ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Server error (${res.status})`);
  }

  return await res.json().catch(() => ({}));
}
