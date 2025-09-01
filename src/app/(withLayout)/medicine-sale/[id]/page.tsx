"use client";

import { useGetSingleMedicineSalesQuery } from "@/redux/api/medicines/sales.api";
import {
  ArrowLeft,
  Calendar,
  Phone,
  MapPin,
  Receipt,
  User,
  Bed,
  Pill,
  DollarSign,
  Percent,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Button, Card } from "rsuite";

type TMedicine = {
  medicineId: {
    name: string;
  };
  unit_price: number;
  quantity: number;
  discount: number;
  total_price: number;
  discount_type: string;
};

const getPatientTypeBadge = (type: string) => {
  const variants: Record<string, string> = {
    outdoor: "bg-blue-100 text-blue-800 border border-blue-200",
    indoor: "bg-green-100 text-green-800 border border-green-200",
    general: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const variant = variants[type] || variants.general;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variant}`}>
      {type}
    </span>
  );
};

const SingleMedicineSalesPage = () => {
  const { id } = useParams();
  const { data: singleSales, isLoading } = useGetSingleMedicineSalesQuery(
    id as string,
    {
      skip: !id,
    }
  );

  const onBack = () => {};

  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          appearance="ghost"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sales
        </Button>
        <div className="flex items-center gap-3">
          {getPatientTypeBadge(
            singleSales?.data?.patient_type
              ? singleSales?.data?.patient_type
              : "general"
          )}
          <div className="text-2xl font-bold text-green-600">
            ৳{singleSales?.data?.paymentId?.totalBill.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sale Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <div>
            <Card.Header className="flex text-2xl font-semibold text-gray-700 mb-5  items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </Card.Header>
          </div>
          <Card.Body className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-semibold">
                {singleSales?.data?.name || "Walk-in Customer"}
              </p>
            </div>

            {singleSales?.data?.contact_no && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Contact
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p>{singleSales?.data?.contact_no}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <p className="text-sm">{singleSales?.data?.address}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Bed Number
              </label>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-gray-400" />
                <p>{singleSales?.data?.bed_no}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Indoor Bill No
              </label>
              <p>{singleSales?.data?.indoor_bill_no}</p>
            </div>
          </Card.Body>
        </Card>

        {/* Transaction Details */}
        <Card>
          <Card.Header>
            <div className="flex text-2xl font-semibold text-gray-700 mb-5  items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction Details
            </div>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Invoice Number
              </label>
              <p className="text-lg font-mono">
                {singleSales?.data?.invoice_no}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Transaction Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {/* <p>{format(new Date(singleSales?.data?.transaction_date), "PPP")}</p> */}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Patient Type
              </label>
              <div className="mt-1">
                {getPatientTypeBadge(singleSales?.data?.patient_type)}
              </div>
            </div>

            {singleSales?.data?.posted_by && (
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Posted By
                </label>
                <p>{singleSales?.data?.posted_by}</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Payment Summary */}
        <Card>
          <Card.Header>
            <h1 className="flex text-2xl font-semibold text-gray-700 mb-5 items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Summary
            </h1>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div className="flex justify-between border-b border-gray-300 pb-1.5">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                ৳{singleSales?.data?.paymentId?.totalBill}
              </span>
            </div>

            {singleSales?.data?.paymentId?.totalDiscount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Total Discount:</span>
                <span>
                  -৳
                  {singleSales?.data?.paymentId?.totalDiscount.toLocaleString()}
                </span>
              </div>
            )}

            {/* <Separator /> */}

            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">
                ৳{singleSales?.data?.paymentId?.netPayable.toLocaleString()}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {singleSales?.data?.medicines.length}
              </span>{" "}
              medicine(s)
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Medicines List */}
      <div>
        <div>
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medicine Details
          </div>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">
                    Medicine
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-700">
                    Qty
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-700">
                    Unit Price
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-700">
                    Discount
                  </th>
                  <th className="text-right py-3 px-2 font-medium text-gray-700">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {singleSales?.data?.medicines.map(
                  (medicine: TMedicine, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="text-sm text-gray-500">
                          {medicine.medicineId?.name}
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">
                        <span className="font-medium">{medicine.quantity}</span>
                      </td>
                      <td className="text-right py-3 px-2">
                        ৳{(medicine.unit_price || 0).toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-2">
                        {medicine.discount ? (
                          <div className="text-red-600">
                            <div className="flex items-center justify-end gap-1">
                              {medicine.discount_type === "percentage" && (
                                <Percent className="h-3 w-3" />
                              )}
                              <span>৳{medicine.discount.toLocaleString()}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="text-right py-3 px-2 font-semibold">
                        ৳{(medicine.total_price || 0).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMedicineSalesPage;

// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { ISale, IMedicineSale } from "@/types/sales";
// import {
//   ArrowLeft,
//   Calendar,
//   Phone,
//   MapPin,
//   Receipt,
//   User,
//   Bed,
//   Pill,
//   DollarSign,
//   Percent,
// } from "lucide-react";
// import { format } from "date-fns";

// interface SaleDetailProps {
//   sale: ISale;
//   onBack: () => void;
// }

// export function SaleDetail({ sale, onBack }: SaleDetailProps) {
//   const totalAmount = singleSales?.data?.medicines.reduce(
//     (sum, medicine) => sum + (medicine.total_price || 0),
//     0
//   );

//   const totalDiscount = singleSales?.data?.medicines.reduce(
//     (sum, medicine) => sum + (medicine.discount || 0),
//     0
//   );

//   const getPatientTypeBadge = (type: string) => {
//     const variants = {
//       outdoor: "bg-blue-100 text-blue-800 border-blue-200",
//       indoor: "bg-green-100 text-green-800 border-green-200",
//       general: "bg-gray-100 text-gray-800 border-gray-200",
//     };

//     return (
//       <Badge
//         variant="outline"
//         className={variants[type as keyof typeof variants]}
//       >
//         {type.toUpperCase()}
//       </Badge>
//     );
//   };

//   return (

//   );
// }
