import React, { useState, useEffect } from "react";
import { X, Trash2, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-white/70 hover:text-white"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-bold text-white mb-4">
          {mode === "create" ? "Create New Event" : "Edit Event"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calendar Info - Only show for edit mode and if available */}
          {mode === "edit" && formData.calendarName && (
            <div className="mb-4 bg-white/5 p-3 rounded-md flex items-start gap-2">
              <Calendar size={16} className="text-white/70 mt-0.5" />
              <div>
                <p className="text-white/90 text-sm font-medium">Calendar</p>
                <p className="text-white/70 text-sm">{formData.calendarName}</p>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-white/80 text-sm font-medium mb-1"
            >
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white px-4 py-2"
              placeholder="Meeting, Appointment, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start"
                className="block text-white/80 text-sm font-medium mb-1"
              >
                Start Time *
              </label>
              <input
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
                className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white px-4 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="end"
                className="block text-white/80 text-sm font-medium mb-1"
              >
                End Time *
              </label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={
                  formData.end ? formData.end.toISOString().slice(0, 16) : ""
                }
                onChange={(e) => handleDateChange(e, "end")}
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-white/80 text-sm font-medium mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white px-4 py-2"
              placeholder="Office, Home, etc."
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-white/80 text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white px-4 py-2"
              placeholder="Event details..."
            />
          </div>

          <div className="flex justify-between pt-2">
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                {deleting ? (
                  <Clock className="animate-spin h-4 w-4" />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            )}
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                {saving && <Clock className="animate-spin h-4 w-4" />}
                {mode === "create" ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default CalendarEventModal;
