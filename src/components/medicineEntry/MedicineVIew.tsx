import { ENUM_MODE } from "@/enums/EnumMode";
import {
  Package,
  AlertCircle,
  Calendar,
  DollarSign,
  TrendingDown,
  Bell,
  FileQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "rsuite";

interface Category {
  _id?: string;
  categoryId?: string;
  name?: string;
  slug?: string;
  "brand names count"?: number;
}

interface Supplier {
  _id?: string;
  supplierId?: string;
  name?: string;
  contactPerson?: string;
  address?: string;
  phone?: string;
  fax?: string;
  city?: string;
  country?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  id?: string;
}

interface Medicine {
  _id?: string;
  medicineId?: string;
  name?: string;
  genericName?: {
    name: string;
  };
  category?: Category;
  supplierName?: Supplier;
  reOrderLevel?: number;
  unit?: string;
  openingBalance?: number;
  openingBalanceDate?: string;
  openingBalanceRate?: number;
  discount?: number;
  alertQty?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  id?: string;
}

interface MedicineViewProps {
  medicine?: Medicine | null;
}

export default function MedicineView({ medicine }: MedicineViewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const router = useRouter();
  const buttonComponent = (
    <>
      <div className="my-5 flex gap-2 justify-end px-4">
        <Button
          appearance="primary"
          color="red"
          size="lg"
          onClick={() => router.push("/medicine-entry")}
        >
          Back
        </Button>
        <Button
          appearance="primary"
          color="blue"
          size="lg"
          onClick={() =>
            router.push(
              `/medicine-entry/create?id=${medicine?._id}&mode=${ENUM_MODE.UPDATE}`
            )
          }
        >
          Update
        </Button>
      </div>
    </>
  );

  if (!medicine) {
    return (
      <div className="mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <FileQuestion className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Medicine Data
            </h2>
            <p className="text-gray-500">
              No medicine information available to display.
            </p>
          </div>
          {buttonComponent}
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {medicine.name || "Unknown Medicine"}
              </h1>
              <p className="text-gray-600 text-sm">
                {medicine?.genericName?.name || "Generic name not available"}
              </p>
            </div>
            {medicine.medicineId && (
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Medicine ID</p>
                <p className="text-gray-900 font-semibold">
                  {medicine.medicineId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Category & Supplier Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Category */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Category
                </h2>
              </div>
              {medicine.category ? (
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">
                    {medicine.category.name || "N/A"}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category ID:</span>
                    <span className="text-gray-700 font-medium">
                      {medicine.category.categoryId || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Brand Names:</span>
                    <span className="text-gray-700 font-medium">
                      {medicine.category["brand names count"] ?? "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No category information available
                </p>
              )}
            </div>

            {/* Supplier */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Supplier
                </h2>
              </div>
              {medicine.supplierName ? (
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">
                    {medicine.supplierName.name || "N/A"}
                  </p>
                  {medicine.supplierName.contactPerson && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contact Person:</span>
                      <span className="text-gray-700">
                        {medicine.supplierName.contactPerson}
                      </span>
                    </div>
                  )}
                  {medicine.supplierName.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <span className="text-gray-700">
                        {medicine.supplierName.phone}
                      </span>
                    </div>
                  )}
                  {medicine.supplierName.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-700 truncate">
                        {medicine.supplierName.email}
                      </span>
                    </div>
                  )}
                  {(medicine.supplierName.city ||
                    medicine.supplierName.country) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-700">
                        {[
                          medicine.supplierName.city,
                          medicine.supplierName.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No supplier information available
                </p>
              )}
            </div>
          </div>

          {/* Inventory Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Inventory Details
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Opening Balance</span>
                  <TrendingDown className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {medicine.openingBalance ?? "N/A"} {medicine.unit || ""}
                </p>
                {medicine.openingBalanceRate !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">
                    Rate: ${medicine.openingBalanceRate}/
                    {medicine.unit || "unit"}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Re-order Level</span>
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {medicine.reOrderLevel ?? "N/A"} {medicine.unit || ""}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Alert Quantity</span>
                  <Bell className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {medicine.alertQty ?? "N/A"} {medicine.unit || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Dates */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Discount</p>
                <p className="text-xl font-semibold text-gray-900">
                  {medicine.discount !== undefined
                    ? `${medicine.discount}%`
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Opening Balance Date
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(medicine.openingBalanceDate)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(medicine.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {buttonComponent}
      </div>
    </div>
  );
}
