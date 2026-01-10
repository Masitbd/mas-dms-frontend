"use client";

import { useMemo, useState } from "react";
import { Divider, Input, InputPicker, Panel } from "rsuite";

import {
  selectFinanceInput,
  selectFinancialSummary,
  selectDue,
  setExtraDiscount,
  setPaid,
  setPaymentMethod,
} from "@/redux/features/sales/salesDraftSlice";
import { money, safeNum, clamp, round2 } from "./SalesHelper";
import type { PaymentMethod } from "./SalesTypes";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export function FinancialModule() {
  const dispatch = useAppDispatch();
  const finInput = useAppSelector(selectFinanceInput);
  const summary = useAppSelector(selectFinancialSummary);
  const due = useAppSelector(selectDue);

  // local drafts (UI-only)
  const [extraDraft, setExtraDraft] = useState<string>(
    String(finInput.extraDiscount ?? 0)
  );
  const [paidDraft, setPaidDraft] = useState<string>(
    String(finInput.paid ?? 0)
  );
  const [financeError, setFinanceError] = useState<string | null>(null);

  const paymentOptions = useMemo(
    () => [
      { label: "Cash", value: "cash" },
      { label: "Card", value: "card" },
      { label: "Bank", value: "bank" },
    ],
    []
  );

  const commitExtra = () => {
    const v = round2(Math.max(safeNum(extraDraft, 0), 0));
    dispatch(setExtraDiscount(v));
    setExtraDraft(String(v));
  };

  const commitPaid = () => {
    const raw = round2(Math.max(safeNum(paidDraft, 0), 0));
    const cap = summary.netPayable; // paid cannot exceed due before payment
    const capped = clamp(raw, 0, cap);

    if (raw > cap)
      setFinanceError("Paid amount cannot be greater than the Due amount.");
    else setFinanceError(null);

    dispatch(setPaid(capped));
    setPaidDraft(String(capped));
  };

  return (
    <Panel bordered className="w-full rounded-2xl border-slate-200 bg-white">
      <div className="text-base font-semibold text-slate-900">Financial</div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div className="text-slate-600">Total</div>
        <div className="text-right font-semibold">{money(summary.total)}</div>

        <div className="text-slate-600">VAT</div>
        <div className="text-right font-semibold">{money(summary.vat)}</div>

        <div className="text-slate-600">Adjustment</div>
        <div className="text-right font-semibold">
          {money(summary.adjustment)}
        </div>

        <Divider className="col-span-2 my-1" />

        <div className="text-slate-600">Net Payable</div>
        <div className="text-right text-base font-bold">
          {money(summary.netPayable)}
        </div>

        <div className="text-slate-600">Extra Discount</div>
        <div className="flex justify-end">
          <Input
            size="sm"
            className="w-[140px] rounded-xl text-right"
            value={extraDraft}
            onChange={(v) => setExtraDraft(String(v))}
            onBlur={commitExtra}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitExtra();
              }
            }}
            inputMode="decimal"
          />
        </div>

        <div className="text-slate-600">Payment Method</div>
        <div className="flex justify-end">
          <InputPicker
            size="sm"
            cleanable={false}
            searchable={false}
            className="w-[140px] rounded-xl"
            data={paymentOptions}
            value={finInput.paymentMethod}
            onChange={(v) =>
              dispatch(setPaymentMethod((v as PaymentMethod) ?? "cash"))
            }
          />
        </div>

        <div className="text-slate-600">Paid</div>
        <div className="flex justify-end">
          <Input
            size="sm"
            className="w-[140px] rounded-xl text-right"
            value={paidDraft}
            onChange={(v) => {
              setPaidDraft(String(v));
              setFinanceError(null);
            }}
            onBlur={commitPaid}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitPaid();
              }
            }}
            inputMode="decimal"
          />
        </div>

        <div className="text-slate-600">Due</div>
        <div className="text-right text-base font-bold">{money(due)}</div>
      </div>

      {financeError ? (
        <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {financeError}
        </div>
      ) : null}
    </Panel>
  );
}
