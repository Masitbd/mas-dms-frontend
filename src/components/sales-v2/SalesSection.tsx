/* ============================================================
 * 11) SALES SECTION (CONTAINER)
 * ============================================================
 */

import { FinancialDemoPanel } from "./FinancialDemo";
import { ProductTablePanel } from "./ProductTablePanel";
import {
  LineItem,
  MedicineSalesSearchItem,
  PaymentMethod,
  Product,
} from "./SalesTypes";

export function SalesSection(props: {
  // product ui state
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

  // picked + drafts
  pickedProduct: Product | null;
  setPickedProduct: (p: Product | null) => void;
  qtyDraft: string;
  setQtyDraft: (v: string) => void;
  rateDraft: string;
  setRateDraft: (v: string) => void;

  // errors
  productRowError: string | null;
  setProductRowError: (v: string | null) => void;

  // focus
  focusQtyKey: number;
  focusSearchKey: number;

  // business
  lineItems: LineItem[];
  onRemoveLine: (lineId: string) => void;

  // actions
  searchProducts: (query: string) => Promise<Product[]>;
  onSelectProduct: (p: Product) => void;
  onAddRequested: () => void;
  onResetAll: () => void;
  onClearEntry: () => void;

  // Quantity Increase or decrease
  onIncQty: (lineId: string) => void;
  onDecQty: (lineId: string) => void;
  qtyEdits: Record<string, string>;
  onQtyDraftChange: (lineId: string, v: string) => void;
  onQtyCommit: (lineId: string) => void;
  // setQtyEdits: (product: Record<string, string>) => void;

  // financial demo
  total: number;
  vat: number;
  totalDiscount: number;
  adjustment: number;
  netPayable: number;

  extraDiscountDraft: string;
  setExtraDiscountDraft: (v: string) => void;
  onCommitExtraDiscount: () => void;

  paymentMethod: PaymentMethod;
  setPaymentMethod: (v: PaymentMethod) => void;

  paidDraft: string;
  setPaidDraft: (v: string) => void;
  onCommitPaid: () => void;

  due: number;

  // For product line Discount
  discountEdits: Record<string, string>;
  onIncDiscount: (lineId: string) => void;
  onDecDiscount: (lineId: string) => void;
  onDiscountDraftChange: (lineId: string, v: string) => void;
  onDiscountCommit: (lineId: string) => void;

  // Product quantity
  getAvailableQty: (item: MedicineSalesSearchItem) => number;

  // Financial demo actions
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
      {/* RIGHT: PRODUCT ENTRY + TABLE */}
      <div className="md:col-span-8">
        <ProductTablePanel
          productSearchOpen={props.productSearchOpen}
          setProductSearchOpen={props.setProductSearchOpen}
          productSearchQuery={props.productSearchQuery}
          setProductSearchQuery={props.setProductSearchQuery}
          productSearchResults={props.productSearchResults}
          setProductSearchResults={props.setProductSearchResults}
          productSearchLoading={props.productSearchLoading}
          setProductSearchLoading={props.setProductSearchLoading}
          productSearchHighlight={props.productSearchHighlight}
          setProductSearchHighlight={props.setProductSearchHighlight}
          pickedProduct={props.pickedProduct}
          setPickedProduct={props.setPickedProduct}
          qtyDraft={props.qtyDraft}
          setQtyDraft={props.setQtyDraft}
          rateDraft={props.rateDraft}
          setRateDraft={props.setRateDraft}
          productRowError={props.productRowError}
          setProductRowError={props.setProductRowError}
          focusQtyKey={props.focusQtyKey}
          focusSearchKey={props.focusSearchKey}
          lineItems={props.lineItems}
          onRemoveLine={props.onRemoveLine}
          searchProducts={props.searchProducts}
          onSelectProduct={props.onSelectProduct}
          onAddRequested={props.onAddRequested}
          onClearEntry={props.onClearEntry}
          onDecQty={props.onDecQty}
          onIncQty={props.onIncQty}
          qtyEdits={props.qtyEdits}
          onQtyDraftChange={props.onQtyDraftChange}
          onQtyCommit={props.onQtyCommit}
          discountEdits={props.discountEdits}
          onIncDiscount={props.onIncDiscount}
          onDecDiscount={props.onDecDiscount}
          onDiscountDraftChange={props.onDiscountDraftChange}
          onDiscountCommit={props.onDiscountCommit}
          getAvailableQty={props.getAvailableQty}
        />
      </div>
      {/* LEFT: FINANCIAL DEMO */}
      <div className="md:col-span-4">
        <FinancialDemoPanel
          total={props.total}
          vat={props.vat}
          totalDiscount={props.totalDiscount}
          adjustment={props.adjustment}
          netPayable={props.netPayable}
          extraDiscountDraft={props.extraDiscountDraft}
          setExtraDiscountDraft={props.setExtraDiscountDraft}
          onCommitExtraDiscount={props.onCommitExtraDiscount}
          paymentMethod={props.paymentMethod}
          setPaymentMethod={props.setPaymentMethod}
          paidDraft={props.paidDraft}
          setPaidDraft={props.setPaidDraft}
          onCommitPaid={props.onCommitPaid}
          due={props.due}
          onCancel={props.onCancel}
          onSubmit={props.onSubmit}
        />
      </div>
    </div>
  );
}
