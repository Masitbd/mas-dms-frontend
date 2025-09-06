import { Divider, Panel, Stack } from "rsuite";
import {
  calculateInvoiceTotals,
  MedicineItem,
  money,
  Purchase,
} from "./MedicinePurcheseTypes";
import {
  Calculator,
  CircleDollarSign,
  CreditCard,
  Minus,
  Percent,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

export const PurchaseTotals: React.FC<{
  purchase: Purchase;
  items: MedicineItem[];
  currencyCode?: string;
}> = ({ purchase, items, currencyCode = "AUD" }) => {
  const [amounts, setAmounts] = useState({
    NetPayable: 0,
    TotalAmount: 0,
    TotalDiscount: 0,
    TotalVat: 0,
  });

  useEffect(() => {
    const amounts = calculateInvoiceTotals(
      items,
      purchase?.discountPercentage,
      purchase?.vatPercentage
    );

    setAmounts(amounts);
  }, [purchase, items]);

  const paid = purchase?.paidAmount ?? 0;
  const due = Math.max(0, amounts.TotalAmount - paid);

  return (
    <Panel
      bordered
      className="no-break rounded-xl bg-white ring-1 ring-gray-200 p-3 mt-3 w-full ml-auto print:ring-0"
    >
      <h3 className="text-xs font-semibold text-gray-700 mb-1">Totals</h3>
      <dl className="text-sm divide-y divide-gray-200">
        <TotalLine
          icon={<Calculator size={14} aria-hidden />}
          label="Subtotal"
          value={money(amounts.TotalAmount, currencyCode)}
        />
        <TotalLine
          icon={<Percent size={14} aria-hidden />}
          label={`VAT (${purchase?.vatPercentage ?? 0}%)`}
          value={money(amounts.TotalVat, currencyCode)}
        />
        <TotalLine
          icon={<Minus size={14} aria-hidden />}
          label={`Discount (${purchase?.discountPercentage ?? 0}%)`}
          value={"-" + money(amounts.TotalDiscount, currencyCode)}
        />
        <TotalLine
          icon={<CircleDollarSign size={14} aria-hidden />}
          label={<span className="font-medium">Grand Total</span>}
          value={
            <span className="font-medium">
              {money(amounts.NetPayable, currencyCode)}
            </span>
          }
          emphasize
        />
        <TotalLine
          icon={<CreditCard size={14} aria-hidden />}
          label="Paid"
          value={money(paid, currencyCode)}
        />
        <TotalLine
          icon={<Wallet size={14} aria-hidden />}
          label={<span className="font-medium">Due</span>}
          value={
            <span className="font-medium">{money(due, currencyCode)}</span>
          }
          emphasize
        />
      </dl>
    </Panel>
  );
};

const TotalLine: React.FC<{
  icon: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  emphasize?: boolean;
}> = ({ icon, label, value, emphasize }) => (
  <div className="flex items-center justify-between py-1 first:pt-0 last:pb-0">
    <div className="flex items-center gap-2 text-gray-600">
      <span className="shrink-0">{icon}</span>
      <span className="text-[11px]">{label}</span>
    </div>
    <div className={`tabular-nums ${emphasize ? "font-semibold" : ""}`}>
      {value}
    </div>
  </div>
);
