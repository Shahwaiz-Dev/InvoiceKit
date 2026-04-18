import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { Users, ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
  customers?: any[];
  canManageCustomers?: boolean;
}

export function ClientSection({ form, labels, customers = [], canManageCustomers = false }: SectionProps) {
  const handleSelectCustomer = (customer: any) => {
    form.setValue("clientName", customer.name);
    form.setValue("clientEmail", customer.email);
    form.setValue("clientAddress", customer.address);
  };

  return (
    <div className="space-y-4">
      {canManageCustomers && customers.length > 0 && (
        <div className="flex justify-end mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all">
                <Users className="h-3.5 w-3.5" />
                Select Customer
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">My Customers</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {customers.map((customer) => (
                <DropdownMenuItem 
                    key={customer._id} 
                    className="cursor-pointer flex flex-col items-start gap-0.5 py-2"
                    onClick={() => handleSelectCustomer(customer)}
                >
                  <span className="font-medium text-sm">{customer.name}</span>
                  <span className="text-[10px] text-muted-foreground">{customer.email}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!canManageCustomers && (
        <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[10px] uppercase font-bold text-muted-foreground/60 cursor-not-allowed grayscale">
                <Sparkles className="h-3 w-3" />
                Auto-fill (Authority Only)
            </Button>
        </div>
      )}
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
