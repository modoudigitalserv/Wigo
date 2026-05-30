import { createClient } from "@/lib/server";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleVerifyDriver } from "./actions";

export default async function AdminDriversPage() {
  const supabase = await createClient();

  const { data: drivers } = await supabase
    .from("drivers")
    .select("*, profiles!inner(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-500" />
            Gestion des Chauffeurs
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Supervisez les chauffeurs et validez leurs documents (KYC).</p>
        </div>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Chauffeur</th>
                <th className="px-6 py-4 font-semibold">Ville</th>
                <th className="px-6 py-4 font-semibold">Tarif Journalier</th>
                <th className="px-6 py-4 font-semibold">Expérience</th>
                <th className="px-6 py-4 font-semibold">Statut KYC</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {drivers?.map((driver) => (
                <tr key={driver.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{driver.profiles?.full_name || "Sans nom"}</p>
                    <p className="text-xs text-zinc-500">{driver.profiles?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {driver.city}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {driver.daily_rate} €
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {driver.experience_years} ans
                  </td>
                  <td className="px-6 py-4">
                    {driver.verified ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Vérifié
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-yellow-500 font-medium">
                        <XCircle className="w-4 h-4" /> En attente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={toggleVerifyDriver}>
                      <input type="hidden" name="driverId" value={driver.id} />
                      <input type="hidden" name="currentState" value={driver.verified ? "true" : "false"} />
                      <Button 
                        type="submit" 
                        variant="outline" 
                        size="sm" 
                        className={`h-8 text-xs font-semibold rounded-lg ${driver.verified ? 'border-zinc-600 text-zinc-400 hover:bg-zinc-800' : 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10'} bg-transparent`}
                      >
                        {driver.verified ? "Révoquer KYC" : "Valider KYC"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!drivers || drivers.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Aucun chauffeur trouvé.
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
