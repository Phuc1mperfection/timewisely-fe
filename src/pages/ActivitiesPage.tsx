import React from "react";
import { useActivities } from "@/hooks/useActivities";
import { ActivityList } from "@/components/activities/ActivityLists";
import { Loader2 } from "lucide-react";
import { NewActivityButton } from "@/components/activities/NewActivityButton";
import { useUserActivities } from "@/hooks/useUserActivities";
import { EventModal } from "@/components/dashboard/EventModal";

const ActivitiesPage: React.FC = () => {
  const { activities, isLoading, toggleActivityComplete } = useActivities();
  const {
    handleSelectSlot,
    isActivityModalOpen,
    selectedActivity,
    setIsActivityModalOpen,
    selectedSlot,
    handleSaveActivity,
    handleDeleteActivity,
  } = useUserActivities();

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-wisely-purple" />
          <span className="ml-2 text-wisely-gray">Loading activities...</span>
        </div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="container max-w-5xl mx-auto py-8 px-4">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-wisely-dark mb-2">Error</h2>
  //         <p className="text-wisely-gray">{error}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div></div>
          <NewActivityButton
            onOpenModal={(slot) => {
              handleSelectSlot(
                slot || {
                  start: new Date(),
                  end: new Date(Date.now() + 3600000),
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

      <EventModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        event={selectedActivity}
        timeSlot={selectedSlot}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
};

export default ActivitiesPage;
