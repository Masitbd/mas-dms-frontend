import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import { Product } from "./SalesTypes";
import {
  money,
  useDebouncedValue,
  useOnClickOutside,
} from "@/components/sales-v2/SalesHelpe";
import { Input, InputGroup } from "rsuite";
import { Search, X } from "lucide-react";

/* ============================================================
 * PRODUCT SEARCH COMBOBOX (Debounced + Keyboard)
 * - Uses API type: Product = { medicine, availableStocks[] }
 * - Shows available qty (can be passed from parent to subtract cart-reserved)
 * - LIFO display rate from latest stock (createdAt/updatedAt)
 * - Robust against unstable searchProducts prop (uses ref)
 * ============================================================
 */

function safeNum(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function findLifoStock(stocks: Product["availableStocks"]) {
  if (!stocks || stocks.length === 0) return null;

  let best = stocks[0];
  let bestTime = Date.parse(best.createdAt || best.updatedAt || "") || 0;

  for (let i = 1; i < stocks.length; i++) {
    const s = stocks[i];
    const t = Date.parse(s.createdAt || s.updatedAt || "") || 0;
    if (t > bestTime) {
      best = s;
      bestTime = t;
    }
  }
  return best;
}

function fallbackAvailableQty(p: Product) {
  const stocks = p.availableStocks || [];
  return stocks.reduce(
    (sum, s) => sum + Math.max(safeNum(s.currentQuantity, 0), 0),
    0
  );
}

export function ProductSearchCombobox(props: {
  open: boolean;
  setOpen: (v: boolean) => void;

  query: string;
  setQuery: (v: string) => void;

  results: Product[];
  setResults: (v: Product[]) => void;

  // parent can pass RTK query flags; we still accept setLoading for compatibility
  loading: boolean;
  setLoading: (v: boolean) => void;

  highlightIndex: number;
  setHighlightIndex: (v: number) => void;

  // IMPORTANT: can be unstable, we guard via ref to prevent infinite loops
  searchProducts: (query: string) => Promise<Product[]>;

  // select full item
  onSelect: (p: Product) => void;

  // focus control
  inputRef: React.RefObject<HTMLInputElement | null>;

  // ✅ provide this from SalesPage to show true available (after cart reservation)
  getAvailableQty?: (p: Product) => number;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebouncedValue(props.query, 250);

  // guard against unstable function props causing continuous searching
  const searchFnRef = useRef(props.searchProducts);
  useEffect(() => {
    searchFnRef.current = props.searchProducts;
  }, [props.searchProducts]);

  const reqIdRef = useRef(0);

  useOnClickOutside(boxRef as any, () => props.setOpen(false), props.open);

  const getAvail = useMemo(() => {
    return (p: Product) => {
      const v = props.getAvailableQty
        ? props.getAvailableQty(p)
        : fallbackAvailableQty(p);
      return Math.max(safeNum(v, 0), 0);
    };
  }, [props.getAvailableQty]);

  const findFirstEnabledIndex = (rows: Product[]) => {
    for (let i = 0; i < rows.length; i++) {
      if (getAvail(rows[i]) > 0) return i;
    }
    return 0;
  };

  const moveHighlight = (dir: 1 | -1) => {
    const n = props.results.length;
    if (n === 0) return;

    let idx = props.highlightIndex;
    for (let step = 0; step < n; step++) {
      idx = (idx + dir + n) % n;
      if (getAvail(props.results[idx]) > 0) {
        props.setHighlightIndex(idx);
        return;
      }
    }

    // if all disabled, keep current
  };

  // Fetch (debounced) when open + query changes
  useEffect(() => {
    if (!props.open) return;

    const q = String(debouncedQuery ?? "").trim();

    // ✅ no query => stop churn, clear list
    if (!q) {
      reqIdRef.current += 1; // invalidate in-flight requests
      props.setLoading(false);
      props.setResults([]);
      props.setHighlightIndex(0);
      return;
    }

    const myId = ++reqIdRef.current;
    props.setLoading(true);

    searchFnRef
      .current(q)
      .then((rows) => {
        if (reqIdRef.current !== myId) return;
        const safeRows = Array.isArray(rows) ? rows : [];
        props.setResults(safeRows);
        props.setHighlightIndex(findFirstEnabledIndex(safeRows));
      })
      .catch(() => {
        if (reqIdRef.current !== myId) return;
        props.setResults([]);
        props.setHighlightIndex(0);
      })
      .finally(() => {
        if (reqIdRef.current !== myId) return;
        props.setLoading(false);
      });
    // intentionally NOT depending on props.searchProducts (handled via ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, debouncedQuery]);

  // Keep highlight in range
  useEffect(() => {
    if (!props.open) return;
    if (props.results.length === 0) {
      props.setHighlightIndex(0);
      return;
    }
    if (props.highlightIndex < 0) props.setHighlightIndex(0);
    if (props.highlightIndex >= props.results.length) {
      props.setHighlightIndex(props.results.length - 1);
    }
  }, [
    props.open,
    props.results.length,
    props.highlightIndex,
    props.setHighlightIndex,
  ]);

  // Ensure highlighted item stays visible
  useEffect(() => {
    if (!props.open) return;
    const id = `product_opt_${props.highlightIndex}`;
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "nearest" });
  }, [props.open, props.highlightIndex]);

  const runImmediateSearch = async () => {
    const q = String(props.query ?? "").trim();
    if (!q) {
      props.setResults([]);
      props.setHighlightIndex(0);
      props.setLoading(false);
      return;
    }

    const myId = ++reqIdRef.current;
    props.setLoading(true);
    try {
      const rows = await searchFnRef.current(q);
      if (reqIdRef.current !== myId) return;
      const safeRows = Array.isArray(rows) ? rows : [];
      props.setResults(safeRows);
      props.setHighlightIndex(findFirstEnabledIndex(safeRows));
    } catch {
      if (reqIdRef.current !== myId) return;
      props.setResults([]);
      props.setHighlightIndex(0);
    } finally {
      if (reqIdRef.current !== myId) return;
      props.setLoading(false);
    }
  };

  const handleSelectHighlighted = () => {
    if (!props.open) return;
    const p = props.results[props.highlightIndex];
    if (!p) return;

    // prevent selecting out-of-stock
    if (getAvail(p) <= 0) return;
    console.log(p);

    props.onSelect(p);
  };

  return (
    <div ref={boxRef} className="relative">
      <InputGroup inside className="rounded-xl">
        <Input
          inputRef={(el) => {
            props.inputRef.current = el;
          }}
          value={props.query}
          onChange={(v) => {
            props.setQuery(String(v));
            if (!props.open) props.setOpen(true);
          }}
          placeholder="Type medicine name / id…"
          className="rounded-xl"
          onFocus={() => props.setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                return;
              }
              moveHighlight(1);
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                return;
              }
              moveHighlight(-1);
            }

            if (e.key === "Enter") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                runImmediateSearch();
                return;
              }
              handleSelectHighlighted();
            }

            if (e.key === "Escape") {
              e.preventDefault();
              props.setOpen(false);
            }
          }}
        />
        <InputGroup.Button
          onClick={() => {
            props.setOpen(true);
            runImmediateSearch();
          }}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </InputGroup.Button>
      </InputGroup>

      {/* DROPDOWN */}
      {props.open ? (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs text-slate-500">
            <span>{props.loading ? "Searching…" : "Use ↑ ↓ and Enter"}</span>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-50"
              onClick={() => props.setOpen(false)}
            >
              <X className="h-3.5 w-3.5" />
              Close
            </button>
          </div>

          <div className="max-h-60 overflow-auto">
            {props.results.length === 0 && !props.loading ? (
              <div className="px-3 py-3 text-sm text-slate-600">
                No medicines found.
              </div>
            ) : null}

            {props.results.map((p, idx) => {
              const active = idx === props.highlightIndex;
              const avail = getAvail(p);
              const disabled = avail <= 0;

              const lifo = findLifoStock(p.availableStocks || []);
              const lifoRate = lifo ? safeNum(lifo.salesRate, 0) : 0;

              return (
                <div
                  key={p.medicine._id}
                  id={`product_opt_${idx}`}
                  className={[
                    "px-3 py-2",
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer",
                    active ? "bg-slate-900 text-white" : "hover:bg-slate-50",
                  ].join(" ")}
                  onMouseEnter={() => props.setHighlightIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (disabled) return;
                    props.onSelect(p);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {p.medicine.name}
                        <span
                          className={[
                            "ml-2 text-xs",
                            active ? "text-white/80" : "text-slate-500",
                          ].join(" ")}
                        >
                          ({p.medicine.medicineId})
                        </span>
                      </div>

                      <div
                        className={[
                          "mt-0.5 text-xs",
                          active ? "text-white/80" : "text-slate-500",
                        ].join(" ")}
                      >
                        Disc: {safeNum(p.medicine.discount, 0)}% • VAT:{" "}
                        {safeNum(p.medicine.vat, 0)}%
                        {p.medicine.unit ? ` • Unit: ${p.medicine.unit}` : ""}
                        {lifo?.batchNo ? ` • Batch: ${lifo.batchNo}` : ""}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={[
                          "text-sm font-semibold",
                          active ? "text-white" : "text-slate-900",
                        ].join(" ")}
                      >
                        {money(lifoRate)}
                      </div>
                      <div
                        className={[
                          "mt-0.5 text-xs",
                          active ? "text-white/80" : "text-slate-500",
                        ].join(" ")}
                      >
                        Avl: {avail}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
