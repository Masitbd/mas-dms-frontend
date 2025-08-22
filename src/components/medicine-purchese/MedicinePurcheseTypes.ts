/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";

export const medicinePurchaseSchema = yup
  .object({
    challanNo: yup.string().required(),
    age: yup.number().positive().integer().required(),
  })
  .required();

import { useEffect, useRef } from "react";

export function useValueChange(newValue: any, callback: any) {
  const prevValue = useRef(newValue);
  useEffect(() => {
    if (
      prevValue.current[1] !== newValue[1] ||
      prevValue.current[2] !== newValue[2]
    ) {
      callback();
      prevValue.current = newValue;
    }
  }, [newValue]);
}

/*************************
 * Type Definitions
 *************************/
export type Supplier = {
  _id: string;
  supplierId: string;
  name: string;
  contactPerson?: string;
  address?: string;
  phone?: string;
  fax?: string;
  city?: string;
  country?: string;
  email?: string;
};

export type Purchase = {
  _id: string;
  id?: string;
  invoiceNo: string;
  supplierId: Supplier;
  purchaseDate: string | Date;
  vatPercentage: number; // e.g. 10 means 10%
  discountPercentage: number; // e.g. 10 means 10%
  totalAmount: number; // base total (pre-VAT/discount) if items missing
  paidAmount: number;
  status: string; // "paid" | "due" | etc
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type MedicineName = {
  _id?: string;
  medicineId?: string;
  name: string;
  unit?: string; // e.g. ml, pcs
};

export type MedicineItem = {
  _id: string;
  id?: string;
  purchaseId: string;
  medicineName: MedicineName;
  quantity: number;
  purchaseRate: number; // unit cost
  salesRate?: number; // optional sales price
  batchNo?: string;
  dateExpire?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

/*************************
 * Utility helpers
 *************************/
export function toDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  try {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  } catch {}
  return undefined;
}

export function formatDate(value?: string | Date): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function money(n: number, currencyCode = "TK"): string {
  try {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(n ?? 0);
  } catch {
    return `${n?.toFixed?.(2) ?? n} ${currencyCode}`;
  }
}

export const defaultValues = {
  invoiceNo: "",
  supplierId: "",
  totalAmount: 0,
  paidAmount: 0,
  purchaseDate: new Date(),
  supplierBill: "",
  vatPercentage: 0,
  vatAmount: 0,
  discountPercentage: 0,
  discountAmount: 0,
};
