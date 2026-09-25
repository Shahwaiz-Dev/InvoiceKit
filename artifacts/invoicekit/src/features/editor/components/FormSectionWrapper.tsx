import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function FormSectionWrapper({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="mb-3.5 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs transition-all"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-100/80 transition-colors font-medium text-xs text-slate-700">
        <span className="tracking-tight font-semibold">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3.5 space-y-3.5 bg-white">{children}</CollapsibleContent>
    </Collapsible>
  );
}
