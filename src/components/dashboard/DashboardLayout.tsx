import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../layout/AppSidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-[var(--wisely-lightGray)]">
      <div className="min-h-screen flex w-full ">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <ModeToggle />
            </div>
          </header>
          {/* Render nested route content */}
          <Outlet />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
