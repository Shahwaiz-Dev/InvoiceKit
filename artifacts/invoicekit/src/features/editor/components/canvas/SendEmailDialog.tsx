"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Loader2, Send } from "lucide-react";
import { InvoiceData } from "@/lib/schema";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: InvoiceData;
  onSend: (recipientEmail: string, customMessage?: string) => Promise<void>;
  isSending: boolean;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  data,
  onSend,
  isSending,
}: SendEmailDialogProps) {
  const [email, setEmail] = useState(data.clientEmail || "");
  const [message, setMessage] = useState(
    `Hi ${data.clientName || "there"},\n\nPlease find attached invoice #${data.invoiceNumber || "0001"}. Thank you for your business!`
  );

  useEffect(() => {
    if (open) {
      if (data.clientEmail) {
        setEmail(data.clientEmail);
      }
      setMessage(
        `Hi ${data.clientName || "there"},\n\nPlease find attached invoice #${data.invoiceNumber || "0001"}. Thank you for your business!`
      );
    }
  }, [open, data.clientEmail, data.clientName, data.invoiceNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await onSend(email, message);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Review the recipient details and send the invoice directly.
          </DialogDescription>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="client-email" className="text-xs font-semibold text-slate-700">
              Recipient Email Address
            </Label>
            <Input
              id="client-email"
              type="email"
              required
              placeholder="client@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email-message" className="text-xs font-semibold text-slate-700">
              Personalized Message (Optional)
            </Label>
            <Textarea
              id="email-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-xs resize-none"
            />
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-xs text-slate-600 flex justify-between items-center">
            <span>Invoice #{data.invoiceNumber || "0001"}</span>
            <span className="font-semibold text-slate-900">
              {data.currency} {data.lineItems.reduce((acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0).toFixed(2)}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSending || !email}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
