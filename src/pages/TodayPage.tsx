import { AddTaskButton } from "@/components/tasks/AddTaskButton";

// ...existing imports...

export function TodayPage() {
  // ...existing state and functions...

  return (
    <div>
      {/* ...existing components... */}

      {/* Add Task Section */}
      <AddTaskButton
        defaultDate={new Date()}
        onCreateTask={(taskData) => handleCreateTask({ ...taskData, order: 0 })}
      />

      {/* ...existing components... */}
    </div>
  );
}
