import { createClient } from "@/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBlockUser } from "./actions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <UserRound className="w-8 h-8 text-blue-500" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Gérez tous les comptes inscrits sur la plateforme.</p>
        </div>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Rôle</th>
                <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {profiles?.map((profile) => (
                <tr key={profile.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">
                    {profile.full_name || "Sans nom"}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {profile.email || "Non renseigné"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border border-zinc-700 bg-zinc-800/50 text-zinc-300">
                      {profile.role?.toUpperCase() || "CLIENT"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_blocked ? (
                      <span className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                        <Ban className="w-3 h-3" /> Suspendu
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="w-3 h-3" /> Actif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={toggleBlockUser}>
                      <input type="hidden" name="userId" value={profile.id} />
                      <input type="hidden" name="currentState" value={profile.is_blocked ? "true" : "false"} />
                      <Button 
                        type="submit" 
                        variant="outline" 
                        size="sm" 
                        className={`h-8 text-xs font-semibold rounded-lg ${profile.is_blocked ? 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' : 'border-red-500/50 text-red-400 hover:bg-red-500/10'} bg-transparent`}
                      >
                        {profile.is_blocked ? "Débloquer" : "Suspendre"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!profiles || profiles.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    Aucun utilisateur trouvé.
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
