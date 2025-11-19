import { useState } from "react";

import { PageWrapper } from "@/components/layout/page-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TicketCategoryEnum } from "@/validators/ticket-validator";

import { TICKET_CATEGORY } from "@/lib/constants";

import Summary from "./components/summary";
import Overview from "./components/overview";
import Overdue from "./components/overdue";

const DashboardPage = () => {
  const [category, setCategory] = useState("IMT");

  const breadcrumb = [
    {
      label: "Dashboard",
    },
  ];

  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <h1 className="font-semibold text-2xl mb-4">Dashboard</h1>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="cursor-pointer mb-6">
          <SelectValue placeholder="Choose project..." />
        </SelectTrigger>
        <SelectContent>
          {TICKET_CATEGORY.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Summary category={category as TicketCategoryEnum} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2">
          <Overdue category={category as TicketCategoryEnum} />
        </div>
        <div className="col-span-3 lg:col-span-1">
          <Overview category={category as TicketCategoryEnum} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
