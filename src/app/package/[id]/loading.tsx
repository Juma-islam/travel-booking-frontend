import { PackageDetailSkeleton } from "@/components/ui/Skeleton";

export default function PackageDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <PackageDetailSkeleton />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse" />
              ))}
              <div className="h-12 bg-brand-600/30 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
