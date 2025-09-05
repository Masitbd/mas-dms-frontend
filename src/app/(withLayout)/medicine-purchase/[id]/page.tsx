"use client";
import Loading from "@/components/layout/Loading";
import { PurchaseHeader } from "@/components/medicine-purchese/PurchaseViewHeader";
import { MedicineTable } from "@/components/medicine-purchese/PUrchaseViewMedicineList";
import { PurchaseTotals } from "@/components/medicine-purchese/PurchaseViewTotal";
import { useGetPurchaseInvoiceQuery } from "@/redux/api/purchase/purchase.api";
import { ShoppingCart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "rsuite";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generatePurchasePdf } from "@/components/medicine-purchese/MedicinePurcheseTypes";
import PurchasePayment from "@/components/medicine-purchese/PurchasePayment";
pdfMake.vfs = pdfFonts.vfs;

export default function PurchasePrintExample() {
  const { id } = useParams();
  const {
    isLoading: purchaseInfoLoading,
    isFetching: purchaseInfoFetching,
    data: purchaseData,
  } = useGetPurchaseInvoiceQuery(id as string, { skip: !id });

  const router = useRouter();

  const printHandler = async () => {
    generatePurchasePdf(purchaseData?.data, { open: true });
  };

  return (
    <div className="page mx-auto p-6 bg-gray-50 text-gray-900 print:bg-white print:p-0 relative">
      <div className="no-break rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-2 print:shadow-none print:ring-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 m-0">
              Purchase Information
            </h3>
            <p className="text-gray-600 text-sm m-0">Invoice</p>
          </div>
        </div>
      </div>
      <Loading
        size="md"
        loading={purchaseInfoLoading || purchaseInfoFetching}
      />
      {/* Component 1: Header */}
      <PurchaseHeader purchase={purchaseData?.data?.purchaseInfo} />

      {/* Component 2: Items Table */}
      <MedicineTable items={purchaseData?.data?.purchaseItemInfo} />

      {/* Component 3: Totals */}
      <PurchaseTotals
        currencyCode="TK"
        items={purchaseData?.data?.purchaseItemInfo}
        purchase={purchaseData?.data?.purchaseInfo}
      />

      <div className="flex gap-2 justify-end my-3">
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          onClick={() => printHandler()}
        >
          Print
        </Button>
        <Button
          appearance="primary"
          color="red"
          size="lg"
          onClick={() => router.push("/medicine-purchase")}
        >
          Back
        </Button>
      </div>

      <div>
        <PurchasePayment purchaseData={purchaseData?.data?.purchaseInfo} />
      </div>
    </div>
  );
}
