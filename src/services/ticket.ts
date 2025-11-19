/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

import type {
  TicketCategoryEnum,
  TicketQuerySchemaType,
} from "@/validators/ticket-validator";

export const getTicketsApi = async (params: TicketQuerySchemaType) => {
  const res = await api.get("/ticket", {
    params,
  });
  return res.data;
};

export const getTicketByIdApi = async (id: string) => {
  const res = await api.get(`/ticket/${id}`);
  return res.data;
};

export const createTicketApi = async (body: FormData) => {
  const res = await api.post("/ticket", body);
  return res.data;
};

export const updateTicketByIdApi = async (id: string, body: any) => {
  const res = await api.put(`/ticket/${id}`, body);
  return res.data;
};

export const escalateTicketByIdApi = async (id: string, body: any) => {
  const res = await api.put(`/ticket/${id}/escalate`, body);
  return res.data;
};

export const deleteTicketByIdApi = async (id: string) => {
  const res = await api.delete(`/ticket/${id}`);
  return res.data;
};

export const getTicketHistoryApi = async (ticketId: string) => {
  const res = await api.get("/ticket-history", {
    params: {
      ticketId,
    },
  });
  return res.data;
};

export const getTicketSummaryApi = async (category: TicketCategoryEnum) => {
  const res = await api.get("/summary", {
    params: {
      category,
    },
  });
  return res.data;
};

export const getOverdueTicketsApi = async (category: TicketCategoryEnum) => {
  const res = await api.get("/summary/overdue", {
    params: {
      category,
    },
  });
  return res.data;
};
