// src/pages/sales/CustomerUpsertPage.tsx (Next.js App Router)
// If you're in app/ directory, place it like: app/sales/customer/page.tsx
// Ensure this file is a client component.

"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import {
  useCreateCustomerMutation,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
} from "@/redux/api/customer/customer.api";
import CustomerCreateForm, {
  type CustomerFormValues,
} from "@/components/customer/CustomerCreateForm";
import Loading from "@/app/Loading";

type ApiCustomer = any; // replace with your real type

const safeErrorMessage = (err: any) => {
  return (
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    err?.message ||
    "Something went wrong."
  );
};

const trimOrUndef = (v?: string) => {
  const s = (v ?? "").trim();
  return s ? s : undefined;
};

const stripEmptyObj = <T extends Record<string, any>>(obj: T) => {
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    if (v === null) return;
    if (typeof v === "string" && v.trim() === "") return;
    out[k] = v;
  });
  return Object.keys(out).length ? out : undefined;
};

const toApiPayload = (v: CustomerFormValues) => {
  const address = stripEmptyObj({
    line1: trimOrUndef(v.addressLine1),
    line2: trimOrUndef(v.addressLine2),
    city: trimOrUndef(v.city),
    state: trimOrUndef(v.state),
    postalCode: trimOrUndef(v.postalCode),
  });

  const medical = stripEmptyObj({
    allergies: trimOrUndef(v.allergies),
    chronicConditions: trimOrUndef(v.chronicConditions),
  });

  return {
    customerType: v.customerType,
    fullName: v.fullName,
    phone: v.phone,
    email: trimOrUndef(v.email),
    dateOfBirth: v.dateOfBirth ?? null,
    gender: v.gender,
    nidOrPassport: trimOrUndef(v.nidOrPassport),

    address,
    loyaltyId: trimOrUndef(v.loyaltyId),

    allowCredit: v.allowCredit,
    creditLimit: v.allowCredit ? Number(v.creditLimit ?? 0) : 0,
    discountPercent: v.discountPercent ?? null,

    medical,
    notes: trimOrUndef(v.notes),

    isActive: v.isActive,
  };
};

const toFormDefaultsFromApi = (c: ApiCustomer): Partial<CustomerFormValues> => {
  return {
    customerType: c?.customerType ?? "Patient",
    fullName: c?.fullName ?? "",
    phone: c?.phone ?? "",
    email: c?.email ?? "",
    dateOfBirth: c?.dateOfBirth ? new Date(c.dateOfBirth) : null,
    gender: c?.gender ?? "Prefer not to say",
    nidOrPassport: c?.nidOrPassport ?? "",

    addressLine1: c?.address?.line1 ?? "",
    addressLine2: c?.address?.line2 ?? "",
    city: c?.address?.city ?? "",
    state: c?.address?.state ?? "",
    postalCode: c?.address?.postalCode ?? "",

    loyaltyId: c?.loyaltyId ?? "",
    allowCredit: Boolean(c?.allowCredit),
    creditLimit: c?.creditLimit ?? 0,
    discountPercent: c?.discountPercent ?? null,

    allergies: c?.medical?.allergies ?? "",
    chronicConditions: c?.medical?.chronicConditions ?? "",
    notes: c?.notes ?? "",

    isActive: c?.isActive ?? true,
  };
};

export function CustomerUpsertPage() {
  const searchParams = useSearchParams();

  const modeParam = (searchParams.get("mode") ?? "create").toLowerCase();
  const uuidParam = searchParams.get("uuid") ?? "";

  const isUpdateMode = modeParam === "update" && Boolean(uuidParam);

  const [formKey, setFormKey] = useState(0);

  const [createCustomer, { isLoading: isCreating }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateCustomerMutation();

  const {
    data: singleCustomerData,
    isFetching: isFetchingCustomer,
    isLoading: isLoadingCustomer,
    error: fetchError,
  } = useGetSingleCustomerQuery(uuidParam, {
    skip: !isUpdateMode,
  });

  useEffect(() => {
    if (modeParam === "update" && !uuidParam) {
      Swal.fire({
        icon: "error",
        title: "Missing uuid",
        text: "mode=update requires a uuid in the URL search params.",
      });
    }
  }, [modeParam, uuidParam]);

  useEffect(() => {
    if (fetchError) {
      Swal.fire({
        icon: "error",
        title: "Failed to load customer",
        text: safeErrorMessage(fetchError),
      });
    }
  }, [fetchError]);

  const initialValues = useMemo(() => {
    if (!isUpdateMode) return undefined;
    if (!singleCustomerData) return undefined;

    // If your API wraps as { data: customer }, adjust:
    const customer = (singleCustomerData as any)?.data ?? singleCustomerData;
    return toFormDefaultsFromApi(customer);
  }, [isUpdateMode, singleCustomerData]);

  const busy =
    isFetchingCustomer || isLoadingCustomer || isCreating || isUpdating;

  const router = useRouter();

  const handleSubmitCustomer = async (values: CustomerFormValues) => {
    try {
      const payload = toApiPayload(values);

      if (isUpdateMode) {
        await updateCustomer({ uuid: uuidParam, data: payload }).unwrap();

        await Swal.fire({
          icon: "success",
          title: "Customer updated",
          text: "The customer record has been updated successfully.",
          timer: 1700,
          showConfirmButton: false,
        });
        return;
      }

      await createCustomer(payload).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Customer created",
        text: "The customer has been created successfully.",
        timer: 1700,
        showConfirmButton: false,
      });

      // reset form after create
      setFormKey((k) => k + 1);
      router.push("/customer");
    } catch (err: any) {
      await Swal.fire({
        icon: "error",
        title: "Operation failed",
        text: safeErrorMessage(err),
      });
    }
  };

  return (
    <div className="relative">
      {busy && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="rounded-2xl border bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <div className="text-sm font-medium text-slate-800">
                Processing customer data...
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomerCreateForm
        key={formKey}
        mode={isUpdateMode ? "update" : "create"}
        initialValues={initialValues}
        onSubmitCustomer={handleSubmitCustomer}
      />
    </div>
  );
}

const MainComponent = () => {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerUpsertPage />
    </Suspense>
  );
};

export default MainComponent;
