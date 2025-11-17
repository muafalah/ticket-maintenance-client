import { BrowserRouter, Routes, Route } from "react-router";

import LoginPage from "@/pages/auth/login";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
