"use client";

import { FileText, LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Store handler in a ref so the exact same function reference is used for
  // both addEventListener and removeEventListener — avoids listener leaks.
  // { passive: true } lets the browser skip waiting for preventDefault(),
  // improving scroll performance. Rule: client-passive-event-listeners
  const handleScrollRef = useRef(() => setScrolled(window.scrollY > 80));
  useEffect(() => {
    const handler = handleScrollRef.current;
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[60px] z-40 bg-background/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_8px_rgba(0,0,0,0.03)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center text-primary">
            <FileText className="w-6 h-6" strokeWidth={2.5} />
            <span className="ml-2 font-semibold text-lg text-foreground tracking-tight">InvoiceKit</span>
          </Link>
          <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[11px] font-bold uppercase tracking-wider">
            Free · {session ? "Premium Features" : "No Login Required"}
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </button>

          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-sm font-medium">
                    {session.user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="gap-2">
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut().then(() => router.push("/"))}
                    className="text-destructive focus:text-destructive gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
