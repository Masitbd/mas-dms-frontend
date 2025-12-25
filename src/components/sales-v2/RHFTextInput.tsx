/* ============================================================
 * 10) REUSABLE RHF TEXT INPUT
 * ============================================================
 */

import { Control, Controller, RegisterOptions } from "react-hook-form";
import { CustomerInfo } from "./SalesTypes";
import { Input } from "rsuite";

export function RHFTextInput({
  control,
  name,
  label,
  placeholder,
  disabled,
  rules,
}: {
  control: Control<CustomerInfo>;
  name: keyof CustomerInfo;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<CustomerInfo, any>;
}) {
  return (
    <Controller
      control={control}
      name={name as any}
      rules={rules}
      render={({ field, fieldState }) => (
        <div>
          <div className="mb-1 text-xs font-medium text-slate-600">{label}</div>
          <Input
            value={(field.value as any) ?? ""}
            onChange={(val) => field.onChange(val)}
            onBlur={field.onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className="rounded-xl"
          />
          {fieldState.error?.message ? (
            <div className="mt-1 text-xs text-red-600">
              {fieldState.error.message}
            </div>
          ) : null}
        </div>
      )}
    />
  );
}
