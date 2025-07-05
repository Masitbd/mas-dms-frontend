import { Printer, RefreshCw, Save, X } from "lucide-react";
import React from "react";
import { Button } from "rsuite";

const Bottom = () => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Amount Summary */}
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="text-lg font-bold text-gray-800">
                ৳ 80000
                {/* {(watch("totalAmount") || 0).toFixed(2)} */}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">VAT:</span>
              <span className="text-lg font-bold text-green-600">
                +৳ 8787878
                {/* {(watch("vatAmount") || 0).toFixed(2)} */}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Discount:</span>
              <span className="text-lg font-bold text-red-600">
                -৳ 55555
                {/* {(watch("discountAmount") || 0).toFixed(2)} */}
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-gray-700 font-medium">Total:</span>
              <span className="text-xl font-bold text-blue-600">
                ৳ 50000
                {/* {calculateFinalAmount().toFixed(2)} */}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              appearance="subtle"
              size="md"
              startIcon={<Printer className="w-4 h-4" />}
              // onClick={handlePrint}
              className="border-gray-300 hover:border-gray-400"
            >
              Print
            </Button>

            <Button
              appearance="subtle"
              size="md"
              startIcon={<RefreshCw className="w-4 h-4" />}
              // onClick={handleReset}
              className="border-gray-300 hover:border-gray-400"
            >
              Reset
            </Button>

            <Button
              appearance="subtle"
              size="md"
              startIcon={<X className="w-4 h-4" />}
              // onClick={handleCancel}
              className="border-red-300 hover:border-red-400 text-red-600 hover:text-red-700"
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
