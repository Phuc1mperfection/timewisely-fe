# React Implementation Guide - Notification System
## Học React từ A đến Z qua dự án thực tế

---

## 📚 Mục Lục
1. [React Cơ Bản](#1-react-cơ-bản)
2. [TypeScript với React](#2-typescript-với-react)
3. [React Hooks](#3-react-hooks)
4. [Context API - State Management](#4-context-api---state-management)
5. [Custom Hooks](#5-custom-hooks)
6. [Component Architecture](#6-component-architecture)
7. [WebSocket Integration](#7-websocket-integration)
8. [Best Practices](#8-best-practices)

---

## 1. React Cơ Bản

### 1.1. Component là gì?

Component là **building block** của React app. Giống như các mảnh ghép LEGO, bạn lắp ghép các components nhỏ thành app lớn.

**Ví dụ từ dự án:**

```tsx
// Component đơn giản nhất - Functional Component
export const NotificationBell: React.FC = () => {
  return (
    <Button>
      <Bell className="size-5" />
    </Button>
  );
};
```

**Giải thích:**
- `React.FC` = React Functional Component (kiểu TypeScript)
- `export` = Cho phép file khác import component này
- `return` = Trả về JSX (HTML-like syntax trong JavaScript)

### 1.2. JSX - JavaScript XML

JSX cho phép viết HTML trong JavaScript:

```tsx
// JSX
<div className="flex gap-2">
  <span>Hello</span>
  <button>Click me</button>
</div>

// Tương đương với:
React.createElement('div', { className: 'flex gap-2' },
  React.createElement('span', null, 'Hello'),
  React.createElement('button', null, 'Click me')
);
```

**Lưu ý:**
- Dùng `className` thay vì `class` (vì `class` là keyword trong JavaScript)
- Phải đóng tất cả tags: `<img />`, `<input />`
- Chỉ được return 1 parent element

### 1.3. Props - Truyền dữ liệu giữa Components

Props giống như **parameters** của function:

```tsx
// Component nhận props
interface NotificationItemProps {
  notification: NotificationResponse;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification 
}) => {
  return (
    <div>
      <h4>{notification.title}</h4>
      <p>{notification.message}</p>
    </div>
  );
};

// Component cha truyền props
<NotificationItem notification={notificationData} />
```

**Giải thích:**
- `NotificationItemProps` = Interface định nghĩa kiểu dữ liệu của props
- `{ notification }` = Destructuring - lấy trực tiếp property từ props object
- `{notification.title}` = Curly braces để nhúng JavaScript vào JSX

---

## 2. TypeScript với React

### 2.1. Tại sao dùng TypeScript?

TypeScript = JavaScript + Type Safety (kiểm tra kiểu dữ liệu)

**Ví dụ lỗi TypeScript bắt được:**

```tsx
// ❌ Lỗi: property 'tittle' không tồn tại (typo)
<p>{notification.tittle}</p>

// ✅ Đúng: TypeScript suggest 'title'
<p>{notification.title}</p>
```

### 2.2. Định nghĩa Types/Interfaces

**Interface cho Notification:**

```tsx
// interfaces/Notification.ts
export interface NotificationResponse {
  id: string;                    // UUID
  userId: string;                // UUID
  type: NotificationType;        // Enum
  title: string;
  message: string;
  targetType?: TargetType;       // Optional (có thể null)
  targetId?: string;             // Optional
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt: string;                // ISO datetime string
  readAt?: string;               // Optional
}
```

**Enum types (const objects):**

```tsx
// Dùng const object thay vì enum để tránh lỗi compile
export const NotificationType = {
  TASK_REMINDER: "TASK_REMINDER",
  ACTIVITY_REMINDER: "ACTIVITY_REMINDER",
  OVERDUE_ALERT: "OVERDUE_ALERT",
  MORNING_DIGEST: "MORNING_DIGEST",
} as const;

// Tạo type từ const object
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
```

**Tại sao dùng `as const`?**
- Biến các value thành **literal types** (không thể thay đổi)
- Tránh lỗi `erasableSyntaxOnly` trong TypeScript config strict

---

## 3. React Hooks

Hooks cho phép sử dụng **state** và **lifecycle** trong functional components.

### 3.1. useState - Quản lý State

State = Dữ liệu động trong component (thay đổi theo thời gian)

```tsx
import { useState } from "react";

const [count, setCount] = useState(0);
//     ↑        ↑            ↑
//   biến   hàm set     giá trị ban đầu

// Sử dụng
<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>
```

**Ví dụ từ dự án:**

```tsx
const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
const [unreadCount, setUnreadCount] = useState<number>(0);
const [isConnected, setIsConnected] = useState<boolean>(false);
```

**Quy tắc quan trọng:**
- ❌ KHÔNG được mutate state trực tiếp: `notifications.push(newItem)`
- ✅ Phải dùng setState với giá trị mới: `setNotifications([...notifications, newItem])`

### 3.2. useEffect - Side Effects

useEffect chạy code khi component mount/update/unmount.

**Syntax:**

```tsx
useEffect(() => {
  // Code chạy sau khi render
  
  return () => {
    // Cleanup function (chạy khi unmount)
  };
}, [dependencies]); // Dependency array
```

**Các trường hợp:**

```tsx
// 1. Chạy MỘT LẦN khi mount (dependencies = [])
useEffect(() => {
  console.log("Component mounted");
}, []);

// 2. Chạy mỗi khi user.id thay đổi
useEffect(() => {
  fetchNotifications();
}, [user?.id]);

// 3. Chạy mỗi lần render (KHÔNG nên dùng!)
useEffect(() => {
  console.log("Every render");
}); // Không có dependency array
```

**Ví dụ từ dự án - Kết nối WebSocket:**

```tsx
useEffect(() => {
  if (!user?.id) {
    // Nếu không có user, disconnect
    webSocketService.disconnect();
    setIsConnected(false);
    return;
  }

  // Kết nối WebSocket
  webSocketService.connect(
    user.id,
    handleNewNotification,
    (connected) => setIsConnected(connected)
  );

  // Cleanup: Disconnect khi component unmount
  return () => {
    webSocketService.disconnect();
  };
}, [user?.id, handleNewNotification, fetchNotifications]);
//   ↑ Dependencies: Chỉ chạy lại khi 1 trong 3 này thay đổi
```

### 3.3. useCallback - Memoize Functions

useCallback giữ **reference** của function không đổi giữa các renders.

**Tại sao cần?**

```tsx
// ❌ Function này được tạo LẠI mỗi lần component render
const handleClick = () => {
  console.log("Clicked");
};

// ✅ Function này GIỮ NGUYÊN reference (chỉ tạo lại khi dependencies thay đổi)
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []); // Dependencies
```

**Ví dụ từ dự án:**

```tsx
const markAsRead = useCallback(async (notificationId: string) => {
  try {
    await NotificationApiService.markAsRead(notificationId);
    
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId
          ? { ...notif, status: NotificationStatus.READ, readAt: new Date().toISOString() }
          : notif
      )
    );
    
    setUnreadCount((prev) => Math.max(0, prev - 1));
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}, []); // Không có dependencies = function này stable (không đổi)
```

**Pattern quan trọng - Functional Update:**

```tsx
// ❌ KHÔNG NÊN: Dựa vào state hiện tại từ closure
setNotifications(notifications.filter(n => n.id !== id));

// ✅ NÊN: Dùng functional update
setNotifications((prev) => prev.filter(n => n.id !== id));
//                  ↑
//         Nhận state hiện tại từ React
```

### 3.4. useMemo - Memoize Values

useMemo cache **giá trị** để tránh tính toán lại không cần thiết.

```tsx
const contextValue = useMemo<NotificationContextType>(
  () => ({
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    fetchNotifications,
    markAsRead,
    // ... các functions khác
  }),
  [
    notifications,
    unreadCount,
    isConnected,
    // ... dependencies
  ]
);
```

**Khi nào dùng useMemo?**
- Tính toán phức tạp, tốn performance
- Tạo object/array để truyền vào Context (tránh re-render không cần thiết)

---

## 4. Context API - State Management

Context cho phép **chia sẻ state** giữa nhiều components mà không cần truyền props qua từng level.

### 4.1. Tại sao cần Context?

**Vấn đề: Prop Drilling**

```tsx
// ❌ Phải truyền props qua 5 levels!
<App>
  <Dashboard user={user}>
    <Sidebar user={user}>
      <Menu user={user}>
        <Profile user={user} />
      </Menu>
    </Sidebar>
  </Dashboard>
</App>
```

**Giải pháp: Context API**

```tsx
// ✅ Chỉ cần wrap 1 lần, mọi component con đều truy cập được
<AuthProvider>
  <App>
    <Dashboard>
      <Sidebar>
        <Menu>
          <Profile /> {/* Dùng useAuth() để lấy user */}
        </Menu>
      </Sidebar>
    </Dashboard>
  </App>
</AuthProvider>
```

### 4.2. Tạo Context - 3 bước

**Bước 1: Định nghĩa Context Type**

```tsx
// NotificationContextTypes.ts
export interface NotificationContextType {
  // State
  notifications: NotificationResponse[];
  unreadCount: number;
  isConnected: boolean;
  
  // Actions (functions)
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
```

**Bước 2: Tạo Provider Component**

```tsx
// NotificationProvider.tsx
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  // State
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Functions
  const markAsRead = useCallback(async (id: string) => {
    // Logic...
  }, []);
  
  // Context value
  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAsRead,
      // ...
    }),
    [notifications, unreadCount, markAsRead]
  );
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
```

**Bước 3: Tạo Custom Hook để sử dụng Context**

```tsx
// useNotifications.ts
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  
  return context;
};
```

### 4.3. Sử dụng Context

**Wrap App với Provider:**

```tsx
// App.tsx
<NotificationProvider>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</NotificationProvider>
```

**Dùng hook trong component:**

```tsx
// NotificationBell.tsx
const { unreadCount, isConnected } = useNotifications();

return (
  <Button>
    <Bell />
    {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
  </Button>
);
```

---

## 5. Custom Hooks

Custom hooks = Functions bắt đầu bằng `use` + Sử dụng React hooks bên trong.

### 5.1. Tại sao tạo Custom Hooks?

**Mục đích:**
- ♻️ **Reuse logic** giữa nhiều components
- 🧹 **Clean code** - Tách logic phức tạp ra khỏi component
- 🧪 **Dễ test** - Test logic riêng biệt

### 5.2. Ví dụ từ dự án

**Custom Hook: useNotifications**

```tsx
// hooks/useNotifications.ts
import { useContext } from "react";
import { NotificationContext } from "@/contexts/NotificationContextTypes";

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  
  return context;
};
```

**Sử dụng:**

```tsx
// Component bất kỳ
function MyComponent() {
  const { notifications, markAsRead } = useNotifications();
  
  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>
          {notif.title}
          <button onClick={() => markAsRead(notif.id)}>
            Mark as Read
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. Component Architecture

### 6.1. Component Structure trong Dự án

```
components/
├── notifications/
│   ├── NotificationBell.tsx       (Container - Kết nối logic)
│   ├── NotificationDropdown.tsx   (Container)
│   ├── NotificationItem.tsx       (Presentational)
│   └── index.ts                   (Barrel export)
```

**2 loại components:**

1. **Presentational Components** (UI only)
   - Chỉ nhận props, hiển thị UI
   - Không có state phức tạp
   - Ví dụ: `NotificationItem`

2. **Container Components** (Logic + UI)
   - Kết nối với Context/Hooks
   - Xử lý business logic
   - Ví dụ: `NotificationBell`, `NotificationDropdown`

### 6.2. NotificationBell - Container Component

```tsx
export const NotificationBell: React.FC = () => {
  // ✅ Kết nối với Context
  const { unreadCount, isConnected } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          
          {/* Conditional rendering */}
          {unreadCount > 0 && (
            <span className="badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          
          {/* Dynamic className với cn() helper */}
          <span
            className={cn(
              "status-dot",
              isConnected ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

**Patterns quan trọng:**

**1. Conditional Rendering:**

```tsx
// && operator
{unreadCount > 0 && <Badge>{unreadCount}</Badge>}

// Ternary operator
{isConnected ? "Connected" : "Disconnected"}

// Early return
if (!user) return null;
```

**2. Dynamic ClassName với cn():**

```tsx
import { cn } from "@/lib/utils";

className={cn(
  "base-class",                           // Luôn có
  isActive && "active-class",             // Conditional
  isDisabled ? "disabled" : "enabled",    // Ternary
  className                               // Props override
)}
```

**3. List Rendering:**

```tsx
{notifications.map((notification) => (
  <NotificationItem
    key={notification.id}  // ⚠️ Key bắt buộc cho list!
    notification={notification}
  />
))}
```

**Tại sao cần key?**
- React dùng key để track element nào thay đổi
- Key phải **unique** và **stable** (không đổi giữa renders)
- ❌ KHÔNG dùng index: `key={index}` (trừ khi list không bao giờ thay đổi)

### 6.3. NotificationItem - Presentational Component

```tsx
interface NotificationItemProps {
  notification: NotificationResponse;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();

  // Derived state (tính toán từ props)
  const isUnread = notification.status === NotificationStatus.SENT;
  const icon = getNotificationIcon(notification.type);

  // Event handlers
  const handleClick = async () => {
    if (isUnread) {
      await markAsRead(notification.id);
    }
    navigate(getNavigationPath(notification));
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // ⚠️ Ngăn event bubble lên parent
    await deleteNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "notification-item",
        isUnread && "unread"
      )}
      onClick={handleClick}
    >
      <div className="icon">{icon}</div>
      <div className="content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
      </div>
      <Button onClick={handleDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};
```

**Event Handling Best Practices:**

```tsx
// ✅ Arrow function trong onClick
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Reference function (nếu không cần parameters)
<button onClick={handleClick}>Click</button>

// ❌ KHÔNG gọi function trực tiếp!
<button onClick={handleClick()}>Click</button>
//                           ↑
//               Gọi ngay lập tức khi render!
```

**Stop Propagation:**

```tsx
const handleDelete = (e: React.MouseEvent) => {
  e.stopPropagation(); // Ngăn onClick của parent div
  deleteNotification(id);
};

// Parent div có onClick
<div onClick={handleParentClick}>
  <button onClick={handleDelete}>Delete</button>
</div>
```

---

## 7. WebSocket Integration

### 7.1. WebSocket Service Class

```tsx
// services/webSocketService.ts
export class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private messageCallback: ((message: NotificationMessage) => void) | null = null;
  private connectionStatusCallback: ((isConnected: boolean) => void) | null = null;

  /**
   * Kết nối WebSocket
   */
  connect(
    userId: string,
    onMessage: (message: NotificationMessage) => void,
    onConnectionChange?: (isConnected: boolean) => void
  ): void {
    this.messageCallback = onMessage;
    this.connectionStatusCallback = onConnectionChange || null;

    const token = localStorage.getItem("token");
    const wsUrl = `${import.meta.env.VITE_API_URL.replace("/api", "")}/ws`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as WebSocket,
      
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        this.isConnected = true;
        this.connectionStatusCallback?.(true); // Optional chaining
        
        this.client?.subscribe(
          "/user/queue/notifications",
          (message: IMessage) => {
            this.handleMessage(message);
          }
        );
      },

      onWebSocketClose: () => {
        this.isConnected = false;
        this.connectionStatusCallback?.(false);
      },
    });

    this.client.activate();
  }

  private handleMessage(message: IMessage): void {
    const notification: NotificationMessage = JSON.parse(message.body);
    this.messageCallback?.(notification);
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.isConnected = false;
  }
}

// Singleton pattern
export const webSocketService = new WebSocketService();
```

**Key Concepts:**

**1. Singleton Pattern:**
- Chỉ có 1 instance duy nhất của WebSocketService
- Chia sẻ connection giữa toàn bộ app

**2. Callback Pattern:**
- `onMessage`: Gọi khi nhận notification
- `onConnectionChange`: Gọi khi connection status thay đổi

**3. Optional Chaining (`?.`):**

```tsx
// Thay vì:
if (this.connectionStatusCallback) {
  this.connectionStatusCallback(true);
}

// Dùng:
this.connectionStatusCallback?.(true);
```

### 7.2. Tích hợp WebSocket vào Context

```tsx
// NotificationProvider.tsx
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Callback xử lý message từ WebSocket
  const handleNewNotification = useCallback(
    (message: NotificationMessage) => {
      // Convert message format
      const newNotification: NotificationResponse = {
        id: message.notificationId,
        type: message.type,
        title: message.title,
        message: message.message,
        channel: NotificationChannel.WEBSOCKET,
        status: NotificationStatus.SENT,
        sentAt: new Date(message.timestamp).toISOString(),
        // ...
      };

      // Update state (prepend = thêm vào đầu)
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Browser notification
      if (Notification.permission === "granted") {
        new Notification(message.title, {
          body: message.message,
          icon: "/favicon.ico",
        });
      }
    },
    [user]
  );

  // Kết nối WebSocket khi user login
  useEffect(() => {
    if (!user?.id) {
      webSocketService.disconnect();
      return;
    }

    // Request browser notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Connect với 2 callbacks
    webSocketService.connect(
      user.id,
      handleNewNotification,          // Message callback
      (connected) => {                // Connection callback
        setIsConnected(connected);
      }
    );

    // Cleanup
    return () => {
      webSocketService.disconnect();
    };
  }, [user?.id, handleNewNotification]);

  // ...
};
```

---

## 8. Best Practices

### 8.1. Code Organization

**File Structure:**

```
src/
├── components/           # UI components
│   ├── ui/              # Reusable UI (shadcn/ui)
│   └── notifications/   # Feature-specific
├── contexts/            # Context providers
├── hooks/               # Custom hooks
├── interfaces/          # TypeScript types
├── services/            # API & external services
├── utils/               # Helper functions
└── pages/               # Route components
```

**Naming Conventions:**

```tsx
// Components: PascalCase
NotificationBell.tsx

// Hooks: camelCase with 'use' prefix
useNotifications.ts

// Services: camelCase with 'Service' suffix
notificationServices.ts

// Types/Interfaces: PascalCase
NotificationResponse

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 5;
```

### 8.2. Performance Optimization

**1. Memoization:**

```tsx
// useMemo cho expensive calculations
const sortedNotifications = useMemo(
  () => notifications.sort((a, b) => b.sentAt - a.sentAt),
  [notifications]
);

// useCallback cho functions được pass vào dependencies
const handleClick = useCallback(() => {
  // ...
}, [dependency]);

// React.memo cho components re-render nhiều
export const NotificationItem = React.memo<NotificationItemProps>(({ notification }) => {
  // ...
});
```

**2. Lazy Loading:**

```tsx
// Code splitting
const NotificationTestPage = React.lazy(() => import("./pages/NotificationTestPage"));

// Sử dụng với Suspense
<Suspense fallback={<Loading />}>
  <NotificationTestPage />
</Suspense>
```

**3. Debounce/Throttle:**

```tsx
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((value: string) => {
    fetchNotifications(value);
  }, 300),
  []
);

<input onChange={(e) => debouncedSearch(e.target.value)} />
```

### 8.3. Error Handling

**Try-Catch Pattern:**

```tsx
const markAsRead = useCallback(async (id: string) => {
  try {
    await NotificationApiService.markAsRead(id);
    
    // Update local state
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, status: "READ" } : n)
    );
  } catch (error) {
    console.error("Failed to mark as read:", error);
    
    // Show toast notification
    toast.error("Failed to mark notification as read");
  }
}, []);
```

**Error Boundary (Class Component):**

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Wrap app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 8.4. Testing Tips

**Unit Test với Jest:**

```tsx
// useNotifications.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useNotifications } from "./useNotifications";

test("should mark notification as read", async () => {
  const { result } = renderHook(() => useNotifications());
  
  await act(async () => {
    await result.current.markAsRead("notification-id");
  });
  
  expect(result.current.unreadCount).toBe(0);
});
```

### 8.5. Common Pitfalls (Lỗi thường gặp)

**1. Infinite Loop trong useEffect:**

```tsx
// ❌ Infinite loop
useEffect(() => {
  setCount(count + 1);
}, [count]); // count thay đổi → useEffect chạy → count thay đổi → ...

// ✅ Đúng
useEffect(() => {
  // Chỉ chạy 1 lần khi mount
  fetchData();
}, []);
```

**2. Mutating State:**

```tsx
// ❌ Mutate trực tiếp
notifications.push(newNotification);
setNotifications(notifications);

// ✅ Tạo array mới
setNotifications([...notifications, newNotification]);
```

**3. Closure Stale State:**

```tsx
// ❌ Sẽ lấy stale state
useEffect(() => {
  setTimeout(() => {
    console.log(count); // Luôn là 0!
  }, 1000);
}, []);

// ✅ Dùng functional update
setCount((prevCount) => prevCount + 1);
```

---

## 9. WebSocket Status: ✅ Connected - Ý nghĩa

### 9.1. Connection Status trong UI

```tsx
<span
  className={cn(
    "size-2 rounded-full",
    isConnected ? "bg-green-500" : "bg-gray-400"
  )}
  title={isConnected ? "Connected" : "Disconnected"}
/>
```

**✅ Connected (màu xanh) có nghĩa:**

1. **WebSocket đã kết nối thành công** với backend server
2. **Đã subscribe** đến `/user/queue/notifications`
3. **Đang lắng nghe** real-time messages từ server
4. **Sẵn sàng nhận** notifications ngay lập tức khi server gửi

**❌ Disconnected (màu xám) có nghĩa:**

1. Chưa login (không có user)
2. Mất kết nối mạng
3. Backend server không chạy
4. Token hết hạn

### 9.2. Flow kết nối WebSocket

```
1. User login → có token
2. NotificationProvider mount
3. useEffect detect user.id
4. Gọi webSocketService.connect(userId, callbacks)
5. SockJS tạo connection đến /ws
6. STOMP handshake với Authorization header
7. Server validate token → Accept connection
8. Client subscribe đến /user/queue/notifications
9. setIsConnected(true) → UI hiện màu xanh
10. Khi có notification:
    - Server push qua WebSocket
    - handleMessage callback được gọi
    - setNotifications update state
    - UI re-render hiển thị notification mới
```

### 9.3. Debug WebSocket

**Console logs:**

```
[STOMP Debug] Opening Web Socket...
[STOMP Debug] Web Socket Opened...
[STOMP Debug] >>> CONNECT
Authorization:Bearer eyJhbGciOiJIUzUx...
[STOMP Debug] <<< CONNECTED
✅ WebSocket connected successfully
[STOMP Debug] >>> SUBSCRIBE
id:sub-0
destination:/user/queue/notifications
📡 Subscribed to /user/queue/notifications for user: 5b3c2797...
```

**Giải thích các bước:**

1. `Opening Web Socket` - Tạo TCP connection
2. `Web Socket Opened` - Connection established
3. `>>> CONNECT` - Gửi STOMP CONNECT frame với JWT
4. `<<< CONNECTED` - Server chấp nhận, trả về CONNECTED
5. `>>> SUBSCRIBE` - Subscribe đến notification queue
6. `📡 Subscribed` - Đã subscribe thành công, đợi messages

---

## 10. Tổng Kết - React Learning Path

### 10.1. Học theo thứ tự này:

1. ✅ **JSX & Components** - Hiểu cách viết UI
2. ✅ **Props & State** - Truyền dữ liệu và quản lý trạng thái
3. ✅ **Event Handling** - Xử lý user interactions
4. ✅ **Conditional Rendering** - Hiển thị động
5. ✅ **Lists & Keys** - Render danh sách
6. ✅ **useState** - State management cơ bản
7. ✅ **useEffect** - Side effects & lifecycle
8. ✅ **useCallback & useMemo** - Performance optimization
9. ✅ **Context API** - Global state management
10. ✅ **Custom Hooks** - Reusable logic

### 10.2. Recommended Resources

**Official Docs:**
- [React Beta Docs](https://react.dev) - Học từ docs mới nhất
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

**Practice:**
- Build small projects
- Read open-source code
- Refactor existing code

**Tips:**
- Console.log everything khi mới học
- Đọc error messages cẩn thận
- Hỏi "Tại sao?" với mọi pattern
- Viết code nhiều, đọc docs ít hơn
- Học bằng cách làm dự án thực tế

---

## 📚 Appendix - Quick Reference

### React Hooks Cheatsheet

```tsx
// State
const [state, setState] = useState(initialValue);

// Effect
useEffect(() => { /* effect */ return () => { /* cleanup */ }; }, [deps]);

// Memoization
const memoizedValue = useMemo(() => computeValue(), [deps]);
const memoizedCallback = useCallback(() => { /* callback */ }, [deps]);

// Context
const value = useContext(MyContext);

// Ref
const ref = useRef(initialValue);

// Reducer (advanced state management)
const [state, dispatch] = useReducer(reducer, initialState);
```

### TypeScript Cheatsheet

```tsx
// Props interface
interface ComponentProps {
  title: string;
  count?: number;              // Optional
  onClose: () => void;         // Function
  children: React.ReactNode;   // JSX children
}

// Function component
const Component: React.FC<ComponentProps> = ({ title, children }) => { };

// Event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { };
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { };

// Refs
const inputRef = useRef<HTMLInputElement>(null);
```

---

**Học React là journey, không phải race. Enjoy the process! 🚀**
