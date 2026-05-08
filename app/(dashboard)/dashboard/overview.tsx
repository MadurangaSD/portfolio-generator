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
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-400/10 text-violet-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI Portfolio Builder</h2>
          <p className="mt-3 text-sm text-slate-400">
            Let AI craft compelling stories about your projects and expertise.
          </p>

          <Link href="/portfolio" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:border-violet-400/50 hover:bg-violet-400/20">
            Open Builder
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Portfolios</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {recentPortfolios.map((portfolio) => (
            <div
              key={portfolio.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{portfolio.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{portfolio.role}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  portfolio.status === 'Published'
                    ? 'border border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                    : 'border border-slate-400/30 bg-slate-400/10 text-slate-300'
                }`}>
                  {portfolio.status}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                <Clock4 className="h-3 w-3" />
                Updated {portfolio.updatedAt}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
