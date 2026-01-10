"use client";

import { useMemo, useRef, useState } from "react";
import { Button, Panel } from "rsuite";
import { PlusCircle } from "lucide-react";
import {
  addFromSelection,
  decLineQty,
  incLineQty,
  removeLine,
  selectLines,
  setLineDiscountPct,
  setLineQty,
  selectSalesDraft,
} from "@/redux/features/sales/salesDraftSlice";
import type { Product } from "./SalesTypes";
import { maxQtyForLine, money, safeNum } from "./SalesHelper";

// ✅ your RTK Query hook (adjust import path to your actual api file)
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useLazyGetMedicineForSalesQuery } from "@/redux/api/medicines/medicine.api";
import { ProductSearchCombobox } from "./ProductSearchCombobox";
import { ProductLineItemsTable } from "./ProductLineItemsTable";

export function ProductModule() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectLines);
  const draft = useAppSelector(selectSalesDraft);

  const [
    searchMedicine,
    { isLoading: isLoadingMedicine, isFetching: isFetchingMedicine },
  ] = useLazyGetMedicineForSalesQuery();

  // UI-only state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const [pickedProduct, setPickedProduct] = useState<Product | null>(null);
  const [qtyDraft, setQtyDraft] = useState("");
  const [rateDraft, setRateDraft] = useState("");

  const [qtyEdits, setQtyEdits] = useState<Record<string, string>>({});
  const [discountEdits, setDiscountEdits] = useState<Record<string, string>>(
    {}
  );

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const qtyInputRef = useRef<HTMLInputElement | null>(null);

  const loading = isLoadingMedicine || isFetchingMedicine;

  const searchProducts = useMemo(() => {
    return async (q: string): Promise<Product[]> => {
      const term = String(q ?? "").trim();
      if (!term) return [];
      const res = await searchMedicine({ searchTerm: term }).unwrap();
      return (res ?? []) as Product[];
    };
  }, [searchMedicine]);

  const getAvailableQty = useMemo(() => {
    // available qty = sum(batch current - reserved)
    return (p: Product) => {
      const byStock: Record<string, number> = {};
      for (const li of lines)
        byStock[li.stockId] = (byStock[li.stockId] ?? 0) + safeNum(li.qty, 0);

      return (p.availableStocks || []).reduce((s, st) => {
        const reserved = byStock[st._id] ?? 0;
        return s + Math.max(safeNum(st.currentQuantity, 0) - reserved, 0);
      }, 0);
    };
  }, [lines]);

  const focusQtyHard = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        qtyInputRef.current?.focus();
        qtyInputRef.current?.select?.();
      });
    });
  };

  const onSelect = (p: Product) => {
    setPickedProduct(p);
    setQuery(p.medicine.name); // ✅ keep selected visible
    setOpen(false);

    // default rate from newest batch (LIFO top)
    const lifo = [...(p.availableStocks || [])].sort((a, b) => {
      const ta = Date.parse(a.createdAt || a.updatedAt || "") || 0;
      const tb = Date.parse(b.createdAt || b.updatedAt || "") || 0;
      return tb - ta;
    })[0];
    setRateDraft(String(lifo?.salesRate ?? ""));

    setQtyDraft("");
    setTimeout(() => focusQtyHard(), 0);
  };

  const onAdd = () => {
    if (!pickedProduct) return;

    const qty = safeNum(qtyDraft, NaN);
    if (!Number.isFinite(qty) || qty <= 0) return;

    const rateOv =
      String(rateDraft).trim() === "" ? null : safeNum(rateDraft, null as any);

    dispatch(
      addFromSelection({
        selected: pickedProduct,
        requestedQty: qty,
        rateOverride: rateOv,
      })
    );

    // reset UI for next entry
    setPickedProduct(null);
    setQuery("");
    setResults([]);
    setHighlightIndex(0);
    setQtyDraft("");
    setRateDraft("");
    setOpen(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select?.();
    }, 0);
  };

  return (
    <Panel bordered className="w-full rounded-2xl border-slate-200 bg-white">
      <div className="text-base font-semibold text-slate-900">Products</div>

      <div className="mt-3 grid grid-cols-12 gap-2">
        <div className="col-span-6">
          <ProductSearchCombobox
            open={open}
            setOpen={setOpen}
            query={query}
            setQuery={(v) => {
              const next = String(v);

              // ✅ clear selection only if user edits away from selected medicine name
              if (
                pickedProduct &&
                next.trim() !== pickedProduct.medicine.name
              ) {
                setPickedProduct(null);
                setRateDraft("");
              }

              setQuery(next);
              if (!open) setOpen(true);
            }}
            results={results}
            setResults={setResults}
            loading={loading}
            setLoading={() => {}} // ignored (loading comes from RTK)
            highlightIndex={highlightIndex}
            setHighlightIndex={setHighlightIndex}
            searchProducts={searchProducts}
            onSelect={onSelect}
            inputRef={searchInputRef}
            getAvailableQty={getAvailableQty}
          />
        </div>

        <div className="col-span-2">
          <div className="text-xs text-slate-600 mb-1">Qty</div>
          <input
            ref={qtyInputRef}
            value={qtyDraft}
            onChange={(e) => setQtyDraft(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="0"
            inputMode="decimal"
            disabled={!pickedProduct}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd();
              }
            }}
          />
        </div>

        <div className="col-span-2">
          <div className="text-xs text-slate-600 mb-1">Rate</div>
          <input
            value={rateDraft}
            onChange={(e) => setRateDraft(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="auto"
            inputMode="decimal"
            disabled={!pickedProduct}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                focusQtyHard();
              }
            }}
          />
        </div>

        <div className="col-span-2 flex items-end">
          <Button
            appearance="primary"
            block
            disabled={!pickedProduct}
            onClick={onAdd}
            className="rounded-xl"
          >
            <span className="inline-flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add
            </span>
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <ProductLineItemsTable
          lines={lines}
          qtyEdits={qtyEdits}
          setQtyEdits={setQtyEdits}
          discountEdits={discountEdits}
          setDiscountEdits={setDiscountEdits}
          user={draft.user}
          onRemove={(id) => dispatch(removeLine(id))}
          onIncQty={(id) => dispatch(incLineQty(id))}
          onDecQty={(id) => dispatch(decLineQty(id))}
          onCommitQty={(id, qty) => dispatch(setLineQty({ lineId: id, qty }))}
          onCommitDiscount={(id, pct) =>
            dispatch(setLineDiscountPct({ lineId: id, discountPct: pct }))
          }
          getMaxQty={(li) => maxQtyForLine(lines, li)}
        />
      </div>
    </Panel>
  );
}
