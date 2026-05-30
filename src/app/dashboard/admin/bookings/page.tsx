import { createClient } from "@/lib/server";
import { Card } from "@/components/ui/card";
import { Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-zinc-300 border-zinc-600 bg-zinc-800/50",
  en_route: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  completed: "text-zinc-400 border-zinc-700 bg-zinc-900/50",
  active: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  pending: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "CONFIRMÉ",
  en_route: "EN ROUTE",
  completed: "TERMINÉ",
  active: "EN COURS",
  pending: "EN ATTENTE",
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, cars(brand, model), profiles!inner(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            Toutes les Réservations
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Consultez l'historique complet des réservations sur la plateforme.</p>
        </div>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Véhicule</th>
                <th className="px-6 py-4 font-semibold">Dates</th>
                <th className="px-6 py-4 font-semibold">Montant</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                    {booking.id.split("-")[0]}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{(booking.profiles as any)?.full_name || "Sans nom"}</p>
                    <p className="text-xs text-zinc-500">{(booking.profiles as any)?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-300 font-medium">{(booking.cars as any)?.brand} {(booking.cars as any)?.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">
                    <p>Du: {new Date(booking.start_date).toLocaleDateString('fr-FR')}</p>
                    <p>Au: {new Date(booking.end_date).toLocaleDateString('fr-FR')}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">
                    {booking.total_price} €
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${STATUS_STYLES[booking.status] || STATUS_STYLES.completed}`}>
                      {STATUS_LABELS[booking.status] || booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800">
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
