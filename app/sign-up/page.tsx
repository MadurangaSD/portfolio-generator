"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
                Create account
              </p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Join the portfolio builder
              </h1>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Create an account to save your portfolio drafts, revisit AI-generated content, and manage your public portfolio experience.
          </p>

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

        <section className="flex items-center justify-center rounded-4xl border border-cyan-400/15 bg-slate-950/50 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        </section>
      </div>
    </main>
  );
}