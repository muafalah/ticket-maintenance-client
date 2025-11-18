import { Navigate, useParams } from "react-router";

import { PageWrapper } from "@/components/layout/page-wrapper";

import { NAV_TICKET_LIST } from "@/components/layout/nav-main";
import type { TicketCategoryEnum } from "@/validators/ticket-validator";

import { ListTicket } from "./components/table";

const TicketPage = () => {
  const { category } = useParams<{ category: string }>();

  if (!category || !NAV_TICKET_LIST.some((item) => item.title === category)) {
    return <Navigate to="/404" replace />;
  }

  const breadcrumb = [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "My Tickets",
      href: `/ticket/${category}`,
    },
    {
      label: category,
    },
  ];

  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <h1 className="font-semibold text-2xl mb-4">{category}</h1>
      <ListTicket category={category as TicketCategoryEnum} />
    </PageWrapper>
  );
};

export default TicketPage;
