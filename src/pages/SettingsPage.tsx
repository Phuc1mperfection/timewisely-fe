import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, BellOff, Volume2 } from "lucide-react";
import {
  loadNotificationSettings,
  saveNotificationSettings,
  resetNotificationSettings,
  type NotificationSettings,
} from "@/services/notificationSettings";
import {
  soundService,
  type PomodoroSoundType,
  type NotificationSoundType,
} from "@/services/soundService";
import { Slider } from "@/components/ui/slider";

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(
    loadNotificationSettings()
  );
  const [pomodoroSound, setPomodoroSound] = useState<PomodoroSoundType>(
    soundService.getSettings().pomodoroSound
  );
  const [notificationSound, setNotificationSound] =
    useState<NotificationSoundType>(
      soundService.getSettings().notificationSound
    );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    soundService.getSettings().enabled
  );
  const [soundVolume, setSoundVolume] = useState<number>(
    soundService.getSettings().volume * 100 // Convert to 0-100 for slider
  );

  useEffect(() => {
    saveNotificationSettings(settings);
  }, [settings]);

  const handleToggle = (
    category: keyof NotificationSettings,
    field: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]:
        typeof prev[category] === "object"
          ? { ...prev[category], [field]: value }
          : value,
    }));
  };

  const handleReset = () => {
    const defaultSettings = resetNotificationSettings();
    setSettings(defaultSettings);
  };

  const handlePomodoroSoundChange = (sound: PomodoroSoundType) => {
    setPomodoroSound(sound);
    soundService.setPomodoroSound(sound);
  };

  const handleNotificationSoundChange = (sound: NotificationSoundType) => {
    setNotificationSound(sound);
    soundService.setNotificationSound(sound);
  };

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundService.setEnabled(enabled);
  };

  const handleVolumeChange = (volume: number[]) => {
    const vol = volume[0];
    setSoundVolume(vol);
    soundService.setVolume(vol / 100); // Convert back to 0-1
  };

  const handleTestNotificationSound = () => {
    soundService.testNotification();
  };

  const handleTestPomodoroSound = () => {
    soundService.testPomodoro();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your notification and sound preferences
        </p>
      </div>

      {/* General Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Control when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled" className="text-base">
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Master switch for all notifications
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {/* Browser Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="browser-enabled" className="text-base">
                Browser Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in browser (requires permission)
              </p>
            </div>
            <Switch
              id="browser-enabled"
              checked={settings.browser.enabled}
              disabled={!settings.enabled}
              onCheckedChange={(checked) =>
                handleToggle("browser", "enabled", checked)
              }
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-enabled" className="text-base">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to your email (Coming soon)
              </p>
            </div>
            <Switch
              id="email-enabled"
              checked={settings.email.enabled}
              disabled={!settings.enabled}
              onCheckedChange={(checked) =>
                handleToggle("email", "enabled", checked)
              }
            />
          </div>

          {/* Notification Types */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base">Notification Types</Label>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="task-reminder">Task Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about upcoming tasks (3 days before due)
                </p>
              </div>
              <Switch
                id="task-reminder"
                checked={settings.reminders.taskReminder}
                disabled={!settings.enabled}
                onCheckedChange={(checked) =>
                  handleToggle("reminders", "taskReminder", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="activity-reminder">Activity Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about activities within 24 hours
                </p>
              </div>
              <Switch
                id="activity-reminder"
                checked={settings.reminders.activityReminder}
                disabled={!settings.enabled}
                onCheckedChange={(checked) =>
                  handleToggle("reminders", "activityReminder", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdue-alert">Overdue Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify about overdue tasks
                </p>
              </div>
              <Switch
                id="overdue-alert"
                checked={settings.reminders.overdueAlert}
                disabled={!settings.enabled}
                onCheckedChange={(checked) =>
                  handleToggle("reminders", "overdueAlert", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="morning-digest">Morning Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Daily summary at 7:00 AM
                </p>
              </div>
              <Switch
                id="morning-digest"
                checked={settings.reminders.morningDigest}
                disabled={!settings.enabled}
                onCheckedChange={(checked) =>
                  handleToggle("reminders", "morningDigest", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="size-5" />
            Sound Settings
          </CardTitle>
          <CardDescription>Control sound playback and volume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Enabled */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound-enabled" className="text-base">
                Enable Sound
              </Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications and pomodoro
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={soundEnabled}
              onCheckedChange={handleSoundEnabledChange}
            />
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <Label htmlFor="sound-volume" className="text-base">
              Volume: {soundVolume}%
            </Label>
            <Slider
              id="sound-volume"
              min={0}
              max={100}
              step={5}
              value={[soundVolume]}
              onValueChange={handleVolumeChange}
              disabled={!soundEnabled}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Adjust the volume level for all sounds
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="size-5" />
            Notification Sound
          </CardTitle>
          <CardDescription>
            Choose sound to play when receiving notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-sound">Sound Type</Label>
            <Select
              value={notificationSound}
              onValueChange={handleNotificationSoundChange}
            >
              <SelectTrigger id="notification-sound">
                <SelectValue placeholder="Select sound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  🔕 Default (Double Beep)
                </SelectItem>
                <SelectItem value="bell">🔔 Bell (Single Chime)</SelectItem>
                <SelectItem value="chime">🎵 Chime (Triple Tone)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotificationSound}
                disabled={!soundEnabled}
              >
                <Play className="size-4 mr-1" />
                Test Sound
              </Button>
              <p className="text-xs text-muted-foreground">
                Click to preview the selected notification sound
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pomodoro Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="size-5" />
            Pomodoro Sound
          </CardTitle>
          <CardDescription>
            Choose sound to play when pomodoro completes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pomodoro-sound">Sound Type</Label>
            <Select
              value={pomodoroSound}
              onValueChange={handlePomodoroSoundChange}
            >
              <SelectTrigger id="pomodoro-sound">
                <SelectValue placeholder="Select sound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  🎵 Default (C-E-G Chord)
                </SelectItem>
                <SelectItem value="alarm">⏰ Alarm (Rapid Beeps)</SelectItem>
                <SelectItem value="gong">🔊 Gong (Deep Resonance)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestPomodoroSound}
                disabled={!soundEnabled}
              >
                <Play className="size-4 mr-1" />
                Test Sound
              </Button>
              <p className="text-xs text-muted-foreground">
                Click to preview the selected pomodoro sound
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {settings.enabled ? (
            <>
              <Bell className="size-4" />
              <span>Notifications are enabled</span>
            </>
          ) : (
            <>
              <BellOff className="size-4" />
              <span>Notifications are disabled</span>
            </>
          )}
        </div>
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
