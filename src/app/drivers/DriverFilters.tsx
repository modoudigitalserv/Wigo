"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DriverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLangChange = (lang: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentLangs = params.getAll("lang");
    
    if (checked) {
      if (!currentLangs.includes(lang)) {
        params.append("lang", lang);
      }
    } else {
      params.delete("lang");
      currentLangs.filter(l => l !== lang).forEach(l => params.append("lang", l));
    }
    
    router.push(`/drivers?${params.toString()}`);
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
          <Input placeholder="Nom, ville..." className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 rounded-xl" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Langues parlées</h3>
        <div className="space-y-2">
          {["Français", "Anglais", "Darija"].map(lang => {
            const isChecked = searchParams.getAll("lang").includes(lang);
            return (
              <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  checked={isChecked}
                  onChange={(e) => handleLangChange(lang, e.target.checked)}
                />
                <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-blue-500 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center [&>svg]:hidden peer-checked:[&>svg]:block">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-zinc-300 group-hover:text-white transition-colors">{lang}</span>
              </label>
            )
          })}
        </div>
      </div>
    </aside>
  );
}
