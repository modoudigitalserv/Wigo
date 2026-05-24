import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Star, Filter, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

const MOCK_CARS = [
  { id: "1", brand: "BMW", model: "Série 5 M-Sport", fuel: "essence", transmission: "automatique", price_day: 130, rating_average: 4.9, city: "Casablanca", car_images: [] },
  { id: "2", brand: "Range Rover", model: "Sport", fuel: "essence", transmission: "automatique", price_day: 180, rating_average: 4.8, city: "Casablanca", car_images: [] },
  { id: "3", brand: "Mercedes", model: "Classe S", fuel: "essence", transmission: "automatique", price_day: 230, rating_average: 5.0, city: "Casablanca", car_images: [] },
  { id: "4", brand: "Audi", model: "RS6 Avant", fuel: "essence", transmission: "automatique", price_day: 170, rating_average: 4.9, city: "Casablanca", car_images: [] },
  { id: "5", brand: "Porsche", model: "911 Carrera", fuel: "essence", transmission: "automatique", price_day: 300, rating_average: 5.0, city: "Casablanca", car_images: [] },
  { id: "6", brand: "Tesla", model: "Model S Plaid", fuel: "electrique", transmission: "automatique", price_day: 200, rating_average: 4.7, city: "Casablanca", car_images: [] },
  { id: "7", brand: "BMW", model: "X5 xDrive40d", fuel: "diesel", transmission: "automatique", price_day: 150, rating_average: 4.6, city: "Marrakech", car_images: [] },
  { id: "8", brand: "Tesla", model: "Model 3", fuel: "electrique", transmission: "automatique", price_day: 120, rating_average: 4.8, city: "Rabat", car_images: [] },
];

import CarFilters from "./CarFilters";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CarsPage(props: Props) {
  const searchParams = await props.searchParams;
  // Fetch from Supabase, fallback to mock data if empty
  const supabase = await createClient();
  let query = supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("status", "disponible");

  if (searchParams.fuel) {
    const fuels = Array.isArray(searchParams.fuel) ? searchParams.fuel : [searchParams.fuel];
    const dbFuels = fuels.map(f => f.toLowerCase());
    query = query.in("fuel", dbFuels);
  }

  if (searchParams.maxPrice) {
    const maxPrice = parseFloat(searchParams.maxPrice as string);
    query = query.lte("price_day", maxPrice);
  }

  const { data: dbCars } = await query.order("rating_average", { ascending: false });

  let cars = dbCars && dbCars.length > 0 ? dbCars : MOCK_CARS;

  if (searchParams.fuel && (!dbCars || dbCars.length === 0)) {
    const fuels = Array.isArray(searchParams.fuel) ? searchParams.fuel : [searchParams.fuel];
    const dbFuels = fuels.map(f => f.toLowerCase());
    cars = MOCK_CARS.filter(c => dbFuels.includes(c.fuel.toLowerCase()));
  }

  if (searchParams.maxPrice && (!dbCars || dbCars.length === 0)) {
    const maxPrice = parseFloat(searchParams.maxPrice as string);
    cars = cars.filter(c => c.price_day <= maxPrice);
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0 pt-6">
      <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row gap-8">
        
        <CarFilters />

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tous les véhicules</h1>
              <p className="text-sm text-zinc-500 mt-1">{cars.length} véhicule{cars.length > 1 ? "s" : ""} disponible{cars.length > 1 ? "s" : ""}</p>
            </div>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 rounded-full">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Trier par: Recommandé
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const primaryImg = (car as any).car_images?.find((img: any) => img.is_primary)?.image_url || PLACEHOLDER_IMG;
              const name = `${(car as any).brand} ${(car as any).model}`;
              const price = (car as any).price_day;
              const rating = (car as any).rating_average || 0;

              return (
                <Link href={`/cars/${car.id}`} key={car.id}>
                  <Card className="glass-card overflow-hidden group cursor-pointer border-zinc-800/50 h-full">
                    <div className="relative h-48 overflow-hidden rounded-t-3xl bg-zinc-900">
                      <Image
                        src={primaryImg}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        unoptimized={primaryImg === PLACEHOLDER_IMG}
                      />
                      {rating > 0 && (
                        <div className="absolute top-3 right-3 glass px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{name}</h3>
                          <p className="text-sm text-zinc-400 capitalize">{(car as any).transmission} • {(car as any).fuel}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-end">
                        <div className="text-left">
                          <p className="text-xl font-bold text-white">{price} €</p>
                          <p className="text-xs text-zinc-500">/ jour</p>
                        </div>
                        <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-full font-semibold">
                          Réserver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>

      </div>
    </div>
  );
}

