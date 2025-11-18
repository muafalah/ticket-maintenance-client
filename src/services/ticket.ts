import api from "@/lib/axios";

import type {
  CreateTicketSchemaType,
  TicketQuerySchemaType,
} from "@/validators/ticket-validator";

export const getTicketsApi = async (params: TicketQuerySchemaType) => {
  const res = await api.get("/ticket", {
    params,
  });
  return res.data;
};

export const createTicketApi = async (body: CreateTicketSchemaType) => {
  const res = await api.post("/ticket", body);
  return res.data;
};
