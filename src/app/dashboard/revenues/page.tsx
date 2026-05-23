import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import PeriodSelector from "./PeriodSelector";

// Returns the start date based on the selected period
function getPeriodStart(period: string): Date | null {
  const now = new Date();
  switch (period) {
    case "7d":  { const d = new Date(now); d.setDate(d.getDate() - 7); return d; }
    case "30d": { const d = new Date(now); d.setDate(d.getDate() - 30); return d; }
    case "3m":  { const d = new Date(now); d.setMonth(d.getMonth() - 3); return d; }
    case "6m":  { const d = new Date(now); d.setMonth(d.getMonth() - 6); return d; }
    case "1y":  { const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d; }
    default: return null; // "all"
  }
}

// Returns an array of labels for the bar chart based on period
function getChartSlots(period: string): { label: string; startDate: Date; endDate: Date }[] {
  const now = new Date();
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const slots: { label: string; startDate: Date; endDate: Date }[] = [];

  if (period === "7d") {
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
      slots.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, startDate: start, endDate: end });
    }
  } else if (period === "30d") {
    for (let i = 3; i >= 0; i--) {
      const endD = new Date(now);
      endD.setDate(endD.getDate() - i * 7);
      const startD = new Date(endD);
      startD.setDate(startD.getDate() - 6);
      slots.push({ label: `S${4 - i}`, startDate: startD, endDate: endD });
    }
  } else {
    const months = period === "3m" ? 3 : period === "6m" ? 6 : period === "1y" ? 12 : 6;
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      slots.push({ label: monthNames[d.getMonth()], startDate: d, endDate: end });
    }
  }
  return slots;
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RevenuesPage(props: Props) {
  const searchParams = await props.searchParams;
  const period = (searchParams.period as string) || "30d";
  const periodStart = getPeriodStart(period);

  const supabase = await createClient();

  // Auth guard
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const role = profile?.role || "client";
  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Build base query with period filter
  let allBookingsQuery;
  if (role === "company") {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.sub)
      .single();

    allBookingsQuery = company
      ? supabase
          .from("bookings")
          .select("*, cars(brand, model)")
          .eq("company_id", company.id)
          .order("created_at", { ascending: false })
      : null;
  } else {
    allBookingsQuery = supabase
      .from("bookings")
      .select("*, cars(brand, model)")
      .eq("customer_id", user.sub)
      .order("created_at", { ascending: false });
  }

  // Apply period filter
  if (allBookingsQuery && periodStart) {
    allBookingsQuery = allBookingsQuery.gte("created_at", periodStart.toISOString());
  }

  const { data: allBookings } = allBookingsQuery
    ? await allBookingsQuery
    : { data: [] };

  const bookings = allBookings || [];

  // Stats
  const completedBookings = bookings.filter((b: any) => b.status === "completed");
  const totalRevenue = completedBookings.reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);
  const pendingRevenue = bookings
    .filter((b: any) => ["pending", "confirmed", "active"].includes(b.status))
    .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);

  // Previous period for comparison
  const prevStart = periodStart ? new Date(periodStart.getTime() - (Date.now() - periodStart.getTime())) : null;
  let prevRevenue = 0;
  if (prevStart && periodStart) {
    let prevQuery = role === "company"
      ? supabase.from("bookings").select("total_price, status")
      : supabase.from("bookings").select("total_price, status").eq("customer_id", user.sub);
    
    const { data: prevBk } = await prevQuery
      .gte("created_at", prevStart.toISOString())
      .lt("created_at", periodStart.toISOString());
    prevRevenue = (prevBk || [])
      .filter((b: any) => b.status === "completed")
      .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);
  }

  const growth = prevRevenue > 0
    ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
    : totalRevenue > 0 ? 100 : 0;

  // Chart data
  const chartSlots = getChartSlots(period);
  const chartData = chartSlots.map(slot => {
    const rev = completedBookings
      .filter((b: any) => {
        const d = new Date(b.created_at);
        return d >= slot.startDate && d <= slot.endDate;
      })
      .reduce((sum: number, b: any) => sum + (b.total_price || 0), 0);
    return { label: slot.label, revenue: rev };
  });

  const maxBarRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
    ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
    { href: "/dashboard/revenues", label: "Revenus", icon: Wallet, active: true },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

  const periodLabel: Record<string, string> = {
    "7d": "7 derniers jours",
    "30d": "30 derniers jours",
    "3m": "3 derniers mois",
    "6m": "6 derniers mois",
    "1y": "Dernière année",
    "all": "Depuis le début",
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className="text-xs text-blue-400 capitalize">{role}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    (link as any).active
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Revenus</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              {periodLabel[period] || "Période sélectionnée"} — {role === "company" ? "revenus reçus" : "dépenses"}
            </p>
          </div>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white rounded-full">
            <Download className="w-4 h-4 mr-2" /> Exporter
          </Button>
        </div>

        {/* Period Selector */}
        <div className="mb-8 overflow-x-auto">
          <PeriodSelector />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  {role === "company" ? "Revenus" : "Dépenses"}
                </p>
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString("fr-FR")} €</p>
              <div className="flex items-center gap-1 mt-1">
                {growth >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                )}
                <p className={`text-xs font-medium ${growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {growth >= 0 ? "+" : ""}{growth}% vs période précédente
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">En attente</p>
                <div className="w-8 h-8 rounded-lg bg-yellow-600/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{pendingRevenue.toLocaleString("fr-FR")} €</p>
              <p className="text-xs text-zinc-600 mt-1">Réservations en cours</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Terminées</p>
                <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{completedBookings.length}</p>
              <p className="text-xs text-zinc-600 mt-1">Réservations réussies</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Panier moyen</p>
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {completedBookings.length > 0 ? Math.round(totalRevenue / completedBookings.length).toLocaleString("fr-FR") : "0"} €
              </p>
              <p className="text-xs text-zinc-600 mt-1">Par réservation</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Évolution ({periodLabel[period]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 md:gap-3" style={{ height: "160px" }}>
              {chartData.map((slot, i) => {
                const height = maxBarRevenue > 0 ? Math.max((slot.revenue / maxBarRevenue) * 100, slot.revenue > 0 ? 5 : 0) : 0;
                const isLast = i === chartData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                    <span className={`text-[10px] font-bold ${isLast ? "text-blue-400" : "text-zinc-600"} truncate w-full text-center`}>
                      {slot.revenue > 0 ? `${slot.revenue}€` : "—"}
                    </span>
                    <div className="w-full flex items-end justify-center flex-1">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 ${isLast ? "bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700"}`}
                        style={{ height: `${height}%`, minHeight: slot.revenue > 0 ? "4px" : "0px" }}
                        title={`${slot.label}: ${slot.revenue} €`}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 truncate w-full text-center">{slot.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">
              Transactions <span className="text-zinc-500 font-normal text-sm">({bookings.length})</span>
            </CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs rounded-full">
                Gérer →
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Wallet className="w-12 h-12 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Aucune transaction sur cette période.</p>
                <p className="text-zinc-600 text-xs mt-1">Essayez une période plus large.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-2 text-zinc-500 font-medium text-xs uppercase tracking-wider">Véhicule</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-medium text-xs uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-2 text-zinc-500 font-medium text-xs uppercase tracking-wider">Statut</th>
                      <th className="text-right py-3 px-2 text-zinc-500 font-medium text-xs uppercase tracking-wider">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {bookings.map((booking: any) => {
                      const car = booking.cars;
                      const carName = car ? `${car.brand} ${car.model}` : "Véhicule";
                      const date = new Date(booking.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                      const isCompleted = booking.status === "completed";
                      const isPending = ["pending", "confirmed", "active"].includes(booking.status);

                      return (
                        <tr key={booking.id} className="hover:bg-zinc-900/30 transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                <CarFront className="w-3.5 h-3.5 text-blue-400" />
                              </div>
                              <span className="font-medium text-zinc-200 truncate max-w-[120px]">{carName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-zinc-400 whitespace-nowrap">{date}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              isCompleted ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
                              isPending ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                              "text-red-400 bg-red-400/10 border-red-400/20"
                            }`}>
                              {isCompleted ? "Terminé" : isPending ? "En cours" : "Annulé"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right whitespace-nowrap">
                            <span className={`font-bold ${
                              isCompleted ? "text-green-400" :
                              isPending ? "text-yellow-400" :
                              "text-zinc-500 line-through"
                            }`}>
                              {booking.total_price?.toLocaleString("fr-FR")} €
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-zinc-800">
                      <td colSpan={3} className="py-3 px-2 text-zinc-500 text-xs font-medium">
                        Total ({completedBookings.length} terminées)
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className="font-bold text-green-400 text-base">{totalRevenue.toLocaleString("fr-FR")} €</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
