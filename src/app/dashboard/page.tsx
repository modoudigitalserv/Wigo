import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Bell, Settings, ChevronRight, UserRound, Star } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { signout } from "@/app/login/actions";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  pending:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  active:    "text-purple-400 bg-purple-400/10 border-purple-400/20",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmé",
  pending: "En attente",
  completed: "Terminé",
  cancelled: "Annulé",
  active: "En cours",
  rejected: "Refusé",
};

export default async function DashboardPage() {
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

  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();
  const role = profile?.role || "client";

  // Fetch bookings (cars) for this user
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, cars(brand, model)")
    .eq("customer_id", user.sub)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch driver bookings if driver
  const { data: driverBookings } = role === "driver"
    ? await supabase
        .from("driver_bookings")
        .select("*")
        .eq("customer_id", user.sub)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: null };

  // Fetch company data if company
  const { data: company } = role === "company"
    ? await supabase
        .from("companies")
        .select("*, cars(count)")
        .eq("user_id", user.sub)
        .single()
    : { data: null };

  // Stats
  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter(b => ["confirmed", "active", "pending"].includes(b.status)).length || 0;
  const totalSpent = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp, active: true },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
    ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
    { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          {/* User Info */}
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
                    link.active
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign out */}
        <div className="p-6 border-t border-zinc-800">
          <form action={signout}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
              Se déconnecter
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {displayName.split(" ")[0]} 👋</h1>
            <p className="text-zinc-400 text-sm mt-1">Voici un aperçu de votre activité.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-400 rounded-full">
              <Bell className="w-4 h-4" />
            </Button>
            {role === "company" && (
              <Link href="/dashboard/cars/new">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                  + Ajouter un véhicule
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total dépensé</CardTitle>
              <Wallet className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalSpent > 0 ? `${Math.round(totalSpent / 1000)}K` : "—"}
                <span className="text-sm font-normal text-zinc-500 ml-1">€</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Total de vos réservations</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Réservations Actives</CardTitle>
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBookings}</div>
              <p className="text-xs text-zinc-500 mt-1">{totalBookings} réservation{totalBookings > 1 ? "s" : ""} au total</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Mon Profil</CardTitle>
              <UserRound className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold capitalize text-blue-400">{role}</div>
              <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <h2 className="text-lg font-bold mb-4">Mes Réservations Récentes</h2>
        <Card className="glass-card border-zinc-800/50 overflow-hidden">
          {bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Véhicule</th>
                    <th className="px-6 py-4 font-medium">Dates</th>
                    <th className="px-6 py-4 font-medium">Montant</th>
                    <th className="px-6 py-4 font-medium">Statut</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {bookings.map((booking) => {
                    const car = (booking as any).cars;
                    const carName = car ? `${car.brand} ${car.model}` : "Véhicule";
                    const start = new Date(booking.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                    const end = new Date(booking.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                    const price = Math.round(booking.total_price / 1000);
                    const statusStyle = STATUS_STYLES[booking.status] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
                    const statusLabel = STATUS_LABELS[booking.status] || booking.status;

                    return (
                      <tr key={booking.id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{carName}</td>
                        <td className="px-6 py-4 text-zinc-400">{start} – {end}</td>
                        <td className="px-6 py-4 font-bold">{price} €</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="w-12 h-12 text-zinc-700 mb-4" />
              <h3 className="text-lg font-semibold text-zinc-400 mb-2">Aucune réservation</h3>
              <p className="text-zinc-600 text-sm mb-6">Vous n&apos;avez pas encore effectué de réservation.</p>
              <Link href="/cars">
                <Button className="bg-blue-600 hover:bg-blue-500 rounded-full">
                  Explorer les véhicules
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

