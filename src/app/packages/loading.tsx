import { PackageGridSkeleton } from "@/components/ui/Skeleton";

export default function PackagesLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero skeleton */}
        <div className="h-40 bg-slate-900 rounded-3xl animate-pulse" />
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
          {/* Grid */}
          <PackageGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
