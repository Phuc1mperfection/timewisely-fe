import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../layout/AppSidebar";
import { Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="min-h-screen flex w-full  ">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200" />
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
