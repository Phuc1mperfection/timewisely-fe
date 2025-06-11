import React, { useState, useRef } from "react";
import type { CustomEvent } from "./CustomEventCard";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

function EventWrapper({
  children,
  onDelete,
}: {
  children: React.ReactElement;
  onDelete?: () => void;
}) {
  // Lấy event từ children.props.event
  const child = children as React.ReactElement<Record<string, unknown>>;
  const event = child.props.event as CustomEvent;
  const [showDetail, setShowDetail] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Left click: show detail popover
  const handleClick = (e: React.MouseEvent) => {
    console.log("[EventWrapper] Left click event:", event);
    e.preventDefault();
    e.stopPropagation();
    setShowDetail(true);
    setShowAction(false);
  };

  // Right click: show action popover
  const handleContextMenu = (e: React.MouseEvent) => {
    console.log("[EventWrapper] Right click event:", event);
    e.preventDefault();
    e.stopPropagation();
    setShowAction(true);
    setShowDetail(false);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Hide popover on click outside
  const handleClose = () => {
    setShowDetail(false);
    setShowAction(false);
    setMousePosition(null);
  };

  return (
    <>
      {/* Detail Popover (left click) */}
      <Popover open={showDetail} onOpenChange={setShowDetail}>
        <PopoverTrigger asChild>
          <div
            ref={wrapperRef}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            style={{
              cursor: "pointer",
              width: "100%",
              height: "100%",
              background: "transparent",
              pointerEvents: "auto",
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            {children}
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          onInteractOutside={handleClose}
          className="z-50 w-72 relative"
        >
          <div className="space-y-2">
            <div className="font-bold text-[var(--wisely-dark)]">
              {event.title}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(event.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(event.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
      {showAction && mousePosition && (
        <Popover open={showAction} onOpenChange={setShowAction}>
          <PopoverContent
            side={undefined}
            align={undefined}
            onInteractOutside={handleClose}
            className="z-50 w-56"
            style={{
              position: "fixed",
              left: mousePosition.x,
              top: mousePosition.y,
              margin: 0,
              padding: 0,
              background: "white",
            }}
          >
            <div className="space-y-2 p-4">
              <Button
                variant="destructive"
                className="w-full text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  console.log(
                    "[EventWrapper] Clicked Delete Activity button",
                    event
                  );
                  if (onDelete) onDelete();
                  setShowAction(false);
                  setShowDetail(false);
                }}
              >
                Delete Activity
              </Button>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs">Change Color</span>
                {/* TODO: render color picker ở đây nếu muốn */}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}

export default EventWrapper;
