"use client";

import { FileText, LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import { InvoiceBroLogo } from "./InvoiceBroLogo";
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

  const handleScrollRef = useRef(() => setScrolled(window.scrollY > 20));
  useEffect(() => {
    const handler = handleScrollRef.current;
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[64px] z-40 bg-white/95 backdrop-blur-sm transition-all duration-200 ${
        scrolled ? "border-b border-[#e1e9f0]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand Mark - InvoiceBro blue squircle icon + Midnight Ink wordmark */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <InvoiceBroLogo size="md" />
          </Link>

          <div className="hidden sm:inline-flex items-center ml-2 px-3 py-1 rounded-full bg-[#f5f3ff] text-[#091135] text-[12px] font-medium tracking-[0.004em] border border-[#e1e9f0]">
            {session ? "All Templates Unlocked" : "Free · Instant Export"}
          </div>
        </div>

        {/* Nav links & CTA */}
        <nav className="flex items-center gap-6">
          <Link
            href="/templates"
            className="hidden md:block text-sm font-medium text-[#36394a] hover:text-[#091135] transition-colors"
          >
            Templates
          </Link>
          <button
            onClick={() => scrollTo("how-it-works")}
            className="hidden md:block text-sm font-medium text-[#36394a] hover:text-[#091135] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("faq")}
            className="hidden md:block text-sm font-medium text-[#36394a] hover:text-[#091135] transition-colors"
          >
            FAQ
          </button>

          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-[#f5f3ff] animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#36394a] hover:text-[#091135] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-[#0f77ff]" />
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="w-9 h-9 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#091135] border border-[#e1e9f0] hover:border-[#0f77ff] transition-colors">
                    <UserIcon className="w-4 h-4 text-[#091135]" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl border border-[#e1e9f0] bg-white p-1.5 shadow-none">
                  <DropdownMenuLabel className="text-xs text-[#36394a]">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#e1e9f0]" />
                  <DropdownMenuItem className="text-sm font-semibold text-[#091135]">
                    {session.user.name}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-[#36394a]">
                    {session.user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#e1e9f0]" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="gap-2 text-sm text-[#091135] hover:bg-[#f5f3ff]">
                      <LayoutDashboard className="w-4 h-4 text-[#0f77ff]" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="gap-2 text-sm text-[#091135] hover:bg-[#f5f3ff]">
                      <Settings className="w-4 h-4 text-[#36394a]" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#e1e9f0]" />
                  <DropdownMenuItem
                    onClick={() => signOut().then(() => router.push("/"))}
                    className="text-red-600 focus:text-red-600 gap-2 hover:bg-red-50 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-[#36394a] hover:text-[#091135] px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={`/register?callbackUrl=${encodeURIComponent("/editor?template=clean")}`}
                className="inline-flex items-center justify-center px-4 py-2 bg-[#127ee3] text-white rounded-lg text-sm font-medium hover:bg-[#0f77ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f77ff] transition-all"
              >
                Create Account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
