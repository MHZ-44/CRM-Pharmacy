import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full flex-col">
        <Navbar />
        <div className="flex min-h-0 w-full flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="flex-1">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
