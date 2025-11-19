import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";

import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";
import TicketPage from "@/pages/ticket";
import TicketDetailPage from "@/pages/ticket/detail";

import Layout from "@/components/layout";

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
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/ticket"
              element={<Navigate to="/ticket/IMT" replace />}
            />
            <Route path="/ticket/:category" element={<TicketPage />} />
            <Route path="/ticket-detail/:id" element={<TicketDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
