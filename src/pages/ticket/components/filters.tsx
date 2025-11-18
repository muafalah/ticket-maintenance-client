import { Funnel, X } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { TICKET_LEVEL, TICKET_PRIORITY, TICKET_STATUS } from "@/lib/constants";

export const FilterDrawer = ({
  filters,
  setFilters,
}: {
  filters: Record<string, string | undefined>;
  setFilters: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
}) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger className="cursor-pointer" asChild>
        <Button variant="outline">
          <Funnel />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Select
                  key={filters.status ?? "empty"}
                  value={filters.status}
                  onValueChange={(e) => {
                    setFilters((prev) => ({ ...prev, status: e }));
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Choose status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filters.status && (
                  <button
                    className="p-2 rounded hover:bg-muted"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, status: undefined }))
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex items-center gap-2">
                <Select
                  key={filters.priority ?? "empty"}
                  value={filters.priority}
                  onValueChange={(e) => {
                    setFilters((prev) => ({ ...prev, priority: e }));
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
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

                {filters.priority && (
                  <button
                    className="p-2 rounded hover:bg-muted"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, priority: undefined }))
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <div className="flex items-center gap-2">
                <Select
                  key={filters.level ?? "empty"}
                  value={filters.level}
                  onValueChange={(e) => {
                    setFilters((prev) => ({ ...prev, level: e }));
                  }}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Choose level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_LEVEL.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filters.level && (
                  <button
                    className="p-2 rounded hover:bg-muted"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, level: undefined }))
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <DrawerFooter className="border-t">
            <DrawerClose asChild>
              <Button onClick={() => setFilters({})} variant="outline">
                Reset Filters
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
