import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, UserRound, Building2, Users, Calendar, Settings, ShieldAlert, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import UserBlockToggle from "@/components/UserBlockToggle";
import { signout } from "@/app/login/actions";

export default async function DashboardUsersPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" : (profile?.role || "client");
  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (role !== "super_admin") redirect("/dashboard");

  // Fetch all users
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/users", label: "Utilisateurs", icon: UserRound, active: true },
    { href: "/dashboard/companies", label: "Entreprises", icon: Building2 },
    { href: "/dashboard/drivers", label: "Chauffeurs", icon: Users },
    { href: "/dashboard/all-bookings", label: "Toutes les Réservations", icon: Calendar },
    { href: "/dashboard/settings", label: "Paramètres Globaux", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className="text-xs text-purple-400 capitalize">Super Admin</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    (link as any).active ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}>
                  <Icon className="w-4 h-4" />{link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-zinc-800">
          <form action={signout}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
              Se déconnecter
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-zinc-500 mt-1">Supervisez et modérez tous les comptes de la plateforme.</p>
          </div>
        </div>

        <Card className="glass-card border-zinc-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Utilisateur</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Rôle</th>
                  <th className="px-6 py-4 font-medium">Inscription</th>
                  <th className="px-6 py-4 font-medium text-center">Bloqué</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {allUsers?.map((u) => {
                  const dateStr = new Date(u.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                  
                  return (
                    <tr key={u.id} className={`transition-colors ${u.is_blocked ? 'bg-red-950/20' : 'hover:bg-zinc-900/30'}`}>
                      <td className="px-6 py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                            {u.full_name?.slice(0, 2).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{u.full_name || "Sans nom"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" /> {u.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          u.role === 'super_admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          u.role === 'company' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          u.role === 'driver' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{dateStr}</td>
                      <td className="px-6 py-4 text-center">
                        {u.role === 'super_admin' ? (
                          <span className="text-zinc-600 text-xs">-</span>
                        ) : (
                          <UserBlockToggle userId={u.id} isBlocked={u.is_blocked} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
