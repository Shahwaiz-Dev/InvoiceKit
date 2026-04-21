"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { SignatureDialog } from "../SignatureDialog";
import { PenLine, X } from "lucide-react";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
}

export function SignatureSection({ form }: SectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const signature = form.watch("signature");

  const handleConfirm = (data: { text: string; font: string }) => {
    form.setValue("signature", data);
  };

  const clearSignature = () => {
    form.setValue("signature", undefined);
  };

  return (
    <div className="space-y-4">
      {!signature?.text ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-dashed border-2 border-secondary/10 hover:border-primary/50 hover:bg-primary/5 group"
          onClick={() => setIsDialogOpen(true)}
        >
          <PenLine className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
          Add Signature
        </Button>
      ) : (
        <div className="relative p-4 rounded-xl border border-secondary/10 bg-muted/5 group overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Applied Signature
            </span>
            <button
              onClick={clearSignature}
              className="p-1 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors text-muted-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div 
            className="text-2xl text-secondary px-2 truncate"
            style={{ fontFamily: signature.font }}
          >
            {signature.text}
          </div>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Change style
          </button>
        </div>
      )}

      <SignatureDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirm}
        defaultValues={signature}
      />
    </div>
  );
}
