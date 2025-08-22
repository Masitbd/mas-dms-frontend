import { Panel } from "rsuite";
import { formatDate, MedicineItem, money } from "./MedicinePurcheseTypes";

export const MedicineTable: React.FC<{ items: MedicineItem[] }> = ({
  items,
}) => {
  const rows = items ?? [];
  return (
    <Panel
      bordered
      className="no-break rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5 mt-4 print:shadow-none print:ring-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 print:bg-white">
            <tr className="text-left">
              <th className="px-3 py-2 border-b border-gray-200">#</th>
              <th className="px-3 py-2 border-b border-gray-200">Medicine</th>
              <th className="px-3 py-2 border-b border-gray-200">Unit</th>
              <th className="px-3 py-2 border-b border-gray-200">Batch</th>
              <th className="px-3 py-2 border-b border-gray-200">Expiry</th>
              <th className="px-3 py-2 border-b border-gray-200 text-right">
                Qty
              </th>
              <th className="px-3 py-2 border-b border-gray-200 text-right">
                Purchase Rate
              </th>
              <th className="px-3 py-2 border-b border-gray-200 text-right">
                Line Total
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-gray-500">
                  No items
                </td>
              </tr>
            )}
            {rows.map((it, idx) => {
              const lineTotal = (it.quantity ?? 0) * (it.purchaseRate ?? 0);
              return (
                <tr
                  key={it._id || idx}
                  className="odd:bg-white even:bg-gray-50 print:bg-white"
                >
                  <td className="px-3 py-2 border-b border-gray-100">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">
                    <div className="font-medium text-gray-900">
                      {it.medicineName?.name || "—"}
                    </div>
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">
                    {it.medicineName?.unit || "—"}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">
                    {it.batchNo || "—"}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100">
                    {formatDate(it.dateExpire)}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right tabular-nums">
                    {it.quantity ?? 0}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right tabular-nums">
                    {money(it.purchaseRate ?? 0, "TK")}
                  </td>
                  <td className="px-3 py-2 border-b border-gray-100 text-right tabular-nums font-medium">
                    {money(lineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
