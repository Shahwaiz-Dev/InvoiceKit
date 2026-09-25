"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Zap,
  User,
  Loader2,
  Mail,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Trash2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsageData {
  usage: number;
  limit: number;
  isPro: boolean;
  plan?: string | null;
  usageWindowLabel?: string;
}

interface SettingsViewProps {
  initialUsage: UsageData;
}

export function SettingsView({ initialUsage }: SettingsViewProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const searchParams = useSearchParams();
  const router = useRouter();

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Delete Account State
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Subscription activated! Welcome to Pro 🎉");
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  const { data: usageData = initialUsage } = useQuery<UsageData>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
    initialData: initialUsage,
    enabled: !!session,
  });

  const isPro = usageData?.isPro ?? false;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || "Failed to update password");
    } else {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (res.ok) {
        toast.success("Your account and telemetry records have been removed.");
        await authClient.signOut().catch(() => undefined);
        window.location.href = "/";
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete account");
      }
    } catch {
      toast.error("An error occurred during account deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-[#fcfdfe] min-h-screen w-full flex flex-col flex-1">
      <DashboardHeader
        title="Account Settings"
        description="Manage your user profile, security credentials, and authentication."
      />

      <main className="flex-1 space-y-6 p-8 pt-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Profile Card */}
          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none">
            <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a] flex items-center gap-2">
                <User className="h-4 w-4 text-[#0f77ff]" /> Account Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[#f5f3ff]/40 border border-[#e1e9f0]">
                <div className="h-12 w-12 rounded-xl bg-[#f5f3ff] border border-[#e1e9f0] flex items-center justify-center text-[#091135] font-bold text-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="space-y-0.5">
                  <p className="font-semibold text-sm text-[#091135]">{user?.name || "Member"}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#36394a]">
                    <Mail className="h-3.5 w-3.5 text-[#8e9bb0]" />
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs pt-1">
                <div className="flex items-center justify-between py-1 border-b border-[#e1e9f0]/60">
                  <span className="text-[#36394a]">Security Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#36394a]">Member Since</span>
                  <span className="font-mono text-[#091135]">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Link Card */}
          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none">
            <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#0f77ff]" /> Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[#e1e9f0] bg-[#f5f3ff]/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base capitalize text-[#091135]">{usageData?.plan || "Explorer"}</p>
                    {usageData?.isPro && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#0f77ff] text-white">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#36394a]">
                    {usageData?.usage} of {usageData?.limit} monthly compiled invoices used
                  </p>
                </div>
                <Zap className="h-5 w-5 text-[#0f77ff]" />
              </div>
              <Button asChild variant="outline" className="w-full border-[#e1e9f0] text-xs h-9 font-medium text-[#091135] hover:bg-[#f5f3ff]">
                <Link href="/dashboard/subscription" className="flex items-center justify-center gap-1.5">
                  Manage Plan & Quotas
                  <ExternalLink className="h-3.5 w-3.5 text-[#8e9bb0]" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="rounded-xl border border-[#e1e9f0] bg-white shadow-none">
            <CardHeader className="border-b border-[#e1e9f0] px-6 py-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#36394a] flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-[#0f77ff]" /> Security & Password
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password" className="text-xs font-semibold text-[#091135]">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-xs font-semibold text-[#091135]">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                    placeholder="At least 8 characters"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs font-semibold text-[#091135]">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-[#e1e9f0] focus-visible:ring-[#0f77ff] text-xs h-9 bg-white"
                    placeholder="Repeat new password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#127ee3] hover:bg-[#0f77ff] text-white text-xs font-medium h-9 shadow-sm rounded-lg mt-2"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  ) : null}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="rounded-xl border border-red-200/80 bg-red-50/20 shadow-none">
            <CardHeader className="border-b border-red-200/60 px-6 py-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" /> Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-[#36394a] leading-relaxed">
                Permanently eliminate your account, business credentials, and all recorded invoices. This action cannot be reversed.
              </p>
              {isPro && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <span className="font-semibold">Notice:</span> You have an active subscription. Please cancel your plan in the billing portal prior to deletion.
                </div>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs h-9">
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-[#e1e9f0] bg-white rounded-2xl p-6 shadow-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-base font-semibold text-[#091135]">
                      Confirm Permanent Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-[#36394a]">
                      This will permanently wipe your account and all associated telemetry, invoice documents, and customer databases.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="border-[#e1e9f0] text-xs h-9">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white hover:bg-red-700 text-xs h-9 px-4 font-medium"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                      ) : null}
                      Yes, Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
