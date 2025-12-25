/* ============================================================
 * 14) PRODUCT QUICK ENTRY ROW
 *    - Search bar (debounced) + Qty + Rate + Add
 * ============================================================
 */

import { useEffect, useRef } from "react";
import { Product } from "./SalesTypes";
import { ProductSearchCombobox } from "./ProductSearchCombobox";
import { Button, Input } from "rsuite";

export function ProductQuickEntryRow(props: {
  productSearchOpen: boolean;
  setProductSearchOpen: (v: boolean) => void;
  productSearchQuery: string;
  setProductSearchQuery: (v: string) => void;
  productSearchResults: Product[];
  setProductSearchResults: (v: Product[]) => void;
  productSearchLoading: boolean;
  setProductSearchLoading: (v: boolean) => void;
  productSearchHighlight: number;
  setProductSearchHighlight: (v: number) => void;

  pickedProduct: Product | null;

  qtyDraft: string;
  setQtyDraft: (v: string) => void;
  rateDraft: string;
  setRateDraft: (v: string) => void;

  focusQtyKey: number;
  focusSearchKey: number;

  searchProducts: (query: string) => Promise<Product[]>;
  onSelectProduct: (p: Product) => void;
  onAddRequested: () => void;
  setProductRowError: (v: string | null) => void;
}) {
  const qtyRef = useRef<HTMLInputElement | null>(null);
  const rateRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (props.focusQtyKey <= 0) return;
    window.setTimeout(() => qtyRef.current?.focus(), 0);
  }, [props.focusQtyKey]);

  useEffect(() => {
    if (props.focusSearchKey <= 0) return;
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [props.focusSearchKey]);

  const canAdd = !!props.pickedProduct;

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
      {/* SEARCH */}
      <div className="md:col-span-6">
        <div className="mb-1 text-xs font-medium text-slate-600">
          Search Product
        </div>
        <ProductSearchCombobox
          open={props.productSearchOpen}
          setOpen={props.setProductSearchOpen}
          query={props.productSearchQuery}
          setQuery={props.setProductSearchQuery}
          results={props.productSearchResults}
          setResults={props.setProductSearchResults}
          loading={props.productSearchLoading}
          setLoading={props.setProductSearchLoading}
          highlightIndex={props.productSearchHighlight}
          setHighlightIndex={props.setProductSearchHighlight}
          searchProducts={props.searchProducts}
          onSelect={(p) => {
            props.onSelectProduct(p);
            props.setProductRowError(null);
          }}
          inputRef={searchInputRef}
        />
      </div>

      {/* QTY */}
      <div className="md:col-span-2">
        <div className="mb-1 text-xs font-medium text-slate-600">Qty</div>
        <Input
          inputRef={(el) => {
            qtyRef.current = el;
          }}
          value={props.qtyDraft}
          onChange={(v) => props.setQtyDraft(String(v))}
          placeholder="0"
          disabled={!canAdd}
          className="rounded-xl"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              props.onAddRequested();
            }
          }}
        />
      </div>

      {/* RATE */}
      <div className="md:col-span-2">
        <div className="mb-1 text-xs font-medium text-slate-600">Rate</div>
        <Input
          inputRef={(el) => {
            rateRef.current = el;
          }}
          value={props.rateDraft}
          onChange={(v) => props.setRateDraft(String(v))}
          placeholder="0"
          disabled={!canAdd}
          className="rounded-xl"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              props.onAddRequested();
            }
          }}
        />
      </div>

      {/* ADD */}
      <div className="md:col-span-2">
        <div className="mb-1 text-xs font-medium text-slate-600">&nbsp;</div>
        <Button
          appearance="primary"
          className="w-full rounded-xl"
          disabled={!canAdd}
          onClick={() => props.onAddRequested()}
        >
          Add
        </Button>
      </div>

      {props.pickedProduct ? (
        <div className="md:col-span-12">
          <div className="mt-1 text-xs text-slate-600">
            Selected:{" "}
            <span className="font-medium text-slate-900">
              {props.pickedProduct.name}
            </span>
            {props.pickedProduct.sku ? (
              <span className="ml-2 text-slate-500">
                ({props.pickedProduct.sku})
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
