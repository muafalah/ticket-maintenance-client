import { Navigate, Outlet } from "react-router";

import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/login" />;

  return <Outlet />;
};
