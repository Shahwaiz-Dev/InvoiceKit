import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function NotesSection({ form, labels }: SectionProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea placeholder={labels.notesPlaceholder} rows={4} {...field} value={field.value || ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
