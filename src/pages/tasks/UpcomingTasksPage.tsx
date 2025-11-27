import { useState } from "react";
import { format, startOfToday, addDays, isSameDay, startOfDay } from "date-fns";
import { UpcomingHeader } from "@/components/upcoming/UpcomingHeader";
import { DateStrip } from "@/components/upcoming/DateStrip";
import { DaySection } from "@/components/upcoming/DaySection";
import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskFormData } from "@/interfaces/Task";

export function UpcomingTasksPage() {
  const {
    tasks,
    loading,
    createTask: createTaskAPI,
    updateTask: updateTaskAPI,
    toggleComplete,
    deleteTask: deleteTaskAPI,
  } = useTasks();

  const [selectedDate, setSelectedDate] = useState(startOfToday());

  // Generate 14 days starting from today with fixed time (9 AM) to avoid timezone issues
  const days = Array.from({ length: 14 }, (_, i) => {
    const day = addDays(startOfToday(), i);
    day.setHours(9, 0, 0, 0);
    return day;
  });

  // Filter for upcoming tasks (today and future, not completed)
  const upcomingTasks = tasks.filter((task) => {
    const taskDate = startOfDay(new Date(task.dueDate));
    const today = startOfDay(new Date());
    return taskDate >= today && !task.completed;
  });

  // Group tasks by day
  const tasksByDay = days.map((day) => ({
    date: day,
    tasks: upcomingTasks.filter((task) =>
      isSameDay(startOfDay(new Date(task.dueDate)), day)
    ),
  }));

  const handleTaskToggle = async (taskId: string) => {
    await toggleComplete(taskId);
  };

  const handleTaskAdd = async (
    dayDate: Date,
    taskData: Omit<TaskFormData, "order">
  ) => {
    await createTaskAPI({
      ...taskData,
      dueDate: dayDate,
    });
  };

  const handleTaskDelete = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTaskAPI(taskId);
    }
  };

  const handleTaskEdit = async (taskId: string, updates: Partial<Task>) => {
    await updateTaskAPI(taskId, updates);
  };

  const goToToday = () => {
    setSelectedDate(startOfToday());
    document
      .getElementById("today-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const goToPrevious = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const goToNext = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        <UpcomingHeader
          selectedMonth={format(selectedDate, "MMMM yyyy")}
          onToday={goToToday}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />

        <DateStrip
          days={days}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <div className="px-6 pb-12">
          {tasksByDay.map(({ date, tasks: dayTasks }) => (
            <DaySection
              key={date.toISOString()}
              date={date}
              tasks={dayTasks}
              onTaskToggle={handleTaskToggle}
              onTaskAdd={(taskData) => handleTaskAdd(date, taskData)}
              onTaskDelete={handleTaskDelete}
              onTaskEdit={handleTaskEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
