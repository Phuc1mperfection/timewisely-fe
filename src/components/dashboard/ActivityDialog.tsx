import React, { useState, useEffect, useCallback, useMemo, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MapPin, Goal, SquareMenu, Clock4 } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { Activity } from "@/interfaces/Activity";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface ActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Activity | null;
  timeSlot?: { start: Date; end: Date } | null;
  onSave: (eventData: Partial<Activity>) => void;
  onDelete: () => void;
}

// DateTimePicker component
const DateTimePicker = React.memo(function DateTimePicker({
  label,
  value,
  onChangeDate,
  onChangeTime,
  allDay,
}: {
  label: string;
  value: Date | null;
  onChangeDate: (date: Date) => void;
  onChangeTime: (time: string) => void;
  allDay: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" data-empty={!value}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick {label}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(d) => d && onChangeDate(new Date(d))}
          />
        </PopoverContent>
      </Popover>
      {!allDay && (
        <Input
          type="time"
          value={value ? format(value, "HH:mm") : ""}
          onChange={(e) => onChangeTime(e.target.value)}
          className="w-30 min-w-0"
        />
      )}
    </div>
  );
});

// ColorPicker component
const ColorPicker = React.memo(function ColorPicker({
  color,
  setColor,
  customColorLabel,
  setCustomColorLabel,
  colorOptions,
}: {
  color: string;
  setColor: (color: string) => void;
  customColorLabel: string;
  setCustomColorLabel: (label: string) => void;
  colorOptions: { label: string; value: string }[];
}) {
  return (
    <div className="flex items-center space-x-2">
      {colorOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setColor(option.value);
            setCustomColorLabel("");
          }}
          className={`w-8 h-8 rounded-full border-2 ${
            color === option.value
              ? "border-[var(--wisely-gold)]"
              : "border-gray-200"
          }`}
          style={{ backgroundColor: option.value }}
          title={option.label}
          type="button"
        />
      ))}
      <label
        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:scale-105 transition-all relative"
        title={customColorLabel ? customColorLabel : "Custom color"}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Pick custom color"
        />
        <span
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
        />
      </label>
    </div>
  );
});

export function ActivityDialog({
  isOpen,
  onClose,
  event,
  timeSlot,
  onSave,
  onDelete,
}: ActivityDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#8b5cf6");
  const [allDay, setAllDay] = useState(false); // Thêm state allDay
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [goalTag, setGoalTag] = useState("");
  const [completed, setCompleted] = useState(false);
  const [customColorLabel, setCustomColorLabel] = useState("");
  const [showMore, setShowMore] = useState(false);
  const descId = useId();

  const colorOptions = useMemo(
    () => [
      { label: "yellow", value: "#8b5cf6" }, // Primary
      { label: "Mint", value: "#5eead4" }, // Accent
      { label: "Pink", value: "#f9a8d4" }, // Accent
      { label: "Yellow", value: "#fde68a" }, // Highlight only
      { label: "Dark", value: "#1e1e2f" }, // Dark
      { label: "Gray", value: "#6b7280" }, // Medium gray
    ],
    []
  );

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setColor(event.color || "#8b5cf6");
      setAllDay(event.allDay || false);
      setStart(event.startTime);
      setEnd(event.endTime);
      setLocation(event.location || "");
      setGoalTag(event.goalTag || "");
      setCompleted(event.completed || false);
    } else if (timeSlot) {
      setTitle("");
      setDescription("");
      setAllDay(false);
      setStart(timeSlot.start);
      setEnd(timeSlot.end);
      setLocation("");
      setGoalTag("");
      setCompleted(false);
    } else {
      setTitle("");
      setDescription("");
      setAllDay(false);
      setStart(null);
      setEnd(null);
      setLocation("");
      setGoalTag("");
      setCompleted(false);
    }
    setCustomColorLabel("");
    setShowMore(false);
  }, [event, timeSlot, isOpen]);

  // Memoized handlers
  const handleStartDate = useCallback((date: Date) => setStart(date), []);
  const handleStartTime = useCallback(
    (time: string) => {
      if (start && time) {
        const [h, m] = time.split(":");
        const d = new Date(start);
        d.setHours(Number(h), Number(m), 0, 0);
        setStart(new Date(d));
      }
    },
    [start]
  );
  const handleEndDate = useCallback((date: Date) => setEnd(date), []);
  const handleEndTime = useCallback(
    (time: string) => {
      if (end && time) {
        const [h, m] = time.split(":");
        const d = new Date(end);
        d.setHours(Number(h), Number(m), 0, 0);
        setEnd(new Date(d));
      }
    },
    [end]
  );
  const handleSetColor = useCallback((c: string) => setColor(c), []);
  const handleSetCustomColorLabel = useCallback(
    (l: string) => setCustomColorLabel(l),
    []
  );

  const handleSave = () => {
    if (!title.trim() || !start || !end) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      color,
      allDay,
      startTime: start,
      endTime: end,
      location,
      goalTag,
      completed,
    });
    setTitle("");
    setDescription("");
    setAllDay(false);
    setStart(null);
    setEnd(null);
    setLocation("");
    setGoalTag("");
    setCompleted(false);
    setShowMore(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setColor("#8b5cf6");
    setAllDay(false);
    setStart(null);
    setEnd(null);
    setLocation("");
    setGoalTag("");
    setCompleted(false);
    setShowMore(false);
    onClose();
  };

  // Sửa lỗi ESC: chỉ reset state khi thực sự tạo mới/cancel, không reset khi đóng modal bằng ESC
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Chỉ gọi onClose, không reset state (giữ nguyên event/timeSlot)
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[800px] " aria-describedby={descId}>
        <DialogHeader>
          <DialogTitle>
            {event ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
        </DialogHeader>
        <p id={descId} className="sr-only">
          {event
            ? "Edit your activity details, time, color, and more."
            : "Create a new activity by filling in the details below."}
        </p>
        <div className="space-y-4">
          <div className="space-y-2 gap-2 ">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              className="border-gray-300 focus:border-[var(--wisely-gold)] focus:ring-[var(--wisely-gold)]"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={allDay}
                onCheckedChange={(v) => setAllDay(!!v)}
              />
              <Label htmlFor="allDay">All day</Label>
            </div>
            <div className="flex items-center space-x-2"></div>
          </div>
          {/* Thời gian bắt đầu/kết thúc */}
          <div className="flex items-center gap-2 ">
            <Clock4></Clock4>
            <div className="flex space-x-2 items-center">
              <DateTimePicker
                label="start"
                value={start}
                onChangeDate={handleStartDate}
                onChangeTime={handleStartTime}
                allDay={allDay}
              />
              <span className="self-center">-</span>
              <DateTimePicker
                label="end"
                value={end}
                onChangeDate={handleEndDate}
                onChangeTime={handleEndTime}
                allDay={allDay}
              />
            </div>
            {allDay && (
              <div className="text-xs ">All day: just pick day, not time.</div>
            )}
          </div>

          {!showMore && (
            <button
              onClick={() => setShowMore(true)}
              className="text-sm text-[var(--wisely-gold)] hover:underline"
            >
              Show more options
            </button>
          )}

          {showMore && (
            <>
              <div className="space-y-2 gap-2 flex justify-between items-center  ">
                <SquareMenu></SquareMenu>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows={3}
                  className=" focus:border-[var(--wisely-gold)] focus:ring-[var(--wisely-gold)] "
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPicker
                  color={color}
                  setColor={handleSetColor}
                  customColorLabel={customColorLabel}
                  setCustomColorLabel={handleSetCustomColorLabel}
                  colorOptions={colorOptions}
                />
                {/* Show input for custom color label if color is not in preset */}
                {!colorOptions.some((opt) => opt.value === color) && (
                  <div className="pt-1 flex items-center space-x-2">
                    <Input
                      type="text"
                      value={customColorLabel}
                      onChange={(e) => setCustomColorLabel(e.target.value)}
                      placeholder="Enter color name (legend)"
                      className="w-48 border-gray-300 text-xs py-1 px-2"
                      maxLength={20}
                    />
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </div>
                )}
                <div className="text-xs text-gray-400 pt-1">
                  You can pick any color or use a preset.
                </div>
              </div>

              <div className="space-y-2 gap-2 flex justify-between ">
                <MapPin>Location</MapPin>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="focus:border-[var(--wisely-gold)] focus:ring-[var(--wisely-gold)] "
                />
              </div>
              <div className="space-y-2 gap-2 flex justify-between">
                <Goal>Goal Tag</Goal>
                <Input
                  id="goalTag"
                  value={goalTag}
                  onChange={(e) => setGoalTag(e.target.value)}
                  placeholder="Enter goal tag"
                  className="focus:border-[var(--wisely-gold)] focus:ring-[var(--wisely-gold)] border-0"
                />
              </div>

              <button
                onClick={() => setShowMore(false)}
                className="text-sm text-[var(--wisely-gold)] hover:underline"
              >
                Show less
              </button>
            </>
          )}
          <div className="flex justify-between pt-4">
            {event && (
              <Button
                variant="destructive"
                onClick={onDelete}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </Button>
            )}

            <div className="flex space-x-2 ml-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 text-[var(--wisely-gray)] hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim()}
                className="bg-[var(--wisely-gold)] hover:bg-yellow-600 text-white"
              >
                {event ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
