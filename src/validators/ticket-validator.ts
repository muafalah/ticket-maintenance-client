import z from "zod";

import { paginationSchema, sorterSchema } from "./global-validator";

export enum TicketCategoryEnum {
  IMT = "IMT",
  SWT = "SWT",
  CMT = "CMT",
  CTT = "CTT",
}

export enum TicketPriorityEnum {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum TicketStatusEnum {
  NEW = "NEW",
  ATTENDING = "ATTENDING",
  COMPLETED = "COMPLETED",
}

export enum TicketLevelEnum {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
}

export const ticketFilterSchema = z.object({
  keyword: z.string().optional(),
  category: z.enum(TicketCategoryEnum).optional(),
  status: z.enum(TicketStatusEnum).optional(),
  priority: z.enum(TicketPriorityEnum).optional(),
  level: z.enum(TicketLevelEnum).optional(),
});

export const ticketQuerySchema = ticketFilterSchema
  .extend(paginationSchema.shape)
  .extend(sorterSchema.shape);

export type TicketQuerySchemaType = z.infer<typeof ticketQuerySchema>;
