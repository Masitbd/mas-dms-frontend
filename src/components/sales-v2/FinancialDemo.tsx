/* ============================================================
 * 12) FINANCIAL DEMO PANEL (PLACEHOLDER UI, REAL TOTALS)
 * ============================================================
 */

import { RotateCcw } from "lucide-react";
import { Button, Divider, Input, Panel } from "rsuite";
import { money } from "./SalesHelpe";

export function FinancialDemoPanel(props: {
  subtotal: number;
  discountDraft: string;
  setDiscountDraft: (v: string) => void;
  vatPctDraft: string;
  setVatPctDraft: (v: string) => void;
  vatAmount: number;
  grandTotal: number;
  paidDraft: string;
  setPaidDraft: (v: string) => void;
  due: number;
  onResetAll: () => void;
}) {
  return (
    <Panel
      bordered
      className="w-full rounded-2xl border-slate-200 bg-white"
      header={
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-slate-900">
              Financials
            </div>
            <div className="text-xs text-slate-500">
              Demo section (we will refine later)
            </div>
          </div>
          <Button appearance="ghost" size="sm" onClick={props.onResetAll}>
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset All
            </span>
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-semibold text-slate-900">
              {money(props.subtotal)}
            </span>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2">
            <div>
              <div className="mb-1 text-xs font-medium text-slate-600">
                Discount (amount)
              </div>
              <Input
                value={props.discountDraft}
                onChange={(v) => props.setDiscountDraft(String(v))}
                placeholder="0"
                className="rounded-xl"
              />
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-slate-600">
                VAT (%)
              </div>
              <Input
                value={props.vatPctDraft}
                onChange={(v) => props.setVatPctDraft(String(v))}
                placeholder="0"
                className="rounded-xl"
              />
              <div className="mt-1 text-xs text-slate-500">
                VAT amount:{" "}
                <span className="font-medium text-slate-800">
                  {money(props.vatAmount)}
                </span>
              </div>
            </div>

            <Divider className="my-2" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Grand Total</span>
              <span className="font-semibold text-slate-900">
                {money(props.grandTotal)}
              </span>
            </div>

            <div>
              <div className="mb-1 text-xs font-medium text-slate-600">
                Paid
              </div>
              <Input
                value={props.paidDraft}
                onChange={(v) => props.setPaidDraft(String(v))}
                placeholder="0"
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Due</span>
              <span className="font-semibold text-slate-900">
                {money(props.due)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Notes: This is a demo financial panel. We will replace with final
          rules (discount types, VAT rules, rounding, payments, etc.).
        </div>
      </div>
    </Panel>
  );
}
