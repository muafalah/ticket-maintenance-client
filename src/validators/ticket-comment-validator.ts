import z from "zod";

export const baseTicketCommentSchema = z.object({
  ticketId: z.string().trim().min(1),
  comment: z.string().trim().min(1),
});

export const createTicketCommentSchema = baseTicketCommentSchema;

export type CreateTicketCommentSchemaType = z.infer<
  typeof createTicketCommentSchema
>;
