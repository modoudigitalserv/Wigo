import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, ChevronLeft, CalendarRange, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { createCarBooking } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

export default async function BookCarPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const supabase = await createClient();

  // Check auth
  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) {
    redirect("/login?message=Connectez-vous pour réserver un véhicule.");
  }

  // Fetch car details
  const { data: car } = await supabase
    .from("cars")
    .select("*, car_images(*), companies(name)")
    .eq("id", id)
    .single();

  // Fallback to mock data if not found
  const carData = car || {
    id,
    brand: "BMW",
    model: "Série 5 M-Sport",
    fuel: "essence",
    transmission: "automatique",
    seats: 5,
    price_day: 130,
    city: "Casablanca",
    status: "disponible",
    car_images: [],
    companies: { name: "Premium Cars Maroc" },
  };

  const carName = `${carData.brand} ${carData.model}`;
  const priceDay = carData.price_day;
  const primaryImg = (carData as any).car_images?.find((i: any) => i.is_primary)?.image_url || PLACEHOLDER_IMG;
  const companyName = (carData as any).companies?.name || "Entreprise partenaire";

  // Today's date for min value on date inputs
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-black text-zinc-50 pt-20 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Back link */}
        <Link href={`/cars/${id}`} className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour au véhicule
        </Link>

        <h1 className="text-3xl font-bold mb-2">Finaliser votre réservation</h1>
        <p className="text-zinc-400 mb-8">Remplissez les informations ci-dessous pour réserver ce véhicule.</p>

        {/* Error / Success alerts */}
        {sp.error && (
          <div className="flex items-center gap-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{sp.error}</p>
          </div>
        )}
        {sp.message && (
          <div className="flex items-center gap-3 bg-green-950/60 border border-green-800 text-green-300 rounded-xl px-4 py-3 mb-6">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{sp.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Form */}
          <form action={createCarBooking} className="lg:col-span-2 space-y-6">
            <input type="hidden" name="car_id" value={id} />

            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarRange className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold">Dates de location</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-zinc-300">Date de départ <span className="text-red-500">*</span></Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      min={today}
                      required
                      className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-zinc-300">Date de retour <span className="text-red-500">*</span></Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      min={today}
                      required
                      className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl [color-scheme:dark]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold">Lieu & Informations</h2>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickup_location" className="text-zinc-300">Lieu de prise en charge <span className="text-red-500">*</span></Label>
                  <Input
                    id="pickup_location"
                    name="pickup_location"
                    placeholder="Ex: Aéroport Mohammed V, Casablanca"
                    required
                    className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-zinc-300">Notes supplémentaires</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Informations complémentaires pour l'entreprise (heure d'arrivée, demandes spéciales...)"
                    className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 min-h-[100px] rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition-all"
            >
              Envoyer la demande de réservation
            </Button>

            <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Aucun montant débité avant confirmation de l&apos;entreprise
            </p>
          </form>

          {/* Car summary */}
          <div className="space-y-4">
            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 overflow-hidden">
              <div className="relative h-48">
                <Image src={primaryImg} alt={carName} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-bold text-white text-lg">{carName}</p>
                  <p className="text-zinc-300 text-sm">{companyName}</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-400 text-sm">Prix / jour</span>
                  <span className="font-bold text-white">{priceDay} €</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-400 text-sm">Carburant</span>
                  <span className="font-semibold text-zinc-200 capitalize">{carData.fuel}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <span className="text-zinc-400 text-sm">Transmission</span>
                  <span className="font-semibold text-zinc-200 capitalize">{carData.transmission}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-400 text-sm">Ville</span>
                  <span className="font-semibold text-zinc-200">{carData.city}</span>
                </div>

                <div className="mt-4 bg-blue-950/40 border border-blue-800/40 rounded-xl p-4">
                  <p className="text-xs text-zinc-400 mb-1">Total estimé</p>
                  <p className="text-2xl font-extrabold text-white">
                    {priceDay} € <span className="text-sm font-normal text-zinc-400">/ jour</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Calculé selon vos dates sélectionnées</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-semibold text-zinc-300 text-sm mb-3">✅ Ce que vous obtenez</h3>
                {[
                  "Confirmation sous 24h",
                  "Annulation gratuite 48h avant",
                  "Assistance route 24/7",
                  "Kilométrage illimité",
                ].map(item => (
                  <p key={item} className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    {item}
                  </p>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
