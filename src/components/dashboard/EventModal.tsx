import { useState, useEffect, useRef } from "react";
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
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
  allDay?: boolean;
  location?: string;
  goalTag?: string;
  completed?: boolean;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  timeSlot?: { start: Date; end: Date } | null;
  onSave: (eventData: Partial<CalendarEvent>) => void;
  onDelete: () => void;
}

const colorOptions = [
  { label: "Purple", value: "#8b5cf6" }, // Primary
  { label: "Mint", value: "#5eead4" }, // Accent
  { label: "Pink", value: "#f9a8d4" }, // Accent
  { label: "Yellow", value: "#fde68a" }, // Highlight only
  { label: "Dark", value: "#1e1e2f" }, // Dark
  { label: "Gray", value: "#6b7280" }, // Medium gray
];

export function EventModal({
  isOpen,
  onClose,
  event,
  timeSlot,
  onSave,
  onDelete,
}: EventModalProps) {
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

  const [showActionPopover, setShowActionPopover] = useState(false);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setColor(event.color || "#8b5cf6");
      setAllDay(event.allDay || false);
      setStart(event.start);
      setEnd(event.end);
      setLocation(event.location || "");
      setGoalTag(event.goalTag || "");
      setCompleted(event.completed || false);
    } else if (timeSlot) {
      setTitle("");
      setDescription("");
      setColor("#8b5cf6");
      setAllDay(false);
      setStart(timeSlot.start);
      setEnd(timeSlot.end);
      setLocation("");
      setGoalTag("");
      setCompleted(false);
    } else {
      setTitle("");
      setDescription("");
      setColor("#8b5cf6");
      setAllDay(false);
      setStart(null);
      setEnd(null);
      setLocation("");
      setGoalTag("");
      setCompleted(false);
    }
    setCustomColorLabel("");
  }, [event, timeSlot, isOpen]);

  const handleSave = () => {
    if (!title.trim() || !start || !end) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      color,
      allDay,
      start,
      end,
      location,
      goalTag,
      completed,
    });
    setTitle("");
    setDescription("");
    setColor("#8b5cf6");
    setAllDay(false);
    setStart(null);
    setEnd(null);
    setLocation("");
    setGoalTag("");
    setCompleted(false);
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
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[var(--wisely-dark)]">
            {event ? "Edit Activity" : "Create New Activity"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Thời gian bắt đầu/kết thúc */}
          <div className="space-y-2">
            <Label className="text-[var(--wisely-dark)]">Time</Label>
            <div className="flex space-x-2 items-center">
              {/* Start Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!start}
                    className={cn(
                      "data-[empty=true]:text-muted-foreground w-[160px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {start ? format(start, "PPP") : <span>Pick start</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={start || undefined}
                    onSelect={(d) => d && setStart(new Date(d))}
                  />
                </PopoverContent>
              </Popover>
              {!allDay && (
                <Input
                  type="time"
                  value={start ? format(start, "HH:mm") : ""}
                  onChange={(e) => {
                    if (start && e.target.value) {
                      const [h, m] = e.target.value.split(":");
                      const d = new Date(start);
                      d.setHours(Number(h), Number(m), 0, 0);
                      setStart(new Date(d));
                    }
                  }}
                  className="w-30 min-w-0"
                />
              )}
              <span className="self-center">-</span>
              {/* End Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!end}
                    className={cn(
                      "data-[empty=true]:text-muted-foreground w-[160px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {end ? format(end, "PPP") : <span>Pick end</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={end || undefined}
                    onSelect={(d) => d && setEnd(new Date(d))}
                  />
                </PopoverContent>
              </Popover>
              {!allDay && (
                <Input
                  type="time"
                  value={end ? format(end, "HH:mm") : ""}
                  onChange={(e) => {
                    if (end && e.target.value) {
                      const [h, m] = e.target.value.split(":");
                      const d = new Date(end);
                      d.setHours(Number(h), Number(m), 0, 0);
                      setEnd(new Date(d));
                    }
                  }}
                  className="w-30 min-w-0"
                />
              )}
            </div>
            {allDay && (
              <div className="text-xs text-[var(--wisely-gray)]">
                All day: chỉ chọn ngày, không chọn giờ phút.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[var(--wisely-dark)]">
              Event Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="border-gray-300 focus:border-[var(--wisely-purple)] focus:ring-[var(--wisely-purple)]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[var(--wisely-dark)]">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description"
              rows={3}
              className="border-gray-300 focus:border-[var(--wisely-purple)] focus:ring-[var(--wisely-purple)]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[var(--wisely-dark)]">Color</Label>
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
                      ? "border-[var(--wisely-purple)]"
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                  type="button"
                />
              ))}
              {/* Color picker for custom color */}
              <label
                className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:border-[var(--wisely-purple)] relative"
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(v) => setAllDay(!!v)}
            />
            <Label htmlFor="allDay" className="text-[var(--wisely-dark)]">
              All day
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[var(--wisely-dark)]">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="border-gray-300 focus:border-[var(--wisely-purple)] focus:ring-[var(--wisely-purple)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goalTag" className="text-[var(--wisely-dark)]">
              Goal Tag
            </Label>
            <Input
              id="goalTag"
              value={goalTag}
              onChange={(e) => setGoalTag(e.target.value)}
              placeholder="Enter goal tag"
              className="border-gray-300 focus:border-[var(--wisely-purple)] focus:ring-[var(--wisely-purple)]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(v) => setCompleted(!!v)}
            />
            <Label htmlFor="completed" className="text-[var(--wisely-dark)]">
              Completed
            </Label>
          </div>

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
                className="bg-[var(--wisely-purple)] hover:bg-purple-600 text-white"
              >
                {event ? "Update" : "Create"}
              </Button>
            </div>
          </div>

          {/* Popover for right-click action (delete, change color) */}
          {event && (
            <Popover
              open={showActionPopover}
              onOpenChange={setShowActionPopover}
            >
              <PopoverTrigger asChild>
                <button
                  ref={actionButtonRef}
                  type="button"
                  className="hidden" // You can trigger this programmatically
                />
              </PopoverTrigger>
              <PopoverContent side="right" align="start" className="z-50 w-56">
                <div className="space-y-2">
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    className="w-full text-left"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete activity
                  </Button>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs">Change color:</span>
                    {colorOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setColor(option.value);
                          setShowActionPopover(false);
                        }}
                        className={`w-6 h-6 rounded-full border-2 ${
                          color === option.value
                            ? "border-[var(--wisely-purple)]"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: option.value }}
                        title={option.label}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
