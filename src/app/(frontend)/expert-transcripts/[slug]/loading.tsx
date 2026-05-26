export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Main content */}
          <div className="space-y-6">
            <div className="flex gap-2">
              {[60, 48, 56].map((w, i) => (
                <div key={i} className="h-5 rounded-full bg-[var(--surface-2)]" style={{ width: w }} />
              ))}
            </div>
            <div className="h-10 w-4/5 rounded-lg bg-[var(--surface-2)]" />
            <div className="h-6 w-2/3 rounded bg-[var(--surface-2)]" />
            <div className="space-y-2 pt-4">
              {[100, 95, 88, 92, 85].map((w, i) => (
                <div key={i} className="h-4 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          {/* Purchase panel */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 h-fit">
            <div className="h-8 w-24 rounded bg-[var(--surface-2)]" />
            <div className="h-12 w-full rounded-xl bg-[var(--surface-2)]" />
            <div className="h-10 w-full rounded-xl bg-[var(--surface-2)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
