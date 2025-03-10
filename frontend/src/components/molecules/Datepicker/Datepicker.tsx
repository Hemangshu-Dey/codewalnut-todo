import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button/Button";
import { Calendar } from "../Calender/Calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/Popover/Popover";

interface DatePickerDemoProps {
  selectedDate: string | undefined;
  setSelectedDate: (date: string | undefined) => void;
}

export function DatePickerDemo({
  selectedDate,
  setSelectedDate,
}: DatePickerDemoProps) {
  const date = selectedDate ? new Date(selectedDate) : undefined;

  const handleDateSelect = (selected: Date | undefined) => {
    setSelectedDate(selected ? selected.toISOString() : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
