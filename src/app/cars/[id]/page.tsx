import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShieldCheck, MapPin, CheckCircle2, ChevronLeft, Fuel, Settings2, Users, Snowflake } from "lucide-react";
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
  const otherImgs = images.filter((img: any) => !img.is_primary).slice(0, 2);
  const company = (car as any).companies;

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("car_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  const reviewCount = reviews?.length || 0;

  const specs = [
    { label: "Transmission", value: car.transmission || "Automatique", icon: Settings2 },
    { label: "Carburant", value: car.fuel || "Essence", icon: Fuel },
    { label: "Places", value: `${car.seats || 5} places`, icon: Users },
    { label: "Climatisation", value: car.air_conditioning !== false ? "Inclus" : "Non", icon: Snowflake },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-10 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/cars" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour aux véhicules
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 h-[40vh] md:h-[60vh]">
          <div className="relative h-full w-full rounded-l-3xl overflow-hidden bg-zinc-900">
            <Image src={primaryImg} alt={`${car.brand} ${car.model}`} fill className="object-cover" unoptimized />
          </div>
          <div className="grid grid-rows-2 gap-4 h-full">
            <div className="relative h-full w-full rounded-tr-3xl overflow-hidden bg-zinc-900">
              <Image
                src={otherImgs[0]?.image_url || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"}
                alt="Vue intérieure" fill className="object-cover" unoptimized
              />
            </div>
            <div className="relative h-full w-full rounded-br-3xl overflow-hidden bg-zinc-900">
              <Image
                src={otherImgs[1]?.image_url || "https://images.unsplash.com/photo-1503376712341-ea1c9b311756?q=80&w=2070&auto=format&fit=crop"}
                alt="Vue détail" fill className="object-cover" unoptimized
              />
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                  <span className="font-bold text-lg border-2 border-white px-4 py-2 rounded-full">
                    Voir les {images.length} photos
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Info */}
          <div className="flex-1 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider capitalize">{car.fuel}</span>
                {car.rating_average > 0 && (
                  <span className="flex items-center text-yellow-500 text-sm font-bold">
                    <Star className="w-4 h-4 mr-1 fill-yellow-500" /> {car.rating_average.toFixed(1)} ({reviewCount} avis)
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{car.brand} {car.model}</h1>
              <p className="text-zinc-400 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> {car.city}{company ? ` — ${company.name}` : ""}
              </p>
            </div>

            {/* Specs */}
            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {specs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                      <Icon className="w-6 h-6 text-blue-400 mb-2" />
                      <span className="text-zinc-500 text-xs uppercase tracking-wider">{item.label}</span>
                      <span className="font-semibold capitalize mt-1">{item.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-zinc-400 leading-relaxed">
                {car.description || `Louez cette magnifique ${car.brand} ${car.model} pour vos déplacements. Alliant confort, sportivité et technologies de pointe, elle vous garantit une expérience de conduite inoubliable.`}
              </p>
            </div>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <div className="border-t border-zinc-800 pt-8">
                <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="glass-card border-zinc-800/50">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                              {(review.profiles?.full_name || "A")[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm">{review.profiles?.full_name || "Anonyme"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-zinc-400">{review.comment}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24">
              <Card className="glass-card border-zinc-800 p-6">
                <div className="mb-6">
                  <p className="text-3xl font-extrabold text-white">
                    {car.price_day} <span className="text-lg font-normal text-zinc-400">€ / jour</span>
                  </p>
                  {car.price_week && (
                    <p className="text-sm text-zinc-500 mt-1">{car.price_week} € / semaine</p>
                  )}
                </div>

                <form action={createBooking} className="space-y-4 mb-6">
                  <input type="hidden" name="car_id" value={car.id} />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-zinc-700 rounded-xl p-3 bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Départ</p>
                      <input
                        type="date"
                        name="start_date"
                        required
                        className="bg-transparent text-white text-sm w-full outline-none"
                      />
                    </div>
                    <div className="border border-zinc-700 rounded-xl p-3 bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Retour</p>
                      <input
                        type="date"
                        name="end_date"
                        required
                        className="bg-transparent text-white text-sm w-full outline-none"
                      />
                    </div>
                  </div>

                  {car.deposit && (
                    <div className="flex justify-between text-sm text-zinc-400 px-1">
                      <span>Caution</span>
                      <span className="font-semibold text-zinc-200">{car.deposit} €</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-14 text-lg font-bold rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20">
                    Réserver ce véhicule
                  </Button>
                </form>

                <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Aucun montant débité avant confirmation
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
