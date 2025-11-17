import { Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
