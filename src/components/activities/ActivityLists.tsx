
import React from 'react';
import { ActivityCard } from './ActivityCard';
import { motion } from 'motion/react'; // Ensure you have motion/react installed
import type { Activity } from '@/interfaces/Activity'; // Adjust the import path as necessary

interface ActivityListProps {
  activities: Activity[];
  onToggleComplete: (activityId: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, onToggleComplete }) => {
    const incompleteActivities = activities.filter(activity => !activity.completed);
    const completedActivities = activities.filter(activity => activity.completed);

    // If no activities at all
    if (activities.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No activities yet</h3>
                <p>Add your activity from the form above to get started.</p>
            </div>
        );
    }

    // If both incomplete and completed are empty (shouldn't happen if activities.length > 0, but for safety)
    if (incompleteActivities.length === 0 && completedActivities.length === 0) {
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
                    <h2 className="text-xl font-semibold mb-2">All activities complete</h2>
                    <p>Nice work!</p>
                </div>
            ) : (
                <section>
                    <h2 className="text-xl font-semibold mb-4">
                        Active Activities ({incompleteActivities.length})
                    </h2>
                    <div className="grid gap-4">
                        {incompleteActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ActivityCard
                                    activity={activity}
                                    onToggleComplete={onToggleComplete}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {completedActivities.length > 0 && (
                <section>
                    <h2 className="text-xl font-semibold text-wisely-dark mb-4">
                        Completed Activities ({completedActivities.length})
                    </h2>
                    <div className="grid gap-4">
                        {completedActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ActivityCard
                                    activity={activity}
                                    onToggleComplete={onToggleComplete}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};