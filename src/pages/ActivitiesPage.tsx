import React from "react";
import { ActivityList } from "@/components/activities/ActivityLists";
import { Loader2 } from "lucide-react";
import { NewActivityButton } from "@/components/activities/NewActivityButton";
import { useActivities } from "@/hooks/useActivity";
import { ActivityDialog } from "@/components/dashboard/ActivityDialog";

const ActivitiesPage: React.FC = () => {
  const {
    activities,
    toggleActivityComplete,
    loading,
    handleSelectSlot,
    isActivityModalOpen,
    selectedActivity,
    setIsActivityModalOpen,
    selectedSlot,
    handleSaveActivity,
    handleDeleteActivity,
  } = useActivities();

  // Helper: convert {startTime, endTime} to {start, end}
  const slotToLegacy = (slot: { startTime: Date; endTime: Date } | null) =>
    slot ? { start: slot.startTime, end: slot.endTime } : null;

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-wisely-purple" />
          <span className="ml-2 text-wisely-gray">Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div></div>
          <NewActivityButton
            onOpenModal={(slot) => {
              handleSelectSlot(
                slot
                  ? { startTime: slot.start, endTime: slot.end }
                  : {
                      startTime: new Date(),
                      endTime: new Date(Date.now() + 3600000),
                    }
              );
            }}
          />
        </div>
        <h1 className="text-3xl font-bold text-wisely-dark">Activities</h1>
        <p className="text-wisely-gray text-base">
          Manage your activities and track your progress.
        </p>
      </div>

      <ActivityList
        activities={activities}
        onToggleComplete={toggleActivityComplete}
      />

      <ActivityDialog
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={
          selectedActivity
            ? {
                ...selectedActivity,
                start: selectedActivity.startTime,
                end: selectedActivity.endTime,
              }
            : null
        }
        timeSlot={slotToLegacy(selectedSlot)}
        onSave={handleSaveActivity}
        onDelete={() => {
          if (selectedActivity) {
            handleDeleteActivity(selectedActivity.id);
          }
        }}
      />
    </div>
  );
};

export default ActivitiesPage;
