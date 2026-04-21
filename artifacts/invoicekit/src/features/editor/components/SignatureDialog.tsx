"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (signature: { text: string; font: string }) => void;
  defaultValues?: { text?: string; font?: string };
}

const SIGNATURE_FONTS = [
  {
    id: "var(--font-signature-1)",
    name: "Great Vibes",
    label: "Great Vibes",
  },
  {
    id: "var(--font-signature-2)",
    name: "Pacifico",
    label: "Pacifico",
  },
  {
    id: "var(--font-signature-3)",
    name: "Dancing Script",
    label: "Dancing Script",
  },
];

export function SignatureDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultValues,
}: SignatureDialogProps) {
  const [text, setText] = useState(defaultValues?.text || "");
  const [selectedFont, setSelectedFont] = useState(
    defaultValues?.font || SIGNATURE_FONTS[0].id
  );

  useEffect(() => {
    if (open) {
      setText(defaultValues?.text || "");
      setSelectedFont(defaultValues?.font || SIGNATURE_FONTS[0].id);
    }
  }, [open, defaultValues]);

  const handleApply = () => {
    onConfirm({ text, font: selectedFont });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">Add Signature</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* Text Input */}
          <div className="space-y-3">
            <Label htmlFor="signature-text" className="text-sm font-semibold text-muted-foreground ml-1">
              Your Signature Text
            </Label>
            <Input
              id="signature-text"
              placeholder="Type your name"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-12 text-lg px-4 bg-muted/30 border-secondary/10 focus-visible:ring-primary/20"
            />
          </div>

          {/* Preview Window */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground ml-1">
              Signature preview
            </Label>
            <div className="h-32 w-full border-2 border-dashed border-secondary/10 rounded-2xl flex items-center justify-center bg-muted/5 p-4 overflow-hidden">
              <span
                style={{ fontFamily: selectedFont }}
                className="text-4xl md:text-5xl text-secondary text-center truncate px-4"
              >
                {text || "Type your name"}
              </span>
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-muted-foreground ml-1">
              Choose a style
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {SIGNATURE_FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setSelectedFont(font.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border text-left transition-all relative group",
                    selectedFont === font.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-secondary/10 bg-white hover:border-primary/50 hover:bg-muted/5"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4 group-hover:text-primary transition-colors">
                    {font.name}
                  </span>
                  <span
                    style={{ fontFamily: font.id }}
                    className="text-xl truncate w-full text-secondary"
                  >
                    {text || "Name"}
                  </span>
                  {selectedFont === font.id && (
                    <div className="absolute top-2 right-2 bg-primary text-secondary rounded-full p-0.5">
                      <Check className="w-3 h-3 stroke-[3px]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-muted-foreground italic flex items-center gap-1">
            Powered by <span className="font-bold text-primary not-italic">InvoiceKit Signature Engine</span>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 flex flex-row items-center justify-end gap-3">
          <Button
             variant="ghost"
             onClick={() => onOpenChange(false)}
             className="font-semibold text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="px-8 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 transition-all"
          >
            Apply signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
