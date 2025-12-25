import { useEffect, useRef } from "react";
import { Product } from "./SalesTypes";
import { money, useDebouncedValue, useOnClickOutside } from "./SalesHelpe";
import { Input, InputGroup } from "rsuite";
import { Search, X } from "lucide-react";

/* ============================================================
 * 15) PRODUCT SEARCH COMBOBOX (Debounced + Keyboard)
 *    - Arrow up/down to highlight
 *    - Enter to select
 *    - Esc to close
 *    - Debounced search + manual Search button
 * ============================================================
 */
export function ProductSearchCombobox(props: {
  open: boolean;
  setOpen: (v: boolean) => void;

  query: string;
  setQuery: (v: string) => void;

  results: Product[];
  setResults: (v: Product[]) => void;

  loading: boolean;
  setLoading: (v: boolean) => void;

  highlightIndex: number;
  setHighlightIndex: (v: number) => void;

  searchProducts: (query: string) => Promise<Product[]>;
  onSelect: (p: Product) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebouncedValue(props.query, 250);
  const reqIdRef = useRef(0);

  useOnClickOutside(boxRef as any, () => props.setOpen(false), props.open);

  // Fetch (debounced) when open + query changes
  useEffect(() => {
    if (!props.open) return;

    const myId = ++reqIdRef.current;
    props.setLoading(true);

    props
      .searchProducts(debouncedQuery)
      .then((rows) => {
        if (reqIdRef.current !== myId) return;
        props.setResults(rows);
        props.setHighlightIndex(0);
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
  }, [
    props.open,
    debouncedQuery,
    props.searchProducts,
    props.setResults,
    props.setLoading,
    props.setHighlightIndex,
  ]);

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
    const myId = ++reqIdRef.current;
    props.setLoading(true);
    try {
      const rows = await props.searchProducts(props.query);
      if (reqIdRef.current !== myId) return;
      props.setResults(rows);
      props.setHighlightIndex(0);
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
          placeholder="Type name or SKU…"
          className="rounded-xl"
          onFocus={() => props.setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                return;
              }
              if (props.results.length === 0) return;
              props.setHighlightIndex(
                (props.highlightIndex + 1) % props.results.length
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                return;
              }
              if (props.results.length === 0) return;
              props.setHighlightIndex(
                (props.highlightIndex - 1 + props.results.length) %
                  props.results.length
              );
            }

            if (e.key === "Enter") {
              e.preventDefault();
              if (!props.open) {
                props.setOpen(true);
                runImmediateSearch();
                return;
              }
              // if open => select highlighted
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
                No products found.
              </div>
            ) : null}

            {props.results.map((p, idx) => {
              const active = idx === props.highlightIndex;
              return (
                <div
                  key={p.id}
                  id={`product_opt_${idx}`}
                  className={[
                    "cursor-pointer px-3 py-2",
                    active ? "bg-slate-900 text-white" : "hover:bg-slate-50",
                  ].join(" ")}
                  onMouseEnter={() => props.setHighlightIndex(idx)}
                  onMouseDown={(e) => {
                    // prevent blur before select
                    e.preventDefault();
                    props.onSelect(p);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div
                        className={[
                          "mt-0.5 text-xs",
                          active ? "text-white/80" : "text-slate-500",
                        ].join(" ")}
                      >
                        {p.sku ? `SKU: ${p.sku}` : "SKU: —"}{" "}
                        {p.unit ? ` • Unit: ${p.unit}` : ""}
                      </div>
                    </div>

                    <div
                      className={[
                        "text-sm font-semibold",
                        active ? "text-white" : "text-slate-900",
                      ].join(" ")}
                    >
                      {money(p.defaultRate)}
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
