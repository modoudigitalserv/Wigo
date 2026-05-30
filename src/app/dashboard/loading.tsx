export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-zinc-800/60 rounded-xl animate-pulse"></div>
          <div className="h-4 w-96 bg-zinc-800/40 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#121217] border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 animate-pulse"></div>
              <div className="h-3 w-24 bg-zinc-800/60 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-zinc-800/80 rounded-xl animate-pulse mt-2"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#121217] border border-zinc-800/60 rounded-2xl p-6 h-96">
            <div className="h-6 w-48 bg-zinc-800/60 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-full bg-zinc-900/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-[#121217] border border-zinc-800/60 rounded-2xl p-6 h-96">
            <div className="h-6 w-32 bg-zinc-800/60 rounded animate-pulse mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center" >
                  <div className="h-4 w-20 bg-zinc-800/60 rounded animate-pulse"></div>
                  <div className="h-4 w-10 bg-zinc-800/80 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
