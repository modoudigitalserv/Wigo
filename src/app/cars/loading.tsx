import { Search, MapPin, Calendar, ChevronDown } from "lucide-react";

export default function CarsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pb-24 md:pb-0 pt-28">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="h-6 w-32 bg-zinc-800/60 rounded animate-pulse mb-4"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-20 bg-zinc-800/60 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 w-full bg-zinc-900 rounded-xl animate-pulse"></div>
                <div className="h-8 w-full bg-zinc-900 rounded-xl animate-pulse"></div>
                <div className="h-8 w-full bg-zinc-900 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1">
          {/* Title & Search Bar Skeleton */}
          <div className="mb-8">
            <div className="h-12 w-64 bg-zinc-800/60 rounded-xl animate-pulse mb-2"></div>
            <div className="h-12 w-48 bg-zinc-800/60 rounded-xl animate-pulse mb-6"></div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 mt-4 mb-3">
              <div className="h-14 flex-1 max-w-md bg-zinc-900/80 rounded-full animate-pulse border border-zinc-800"></div>
              <div className="w-12 h-12 rounded-full bg-zinc-800 animate-pulse"></div>
            </div>

            <div className="h-4 w-40 bg-zinc-800/40 rounded animate-pulse"></div>
          </div>

          {/* Cars Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-zinc-950/80 border border-zinc-800/60">
                {/* Image Skeleton */}
                <div className="h-44 bg-zinc-900 animate-pulse"></div>

                {/* Content Skeleton */}
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-32 bg-zinc-800/60 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-zinc-800/60 rounded animate-pulse"></div>
                  </div>
                  
                  <div className="h-3 w-24 bg-zinc-800/40 rounded animate-pulse"></div>

                  <div className="flex justify-between items-end pt-2">
                    <div className="space-y-1">
                      <div className="h-6 w-16 bg-zinc-800/80 rounded animate-pulse"></div>
                      <div className="h-3 w-12 bg-zinc-800/40 rounded animate-pulse"></div>
                    </div>
                    <div className="h-8 w-20 bg-zinc-800/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
