import { memo } from "react";
import { ActivityCard } from "./ActivityCard";
import { motion } from "motion/react";
import type { Activity } from "@/interfaces/Activity";
import { PaginatedList } from "@/components/common";

interface ActivityListProps {
  activities: Activity[];
  onToggleComplete: (activityId: string) => void;
  itemsPerPage?: number;
}

export const ActivityList = memo<ActivityListProps>(
  ({ activities, onToggleComplete, itemsPerPage = 5 }) => {
    const incompleteActivities = activities.filter(
      (activity) => !activity.completed
    );
    const completedActivities = activities.filter(
      (activity) => activity.completed
    );

    // Render function for activity cards with animation
    const renderActivityCard = (activity: Activity, index: number) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <ActivityCard activity={activity} onToggleComplete={onToggleComplete} />
      </motion.div>
    );

    // If no activities at all
    if (activities.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
          <p>Add your activity from the form above to get started.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {incompleteActivities.length === 0 ? (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              All activities complete
            </h2>
            <p>Nice work!</p>
          </div>
        ) : (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Active Activities ({incompleteActivities.length})
            </h2>
            <PaginatedList
              items={incompleteActivities}
              itemsPerPage={itemsPerPage}
              renderItem={renderActivityCard}
              emptyMessage="No active activities"
            />
          </section>
        )}

        {completedActivities.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Completed Activities ({completedActivities.length})
            </h2>
            <PaginatedList
              items={completedActivities}
              itemsPerPage={itemsPerPage}
              renderItem={renderActivityCard}
              emptyMessage="No completed activities"
            />
          </section>
        )}
      </div>
    );
  }
);

ActivityList.displayName = "ActivityList";
