import api from "@/lib/axios";
import type { LoginSchemaType } from "@/validators/auth-validator";

export const loginApi = async (body: LoginSchemaType) => {
  const res = await api.post("/auth/login", body);
  return res.data.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data.data;
};

export const currentUserApi = async () => {
  const res = await api.get("/auth/current-user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return res.data.data;
};
