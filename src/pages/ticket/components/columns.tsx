import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import {
  TicketCriticalityEnum,
  TicketLevelEnum,
  type TicketPriorityEnum,
  type TicketStatusEnum,
} from "@/validators/ticket-validator";
import { formatDateTime, getInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ListTicketType = {
  id: string;
  code: string;
  name: string;
  title: string;
  status: TicketStatusEnum;
  level: TicketLevelEnum;
  priority: TicketPriorityEnum;
  criticality: TicketCriticalityEnum;
  expectedCompletion: string;
  assignedTo: {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
    role: string;
  };
};

export const columns = (
  pageIndex: number,
  pageSize: number
): ColumnDef<ListTicketType>[] => [
  {
    accessorKey: "id",
    header: "No",
    cell: ({ row }) => (pageIndex - 1) * pageSize + row.index + 1,
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as TicketStatusEnum;

      const statusColorMap: Record<TicketStatusEnum, string> = {
        NEW: "bg-gray-100",
        ATTENDING: "bg-blue-100",
        COMPLETED: "bg-green-100",
      };

      return (
        <Badge className={`rounded-sm text-black ${statusColorMap[status]}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "level",
    header: "Level",
    enableSorting: true,
    cell: ({ row }) => {
      const level = row.getValue("level") as TicketLevelEnum;

      const levelColorMap: Record<TicketLevelEnum, string> = {
        L1: "bg-green-500",
        L2: "bg-orange-500",
        L3: "bg-red-500",
      };

      return (
        <Badge className={`rounded-sm ${levelColorMap[level]}`}>{level}</Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    enableSorting: true,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as TicketPriorityEnum;
      const criticality = row.original.criticality as TicketCriticalityEnum;

      return (
        <Badge variant="outline" className="rounded-sm">
          {`${priority} (${criticality})`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expectedCompletion",
    header: "Date & Time",
    cell: ({ row }) => {
      const expectedCompletion = row.getValue("expectedCompletion") as string;

      return formatDateTime(expectedCompletion);
    },
  },
  {
    accessorKey: "reporterName",
    header: "Reporter",
    cell: ({ row }) => {
      const reporterName = row.getValue("reporterName") as string;

      return reporterName || "-";
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Technician",
    cell: ({ row }) => {
      const assignedTo = row.getValue(
        "assignedTo"
      ) as ListTicketType["assignedTo"];

      return assignedTo ? (
        <div className="relative flex items-center h-12 w-12">
          <Avatar className="h-8 w-8 rounded-full me-2">
            <AvatarImage
              src={assignedTo?.profilePicture}
              alt={assignedTo?.name}
            />
            <AvatarFallback className="rounded-lg">
              {getInitial(assignedTo?.name)}
            </AvatarFallback>
          </Avatar>
          <span>{assignedTo.name}</span>
        </div>
      ) : (
        "-"
      );
    },
  },
];
