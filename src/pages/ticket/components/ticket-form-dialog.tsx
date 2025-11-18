import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time";
import { SlateEditor } from "@/components/ui/slate-editor";
import FilesUploader from "@/components/ui/files-uploader";

import { createTicketApi } from "@/services/ticket";

import { queryClient } from "@/providers/QueryProvider";

import {
  createTicketSchema,
  TicketCategoryEnum,
  TicketPriorityEnum,
  TicketStatusEnum,
  type CreateTicketSchemaType,
} from "@/validators/ticket-validator";

import {
  TICKET_CATEGORY,
  TICKET_PRIORITY,
  TICKET_STATUS,
} from "@/lib/constants";

export const TicketFormDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => createTicketApi(formData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTickets"] });
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

  const form = useForm<CreateTicketSchemaType>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      category: TicketCategoryEnum.IMT,
      title: "",
      status: TicketStatusEnum.NEW,
      priority: TicketPriorityEnum.LOW,
      description: "",
      reporterName: "",
      reporterContact: "",
      expectedCompletion: undefined,
      attachments: [],
    },
  });

  const onSubmit = (value: CreateTicketSchemaType) => {
    const formData = new FormData();

    formData.append("category", value.category);
    formData.append("title", value.title);
    formData.append("status", value.status);
    formData.append(
      "expectedCompletion",
      value.expectedCompletion?.toISOString()
    );
    formData.append("priority", value.priority);
    formData.append("description", value.description!);
    formData.append("reporterName", value.reporterName!);
    formData.append("reporterContact", value.reporterContact!);

    if (value.attachments && value.attachments.length > 0) {
      value.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    mutate(formData);
  };

  const disabled = isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>
                You can raise a request for Support
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="space-y-5 w-full">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Select {...field} disabled={disabled}>
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Choose project name..." />
                          </SelectTrigger>
                          <SelectContent>
                            {TICKET_CATEGORY.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your ticket title"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Status</FormLabel>
                        <FormControl>
                          <Select {...field} disabled={disabled}>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Choose ticket status..." />
                            </SelectTrigger>
                            <SelectContent>
                              {TICKET_STATUS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <FormControl>
                          <Select {...field} disabled={disabled}>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Choose priority level..." />
                            </SelectTrigger>
                            <SelectContent>
                              {TICKET_PRIORITY.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <SlateEditor
                          value={field.value}
                          onChange={field.onChange}
                          disabled={disabled}
                          placeholder="Type your type description..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachments</FormLabel>
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
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reporterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reporter name"
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reporterContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reporter number"
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="expectedCompletion"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date & Time</FormLabel>

                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabled={disabled}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
