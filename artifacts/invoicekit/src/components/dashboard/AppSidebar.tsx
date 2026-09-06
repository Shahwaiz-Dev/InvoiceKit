"use client";

import * as React from "react";
import {
  LayoutDashboard,
  FileText,
  Building2,
  Settings,
  Plus,
  User,
  CreditCard,
  LogOut,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceBroIcon } from "@/components/layout/InvoiceBroLogo";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
    },
    {
      title: "Business Profile",
      url: "/dashboard/business",
      icon: Building2,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: User,
    },
    {
      title: "Subscription",
      url: "/dashboard/subscription",
      icon: CreditCard,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-[#e1e9f0] bg-white" {...props}>
      <SidebarHeader className="border-b border-[#e1e9f0]/80 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-[#f5f3ff] transition-colors rounded-lg">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center">
                  <InvoiceBroIcon className="size-8" />
                </div>
                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold tracking-tight text-sm text-[#091135]">
                    Invoice<span className="text-[#091135]">Bro</span>
                  </span>
                  <span className="truncate text-[10px] font-medium uppercase tracking-wider text-[#36394a]/80">
                    Observatory
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-[#36394a]/70 px-2 mb-1">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {data.navMain.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 rounded-lg font-medium text-xs tracking-tight transition-all duration-150 ${
                        isActive
                          ? "bg-[#f5f3ff] text-[#091135] font-semibold shadow-none border-l-[3px] border-[#0f77ff] rounded-l-none pl-2.5"
                          : "text-[#36394a] hover:text-[#091135] hover:bg-[#f5f3ff]/70"
                      }`}
                    >
                      <Link href={item.url as any} className="flex items-center gap-2.5">
                        <item.icon className={`size-4 shrink-0 ${isActive ? "text-[#0f77ff]" : "text-[#36394a]"}`} />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Create Invoice"
                  className="h-10 rounded-lg bg-[#127ee3] text-white hover:bg-[#0f77ff] hover:text-white font-medium text-xs tracking-tight shadow-sm transition-all"
                >
                  <Link href="/editor" className="flex items-center justify-center gap-2">
                    <Plus className="size-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden font-medium">New Invoice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#e1e9f0]/80 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-12 rounded-lg hover:bg-[#f5f3ff] data-[state=open]:bg-[#f5f3ff] transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-[#e1e9f0] bg-[#f5f3ff]">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="rounded-lg bg-[#f5f3ff] text-[#091135] font-semibold text-xs">
                      {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-[#091135]">
                      {session?.user?.name || "Member"}
                    </span>
                    <span className="truncate text-[11px] text-[#36394a]/80">
                      {session?.user?.email || "Account"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-[#36394a] group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-[#e1e9f0] bg-white p-1.5 shadow-lg"
                side="bottom"
                align="end"
                sideOffset={6}
              >
                <div className="px-2 py-1.5 border-b border-[#e1e9f0] mb-1">
                  <p className="text-xs font-semibold text-[#091135]">{session?.user?.name}</p>
                  <p className="text-[11px] text-[#36394a] truncate">{session?.user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-xs text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135]"
                  >
                    <Settings className="mr-2 h-4 w-4 text-[#36394a]" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/subscription"
                    className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-xs text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135]"
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-[#36394a]" />
                    Billing & Plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-[#e1e9f0]" />
                <DropdownMenuItem
                  onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                  className="flex cursor-pointer items-center rounded-lg px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
