import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Users, Car, Calendar } from "lucide-react";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-zinc-300 border-zinc-600 bg-zinc-800/50",
  en_route: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  completed: "text-zinc-400 border-zinc-700 bg-zinc-900/50",
  active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "CONFIRMÉ",
  en_route: "EN ROUTE",
  completed: "TERMINÉ",
  active: "EN COURS",
  pending: "EN ATTENTE",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getClaims();
  const user = authData?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const displayName = profile?.full_name || user.email || "Super Admin";

  const [
    { count: profilesCount },
    { count: companiesCount },
    { count: driversCount },
    { count: carsCount },
    { data: allBookings }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("drivers").select("*", { count: "exact", head: true }),
    supabase.from("cars").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("id, total_price, status, created_at, cars(brand, model)").order("created_at", { ascending: false })
  ]);

  const bookingsList = allBookings || [];
  const revenue = bookingsList
    .filter(b => ["confirmed", "active", "completed"].includes(b.status))
    .reduce((sum, b) => sum + (b.total_price || 0), 0);
    
  const recentBookings = bookingsList.slice(0, 5);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Vue d'ensemble Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Bonjour {displayName.split(" ")[0]}, voici l'activité globale de la plateforme.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Chiffre d'Affaires</p>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{revenue.toLocaleString('fr-FR')} €</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Utilisateurs</p>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{profilesCount || 0}</h3>
            <p className="text-xs text-zinc-500 mt-2">{companiesCount || 0} loueurs, {driversCount || 0} chauffeurs</p>
          </CardContent>
        </Card>

        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Véhicules</p>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{carsCount || 0}</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Réservations</p>
            </div>
            <h3 className="text-3xl font-extrabold text-white">{bookingsList.length}</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
             <CardHeader>
               <CardTitle className="text-white text-lg">Dernières Réservations</CardTitle>
             </CardHeader>
             <CardContent>
               {recentBookings.length === 0 ? (
                 <p className="text-sm text-zinc-500 py-4 text-center">Aucune réservation pour le moment.</p>
               ) : (
                 <div className="space-y-4">
                   {recentBookings.map((b) => (
                     <div key={b.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                           <Car className="w-5 h-5 text-zinc-400" />
                         </div>
                         <div>
                           <p className="text-sm font-bold text-white">{(b.cars as any)?.brand} {(b.cars as any)?.model}</p>
                           <p className="text-xs text-zinc-500">{new Date(b.created_at).toLocaleDateString('fr-FR')} • {b.total_price}€</p>
                         </div>
                       </div>
                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${STATUS_STYLES[b.status] || STATUS_STYLES.completed}`}>
                         {STATUS_LABELS[b.status] || b.status.toUpperCase()}
                       </span>
                     </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Répartition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Confirmées</span>
                <span className="font-bold text-white">{bookingsList.filter(b => b.status === "confirmed").length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">En cours</span>
                <span className="font-bold text-emerald-400">{bookingsList.filter(b => b.status === "active" || b.status === "en_route").length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Terminées</span>
                <span className="font-bold text-zinc-300">{bookingsList.filter(b => b.status === "completed").length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">En attente</span>
                <span className="font-bold text-yellow-500">{bookingsList.filter(b => b.status === "pending").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
