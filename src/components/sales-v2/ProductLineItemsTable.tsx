import { Button, Input } from "rsuite";
import { LineItem } from "./SalesTypes";
import { Minus, Plus, Trash2 } from "lucide-react";
import { money } from "./SalesHelpe";

export function ProductLineItemsTable(props: {
  lineItems: LineItem[];
  onRemoveLine: (lineId: string) => void;
  onIncQty: (lineId: string) => void;
  onDecQty: (lineId: string) => void;
  qtyEdits: Record<string, string>;
  onQtyDraftChange: (lineId: string, v: string) => void;
  onQtyCommit: (lineId: string) => void;
}) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs text-slate-600">
          <tr>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2">SKU</th>
            <th className="px-3 py-2">Unit</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2 text-right">Rate</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {props.lineItems.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-center text-slate-500" colSpan={7}>
                No products added yet.
              </td>
            </tr>
          ) : (
            props.lineItems.map((li) => (
              <tr key={li.lineId} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  <div className="font-medium text-slate-900">{li.name}</div>
                </td>
                <td className="px-3 py-2 text-slate-600">{li.sku ?? "—"}</td>
                <td className="px-3 py-2 text-slate-600">{li.unit ?? "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      appearance="ghost"
                      size="xs"
                      disabled={li.qty <= 1}
                      onClick={() => props.onDecQty(li.lineId)}
                      title="Decrease qty"
                      className="rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                      value={props.qtyEdits[li.lineId] ?? String(li.qty)}
                      onChange={(v) =>
                        props.onQtyDraftChange(li.lineId, String(v))
                      }
                      onBlur={() => props.onQtyCommit(li.lineId)}
                      className="!w-[50px] rounded-lg text-right"
                      size="sm"
                      inputMode="decimal"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          props.onQtyCommit(li.lineId);
                        }
                      }}
                      onFocus={(e: any) => {
                        // select all for fast overwrite (RSuite forwards event)
                        e?.target?.select?.();
                      }}
                    />

                    <Button
                      appearance="ghost"
                      size="xs"
                      onClick={() => props.onIncQty(li.lineId)}
                      title="Increase qty"
                      className="rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                <td className="px-3 py-2 text-right text-slate-900">
                  {money(li.rate)}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-slate-900">
                  {money(li.amount)}
                </td>
                <td className="px-3 py-2 text-right">
                  <Button
                    appearance="ghost"
                    size="sm"
                    onClick={() => props.onRemoveLine(li.lineId)}
                    title="Remove"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </span>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
