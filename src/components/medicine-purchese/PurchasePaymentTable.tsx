import * as React from "react";
import {
  Loader2,
  FileQuestion,
  Wallet,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";
import { CollectPurchasePaymentModal } from "./PurchasePaymentModal";
import { Purchase } from "./MedicinePurcheseTypes";

// ---------------- Types ----------------
export type PurchasePayment = {
  purchaseId: string;
  paymentDate: string; // ISO
  amount: number;
  method: "cash" | "card" | "bkash" | "bank" | (string & {});
  note?: string;
  createdAt: string; // ISO
};

export type PurchasePaymentHistoryProps = {
  data?: PurchasePayment[];
  isLoading?: boolean;
  currency?: string; // default: BDT
  className?: string;
  purchaseData: Purchase;
};

// ---------------- Utilities ----------------
const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
};

const formatMoney = (value: number, currency = "BDT") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toLocaleString();
  }
};

// ---------------- UI Bits (from scratch w/ Tailwind) ----------------
const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ children, className = "", title }) => (
  <span
    title={title}
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const m = method.toLowerCase();
  if (m === "cash")
    return (
      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
        <Wallet className="h-3.5 w-3.5" /> Cash
      </Badge>
    );
  if (m === "card")
    return (
      <Badge className="border-sky-200 bg-sky-50 text-sky-700">
        <CreditCard className="h-3.5 w-3.5" /> Card
      </Badge>
    );
  if (m === "bkash")
    return (
      <Badge className="border-pink-200 bg-pink-50 text-pink-700">
        <Smartphone className="h-3.5 w-3.5" /> bKash
      </Badge>
    );
  if (m === "bank")
    return (
      <Badge className="border-slate-200 bg-slate-50 text-slate-700">
        <Landmark className="h-3.5 w-3.5" /> Bank
      </Badge>
    );
  return (
    <Badge className="border-zinc-200 bg-zinc-50 text-zinc-700">
      <Wallet className="h-3.5 w-3.5" /> {method}
    </Badge>
  );
};

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
    <FileQuestion className="mb-3 h-10 w-10" />
    <p className="text-base font-medium">No payments found</p>
    <p className="text-sm">Try adjusting your filters or come back later.</p>
  </div>
);

const LoadingRow: React.FC = () => (
  <tr className="animate-pulse">
    <td className="p-4">
      <div className="h-4 w-44 rounded bg-zinc-200" />
    </td>
    <td className="p-4 text-right">
      <div className="ml-auto h-4 w-20 rounded bg-zinc-200" />
    </td>
    <td className="p-4">
      <div className="h-6 w-20 rounded-full bg-zinc-200" />
    </td>
    <td className="p-4">
      <div className="h-4 w-72 rounded bg-zinc-200" />
    </td>
    <td className="p-4">
      <div className="h-4 w-44 rounded bg-zinc-200" />
    </td>
    <td className="p-4">
      <div className="h-4 w-48 rounded bg-zinc-200" />
    </td>
  </tr>
);

// ---------------- Main Component ----------------
export default function PurchasePaymentHistory({
  data,
  isLoading = false,
  currency = "BDT",
  className,
  purchaseData,
}: PurchasePaymentHistoryProps) {
  const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
  const rows = React.useMemo(() => {
    const arr = (data ?? []).slice();
    arr.sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
    return arr;
  }, [data]);

  return (
    <section className={`mx-auto w-full ${className ?? ""}`}>
      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold sm:text-xl">
            Purchase Payment History
          </h2>
          {isLoading && (
            <span className="inline-flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-0">
          {isLoading ? (
            <div className="overflow-x-auto">
              <table className="min-w-[840px] w-full table-fixed border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left text-sm text-zinc-600">
                    <th className="w-[240px] px-4 py-3 font-medium">
                      Payment Date
                    </th>
                    <th className="w-[140px] px-4 py-3 text-right font-medium">
                      Amount
                    </th>
                    <th className="w-[130px] px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="w-[240px] px-4 py-3 font-medium">Created</th>
                    <th className="w-[220px] px-4 py-3 font-medium">
                      Purchase ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <LoadingRow key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : !rows.length ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[840px] w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left text-sm text-zinc-600">
                    <th className="w-[240px] px-4 py-3 font-medium">
                      Payment Date
                    </th>

                    <th className="w-[130px] px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Note</th>
                    <th className="w-[240px] px-4 py-3 text-right font-medium">
                      Amount
                    </th>
                    {/* <th className="w-[240px] px-4 py-3 font-medium">Created</th> */}
                    {/* <th className="w-[220px] px-4 py-3 font-medium">
                      Purchase ID
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {rows.map((p) => (
                    <tr
                      key={`${p.purchaseId}-${p.createdAt}`}
                      className="hover:bg-zinc-50"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                        {formatDateTime(p?.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <MethodBadge method={p.method} />
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-zinc-700 max-w-[360px] truncate"
                        title={p.note ?? "—"}
                      >
                        {p.note ?? "—"}
                      </td>

                      <td className="px-4 py-3 text-right text-sm font-semibold text-zinc-900">
                        {formatMoney(p.amount, currency)}
                      </td>
                      {/* <td className="px-4 py-3 text-sm text-zinc-700">
                        {formatDateTime(p.createdAt)}
                      </td> */}
                      {/* <td className="px-4 py-3 text-xs text-zinc-700">
                        <code className="rounded bg-zinc-100 px-1.5 py-0.5">
                          {p.purchaseId}
                        </code>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <CollectPurchasePaymentModal
          isOpen={isPaymentModalOpen}
          setOpen={setPaymentModalOpen}
          dueAmount={
            (purchaseData?.netPayable ?? 0) - (purchaseData?.paidAmount ?? 0)
          }
          paidAmount={purchaseData?.paidAmount ?? 0}
          purchase={purchaseData}
          totalAmount={purchaseData?.netPayable ?? 0}
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-5 py-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            onClick={() => setPaymentModalOpen(!isPaymentModalOpen)}
          >
            Collect Purchase Payment
          </button>
        </div>
      </div>
    </section>
  );
}
