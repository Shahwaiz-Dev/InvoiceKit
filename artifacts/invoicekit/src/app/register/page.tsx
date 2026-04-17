"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!normalizedEmail) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        email: normalizedEmail,
        password,
        name: normalizedName,
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("An unexpected error occurred");
      setGoogleLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Initialization"
      title="Forge an account"
      subtitle="Establish your connection to enable email delivery and seamless data persistence."
      panelTitle="Build workflows. Not friction."
      panelDescription="Register once to unlock sophisticated features tailored for operators who value precision, speed, and uncompromising aesthetics."
      footerText="Already initialized?"
      footerLinkText="Sign in here"
      footerLinkHref="/login"
    >
      <motion.form
        onSubmit={handleRegister}
        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        <div className="space-y-2 group">
          <Label htmlFor="name" className="text-xs font-mono tracking-widest uppercase text-muted-foreground group-focus-within:text-foreground transition-colors">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="h-12 rounded-none border-0 border-b border-border/80 bg-transparent px-0 font-medium placeholder:font-normal focus-visible:border-primary focus-visible:ring-0 shadow-none transition-all"
          />
        </div>

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
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground/60">Min 8 chars</span>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="h-12 rounded-none border-0 border-b border-border/80 bg-transparent px-0 font-medium placeholder:font-normal focus-visible:border-primary focus-visible:ring-0 shadow-none transition-all font-mono"
          />
        </div>

        <Button
          type="submit"
          className="mt-8 h-12 w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm transition-all shadow-sm"
          disabled={loading || googleLoading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "Initializing" : "Create Account"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground font-mono tracking-widest uppercase">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="h-12 w-full rounded-md border-border/80 bg-transparent hover:bg-muted/50 font-medium text-sm transition-all text-foreground"
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle className="mr-2 h-5 w-5" />
          )}
          {googleLoading ? "Connecting..." : "Google"}
        </Button>
      </motion.form>
    </AuthShell>
  );
}
