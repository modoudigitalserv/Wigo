import { createClient } from "@/lib/server";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminCompaniesPage() {
  const supabase = await createClient();

  // Fetch companies along with the count of their cars
  const { data: companies } = await supabase
    .from("companies")
    .select("*, cars(count)")
    .order("name", { ascending: true });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-500" />
            Gestion des Entreprises
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Gérez les agences de location et leurs flottes de véhicules.</p>
        </div>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Nom de l'entreprise</th>
                <th className="px-6 py-4 font-semibold">Ville</th>
                <th className="px-6 py-4 font-semibold">Téléphone</th>
                <th className="px-6 py-4 font-semibold">Abonnement</th>
                <th className="px-6 py-4 font-semibold">Véhicules</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {companies?.map((company) => (
                <tr key={company.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {company.city}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {company.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                      {company.subscription_plan?.toUpperCase() || "BASIC"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-300 font-medium">
                      {company.cars?.[0]?.count || 0}
                    </span>
                    <span className="text-zinc-500 text-xs ml-1">véhicules</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800">
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
              {(!companies || companies.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Aucune entreprise trouvée.
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
