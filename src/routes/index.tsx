import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";

import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";
import TicketPage from "@/pages/ticket";
import ProfilePage from "@/pages/profile";
import NotFoundPage from "@/pages/not-found";
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
        <Route path="/404" element={<NotFoundPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/ticket"
              element={<Navigate to="/ticket/IMT" replace />}
            />
            <Route path="/ticket/:category" element={<TicketPage />} />
            <Route path="/ticket-detail/:id" element={<TicketDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
