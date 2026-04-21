import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <SidebarInset className="flex flex-col bg-transparent">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
