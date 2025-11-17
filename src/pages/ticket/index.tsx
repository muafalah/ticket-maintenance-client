import { Navigate, useParams } from "react-router";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { CATEGORIES } from "@/lib/constants";

const TicketPage = () => {
  const { category } = useParams<{ category: string }>();

  if (category && !CATEGORIES.some((item) => item.title === category)) {
    console.log("JAlan");
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
      label: category || "Default Category",
    },
  ];

  return <PageWrapper breadcrumb={breadcrumb}>My Ticket</PageWrapper>;
};

export default TicketPage;
