import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { Plus, X } from "lucide-react";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function LineItemsSection({ form, labels }: SectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const lineItemsErrorMessage =
    !Array.isArray(form.formState.errors.lineItems) &&
    typeof form.formState.errors.lineItems?.message === "string"
      ? form.formState.errors.lineItems.message
      : undefined;

  return (
    <div className="space-y-4">
      {fields.map((lineItem, index) => (
        <div key={lineItem.id} className="flex items-start gap-2 relative group p-3 border border-border rounded bg-white">
          <div className="flex-1 space-y-3">
            <FormField
              control={form.control}
              name={`lineItems.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={labels.lineItemsDesc} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name={`lineItems.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input type="number" min={0} step="any" placeholder={labels.lineItemsQty} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`lineItems.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input type="number" min={0} step="any" placeholder={labels.lineItemsPrice} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            className="mt-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={fields.length <= 1}
            aria-label="Remove line item"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 })}
        className="w-full py-3 border-2 border-dashed border-accent/30 text-accent font-medium rounded hover:bg-accent/5 hover:border-accent/50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add {labels.lineItemsSection}
      </button>

      {lineItemsErrorMessage && <p className="text-[0.8rem] font-medium text-destructive">{lineItemsErrorMessage}</p>}
    </div>
  );
}
