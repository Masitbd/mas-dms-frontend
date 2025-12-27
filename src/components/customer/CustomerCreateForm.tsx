// src/modules/customer/CustomerCreateForm.tsx
// This is your earlier form, refactored to:
// - accept initialValues (for update mode)
// - accept onSubmitCustomer (so page decides create vs update + alerts)
// - no toaster inside (SweetAlert2 handled in page)

import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ButtonToolbar,
  DatePicker,
  Divider,
  Input,
  InputGroup,
  Panel,
  SelectPicker,
  Tag,
  Toggle,
  Tooltip,
  Whisper,
} from "rsuite";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  ShieldCheck,
  HeartPulse,
  BadgeCheck,
  Building2,
  BadgePercent,
  Info,
} from "lucide-react";

export type CustomerFormValues = {
  customerType: "Regular" | "Patient" | "Corporate";
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: Date | null;
  gender?: "Male" | "Female" | "Other" | "Prefer not to say";
  nidOrPassport?: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;

  loyaltyId?: string;
  allowCredit: boolean;
  creditLimit?: number | null;
  discountPercent?: number | null;

  allergies?: string;
  chronicConditions?: string;
  notes?: string;

  isActive: boolean;
};

type Props = {
  mode?: "create" | "update";
  initialValues?: Partial<CustomerFormValues>;
  onSubmitCustomer: (values: CustomerFormValues) => Promise<void>;
};

function digitsAndPlus(value: string) {
  const trimmed = (value ?? "").trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed.replace(/[^\d]/g, "");
  return plus + digits;
}

function calcAge(dob?: Date | null) {
  if (!dob) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age < 0 ? null : age;
}

function normalizeSpaces(s: string) {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function toNumberOrNull(raw: unknown) {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export default function CustomerCreateForm({
  mode = "create",
  initialValues,
  onSubmitCustomer,
}: Props) {
  const defaultValues: CustomerFormValues = useMemo(
    () => ({
      customerType: "Patient",
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: null,
      gender: "Prefer not to say",
      nidOrPassport: "",

      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",

      loyaltyId: "",
      allowCredit: false,
      creditLimit: null,
      discountPercent: null,

      allergies: "",
      chronicConditions: "",
      notes: "",

      isActive: true,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<CustomerFormValues>({
    defaultValues,
    mode: "onBlur",
  });

  // When update data arrives, load into form
  useEffect(() => {
    if (initialValues) {
      reset({ ...defaultValues, ...initialValues });
    }
  }, [initialValues, reset, defaultValues]);

  const dob = watch("dateOfBirth");
  const allowCredit = watch("allowCredit");
  const customerType = watch("customerType");
  const age = calcAge(dob);

  const customerTypeOptions = [
    { label: "Patient", value: "Patient" },
    { label: "Regular", value: "Regular" },
    { label: "Corporate", value: "Corporate" },
  ];

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const submit = async (values: CustomerFormValues) => {
    // minimal normalization (hard rules enforced in backend)
    const normalized: CustomerFormValues = {
      ...values,
      fullName: normalizeSpaces(values.fullName),
      phone: digitsAndPlus(values.phone),
      email: (values.email ?? "").trim(),
      nidOrPassport: (values.nidOrPassport ?? "").trim(),
      addressLine1: (values.addressLine1 ?? "").trim(),
      addressLine2: (values.addressLine2 ?? "").trim(),
      city: (values.city ?? "").trim(),
      state: (values.state ?? "").trim(),
      postalCode: (values.postalCode ?? "").trim(),
      loyaltyId: (values.loyaltyId ?? "").trim(),
      allergies: (values.allergies ?? "").trim(),
      chronicConditions: (values.chronicConditions ?? "").trim(),
      notes: (values.notes ?? "").trim(),
      creditLimit: values.allowCredit ? values.creditLimit ?? 0 : 0,
      discountPercent: values.discountPercent ?? null,
    };

    await onSubmitCustomer(normalized);
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] w-full p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 rounded-2xl border bg-white shadow-sm">
        <div className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900">
                  {mode === "update" ? "Update Customer" : "Add Customer"}
                </h1>
                <Tag className="!rounded-full" color="blue">
                  Pharmacy CRM
                </Tag>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Keep records tight—this improves POS speed and reconciliation
                quality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Whisper
              placement="bottomEnd"
              trigger="hover"
              speaker={
                <Tooltip>Required fields are marked. Keep it clean.</Tooltip>
              }
            >
              <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs text-slate-600">
                <Info className="h-4 w-4" />
                Data quality matters
              </div>
            </Whisper>

            <div
              className={`rounded-full px-3 py-2 text-xs ${
                isDirty
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-slate-50 text-slate-600 border border-slate-200"
              }`}
            >
              {isDirty ? "Unsaved changes" : "Ready"}
            </div>
          </div>
        </div>

        <Divider className="!my-0" />

        {/* Quick badges */}
        <div className="flex flex-wrap items-center gap-2 p-4">
          <span className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
            <ShieldCheck className="h-4 w-4" />
            Validation enabled
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
            <BadgeCheck className="h-4 w-4" />
            Clean formatting
          </span>
          {age !== null && (
            <span className="inline-flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
              <HeartPulse className="h-4 w-4" />
              Age: {age}
            </span>
          )}
          {customerType === "Corporate" && (
            <span className="inline-flex items-center gap-2 rounded-full border bg-indigo-50 px-3 py-1.5 text-xs text-indigo-700">
              <Building2 className="h-4 w-4" />
              Corporate profile
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-5">
        {/* Identity */}
        <Panel
          bordered
          className="!rounded-2xl !border !bg-white !shadow-sm"
          header={
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-700" />
              <span className="font-semibold text-slate-900">Identity</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Customer Type <span className="text-rose-600">*</span>
              </label>
              <Controller
                control={control}
                name="customerType"
                rules={{ required: "Customer type is required." }}
                render={({ field }) => (
                  <SelectPicker
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    onBlur={field.onBlur}
                    data={customerTypeOptions}
                    cleanable={false}
                    searchable={false}
                    className="w-full"
                  />
                )}
              />
              {errors.customerType && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.customerType.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <Controller
                control={control}
                name="fullName"
                rules={{
                  required: "Full name is required.",
                  minLength: { value: 2, message: "Too short." },
                  maxLength: { value: 80, message: "Too long." },
                  validate: (v) =>
                    normalizeSpaces(v).length >= 2 || "Enter a valid name.",
                }}
                render={({ field }) => (
                  <>
                    <InputGroup className="w-full">
                      <InputGroup.Addon>
                        <User className="h-4 w-4" />
                      </InputGroup.Addon>
                      <Input
                        value={field.value}
                        name={field.name}
                        inputRef={field.ref}
                        onBlur={() => {
                          field.onChange(normalizeSpaces(field.value));
                          field.onBlur();
                        }}
                        onChange={(value) => field.onChange(value)}
                        placeholder="e.g., Ayesha Rahman"
                        className="w-full"
                      />
                    </InputGroup>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.fullName.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Phone <span className="text-rose-600">*</span>
              </label>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: "Phone is required.",
                  validate: (v) => {
                    const norm = digitsAndPlus(v);
                    const digits = norm.replace(/[^\d]/g, "");
                    if (digits.length < 8)
                      return "Phone number looks too short.";
                    if (digits.length > 15)
                      return "Phone number looks too long.";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputGroup className="w-full">
                      <InputGroup.Addon>
                        <Phone className="h-4 w-4" />
                      </InputGroup.Addon>
                      <Input
                        value={field.value}
                        name={field.name}
                        inputRef={field.ref}
                        onChange={(value) => field.onChange(value)}
                        onBlur={() => {
                          field.onChange(digitsAndPlus(field.value));
                          field.onBlur();
                        }}
                        placeholder="e.g., +8801XXXXXXXXX"
                        className="w-full"
                      />
                    </InputGroup>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Email
              </label>
              <Controller
                control={control}
                name="email"
                rules={{
                  validate: (v) => {
                    const val = (v ?? "").trim();
                    if (!val) return true;
                    return (
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ||
                      "Invalid email format."
                    );
                  },
                }}
                render={({ field }) => (
                  <>
                    <InputGroup className="w-full">
                      <InputGroup.Addon>
                        <Mail className="h-4 w-4" />
                      </InputGroup.Addon>
                      <Input
                        value={field.value ?? ""}
                        name={field.name}
                        inputRef={field.ref}
                        onChange={(value) => field.onChange(value)}
                        onBlur={() => {
                          field.onChange((field.value ?? "").trim());
                          field.onBlur();
                        }}
                        placeholder="e.g., customer@email.com"
                        className="w-full"
                      />
                    </InputGroup>
                    {errors.email && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.email.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Date of Birth
              </label>
              <Controller
                control={control}
                name="dateOfBirth"
                rules={{
                  validate: (v) => {
                    if (!v) return true;
                    if (v.getTime() > Date.now())
                      return "DOB cannot be in the future.";
                    return true;
                  },
                }}
                render={({ field }) => (
                  <InputGroup className="w-full">
                    <InputGroup.Addon>
                      <Calendar className="h-4 w-4" />
                    </InputGroup.Addon>
                    <DatePicker
                      oneTap
                      value={field.value ?? null}
                      onChange={(val) => field.onChange(val ?? null)}
                      placeholder="Select date"
                      className="w-full"
                      editable={false}
                      format="yyyy-MM-dd"
                    />
                  </InputGroup>
                )}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Gender
              </label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <SelectPicker
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    onBlur={field.onBlur}
                    data={genderOptions}
                    cleanable={false}
                    searchable={false}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-800">
                NID / Passport (optional)
              </label>
              <Controller
                control={control}
                name="nidOrPassport"
                rules={{ maxLength: { value: 40, message: "Too long." } }}
                render={({ field }) => (
                  <>
                    <InputGroup className="w-full">
                      <InputGroup.Addon>
                        <FileText className="h-4 w-4" />
                      </InputGroup.Addon>
                      <Input
                        value={field.value ?? ""}
                        name={field.name}
                        inputRef={field.ref}
                        onChange={(value) => field.onChange(value)}
                        onBlur={() => {
                          field.onChange((field.value ?? "").trim());
                          field.onBlur();
                        }}
                        placeholder="For verification, if required"
                        className="w-full"
                      />
                    </InputGroup>
                    {errors.nidOrPassport && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.nidOrPassport.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </Panel>

        {/* Address */}
        <Panel
          bordered
          className="!rounded-2xl !border !bg-white !shadow-sm"
          header={
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-700" />
              <span className="font-semibold text-slate-900">Address</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["addressLine1", "addressLine2"] as const).map((name, i) => (
              <div key={name} className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-800">
                  {i === 0 ? "Address Line 1" : "Address Line 2"}
                </label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? ""}
                      name={field.name}
                      inputRef={field.ref}
                      onChange={(value) => field.onChange(value)}
                      onBlur={() => {
                        field.onChange((field.value ?? "").trim());
                        field.onBlur();
                      }}
                      placeholder={
                        i === 0
                          ? "House / Road / Area"
                          : "Apartment / Landmark (optional)"
                      }
                      className="w-full"
                    />
                  )}
                />
              </div>
            ))}

            {(["city", "state", "postalCode"] as const).map((name) => (
              <div key={name}>
                <label className="mb-1 block text-sm font-medium text-slate-800">
                  {name === "city"
                    ? "City"
                    : name === "state"
                    ? "State / District"
                    : "Postal Code"}
                </label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      value={field.value ?? ""}
                      name={field.name}
                      inputRef={field.ref}
                      onChange={(value) => field.onChange(value)}
                      onBlur={() => {
                        field.onChange((field.value ?? "").trim());
                        field.onBlur();
                      }}
                      placeholder={name === "postalCode" ? "ZIP / Postal" : ""}
                      className="w-full"
                    />
                  )}
                />
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-3">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Active Customer
                </p>
                <p className="text-xs text-slate-500">
                  Disable to hide from POS search.
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Toggle
                    checked={field.value}
                    onChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
            </div>
          </div>
        </Panel>

        {/* Billing */}
        <Panel
          bordered
          className="!rounded-2xl !border !bg-white !shadow-sm"
          header={
            <div className="flex items-center gap-2">
              <BadgePercent className="h-4 w-4 text-slate-700" />
              <span className="font-semibold text-slate-900">
                Billing & Loyalty
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Loyalty ID (optional)
              </label>
              <Controller
                control={control}
                name="loyaltyId"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    name={field.name}
                    inputRef={field.ref}
                    onChange={(value) => field.onChange(value)}
                    onBlur={() => {
                      field.onChange((field.value ?? "").trim());
                      field.onBlur();
                    }}
                    placeholder="e.g., LTY-000123"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Default Discount % (optional)
              </label>
              <Controller
                control={control}
                name="discountPercent"
                render={({ field }) => (
                  <Input
                    value={field.value == null ? "" : String(field.value)}
                    onChange={(value) => field.onChange(toNumberOrNull(value))}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    placeholder="0 - 100"
                    className="w-full"
                    inputMode="decimal"
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-3 md:col-span-2">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Allow Credit
                </p>
                <p className="text-xs text-slate-500">
                  Enable only for approved customers.
                </p>
              </div>
              <Controller
                control={control}
                name="allowCredit"
                render={({ field }) => (
                  <Toggle
                    checked={field.value}
                    onChange={(checked) => {
                      field.onChange(checked);
                      if (!checked)
                        setValue("creditLimit", 0, { shouldDirty: true });
                    }}
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Credit Limit{" "}
                {allowCredit ? <span className="text-rose-600">*</span> : ""}
              </label>
              <Controller
                control={control}
                name="creditLimit"
                render={({ field }) => (
                  <InputGroup className="w-full">
                    <InputGroup.Addon>
                      <ShieldCheck className="h-4 w-4" />
                    </InputGroup.Addon>
                    <Input
                      value={field.value == null ? "" : String(field.value)}
                      onChange={(value) =>
                        field.onChange(toNumberOrNull(value))
                      }
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      placeholder={
                        allowCredit ? "Enter approved limit" : "Disabled"
                      }
                      className="w-full"
                      disabled={!allowCredit}
                      inputMode="numeric"
                    />
                  </InputGroup>
                )}
              />
            </div>
          </div>
        </Panel>

        {/* Medical Notes */}
        <Panel
          bordered
          className="!rounded-2xl !border !bg-white !shadow-sm"
          header={
            <div className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-slate-700" />
              <span className="font-semibold text-slate-900">
                Medical Notes
              </span>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Allergies
              </label>
              <Controller
                control={control}
                name="allergies"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    name={field.name}
                    inputRef={field.ref}
                    onChange={(value) => field.onChange(value)}
                    onBlur={() => {
                      field.onChange((field.value ?? "").trim());
                      field.onBlur();
                    }}
                    placeholder="e.g., Penicillin"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Chronic Conditions
              </label>
              <Controller
                control={control}
                name="chronicConditions"
                render={({ field }) => (
                  <Input
                    value={field.value ?? ""}
                    name={field.name}
                    inputRef={field.ref}
                    onChange={(value) => field.onChange(value)}
                    onBlur={() => {
                      field.onChange((field.value ?? "").trim());
                      field.onBlur();
                    }}
                    placeholder="e.g., Hypertension"
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Internal Notes
              </label>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <Input
                    as="textarea"
                    rows={3}
                    value={field.value ?? ""}
                    name={field.name}
                    inputRef={field.ref}
                    onChange={(value) => field.onChange(value)}
                    onBlur={() => {
                      field.onChange((field.value ?? "").trim());
                      field.onBlur();
                    }}
                    placeholder="Any operational notes..."
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>
        </Panel>

        {/* Footer */}
        <div className="sticky bottom-3 z-10">
          <div className="rounded-2xl border bg-white/90 p-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="text-xs text-slate-600">
                <span className="font-medium text-slate-800">Note:</span> Use
                verified phone numbers to reduce duplicate customers.
              </div>

              <ButtonToolbar className="!m-0 flex items-center gap-2">
                <Button
                  appearance="subtle"
                  className="!rounded-xl"
                  onClick={() =>
                    reset({ ...defaultValues, ...(initialValues ?? {}) })
                  }
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  appearance="primary"
                  type="submit"
                  className="!rounded-xl"
                  loading={isSubmitting}
                >
                  {mode === "update" ? "Update Customer" : "Create Customer"}
                </Button>
              </ButtonToolbar>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
