import api from "@/lib/axios";

import type { TicketQuerySchemaType } from "@/validators/ticket-validator";

export const getTicketsApi = async (params: TicketQuerySchemaType) => {
  const res = await api.get("/ticket", {
    params,
  });
  return res.data;
};

export const createTicketApi = async (body: FormData) => {
  const res = await api.post("/ticket", body);
  return res.data;
};
