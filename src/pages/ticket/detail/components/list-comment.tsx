/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

import { getTicketCommentsApi } from "@/services/ticket-comment";

import FormComment from "./form-comment";

const ListComment = ({ id }: { id: string }) => {
  const { data } = useQuery({
    queryKey: ["getTicketComments", id],
    queryFn: () => getTicketCommentsApi(id),
  });

  return (
    <div className="space-y-6">
      {data?.data?.map((item: any) => (
        <FormComment
          key={item?._id}
          id={id}
          user={{
            id: item?.commentedBy?._id,
            name: item?.commentedBy?.name,
            profilePicture: item?.commentedBy?.profilePicture,
          }}
          commentId={item?._id}
          comment={item?.comment}
          updatedAt={item?.updatedAt}
          disabled
        />
      ))}
    </div>
  );
};

export default ListComment;
