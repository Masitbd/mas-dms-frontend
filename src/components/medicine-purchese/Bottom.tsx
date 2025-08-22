import { RefreshCw, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "rsuite";

const Bottom = ({ watch }: { watch: (p: string) => number }) => {
  const router = useRouter();
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Amount Summary */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="text-lg font-bold text-gray-800">
                ৳{(watch("totalAmount") || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">VAT:</span>
              <span className="text-lg font-bold text-green-600">
                +৳
                {(watch("vatAmount") || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Discount:</span>
              <span className="text-lg font-bold text-red-600">
                -৳
                {(watch("discountAmount") || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ৳
                {(
                  (watch("totalAmount") || 0) +
                    (watch("vatAmount") || 0) -
                    (watch("discountAmount") || 0) || 0
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* <Button
              appearance="subtle"
              size="md"
              startIcon={<RefreshCw className="w-4 h-4" />}
              // onClick={handleReset}
              className="border-gray-300 hover:border-gray-400"
            >
              Reset
            </Button> */}

            <Button
              appearance="subtle"
              size="md"
              startIcon={<X className="w-4 h-4" />}
              onClick={() => router.push("/medicine-purchase")}
              className="border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
              color="red"
            >
              Cancel
            </Button>

            <Button
              appearance="primary"
              size="md"
              startIcon={<Save className="w-4 h-4" />}
              // onClick={handleSubmit(onSubmit)}
              // loading={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 px-6"
              type="submit"
              form="test111"
            >
              Save Purchase
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottom;
