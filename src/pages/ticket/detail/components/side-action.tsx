/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import type { UseMutateFunction } from "@tanstack/react-query";
import { clone, debounce, isEqual } from "lodash";

import { Button, buttonVariants } from "@/components/ui/button";
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

import type {
  TicketCriticalityEnum,
  TicketLevelEnum,
  TicketPriorityEnum,
  TicketStatusEnum,
} from "@/validators/ticket-validator";

import { TICKET_CRITICALITY, TICKET_PRIORITY } from "@/lib/constants";
import { DialogEscalate } from "./dialog-escalate";
import { DialogConfirm } from "@/components/ui/dialog-confirm";
import { toast } from "sonner";
import { AxiosError } from "axios";

type UpdatePayload = {
  status?: TicketStatusEnum;
  priority?: TicketPriorityEnum;
  criticality?: TicketCriticalityEnum;
  reporterName?: string;
  reporterContact?: string;
  expectedCompletion?: Date | string;
};

const SideAction = ({
  id,
  level,
  priority,
  criticality,
  reporterName,
  reporterContact,
  expectedCompletion,
  disabled,
  mutate,
}: {
  id: string;
  level: TicketLevelEnum;
  priority: TicketPriorityEnum;
  criticality: TicketCriticalityEnum;
  reporterName: string;
  reporterContact: string;
  expectedCompletion: Date | string;
  disabled: boolean;
  mutate: UseMutateFunction<unknown, unknown, UpdatePayload, unknown>;
}) => {
  const initData = {
    priority,
    criticality,
    reporterName,
    reporterContact,
    expectedCompletion,
  };

  const [isOpenDialogEscalate, setOpenDialogEscalate] = useState(false);
  const [isOpenDialogResolve, setOpenDialogResolve] = useState(false);

  const [autoUpdate, setAutoUpdate] =
    useState<Record<string, string | Date | undefined>>(initData);

  const debouncedMutate = useCallback(
    debounce((data) => {
      mutate(data);
    }, 3000),
    []
  );

  useEffect(() => {
    if (isEqual(autoUpdate, initData)) return;

    const payload = clone(autoUpdate);
    if (level === "L1") delete payload.criticality;

    debouncedMutate(payload);

    return () => debouncedMutate.cancel();
  }, [autoUpdate, debouncedMutate, initData, level]);

  const handleResolveTicket = () => {
    mutate(
      {
        status: "COMPLETED",
      },
      {
        onSuccess: () => {
          toast.success("Ticket has been resolved");
          setOpenDialogResolve(false);
        },
        onError: (err) => {
          if (err instanceof AxiosError) {
            toast.error(err.response?.data?.message);
          } else {
            toast.error("Something went wrong");
          }
        },
      }
    );
  };

  return (
    <div className="border shadow-xs rounded-lg p-4">
      <div className="flex gap-4 justify-between">
        {level !== "L3" && (
          <Button
            onClick={() => setOpenDialogEscalate(true)}
            variant="secondary"
            className="cursor-pointer flex-1 text-orange-500"
            disabled={disabled}
          >
            Escalate to {level === "L1" ? "L2" : "L3"}
          </Button>
        )}
        <Button
          className="cursor-pointer flex-1"
          disabled={disabled}
          onClick={() => setOpenDialogResolve(true)}
        >
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
              disabled={disabled || level === "L1"}
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

      {isOpenDialogEscalate && (
        <DialogEscalate
          key={id}
          id={id}
          open={isOpenDialogEscalate}
          setOpen={setOpenDialogEscalate}
        />
      )}

      {isOpenDialogResolve && (
        <DialogConfirm
          isOpen={isOpenDialogResolve}
          setOpen={setOpenDialogResolve}
          title="Are you sure you want to resolve this ticket?"
          description="This action cannot be undone. This will permanently resolve your ticket."
          confirmBtnLabel="Resolve"
          confirmBtnClassName={buttonVariants({ variant: "default" })}
          onConfirm={handleResolveTicket}
        />
      )}
    </div>
  );
};

export default SideAction;
