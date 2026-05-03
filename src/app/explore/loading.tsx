import { PackageGridSkeleton } from "@/components/ui/Skeleton";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-64 bg-gradient-to-r from-brand-600/20 to-accent-500/20 rounded-3xl animate-pulse" />
        <div className="h-40 bg-slate-900 rounded-2xl animate-pulse" />
        <PackageGridSkeleton count={6} />
      </div>
    </div>
  );
}
