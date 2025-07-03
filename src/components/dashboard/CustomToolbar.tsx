import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CalendarDays,
} from "lucide-react";
import type { NavigateAction, View } from "react-big-calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface CustomToolbarProps {
  label: string;
  onNavigate: (action: NavigateAction, date?: Date) => void;
  onView: (view: View) => void;
  views: string[];
  view: string;
}

export function CustomToolbar({
  label,
  onNavigate,
  onView,
  views,
  view,
}: CustomToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full mb-4">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigate("TODAY")}
              >
                <CalendarDays className="w-4 h-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Today</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigate("PREV")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onNavigate("NEXT")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="font-bold text-lg flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-primary" />
        {label}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
          <Command>
            <CommandInput placeholder="Switch view..." />
            <CommandList>
              {views.map((v: string) => (
                <CommandItem key={v} onSelect={() => onView(v as View)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
