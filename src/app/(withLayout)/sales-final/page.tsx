"use client";

import { useSearchParams } from "next/navigation";
import {
  selectSalesDraft,
  selectSubmitPayload,
} from "@/redux/features/sales/salesDraftSlice";
import { useAppSelector } from "@/lib/hooks";
import { useSalesBootstrap } from "@/components/sales-final/useSalesBootstrap";
import { CustomerModule } from "@/components/sales-final/CustomerModule";
import { ProductModule } from "@/components/sales-final/ProductModule";
import { FinancialModule } from "@/components/sales-final/FinancialModule";

export default function SalesPage() {
  const sp = useSearchParams();
  const mode = sp.get("mode") === "edit" ? "edit" : "create";
  const saleId = sp.get("saleId");

  useSalesBootstrap(mode, saleId);

  const draft = useAppSelector(selectSalesDraft);
  const payload = useAppSelector(selectSubmitPayload); // ✅ ready-to-submit payload

  if (draft.meta.status === "loading") {
    return <div className="p-4 text-sm text-slate-600">Loading sale...</div>;
  }

  if (draft.meta.status === "error") {
    return <div className="p-4 text-sm text-red-600">{draft.meta.error}</div>;
  }

  return (
    <div className="h-screen w-full bg-white p-2">
      <div className="grid h-full grid-cols-12 gap-2">
        {/* Left: Financial */}
        <div className="col-span-4 overflow-auto">
          <FinancialModule />
        </div>

        {/* Right: Customer + Product */}
        <div className="col-span-8 flex flex-col gap-2 overflow-auto">
          <CustomerModule />
          <ProductModule />
        </div>
      </div>

      {/* payload is now centralized & ready for submit */}
      {/* You can add a Save button here that calls create/update mutation using payload */}
    </div>
  );
}
