'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { ArrowRight, Clock4, FolderKanban, Layers3, Sparkles } from 'lucide-react';

type RecentPortfolio = {
  id: string;
  title: string;
  role: string;
  updatedAt: string;
  status: 'Published' | 'Draft';
};

const recentPortfolios: RecentPortfolio[] = [
  {
    id: 'p-001',
    title: 'Senior Frontend Portfolio',
    role: 'Frontend Engineer',
    updatedAt: '2 hours ago',
    status: 'Published',
  },
  {
    id: 'p-002',
    title: 'Product Designer Showcase',
    role: 'Product Designer',
    updatedAt: 'Yesterday',
    status: 'Draft',
  },
  {
    id: 'p-003',
    title: 'Full-Stack Developer Deck',
    role: 'Full-Stack Developer',
    updatedAt: '3 days ago',
    status: 'Published',
  },
  {
    id: 'p-004',
    title: 'Data Engineer Portfolio',
    role: 'Data Engineer',
    updatedAt: 'Last week',
    status: 'Draft',
  },
];

export default function DashboardOverview() {
  const { isLoaded, user } = useUser();

  const displayName = useMemo(() => {
    if (!user) {
      return 'Creator';
    }

    return user.firstName || user.fullName || 'Creator';
  }, [user]);

  if (!isLoaded) {
    return (
      <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/5 lg:col-span-2" />
          <div className="h-44 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="h-52 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          <div className="h-52 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
            Workspace overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Welcome back, {displayName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Your portfolio workspace is ready. Continue refining your projects, polish your bio, and publish your best work.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Recent edits</p>
              <p className="mt-2 text-2xl font-semibold text-white">12</p>
            </div>
            <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-violet-200/80">Published</p>
              <p className="mt-2 text-2xl font-semibold text-white">2</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">Drafts</p>
              <p className="mt-2 text-2xl font-semibold text-white">2</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:border-cyan-300/60 hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-cyan-950/60 active:scale-95"
          >
            <Sparkles className="h-4.5 w-4.5" />
            Edit Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Next action</p>
              <p className="text-lg font-semibold text-white">Polish featured project</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Add one measurable outcome to your first project card to increase recruiter impact.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">
              Recent portfolios
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Your latest builds</h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 sm:flex">
            <Layers3 className="h-4 w-4" />
            Dummy data for now
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {recentPortfolios.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.role}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    item.status === 'Published'
                      ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200'
                      : 'border-amber-300/30 bg-amber-400/10 text-amber-100'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-5 text-xs text-slate-400">
                <div className="inline-flex items-center gap-1.5">
                  <Clock4 className="h-3.5 w-3.5" />
                  Updated {item.updatedAt}
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5" />
                  {item.id}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
