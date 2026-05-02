"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                Secure access
              </p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Sign in to your portfolio workspace
              </h1>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Resume your dashboard, edit your portfolio content, and access your saved AI-generated copy from the same premium interface.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm font-medium text-white">Protected workspace</p>
              <p className="mt-2 text-sm text-slate-400">
                Your routes stay locked behind Clerk while the home page remains public.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-sm font-medium text-white">Bento-style UI</p>
              <p className="mt-2 text-sm text-slate-400">
                The auth flow keeps the same dark glass treatment as the rest of the app.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[2rem] border border-cyan-400/15 bg-slate-950/50 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </section>
      </div>
    </main>
  );
}