import z from "zod";

export const paginationSchema = z.object({
  pageSize: z.coerce.number().min(1).max(100).optional(),
  pageNumber: z.coerce.number().min(1).optional(),
});

export const sorterSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
