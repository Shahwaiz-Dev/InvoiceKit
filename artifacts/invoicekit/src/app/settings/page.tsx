"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, ArrowLeft, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

type SettingsForm = {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  logoUrl: string;
};

const EMPTY_FORM: SettingsForm = {
  businessName: "",
  businessEmail: "",
  businessAddress: "",
  logoUrl: "",
};

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [logoError, setLogoError] = useState("");
  const [form, setForm] = useState<SettingsForm>(EMPTY_FORM);

  // React Query for settings — deduplication + stale-while-revalidate.
  // Rule: client-swr-dedup
  const { data: settingsData, isLoading: loading } = useQuery<SettingsForm | null>({
    queryKey: ["settings"],
    queryFn: () =>
      fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
    enabled: !!session,
    staleTime: 5 * 60_000,
  });

  // Sync server data into local form state once loaded
  useEffect(() => {
    if (settingsData) {
      setForm({
        businessName: settingsData.businessName || "",
        businessEmail: settingsData.businessEmail || "",
        businessAddress: settingsData.businessAddress || "",
        logoUrl: settingsData.logoUrl || "",
      });
    }
  }, [settingsData]);

  const saveMutation = useMutation({
    mutationFn: (data: SettingsForm) =>
      fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved! Your business profile will auto-fill in the editor.");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError("");
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError("Logo must be 2MB or smaller");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  // Render-time auth guard — eliminates the useEffect redirect flash.
  // Rule: rerender-derived-state-no-effect
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-border" />
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <FileText className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <span className="font-medium tracking-tight">InvoiceKit</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-1">
            Business Profile
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            These details will auto-fill in the editor every time you create an invoice.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="bg-white rounded-xl border border-border p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="businessName">Business / Your Name</Label>
                    <Input
                      id="businessName"
                      value={form.businessName}
                      onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="businessEmail">Business Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={form.businessEmail}
                      onChange={(e) => setForm((f) => ({ ...f, businessEmail: e.target.value }))}
                      placeholder="hello@acme.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Textarea
                    id="businessAddress"
                    rows={3}
                    value={form.businessAddress}
                    onChange={(e) => setForm((f) => ({ ...f, businessAddress: e.target.value }))}
                    placeholder="123 Main St, City, Country"
                  />
                </div>

                {/* Logo */}
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-4">
                    {form.logoUrl ? (
                      <div className="relative w-20 h-20 border border-border rounded-lg flex items-center justify-center bg-white">
                        <img
                          src={form.logoUrl}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain p-1"
                        />
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, logoUrl: "" }))}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/5 text-muted-foreground text-xs">
                        No logo
                      </div>
                    )}
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="max-w-[240px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        JPG, PNG, or WEBP. Max 2MB.
                      </p>
                      {logoError && (
                        <p className="text-xs text-destructive mt-1">{logoError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="h-10 px-6 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
