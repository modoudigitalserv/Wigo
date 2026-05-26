import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShieldCheck, MapPin, CheckCircle2, ChevronLeft, Fuel, Settings2, Users, Snowflake, Calendar, ArrowRight, CarFront } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { notFound } from "next/navigation";
import { createBooking } from "./actions";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CarDetailPage(props: Props) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(*), companies(name, city)")
    .eq("id", id)
    .single();

  if (!car) {
    notFound();
  }

  const images = car.car_images || [];
  const primaryImg = images.find((img: any) => img.is_primary)?.image_url || PLACEHOLDER_IMG;
  const otherImgs = images.filter((img: any) => !img.is_primary).slice(0, 3);
  const company = (car as any).companies;

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("car_id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Vérifier la session pour la réservation
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen bg-[#070708] text-zinc-100 font-sans pb-20">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px]">
        <Image
          src={primaryImg}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070708]/80 via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 z-10">
          <Link href="/cars" className="flex items-center gap-2 text-sm font-bold text-white bg-zinc-950/50 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-900 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à la flotte
          </Link>
        </div>

        <div className="absolute bottom-10 left-0 w-full z-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 rounded-full uppercase mb-4 inline-block">
              Premium Select
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2">{car.brand} {car.model}</h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium mb-6">{car.year} • Immatriculé à {car.city}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <div>
                  <p className="text-lg font-bold text-white leading-none">{car.rating_average || "N/A"}</p>
                  <p className="text-[10px] uppercase text-zinc-500 tracking-wider">Note globale</p>
                </div>
              </div>
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-6 py-3 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-lg font-bold text-white leading-none">Loueur Vérifié</p>
                  <p className="text-[10px] uppercase text-zinc-500 tracking-wider">{company?.name || "Partenaire Wigo"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 max-w-7xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Gallery Thumbnail if any */}
          {otherImgs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Galerie</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {otherImgs.map((img: any, i: number) => (
                  <div key={i} className="relative w-48 h-32 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                    <Image src={img.image_url} alt="Gallery view" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs Grid */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Caractéristiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#121217] border border-zinc-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <Settings2 className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Transmission</span>
                <span className="font-bold text-white capitalize">{car.transmission}</span>
              </div>
              <div className="bg-[#121217] border border-zinc-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <Fuel className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Carburant</span>
                <span className="font-bold text-white capitalize">{car.fuel}</span>
              </div>
              <div className="bg-[#121217] border border-zinc-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <Users className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Places</span>
                <span className="font-bold text-white">{car.seats || 5}</span>
              </div>
              <div className="bg-[#121217] border border-zinc-800/60 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <Snowflake className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Climatisation</span>
                <span className="font-bold text-white">{car.has_ac ? "Oui" : "Non"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">À propos du véhicule</h3>
            <div className="bg-[#121217] border border-zinc-800/60 p-6 md:p-8 rounded-3xl">
              <p className="text-zinc-400 leading-relaxed">
                {car.description || `Profitez du confort exceptionnel de ce véhicule ${car.brand} ${car.model}. Parfaitement entretenu et doté de toutes les options nécessaires pour un voyage luxueux et sécurisé. Ce modèle ${car.year} vous offrira une expérience de conduite inoubliable.`}
              </p>
              
              <div className="mt-8 pt-8 border-t border-zinc-800/60 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-white">Nettoyage complet garanti</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-white">Carburant plein inclus</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-white">Assurance premium incluse</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-white">Annulation gratuite (48h)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews && reviews.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Avis Récents</h3>
              <div className="space-y-4">
                {reviews.map((rev: any) => (
                  <div key={rev.id} className="bg-[#121217] border border-zinc-800/60 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                          {(rev.profiles?.full_name || "U")[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{rev.profiles?.full_name || "Client Wigo"}</p>
                          <p className="text-xs text-zinc-500">{new Date(rev.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-white">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div className="sticky top-24">
            <Card className="bg-[#121217] border border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                   <CarFront className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <p className="text-blue-100 text-sm font-bold tracking-widest uppercase mb-2">Tarif de base</p>
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-5xl font-black text-white">{car.price_day}€</span>
                    <span className="text-blue-200">/ jour</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <form action={createBooking} className="space-y-6">
                  <input type="hidden" name="car_id" value={car.id} />
                  <input type="hidden" name="company_id" value={car.company_id} />
                  <input type="hidden" name="price_day" value={car.price_day} />

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Date de début</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input 
                          type="date" 
                          name="start_date" 
                          required 
                          className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Date de fin</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input 
                          type="date" 
                          name="end_date" 
                          required 
                          className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-800/60 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Caution véhicule</span>
                      <span className="font-bold text-white">{car.deposit_amount || 1500} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Franchise kilométrique</span>
                      <span className="font-bold text-white">250 km / jour</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-6">
                    {session ? (
                      <Button type="submit" className="w-full h-14 bg-white hover:bg-zinc-200 text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        Réserver ce véhicule
                      </Button>
                    ) : (
                      <Link href="/login">
                        <Button type="button" className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-600/20">
                          Connectez-vous pour réserver
                        </Button>
                      </Link>
                    )}
                    <p className="text-center text-xs text-zinc-500 mt-4">
                      Aucun montant ne sera débité pour le moment.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

      </section>
    </div>
  );
}
