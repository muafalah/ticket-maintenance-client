import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rute Terproteksi */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* </Route> */}

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
