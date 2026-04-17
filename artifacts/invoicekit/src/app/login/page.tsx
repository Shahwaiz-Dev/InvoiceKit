"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: normalizedEmail,
        password,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Access your workspace"
      subtitle="Continue where you left off and send invoices by email directly."
      panelTitle="Rigorous invoicing. Zero noise."
      panelDescription="Your account unlocks one-click invoice emailing, saved profiles, and seamless data retention without breaking the clean aesthetic you value."
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerLinkHref="/register"
    >
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        <div className="space-y-2 group">
          <Label htmlFor="email" className="text-xs font-mono tracking-widest uppercase text-muted-foreground group-focus-within:text-foreground transition-colors">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-12 rounded-none border-0 border-b border-border/80 bg-transparent px-0 font-medium placeholder:font-normal focus-visible:border-primary focus-visible:ring-0 shadow-none transition-all"
          />
        </div>

        <div className="space-y-2 group">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-mono tracking-widest uppercase text-muted-foreground group-focus-within:text-foreground transition-colors">
              Password
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-12 rounded-none border-0 border-b border-border/80 bg-transparent px-0 font-medium placeholder:font-normal focus-visible:border-primary focus-visible:ring-0 shadow-none transition-all font-mono"
          />
        </div>

        <Button
          type="submit"
          className="mt-8 h-12 w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm transition-all"
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Authenticating" : "Sign In"}
        </Button>
      </motion.form>
    </AuthShell>
  );
}
