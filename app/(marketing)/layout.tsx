'use client';

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_40%,#0f172a_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
      
      <div className="relative flex min-h-screen flex-col">
        {/* Marketing Navbar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            {/* Logo/Site Name */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                  Portfolio Generator
                </p>
              </div>
            </Link>

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-400/20 bg-white/5 px-4 text-sm font-medium text-slate-100 shadow-lg shadow-cyan-950/20 transition hover:border-cyan-300/40 hover:bg-white/10 hover:text-white">
                  Login
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 shadow-lg shadow-black/20">
                <span className="hidden text-xs font-medium text-slate-300 sm:inline">
                  Signed in
                </span>
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
