import { useState, useMemo, useCallback, useEffect } from "react";
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
  const [daysToShow, setDaysToShow] = useState(60); // Start with 60 days (2 months)
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  // Memoized: Generate days array (only recalculate when daysToShow changes)
  const days = useMemo(() => {
    return Array.from({ length: daysToShow }, (_, i) => {
      const day = addDays(startOfToday(), i);
      day.setHours(9, 0, 0, 0);
      return day;
    });
  }, [daysToShow]);

  // Memoized: Filter upcoming tasks (only recalculate when tasks change)
  const upcomingTasks = useMemo(() => {
    const today = startOfDay(new Date());
    return tasks.filter((task) => {
      const taskDate = startOfDay(new Date(task.dueDate));
      return taskDate >= today && !task.completed;
    });
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
        dueDate: dayDate,
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
