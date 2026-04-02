export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-os-bg font-mono">
      <div className="border-b border-os-border/20 h-14" />
      <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16">
        {/* Hero skeleton */}
        <div className="space-y-4">
          <div className="h-3 w-64 bg-os-border/20 rounded animate-pulse" />
          <div className="h-14 w-80 bg-os-border/20 rounded animate-pulse" />
          <div className="h-3 w-48 bg-os-border/20 rounded animate-pulse" />
        </div>
        {/* Post skeletons */}
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="glass-panel border border-os-border/10 rounded-xl p-6 space-y-3">
              <div className="h-2.5 w-32 bg-os-border/20 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-os-border/20 rounded animate-pulse" />
              <div className="h-3 w-full bg-os-border/15 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-os-border/15 rounded animate-pulse" />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-4 w-16 bg-os-border/15 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-4 w-28 bg-neon-primary/10 rounded animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
