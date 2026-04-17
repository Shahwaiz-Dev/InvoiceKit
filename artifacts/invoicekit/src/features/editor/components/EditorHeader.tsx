import Link from "next/link";
import { ArrowLeft, LayoutTemplate, Save, User, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateType } from "@/lib/schema";
import { INVOICE_TEMPLATES } from "@/lib/config";

interface EditorHeaderProps {
  template: TemplateType;
  setTemplate: (v: TemplateType) => void;
  session: any;
  isSavingToDb: boolean;
  onSave: () => void;
  templates: { value: TemplateType; label: string }[];
}

export function EditorHeader({
  template,
  setTemplate,
  session,
  isSavingToDb,
  onSave,
  templates,
}: EditorHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 shrink-0 z-30">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <LayoutTemplate className="w-4 h-4 text-muted-foreground" />
          <Select value={template} onValueChange={(v) => setTemplate(v as TemplateType)}>
            <SelectTrigger className="h-8 text-xs border-0 shadow-none bg-transparent pr-2 pl-1 font-medium gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-sm">
                  {t.label} Template
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {session ? (
          <>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={onSave}
              disabled={isSavingToDb}
              className="h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/10 transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSavingToDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
          </>
        ) : (
          <Link href="/login" className="h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted/10 transition-colors">
            Login to Save
          </Link>
        )}
      </div>
    </header>
  );
}
