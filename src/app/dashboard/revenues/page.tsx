import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, ArrowUpRight, ArrowDownRight, DollarSign, BarChart3, Download } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function RevenuesPage() {
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

  // Fetch all bookings for revenue calculations
  let allBookings: any[] = [];

  if (role === "company") {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.sub)
      .single();

    if (company) {
      const { data: bk } = await supabase
        .from("bookings")
        .select("*, cars(brand, model)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      allBookings = bk || [];
    }
  } else {
    const { data: bk } = await supabase
      .from("bookings")
      .select("*, cars(brand, model)")
      .eq("customer_id", user.sub)
      .order("created_at", { ascending: false });
    allBookings = bk || [];
  }

  // Revenue calculations
  const completedBookings = allBookings.filter(b => b.status === "completed");
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const pendingRevenue = allBookings
    .filter(b => ["pending", "confirmed", "active"].includes(b.status))
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  // Current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyRevenue = completedBookings
    .filter(b => {
      const d = new Date(b.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  // Last month
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthRevenue = completedBookings
    .filter(b => {
      const d = new Date(b.created_at);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const monthlyGrowth = lastMonthRevenue > 0
    ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : monthlyRevenue > 0 ? 100 : 0;

  // Monthly breakdown (last 6 months)
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const m = d.getMonth();
    const y = d.getFullYear();
    const rev = completedBookings
      .filter(b => {
        const bd = new Date(b.created_at);
        return bd.getMonth() === m && bd.getFullYear() === y;
      })
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
    return { label: monthNames[m], revenue: rev };
  });

  const maxBarRevenue = Math.max(...last6Months.map(m => m.revenue), 1);

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
    ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
    { href: "/dashboard/revenues", label: "Revenus", icon: Wallet, active: true },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Revenus</h1>
            <p className="text-zinc-500 mt-1">
              {role === "company" ? "Analyse financière de votre activité de location." : "Suivi de vos dépenses de réservation."}
            </p>
          </div>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white rounded-full">
            <Download className="w-4 h-4 mr-2" /> Exporter
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                  {role === "company" ? "Revenus totaux" : "Total dépensé"}
                </p>
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString("fr-FR")} €</p>
              <p className="text-xs text-zinc-600 mt-1">Réservations terminées</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Ce mois-ci</p>
                <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{monthlyRevenue.toLocaleString("fr-FR")} €</p>
              <div className="flex items-center gap-1 mt-1">
                {monthlyGrowth >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                )}
                <p className={`text-xs font-medium ${monthlyGrowth >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {monthlyGrowth >= 0 ? "+" : ""}{monthlyGrowth}% vs mois dernier
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
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Réservations</p>
                <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{completedBookings.length}</p>
              <p className="text-xs text-zinc-600 mt-1">Terminées avec succès</p>
            </CardContent>
          </Card>
        </div>

        {/* Bar Chart - Last 6 months */}
        <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Évolution des revenus (6 derniers mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-40">
              {last6Months.map((month, i) => {
                const height = maxBarRevenue > 0 ? Math.max((month.revenue / maxBarRevenue) * 100, month.revenue > 0 ? 5 : 0) : 0;
                const isCurrentMonth = i === 5;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className={`text-xs font-bold ${isCurrentMonth ? "text-blue-400" : "text-zinc-500"}`}>
                      {month.revenue > 0 ? `${month.revenue}€` : "—"}
                    </span>
                    <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${isCurrentMonth ? "bg-blue-600" : "bg-zinc-800 hover:bg-zinc-700"}`}
                        style={{ height: `${height}%`, minHeight: month.revenue > 0 ? "4px" : "0px" }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{month.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Transactions récentes</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white text-xs rounded-full">
                Voir tout →
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {allBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Wallet className="w-12 h-12 text-zinc-700 mb-3" />
                <p className="text-zinc-500 text-sm">Aucune transaction pour le moment.</p>
                <Link href="/cars" className="mt-4">
                  <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white">
                    Faire une réservation
                  </Button>
                </Link>
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
                    {allBookings.slice(0, 10).map((booking) => {
                      const car = (booking as any).cars;
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
                          <td className="py-3 px-2 text-zinc-400">{date}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                              isCompleted ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
                              isPending ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                              "text-red-400 bg-red-400/10 border-red-400/20"
                            }`}>
                              {isCompleted ? "Terminé" : isPending ? "En cours" : "Annulé"}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className={`font-bold ${isCompleted ? "text-green-400" : isPending ? "text-yellow-400" : "text-zinc-500 line-through"}`}>
                              {isCompleted || isPending ? "+" : ""}{booking.total_price?.toLocaleString("fr-FR")} €
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
