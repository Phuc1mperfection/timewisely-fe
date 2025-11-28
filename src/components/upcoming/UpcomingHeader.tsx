import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UpcomingHeaderProps {
  selectedMonth: string;
  selectedDate: Date;
  onToday: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onDateSelect: (date: Date) => void;
  compact?: boolean;
}

export function UpcomingHeader({
  selectedMonth,
  selectedDate,
  onToday,
  onPrevious,
  onNext,
  onDateSelect,
  compact = false,
}: UpcomingHeaderProps) {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(9, 0, 0, 0);
      onDateSelect(date);
      setOpen(false);
    }
  };

  // When compact is true (user scrolled down), hide the header completely
  if (compact) return null;

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
      <div className={cn("flex items-center", "justify-between")}>
        <h1 className="text-2xl font-bold text-foreground">Upcoming</h1>

        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {selectedMonth}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToday}
              className="h-8 px-3 text-sm"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
