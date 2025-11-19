/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { getTicketHistoryApi } from "@/services/ticket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateTime, getInitial } from "@/lib/utils";

const ListHistory = ({ id }: { id: string }) => {
  const { data } = useQuery({
    queryKey: ["getTicketHistory", id],
    queryFn: () => getTicketHistoryApi(id),
  });

  const fieldNameMap: Record<string, string> = {
    title: "Ticket Title",
    description: "Ticket Description",
    expectedCompletion: "Date & Time",
    category: "Project Name",
    priority: "Priority",
    status: "Status",
    level: "Level",
    criticality: "Criticality",
    attachments: "Attachments",
    reporterName: "Reporter Name",
    reporterContact: "Reporter Contact",
    ticket: "Ticket",
  };

  return (
    <div className="space-y-6">
      {data?.data?.map((item: any) => (
        <div>
          <div className="relative flex items-center">
            <Avatar className="h-8 w-8 rounded-full me-2">
              <AvatarImage
                src={item?.userId?.profilePicture}
                alt={item?.userId?.name}
              />
              <AvatarFallback className="rounded-lg">
                {getInitial(item?.userId?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{item?.userId?.name}</span>
            <span className="text-sm ms-2 text-muted-foreground">
              {formatDateTime(item?.createdAt)}
            </span>
          </div>
          <div className="space-y-4 mt-2">
            {item?.changes?.map((change: any) => {
              if (change?.field === "attachments") {
                return (
                  <div className="text-sm">
                    <span className="font-semibold">{item?.action}</span> the{" "}
                    <span className="font-semibold">
                      {fieldNameMap[change?.field]}
                    </span>{" "}
                    files
                  </div>
                );
              }

              if (change?.field === "description") {
                return (
                  <div className="text-sm">
                    <span className="font-semibold">{item?.action}</span> the{" "}
                    <span className="font-semibold">
                      {fieldNameMap[change?.field]}
                    </span>
                  </div>
                );
              }

              return (
                <div className="text-sm">
                  <span className="font-semibold">{item?.action}</span> the{" "}
                  <span className="font-semibold">
                    {" "}
                    {fieldNameMap[change?.field]}
                  </span>{" "}
                  from "
                  {change?.field === "expectedCompletion"
                    ? formatDateTime(change?.oldValue)
                    : change?.oldValue}
                  " to "
                  {change?.field === "expectedCompletion"
                    ? formatDateTime(change?.newValue)
                    : change?.newValue}
                  "
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListHistory;
