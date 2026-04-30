"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, LayoutDashboard, Settings, Shield, Sparkles, UserRound } from "lucide-react";

export function SiteHeader() {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portfolio", label: "Portfolio", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const linkBaseClasses =
    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-3 xl:justify-start">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                Portfolio Generator
              </p>
              <p className="text-sm text-slate-300">
                Premium AI portfolio workspace
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200 sm:flex xl:hidden">
            <Shield className="h-3.5 w-3.5" />
            Protected routes enabled
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${linkBaseClasses} ${isActive ? "border-cyan-400/40 bg-cyan-400/10 text-white shadow-lg shadow-cyan-950/20" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200 xl:flex">
            <Shield className="h-3.5 w-3.5" />
            Protected routes enabled
          </div>

          {!isLoaded || !isSignedIn ? (
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-4 text-sm font-medium text-slate-100 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-lg shadow-black/20">
              <span className="hidden text-xs font-medium text-slate-300 sm:inline">
                Signed in
              </span>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}