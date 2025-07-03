import React, { useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { MoreVertical, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/interfaces/Activity";

export default function ActivityPopover({
  children,
  onOpenEditDialog,
  onDelete,
}: {
  children: React.ReactElement<{ activity: Activity }>;
  onOpenEditDialog?: () => void;
  onDelete?: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Lấy activity từ children.props.activity
  const child = children as React.ReactElement<{ activity: Activity }>;
  const activity = child.props.activity;

  return (
    <Popover open={showDetail} onOpenChange={setShowDetail}>
      <PopoverTrigger asChild>
        <div
          ref={wrapperRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDetail(true);
          }}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        onInteractOutside={() => setShowDetail(false)}
        className="z-50 w-72 relative"
      >
        {/* Close button (X icon) */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={() => setShowDetail(false)}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-2 text-sm pt-6">
          <div className="flex justify-between items-center">
            <span className="font-bold">{activity.title}</span>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setShowDetail(false);
                  onOpenEditDialog?.();
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  onDelete?.();
                  setShowDetail(false);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {activity.startTime && activity.endTime && (
              <>
                {new Date(activity.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(activity.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </div>

          {activity.description && <div>{activity.description}</div>}
          {activity.location && (
            <div className="text-xs">📍 {activity.location}</div>
          )}
          {activity.goalTag && (
            <div className="text-xs">🎯 {activity.goalTag}</div>
          )}
          {typeof activity.completed === "boolean" && (
            <div className="text-xs">
              {activity.completed ? "✔ Completed" : "✗ Not completed"}
            </div>
          )}
          {activity.color && (
            <div className="flex items-center gap-2 text-xs">
              <span
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: activity.color }}
              />
              <span>{activity.color}</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
