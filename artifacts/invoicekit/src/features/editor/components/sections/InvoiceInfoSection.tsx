import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function InvoiceInfoSection({ form, labels }: SectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="invoiceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.invoiceNumber}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="issueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.issueDate}</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.dueDate}</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
