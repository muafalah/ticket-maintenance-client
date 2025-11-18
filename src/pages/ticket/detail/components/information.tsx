import { Badge } from "@/components/ui/badge";
import { SlateEditor } from "@/components/ui/slate-editor";

import type { TicketLevelEnum } from "@/validators/ticket-validator";

import { formatDateTime } from "@/lib/utils";

const levelColorMap: Record<TicketLevelEnum, string> = {
  L1: "bg-green-500",
  L2: "bg-orange-500",
  L3: "bg-red-500",
};

const Information = ({
  level,
  title,
  description,
  createdAt,
}: {
  level: TicketLevelEnum;
  title: string;
  description: string;
  createdAt: string | Date;
}) => {
  return (
    <div className="border shadow-xs rounded-lg p-4">
      <span className="flex gap-2 items-center">
        <Badge
          className={`rounded-sm h-6 w-8 ${
            levelColorMap[level as TicketLevelEnum]
          }`}
        >
          {level}
        </Badge>
        <h2 className="font-semibold text-2xl">{title}</h2>
      </span>
      <p className="text-sm text-muted-foreground my-2">
        Created time {formatDateTime(createdAt)}
      </p>
      <SlateEditor value={description} disabled />
    </div>
  );
};

export default Information;
