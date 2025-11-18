/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { useNavigate } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { queryClient } from "@/providers/QueryProvider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import { buttonVariants } from "@/components/ui/button";

import { deleteTicketByIdApi, getTicketByIdApi } from "@/services/ticket";

import type {
  TicketCriticalityEnum,
  TicketLevelEnum,
  TicketPriorityEnum,
  TicketStatusEnum,
} from "@/validators/ticket-validator";

import { formatDateTime, getInitial } from "@/lib/utils";

import { TicketFormDialog } from "./ticket-form-dialog";

export type ListTicketType = {
  _id: string;
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

      return reporterName?.length > 0 ? reporterName : "-";
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
        <div className="relative flex items-center">
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
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return <ActionButton key={row.original._id} id={row.original._id} />;
    },
  },
];

const ActionButton = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  const [isOpenModalUpdate, setOpenModalUpdate] = useState(false);
  const [isOpenModalDelete, setOpenModalDelete] = useState(false);

  const { data: ticketData } = useQuery({
    queryKey: ["getTicketById", id],
    queryFn: () => getTicketByIdApi(id!),
    enabled: !!id && isOpenModalUpdate,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteTicketByIdApi(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
      toast.success(data.message);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setOpenModalDelete(false);
    },
  });

  return (
    <>
      <div className="flex gap-4">
        <Eye
          onClick={() => navigate(`/ticket-detail/${id}`)}
          className="size-4 cursor-pointer"
        />
        <SquarePen
          onClick={() => setOpenModalUpdate(true)}
          className="size-4 cursor-pointer"
        />
        <Trash2
          onClick={() => setOpenModalDelete(true)}
          className="size-4 cursor-pointer text-red-500"
        />
      </div>
      {isOpenModalUpdate && ticketData?.data && (
        <TicketFormDialog
          key={ticketData?.data._id}
          id={id}
          initData={ticketData.data}
          open={isOpenModalUpdate}
          setOpen={setOpenModalUpdate}
        />
      )}
      {isOpenModalDelete && (
        <DialogConfirm
          isOpen={isOpenModalDelete}
          setOpen={setOpenModalDelete}
          isLoading={isPending}
          title="Are you sure you want to delete it?"
          description="This action cannot be undone. This will permanently delete your ticket."
          confirmBtnLabel="Delete"
          confirmBtnClassName={buttonVariants({ variant: "destructive" })}
          onConfirm={() => mutate()}
        />
      )}
    </>
  );
};
