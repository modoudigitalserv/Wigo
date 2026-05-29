import { createClient } from "@/lib/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Car } from "lucide-react";

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

export default async function CompanyMissionsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.sub)
    .maybeSingle();

  if (!company) {
    return <div className="text-zinc-400">Aucune entreprise associée.</div>;
  }

  const { data: missions } = await supabase
    .from("bookings")
    .select("*, cars(brand, model), customer:profiles!bookings_customer_id_fkey(full_name)")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  const missionsList = missions || [];

  const planned = missionsList.filter(m => m.status === "confirmed").length;
  const inProgress = missionsList.filter(m => m.status === "active" || m.status === "en_route").length;
  const pending = missionsList.filter(m => m.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800/60 bg-[#121217] p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <Car className="w-4 h-4" /> Missions
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">Toutes les missions</h1>
        <p className="mt-3 text-sm text-zinc-400 max-w-2xl">
          Consultez l&apos;ensemble des missions attribuées à votre entreprise, suivez l&apos;avancement, et gérez les véhicules associés.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">Planifiées</p>
            <p className="mt-4 text-3xl font-extrabold text-white">{planned}</p>
            <p className="mt-2 text-xs text-zinc-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Trajets à venir</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">En cours</p>
            <p className="mt-4 text-3xl font-extrabold text-white">{inProgress}</p>
            <p className="mt-2 text-xs text-emerald-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Actives actuellement</p>
          </CardContent>
        </Card>
        <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">En attente</p>
            <p className="mt-4 text-3xl font-extrabold text-white">{pending}</p>
            <p className="mt-2 text-xs text-yellow-500 flex items-center gap-1.5"><Clock className="w-3 h-3" /> À valider</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2">
            Vue des missions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-4 font-semibold">ID</th>
                  <th className="px-4 py-4 font-semibold">Client</th>
                  <th className="px-4 py-4 font-semibold">Véhicule</th>
                  <th className="px-4 py-4 font-semibold">Dates</th>
                  <th className="px-4 py-4 font-semibold">Montant</th>
                  <th className="px-4 py-4 font-semibold text-right">Statut</th>
                  <th className="px-4 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {missionsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 text-sm">
                      Aucune mission trouvée
                    </td>
                  </tr>
                ) : (
                  missionsList.map((m) => (
                    <tr key={m.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                      <td className="px-4 py-4 text-zinc-400 font-mono text-xs">#{m.id.split("-")[0]}</td>
                      <td className="px-4 py-4 text-white font-medium">{m.customer?.full_name || "Client Inconnu"}</td>
                      <td className="px-4 py-4 text-zinc-300">
                        {m.cars?.brand} {m.cars?.model}
                      </td>
                      <td className="px-4 py-4 text-zinc-400 text-xs">
                        {new Date(m.start_date).toLocaleDateString("fr-FR")} - {new Date(m.end_date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-4 text-white font-medium">{m.total_price}€</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border ${STATUS_STYLES[m.status] || STATUS_STYLES.completed}`}>
                          {STATUS_LABELS[m.status] || m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link href={`/dashboard/company/missions/${m.id}`} className="text-xs font-semibold text-blue-400 hover:text-white transition-colors">
                          Détails
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
