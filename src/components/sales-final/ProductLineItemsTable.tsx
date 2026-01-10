"use client";

import { Button, Input } from "rsuite";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { LineItem, SalesUser } from "./SalesTypes";
import { safeNum, clamp, discountMaxPct } from "./SalesHelper";

export function ProductLineItemsTable(props: {
  lines: LineItem[];

  user: SalesUser;

  qtyEdits: Record<string, string>;
  setQtyEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  discountEdits: Record<string, string>;
  setDiscountEdits: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;

  getMaxQty: (li: LineItem) => number;

  onRemove: (lineId: string) => void;

  onIncQty: (lineId: string) => void;
  onDecQty: (lineId: string) => void;

  onCommitQty: (lineId: string, qty: number) => void;
  onCommitDiscount: (lineId: string, pct: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left">Item</th>
            <th className="px-3 py-2 text-left">Batch</th>
            <th className="px-3 py-2 text-right">Rate</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2 text-right">Disc %</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>

        <tbody>
          {props.lines.map((li) => {
            const maxQty = props.getMaxQty(li);
            const maxDisc = discountMaxPct(
              props.user,
              li.discountDefaultLimitPct
            );

            return (
              <tr key={li.lineId} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-900">{li.name}</div>
                  <div className="text-xs text-slate-500">{li.medicineId}</div>
                </td>

                <td className="px-3 py-2 text-slate-700">
                  <div>{li.batchNo}</div>
                  <div className="text-xs text-slate-500">Max: {maxQty}</div>
                </td>

                <td className="px-3 py-2 text-right text-slate-900">
                  {li.rate.toFixed(2)}
                </td>

                {/* Qty control with guard */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      appearance="ghost"
                      size="xs"
                      disabled={li.qty <= 1}
                      onClick={() => props.onDecQty(li.lineId)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      size="sm"
                      className="w-[90px] rounded-lg text-right"
                      value={props.qtyEdits[li.lineId] ?? String(li.qty)}
                      onChange={(v) =>
                        props.setQtyEdits((m) => ({
                          ...m,
                          [li.lineId]: String(v),
                        }))
                      }
                      onBlur={() => {
                        const raw = String(
                          props.qtyEdits[li.lineId] ?? ""
                        ).trim();
                        const n = safeNum(raw, NaN);
                        const next = clamp(n, 1, maxQty);
                        props.setQtyEdits((m) => ({
                          ...m,
                          [li.lineId]: String(next),
                        }));
                        props.onCommitQty(li.lineId, next);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (e.currentTarget as any)?.blur?.();
                        }
                      }}
                      title={`Max for this batch: ${maxQty}`}
                      inputMode="decimal"
                    />

                    <Button
                      appearance="ghost"
                      size="xs"
                      disabled={li.qty >= maxQty}
                      onClick={() => props.onIncQty(li.lineId)}
                      title={`Max ${maxQty}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </td>

                {/* Discount control beside qty */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      appearance="ghost"
                      size="xs"
                      disabled={li.discountPct <= 0}
                      onClick={() =>
                        props.onCommitDiscount(li.lineId, li.discountPct - 1)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      size="sm"
                      className="w-[90px] rounded-lg text-right"
                      value={
                        props.discountEdits[li.lineId] ?? String(li.discountPct)
                      }
                      onChange={(v) =>
                        props.setDiscountEdits((m) => ({
                          ...m,
                          [li.lineId]: String(v),
                        }))
                      }
                      onBlur={() => {
                        const raw = String(
                          props.discountEdits[li.lineId] ?? ""
                        ).trim();
                        const n = safeNum(raw, NaN);
                        const next = clamp(n, 0, maxDisc);
                        props.setDiscountEdits((m) => ({
                          ...m,
                          [li.lineId]: String(next),
                        }));
                        props.onCommitDiscount(li.lineId, next);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          (e.currentTarget as any)?.blur?.();
                        }
                      }}
                      title={`Cap ${maxDisc}%`}
                      inputMode="decimal"
                    />

                    <Button
                      appearance="ghost"
                      size="xs"
                      disabled={li.discountPct >= maxDisc}
                      onClick={() =>
                        props.onCommitDiscount(li.lineId, li.discountPct + 1)
                      }
                      title={`Cap ${maxDisc}%`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </td>

                <td className="px-3 py-2 text-right font-semibold text-slate-900">
                  {li.amount.toFixed(2)}
                </td>

                <td className="px-3 py-2 text-right">
                  <Button
                    appearance="ghost"
                    size="xs"
                    onClick={() => props.onRemove(li.lineId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            );
          })}

          {props.lines.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-sm text-slate-500" colSpan={7}>
                No items added.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
