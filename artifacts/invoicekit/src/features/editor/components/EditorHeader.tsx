import Link from "next/link";
import { ArrowLeft, LayoutTemplate, Save, User, Loader2, Sparkles, Pencil, Eye, FileText, Maximize2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateType } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface EditorHeaderProps {
  template: TemplateType;
  setTemplate: (v: TemplateType) => void;
  session: any;
  isSavingToDb: boolean;
  onSave: () => void;
  templates: { value: TemplateType; label: string }[];
  mode?: "full" | "embedded";
  activeTab?: "edit" | "preview";
  setActiveTab?: (tab: "edit" | "preview") => void;
}

export function EditorHeader({
  template,
  setTemplate,
  session,
  isSavingToDb,
  onSave,
  templates,
  mode = "full",
  activeTab = "edit",
  setActiveTab,
}: EditorHeaderProps) {
  const callbackUrl = `/editor?template=${encodeURIComponent(template)}`;

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {mode === "embedded" ? (
          <div className="flex items-center gap-1.5 text-[#091135]">
            <div className="w-6 h-6 rounded-md bg-[#0f77ff]/10 text-[#0f77ff] flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs sm:text-sm hidden xs:inline">
              Invoice Maker
            </span>
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        )}
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1">
          <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          <Select value={template} onValueChange={(v) => setTemplate(v as TemplateType)}>
            <SelectTrigger className="h-8 text-xs border-0 shadow-none bg-transparent pr-1 sm:pr-2 pl-1 font-medium gap-1 max-w-[125px] sm:max-w-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs sm:text-sm">
                  {t.label} Template
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Center on mobile / tablet (< lg): Edit / Preview Switcher */}
      {setActiveTab && (
        <div className="lg:hidden flex items-center shrink-0">
          <div className="inline-flex p-0.5 bg-[#f5f3ff] rounded-lg border border-[#e1e9f0]">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={cn(
                "py-1 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all",
                activeTab === "edit"
                  ? "bg-white text-[#091135] shadow-xs"
                  : "text-[#36394a] hover:text-[#091135]"
              )}
            >
              <Pencil className="w-3 h-3 text-[#0f77ff]" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={cn(
                "py-1 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all",
                activeTab === "preview"
                  ? "bg-white text-[#091135] shadow-xs"
                  : "text-[#36394a] hover:text-[#091135]"
              )}
            >
              <Eye className="w-3 h-3 text-[#0f77ff]" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {mode === "embedded" ? (
          <Link
            href={`/editor?template=${encodeURIComponent(template)}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-all py-1.5 px-3 rounded-lg font-medium shadow-2xs"
            title="Open in full screen studio"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Open Fullscreen</span>
          </Link>
        ) : session ? (
          <>
            <Link href="/dashboard" className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
              <User className="w-3.5 h-3.5" />
              Dashboard
            </Link>
            <button
              onClick={onSave}
              disabled={isSavingToDb}
              className="h-8 px-2.5 sm:px-3 rounded-md border border-border text-xs sm:text-sm font-medium text-foreground hover:bg-muted/10 transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              {isSavingToDb ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="hidden sm:flex h-8 px-2.5 sm:px-3 rounded-md border border-border text-xs sm:text-sm font-medium text-foreground hover:bg-muted/10 transition-colors items-center"
            >
              Sign In
            </Link>
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="h-8 px-2.5 sm:px-3 rounded-md bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-1 sm:gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unlock All Templates</span>
              <span className="sm:hidden">Unlock</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
