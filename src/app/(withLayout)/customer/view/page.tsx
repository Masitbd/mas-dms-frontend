// src/components/customer/CustomerDetailsModern.tsx
// Next.js App Router usage: app/customer/view/page.tsx -> <CustomerDetailsModern />
"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { Button, ButtonToolbar, Loader } from "rsuite";
import {
  ArrowLeft,
  Pencil,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BadgeCheck,
  ShieldCheck,
  CreditCard,
  Percent,
  FileText,
  HeartPulse,
  Building2,
  Sparkles,
} from "lucide-react";
import { useGetSingleCustomerQuery } from "@/redux/api/customer/customer.api";
import Loading from "@/app/Loading";

type Customer = any;

const safeErrorMessage = (err: any) =>
  err?.data?.message ||
  err?.data?.error ||
  err?.error ||
  err?.message ||
  "Something went wrong.";

const fmt = (v: any) => {
  const s = String(v ?? "").trim();
  return s ? s : "—";
};

const formatDate = (iso?: string | Date | null) => {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const SectionTitle = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 text-slate-800 shadow-sm ring-1 ring-black/5">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    </div>
  </div>
);

const MiniField = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="min-w-0">
    <div className="text-[11px] font-medium text-slate-500">{label}</div>
    <div className="truncate text-sm font-semibold text-slate-900">{value}</div>
  </div>
);

const Chip = ({
  icon,
  text,
  tone = "slate",
}: {
  icon: React.ReactNode;
  text: string;
  tone?: "slate" | "blue" | "green" | "amber" | "red" | "violet";
}) => {
  const toneCls: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-rose-50 text-rose-700 ring-rose-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${toneCls[tone]}`}
    >
      <span className="opacity-80">{icon}</span>
      {text}
    </span>
  );
};

export function CustomerDetailsModern() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid") ?? "";

  const { data, isLoading, isFetching, error } = useGetSingleCustomerQuery(
    uuid,
    {
      skip: !uuid,
    }
  ) as {
    data?: any;
    isLoading: boolean;
    isFetching: boolean;
    error?: any;
  };

  const busy = isLoading || isFetching;

  useEffect(() => {
    if (!uuid) {
      Swal.fire({
        icon: "error",
        title: "Missing uuid",
        text: "Please provide uuid in the URL search params.",
      }).then(() => router.push("/customer"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to load customer",
        text: safeErrorMessage(error),
      });
    }
  }, [error]);

  // unwrap if server responds like { data: customer }
  const customer: Customer | undefined = useMemo(
    () => (data?.data ?? data) as Customer,
    [data]
  );

  const addressText = useMemo(() => {
    const parts = [
      customer?.address?.line1,
      customer?.address?.line2,
      customer?.address?.city,
      customer?.address?.state,
      customer?.address?.postalCode,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  }, [customer]);

  const title = customer?.fullName ? customer.fullName : "Customer";
  const type = customer?.customerType ? String(customer.customerType) : "—";

  const typeIcon =
    type === "Corporate" ? (
      <Building2 className="h-4 w-4" />
    ) : (
      <BadgeCheck className="h-4 w-4" />
    );

  return (
    <div className="min-h-[calc(100vh-2rem)] w-full bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      {/* Loading overlay */}
      {busy && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl border bg-white px-6 py-4 shadow-sm">
            <Loader size="sm" />
            <div className="text-sm font-medium text-slate-800">
              Loading customer...
            </div>
          </div>
        </div>
      )}

      {/* Hero card */}
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6">
          {/* soft decor */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-100 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-violet-100 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <User className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-semibold text-slate-900">
                    {title}
                  </h1>
                  {customer?.uuid && (
                    <Chip
                      icon={<Sparkles className="h-4 w-4" />}
                      text={customer.uuid}
                      tone="blue"
                    />
                  )}
                  <Chip icon={typeIcon} text={type} tone="violet" />
                  {customer?.isActive === false && (
                    <Chip
                      icon={<ShieldCheck className="h-4 w-4" />}
                      text="Inactive"
                      tone="red"
                    />
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Chip
                    icon={<Phone className="h-4 w-4" />}
                    text={fmt(customer?.phone)}
                    tone="slate"
                  />
                  {customer?.email && (
                    <Chip
                      icon={<Mail className="h-4 w-4" />}
                      text={fmt(customer?.email)}
                      tone="slate"
                    />
                  )}
                  {customer?.dateOfBirth && (
                    <Chip
                      icon={<Calendar className="h-4 w-4" />}
                      text={formatDate(customer?.dateOfBirth)}
                      tone="slate"
                    />
                  )}
                </div>

                <p className="mt-3 max-w-2xl text-sm text-slate-600">
                  Clean customer profile snapshot for quick verification at the
                  counter. Use Update to correct details.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                appearance="subtle"
                className="!rounded-xl"
                onClick={() => router.push("/customer")}
                disabled={busy}
                startIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                appearance="primary"
                className="!rounded-xl"
                onClick={() =>
                  router.push(`/customer/new?mode=update&uuid=${uuid}`)
                }
                disabled={busy || !uuid}
                startIcon={<Pencil className="h-4 w-4" />}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid (airy cards, fewer borders) */}
      <div className="mt-5 grid grid-cols-1">
        {/* Left column */}
        <div>
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<BadgeCheck className="h-4 w-4" />}
              title="Profile"
              subtitle="Core customer details"
            />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField label="Full Name" value={fmt(customer?.fullName)} />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField label="Gender" value={fmt(customer?.gender)} />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField
                  label="NID / Passport"
                  value={fmt(customer?.nidOrPassport)}
                />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField
                  label="Loyalty ID"
                  value={fmt(customer?.loyaltyId)}
                />
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-700" />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-slate-500">
                    Address
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-900">
                    {addressText}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<FileText className="h-4 w-4" />}
              title="Notes"
              subtitle="Internal reference"
            />
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              {customer?.notes?.trim() ? customer.notes : "—"}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className=" mt-5">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<CreditCard className="h-4 w-4" />}
              title="Billing"
              subtitle="Credit & discounts"
            />
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <MiniField
                    label="Allow Credit"
                    value={customer?.allowCredit ? "Yes" : "No"}
                  />
                  <ShieldCheck className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <MiniField
                    label="Credit Limit"
                    value={
                      customer?.allowCredit
                        ? fmt(customer?.creditLimit ?? 0)
                        : "0"
                    }
                  />
                  <CreditCard className="h-4 w-4 text-slate-600" />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <MiniField
                    label="Discount %"
                    value={
                      customer?.discountPercent === null ||
                      customer?.discountPercent === undefined
                        ? "—"
                        : String(customer.discountPercent)
                    }
                  />
                  <Percent className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle
              icon={<HeartPulse className="h-4 w-4" />}
              title="Medical"
              subtitle="Optional safety notes"
            />
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField
                  label="Allergies"
                  value={fmt(customer?.medical?.allergies)}
                />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <MiniField
                  label="Chronic Conditions"
                  value={fmt(customer?.medical?.chronicConditions)}
                />
              </div>
            </div>
          </div>

          {/* bottom actions (mobile-friendly) */}
          <div className="mt-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
            <ButtonToolbar className="!m-0 flex w-full gap-2">
              <Button
                appearance="subtle"
                className="!w-1/2 !rounded-xl"
                onClick={() => router.push("/customer")}
                disabled={busy}
                startIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
              <Button
                appearance="primary"
                className="!w-1/2 !rounded-xl"
                onClick={() =>
                  router.push(`/customer/new?mode=update&uuid=${uuid}`)
                }
                disabled={busy || !uuid}
                startIcon={<Pencil className="h-4 w-4" />}
              >
                Update
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    </div>
  );
}

const MainComponent = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerDetailsModern />
    </Suspense>
  );
};
export default MainComponent;
