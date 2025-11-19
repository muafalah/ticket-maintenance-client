import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

import { getTicketsApi } from "@/services/ticket";

import type {
  TicketCategoryEnum,
  TicketLevelEnum,
  TicketStatusEnum,
} from "@/validators/ticket-validator";

import { cn, formatDateTime } from "@/lib/utils";

const statusColorMap: Record<TicketStatusEnum, string> = {
  NEW: "bg-gray-100",
  ATTENDING: "bg-blue-100",
  COMPLETED: "bg-green-100",
};

const levelColorMap: Record<TicketLevelEnum, string> = {
  L1: "bg-green-500",
  L2: "bg-orange-500",
  L3: "bg-red-500",
};

const Overview = ({ category }: { category: TicketCategoryEnum }) => {
  return (
    <div className="border shadow-xs rounded-lg p-5">
      <h1 className="font-medium text-2xl mb-4">Overview</h1>

      <Tabs defaultValue="ALL">
        <TabsList className="w-full">
          <TabsTrigger value="ALL" className="w-20 h-8">
            All
          </TabsTrigger>
          <TabsTrigger value="L1" className="w-20 h-8">
            L1
          </TabsTrigger>
          <TabsTrigger value="L2" className="w-20 h-8">
            L2
          </TabsTrigger>
          <TabsTrigger value="L3" className="w-20 h-8">
            L3
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ALL">
          <TicketList category={category} />
        </TabsContent>
        <TabsContent value="L1">
          <TicketList category={category} level="L1" />
        </TabsContent>
        <TabsContent value="L2">
          <TicketList category={category} level="L2" />
        </TabsContent>
        <TabsContent value="L3">
          <TicketList category={category} level="L3" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TicketList = ({
  category,
  level,
}: {
  category: TicketCategoryEnum;
  level?: TicketLevelEnum;
}) => {
  const params = {
    category: category,
    level: level,
  };

  const { data, isFetching } = useQuery({
    queryKey: ["getTickets", params],
    queryFn: () => getTicketsApi(params),
  });

  if (isFetching) {
    return (
      <div className="w-full flex justify-center items-center h-20 bg-muted rounded-md">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data?.data?.length > 0 ? (
        data?.data?.map(
          (item: {
            _id: string;
            level: string;
            code: string;
            status: string;
            title: string;
            expectedCompletion: string;
            priority: string;
            criticality: string;
          }) => (
            <Link
              key={item._id}
              to={`/ticket-detail/${item._id}`}
              className="inline-block w-full"
            >
              <div className="border shadow-xs rounded-lg p-3 space-y-2 overflow-hidden">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      "rounded-md h-6 w-8 text-sm",
                      levelColorMap[item.level as TicketLevelEnum]
                    )}
                  >
                    {item.level}
                  </Badge>
                  <span>{item.code}</span>
                  <Badge
                    className={cn(
                      "rounded-full h-6 w-fit text-black text-sm",
                      statusColorMap[item.status as TicketStatusEnum]
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="font-semibold">{item.title}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(item.expectedCompletion)}
                  </span>
                  <Badge variant="outline" className="rounded-sm">
                    {item.priority} ({item.criticality})
                  </Badge>
                </div>
              </div>
            </Link>
          )
        )
      ) : (
        <div className="w-full flex justify-center items-center h-20 bg-muted rounded-md">
          No Data
        </div>
      )}
    </div>
  );
};

export default Overview;
