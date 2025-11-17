import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

export const AppSidebar = () => {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
};
