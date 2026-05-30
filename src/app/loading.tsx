import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#070708] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-bold tracking-widest text-zinc-500 uppercase animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}
