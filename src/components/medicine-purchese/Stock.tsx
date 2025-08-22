import React, { useMemo } from "react";
import Loading from "../layout/Loading";

// ----- Types -----
type Batch = {
  id: string;
  purchaseItemId?: string;
  productId?: string;
  batchNo?: string;
  expiryDate?: string;
  quantityIn?: number;
  quantityOut?: number;
  currentQuantity: number;
  createdAt?: string;
  updatedAt?: string;
};

interface CurrentQuantityDisplayProps {
  /** Array of batch records for a single product */
  batches: Batch[];
  /** If provided, show only this batch's quantity (matches id or purchaseItemId). */
  selectedBatchId?: string;
  /** Optional label text shown above the field */
  label?: string;
  /** Optional wrapper class */
  className?: string;
  loading: boolean;
}

/**
 * CurrentQuantityDisplay
 *
 * Pure data display (not a form input). Renders a read-only, input-like field
 * that shows the current quantity either for a specific batch or total across batches.
 */
export default function CurrentQuantityDisplay({
  batches,
  selectedBatchId,
  label = "Current Quantity",
  className = "",
  loading,
}: CurrentQuantityDisplayProps) {
  const value = useMemo(() => {
    if (!Array.isArray(batches) || batches.length === 0) return 0;

    if (selectedBatchId) {
      const b = batches.find(
        (x) => x.id === selectedBatchId || x.purchaseItemId === selectedBatchId
      );
      return b?.currentQuantity ?? 0;
    }

    return batches.reduce((sum, b) => sum + (b.currentQuantity ?? 0), 0);
  }, [batches, selectedBatchId]);

  return (
    <div className={`w-full ${className} `}>
      <div className="">
        <div className="mb-4 block text-md font-medium text-gray-700">
          {label}
        </div>
        {/* Using <output> to semantically represent a calculated/display value */}
        <output
          aria-live="polite"
          className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-10 py-2 text-gray-900 shadow-sm focus:outline-none relative"
          title={`${value}`}
        >
          {loading ? <Loading size="small" loading={loading} /> : value}
        </output>
      </div>
    </div>
  );
}
