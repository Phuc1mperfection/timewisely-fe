import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Task } from "@/interfaces";
import { updateTaskOrder } from "@/services/taskServices";

// Custom hook for drag and drop functionality
export function useTaskDragAndDrop(
  tasks: Task[],
  onReorder?: (reorderedTasks: Task[]) => void
) {
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

      // Update order values for reordered tasks
      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
      }));

      // Update local state immediately for smooth UX
      onReorder?.(updatedTasks);

      // Batch update backend with new order using dedicated endpoint
      try {
        const taskOrders = updatedTasks.map((task) => ({
          taskId: task.id,
          order: task.order,
        }));
        await updateTaskOrder(taskOrders);
        console.log("Successfully updated task orders on backend");
      } catch (error) {
        console.error("Failed to update task orders on backend:", error);
        // Note: Local state is already updated, but backend sync failed
      }
    }
  };

  return {
    sensors,
    handleDragEnd,
  };
}
