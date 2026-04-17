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
      className="mb-6 bg-white border border-border rounded-lg overflow-hidden"
    >
      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 bg-muted/5 hover:bg-muted/10 transition-colors font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}
