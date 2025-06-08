import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string;
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
  { label: 'Purple', value: '#8b5cf6' },    // Primary
  { label: 'Mint', value: '#5eead4' },      // Accent
  { label: 'Pink', value: '#f9a8d4' },      // Accent
  { label: 'Yellow', value: '#fde68a' },    // Highlight only
  { label: 'Dark', value: '#1e1e2f' },      // Dark
  { label: 'Gray', value: '#6b7280' },      // Medium gray
];

export function EventModal({ isOpen, onClose, event, timeSlot, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8b5cf6');  // Default to purple

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setColor(event.color || '#8b5cf6');
    } else {
      setTitle('');
      setDescription('');
      setColor('#8b5cf6');
    }
  }, [event, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      color
    });
    
    setTitle('');
    setDescription('');
    setColor('#8b5cf6');
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setColor('#8b5cf6');
    onClose();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-wisely-dark">
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {(event || timeSlot) && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-wisely-gray">
                <strong>Time:</strong> {formatTime((event || timeSlot)!.start)} - {formatTime((event || timeSlot)!.end)}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-wisely-dark">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="border-gray-300 focus:border-wisely-purple focus:ring-wisely-purple"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-wisely-dark">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description"
              rows={3}
              className="border-gray-300 focus:border-wisely-purple focus:ring-wisely-purple"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-wisely-dark">Color</Label>
            <div className="flex space-x-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === option.value ? 'border-wisely-purple' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                />
              ))}
            </div>
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
              <Button variant="outline" onClick={handleClose} className="border-gray-300 text-wisely-gray hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!title.trim()}
                className="bg-wisely-purple hover:bg-purple-600 text-white"
              >
                {event ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
