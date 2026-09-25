"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, Building2, Mail, MapPin, Globe, Phone, Hash, UploadCloud } from "lucide-react";
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
      toast.success("Business profile saved successfully");
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
      setLogoError("Maximum file size is 2MB");
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
    <div className="bg-[#fcfdfe] min-h-screen w-full flex flex-col flex-1">
      <DashboardHeader 
        title="Business Profile" 
        description="Global company profile automatically applied to all created invoices."
      />

      <main className="flex-1 space-y-6 p-8 pt-6 w-full">
        {loading && !initialSettings ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-[#0f77ff]" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Details */}
              <Card className="lg:col-span-2 rounded-xl border border-[#e1e9f0] bg-white shadow-none">
                <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a] flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#0f77ff]" /> Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessName" className="text-xs font-semibold text-[#091135]">
                        Entity / Company Name <span className="text-[#0f77ff]">*</span>
                      </Label>
                      <Input 
                        id="businessName"
                        value={form.businessName}
                        onChange={(e) => setForm(f => ({ ...f, businessName: e.target.value }))}
                        placeholder="e.g. Acme Corp"
                        className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="taxId" className="text-xs font-semibold text-[#091135]">
                        Tax Registration / VAT ID
                      </Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
                        <Input 
                          id="taxId"
                          value={form.taxId}
                          onChange={(e) => setForm(f => ({ ...f, taxId: e.target.value }))}
                          placeholder="US-987654321"
                          className="pl-9 border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="businessEmail" className="text-xs font-semibold text-[#091135]">
                        Default Invoicing Email <span className="text-[#0f77ff]">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
                        <Input 
                          id="businessEmail"
                          className="pl-9 border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                          value={form.businessEmail}
                          onChange={(e) => setForm(f => ({ ...f, businessEmail: e.target.value }))}
                          placeholder="invoices@acme.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-[#091135]">
                        Business Telephone
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
                        <Input 
                          id="phone"
                          className="pl-9 border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                          value={form.phone}
                          onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessAddress" className="text-xs font-semibold text-[#091135]">
                      Physical Office / Mailing Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
                      <Textarea 
                        id="businessAddress"
                        className="pl-9 min-h-[90px] border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs bg-white"
                        value={form.businessAddress}
                        onChange={(e) => setForm(f => ({ ...f, businessAddress: e.target.value }))}
                        placeholder="Suite 500, 100 Innovation Way, San Francisco, CA 94105"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brand Assets Card */}
              <div className="space-y-6">
                <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none">
                  <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a]">
                      Brand Mark
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#e1e9f0] rounded-xl bg-[#f5f3ff]/30 text-center">
                      {form.logoUrl ? (
                        <div className="relative group mb-3">
                          <div className="h-24 w-24 rounded-xl border border-[#e1e9f0] bg-white flex items-center justify-center p-2 shadow-sm">
                            <img src={form.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setForm(f => ({ ...f, logoUrl: "" }))}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-colors"
                            title="Remove logo"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-20 w-20 rounded-xl border border-[#e1e9f0] bg-white flex flex-col items-center justify-center text-[#8e9bb0] mb-3">
                          <UploadCloud className="h-7 w-7 text-[#0f77ff]" />
                          <span className="text-[10px] mt-1 font-medium">No Logo</span>
                        </div>
                      )}

                      <div className="w-full">
                        <Input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="h-8 py-1 text-xs cursor-pointer bg-white border-[#e1e9f0]"
                        />
                        {logoError ? (
                          <p className="text-[11px] text-red-600 mt-1">{logoError}</p>
                        ) : (
                          <p className="text-[10px] text-[#36394a] mt-1.5 uppercase tracking-wider">PNG, JPG, SVG • Up to 2MB</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none">
                  <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a]">
                      Online Web Presence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-1.5">
                      <Label htmlFor="website" className="text-xs font-semibold text-[#091135]">
                        Company Website URL
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-[#8e9bb0]" />
                        <Input 
                          id="website"
                          className="pl-9 border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
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

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs font-medium h-9 px-6 shadow-sm rounded-lg"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
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
    </div>
  );
}
