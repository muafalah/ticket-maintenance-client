import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DateTimePicker({
  value,
  onChange,
  disabled = false,
}: {
  value?: Date;
  onChange: (value: Date | undefined) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  // Local temp states for date & time
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value);
  const [tempTime, setTempTime] = React.useState<string>(
    value ? format(value, "HH:mm") : ""
  );

  // Update final combined DateTime
  const updateDateTime = (selectedDate?: Date, selectedTime?: string) => {
    if (!selectedDate) {
      onChange(undefined);
      return;
    }

    const time = selectedTime ?? tempTime;

    const [hours, minutes] = time?.split(":").map(Number) ?? [0, 0];

    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours || 0);
    newDateTime.setMinutes(minutes || 0);

    onChange(newDateTime);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP HH:mm") : "Pick date & time"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={(date) => {
            setTempDate(date);
            updateDateTime(date, tempTime);
          }}
          initialFocus
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Time</p>
          <Input
            type="time"
            value={tempTime}
            onChange={(e) => {
              setTempTime(e.target.value);
              updateDateTime(tempDate, e.target.value);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
