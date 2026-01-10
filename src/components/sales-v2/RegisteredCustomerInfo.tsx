// src/components/customer/PatientMiniSummary.tsx
import React from "react";

type PatientType = "Outdoor" | "Indoor";

type Props = {
  customerInfo: {
    fullName?: string;
    phone?: string;
    address?: string;
    customerType?: PatientType;
    bedNo?: string;
    indoorBillNo?: string;
    name?: string;
    contactNo?: string;
    patientType: string;
  };
};

const Field = ({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) => {
  const v = (value ?? "").trim();
  return (
    <div className="min-w-0">
      <div className="text-[12px] font-medium text-slate-600">{label}</div>
      <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-900">
        {v || <span className="text-slate-400">{placeholder ?? "—"}</span>}
      </div>
    </div>
  );
};

const TypePill = ({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) => (
  <div
    className={[
      "rounded-full px-4 py-2 text-sm font-medium",
      active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700",
    ].join(" ")}
  >
    {children}
  </div>
);

export default function PatientMiniSummary({ customerInfo }: Props) {
  const {
    fullName,
    phone,
    address,
    customerType,
    bedNo,
    indoorBillNo,
    name,
    contactNo,
    patientType,
  } = customerInfo;
  const isIndoor = customerType || patientType == "indoor";

  return (
    <div className="w-full">
      {/* Top row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <Field
            label="Name"
            value={name ?? fullName}
            placeholder="Customer name"
          />
        </div>

        <div className="md:col-span-3">
          <Field
            label="Contact No"
            value={phone ?? contactNo}
            placeholder="e.g. 01XXXXXXXXX"
          />
        </div>

        <div className="md:col-span-4">
          <Field
            label="Address"
            value={address}
            placeholder="Customer address"
          />
        </div>

        <div className="md:col-span-2">
          <div className="text-[12px] font-medium text-slate-600">
            Patient Type
          </div>
          <div className="mt-1 flex items-center gap-2">
            <TypePill active={!isIndoor}>Outdoor</TypePill>
            <TypePill active={isIndoor as boolean}>Indoor</TypePill>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      {isIndoor ?? (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <Field
              label="Bed No"
              value={isIndoor ? bedNo : ""}
              placeholder={isIndoor ? "Bed number" : "Required for indoor"}
            />
          </div>

          <div className="md:col-span-3">
            <Field
              label="Indoor Bill No"
              value={isIndoor ? indoorBillNo : ""}
              placeholder={isIndoor ? "Bill number" : "Required for indoor"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
