import api from "@/lib/axios";

export const getUsersApi = async () => {
  const res = await api.get("/user");
  return res.data;
};
