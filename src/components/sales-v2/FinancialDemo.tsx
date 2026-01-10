/* ============================================================
 * 12) FINANCIAL DEMO PANEL (PLACEHOLDER UI, REAL TOTALS)
 * ============================================================
 */

import { RotateCcw } from "lucide-react";
import { Button, Divider, Input, InputPicker, Panel } from "rsuite";
import { money } from "./SalesHelpe";
import { PaymentMethod } from "./SalesTypes";
import { useMemo } from "react";

export function FinancialDemoPanel(props: {
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
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const paymentOptions = useMemo(
    () => [
      { label: "Cash", value: "cash" },
      { label: "Card", value: "card" },
      { label: "Bank", value: "bank" },
    ],
    []
  );

  return (
    <Panel
      bordered
      className="w-full rounded-2xl border-slate-200 bg-white"
      header={
        <div>
          <div className="text-base font-semibold text-slate-900">
            Financial
          </div>
          <div className="text-xs text-slate-500">
            Compact summary (auto-calculated)
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        {/* 1) Total */}
        <div className="text-slate-600">Total</div>
        <div className="text-right font-semibold text-slate-900">
          {money(props.total)}
        </div>

        {/* 2) VAT (from line vat%) */}
        <div className="text-slate-600">VAT</div>
        <div className="text-right font-semibold text-slate-900">
          {money(props.vat)}
        </div>

        {/* 3) Total Discount */}
        <div className="text-slate-600">Total Discount</div>
        <div className="text-right font-semibold text-slate-900">
          {money(props.totalDiscount)}
        </div>

        {/* 4) Adjustment (auto) */}
        <div className="text-slate-600">Adjustment</div>
        <div className="text-right font-semibold text-slate-900">
          {props.adjustment === 0 ? "0.00" : money(props.adjustment)}
        </div>

        <Divider className="col-span-2 my-1" />

        {/* 5) Net Payable */}
        <div className="text-slate-600">Net Payable</div>
        <div className="text-right text-base font-bold text-slate-900">
          {money(props.netPayable)}
        </div>

        {/* 6) Extra discount (cash discount) */}
        <div className="text-slate-600">Extra Discount</div>
        <div className="flex justify-end">
          <Input
            size="sm"
            className="w-[140px] rounded-xl text-right"
            value={props.extraDiscountDraft}
            onChange={(v) => props.setExtraDiscountDraft(String(v))}
            onBlur={props.onCommitExtraDiscount}
            placeholder="0"
            inputMode="decimal"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                props.onCommitExtraDiscount();
              }
            }}
          />
        </div>

        {/* 7) Payment Method */}
        <div className="text-slate-600">Payment Method</div>
        <div className="flex justify-end">
          <InputPicker
            size="sm"
            cleanable={false}
            searchable={false}
            className="w-[140px] rounded-xl"
            data={paymentOptions}
            value={props.paymentMethod}
            onChange={(v) =>
              props.setPaymentMethod((v as PaymentMethod) ?? "cash")
            }
            placeholder="Select"
          />
        </div>

        {/* 8) Paid */}
        <div className="text-slate-600">Paid</div>
        <div className="flex justify-end">
          <Input
            size="sm"
            className="w-[140px] rounded-xl text-right"
            value={props.paidDraft}
            onChange={(v) => props.setPaidDraft(String(v))}
            onBlur={props.onCommitPaid}
            placeholder="0"
            inputMode="decimal"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                props.onCommitPaid();
              }
            }}
          />
        </div>

        {/* Due */}
        <div className="text-slate-600">Due</div>
        <div className="text-right text-base font-bold text-slate-900">
          {money(props.due)}
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button
          appearance="primary"
          color="blue"
          onClick={() => props.onSubmit()}
        >
          Submit
        </Button>
        <Button appearance="ghost" color="red" onClick={() => props.onCancel()}>
          Cancel
        </Button>
      </div>
    </Panel>
  );
}
