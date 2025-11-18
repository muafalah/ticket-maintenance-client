import type { CreateTicketCommentSchemaType } from "@/validators/ticket-comment-validator";

import api from "@/lib/axios";

export const createTicketCommentApi = async (
  body: CreateTicketCommentSchemaType
) => {
  const res = await api.post("/ticket-comment", body);
  return res.data;
};

export const getTicketCommentsApi = async (ticketId: string) => {
  const res = await api.get("/ticket-comment", {
    params: {
      ticketId,
    },
  });
  return res.data;
};

export const updateTicketCommentApi = async (
  commentId: string,
  body: CreateTicketCommentSchemaType
) => {
  const res = await api.put(`/ticket-comment/${commentId}`, body);
  return res.data;
};

export const deleteTicketCommentByIdApi = async (id: string) => {
  const res = await api.delete(`/ticket-comment/${id}`);
  return res.data;
};
