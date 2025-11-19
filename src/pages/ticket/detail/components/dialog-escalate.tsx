import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { queryClient } from "@/providers/QueryProvider";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getUsersApi } from "@/services/user";
import { escalateTicketByIdApi } from "@/services/ticket";

export function DialogEscalate({
  id,
  open,
  setOpen,
}: {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [technician, setTechnician] = useState("");

  const { mutate } = useMutation({
    mutationFn: () =>
      escalateTicketByIdApi(id!, {
        assignedTo: technician,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
      queryClient.invalidateQueries({ queryKey: ["getTicketById", id] });
      queryClient.invalidateQueries({ queryKey: ["getTicketHistory"] });

      setOpen(false);

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

  const { data } = useQuery({
    queryKey: ["getUsers"],
    queryFn: () => getUsersApi(),
  });

  const TECHNICIAN_OPTIONS = data?.data.map(
    (user: { _id: string; name: string }) => ({
      value: user._id,
      label: user.name,
    })
  );

  return (
    data && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Can't resolve this ticket?</DialogTitle>
            <DialogDescription>
              You can escalate it to next Level support for more help. Please
              assign a technician before escalating. This action can't be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Assign Technician</Label>
            <Select value={technician} onValueChange={setTechnician}>
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Choose project name..." />
              </SelectTrigger>
              <SelectContent>
                {TECHNICIAN_OPTIONS.map(
                  (opt: { value: string; label: string }) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={() => mutate()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
}
