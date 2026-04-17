import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function ClientSection({ form, labels }: SectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.clientName}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.clientEmail}</FormLabel>
              <FormControl>
                <Input type="email" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="clientAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.clientAddress}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
