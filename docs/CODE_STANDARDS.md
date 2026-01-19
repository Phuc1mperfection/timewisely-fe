# Frontend Code Standards

## 📁 File & Folder Naming Conventions

### Components
- **Format:** `PascalCase.tsx`
- **Examples:** `TaskList.tsx`, `PomodoroTimer.tsx`, `ActivityCard.tsx`
- **Location:** `src/components/`

### Hooks
- **Format:** `use*.ts` (camelCase with "use" prefix)
- **Examples:** `useTasks.ts`, `usePomodoroSession.ts`, `useAuth.ts`
- **Location:** `src/hooks/`

### Services
- **Format:** `*Services.ts` (camelCase with "Services" suffix)
- **Examples:** `taskServices.ts`, `authServices.ts`, `noteServices.ts`
- **Location:** `src/services/`

### Utils
- **Format:** `camelCase.ts`
- **Examples:** `taskUtils.ts`, `dateUtils.ts`
- **Location:** `src/lib/` or `src/utils/`

### Interfaces/Types
- **Format:** `PascalCase.ts`
- **Examples:** `User.ts`, `Task.ts`, `Activity.ts`
- **Location:** `src/interfaces/`

---

## 🗂️ Folder Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui, ModeToggle, ThemeProvider)
│   └── <feature>/       # Feature-specific components (tasks/, pomodoro/, auth/, etc.)
├── contexts/            # React Contexts (with types included, NOT separate type files)
├── hooks/               # Custom React hooks
├── interfaces/          # TypeScript type definitions
├── lib/                 # Utility functions
├── pages/               # Page components (routed views)
├── router/              # Routing configuration
├── services/            # API service layer (all backend communication)
└── utils/               # Additional utilities
```

---

## 📦 Import Conventions

### Import Order
All imports should follow this order:

```typescript
// 1. External libraries (React, React Router, etc.)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Internal imports with @/ alias
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { taskServices } from "@/services/taskServices";
import type { Task } from "@/interfaces/Task";

// 3. Relative imports (only for co-located files)
import { cn } from "./utils";
```

### Alias Paths
**ALWAYS use `@/` alias** for internal imports:

```typescript
// ✅ CORRECT
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/services/apiClient";
import type { User } from "@/interfaces/User";

// ❌ WRONG - Don't use relative paths for cross-folder imports
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../services/apiClient";
```

---

## 🏗️ Code Structure Standards

### Context Files
**DO:** Include types in the same file as Context
**DON'T:** Create separate `*Types.ts` files

```typescript
// ✅ CORRECT: AuthContext.tsx
import { createContext } from "react";

// Types in same file
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Context definition
export const AuthContext = createContext<AuthContextType>({...});

// Provider component
export function AuthProvider({ children }) {
  // ...
}
```

### Custom Hooks
**DO:** Place all hooks in `src/hooks/`
**DON'T:** Mix hooks in `contexts/` or other folders

```typescript
// ✅ CORRECT: src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

### Service Functions
**DO:** Use `apiClient` for all backend calls
**DON'T:** Create new axios instances or use fetch directly

```typescript
// ✅ CORRECT: taskServices.ts
import apiClient from "./apiClient";
import type { Task } from "@/interfaces/Task";

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get("/tasks");
  return response.data;
}

// ❌ WRONG - Don't create new axios instances
import axios from "axios";
export async function getTasks() {
  return axios.get("http://localhost:8080/api/tasks"); // ❌
}
```

---

## 🎨 Component Standards

### Export Pattern
**DO:** Use named exports
**DON'T:** Use default exports

```typescript
// ✅ CORRECT
export function TaskList() {
  return <div>...</div>;
}

// ❌ WRONG
export default function TaskList() {
  return <div>...</div>;
}
```

### Props Interface
**DO:** Define props interface above component

```typescript
// ✅ CORRECT
interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
  className?: string;
}

export function TaskCard({ task, onComplete, className }: TaskCardProps) {
  return <div className={cn("task-card", className)}>...</div>;
}
```

### Shadcn/ui Components
**DO:** Use `cn()` utility for className merging
**DON'T:** Modify files in `components/ui/` directly (they are generated)

```typescript
// ✅ CORRECT
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MyButton({ className, ...props }) {
  return (
    <Button className={cn("custom-class", className)} {...props}>
      Click me
    </Button>
  );
}
```

---

## 🧪 TypeScript Standards

### Type Imports
**DO:** Use `type` keyword for type-only imports

```typescript
// ✅ CORRECT
import type { User } from "@/interfaces/User";
import type { Task, TaskStatus } from "@/interfaces/Task";

// Also correct for mixed imports
import { useState } from "react";
import type { FC } from "react";
```

### Interface vs Type
**DO:** Prefer `interface` for object shapes
**DO:** Use `type` for unions, primitives, and complex types

```typescript
// ✅ Use interface for objects
export interface User {
  id: number;
  email: string;
  fullName: string;
}

// ✅ Use type for unions
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ✅ Use type for complex types
export type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

---

## 🔒 Best Practices

### Error Handling
```typescript
// ✅ CORRECT - Specific error types
try {
  const user = await getCurrentUser();
  setUser(user);
} catch (error) {
  if (error instanceof AxiosError && error.response?.status === 401) {
    // Handle unauthorized
    logout();
  } else {
    console.error("Failed to fetch user:", error);
  }
}
```

### State Management
- **Global state:** Context API (`AuthContext`, `NotificationContext`)
- **Server state:** TanStack Query (for caching and background updates)
- **Local state:** React hooks (`useState`, `useReducer`)

### Code Comments
**DO:** Write comments for complex logic
**DON'T:** Write obvious comments

```typescript
// ✅ CORRECT - Explains WHY
// Wait 100ms for NotificationProvider to connect WebSocket
await new Promise((resolve) => setTimeout(resolve, 100));

// ❌ WRONG - States the obvious
// Set user to the user data
setUser(userData);
```

---

## 🚀 Performance Guidelines

### Import Optimization
```typescript
// ✅ CORRECT - Import specific components
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

// ❌ WRONG - Barrel imports can hurt bundle size
import { Button, Dialog } from "@/components/ui";
```

### Lazy Loading
```typescript
// ✅ CORRECT - Lazy load heavy components
import { lazy, Suspense } from "react";

const CalendarPage = lazy(() => import("@/pages/CalendarPage"));

function App() {
  return (
    <Suspense fallback={<Preloader />}>
      <CalendarPage />
    </Suspense>
  );
}
```

---

## 🛠️ Tooling

### ESLint
Run before committing:
```bash
npm run lint
```

### Prettier
Format code:
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

---

## 📚 Examples

### Complete Component Example
```typescript
// src/components/tasks/TaskCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { taskServices } from "@/services/taskServices";
import { cn } from "@/lib/utils";
import type { Task } from "@/interfaces/Task";

interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  className?: string;
}

export function TaskCard({ task, onUpdate, className }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleComplete() {
    setIsLoading(true);
    try {
      const updatedTask = await taskServices.completeTask(task.id);
      onUpdate(updatedTask);
    } catch (error) {
      console.error("Failed to complete task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className={cn("p-4", className)}>
      <h3>{task.title}</h3>
      <Button onClick={handleComplete} disabled={isLoading}>
        {isLoading ? "Completing..." : "Complete"}
      </Button>
    </Card>
  );
}
```

### Complete Service Example
```typescript
// src/services/taskServices.ts
import apiClient from "./apiClient";
import type { Task, CreateTaskRequest } from "@/interfaces/Task";

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get("/tasks");
  return response.data;
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await apiClient.post("/tasks", data);
  return response.data;
}

export async function completeTask(taskId: number): Promise<Task> {
  const response = await apiClient.patch(`/tasks/${taskId}/complete`);
  return response.data;
}
```

---

## ✅ Checklist Before PR

- [ ] All files follow naming conventions
- [ ] Imports use `@/` alias (no relative paths for cross-folder imports)
- [ ] No separate `*Types.ts` files for contexts
- [ ] All hooks are in `src/hooks/`
- [ ] All API calls use `apiClient`
- [ ] Components use named exports (not default)
- [ ] TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint warnings fixed (`npm run lint`)
- [ ] Code formatted (`npm run format`)

---

**Last Updated:** January 19, 2026  
**Version:** 1.0.0
