import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, Star, Clock, CheckCircle2, XCircle, AlertTriangle, MapPin } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  active: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  active: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
  rejected: "Refusée",
};

export default async function MissionsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = profile?.role || "client";
  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (role !== "driver") redirect("/dashboard");

  // Fetch driver info
  const { data: driver } = await supabase.from("drivers").select("*").eq("user_id", user.sub).single();

  // Fetch missions
  const { data: missions } = driver
    ? await supabase
        .from("driver_bookings")
        .select("*, profiles!driver_bookings_customer_id_fkey(full_name, email)")
        .eq("driver_id", driver.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const allMissions = missions || [];
  const completedMissions = allMissions.filter(m => m.status === "completed").length;
  const pendingMissions = allMissions.filter(m => m.status === "pending").length;
  const activeMissions = allMissions.filter(m => ["confirmed", "active"].includes(m.status)).length;
  const totalEarnings = allMissions
    .filter(m => m.status === "completed")
    .reduce((sum, m) => sum + (m.total_price || 0), 0);

  // Mission quota
  const { data: usage } = driver
    ? await supabase.from("driver_usage_stats").select("*").eq("driver_id", driver.id).single()
    : { data: null };

  const planLimits: Record<string, number> = { starter: 10, pro: 9999, elite: 9999 };
  const currentPlan = usage?.current_plan || "starter";
  const maxMissions = planLimits[currentPlan] || 10;
  const usedMissions = usage?.completed_missions || completedMissions;
  const quotaReached = currentPlan === "starter" && usedMissions >= maxMissions;

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    { href: "/dashboard/missions", label: "Mes Missions", icon: CarFront, active: true },
    { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className="text-xs text-blue-400 capitalize">{role}</p>
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
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes Missions</h1>
            <p className="text-zinc-500 mt-1">Gérez vos missions et suivez votre activité.</p>
          </div>
          <div className="flex items-center gap-2">
            {driver?.rating_average && (
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-yellow-400" /> {driver.rating_average.toFixed(1)}
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold uppercase">
              Plan {currentPlan}
            </span>
          </div>
        </div>

        {/* Quota Warning */}
        {quotaReached && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-400">Limite atteinte</p>
              <p className="text-sm text-zinc-400 mt-1">
                Vous avez atteint la limite de {maxMissions} missions de votre plan Starter. Passez à une offre supérieure pour continuer.
              </p>
              <Link href="/pricing">
                <Button size="sm" className="mt-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs">
                  Mettre à niveau →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Mission Quota Bar */}
        {currentPlan === "starter" && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>{usedMissions} mission{usedMissions > 1 ? "s" : ""} terminée{usedMissions > 1 ? "s" : ""}</span>
              <span>Limite: {maxMissions}</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${quotaReached ? "bg-red-500" : "bg-blue-600"}`}
                style={{ width: `${Math.min((usedMissions / maxMissions) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "En attente", value: pendingMissions, color: "text-yellow-400" },
            { label: "En cours", value: activeMissions, color: "text-purple-400" },
            { label: "Terminées", value: completedMissions, color: "text-blue-400" },
            { label: "Revenus", value: `${totalEarnings.toLocaleString("fr-FR")} €`, color: "text-green-400" },
          ].map(s => (
            <Card key={s.label} className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Missions List */}
        {allMissions.length === 0 ? (
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <CarFront className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">Aucune mission</h3>
              <p className="text-zinc-600 text-center">Vous n&apos;avez pas encore reçu de mission. Assurez-vous que votre profil est complet et vérifié.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allMissions.map((mission: any) => {
              const customer = mission.profiles;
              const status = mission.status || "pending";
              const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;
              const statusLabel = STATUS_LABELS[status] || status;
              const date = new Date(mission.start_date || mission.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
              const duration = mission.duration_hours ? `${mission.duration_hours}h` : "Journée";

              return (
                <Card key={mission.id} className="glass-card border-zinc-800/50 bg-zinc-950/80 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          <CarFront className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">
                            Mission {mission.mission_type === "transfer" ? "Transfert" : mission.mission_type === "hourly" ? "À l'heure" : "Journée"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {duration}</span>
                          </div>
                          {customer && (
                            <p className="text-xs text-zinc-500 mt-1">Client: {customer.full_name || customer.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{mission.total_price || 0} €</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap ${statusStyle}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    {status === "pending" && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-800/50">
                        <Button size="sm" className="rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex-1">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accepter
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs flex-1">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> Refuser
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
