import z from "zod";

export type ICategoryFormData = {
  _id?: string;
  categoryId?: string;
  name: string;
};

export const categoryZodSchema = z.object({
  name: z.string({ required_error: "Category name must be provided" }).min(2),
  categoryId: z.string().optional(),
  _id: z.string().optional(),
});
