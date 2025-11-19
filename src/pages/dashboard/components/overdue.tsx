import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

import { getOverdueTicketsApi } from "@/services/ticket";

import type { TicketCategoryEnum } from "@/validators/ticket-validator";

import { formatDateTime } from "@/lib/utils";

const Overdue = ({ category }: { category: TicketCategoryEnum }) => {
  const navigate = useNavigate();

  const { data, isFetching } = useQuery({
    queryKey: ["getTicketById", category],
    queryFn: () => getOverdueTicketsApi(category as TicketCategoryEnum),
    enabled: !!category,
  });

  return (
    <div className="border shadow-xs rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="font-medium text-2xl">Overdue Tickets </h1>
        {data?.data && (
          <Badge className="rounded-full h-6 w-fit bg-red-500 text-xs">
            {data?.data?.length} tickets
          </Badge>
        )}
      </div>
      {isFetching ? (
        <div className="w-full flex justify-center items-center h-20 bg-muted rounded-md">
          <Spinner />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Code</TableHead>
              <TableHead>Ticket Title</TableHead>
              <TableHead>Support Level</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          {data?.data?.length > 0 ? (
            <TableBody>
              {data?.data?.map(
                (item: {
                  _id: string;
                  code: string;
                  title: string;
                  level: string;
                  expectedCompletion: string;
                }) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.level}</TableCell>
                    <TableCell>
                      {formatDateTime(item.expectedCompletion)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon-sm"
                        variant="link"
                        className="text-black cursor-pointer"
                        onClick={() => navigate(`/ticket-detail/${item._id}`)}
                      >
                        <Eye className="size-4 cursor-pointer" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center h-20">
                  No Data
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      )}
    </div>
  );
};

export default Overdue;
