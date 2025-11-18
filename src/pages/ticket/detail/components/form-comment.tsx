import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useState } from "react";

import { queryClient } from "@/providers/QueryProvider";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SlateEditor } from "@/components/ui/slate-editor";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  createTicketCommentApi,
  deleteTicketCommentByIdApi,
  updateTicketCommentApi,
} from "@/services/ticket-comment";

import { useAuth } from "@/hooks/useAuth";

import {
  createTicketCommentSchema,
  type CreateTicketCommentSchemaType,
} from "@/validators/ticket-comment-validator";

import { formatDateTime, getInitial } from "@/lib/utils";

const FormComment = ({
  id,
  user,
  commentId,
  comment,
  disabled: disabledComment,
  updatedAt,
}: {
  id: string;
  user?: {
    id: string;
    name: string;
    profilePicture: string;
  };
  commentId?: string;
  comment?: string;
  disabled?: boolean;
  updatedAt?: string | Date;
}) => {
  const { user: currUser } = useAuth();

  const [disabled, setDisabled] = useState(disabledComment);

  const form = useForm<CreateTicketCommentSchemaType>({
    resolver: zodResolver(createTicketCommentSchema),
    defaultValues: {
      ticketId: id,
      comment: comment || "",
    },
  });

  const { mutate: createComment, isPending: isPendingCreate } = useMutation({
    mutationFn: (body: CreateTicketCommentSchemaType) =>
      createTicketCommentApi(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTicketComments"] });

      form.reset();

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

  const { mutate: updateComment, isPending: isPendingUpdate } = useMutation({
    mutationFn: (body: CreateTicketCommentSchemaType) =>
      updateTicketCommentApi(commentId!, body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTicketComments"] });

      form.reset();
      setDisabled(true);

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

  const { mutate: mutateDelete } = useMutation({
    mutationFn: () => deleteTicketCommentByIdApi(commentId!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTicketComments"] });
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

  const onSubmit = (value: CreateTicketCommentSchemaType) => {
    if (commentId) {
      updateComment(value);
    } else {
      createComment(value);
    }
  };

  const profilePicture = user?.profilePicture || currUser?.profilePicture;
  const name = user?.name || currUser?.name;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex gap-2">
          <div>
            <Avatar className="h-8 w-8 rounded-full me-2">
              <AvatarImage src={profilePicture} alt={name} />
              <AvatarFallback className="rounded-lg">
                {getInitial(name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full space-y-2">
            <div className="space-x-2">
              <span className="font-semibold">{name}</span>
              {updatedAt && (
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(updatedAt)}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SlateEditor
                        key={form.formState.submitCount}
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
              {disabled ? (
                <div>
                  <button
                    className="text-sm cursor-pointer hover:text-orange-500 disabled:text-muted-foreground  "
                    onClick={() => setDisabled(false)}
                    disabled={currUser?._id !== user?.id}
                  >
                    Edit
                  </button>
                  <span> | </span>
                  <button
                    className="text-sm cursor-pointer hover:text-red-500 disabled:text-muted-foreground disabled:cursor-not-allowed"
                    onClick={() => mutateDelete()}
                    disabled={currUser?._id !== user?.id}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="flex justify-end">
                  {commentId && (
                    <Button
                      variant="secondary"
                      className="cursor-pointer me-4"
                      disabled={isPendingCreate || isPendingUpdate}
                      onClick={() => {
                        setDisabled(true);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    disabled={isPendingCreate || isPendingUpdate}
                  >
                    {commentId ? "Edit" : "Add"} Comment
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormComment;
