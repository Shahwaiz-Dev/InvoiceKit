"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Zap,
  User,
  Loader2,
  Mail,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Trash2,
  UserPlus,
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
import { Progress } from "@/components/ui/progress";
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

export default function SettingsPage() {
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

  // Billing Cycle State
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      toast.success("Subscription activated! Welcome to Pro 🎉");
      window.history.replaceState({}, "", "/dashboard/settings");
    }
  }, [searchParams]);

  const { data: usageData } = useQuery<{
    usage: number;
    limit: number;
    isPro: boolean;
    plan?: string | null;
  }>({
    queryKey: ["usage"],
    queryFn: () => fetch("/api/usage").then((r) => r.json()),
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
      toast.error(error.message || "Failed to change password");
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
        toast.success("Your account and data have been permanently deleted.");
        // Best effort cleanup: the auth record may already be gone.
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
    <>
      <DashboardHeader
        title="Settings"
        description="Manage your account, security, and subscription preferences."
      />

      <main className="flex-1 space-y-6 p-8 pt-6 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Personal Account
              </CardTitle>
              <CardDescription>
                Your personal profile linked to this account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {user?.email}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Verification Status
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1"
                  >
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Account created</span>
                  <span>
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Link */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" /> Subscription Plan
              </CardTitle>
              <CardDescription>
                View your current plan and available upgrades.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="space-y-1">
                  <p className="font-semibold text-lg capitalize">{usageData?.plan || "Explorer"}</p>
                  <p className="text-xs text-muted-foreground">{usageData?.usage} / {usageData?.limit} invoices used this month</p>
                </div>
                {usageData?.isPro && <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />}
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/subscription">
                  View Subscription Details
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" /> Security
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 bg-destructive/[0.01]">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Danger Zone
              </CardTitle>
              <CardDescription>
                Permanent actions that cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deleting your account will permanently wipe all your invoices,
                business settings, and subscription data. This action is
                irreversible.
              </p>
              {isPro && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium">
                  <span className="font-bold">IMPORTANT:</span> You have an
                  active Pro subscription. Please cancel it in the customer
                  portal before deleting your account to avoid future charges.
                </div>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all
                      associated data from our servers. This action cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
