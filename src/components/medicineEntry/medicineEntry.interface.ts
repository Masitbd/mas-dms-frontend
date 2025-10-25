import { z } from "zod";

export type TMedicineEntry = {
  _id: any;
  medicineId?: string;
  name: string;
  genericName: string;
  category: string;
  supplierName: string;
  reOrderLevel: number;
  unit: string;
  openingBalance: number;
  openingBalanceDate: Date;
  openingBalanceRate: number;

  discount?: number;
  alertQty: number;
};

// Zod schema
export const medicineZodSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  genericName: z.string().min(1, { message: "genericName is required" }),
  category: z.string().min(1, { message: "category is required" }),
  supplierName: z.string().min(1, { message: "supplierName is required" }),
  reOrderLevel: z.number({ required_error: "reOrderLevel is required" }),
  unit: z.string().min(1, { message: "unit is required" }),
  openingBalance: z.number({ required_error: "openingBalance is required" }),
  openingBalanceDate: z.date({
    required_error: "openingBalanceDate is required",
  }),
  openingBalanceRate: z.number({
    required_error: "openingBalanceRate is required",
  }),

  discount: z.number().optional(),
  alertQty: z.number({ required_error: "alertQty is required" }),
});

// ✅ Infer type from schema
// export type TMedicineEntry = z.infer<typeof medicineZodSchema>;

export type TIdName = {
  _id: string;
  name: string;
};
