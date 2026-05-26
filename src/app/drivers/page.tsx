import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Star, Filter, SlidersHorizontal, CheckCircle2, MessageSquare, MapPin, ChevronRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";
import DriverFilters from "./DriverFilters";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DriversPage(props: Props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("drivers")
    .select("*, profiles(full_name)")
    .eq("is_verified", true)
    .eq("is_available", true);

  if (searchParams.lang) {
    const langs = Array.isArray(searchParams.lang) ? searchParams.lang : [searchParams.lang];
    const dbLangs = langs.map(l => l === "Français" ? "FR" : l === "Anglais" ? "EN" : l === "Darija" ? "AR" : l);
    if (dbLangs.length > 0) {
      query = query.contains("languages", [dbLangs[0]]);
    }
  }
  
  if (searchParams.sort) {
    if (searchParams.sort === "Note") query = query.order("rating_average", { ascending: false });
    else if (searchParams.sort === "Tarif") query = query.order("daily_rate", { ascending: true });
    else if (searchParams.sort === "Expérience") query = query.order("experience_years", { ascending: false });
  } else {
    query = query.order("rating_average", { ascending: false });
  }

  const { data: dbDrivers } = await query;
  const driversToDisplay = dbDrivers || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#070708] text-zinc-100 font-sans">
      
      {/* Header Area */}
      <section className="pt-32 pb-10 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Chauffeurs <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Élite</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl">
              Nos chauffeurs privés sont rigoureusement sélectionnés pour vous offrir un service d'excellence, discret et professionnel.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#121217] border border-zinc-800/60 rounded-xl flex items-center px-4 py-2">
              <MapPin className="w-4 h-4 text-blue-500 mr-2" />
              <input type="text" placeholder="Paris, France" className="bg-transparent border-none outline-none text-sm text-white w-32 placeholder-zinc-500" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 px-6 font-bold shadow-lg shadow-blue-600/20">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters and List wrapper */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#121217] border border-zinc-800/60 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Filtres</h2>
                  <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                </div>
                <DriverFilters />
              </div>
            </div>
          </aside>

          {/* Drivers Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-zinc-500 font-medium">
                <span className="text-white font-bold">{driversToDisplay.length}</span> chauffeurs disponibles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {driversToDisplay.map((driver: any) => {
                const imgUrl = driver.photo_url || PLACEHOLDER_IMG;
                const name = driver.profiles?.full_name || "Chauffeur Wigo";
                const langs = driver.languages || ["FR", "EN"];
                
                return (
                  <Card key={driver.id} className="bg-[#121217] border border-zinc-800/60 overflow-hidden rounded-3xl group hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-800 shrink-0">
                            <Image 
                              src={imgUrl} 
                              alt={name} 
                              fill 
                              className="object-cover group-hover:scale-110 transition-transform duration-500" 
                              unoptimized
                            />
                            {driver.is_verified && (
                              <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#121217]">
                                <ShieldCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-white">{name}</h3>
                                <p className="text-xs text-blue-400 font-extrabold uppercase tracking-widest mt-0.5">{driver.experience_years} ans exp.</p>
                              </div>
                              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-white">{driver.rating_average || "N/A"}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              {langs.map((lang: string) => (
                                <span key={lang} className="px-2 py-1 rounded border border-zinc-800 bg-zinc-900/50 text-[10px] font-bold text-zinc-400 uppercase">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-0.5">Tarif journalier</p>
                            <p className="text-2xl font-black text-white">{driver.daily_rate}€</p>
                          </div>
                          <Link href="#">
                            <Button className="bg-white hover:bg-zinc-200 text-black rounded-xl font-bold h-10 px-6">
                              Réserver
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {driversToDisplay.length === 0 && (
              <div className="text-center py-20 bg-[#121217] border border-zinc-800/60 rounded-3xl">
                <ShieldCheck className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Aucun chauffeur trouvé</h3>
                <p className="text-zinc-500">Essayez de modifier vos critères de recherche.</p>
              </div>
            )}
            
            {driversToDisplay.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs">
                  Charger plus de profils
                </Button>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
