import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { PlusCircle, Search } from "lucide-react";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/datatable";

import { getTicketsApi } from "@/services/ticket";

import type {
  TicketCategoryEnum,
  TicketLevelEnum,
  TicketPriorityEnum,
  TicketQuerySchemaType,
  TicketStatusEnum,
} from "@/validators/ticket-validator";

import { DEFAULT_PAGINATION } from "@/lib/constants";

import { columns } from "./columns";
import { FilterDrawer } from "./filters";
import { TicketFormDialog } from "./ticket-form-dialog";
import { useAuth } from "@/hooks/useAuth";

const initFilters = {
  status: undefined,
  priority: undefined,
  level: undefined,
};

export const ListTicket = ({ category }: { category: TicketCategoryEnum }) => {
  const { user } = useAuth();

  const [keyword, setKeyword] = useState<string>("");
  const [pagination, setPagination] =
    useState<PaginationState>(DEFAULT_PAGINATION);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: false,
    },
  ]);
  const [filters, setFilters] =
    useState<Record<string, string | undefined>>(initFilters);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const debouncedKeyword = useMemo(
    () => debounce((value: string) => setKeyword(value), 1000),
    []
  );

  const params: TicketQuerySchemaType = {
    category: category,
    pageNumber: pagination.pageIndex,
    pageSize: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
    keyword,
    status: filters.status as TicketStatusEnum,
    priority: filters.priority as TicketPriorityEnum,
    level: filters.level as TicketLevelEnum,
  };

  const { data: tickets, isFetching } = useQuery({
    queryKey: ["getTickets", params],
    queryFn: () => getTicketsApi(params),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative max-w-xs w-full">
            <Input
              className="max-w-xs"
              onChange={(e) => debouncedKeyword(e.target.value)}
              placeholder="Search ticket..."
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          </div>
          <FilterDrawer filters={filters} setFilters={setFilters} />
        </div>
        {user?.role === "L1" && (
          <Button
            className="cursor-pointer"
            onClick={() => setIsOpenModal(true)}
          >
            <PlusCircle /> Create Ticket
          </Button>
        )}
      </div>

      <div>
        <DataTable
          isLoading={isFetching}
          data={tickets?.data || []}
          columns={columns(pagination.pageIndex, pagination.pageSize)}
          totalData={tickets?.pagination.totalData || 0}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>

      {isOpenModal && (
        <TicketFormDialog open={isOpenModal} setOpen={setIsOpenModal} />
      )}
    </div>
  );
};
