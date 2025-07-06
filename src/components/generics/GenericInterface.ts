import { z } from "zod";

export const genericZodSchema = z.object({
  genericId: z.string().optional(),
  name: z.string({
    required_error: "Generic name is required",
  }),
});

export type IGenericFormData = z.infer<typeof genericZodSchema>;