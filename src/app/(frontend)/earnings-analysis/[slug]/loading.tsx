export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-6">
            <div className="h-6 w-32 rounded-full bg-[var(--surface-2)]" />
            <div className="h-10 w-3/4 rounded-lg bg-[var(--surface-2)]" />
            <div className="h-5 w-48 rounded bg-[var(--surface-2)]" />
            <div className="space-y-2 pt-4">
              {[100, 93, 87, 95, 80].map((w, i) => (
                <div key={i} className="h-4 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
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
