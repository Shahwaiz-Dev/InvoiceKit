import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { InvoiceData } from "@/lib/schema";
import { X } from "lucide-react";
import { MAX_LOGO_SIZE_BYTES } from "../../lib/editor-utils";

interface SectionProps {
  form: UseFormReturn<InvoiceData>;
  labels: any;
}

export function BusinessSection({ form, labels }: SectionProps) {
  const logoUrl = form.watch("logoUrl");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      form.setError("logoUrl", { message: "Please upload an image file" });
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      form.setError("logoUrl", { message: "Logo must be 2MB or smaller" });
      e.target.value = "";
      return;
    }
    form.clearErrors("logoUrl");
    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("logoUrl", reader.result as string, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.businessName}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
        name="businessAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input type="url" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <label className="mb-2 block text-sm font-medium leading-none">Logo</label>
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <div className="relative w-20 h-20 border border-border rounded flex items-center justify-center bg-white">
              <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain p-1" />
              <button
                type="button"
                onClick={() => form.setValue("logoUrl", "", { shouldDirty: true, shouldValidate: true })}
                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border border-dashed border-border rounded flex items-center justify-center bg-muted/5 text-muted-foreground text-xs">
              No logo
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full max-w-xs" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">JPG, PNG, or WEBP. Max size 2MB.</p>
        {form.formState.errors.logoUrl?.message && (
          <p className="text-[0.8rem] font-medium text-destructive mt-1">{form.formState.errors.logoUrl.message}</p>
        )}
      </div>
    </div>
  );
}
