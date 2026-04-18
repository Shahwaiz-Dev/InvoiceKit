"use client";

import React, { useEffect, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";
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

  const { data: usageData, isLoading: usageLoading } = useQuery<{
    usage: number;
    limit: number;
    isPro: boolean;
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

          {/* Billing Summary */}
          <Card className="md:col-span-2 overflow-hidden border-2 border-primary/5">
            <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-1">
                    <CreditCard className="h-4 w-4" /> Subscription Tiers
                  </CardTitle>
                  <CardDescription>
                    Choose the perfect plan for your business needs.
                  </CardDescription>
                </div>
                <div className="flex items-center bg-white border border-border p-1 rounded-full shadow-sm self-start md:self-center">
                  <button 
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${billingCycle === "monthly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${billingCycle === "yearly" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Yearly
                    <Badge variant="outline" className="h-4 px-1 bg-emerald-50 text-[10px] text-emerald-700 border-emerald-200">Save 20%</Badge>
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x border-b border-border/50">
                {/* Explorer Plan */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Badge variant="outline" className="uppercase tracking-widest text-[9px] font-bold">Free</Badge>
                    <h3 className="text-xl font-bold">Explorer</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">$0</span>
                      <span className="text-sm text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground min-h-[140px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      1 Invoice per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Basic templates
                    </li>
                    <li className="flex items-center gap-2 opacity-50">
                       <ShieldCheck className="h-4 w-4" />
                       Standard Support
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" disabled={!isPro}>
                    {isPro ? "Downgrade" : "Current Plan"}
                  </Button>
                </div>

                {/* Momentum Plan */}
                <div className={`p-8 space-y-6 bg-primary/[0.02] relative ${user?.subscriptionPlan === 'momentum' ? 'ring-2 ring-primary ring-inset' : ''}`}>
                  {user?.subscriptionPlan === 'momentum' && (
                    <div className="absolute top-0 right-0 p-2">
                      <Badge className="bg-primary text-[10px] uppercase">Current</Badge>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-[9px] font-bold uppercase tracking-widest">Growth</Badge>
                      <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold">Momentum</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">
                        ${billingCycle === "monthly" ? "5" : "50"}
                      </span>
                      <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground min-h-[140px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      20 Invoices per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      All premium templates
                    </li>
                    <li className="flex items-center gap-2 font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Advanced Analytics
                    </li>
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full font-bold ${user?.subscriptionPlan === 'momentum' ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`}
                    variant={user?.subscriptionPlan === 'momentum' ? "ghost" : "default"}
                  >
                    {user?.subscriptionPlan === 'momentum' ? (
                       <a href="/api/customer-portal">Manage Billing</a>
                    ) : (
                       <a href={`/api/checkout?productId=${billingCycle === 'monthly' ? (process.env.NEXT_PUBLIC_POLAR_MOMENTUM_MONTHLY_ID || 'fd50bcbe-fffb-46a1-8ff2-c755e8238b6f') : (process.env.NEXT_PUBLIC_POLAR_MOMENTUM_YEARLY_ID || '')}`}>
                        {isPro && user?.subscriptionPlan !== 'momentum' ? 'Switch to Momentum' : 'Upgrade Now'}
                       </a>
                    )}
                  </Button>
                </div>

                {/* Authority Plan */}
                <div className={`p-8 space-y-6 relative ${user?.subscriptionPlan === 'authority' ? 'ring-2 ring-emerald-500 ring-inset' : ''}`}>
                  {user?.subscriptionPlan === 'authority' && (
                    <div className="absolute top-0 right-0 p-2">
                      <Badge className="bg-emerald-500 text-[10px] uppercase">Current</Badge>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 text-[9px] font-bold uppercase tracking-widest">Enterprise</Badge>
                    <h3 className="text-xl font-bold">Authority</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">
                        ${billingCycle === "monthly" ? "20" : "200"}
                      </span>
                      <span className="text-sm text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground min-h-[140px]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 font-bold" />
                      200 Invoices per month
                    </li>
                    <li className="flex items-center gap-2 font-bold text-foreground">
                      <UserPlus className="h-4 w-4 text-emerald-600" />
                      Customer Management
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Custom Branding
                    </li>
                    <li className="flex items-center gap-2 italic">
                       <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                       Priority Support
                    </li>
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full font-bold ${user?.subscriptionPlan === 'authority' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-900 hover:bg-slate-800'}`}
                    variant={user?.subscriptionPlan === 'authority' ? "ghost" : "default"}
                  >
                    {user?.subscriptionPlan === 'authority' ? (
                       <a href="/api/customer-portal">Manage Billing</a>
                    ) : (
                       <a href={`/api/checkout?productId=${billingCycle === 'monthly' ? (process.env.NEXT_PUBLIC_POLAR_AUTHORITY_MONTHLY_ID || '') : (process.env.NEXT_PUBLIC_POLAR_AUTHORITY_YEARLY_ID || '')}`}>
                        Upgrade to Authority
                       </a>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-muted/20 border-t border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">Current Usage</p>
                        <p className="text-sm font-semibold">{usageData?.usage} / {usageData?.limit} invoices</p>
                    </div>
                    <div className="flex-1 min-w-[120px]">
                        <Progress value={usageData ? (usageData.usage / usageData.limit) * 100 : 0} className="h-2" />
                    </div>
                  </div>
                  {isPro && (
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">
                        Renews {new Date(user?.subscriptionCurrentPeriodEnd).toLocaleDateString(undefined, { dateStyle: 'long' })}
                      </p>
                  )}
              </div>
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
