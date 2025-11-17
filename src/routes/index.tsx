import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";

import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";

import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = () => {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/login" />;

  return <Outlet />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
