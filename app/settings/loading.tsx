export default function SettingsLoading() {
  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-4xl border border-white/10 bg-white/5 lg:col-span-2" />
        <div className="h-64 animate-pulse rounded-4xl border border-white/10 bg-white/5" />
      </div>
      <div className="mt-6 h-[440px] animate-pulse rounded-4xl border border-white/10 bg-white/5" />
    </main>
  );
}
