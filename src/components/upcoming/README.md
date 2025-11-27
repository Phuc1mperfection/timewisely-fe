# Upcoming Tasks Page - Todoist-Style UI

## Overview
A sophisticated, Todoist-inspired UI for the Upcoming Tasks page with horizontal date scrolling and vertical timeline layout.

## Components Structure

### 📁 `components/upcoming/`

#### 1. **UpcomingHeader.tsx**
- Sticky header at top
- Month selector with dropdown (November 2025 ▼)
- Navigation: `< Today >`
- Props: `selectedMonth`, `onToday`, `onPrevious`, `onNext`

#### 2. **DateStrip.tsx**
- Horizontal scrollable date picker
- Shows 14 days starting from today
- Today highlighted in red
- Auto-scrolls to show today on mount
- Props: `days`, `selectedDate`, `onDateSelect`

#### 3. **DayHeader.tsx**
- Format: "27 Nov · Today · Thursday"
- Bold, large text (text-xl)
- Shows "Today" or "Tomorrow" labels
- Props: `date`

#### 4. **TaskItem.tsx**
- Circular checkbox (unchecked state)
- Task title + optional description
- Category icon on right (Inbox with color)
- Hover shows edit/delete buttons
- Props: `task`, `onToggle`, `onDelete`, `onEdit`

#### 5. **AddTaskButton.tsx**
- Red "+ Add task" button
- Inline input on click
- ESC to cancel, Enter to submit
- Props: `onAdd`

#### 6. **DaySection.tsx**
- Combines DayHeader + TaskItem list + AddTaskButton
- Spaced layout (mt-8)
- ID marker for "today" section (for scroll-to)
- Props: `date`, `tasks`, `onTaskToggle`, `onTaskAdd`, `onTaskDelete`, `onTaskEdit`

## Features

### ✅ Implemented
- [x] Horizontal date strip scrolling
- [x] Today highlight (red badge)
- [x] Vertical timeline with day sections
- [x] Task checkbox toggle
- [x] Inline task add
- [x] Edit/delete on hover
- [x] Smooth scroll to today
- [x] Category color coding
- [x] Responsive layout
- [x] Real data integration with useTasks hook

### 🎨 Design Details
- **Colors**: Red for today/add task (Todoist style)
- **Spacing**: Airy layout with 24px+ gaps
- **Typography**: Bold headers, medium tasks, small descriptions
- **Interactions**: Subtle hover states, no heavy borders

## Data Flow

```
UpcomingTasksPage
  ├─ useTasks() → real API data
  ├─ Filter: upcoming (today+, not completed)
  ├─ Group by day (14 days)
  └─ Pass to components

DaySection
  ├─ DayHeader (date display)
  ├─ TaskItem[] (map over tasks)
  └─ AddTaskButton (create new)
```

## Usage

```tsx
import { UpcomingTasksPage } from "@/pages/tasks/UpcomingTasksPage";

// In router:
<Route path="/dashboard/tasks/upcoming" element={<UpcomingTasksPage />} />
```

## API Integration

- **GET /tasks** → Filter client-side for upcoming
- **POST /tasks** → Create with dueDate
- **PATCH /tasks/:id/toggle-completion** → Toggle complete
- **PUT /tasks/:id** → Update task
- **DELETE /tasks/:id** → Delete task

## Styling

Custom CSS added to `index.css`:
- `.scrollbar-hide` → Hides horizontal scrollbar
- Uses shadcn/ui components: Button, Checkbox, Input
- Tailwind classes for all layout/styling

## Testing Checklist

- [ ] Date strip scrolls horizontally
- [ ] Today is highlighted in red
- [ ] Click "Today" button scrolls to today section
- [ ] Tasks grouped correctly by date
- [ ] Add task opens inline input
- [ ] Toggle checkbox updates backend
- [ ] Edit/delete buttons appear on hover
- [ ] Empty state shows for days with no tasks
- [ ] Loading state while fetching
