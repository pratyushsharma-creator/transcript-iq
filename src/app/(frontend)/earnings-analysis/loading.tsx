export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)] animate-pulse">
      <div className="relative border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-10 sm:py-14">
          <div className="h-2.5 w-28 rounded bg-[var(--surface-2)] mb-6" />
          <div className="h-9 w-72 rounded-lg bg-[var(--surface-2)] mb-3" />
          <div className="h-4 w-80 max-w-full rounded bg-[var(--surface-2)]" />
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
              <div className="h-4 w-20 rounded-full bg-[var(--surface-2)]" />
              <div className="h-5 w-full rounded bg-[var(--surface-2)]" />
              <div className="h-4 w-3/4 rounded bg-[var(--surface-2)]" />
              <div className="mt-3 flex gap-2">
                <div className="h-9 flex-1 rounded-lg bg-[var(--surface-2)]" />
                <div className="h-9 flex-1 rounded-lg bg-[var(--surface-2)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
