import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";

import { getTicketSummaryApi } from "@/services/ticket";

import type { TicketCategoryEnum } from "@/validators/ticket-validator";

import { cn } from "@/lib/utils";

const Summary = ({ category }: { category: TicketCategoryEnum }) => {
  const { data } = useQuery({
    queryKey: ["getTicketSummary", category],
    queryFn: () => getTicketSummaryApi(category as TicketCategoryEnum),
    enabled: !!category,
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
      <SummaryCard
        title="Total Tickets"
        amount={data?.data?.totalTickets || 0}
      />
      <SummaryCard
        title="Active Tickets"
        amount={data?.data?.activeTickets || 0}
      />
      <SummaryCard
        badgeText="L1"
        badgeClassName="bg-green-500 text-white"
        title="Tickets"
        amount={data?.data?.levels?.L1 || 0}
      />
      <SummaryCard
        badgeText="L2"
        badgeClassName="bg-orange-500 text-white"
        title="Tickets"
        amount={data?.data?.levels?.L2 || 0}
      />
      <SummaryCard
        badgeText="L3"
        badgeClassName="bg-red-500 text-white"
        title="Tickets"
        amount={data?.data?.levels?.L3 || 0}
      />
    </div>
  );
};

const SummaryCard = ({
  badgeText,
  badgeClassName,
  title,
  amount,
}: {
  badgeText?: string;
  badgeClassName?: string;
  title: string;
  amount: number;
}) => {
  return (
    <div className="border shadow-xs rounded-lg p-5 space-y-2">
      <div className="flex items-center gap-2">
        {badgeText && (
          <Badge className={cn("rounded-sm h-6 w-9", badgeClassName)}>
            {badgeText}
          </Badge>
        )}
        <span>{title}</span>
      </div>
      <div className="text-3xl font-bold">{amount}</div>
    </div>
  );
};

export default Summary;
