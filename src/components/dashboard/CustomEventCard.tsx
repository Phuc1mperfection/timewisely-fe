import { useRef, useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";

export interface CustomEvent {
  title: string;
  location?: string;
  goalTag?: string;
  completed?: boolean;
  start: Date | string | number;
  end: Date | string | number;
  description?: string;
  color?: string;
}

export function CustomEventCard({ event }: { event: CustomEvent }) {
  // Only show title and time on calendar
  const [showDetail, setShowDetail] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Helper: format time
  const formatTime = (date: Date | string | number) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Left click: show detail card
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetail(true);
    setShowAction(false);
  };

  // Right click: show action card
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAction(true);
    setShowDetail(false);
  };

  // Hide popover on click outside
  const handleClose = () => {
    setShowDetail(false);
    setShowAction(false);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: "pointer",
         display: "flex", flexDirection: "column", 
      }}
      
    >
      {/* Only show title and time on calendar */}
      <span style={{ fontWeight: 600 }}>{event.title}</span>
      {/* <span style={{ fontSize: 12, color: "#888" }}>
        {(() => {
          const duration =
            (new Date(event.end).getTime() - new Date(event.start).getTime()) /
            (1000 * 60 * 60);
          const rounded = duration.toFixed(1);
          return `${rounded} hour${Number(rounded) === 1 ? "" : "s"}`;
        })()}
      </span>{" "} */}
      {/* Detail Popover (left click) */}
      <Popover open={showDetail} onOpenChange={setShowDetail}>
        <PopoverContent
          side="right"
          align="start"
          onInteractOutside={handleClose}
          className="z-50 w-72"
        >
          <div className="space-y-2">
            <div className="font-bold text-[var(--wisely-dark)]">
              {event.title}
            </div>
            <div className="text- text-gray-500">
              {formatTime(event.start)} - {formatTime(event.end)}
            </div>
            {event.description && (
              <div className="text-sm">{event.description}</div>
            )}
            {event.location && (
              <div className="text-xs">📍 {event.location}</div>
            )}
            {event.goalTag && <div className="text-xs">🎯 {event.goalTag}</div>}
            {typeof event.completed === "boolean" && (
              <div className="text-xs">
                {event.completed ? "✔ Completed" : "✗ Not completed"}
              </div>
            )}
            {event.color && (
              <div className="flex items-center gap-2 text-xs">
                <span
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: event.color }}
                />
                <span>{event.color}</span>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      {/* Action Popover (right click) */}
      <Popover open={showAction} onOpenChange={setShowAction}>
        <PopoverContent
          side="right"
          align="start"
          onInteractOutside={handleClose}
          className="z-50 w-56"
        >
          <div className="space-y-2">
            <button
              className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded"
              onClick={() => {
                /* TODO: trigger delete */
              }}
            >
              Delete activity
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs">Change color:</span>
              {/* TODO: render color picker here and trigger color change */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
