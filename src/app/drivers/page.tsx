import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Filter, SlidersHorizontal, CheckCircle2, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_DRIVERS = [
  { id: 1, name: "Mamadou N.", exp: "8 ans", rating: 4.9, trips: 342, price: "15K", lang: "FR, EN, WO", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop" },
  { id: 2, name: "Cheikh T.", exp: "12 ans", rating: 5.0, trips: 890, price: "20K", lang: "FR, EN", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
  { id: 3, name: "Ibrahima S.", exp: "5 ans", rating: 4.8, trips: 156, price: "12K", lang: "FR, WO", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Abdoulaye D.", exp: "15 ans", rating: 5.0, trips: 1205, price: "25K", lang: "FR, EN, AR", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" },
];

export default function DriversPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0 pt-6">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
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
              {["Français", "Anglais", "Arabe", "Wolof"].map(lang => (
                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-blue-500 transition-colors flex items-center justify-center"></div>
                  <span className="text-zinc-300 group-hover:text-white transition-colors">{lang}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Chauffeurs Professionnels</h1>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 rounded-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Trier par: Note globale
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {MOCK_DRIVERS.map((driver) => (
              <Card key={driver.id} className="glass-card overflow-hidden border-zinc-800/50 hover:border-zinc-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-2 border-zinc-800">
                      <Image src={driver.img} alt={driver.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            {driver.name} <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-white">{driver.rating}</span>
                            <span className="text-zinc-500 text-sm">({driver.trips} missions)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-400">{driver.price}</p>
                          <p className="text-[10px] text-zinc-500 uppercase">FCFA / jour</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800/50">
                          <span className="text-zinc-500 text-xs block mb-1">Expérience</span>
                          <span className="font-semibold text-zinc-200">{driver.exp}</span>
                        </div>
                        <div className="bg-zinc-900/50 rounded-lg p-2 border border-zinc-800/50">
                          <span className="text-zinc-500 text-xs block mb-1">Langues</span>
                          <span className="font-semibold text-zinc-200">{driver.lang}</span>
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
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
