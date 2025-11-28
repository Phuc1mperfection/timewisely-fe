import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Settings,
  User,
  Home,
  LayoutDashboard,
  ChevronUp,
  Timer,
  CalendarDays,
  Clock,
  CheckCircle,
  ListTodo,
  Inbox,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Logo from "@/assets/icon.svg";

const mainMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Overview", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Pomodoro", url: "/dashboard/pomodoro", icon: Timer },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const taskMenuItems = [
  { title: "Inbox", url: "/dashboard/tasks/inbox", icon: Inbox },
  { title: "Today", url: "/dashboard/tasks/today", icon: CalendarDays },
  { title: "Upcoming", url: "/dashboard/tasks/upcoming", icon: Clock },
  { title: "Completed", url: "/dashboard/tasks/completed", icon: CheckCircle },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="TimeWisely Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">TimeWisely</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <button
                        type="button"
                        onClick={() => navigate(item.url)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tasks Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ListTodo className="h-4 w-4" />
                  <span>Tasks</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {taskMenuItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive}
                        >
                          <button
                            type="button"
                            onClick={() => navigate(item.url)}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {(
                  user?.fullName?.charAt(0) ||
                  user?.username?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </div>
              <div className="flex-1 text-left text-sm">
                <p className="font-medium truncate">
                  {user?.fullName || user?.username || user?.email || "User"}
                </p>
              </div>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
