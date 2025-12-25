/* ============================================================
 * 9) CUSTOMER INFO FORM (RHF + CONDITIONAL VALIDATION)
 * ============================================================
 */

import { Controller, useForm, useWatch } from "react-hook-form";
import { CustomerInfo, CustomerMode } from "./SalesTypes";
import { useEffect } from "react";
import { RHFTextInput } from "./RHFTextInput";

export function CustomerInfoForm({
  mode,
  value,
  onChange,
  syncKey,
}: {
  mode: CustomerMode;
  value: CustomerInfo;
  onChange: (next: CustomerInfo) => void;
  syncKey: number;
}) {
  const form = useForm<CustomerInfo>({
    defaultValues: value,
    mode: "onChange",
  });

  const { control, handleSubmit, reset, setValue, clearErrors, watch } = form;

  useEffect(() => {
    reset(value);
  }, [syncKey, reset, value]);

  useEffect(() => {
    const sub = watch((vals) => onChange(vals as CustomerInfo));
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  const patientType = useWatch({ control, name: "patientType" });
  const isIndoor = patientType === "indoor";

  useEffect(() => {
    if (patientType === "outdoor") {
      setValue("bedNo", "");
      setValue("indoorBillNo", "");
      clearErrors(["bedNo", "indoorBillNo"]);
    }
  }, [patientType, clearErrors, setValue]);

  const onSubmit = (vals: CustomerInfo) => onChange(vals);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">
          Customer Info
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <RHFTextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Customer name"
        />
        <RHFTextInput
          control={control}
          name="field"
          label="Field"
          placeholder="Any label / group"
        />
        <RHFTextInput
          control={control}
          name="contactNo"
          label="Contact No"
          placeholder="e.g. 01XXXXXXXXX"
        />
        <RHFTextInput
          control={control}
          name="address"
          label="Address"
          placeholder="Customer address"
        />

        <div>
          <div className="mb-1 text-xs font-medium text-slate-600">
            Patient Type
          </div>

          <Controller
            control={control}
            name="patientType"
            defaultValue="outdoor"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange("outdoor")}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    field.value === "outdoor"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Outdoor
                </button>

                <button
                  type="button"
                  onClick={() => field.onChange("indoor")}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm",
                    field.value === "indoor"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                >
                  Indoor
                </button>
              </div>
            )}
          />
        </div>

        {isIndoor ? (
          <>
            <RHFTextInput
              control={control}
              name="bedNo"
              label="Bed No"
              placeholder="Required for indoor"
              rules={{
                validate: (v) =>
                  isIndoor
                    ? !!String(v ?? "").trim() || "Bed No is required"
                    : true,
              }}
            />

            <RHFTextInput
              control={control}
              name="indoorBillNo"
              label="Indoor Bill No"
              placeholder="Required for indoor"
              rules={{
                validate: (v) =>
                  isIndoor
                    ? !!String(v ?? "").trim() || "Indoor Bill No is required"
                    : true,
              }}
            />
          </>
        ) : null}
      </div>
    </form>
  );
}
