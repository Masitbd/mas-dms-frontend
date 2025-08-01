import z from "zod";

export interface ISaleFormData {
  name: string;
  address?: string;
  contact_no?: string;
  transaction_date?: Date;
  paymentId: string;
  invoice_no: string;
  patient_type: "outdoor" | "indoor";
  bed_no?: string;
  indoor_bill_no?: string;
}

export const salesZodSchema = z.object({
  name: z.string({ required_error: "Name Is Required" }),

  address: z.string().optional(),

  contact_no: z.string().optional(),

  transaction_date: z.date().optional(),

  paymentId: z.string(),

  invoice_no: z.string(),

  patient_type: z.enum(["outdoor", "indoor"]),

  bed_no: z.string().optional(),

  indoor_bill_no: z.string().optional(),
});
