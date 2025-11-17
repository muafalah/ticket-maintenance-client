import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppProvider from "./Providers";
import Router from "./routes";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <Router />
    </AppProvider>
  </StrictMode>
);
