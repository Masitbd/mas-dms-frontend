/* ============================================================
 * 13) PRODUCT TABLE PANEL (ENTRY ROW + TABLE)
 * ============================================================
 */

import { Button, Divider, Message, Panel } from "rsuite";
import { LineItem, Product } from "./SalesTypes";
import { Search } from "lucide-react";
import { ProductQuickEntryRow } from "./ProductQuickEntryRow";
import { ProductLineItemsTable } from "./ProductLineItemsTable";

export function ProductTablePanel(props: {
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
  setPickedProduct: (p: Product | null) => void;
  qtyDraft: string;
  setQtyDraft: (v: string) => void;
  rateDraft: string;
  setRateDraft: (v: string) => void;

  productRowError: string | null;
  setProductRowError: (v: string | null) => void;

  focusQtyKey: number;
  focusSearchKey: number;

  lineItems: LineItem[];
  onRemoveLine: (lineId: string) => void;

  searchProducts: (query: string) => Promise<Product[]>;
  onSelectProduct: (p: Product) => void;
  onAddRequested: () => void;
  onClearEntry: () => void;

  // changing quantity
  onIncQty: (lineId: string) => void;
  onDecQty: (lineId: string) => void;
  qtyEdits: Record<string, string>;
  onQtyDraftChange: (lineId: string, v: string) => void;
  onQtyCommit: (lineId: string) => void;
}) {
  const header = (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-base font-semibold text-slate-900">Products</div>
        <div className="text-xs text-slate-500">
          Search → Qty → Enter to add
        </div>
      </div>

      <Button
        appearance="ghost"
        size="sm"
        onClick={() => {
          props.onClearEntry();
          props.setProductSearchOpen(true);
          props.setProductRowError(null);
        }}
      >
        <span className="inline-flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </span>
      </Button>
    </div>
  );

  return (
    <Panel
      bordered
      className="w-full rounded-2xl border-slate-200 bg-white"
      header={header}
    >
      {props.productRowError ? (
        <div className="mb-3">
          <Message
            type="warning"
            closable
            onClose={() => props.setProductRowError(null)}
          >
            {props.productRowError}
          </Message>
        </div>
      ) : null}

      {/* TOP ENTRY ROW */}
      <ProductQuickEntryRow
        productSearchOpen={props.productSearchOpen}
        setProductSearchOpen={props.setProductSearchOpen}
        productSearchQuery={props.productSearchQuery}
        setProductSearchQuery={(v) => {
          // Editing search should clear selected product if it diverges
          if (props.pickedProduct && v.trim() !== props.pickedProduct.name) {
            props.setPickedProduct(null);
            props.setRateDraft("");
          }
          props.setProductSearchQuery(v);
        }}
        productSearchResults={props.productSearchResults}
        setProductSearchResults={props.setProductSearchResults}
        productSearchLoading={props.productSearchLoading}
        setProductSearchLoading={props.setProductSearchLoading}
        productSearchHighlight={props.productSearchHighlight}
        setProductSearchHighlight={props.setProductSearchHighlight}
        pickedProduct={props.pickedProduct}
        qtyDraft={props.qtyDraft}
        setQtyDraft={props.setQtyDraft}
        rateDraft={props.rateDraft}
        setRateDraft={props.setRateDraft}
        focusQtyKey={props.focusQtyKey}
        focusSearchKey={props.focusSearchKey}
        searchProducts={props.searchProducts}
        onSelectProduct={props.onSelectProduct}
        onAddRequested={props.onAddRequested}
        setProductRowError={props.setProductRowError}
      />

      <Divider className="my-3" />

      {/* TABLE */}
      <ProductLineItemsTable
        lineItems={props.lineItems}
        onRemoveLine={props.onRemoveLine}
        onIncQty={props.onIncQty}
        onDecQty={props.onDecQty}
        qtyEdits={props.qtyEdits}
        onQtyDraftChange={props.onQtyDraftChange}
        onQtyCommit={props.onQtyCommit}
      />
    </Panel>
  );
}
