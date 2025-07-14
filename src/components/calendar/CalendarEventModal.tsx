import React, { useState, useEffect } from "react";
import { Trash2, Clock, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EventData {
  id?: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  colorId?: string;
  calendarId?: string;
  calendarName?: string;
  originalEvent?: unknown;
}

interface CalendarEventModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  event: EventData;
  onClose: () => void;
  onSave: (event: EventData) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
}

function CalendarEventModal({
  isOpen,
  mode,
  event,
  onClose,
  onSave,
  onDelete,
}: CalendarEventModalProps) {
  const [formData, setFormData] = useState(event);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "start" | "end"
  ) => {
    const dateString = e.target.value;
    if (dateString) {
      setFormData((prev) => ({
        ...prev,
        [field]: new Date(dateString),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id || !onDelete) return;

    setDeleting(true);

    try {
      await onDelete(formData.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle >
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calendar Info - Only show for edit mode and if available */}
          {mode === "edit" && formData.calendarName && (
            <div >
              <Calendar size={16} className="text-white/70 mt-0.5" />
              <div>
                <p>Calendar</p>
                <p >{formData.calendarName}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" >
              Event Title *
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Meeting, Appointment, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start" >
                Start Time *
              </Label>
              <Input
                type="datetime-local"
                id="start"
                name="start"
                value={
                  formData.start
                    ? formData.start.toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => handleDateChange(e, "start")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end" >
                End Time *
              </Label>
              <Input
                type="datetime-local"
                id="end"
                name="end"
                value={
                  formData.end ? formData.end.toISOString().slice(0, 16) : ""
                }
                onChange={(e) => handleDateChange(e, "end")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" >
              Location
            </Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Office, Home, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Event details..."
            />
          </div>

          <div className="flex justify-between pt-2">
            {mode === "edit" && onDelete && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                variant="destructive"
              >
                {deleting ? (
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2" size={16} />
                )}
                Delete
              </Button>
            )}
            <div className="ml-auto flex gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                {saving && <Clock className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CalendarEventModal;
