import { z } from "zod";

export const supplierZodSchema = z.object({
  supplierId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  address: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  fax: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

export type ISupplierFormData = z.infer<typeof supplierZodSchema>;
