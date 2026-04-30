"use client";

import { useMemo, useState } from "react";
import { useClerk, useUser, UserProfile } from "@clerk/nextjs";
import { AlertTriangle, Trash2, UserRound } from "lucide-react";

export default function SettingsPage() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const identity = useMemo(() => {
    if (!user) {
      return {
        name: "Unknown",
        email: "No email",
      };
    }

    return {
      name: user.fullName || user.firstName || "User",
      email: user.primaryEmailAddress?.emailAddress || "No email",
    };
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!user) {
      return;
    }

    const approved = window.confirm("Delete your Clerk account permanently? This cannot be undone.");
    if (!approved) {
      return;
    }

    setErrorMessage(null);
    setIsDeleting(true);

    try {
      await user.delete();
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete account.";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-4xl border border-white/10 bg-white/5 lg:col-span-2" />
          <div className="h-64 animate-pulse rounded-4xl border border-white/10 bg-white/5" />
        </div>
        <div className="mt-6 h-110 animate-pulse rounded-4xl border border-white/10 bg-white/5" />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
            Account settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            Manage your profile and security
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Keep your profile information current and manage account-level actions.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Display name</p>
              <p className="mt-2 text-lg font-semibold text-white">{identity.name}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Primary email</p>
              <p className="mt-2 text-lg font-semibold text-white">{identity.email}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-4xl border border-rose-300/20 bg-rose-500/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-300/25 bg-rose-400/10 text-rose-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">Danger zone</h2>
          <p className="mt-3 text-sm leading-6 text-rose-100/90">
            Deleting your account permanently removes profile access and cannot be undone.
          </p>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting account..." : "Delete Account"}
          </button>

          {errorMessage ? (
            <p className="mt-3 text-sm text-rose-100">{errorMessage}</p>
          ) : null}
        </aside>
      </section>

      <section className="mt-6 rounded-4xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-200">
            <UserRound className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Clerk profile details</p>
            <p className="text-sm text-slate-300">Manage account data directly from Clerk</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-2">
          <UserProfile routing="hash" />
        </div>
      </section>
    </main>
  );
}