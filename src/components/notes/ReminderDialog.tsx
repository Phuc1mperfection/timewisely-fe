import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import type { NoteReminder, SetReminderPayload } from '@/services/noteService';

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingReminder: NoteReminder | null;
  onSchedule: (payload: SetReminderPayload) => void;
  isPending: boolean;
}

type Channel = 'EMAIL' | 'PUSH';

export function ReminderDialog({
  open,
  onOpenChange,
  existingReminder,
  onSchedule,
  isPending,
}: ReminderDialogProps) {
  const [dateTimeValue, setDateTimeValue] = useState('');
  const [channels, setChannels] = useState<Channel[]>(['PUSH']);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill if editing existing reminder
  useEffect(() => {
    if (open) {
      if (existingReminder && existingReminder.status === 'SCHEDULED') {
        // Convert ISO to local datetime-local format
        const date = parseISO(existingReminder.remindAt);
        const localDateTime = format(date, "yyyy-MM-dd'T'HH:mm");
        setDateTimeValue(localDateTime);
        setChannels(existingReminder.channels as Channel[]);
      } else {
        // Default: 1 hour from now
        const defaultDate = new Date(Date.now() + 60 * 60 * 1000);
        setDateTimeValue(format(defaultDate, "yyyy-MM-dd'T'HH:mm"));
        setChannels(['PUSH']);
      }
      setError(null);
    }
  }, [open, existingReminder]);

  const handleChannelToggle = (channel: Channel, checked: boolean) => {
    if (checked) {
      setChannels((prev) => [...prev, channel]);
    } else {
      setChannels((prev) => prev.filter((c) => c !== channel));
    }
  };

  const handleSubmit = () => {
    setError(null);

    // Validate date is in the future
    const selectedDate = new Date(dateTimeValue);
    if (selectedDate <= new Date()) {
      setError('Please select a future date and time');
      return;
    }

    // Validate at least one channel
    if (channels.length === 0) {
      setError('Please select at least one notification channel');
      return;
    }

    // Convert local time to ISO string
    const remindAt = selectedDate.toISOString();

    onSchedule({ remindAt, channels });
  };

  // Get minimum datetime (now + 1 minute)
  const getMinDateTime = () => {
    const now = new Date(Date.now() + 60000);
    return format(now, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Schedule Reminder
          </DialogTitle>
         
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date/Time Picker */}
          <div className="space-y-2">
            <Label htmlFor="remind-at">Remind at</Label>
            <input
              id="remind-at"
              type="datetime-local"
              value={dateTimeValue}
              onChange={(e) => setDateTimeValue(e.target.value)}
              min={getMinDateTime()}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Time shown in your local timezone
            </p>
          </div>

          {/* Channel Selection */}
          <div className="space-y-3">
            <Label>Notify via</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channel-email"
                  checked={channels.includes('EMAIL')}
                  onCheckedChange={(checked) =>
                    handleChannelToggle('EMAIL', checked as boolean)
                  }
                />
                <Label htmlFor="channel-email" className="font-normal cursor-pointer">
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channel-push"
                  checked={channels.includes('PUSH')}
                  onCheckedChange={(checked) =>
                    handleChannelToggle('PUSH', checked as boolean)
                  }
                />
                <Label htmlFor="channel-push" className="font-normal cursor-pointer">
                  In-app notification
                </Label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Scheduling...' : 'Schedule Reminder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
