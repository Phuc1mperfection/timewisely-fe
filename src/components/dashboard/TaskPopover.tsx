import React, { useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Activity } from "@/interfaces/Activity";

export default function TaskPopover({
  children,
  onDelete,
}: {
  children: React.ReactElement<{ activity: Activity }>;
  onDelete?: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const child = children as React.ReactElement<{ activity: Activity }>;
  const activity = child.props.activity;

  const handleDelete = () => {
    onDelete?.();
    setShowDetail(false);
  };

  return (
    <Popover open={showDetail} onOpenChange={setShowDetail}>
      <PopoverTrigger asChild>
        <div
          ref={wrapperRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!showDetail) setShowDetail(true);
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

      {showDetail && (
        <PopoverContent
          side="right"
          align="start"
          onInteractOutside={() => setShowDetail(false)}
          className="z-50 w-72 relative"
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={() => setShowDetail(false)}
          >
            <X className="w-3 h-3" />
          </Button>

          <MemoizedPopoverContent activity={activity} onDelete={handleDelete} />
        </PopoverContent>
      )}
    </Popover>
  );
}

const MemoizedPopoverContent = React.memo(function ({
  activity,
  onDelete,
}: {
  activity: Activity;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-3 text-sm pt-6">
      {/* Header with Title and Delete Action */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <h3 className="font-bold text-base wrap-break-word line-clamp-2">
            {activity.title}
          </h3>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
            Task
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
});
