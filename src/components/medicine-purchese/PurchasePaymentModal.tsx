import { useCreatePurchasePaymentMutation } from "@/redux/api/purchasePayment/purchasePayment.api";
import { AlertCircle, Loader2, X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Purchase } from "./MedicinePurcheseTypes";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: React.ReactNode;
  widthClass?: string; // e.g., "max-w-lg"
  children: React.ReactNode;
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
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  widthClass = "max-w-lg",
  children,
}: ModalProps) {
  // Close on Esc
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={`w-full ${widthClass} overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                {title && <h3 className="text-lg font-semibold">{title}</h3>}
                {subtitle}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Body (caller renders content, including its own footer/buttons if desired) */}
          {children}
        </div>
      </div>
    </div>
  );
}

// ================= CollectPurchasePaymentModal (react-hook-form) =================
export type CollectPurchasePaymentModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  purchase: Purchase;
};

type FormValues = {
  amount: number;
  method: string;
  note?: string;
};

type CreatePaymentPayload = FormValues;

export function CollectPurchasePaymentModal({
  isOpen,
  setOpen,
  totalAmount,
  paidAmount,
  dueAmount,
  purchase,
}: CollectPurchasePaymentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { amount: undefined as any, method: "", note: "" },
    mode: "onBlur",
  });

  const close = React.useCallback(() => {
    reset();
    setOpen(false);
  }, [reset, setOpen]);

  const [create, { isLoading: PurchasePaymentLoading }] =
    useCreatePurchasePaymentMutation();
  async function createPurchasePaymentApi(payload: CreatePaymentPayload) {
    const data = { ...payload, purchaseId: purchase?._id };
    const result = create(data).unwrap();

    // Demo stub
    return result;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await createPurchasePaymentApi(values);
      if ((res as any).success) {
        await Swal.fire({
          icon: "success",
          title: "Payment recorded",
          text: `Paid ${formatMoney(values.amount)} via ${values.method}.`,
          timer: 1800,
          showConfirmButton: false,
        });
        close();
      } else {
        throw new Error("Unknown API response");
      }
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Failed to record payment",
        text: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Pay Purchase Payment"
      subtitle={
        <p className="mt-0.5 text-xs text-zinc-500">
          Total: <strong>{formatMoney(totalAmount)}</strong> · Paid:{" "}
          <strong>{formatMoney(paidAmount)}</strong> · Due:{" "}
          <strong>{formatMoney(dueAmount)}</strong>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4">
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min={0}
              placeholder="Enter amount"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
                validate: {
                  positive: (v: any) =>
                    (v ?? 0) > 0 || "Amount must be greater than 0",
                  maxDue: (v: any) =>
                    v <= dueAmount ||
                    `Amount cannot exceed due (${formatMoney(dueAmount)})`,
                },
              })}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.amount
                  ? "border-red-500 focus:ring-red-200"
                  : "border-zinc-300 focus:ring-zinc-300"
              }`}
            />
            {errors.amount && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4" /> {errors.amount.message}
              </div>
            )}
          </div>

          {/* Method */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Method <span className="text-red-600">*</span>
            </label>
            <select
              {...register("method", { required: "Method is required" })}
              className={`w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 ${
                errors.method
                  ? "border-red-500 focus:ring-red-200"
                  : "border-zinc-300 focus:ring-zinc-300"
              }`}
            >
              <option value="">Select a method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bkash">bKash</option>
              <option value="bank">Bank Transfer</option>
            </select>
            {errors.method && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="h-4 w-4" /> {errors.method.message}
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="mb-1 block text-sm font-medium">Note</label>
            <textarea
              rows={3}
              placeholder="Optional note (reference, transaction id, etc.)"
              {...register("note")}
              className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-200 px-1 pt-4">
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
