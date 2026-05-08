'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, Settings, Shield, Sparkles, UserRound } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/portfolio", label: "Portfolio", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const linkBaseClasses =
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(180deg,#020617_0%,#020617_40%,#0f172a_100%)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
      
      <div className="relative flex min-h-screen">
        {/* Dashboard Sidebar */}
        <aside className="sticky top-0 h-screen w-64 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl">
          <div className="flex h-full flex-col overflow-y-auto">
            {/* Logo */}
            <div className="border-b border-white/10 p-6">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                    Dashboard
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${linkBaseClasses} ${
                      isActive
                        ? "border border-cyan-400/40 bg-cyan-400/10 text-white shadow-lg shadow-cyan-950/20"
                        : "border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Protected Routes Badge */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200">
                <Shield className="h-3.5 w-3.5" />
                Protected
              </div>
            </div>

            {/* User Profile */}
            {isLoaded && isSignedIn && (
              <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  <span className="flex-1 truncate text-xs font-medium text-slate-300">
                    Profile
                  </span>
                  <UserButton />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
