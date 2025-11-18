/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SquarePen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { debounce } from "lodash";

import { queryClient } from "@/providers/QueryProvider";

import { PageWrapper } from "@/components/layout/page-wrapper";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlateEditor } from "@/components/ui/slate-editor";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time";

import { getTicketByIdApi, updateTicketByIdApi } from "@/services/ticket";

import type {
  TicketLevelEnum,
  TicketStatusEnum,
} from "@/validators/ticket-validator";

import { formatDateTime } from "@/lib/utils";

import { TICKET_CRITICALITY, TICKET_PRIORITY } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

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

// ➤ Fungsi untuk mengecek apakah autoUpdate sama dengan data awal
const isSameAsInitial = (
  val: Record<string, any>,
  initial: Record<string, any>
) => {
  return (
    val.criticality === initial.criticality &&
    val.priority === initial.priority &&
    val.reporterName === initial.reporterName &&
    val.reporterContact === initial.reporterContact &&
    (val.expectedCompletion?.toISOString?.() || null) ===
      (initial.expectedCompletion
        ? new Date(initial.expectedCompletion).toISOString()
        : null)
  );
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

  const [autoUpdate, setAutoUpdate] =
    useState<Record<string, string | Date | undefined>>();

  const { mutate } = useMutation({
    mutationFn: (formData: FormData) => updateTicketByIdApi(id!, formData),
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

  const debouncedUpdate = useCallback(
    debounce((value: Record<string, string | Date | undefined>) => {
      const formData = new FormData();

      formData.append("priority", value.priority as string);
      formData.append("criticality", value.criticality as string);
      formData.append("reporterName", value.reporterName as string);
      formData.append("reporterContact", value.reporterContact as string);

      formData.append(
        "expectedCompletion",
        value.expectedCompletion instanceof Date
          ? value.expectedCompletion.toISOString()
          : ""
      );

      mutate(formData);
    }, 3000),
    []
  );

  useEffect(() => {
    if (!autoUpdate || !ticketData) return;

    if (isSameAsInitial(autoUpdate, ticketData)) return;

    debouncedUpdate(autoUpdate);

    return () => debouncedUpdate.cancel();
  }, [autoUpdate, debouncedUpdate, ticketData]);

  useEffect(() => {
    if (ticketData) {
      setAutoUpdate({
        priority: ticketData.priority,
        criticality: ticketData.criticality,
        reporterName: ticketData.reporterName,
        reporterContact: ticketData.reporterContact,
        expectedCompletion: ticketData.expectedCompletion
          ? new Date(ticketData.expectedCompletion)
          : undefined,
      });
    }
  }, [ticketData]);

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
        <Spinner className="size-10" />;
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
          <Card>
            <span className="flex gap-2 items-center">
              <Badge
                className={`rounded-sm h-6 w-8 ${
                  levelColorMap[ticketData?.level as TicketLevelEnum]
                }`}
              >
                {ticketData?.level}
              </Badge>
              <h2 className="font-semibold text-2xl">{ticketData?.title}</h2>
            </span>
            <p className="text-sm text-muted-foreground my-2">
              Created time {formatDateTime(ticketData?.createdAt)}
            </p>
            <SlateEditor value={ticketData?.description} disabled />
          </Card>
          <Card>a</Card>
        </div>

        <div className="col-span-3 lg:col-span-1">
          <Card>
            <div className="flex gap-4 justify-between">
              {ticketData?.level !== "L3" && (
                <Button
                  variant="secondary"
                  className="cursor-pointer flex-1 text-orange-500"
                  disabled={disabled}
                >
                  Escalate to {ticketData?.level === "L1" ? "L2" : "L3"}
                </Button>
              )}
              <Button className="cursor-pointer flex-1" disabled={disabled}>
                Resolve Ticket
              </Button>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select
                  value={autoUpdate?.priority as string}
                  onValueChange={(e) =>
                    setAutoUpdate((prev) => ({ ...prev, priority: e }))
                  }
                >
                  <SelectTrigger
                    className="w-full cursor-pointer"
                    disabled={disabled}
                  >
                    <SelectValue placeholder="Choose priority..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_PRIORITY.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reporter Name</Label>
                <Input
                  value={autoUpdate?.reporterName as string}
                  onChange={(e) =>
                    setAutoUpdate((prev) => ({
                      ...prev,
                      reporterName: e.target.value,
                    }))
                  }
                  placeholder="Enter reporter name"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  value={autoUpdate?.reporterContact as string}
                  onChange={(e) =>
                    setAutoUpdate((prev) => ({
                      ...prev,
                      reporterContact: e.target.value,
                    }))
                  }
                  placeholder="Enter contact number"
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <DateTimePicker
                  value={autoUpdate?.expectedCompletion as Date}
                  onChange={(date) =>
                    setAutoUpdate((prev) => ({
                      ...prev,
                      expectedCompletion: date,
                    }))
                  }
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label>Criticality Level</Label>
                <Select
                  value={autoUpdate?.criticality as string}
                  onValueChange={(e) =>
                    setAutoUpdate((prev) => ({ ...prev, criticality: e }))
                  }
                >
                  <SelectTrigger
                    className="w-full cursor-pointer"
                    disabled={disabled || ticketData?.level === "L1"}
                  >
                    <SelectValue placeholder="Choose criticality..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CRITICALITY.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-3">
          <Card>a</Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default TicketDetailPage;

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="border shadow-xs rounded-lg p-4">{children}</div>
);
