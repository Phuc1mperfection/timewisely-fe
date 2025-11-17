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
} from "@/components/ui/sidebar";
import {
  Calendar,
  Settings,
  User,
  Home,
  // Sparkles,
  LayoutDashboard,
  ChevronUp,
  Timer,
  CheckSquare,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Logo from "@/assets/icon.svg"; // Adjust the path as necessary

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Overview", url: "/dashboard/overview", icon: LayoutDashboard },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Tasks", url: "/dashboard/tasks", icon: CheckSquare },
  // { title: "AI Suggestions", url: "/dashboard/ai-suggestions", icon: Sparkles },
  { title: "Pomodoro", url: "/dashboard/pomodoro", icon: Timer },
  { title: "Profile", url: "/dashboard/profile", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
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
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="TimeWisely Logo" className="w-8 h-8" />
          {/* You can replace the logo with an SVG or any other image */}
          <span className="text-xl font-bold  dark:text-white">TimeWisely</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <button
                        type="button"
                        onClick={() => navigate(item.url)}
                        className={
                          "flex items-center space-x-3 p-3 rounded-lg transition-colors group w-full text-left " +
                          (isActive
                            ? " text-[var(--wisely-gold)] font-semibold "
                            : "hover:bg-yellow-500 hover:text-[var(--wisely-gold)] hover:cursor-pointer")
                        }
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon
                          className={
                            "w-5 h-5 " +
                            (isActive
                              ? "text-[var(--wisely-gold)]"
                              : "hover:text-[var(--wisely-gold)]")
                          }
                        />
                        <span
                          className={
                            isActive
                              ? "text-[var(--wisely-gold)]"
                              : "hover:text-[var(--wisely-gold)] dark:hover:text-[var(--wisely-white)]"
                          }
                        >
                          {item.title}
                        </span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="bg-yellow-100 hover:cursor-pointer hover:bg-yellow-300">
              <div className=" bg-wisely-gold rounded-full flex items-center justify-center">
                {/* <span className="text-white text-sm font-medium">
                    {(
                      user?.fullName?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      ""
                    ).toUpperCase()}
                  </span> */}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-[var(--wisely-gray)] ">
                  {user?.fullName || user?.username || user?.email}
                </p>
              </div>
              <ChevronUp className="text-orange-950" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              <span>Dashboard </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <span>Account </span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <span>Sign Out </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
