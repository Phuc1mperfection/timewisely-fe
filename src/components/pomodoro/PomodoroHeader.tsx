import React from "react";
import { Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserSettings } from "@/services/pomodoroServices";

interface PomodoroHeaderProps {
  settings: UserSettings | null;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isStatsOpen: boolean;
  setIsStatsOpen: (open: boolean) => void;
  isSavingSettings: boolean;
  tempDurations: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  setTempDurations: React.Dispatch<
    React.SetStateAction<{
      pomodoro: number;
      shortBreak: number;
      longBreak: number;
    }>
  >;
  onSaveSettings: () => void;
}

export const PomodoroHeader: React.FC<PomodoroHeaderProps> = ({
  settings,
  isSettingsOpen,
  setIsSettingsOpen,
  isStatsOpen,
  setIsStatsOpen,
  isSavingSettings,
  tempDurations,
  setTempDurations,
  onSaveSettings,
}) => {
  return (
    <div className="mb-6 relative">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        {/* Statistics Button */}
        <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Statistics</DialogTitle>
            </DialogHeader>

            <div className="py-6">
              <p className="text-sm text-muted-foreground text-center">
                Statistics will be loaded from backend API
              </p>
              {/* TODO: Add statistics charts and data here */}
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Button */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (settings) {
                  setTempDurations({
                    pomodoro: settings.focusDuration,
                    shortBreak: settings.shortBreakDuration,
                    longBreak: settings.longBreakDuration,
                  });
                }
              }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Timer Settings</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pomodoro" className="text-right">
                  Pomodoro
                </Label>
                <Input
                  id="pomodoro"
                  type="number"
                  min="1"
                  max="120"
                  value={tempDurations.pomodoro}
                  onChange={(e) =>
                    setTempDurations((prev) => ({
                      ...prev,
                      pomodoro: parseInt(e.target.value || "25"),
                    }))
                  }
                  className="col-span-2"
                />
                <Label className="text-muted-foreground">min</Label>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shortBreak" className="text-right">
                  Short Break
                </Label>
                <Input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={tempDurations.shortBreak}
                  onChange={(e) =>
                    setTempDurations((prev) => ({
                      ...prev,
                      shortBreak: parseInt(e.target.value || "5"),
                    }))
                  }
                  className="col-span-2"
                />
                <Label className="text-muted-foreground">min</Label>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longBreak" className="text-right">
                  Long Break
                </Label>
                <Input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="120"
                  value={tempDurations.longBreak}
                  onChange={(e) =>
                    setTempDurations((prev) => ({
                      ...prev,
                      longBreak: parseInt(e.target.value || "15"),
                    }))
                  }
                  className="col-span-2"
                />
                <Label className="text-muted-foreground">min</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
                disabled={isSavingSettings}
              >
                Cancel
              </Button>
              <Button onClick={onSaveSettings} disabled={isSavingSettings}>
                {isSavingSettings ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
