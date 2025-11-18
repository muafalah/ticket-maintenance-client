/* eslint-disable @typescript-eslint/no-unused-vars */
import z from "zod";

import { paginationSchema, sorterSchema } from "./global-validator";

const TicketCategory = ["IMT", "SWT", "CMT", "CTT"] as const;
export type TicketCategoryEnum = (typeof TicketCategory)[number];

const TicketPriority = ["LOW", "MEDIUM", "HIGH"] as const;
export type TicketPriorityEnum = (typeof TicketPriority)[number];

const TicketStatus = ["NEW", "ATTENDING", "COMPLETED"] as const;
export type TicketStatusEnum = (typeof TicketStatus)[number];

const TicketLevel = ["L1", "L2", "L3"] as const;
export type TicketLevelEnum = (typeof TicketLevel)[number];

const TicketCriticality = ["C1", "C2", "C3"] as const;
export type TicketCriticalityEnum = (typeof TicketCriticality)[number];

export const ticketFilterSchema = z.object({
  keyword: z.string().optional(),
  category: z.enum(TicketCategory).optional(),
  status: z.enum(TicketStatus).optional(),
  priority: z.enum(TicketPriority).optional(),
  level: z.enum(TicketLevel).optional(),
});

export const ticketQuerySchema = ticketFilterSchema
  .extend(paginationSchema.shape)
  .extend(sorterSchema.shape);

export const baseTicketSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  expectedCompletion: z.date({ message: "Date & Time is required" }),

  category: z.enum(TicketCategory, {
    message: "Category is required",
  }),
  priority: z.enum(TicketPriority, {
    message: "Priority is required",
  }),
  status: z.enum(TicketStatus, {
    message: "Status is required",
  }),

  reporterName: z.string().optional(),
  reporterContact: z.string().optional(),

  attachments: z.array(z.any()).optional(),
});

export const createTicketSchema = baseTicketSchema;

export const ticketFileUploaderSchema = z.object({
  attachments: z.array(z.any()),
});

export type CreateTicketSchemaType = z.infer<typeof createTicketSchema>;
export type TicketQuerySchemaType = z.infer<typeof ticketQuerySchema>;
export type TicketFileUploaderSchemaType = z.infer<
  typeof ticketFileUploaderSchema
>;
