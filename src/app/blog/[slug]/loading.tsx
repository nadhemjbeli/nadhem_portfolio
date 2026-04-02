export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-os-bg font-mono">
      <div className="border-b border-os-border/20 h-14" />
      <div className="max-w-4xl mx-auto px-6 pt-14 space-y-8">
        {/* Back */}
        <div className="h-4 w-48 bg-os-border/20 rounded animate-pulse" />
        {/* Title */}
        <div className="space-y-4">
          <div className="h-3 w-32 bg-os-border/20 rounded animate-pulse" />
          <div className="h-12 w-3/4 bg-os-border/20 rounded animate-pulse" />
          <div className="h-4 w-full bg-os-border/15 rounded animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 bg-neon-primary/10 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="space-y-4 pt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-os-border/15 rounded animate-pulse" style={{ width: `${70 + i * 5}%` }} />
          ))}
        </div>
        {/* Code block skeleton */}
        <div className="rounded-xl border border-os-border/20 overflow-hidden">
          <div className="h-9 bg-os-surface border-b border-os-border/20" />
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-3 bg-os-border/10 rounded animate-pulse" style={{ width: `${50 + i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
