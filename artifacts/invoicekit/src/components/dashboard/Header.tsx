"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#e1e9f0] bg-white px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-8 w-8 rounded-md text-[#36394a] hover:bg-[#f5f3ff] hover:text-[#091135] transition-colors" />
        <Separator orientation="vertical" className="h-5 w-px bg-[#e1e9f0]" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight text-[#091135]">{title}</h1>
          </div>
          {description && (
            <p className="text-xs text-[#36394a] tracking-tight">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </header>
  );
}
