/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { queryClient } from "@/providers/QueryProvider";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { getTicketByIdApi, updateTicketByIdApi } from "@/services/ticket";

import type { TicketStatusEnum } from "@/validators/ticket-validator";

import Attachments from "./components/attachments";
import SideAction from "./components/side-action";
import Information from "./components/information";
import Activity from "./components/activity";

const statusColorMap: Record<TicketStatusEnum, string> = {
  NEW: "bg-gray-100",
  ATTENDING: "bg-blue-100",
  COMPLETED: "bg-green-100",
};

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data, isFetched } = useQuery({
    queryKey: ["getTicketById", id],
    queryFn: () => getTicketByIdApi(id!),
    enabled: !!id,
  });

  const ticketData = data?.data;

  const { mutate } = useMutation({
    mutationFn: (body: any) => updateTicketByIdApi(id!, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
      queryClient.invalidateQueries({ queryKey: ["getTicketById", id] });
      toast.success(data.message);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const breadcrumb = [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "My Tickets",
      href: `/ticket/${ticketData?.category}`,
    },
    {
      label: `${ticketData?.category}`,
      href: `/ticket/${ticketData?.category}`,
    },
    {
      label: `${ticketData?.code}`,
    },
  ];

  const disabled =
    ticketData?.level === "L1"
      ? user?._id !== ticketData?.createdBy
      : user?._id !== ticketData?.assignedTo;

  if (!isFetched) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <PageWrapper breadcrumb={breadcrumb}>
      <div className="flex justify-between items-center my-4">
        <div className="flex gap-4 items-center">
          <Badge
            className={`rounded-sm h-6 text-black ${
              statusColorMap[ticketData?.status as TicketStatusEnum]
            }`}
          >
            {ticketData?.status}
          </Badge>

          <h1 className="font-semibold text-2xl">{ticketData?.code}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="cursor-pointer">
            <SquarePen />
            <span className="font-normal hidden md:inline">Edit</span>
          </Button>
          <Button variant="outline" className="cursor-pointer text-red-500">
            <Trash2 />
            <span className="font-normal hidden md:inline">Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 space-y-6">
          <Information
            level={ticketData?.level}
            title={ticketData?.title}
            description={ticketData?.description}
            createdAt={ticketData?.createdAt}
          />
          <Attachments
            id={id!}
            level={ticketData?.level}
            data={ticketData?.attachments}
            disabled={disabled}
            mutate={mutate}
          />
        </div>

        <div className="col-span-3 lg:col-span-1">
          {ticketData && (
            <SideAction
              level={ticketData?.level}
              priority={ticketData?.priority}
              criticality={ticketData?.criticality}
              reporterName={ticketData?.reporterName}
              reporterContact={ticketData?.reporterContact}
              expectedCompletion={ticketData?.expectedCompletion}
              disabled={disabled}
              mutate={mutate}
            />
          )}
        </div>

        <div className="col-span-3">
          <Activity id={id!} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default TicketDetailPage;
