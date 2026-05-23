import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Filter, SlidersHorizontal, CheckCircle2, MessageSquare } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/server";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop";

const MOCK_DRIVERS = [
  { id: "1", full_name: "Mamadou N.", experience_years: 8, rating_average: 4.9, total_missions: 342, daily_rate: 15000, languages: ["FR", "EN", "WO"], photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop", is_verified: true },
  { id: "2", full_name: "Cheikh T.", experience_years: 12, rating_average: 5.0, total_missions: 890, daily_rate: 20000, languages: ["FR", "EN"], photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop", is_verified: true },
  { id: "3", full_name: "Ibrahima S.", experience_years: 5, rating_average: 4.8, total_missions: 156, daily_rate: 12000, languages: ["FR", "WO"], photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop", is_verified: true },
  { id: "4", full_name: "Abdoulaye D.", experience_years: 15, rating_average: 5.0, total_missions: 1205, daily_rate: 25000, languages: ["FR", "EN", "AR"], photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop", is_verified: true },
];

import DriverFilters from "./DriverFilters";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DriversPage(props: Props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  let query = supabase
    .from("drivers")
    .select("*")
    .eq("is_verified", true)
    .eq("is_available", true);

  if (searchParams.lang) {
    const langs = Array.isArray(searchParams.lang) ? searchParams.lang : [searchParams.lang];
    // On convertit les valeurs du filtre UI vers celles en base (Français -> FR, Anglais -> EN, Darija -> AR/Darija)
    const dbLangs = langs.map(l => l === "Français" ? "FR" : l === "Anglais" ? "EN" : l === "Darija" ? "AR" : l);
    // Note: Supabase `.contains` nécessite que le tableau de langues corresponde.
    query = query.contains("languages", dbLangs);
  }

  const { data: dbDrivers } = await query.order("rating_average", { ascending: false });

  let drivers = dbDrivers && dbDrivers.length > 0 ? dbDrivers : MOCK_DRIVERS;

  if (searchParams.lang && (!dbDrivers || dbDrivers.length === 0)) {
    const langs = Array.isArray(searchParams.lang) ? searchParams.lang : [searchParams.lang];
    const dbLangs = langs.map(l => l === "Français" ? "FR" : l === "Anglais" ? "EN" : l === "Darija" ? "AR" : l);
    drivers = MOCK_DRIVERS.filter(d => dbLangs.every(l => d.languages.includes(l)));
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0 pt-6">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
        
        <DriverFilters />

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Chauffeurs Professionnels</h1>
              <p className="text-sm text-zinc-500 mt-1">{drivers.length} chauffeur{drivers.length > 1 ? "s" : ""} disponible{drivers.length > 1 ? "s" : ""}</p>
            </div>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 rounded-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Trier par: Note globale
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {drivers.map((driver) => {
              const photo = (driver as any).photo_url || PLACEHOLDER_IMG;
              const name = (driver as any).full_name;
              const exp = `${(driver as any).experience_years} ans`;
              const rating = (driver as any).rating_average || 0;
              const trips = (driver as any).total_missions || 0;
              const price = Math.round((driver as any).daily_rate / 1000);
              const langs = Array.isArray((driver as any).languages)
                ? (driver as any).languages.join(", ")
                : (driver as any).languages || "FR";

              return (
                <Card key={driver.id} className="glass-card overflow-hidden border-zinc-800/50 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-zinc-800">
                        <Image src={photo} alt={name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                              {name}
                              {(driver as any).is_verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              {rating > 0 && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                              {rating > 0 && <span className="font-bold text-white">{rating.toFixed(1)}</span>}
                              <span className="text-zinc-500 text-sm">({trips} missions)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-blue-400">{price}K</p>
                            <p className="text-[10px] text-zinc-500 uppercase">€ / jour</p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800/50">
                            <span className="text-zinc-500 text-xs block mb-1">Expérience</span>
                            <span className="font-semibold text-zinc-200">{exp}</span>
                          </div>
                          <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800/50">
                            <span className="text-zinc-500 text-xs block mb-1">Langues</span>
                            <span className="font-semibold text-zinc-200">{langs}</span>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <Button className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-full font-semibold">
                            Réserver
                          </Button>
                          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white rounded-full px-4">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

