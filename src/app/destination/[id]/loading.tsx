import { Loader } from "lucide-react";

export default function DestinationDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center pt-24 pb-16 px-4">
      <div className="text-center space-y-4">
        <Loader className="animate-spin text-brand-500 mx-auto" size={48} />
        <p className="text-slate-400 text-lg font-medium animate-pulse">Loading destination details...</p>
      </div>
    </div>
  );
}
