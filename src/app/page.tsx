import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Search, Star, ShieldCheck, CarFront, UserRound, ArrowRight } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/server";

const PLACEHOLDER_CAR = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

const MOCK_FEATURED = [
  { id: "1", brand: "BMW", model: "Série 5 M-Sport", fuel: "essence", transmission: "automatique", price_day: 85000, rating_average: 4.9, car_images: [] },
  { id: "2", brand: "Range Rover", model: "Sport", fuel: "diesel", transmission: "automatique", price_day: 120000, rating_average: 4.8, car_images: [] },
  { id: "3", brand: "Mercedes", model: "Classe S", fuel: "essence", transmission: "automatique", price_day: 150000, rating_average: 5.0, car_images: [] },
];

export default async function Home() {
  const supabase = await createClient();

  // Fetch 3 top-rated cars
  const { data: dbCars } = await supabase
    .from("cars")
    .select("*, car_images(*)")
    .eq("status", "disponible")
    .order("rating_average", { ascending: false })
    .limit(3);

  const featuredCars = dbCars && dbCars.length > 0 ? dbCars : MOCK_FEATURED;

  // Fetch platform stats
  const [{ count: totalCars }, { count: totalDrivers }] = await Promise.all([
    supabase.from("cars").select("*", { count: "exact", head: true }),
    supabase.from("drivers").select("*", { count: "exact", head: true }).eq("is_verified", true),
  ]);

  const stats = [
    { label: "Véhicules", value: totalCars ?? "500+", icon: CarFront },
    { label: "Chauffeurs vérifiés", value: totalDrivers ?? "200+", icon: UserRound },
    { label: "Villes couvertes", value: "12", icon: MapPin },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop"
            alt="Luxury Car"
            fill
            className="object-cover object-center opacity-50"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center mt-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-blue-400 mb-6 border-blue-500/20">
            <ShieldCheck className="w-4 h-4" /> Plateforme n°1 au Sénégal
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            L&apos;Excellence <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              en Mouvement
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Louez des véhicules d&apos;exception ou réservez un chauffeur privé professionnel en quelques clics.
          </p>

          {/* Floating Search Bar */}
          <div className="max-w-4xl mx-auto glass rounded-full p-2 flex flex-col md:flex-row items-center gap-2 md:gap-4 backdrop-blur-2xl bg-black/50 border-white/10 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lieu</p>
                <input type="text" placeholder="Dakar, Sénégal" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dates</p>
                <input type="text" placeholder="Ajouter des dates" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium" />
              </div>
            </div>

            <Link href="/cars" className="w-full md:w-auto m-1">
              <Button size="lg" className="w-full h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg shadow-blue-600/20">
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-zinc-800 bg-zinc-950/80 backdrop-blur-xl py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Véhicules Populaires</h2>
            <p className="text-zinc-500 mt-1">Les meilleures voitures sélectionnées pour vous</p>
          </div>
          <Link href="/cars">
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white rounded-full hidden md:flex">
              Voir tout <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => {
            const primaryImg = (car as any).car_images?.find((img: any) => img.is_primary)?.image_url || PLACEHOLDER_CAR;
            const name = `${(car as any).brand} ${(car as any).model}`;
            const price = Math.round((car as any).price_day / 1000);
            const rating = (car as any).rating_average || 0;

            return (
              <Link href={`/cars/${car.id}`} key={car.id}>
                <Card className="glass-card overflow-hidden group cursor-pointer border-zinc-800/50">
                  <div className="relative h-64 overflow-hidden rounded-t-3xl bg-zinc-900">
                    <Image
                      src={primaryImg}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      unoptimized
                    />
                    {rating > 0 && (
                      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{name}</h3>
                        <p className="text-sm text-zinc-400 capitalize">{(car as any).transmission} • {(car as any).fuel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{price}K</p>
                        <p className="text-xs text-zinc-500">FCFA / jour</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/cars">
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:text-white rounded-full">
              Voir tous les véhicules <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Drivers CTA Section */}
      <section className="container mx-auto px-4 pb-20 max-w-7xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 border-zinc-800/50 bg-gradient-to-r from-blue-950/30 to-indigo-950/20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Besoin d&apos;un chauffeur privé ?</h2>
            <p className="text-zinc-400 max-w-lg">Réservez un chauffeur professionnel certifié, disponible 24h/24 dans toutes les grandes villes du Sénégal.</p>
          </div>
          <Link href="/drivers" className="shrink-0">
            <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20">
              <UserRound className="w-5 h-5 mr-2" /> Trouver un chauffeur
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

