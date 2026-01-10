"use client";

import { useMemo, useState } from "react";
import { Panel } from "rsuite";
import {
  selectCustomer,
  selectCustomerMode,
  setCustomer,
  setCustomerMode,
} from "@/redux/features/sales/salesDraftSlice";
import type { CustomerInfo, CustomerMode } from "./SalesTypes";
import { CustomerDetailsModule } from "../sales-v2/CustomerDetailsModule";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

// keep your existing CustomerDetailsModule code in this file or import it
// (I’m using your earlier module pattern but now it dispatches)

export function CustomerModule() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectCustomerMode);
  const customer = useAppSelector(selectCustomer);

  const blankCustomer: CustomerInfo = useMemo(
    () => ({
      customerId: undefined,
      name: "",
      field: "",
      address: "",
      contactNo: "",
      patientType: "outdoor",
      bedNo: "",
      indoorBillNo: "",
    }),
    []
  );

  // if you need update defaults, keep locally or fetch from server
  const updateDefaults: CustomerInfo = useMemo(
    () => ({
      customerId: undefined,
      name: "Default Name (Edit Mode)",
      field: "Default Field",
      address: "Default Address",
      contactNo: "01000000000",
      patientType: "outdoor",
      bedNo: "",
      indoorBillNo: "",
    }),
    []
  );

  return (
    <Panel bordered className="w-full rounded-2xl border-slate-200 bg-white">
      <CustomerDetailsModule
        mode={mode}
        onModeChange={(m: CustomerMode) => dispatch(setCustomerMode(m))}
        customer={customer}
        onCustomerChange={(c) => dispatch(setCustomer(c))}
        blankCustomer={blankCustomer}
        updateDefaults={updateDefaults}
      />
    </Panel>
  );
}
