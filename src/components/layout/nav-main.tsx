import { Link, useLocation } from "react-router";
import { ChevronRight, House, Ticket } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const NAV_TICKET_LIST = [
  {
    title: "IMT",
    url: "/ticket/IMT",
  },
  {
    title: "SWT",
    url: "/ticket/SWT",
  },
  {
    title: "CMT",
    url: "/ticket/CMT",
  },
  {
    title: "CTT",
    url: "/ticket/CTT",
  },
];

const NAV_LIST = [
  {
    groupTitle: "Menu",
    menu: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: House,
      },
      {
        title: "My Tickets",
        icon: Ticket,
        items: NAV_TICKET_LIST,
      },
    ],
  },
];

export const NavMain = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {NAV_LIST.map(({ groupTitle, menu }) => (
        <SidebarGroup key={groupTitle}>
          <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
          <SidebarMenu>
            {menu.map((item) => {
              const isParentActive = item.items?.some(
                (subItem) => pathname === subItem.url
              );

              const isMenuActive = pathname === item.url;

              const Icon = item.icon;

              if (item.items) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            "hover:text-black! hover:bg-orange-50! cursor-pointer",
                            isParentActive &&
                              "bg-orange-500! text-white! hover:bg-orange-500! hover:text-white!"
                          )}
                        >
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => {
                            const isSubMenuActive = pathname === subItem.url;

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  className="hover:bg-orange-50"
                                  asChild
                                >
                                  <Link
                                    to={subItem.url}
                                    className={cn(
                                      isSubMenuActive && "text-orange-500!"
                                    )}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      "hover:text-black! hover:bg-orange-50! cursor-pointer",
                      isMenuActive && "bg-orange-500! text-white!"
                    )}
                    asChild
                  >
                    <Link to={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
};
