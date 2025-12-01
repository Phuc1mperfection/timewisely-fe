import { useState, useMemo, useCallback, useEffect } from "react";
import {
  format,
  startOfToday,
  addDays,
  isSameDay,
  startOfDay,
  isToday,
  isTomorrow,
  differenceInDays,
} from "date-fns";
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { UpcomingHeader } from "@/components/upcoming/UpcomingHeader";
import { DateStrip } from "@/components/upcoming/DateStrip";
import { DaySection } from "@/components/upcoming/DaySection";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/useToast";
import type { Task, TaskFormData } from "@/interfaces/Task";
import { createCleanDate } from "@/lib/taskUtils";

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
  const [daysToShow, setDaysToShow] = useState(10); // Start with 60 days (2 months)
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { success } = useToast();

  // DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Memoized: Generate days array (only recalculate when daysToShow changes)
  const days = useMemo(() => {
    return Array.from({ length: daysToShow }, (_, i) => {
      const day = addDays(startOfToday(), i);
      return createCleanDate(day);
    });
  }, [daysToShow]);

  // Memoized: Filter upcoming tasks (only recalculate when tasks change)
  const { upcomingTasks, overdueTasks } = useMemo(() => {
    const today = startOfDay(new Date());
    const upcoming = tasks.filter((task) => {
      const taskDate = startOfDay(new Date(task.dueDate));
      return taskDate >= today && !task.completed;
    });
    const overdue = tasks.filter((task) => {
      const taskDate = startOfDay(new Date(task.dueDate));
      return taskDate < today && !task.completed;
    });
    return { upcomingTasks: upcoming, overdueTasks: overdue };
  }, [tasks]);

  // Memoized: Group tasks by day (expensive operation)
  const tasksByDay = useMemo(() => {
    return days.map((day) => ({
      date: day,
      tasks: upcomingTasks.filter((task) =>
        isSameDay(startOfDay(new Date(task.dueDate)), day)
      ),
    }));
  }, [days, upcomingTasks]);

  // Infinite scroll: Load more days when near bottom & detect sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Load more when 80% scrolled
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setDaysToShow((prev) => prev + 30); // Add 1 more month
      }

      // Compact header when scrolled past 40px
      setIsHeaderCompact(scrollTop > 40);

      // Detect visible section and update selectedDate
      const headerOffset = 180; // Header + DateStrip height
      const scrollPosition = scrollTop + headerOffset + 50; // 50px buffer

      // Find the first visible section
      for (const { date } of tasksByDay) {
        const sectionId = isSameDay(date, startOfToday())
          ? "today-section"
          : `day-section-${format(date, "yyyy-MM-dd")}`;
        const element = document.getElementById(sectionId);

        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setSelectedDate(date);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tasksByDay]);

  // Callbacks: Prevent re-creating functions on every render
  const handleTaskToggle = useCallback(
    async (taskId: string) => {
      await toggleComplete(taskId);
    },
    [toggleComplete]
  );

  const handleTaskAdd = useCallback(
    async (dayDate: Date, taskData: Omit<TaskFormData, "order">) => {
      await createTaskAPI({
        ...taskData,
        dueDate: createCleanDate(dayDate),
      });
    },
    [createTaskAPI]
  );

  const handleTaskDelete = useCallback(
    async (taskId: string) => {
      if (confirm("Are you sure you want to delete this task?")) {
        await deleteTaskAPI(taskId);
      }
    },
    [deleteTaskAPI]
  );

  const handleTaskEdit = useCallback(
    async (taskId: string, updates: Partial<Task>) => {
      await updateTaskAPI(taskId, updates);
    },
    [updateTaskAPI]
  );

  // Format date for toast message
  const formatDateForToast = useCallback((date: Date) => {
    if (isToday(date)) {
      return "today";
    } else if (isTomorrow(date)) {
      return "tomorrow";
    }

    const daysAway = differenceInDays(date, startOfToday());
    if (daysAway <= 7) {
      // Within a week - show day name (e.g., "Monday")
      return format(date, "EEEE");
    } else {
      // Further away - show date and month (e.g., "12 Dec")
      return format(date, "d MMM");
    }
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  }, []);

  // Handle drag end - move task to new date
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTaskId(null);

      if (!over) {
        return;
      }

      const taskId = active.id as string;
      const overId = over.id as string;

      // ...

      // Parse target date from section ID
      let newDate: Date | null = null;

      if (overId === "today-section") {
        newDate = createCleanDate(startOfToday());
      } else if (overId.startsWith("day-section-")) {
        const dateString = overId.replace("day-section-", "");
        newDate = createCleanDate(new Date(dateString));
      } else if (overId === "overdue-section") {
        return;
      }

      if (!newDate) {
        return;
      }

      // Find the task
      const task = tasks.find((t) => t.id === taskId);
      if (!task) {
        return;
      }

      // Check if date actually changed
      const currentDate = createCleanDate(new Date(task.dueDate));
      const targetDate = createCleanDate(newDate);

      // ...

      if (currentDate.getTime() === targetDate.getTime()) {
        return;
      }

      try {
        // Update task with new date
        await handleTaskEdit(taskId, { dueDate: newDate });

        // Show success toast with smart date formatting
        const formattedDate = formatDateForToast(newDate);
        success(`Date updated to ${formattedDate}`);
      } catch {
        // Optionally handle error silently
      }
    },
    [tasks, handleTaskEdit, formatDateForToast, success]
  );

  // Get active task for drag overlay (memoized for performance)
  const activeTask = useMemo(
    () => (activeTaskId ? tasks.find((t) => t.id === activeTaskId) : null),
    [activeTaskId, tasks]
  );

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    const sectionId = isSameDay(date, startOfToday())
      ? "today-section"
      : `day-section-${format(date, "yyyy-MM-dd")}`;
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 180; // Offset for header + date strip
      // Use instant scroll for far distances (better performance)
      const distance = Math.abs(window.scrollY - offsetTop);
      const behavior = distance > 2000 ? "instant" : "smooth";
      window.scrollTo({ top: offsetTop, behavior });
    }
  }, []);

  const goToToday = useCallback(() => {
    handleDateSelect(startOfToday());
  }, [handleDateSelect]);

  const goToPrevious = useCallback(() => {
    const prevDate = addDays(selectedDate, -1);
    handleDateSelect(prevDate);
  }, [selectedDate, handleDateSelect]);

  const goToNext = useCallback(() => {
    const nextDate = addDays(selectedDate, 1);
    handleDateSelect(nextDate);
  }, [selectedDate, handleDateSelect]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
          <UpcomingHeader
            selectedMonth={format(selectedDate, "MMMM yyyy")}
            selectedDate={selectedDate}
            onToday={goToToday}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onDateSelect={handleDateSelect}
            compact={isHeaderCompact}
          />

          <DateStrip
            days={days}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            compact={isHeaderCompact}
          />

          <div className="px-6 pb-12">
            {overdueTasks.length > 0 && (
              <DaySection
                key="overdue-section"
                date={null}
                tasks={overdueTasks}
                onTaskToggle={handleTaskToggle}
                onTaskAdd={() => {}} // Overdue section doesn't allow adding tasks
                onTaskDelete={handleTaskDelete}
                onTaskEdit={handleTaskEdit}
                isOverdueSection={true}
              />
            )}
            {tasksByDay.map(({ date, tasks: dayTasks }) => {
              const dateKey = format(date, "yyyy-MM-dd");
              return (
                <DaySection
                  key={dateKey}
                  date={date}
                  tasks={dayTasks}
                  onTaskToggle={handleTaskToggle}
                  onTaskAdd={(taskData) => handleTaskAdd(date, taskData)}
                  onTaskDelete={handleTaskDelete}
                  onTaskEdit={handleTaskEdit}
                />
              );
            })}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-card p-4 rounded-lg shadow-lg border border-border opacity-90">
            <p className="font-medium">{activeTask.name}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
