import { Panel } from "rsuite";
import { formatDate, Purchase } from "./MedicinePurcheseTypes";
import { Mail, Phone, Tag } from "lucide-react";

export const PurchaseHeader: React.FC<{ purchase: Purchase }> = ({
  purchase,
}) => {
  const supplier = purchase?.supplierId;
  const isPaid = purchase?.status?.toLowerCase() === "paid";

  return (
    <Panel
      bordered
      className="no-break rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-2 print:shadow-none print:ring-0"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Purchase Invoice
          </h1>
          <p className="text-sm text-gray-500">
            Invoice No:{" "}
            <span className="font-medium text-gray-700">
              {purchase?.invoiceNo}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Purchase Date:{" "}
            <span className="font-medium text-gray-700">
              {formatDate(purchase?.purchaseDate ?? new Date())}
            </span>
          </p>
          <div className="mt-2 flex gap-3">
            <Tag color={isPaid ? "green" : "orange"}></Tag>
            <span className="text-md font-bold">
              {purchase?.status?.toUpperCase?.() || "STATUS"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-sm font-semibold text-gray-900">Supplier</h2>
          <div className="mt-1 text-sm text-gray-700">
            <div className="font-medium">{supplier?.name?.trim?.() || "—"}</div>
            {supplier?.contactPerson ? (
              <div>Attn: {supplier?.contactPerson}</div>
            ) : null}
            {supplier?.address ? <div>{supplier?.address}</div> : null}
            <div className="mt-1 flex items-center justify-end gap-4 text-gray-600">
              {supplier?.phone ? (
                <span className="inline-flex items-center gap-1">
                  <Phone size={14} aria-hidden /> {supplier.phone}
                </span>
              ) : null}
              {supplier?.email ? (
                <span className="inline-flex items-center gap-1">
                  <Mail size={14} aria-hidden /> {supplier.email}
                </span>
              ) : null}
            </div>
            {(supplier?.city || supplier?.country) && (
              <div className="text-gray-500">
                {supplier.city}
                {supplier.city && supplier.country ? ", " : ""}
                {supplier.country}
              </div>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
};
