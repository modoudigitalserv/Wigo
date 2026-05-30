import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Phone, MapPin, Car, CreditCard } from "lucide-react";
import Image from "next/image";
import { updateMissionStatus } from "./actions";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-zinc-300 border-zinc-600 bg-zinc-800/50",
  en_route: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  completed: "text-zinc-400 border-zinc-700 bg-zinc-900/50",
  active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  pending: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "CONFIRMÉ",
  en_route: "EN ROUTE",
  completed: "TERMINÉ",
  active: "EN COURS",
  pending: "EN ATTENTE",
};

export default async function MissionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: companies } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.sub);

  const companyIds = companies?.map(c => c.id) || [];

  const { data: mission } = companyIds.length > 0 ? await supabase
    .from("bookings")
    .select("*, cars(*, car_images(image_url))")
    .eq("id", id)
    .in("company_id", companyIds)
    .maybeSingle() : { data: null };

  let customerEmail = "";
  if (mission?.customer_id) {
    const { data: userData } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", mission.customer_id)
      .maybeSingle();
    if (userData?.email) {
      customerEmail = userData.email;
    }
  }

  if (!mission) {
    return (
      <div className="p-8 text-center text-zinc-400">
        <h2 className="text-2xl font-bold text-white mb-2">Mission introuvable</h2>
        <p>Cette mission n&apos;existe pas ou vous n&apos;y avez pas accès.</p>
        <Link href="/dashboard/company/missions" className="mt-4 inline-block text-blue-500 hover:underline">
          Retour aux missions
        </Link>
      </div>
    );
  }

  const car = mission.cars;
  const image = car?.car_images?.[0]?.image_url || "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop";

  const acceptAction = updateMissionStatus.bind(null, mission.id, "confirmed");
  const rejectAction = updateMissionStatus.bind(null, mission.id, "cancelled");

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* En-tête de retour */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/company/missions">
          <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">#{mission.id.split("-")[0]}</p>
          <h1 className="text-2xl font-bold text-white">Détails de la mission</h1>
        </div>
        <div className="ml-auto">
          <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider border ${STATUS_STYLES[mission.status] || STATUS_STYLES.completed}`}>
            {STATUS_LABELS[mission.status] || mission.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Colonne de Gauche : Infos Réservation */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl overflow-hidden">
            <div className="relative h-48 bg-zinc-900 w-full">
              <Image src={image} alt="Voiture" fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121217] to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white">{car?.brand} {car?.model}</h2>
                <p className="text-sm text-zinc-400">{car?.year} • {car?.fuel} • {car?.transmission}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Résumé du trajet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Période de location</p>
                  <p className="font-medium text-white">
                    Du {new Date(mission.start_date).toLocaleDateString("fr-FR")} au {new Date(mission.end_date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Montant total</p>
                  <p className="font-bold text-white text-xl">{mission.total_price}€</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Colonne de Droite : Infos Client & Actions */}
        <div className="space-y-6">
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Informations Client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                  <User className="w-6 h-6 text-zinc-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{customerEmail || "Client Inconnu"}</p>
                  <p className="text-xs text-zinc-500">Locataire</p>
                </div>
              </div>
              
              {mission.customer?.phone && (
                <div className="pt-4 border-t border-zinc-800 flex items-center gap-3 text-sm text-zinc-300">
                  <Phone className="w-4 h-4 text-zinc-500" /> {mission.customer.phone}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Actions Requises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mission.status === "pending" ? (
                <>
                  <form action={acceptAction}>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl">Accepter la mission</Button>
                  </form>
                  <form action={rejectAction}>
                    <Button type="submit" variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl">Refuser</Button>
                  </form>
                </>
              ) : (
                <p className="text-sm text-zinc-500">Aucune action requise pour le moment. La mission est <b>{STATUS_LABELS[mission.status]?.toLowerCase()}</b>.</p>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
