import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRENCIES } from "../../lib/editor-utils";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function FinancialsSection({ form, labels }: SectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="taxRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.tax}</FormLabel>
            <FormControl>
              <Input type="number" min={0} max={100} step="any" {...field} value={field.value ?? 0} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="discount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{labels.discount}</FormLabel>
            <FormControl>
              <Input type="number" min={0} max={100} step="any" {...field} value={field.value ?? 0} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Currency</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value
                      ? CURRENCIES.find((c) => c.value === field.value)?.label
                      : "Select currency"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[240px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search currency..." />
                  <CommandList>
                    <CommandEmpty>No currency found.</CommandEmpty>
                    <CommandGroup>
                      {CURRENCIES.map((c) => (
                        <CommandItem
                          value={c.label}
                          key={c.value}
                          onSelect={() => {
                            form.setValue("currency", c.value);
                          }}
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", c.value === field.value ? "opacity-100" : "opacity-0")}
                          />
                          {c.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
