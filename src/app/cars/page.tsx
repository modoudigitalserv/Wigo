import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Heart, ShieldCheck, Search, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

const MOCK_CARS = [
  { id: "1", brand: "Porsche", model: "Taycan Turbo S", fuel: "electrique", transmission: "automatique", price_day: 240, rating_average: 4.9, city: "Paris", distance: "12km", car_images: [] },
  { id: "2", brand: "Tesla", model: "Model S Plaid", fuel: "electrique", transmission: "automatique", price_day: 185, rating_average: 5.0, city: "Nice", distance: "5km", car_images: [] },
  { id: "3", brand: "BMW", model: "M8 Competition", fuel: "essence", transmission: "automatique", price_day: 310, rating_average: 4.8, city: "Cannes", distance: "22km", car_images: [] },
  { id: "4", brand: "Land Rover", model: "Defender", fuel: "diesel", transmission: "automatique", price_day: 195, rating_average: 4.9, city: "Courchevel", distance: "1km", car_images: [] },
  { id: "5", brand: "Mercedes", model: "Classe S", fuel: "essence", transmission: "automatique", price_day: 280, rating_average: 5.0, city: "Monaco", distance: "3km", car_images: [] },
  { id: "6", brand: "Audi", model: "e-tron GT", fuel: "electrique", transmission: "automatique", price_day: 215, rating_average: 4.7, city: "Lyon", distance: "8km", car_images: [] },
];

import CarFilters from "./CarFilters";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CarsPage(props: Props) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const { data: dbCars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("status", "disponible")
    .order("rating_average", { ascending: false });

  let cars = dbCars && dbCars.length > 0 ? dbCars : MOCK_CARS;

  // Apply filters
  const fuelFilters = Array.isArray(searchParams.fuel) ? searchParams.fuel : searchParams.fuel ? [searchParams.fuel] : [];
  if (fuelFilters.length > 0) {
    cars = cars.filter(c => fuelFilters.map(f => f.toLowerCase()).includes((c as any).fuel?.toLowerCase()));
  }

  const brandFilters = Array.isArray(searchParams.brand) ? searchParams.brand : searchParams.brand ? [searchParams.brand] : [];
  if (brandFilters.length > 0) {
    cars = cars.filter(c => brandFilters.includes((c as any).brand));
  }

  const transmissionFilter = searchParams.transmission as string | undefined;
  if (transmissionFilter) {
    cars = cars.filter(c => (c as any).transmission?.toLowerCase() === transmissionFilter.toLowerCase());
  }

  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : null;
  if (maxPrice) {
    cars = cars.filter(c => (c as any).price_day <= maxPrice);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pb-24 md:pb-0 pt-6">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-10">
        
        {/* Sidebar */}
        <CarFilters />

        {/* Main Content */}
        <main className="flex-1">
          {/* Title & Search Bar */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1">
              Explorez la{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Flotte</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Élite</span>
            </h1>

            {/* Search Bar */}
            <div className="flex items-center gap-2 mt-4 mb-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 flex-1 max-w-md">
                <MapPin className="w-4 h-4 text-blue-400" />
                <input
                  type="text"
                  placeholder="Paris, France"
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-full"
                />
                <div className="w-px h-5 bg-zinc-700" />
                <Calendar className="w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Date"
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 w-24"
                />
              </div>
              <button className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors shadow-lg shadow-blue-600/20">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            <p className="text-sm text-zinc-500 italic">{cars.length} véhicules disponibles pour votre prochain voyage.</p>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car) => {
              const primaryImg = (car as any).car_images?.find((img: any) => img.is_primary)?.image_url || PLACEHOLDER_IMG;
              const name = `${(car as any).brand} ${(car as any).model}`;
              const price = (car as any).price_day;
              const rating = (car as any).rating_average || 0;
              const city = (car as any).city || "—";
              const distance = (car as any).distance || "";

              return (
                <Card key={car.id} className="group overflow-hidden rounded-2xl bg-zinc-950/80 border border-zinc-800/60 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-zinc-900">
                    <Image
                      src={primaryImg}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    {/* Verified badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 backdrop-blur-sm">
                      <ShieldCheck className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Vérifié</span>
                    </div>
                    {/* Favorite */}
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
                      <Heart className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Content */}
                  <CardContent className="p-4">
                    {/* Name + Rating */}
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-bold text-white text-[15px] leading-tight">{name}</h3>
                      {rating > 0 && (
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-zinc-300">{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-zinc-500 mb-4">
                      <MapPin className="w-3 h-3" />
                      <span>{city}{distance ? ` • ${distance}` : ""}</span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-extrabold text-cyan-400">{price}€</p>
                        <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">par jour</p>
                      </div>
                      <Link href={`/cars/${car.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full border-zinc-700 text-zinc-300 hover:text-white hover:border-blue-500 text-xs px-4">
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-10 mb-10">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition-colors">
              Voir plus de véhicules <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">© 2024 Wigo Mobility. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            <Link href="#" className="hover:text-white transition-colors">Carrières</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
