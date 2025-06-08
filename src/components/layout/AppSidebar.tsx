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
  Sparkles,
  Target,
  LayoutDashboard,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { title: "Dashboard", url: "/app/dashboard", icon: Home },
  { title: "Overview", url: "/app/dashboard/overview", icon: LayoutDashboard },
  { title: "Calendar", url: "/app/dashboard/calendar", icon: Calendar },
  { title: "Goals", url: "/app/dashboard/goals", icon: Target },
  {
    title: "AI Suggestions",
    url: "/app/dashboard/ai-suggestions",
    icon: Sparkles,
  },
  { title: "Profile", url: "/app/dashboard/profile", icon: User },
  { title: "Settings", url: "/app/dashboard/settings", icon: Settings },
  { title: "Debug", url: "/app/debug", icon: Home },
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
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[var(--wisely-purple)] to-[var(--wisely-mint)] rounded-lg"></div>
          <span className="text-xl font-bold text-wisely-dark">TimeWisely</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[var(--wisely-gray)]">
            Navigation
          </SidebarGroupLabel>
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
                            ? "bg-purple-500 text-[var(--wisely-purple)] font-semibold"
                            : "hover:bg-purple-500 group-hover:text-[var(--wisely-purple)]")
                        }
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon
                          className={
                            "w-5 h-5 " +
                            (isActive
                              ? "text-[var(--wisely-purple)]"
                              : "text-[var(--wisely-gray)] group-hover:text-[var(--wisely-purple)]")
                          }
                        />
                        <span
                          className={
                            isActive
                              ? "text-[var(--wisely-purple)]"
                              : "text-wisely-dark group-hover:text-[var(--wisely-purple)]"
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
      <SidebarFooter >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="flex items-center space-x-3 p-3 bg-purple-100 hover:cursor-pointer hover:bg-purple-300">
                <div className=" bg-wisely-purple rounded-full flex items-center justify-center">
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
                  <p className="text-sm font-medium text-wisely-dark truncate">
                    {user?.fullName || user?.username || user?.email}
                  </p>
                
                </div>
                <ChevronUp className="" />

              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/app/dashboard")}>
                <span>Dashboard </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/app/dashboard/profile")}
              >
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
