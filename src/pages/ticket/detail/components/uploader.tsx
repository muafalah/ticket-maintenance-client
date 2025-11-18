import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import FilesUploader from "@/components/ui/files-uploader";

import { updateTicketByIdApi } from "@/services/ticket";

import {
  ticketFileUploaderSchema,
  type TicketFileUploaderSchemaType,
} from "@/validators/ticket-validator";

export const TicketFileUploader = ({
  id,
  open,
  setOpen,
}: {
  id?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate, isPending: isPendingUpdate } = useMutation({
    mutationFn: (formData: FormData) => updateTicketByIdApi(id!, formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
      queryClient.invalidateQueries({ queryKey: ["getTicketById"] });

      form.reset();
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

  const form = useForm<TicketFileUploaderSchemaType>({
    resolver: zodResolver(ticketFileUploaderSchema),
    defaultValues: {
      attachments: [],
    },
  });

  const onSubmit = (value: TicketFileUploaderSchemaType) => {
    const formData = new FormData();

    value.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    mutate(formData);
  };

  const disabled = isPendingUpdate;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        form.reset();
        setOpen(val);
      }}
    >
      <DialogContent className="max-h-[80vh] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Upload Attachments</DialogTitle>
              <DialogDescription>
                Upload attachments to the ticket
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FilesUploader
                        value={field.value || []}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="justify-end">
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="secondary"
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={disabled}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
