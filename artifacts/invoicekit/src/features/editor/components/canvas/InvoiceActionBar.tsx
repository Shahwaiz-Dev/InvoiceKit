"use client";

import Link from "next/link";
import { 
  Download, 
  Mail, 
  RotateCcw, 
  Eye, 
  Pencil, 
  LayoutTemplate, 
  Save, 
  Loader2, 
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TemplateType } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface InvoiceActionBarProps {
  template: TemplateType;
  setTemplate: (t: TemplateType) => void;
  templates: { value: TemplateType; label: string }[];
  activeView: "canvas" | "preview";
  setActiveView: (view: "canvas" | "preview") => void;
  onDownload: () => void;
  isDownloading: boolean;
  onOpenEmail: () => void;
  onReset: () => void;
  onSave?: () => void;
  isSavingToDb?: boolean;
  session?: any;
  mode?: "full" | "embedded";
}

export function InvoiceActionBar({
  template,
  setTemplate,
  templates,
  activeView,
  setActiveView,
  onDownload,
  isDownloading,
  onOpenEmail,
  onReset,
  onSave,
  isSavingToDb,
  session,
  mode = "full",
}: InvoiceActionBarProps) {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
      {/* Left Group: Navigation / Template & View Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {mode === "full" && (
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        )}

        {/* View Switcher Pill */}
        <div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveView("canvas")}
            className={cn(
              "py-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all",
              activeView === "canvas"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Pencil className="w-3.5 h-3.5 text-blue-600" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView("preview")}
            className={cn(
              "py-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all",
              activeView === "preview"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Preview</span>
          </button>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-1.5 pl-1">
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <Select value={template} onValueChange={(v) => setTemplate(v as TemplateType)}>
            <SelectTrigger className="h-8 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 min-w-[120px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs">
                  {t.label} Style
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Action */}
        <div className="hidden sm:flex items-center gap-1 text-slate-300">
          <span>|</span>
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-medium text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50/50 transition-colors flex items-center gap-1"
            title="Reset invoice to blank"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Right Group: Actions (Send Email, Save, Download) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Send Email Button */}
        <button
          type="button"
          onClick={onOpenEmail}
          className="h-8 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          title="Send invoice directly to client"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Send Email</span>
        </button>

        {/* Cloud Save (if logged in) */}
        {session && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSavingToDb}
            className="h-8 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors disabled:opacity-50"
          >
            {isSavingToDb ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className="hidden sm:inline">Save</span>
          </button>
        )}

        {/* Primary Download PDF Action */}
        <Button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          size="sm"
          className="h-8 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
