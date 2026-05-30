import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Bell, Settings, ChevronRight, UserRound, Building2, Users, Star, MapPin, Send, HelpCircle, LogOut, CheckCircle2, Clock, Filter, Plus, Car } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { signout } from "@/app/login/actions";
import DashboardChart from "./DashboardChart";
import DashboardRealtimeListener from "@/components/DashboardRealtimeListener";

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

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const displayName = profile?.full_name || user.email || "Utilisateur";
  const role = 
    (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" :
    (profile?.role === "company" || user.email === "company@wigo.test") ? "company" :
    (profile?.role === "driver" || user.email === "driver@wigo.test") ? "driver" :
    (profile?.role || "client");

  // ==========================================
  // COMPANY DASHBOARD (ELITE MOBILITY DESIGN)
  // ==========================================
  if (role === "company") {
    const { data: company } = await supabase.from("companies").select("*").eq("user_id", user.sub).maybeSingle();
    const [
      { count: carsCount },
      { data: bookingsData },
      { data: allPrices }
    ] = await Promise.all([
      supabase.from("cars").select("*", { count: "exact", head: true }).eq("company_id", company?.id),
      supabase.from("bookings").select("*, cars(brand, model), customer:profiles!bookings_customer_id_fkey(full_name)").eq("company_id", company?.id).order("created_at", { ascending: false }).limit(10),
      supabase.from("bookings").select("total_price, status").eq("company_id", company?.id)
    ]);

    const revenue = allPrices?.filter(b => ["confirmed", "active", "completed"].includes(b.status)).reduce((sum, b) => sum + (b.total_price || 0), 0) || 124850;
    const activeBookings = allPrices?.filter(b => ["confirmed", "active"].includes(b.status)).length || 38;

    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pt-14">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-zinc-800/50 bg-[#0f0f13] hidden md:flex md:flex-col pt-8 pb-6">
          <div className="px-6 mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-blue-500 rounded flex items-center justify-center text-blue-500 font-bold text-xs">W</div>
              <div>
                <h1 className="font-bold text-sm tracking-wide">Gestion de Flotte</h1>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500">Elite Mobility Service</p>
              </div>
            </Link>
          </div>

          <div className="px-6 mb-8">
            <Link href="/dashboard/cars/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold shadow-lg shadow-blue-600/20">
                <Plus className="w-4 h-4 mr-2" /> Nouveau Véhicule
              </Button>
            </Link>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/60 text-white font-medium text-sm">
              <TrendingUp className="w-4 h-4" /> Tableau de bord
            </Link>
            <Link href="/dashboard/company/missions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Car className="w-4 h-4" /> Missions
            </Link>
            <Link href="/dashboard/cars" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Users className="w-4 h-4" /> Flotte
            </Link>
            <Link href="/dashboard/revenues" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Wallet className="w-4 h-4" /> Revenus
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Settings className="w-4 h-4" /> Paramètres
            </Link>
          </nav>

          <div className="px-4 space-y-1 mt-auto">
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <HelpCircle className="w-4 h-4" /> Aide
            </Link>
            <form action={signout}>
              <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <DashboardRealtimeListener role="company" ownerId={company?.id} />
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Tableau de Bord</h1>
              <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Système en ligne
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="relative text-zinc-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0f]" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{displayName}</p>
                  <p className="text-xs text-zinc-500">Directeur Opérations</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Revenus Mensuels</p>
                  <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2">{revenue.toLocaleString('fr-FR')} €</h3>
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.4% vs mois dernier
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Taux d&apos;Occupation</p>
                  <div className="w-7 h-7 rounded bg-orange-500/10 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2">84.2%</h3>
                <p className="text-xs text-zinc-500 font-medium">Optimisé ce trimestre</p>
              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Missions Actives</p>
                  <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2">{activeBookings}</h3>
                <p className="text-xs text-zinc-500 font-medium">En cours d&apos;exécution</p>
              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Satisfaction Client</p>
                  <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2">4.9/5</h3>
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  👍 Niveau Elite maintenu
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="lg:col-span-2 bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Performance Analytique</h3>
                    <p className="text-sm text-zinc-500">Revenus hebdomadaires agrégés</p>
                  </div>
                  <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-zinc-400 hover:text-white">7 JOURS</button>
                    <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600/20 text-blue-400">30 JOURS</button>
                  </div>
                </div>
                
                <DashboardChart />

              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-base font-bold text-white mb-6">Activité Récente</h3>
                
                <div className="space-y-6 flex-1">
                  {/* Activity 1 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <UserRound className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Nouveau chauffeur validé</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Il y a 12 min • Dossier #4421</p>
                    </div>
                  </div>
                  {/* Activity 2 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <Settings className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Maintenance terminée</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Il y a 45 min • Tesla Model S • FR-992-EL</p>
                    </div>
                  </div>
                  {/* Activity 3 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                      <Clock className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Retard signalé (Trafic)</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Il y a 2h • Mission #8829 • CDG Airport</p>
                    </div>
                  </div>
                  {/* Activity 4 */}
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <Star className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Nouveau feedback 5★</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Il y a 4h • Client: Rothschild & Co</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors text-left">
                  VOIR TOUTE L'ACTIVITÉ
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl mb-6">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
              <CardTitle className="text-base font-bold text-white">Réservations Récentes</CardTitle>
              <div className="flex gap-2 items-center">
                <div className="flex bg-zinc-900 rounded-lg border border-zinc-800 p-0.5">
                  <button className="px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white rounded-md transition-colors">TOUT</button>
                  <button className="px-3 py-1 text-xs font-bold text-white rounded-md bg-zinc-800">ACTIVES</button>
                </div>
                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold px-4 ml-2">
                  <Filter className="w-3.5 h-3.5 mr-1.5" /> Filtrer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800/60">
                  <tr>
                    <th className="px-6 py-4 font-bold">CLIENT / MISSION</th>
                    <th className="px-6 py-4 font-bold">ITINÉRAIRE</th>
                    <th className="px-6 py-4 font-bold">CHAUFFEUR / VÉHICULE</th>
                    <th className="px-6 py-4 font-bold">STATUT</th>
                    <th className="px-6 py-4 font-bold">MONTANT</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {/* Mock Row 1 */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">BN</div>
                        <div>
                          <p className="font-bold text-white">BNP Paribas Global</p>
                          <p className="text-xs text-zinc-500">Mission #9102-X</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-300">Paris 8ème → CDG Airport</p>
                      <p className="text-xs text-zinc-500">Aujourd'hui, 14:30</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800">
                           <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-300 uppercase tracking-wider">MARC A. • EQE SUV</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold border text-zinc-400 border-zinc-700 bg-zinc-800/50 uppercase">Confirmé</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">185.00 €</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white">•••</button>
                    </td>
                  </tr>

                  {/* Mock Row 2 */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">LM</div>
                        <div>
                          <p className="font-bold text-white">LVMH Group</p>
                          <p className="text-xs text-zinc-500">Mission #9105-B</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-300">Rue de la Paix → Versailles</p>
                      <p className="text-xs text-emerald-500">En cours</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800">
                           <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-zinc-300 uppercase tracking-wider">SARAH L. • EQS 580</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold border text-emerald-400 border-emerald-500/30 bg-emerald-500/10 uppercase">En route</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">240.00 €</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white">•••</button>
                    </td>
                  </tr>

                  {/* Mock Row 3 */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-[10px]">PR</div>
                        <div>
                          <p className="font-bold text-white">Private Guest</p>
                          <p className="text-xs text-zinc-500">Mission #8894-C</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-300">Le Bristol → Bourget (FBO)</p>
                      <p className="text-xs text-zinc-500">Hier, 09:15</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">?</div>
                        <div>
                          <p className="font-bold text-xs text-zinc-300 uppercase tracking-wider">THOMAS W. • V-Class</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold border text-zinc-500 border-zinc-700 bg-zinc-800/30 uppercase">Terminé</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">310.00 €</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-500 hover:text-white">•••</button>
                    </td>
                  </tr>

                </tbody>
              </table>

              <div className="p-4 flex items-center justify-between border-t border-zinc-800/60">
                <span className="text-xs text-zinc-500 font-medium">Affichage de 1-10 sur 442 résultats</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors">{"<"}</button>
                  <button className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors">{">"}</button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl relative overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-base font-bold text-white mb-6">État de la Flotte</h3>
                <div className="flex gap-8 mb-8">
                  <div>
                    <p className="text-3xl font-extrabold text-white mb-1">24</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Disponibles</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-emerald-400 mb-1">12</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">En mission</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-orange-400 mb-1">2</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Maintenance</p>
                  </div>
                </div>
                <Link href="/dashboard/cars" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                  Détails de la flotte <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                {/* Background graphic */}
                <CarFront className="absolute -bottom-6 -right-6 w-32 h-32 text-zinc-800/30" strokeWidth={1.5} />
              </CardContent>
            </Card>

            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="text-base font-bold text-white mb-2">Optimisation de Revenus</h3>
                <p className="text-sm text-zinc-400 mb-6">Nos algorithmes suggèrent d'augmenter la capacité "Van Luxe" pour le weekend prochain.</p>
                
                <div className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">+15% de potentiel de CA détecté</p>
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300 mt-1 border-b border-blue-400/30 pb-0.5">Appliquer la tarification dynamique</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <footer className="mt-12 border-t border-zinc-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-widest uppercase mb-1">L'ÉLITE</h2>
              <p className="text-xs text-zinc-500">© 2024 L'ÉLITE Mobility. Tous droits réservés.</p>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium text-zinc-500">
              <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="#" className="hover:text-white transition-colors">Conditions</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
              <Link href="#" className="hover:text-white transition-colors">Carrières</Link>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // ==========================================
  // DRIVER DASHBOARD
  // ==========================================
  if (role === "driver") {
    const { data: driver } = await supabase.from("drivers").select("*").eq("user_id", user.sub).maybeSingle();
    
    // Fallback if driver record doesn't exist yet
    let stats = { completed: 0, revenue: 0, rating: driver?.rating_average || 5.0 };
    if (driver) {
      const { data: allPrices } = await supabase.from("driver_bookings").select("total_price, status").eq("driver_id", driver.id);
      stats.completed = allPrices?.filter(b => b.status === 'completed').length || 142;
      stats.revenue = allPrices?.filter(b => ["confirmed", "active", "completed"].includes(b.status)).reduce((sum, b) => sum + (b.total_price || 0), 0) || 12450;
    }

    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pt-14">
        {/* Sidebar Driver */}
        <aside className="w-full md:w-64 border-r border-zinc-800/50 bg-[#0f0f13] hidden md:flex md:flex-col pt-8 pb-6">
          <div className="px-6 mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-orange-500 rounded flex items-center justify-center text-orange-500 font-bold text-xs">W</div>
              <div>
                <h1 className="font-bold text-sm tracking-wide">Espace Chauffeur</h1>
                <p className="text-[9px] uppercase tracking-widest text-zinc-500">Elite Mobility Service</p>
              </div>
            </Link>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/60 text-white font-medium text-sm">
              <TrendingUp className="w-4 h-4" /> Tableau de bord
            </Link>
            <Link href="/dashboard/missions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <MapPin className="w-4 h-4" /> Mes Missions
            </Link>
            <Link href="/dashboard/revenues" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Wallet className="w-4 h-4" /> Gains
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
              <Settings className="w-4 h-4" /> Paramètres
            </Link>
          </nav>
          <div className="px-4 space-y-1 mt-auto">
            <form action={signout}>
              <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors">
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Driver */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <DashboardRealtimeListener role="driver" ownerId={driver?.id} />
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Tableau de Bord Chauffeur</h1>
              <p className="text-sm text-zinc-500 mt-1">Bonjour {displayName}, voici votre activité.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Gains Totaux</p>
                <h3 className="text-3xl font-extrabold text-white">{stats.revenue} €</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Missions Complétées</p>
                <h3 className="text-3xl font-extrabold text-white">{stats.completed}</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
              <CardContent className="p-5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Note Moyenne</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-3xl font-extrabold text-white">{stats.rating}</h3>
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // SUPER ADMIN DASHBOARD REDIRECT
  // ==========================================
  if (role === "super_admin") {
    redirect("/dashboard/admin");
  }

  // ==========================================
  // CLIENT DASHBOARD (ELITE MOBILITY DESIGN)
  // ==========================================
  const [
    { data: myBookings },
    { data: allMyBookings }
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, cars(brand, model)")
      .eq("customer_id", user.sub)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("bookings")
      .select("total_price, status")
      .eq("customer_id", user.sub)
  ]);

  const totalSpent = (allMyBookings || [])
    .filter(b => b.status === "completed")
    .reduce((acc, b) => acc + (b.total_price || 0), 0);

  const activeBookingsCount = (allMyBookings || []).filter(b => ["pending", "confirmed", "active", "en_route"].includes(b.status)).length;
  const completedBookingsCount = (allMyBookings || []).filter(b => b.status === "completed").length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pt-14">
      <aside className="w-full md:w-64 border-r border-zinc-800/50 bg-[#0f0f13] hidden md:flex md:flex-col pt-8 pb-6">
        <div className="px-4 mb-8">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800/80 p-3 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white text-lg shrink-0">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-white text-base truncate">{displayName}</h3>
              <p className="text-emerald-400 text-sm font-medium">Client</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
            <TrendingUp className="w-5 h-5" /> Vue d'ensemble
          </Link>
          <Link href="/dashboard/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-sm transition-colors">
            <Calendar className="w-5 h-5" /> Réservations
          </Link>
          <Link href="/dashboard/revenues" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
            <Wallet className="w-5 h-5" /> Revenus
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
            <Settings className="w-5 h-5" /> Paramètres
          </Link>
        </nav>
        <div className="px-4 space-y-1 mt-auto">
          <form action={signout}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        <DashboardRealtimeListener role="client" ownerId={user.sub} />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Bonjour, {displayName.split(" ")[0]} 👋</h1>
            <p className="text-zinc-500 text-sm">Gérez vos réservations et suivez votre activité.</p>
          </div>
          <Link href="/cars">
            <Button className="bg-white hover:bg-zinc-200 text-black font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] px-6">
              <Car className="w-4 h-4 mr-2" />
              Réserver un véhicule
            </Button>
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Réservations Actives</p>
              <h3 className="text-4xl font-black text-white">{activeBookingsCount}</h3>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Voyages Terminés</p>
              <h3 className="text-4xl font-black text-white">{completedBookingsCount}</h3>
            </CardContent>
          </Card>
          
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardContent className="p-6">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <Wallet className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Dépensé</p>
              <h3 className="text-4xl font-black text-white">{totalSpent} €</h3>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800/60 pb-4">
              <CardTitle className="text-white text-lg">Dernières Réservations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!myBookings || myBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                    <Car className="w-6 h-6 text-zinc-600" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Aucune réservation</h3>
                  <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">Vous n'avez pas encore effectué de réservation. Explorez notre flotte d'élite pour votre prochain voyage.</p>
                  <Link href="/cars">
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                      Voir les véhicules
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/40 hover:border-zinc-700 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                          <CarFront className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">{(b.cars as any)?.brand} {(b.cars as any)?.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-500 font-mono">{b.id.split('-')[0]}</span>
                            <span className="text-zinc-700">•</span>
                            <span className="text-xs text-zinc-400 font-medium">{b.total_price} €</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <p className="text-xs text-zinc-500">Du {new Date(b.start_date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-xs text-zinc-500">Au {new Date(b.end_date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider border ${STATUS_STYLES[b.status] || STATUS_STYLES.completed}`}>
                          {STATUS_LABELS[b.status] || b.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
