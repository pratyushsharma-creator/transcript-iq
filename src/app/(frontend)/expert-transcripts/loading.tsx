export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      {/* Page header */}
      <div className="relative border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-10 sm:py-14">
          <div className="h-2.5 w-28 rounded bg-[var(--surface-2)] mb-6" />
          <div className="h-9 w-64 rounded-lg bg-[var(--surface-2)] mb-3" />
          <div className="h-4 w-96 max-w-full rounded bg-[var(--surface-2)]" />
        </div>
      </div>
      {/* Main content */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:flex lg:flex-col gap-4 w-52 shrink-0 pt-2">
            {[80, 65, 72, 58, 70].map((w, i) => (
              <div key={i} className="h-3.5 rounded bg-[var(--surface-2)]" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* Card grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-[var(--surface-2)]" />
                  <div className="h-5 w-12 rounded-full bg-[var(--surface-2)]" />
                </div>
                <div className="h-5 w-full rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-3/4 rounded bg-[var(--surface-2)]" />
                <div className="h-4 w-1/2 rounded bg-[var(--surface-2)]" />
                <div className="mt-4 h-9 w-full rounded-lg bg-[var(--surface-2)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
