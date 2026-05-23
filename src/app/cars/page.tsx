import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_CARS = [
  { id: 1, name: "BMW Série 5 M-Sport", type: "Berline", price: "85K", rating: 4.9, img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, name: "Range Rover Sport", type: "SUV", price: "120K", rating: 4.8, img: "https://images.unsplash.com/photo-1563720225384-9c0f60965e88?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, name: "Mercedes Classe S", type: "Luxe", price: "150K", rating: 5.0, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop" },
  { id: 4, name: "Audi RS6 Avant", type: "Sport", price: "110K", rating: 4.9, img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" },
  { id: 5, name: "Porsche 911 Carrera", type: "Sport", price: "200K", rating: 5.0, img: "https://images.unsplash.com/photo-1503376712341-ea1c9b311756?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, name: "Tesla Model S Plaid", type: "Électrique", price: "130K", rating: 4.7, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop" },
];

export default function CarsPage() {
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
              <Input placeholder="Modèle, marque..." className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Catégorie</h3>
            <div className="space-y-2">
              {["SUV", "Berline", "Luxe", "Sport", "Électrique"].map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 group-hover:border-blue-500 transition-colors flex items-center justify-center"></div>
                  <span className="text-zinc-300 group-hover:text-white transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-zinc-400 uppercase text-xs tracking-wider">Prix Max (FCFA/Jour)</h3>
            <Input type="range" className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>0</span>
              <span>300K+</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Tous les véhicules</h1>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 rounded-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Trier par: Recommandé
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CARS.map((car) => (
              <Link href={`/cars/${car.id}`} key={car.id}>
                <Card className="glass-card overflow-hidden group cursor-pointer border-zinc-800/50 h-full">
                  <div className="relative h-48 overflow-hidden rounded-t-3xl bg-zinc-900">
                    <Image
                      src={car.img}
                      alt={car.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-white">{car.rating}</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{car.name}</h3>
                        <p className="text-sm text-zinc-400">{car.type} • Auto</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-end">
                      <div className="text-left">
                        <p className="text-xl font-bold text-white">{car.price}</p>
                        <p className="text-xs text-zinc-500">FCFA / jour</p>
                      </div>
                      <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full font-semibold">
                        Réserver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>

      </div>
    </div>
  );
}
