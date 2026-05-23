"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CarFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFuelChange = (fuel: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentFuels = params.getAll("fuel");
    
    if (checked) {
      if (!currentFuels.includes(fuel)) {
        params.append("fuel", fuel);
      }
    } else {
      params.delete("fuel");
      currentFuels.filter(f => f !== fuel).forEach(f => params.append("fuel", f));
    }
    
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-500" />
        <h2 className="text-xl font-bold">Filtres</h2>
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Recherche</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input placeholder="Modèle, marque..." className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Carburant</h3>
        <div className="space-y-2">
          {["Essence", "Diesel", "Électrique", "Hybride"].map(cat => {
            const isChecked = searchParams.getAll("fuel").includes(cat);
            return (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={isChecked}
                  onChange={(e) => handleFuelChange(cat, e.target.checked)}
                />
                <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-blue-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center [&>svg]:hidden peer-checked:[&>svg]:block">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">{cat}</span>
              </label>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Prix Max (€/Jour)</h3>
        <Input type="range" className="w-full accent-blue-500" />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>0</span>
          <span>300K+</span>
        </div>
      </div>
    </aside>
  );
}
