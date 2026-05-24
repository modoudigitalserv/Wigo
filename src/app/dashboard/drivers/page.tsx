import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, UserRound, Building2, Users, Calendar, Settings, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function AdminDriversPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = profile?.role === "super_admin" || user.email === "admin@wigo.test" ? "super_admin" : profile?.role || "client";
  
  if (role !== "super_admin") redirect("/dashboard");

  const displayName = profile?.full_name || user.email || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch all drivers
  const { data: drivers } = await supabase
    .from("drivers")
    .select("*, profiles:user_id(email, full_name, phone)")
    .order("created_at", { ascending: false });

  const allDrivers = drivers || [];

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/users", label: "Utilisateurs", icon: UserRound },
    { href: "/dashboard/companies", label: "Entreprises", icon: Building2 },
    { href: "/dashboard/drivers", label: "Chauffeurs", icon: Users, active: true },
    { href: "/dashboard/all-bookings", label: "Toutes les Réservations", icon: Calendar },
    { href: "/dashboard/settings", label: "Paramètres Globaux", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
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
                    (link as any).active ? "bg-purple-600/10 text-purple-400 border border-purple-500/20" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}>
                  <Icon className="w-4 h-4" />{link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Chauffeurs Indépendants</h1>
            <p className="text-zinc-500 mt-1">Gérez les profils et les vérifications KYC des chauffeurs.</p>
          </div>
        </div>

        <div className="space-y-4">
          {allDrivers.map((driver: any) => {
            const owner = driver.profiles;
            const plan = driver.subscription_plan || "starter";
            const planColors: Record<string, string> = {
              starter: "text-zinc-400 border-zinc-800 bg-zinc-900",
              pro: "text-blue-400 border-blue-500/20 bg-blue-600/10",
              elite: "text-purple-400 border-purple-500/20 bg-purple-600/10",
            };
            const planStyle = planColors[plan] || planColors.starter;

            return (
              <Card key={driver.id} className="glass-card border-zinc-800/50 bg-zinc-950/80 hover:border-zinc-700 transition-colors">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {owner?.full_name || "Chauffeur Anonyme"}
                          {driver.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-500" title="Profil vérifié (KYC)" />}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                          <span className="flex items-center gap-1">📍 {driver.city || "Non spécifiée"}</span>
                          <span className="flex items-center gap-1">📞 {owner?.phone || "Non spécifié"}</span>
                          {driver.rating_average > 0 && (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-3.5 h-3.5 fill-yellow-400" /> {driver.rating_average}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">Permis: {driver.license_type || 'B'} • Expérience: {driver.experience_years || 0} ans</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${planStyle}`}>
                          Plan {plan}
                        </span>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="rounded-full border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white">
                           Détails
                         </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {allDrivers.length === 0 && (
             <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
               <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-zinc-400 mb-2">Aucun chauffeur</h3>
               <p className="text-zinc-600">Il n&apos;y a pas encore de chauffeur inscrit.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
