"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, Building2, Mail, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

type SettingsForm = {
  businessName: string;
  businessEmail: string;
  businessAddress: string;
  logoUrl: string;
  taxId?: string;
  website?: string;
  phone?: string;
};

const EMPTY_FORM: SettingsForm = {
  businessName: "",
  businessEmail: "",
  businessAddress: "",
  logoUrl: "",
};

interface BusinessViewProps {
  initialSettings: SettingsForm | null;
}

export function BusinessView({ initialSettings }: BusinessViewProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [logoError, setLogoError] = useState("");
  const [form, setForm] = useState<SettingsForm>(initialSettings || EMPTY_FORM);

  const { data: settingsData, isLoading: loading } = useQuery<SettingsForm | null>({
    queryKey: ["settings"],
    queryFn: () => fetch("/api/settings").then((r) => (r.ok ? r.json() : null)),
    initialData: initialSettings,
    enabled: !!session,
  });

  useEffect(() => {
    if (settingsData) {
      setForm({
        businessName: settingsData.businessName || "",
        businessEmail: settingsData.businessEmail || "",
        businessAddress: settingsData.businessAddress || "",
        logoUrl: settingsData.logoUrl || "",
        taxId: settingsData.taxId || "",
        website: settingsData.website || "",
        phone: settingsData.phone || "",
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
      toast.success("Business profile updated!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError("");
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError("Max size 2MB");
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

  return (
    <>
      <DashboardHeader 
        title="Business Profile" 
        description="Your business details will be automatically used for all new invoices."
      />

      <main className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
        {loading && !initialSettings ? (
             <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        ) : (
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4" /> Company Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name</Label>
                                    <Input 
                                        id="businessName"
                                        value={form.businessName}
                                        onChange={(e) => setForm(f => ({ ...f, businessName: e.target.value }))}
                                        placeholder="Acme Inc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taxId">Tax ID / VAT (Optional)</Label>
                                    <Input 
                                        id="taxId"
                                        value={form.taxId}
                                        onChange={(e) => setForm(f => ({ ...f, taxId: e.target.value }))}
                                        placeholder="US-1234567"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="businessEmail">Billing Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="businessEmail"
                                            className="pl-9"
                                            value={form.businessEmail}
                                            onChange={(e) => setForm(f => ({ ...f, businessEmail: e.target.value }))}
                                            placeholder="billing@acme.com"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input 
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="businessAddress">Business Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea 
                                        id="businessAddress"
                                        className="pl-9 min-h-[100px]"
                                        value={form.businessAddress}
                                        onChange={(e) => setForm(f => ({ ...f, businessAddress: e.target.value }))}
                                        placeholder="123 Street Name, City, Country"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Branding Side-Card */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Brand Identity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Label>Company Logo</Label>
                                <div className="flex flex-col items-center gap-4 py-4 border rounded-lg bg-slate-50/50">
                                    {form.logoUrl ? (
                                        <div className="relative group">
                                            <div className="h-24 w-24 rounded-lg border bg-white flex items-center justify-center p-2">
                                                <img src={form.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, logoUrl: "" }))}
                                                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-24 w-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-white">
                                            <Building2 className="h-8 w-8 opacity-20" />
                                            <span className="text-[10px] mt-1 font-medium">No Logo</span>
                                        </div>
                                    )}
                                    <div className="px-4 w-full">
                                        <Input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="h-8 py-1 text-xs cursor-pointer"
                                        />
                                        <p className="text-[10px] text-center text-muted-foreground mt-2 uppercase tracking-tight">PNG, JPG, WEBP • Max 2MB</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Digital Presence</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input 
                                            id="website"
                                            className="pl-9"
                                            value={form.website}
                                            onChange={(e) => setForm(f => ({ ...f, website: e.target.value }))}
                                            placeholder="https://acme.com"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button 
                        type="submit" 
                        disabled={saveMutation.isPending}
                        className="bg-primary text-primary-foreground min-w-[140px]"
                    >
                        {saveMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </form>
        )}
      </main>
    </>
  );
}
