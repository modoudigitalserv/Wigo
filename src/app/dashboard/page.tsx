import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Bell, Settings, ChevronRight, UserRound, Building2, Users, Star, MapPin } from "lucide-react";
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

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();
  const role = 
    (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" :
    (profile?.role === "company" || user.email === "company@wigo.test") ? "company" :
    (profile?.role === "driver" || user.email === "driver@wigo.test") ? "driver" :
    (profile?.role || "client");

  let navLinks: any[] = [];
  let dashboardContent: React.ReactNode;

  // ==========================================
  // SUPER ADMIN
  // ==========================================
  if (role === "super_admin") {
    const [
      { data: allBookings },
      { count: compCount },
      { count: drivCount },
      { data: allPrices },
      { data: companiesSubs },
      { data: driversSubs }
    ] = await Promise.all([
      supabase.from("bookings").select("*, cars(brand, model), customer:profiles!bookings_customer_id_fkey(full_name), company:companies!bookings_company_id_fkey(name)").order("created_at", { ascending: false }).limit(5),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("drivers").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("total_price"),
      supabase.from("companies").select("subscription_plan, subscription_status"),
      supabase.from("drivers").select("subscription_plan, subscription_status")
    ]);

    const totalCompanies = compCount || 0;
    const totalDrivers = drivCount || 0;
    const platformRevenue = allPrices?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    let activeSubs = 0;
    let mrr = 0;
    const planPrices: Record<string, number> = { basic: 0, starter: 0, pro: 49, premium: 99, elite: 149 };

    [...(companiesSubs || []), ...(driversSubs || [])].forEach((sub) => {
      if (sub.subscription_status === 'active' || (sub.subscription_plan !== 'basic' && sub.subscription_plan !== 'starter')) {
        activeSubs++;
        mrr += planPrices[sub.subscription_plan] || 0;
      }
    });

    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp, active: true },
      { href: "/dashboard/users", label: "Utilisateurs", icon: UserRound },
      { href: "/dashboard/companies", label: "Entreprises", icon: Building2 },
      { href: "/dashboard/drivers", label: "Chauffeurs", icon: Users },
      { href: "/dashboard/all-bookings", label: "Toutes les Réservations", icon: Calendar },
      { href: "/dashboard/settings", label: "Paramètres Globaux", icon: Settings },
    ];

    dashboardContent = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">MRR (Abonnements)</CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400">
                {mrr} <span className="text-sm font-normal text-zinc-500 ml-1">€ / mois</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Revenus récurrents estimés</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Abonnés Actifs</CardTitle>
              <Star className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeSubs}</div>
              <p className="text-xs text-zinc-500 mt-1">Sur plans Pro/Premium/Elite</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Volume (Réservations)</CardTitle>
              <Wallet className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {platformRevenue > 0 ? `${Math.round(platformRevenue / 1000)}K` : "0"}
                <span className="text-sm font-normal text-zinc-500 ml-1">€</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Généré sur la plateforme</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Inscrits</CardTitle>
              <Users className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCompanies + totalDrivers}</div>
              <p className="text-xs text-zinc-500 mt-1">{totalCompanies} loueurs • {totalDrivers} chauffeurs</p>
            </CardContent>
          </Card>
        </div>
        <BookingsTable bookings={allBookings || []} role={role} title="Dernières Réservations Globales" />
      </>
    );
  }
  else if (role === "company") {
    let company = null;
    const { data: compData } = await supabase.from("companies").select("*").eq("user_id", user.sub).maybeSingle();
    company = compData;
    if (!company) {
      const { data: newComp } = await supabase.from("companies").insert({
        user_id: user.sub,
        name: "Wigo Location",
        city: "Casablanca",
        phone: "+212600000000",
        is_verified: true
      }).select().single();
      company = newComp;
    }
    const [
      { count: carsCount },
      { data: bookingsData },
      { data: allPrices }
    ] = await Promise.all([
      supabase.from("cars").select("*", { count: "exact", head: true }).eq("company_id", company?.id),
      supabase.from("bookings").select("*, cars(brand, model), customer:profiles!bookings_customer_id_fkey(full_name)").eq("company_id", company?.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("bookings").select("total_price, status").eq("company_id", company?.id)
    ]);


    const activeBookings = allPrices?.filter(b => ["confirmed", "active"].includes(b.status)).length || 0;
    const revenue = allPrices?.filter(b => ["confirmed", "active", "completed"].includes(b.status)).reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp, active: true },
      { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
      { href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront },
      { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
    ];

    dashboardContent = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Revenus Générés</CardTitle>
              <Wallet className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{revenue} <span className="text-sm text-zinc-500 font-normal">€</span></div>
              <p className="text-xs text-zinc-500 mt-1">Total de vos locations facturées</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Flotte Automobile</CardTitle>
              <CarFront className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{carsCount || 0}</div>
              <p className="text-xs text-zinc-500 mt-1">Véhicules publiés</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Locations en cours</CardTitle>
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBookings}</div>
              <p className="text-xs text-zinc-500 mt-1">Réservations actives ou à venir</p>
            </CardContent>
          </Card>
        </div>
        <BookingsTable bookings={bookingsData || []} role={role} title="Dernières Réservations (Véhicules)" />
      </>
    );
  }
  else if (role === "driver") {
    let driver = null;
    const { data: drivData } = await supabase.from("drivers").select("*").eq("user_id", user.sub).maybeSingle();
    driver = drivData;
    if (!driver) {
      const { data: newDriv } = await supabase.from("drivers").insert({
        user_id: user.sub,
        city: "Casablanca",
        experience_years: 5,
        is_verified: true,
        is_available: true
      }).select().single();
      driver = newDriv;
    }
    const [
      { data: driverBookings },
      { data: allPrices }
    ] = await Promise.all([
      supabase.from("driver_bookings").select("*, customer:profiles!driver_bookings_customer_id_fkey(full_name)").eq("driver_id", driver?.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("driver_bookings").select("total_price, status").eq("driver_id", driver?.id)
    ]);

    const completedMissions = allPrices?.filter(b => b.status === 'completed').length || 0;
    const revenue = allPrices?.filter(b => ["confirmed", "active", "completed"].includes(b.status)).reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp, active: true },
      { href: "/dashboard/missions", label: "Mes Missions", icon: MapPin },
      { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
    ];

    dashboardContent = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Gains de Conduite</CardTitle>
              <Wallet className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{revenue} <span className="text-sm text-zinc-500 font-normal">€</span></div>
              <p className="text-xs text-zinc-500 mt-1">Total de vos missions facturées</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Note Moyenne</CardTitle>
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{driver?.rating_average || "—"}</div>
              <p className="text-xs text-zinc-500 mt-1">{driver?.total_reviews || 0} avis reçus</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Missions</CardTitle>
              <MapPin className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedMissions}</div>
              <p className="text-xs text-zinc-500 mt-1">Trajets complétés avec succès</p>
            </CardContent>
          </Card>
        </div>
        <DriverBookingsTable bookings={driverBookings || []} title="Dernières Missions" />
      </>
    );
  }
  // ==========================================
  // CLIENT
  // ==========================================
  else {
    const [
      { data: bookingsData },
      { data: allPrices }
    ] = await Promise.all([
      supabase.from("bookings").select("*, cars(brand, model), company:companies!bookings_company_id_fkey(name)").eq("customer_id", user.sub).order("created_at", { ascending: false }).limit(5),
      supabase.from("bookings").select("total_price, status").eq("customer_id", user.sub)
    ]);

    const activeBookings = allPrices?.filter(b => ["confirmed", "active"].includes(b.status)).length || 0;
    const spent = allPrices?.filter(b => ["confirmed", "active", "completed"].includes(b.status)).reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp, active: true },
      { href: "/dashboard/bookings", label: "Mes Réservations", icon: Calendar },
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
    ];

    dashboardContent = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Total Dépensé</CardTitle>
              <Wallet className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{spent} <span className="text-sm text-zinc-500 font-normal">€</span></div>
              <p className="text-xs text-zinc-500 mt-1">Sur la plateforme Wigo</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Réservations Actives</CardTitle>
              <Calendar className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeBookings}</div>
              <p className="text-xs text-zinc-500 mt-1">Locations en cours ou confirmées</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Mon Profil</CardTitle>
              <UserRound className="w-4 h-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold capitalize text-emerald-400">Client</div>
              <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
            </CardContent>
          </Card>
        </div>
        <BookingsTable bookings={bookingsData || []} role={role} title="Mes Réservations Récentes" />
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 
              ${role === 'super_admin' ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 
                role === 'company' ? 'bg-blue-600' : 
                role === 'driver' ? 'bg-orange-600' : 'bg-emerald-600'}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className={`text-xs capitalize 
                ${role === 'super_admin' ? 'text-purple-400' : 
                  role === 'company' ? 'text-blue-400' : 
                  role === 'driver' ? 'text-orange-400' : 'text-emerald-400'}`}>
                {role === 'super_admin' ? 'Super Admin' : role}
              </p>
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
                      ? "bg-zinc-800 text-white border border-zinc-700"
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

        {dashboardContent}

      </main>
    </div>
  );
}

// Composants internes pour ne pas dupliquer le code des tableaux

function BookingsTable({ bookings, role, title }: { bookings: any[], role: string, title: string }) {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <Card className="glass-card border-zinc-800/50 overflow-hidden">
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  {(role === 'super_admin' || role === 'company') && <th className="px-6 py-4 font-medium">Client</th>}
                  {role === 'client' && <th className="px-6 py-4 font-medium">Loueur</th>}
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Montant</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {bookings.map((bookingItem) => {
                  const booking = bookingItem as any;
                  const car = booking.cars;
                  const carName = car ? `${car.brand} ${car.model}` : "Véhicule supprimé";
                  const start = new Date(booking.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                  const end = new Date(booking.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                  const price = booking.total_price;
                  const statusStyle = STATUS_STYLES[booking.status] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
                  const statusLabel = STATUS_LABELS[booking.status] || booking.status;
                  
                  const customerName = booking.customer?.full_name || "Client";
                  const companyName = booking.company?.name || "-";

                  return (
                    <tr key={booking.id} className="hover:bg-zinc-900/30 transition-colors">
                      {(role === 'super_admin' || role === 'company') && (
                        <td className="px-6 py-4 font-medium text-white">{customerName}</td>
                      )}
                      {role === 'client' && (
                        <td className="px-6 py-4 font-medium text-white">{companyName}</td>
                      )}
                      <td className="px-6 py-4 font-medium text-zinc-300">{carName}</td>
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
            <p className="text-zinc-600 text-sm mb-6">Il n'y a aucune réservation à afficher pour le moment.</p>
          </div>
        )}
      </Card>
    </>
  );
}

function DriverBookingsTable({ bookings, title }: { bookings: any[], title: string }) {
  return (
    <>
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <Card className="glass-card border-zinc-800/50 overflow-hidden">
        {bookings && bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Date de Mission</th>
                  <th className="px-6 py-4 font-medium">Montant</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {bookings.map((bookingItem) => {
                  const booking = bookingItem as any;
                  const start = new Date(booking.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                  const price = booking.total_price;
                  const statusStyle = STATUS_STYLES[booking.status] || "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
                  const statusLabel = STATUS_LABELS[booking.status] || booking.status;
                  const customerName = booking.customer?.full_name || "Client";

                  return (
                    <tr key={booking.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{customerName}</td>
                      <td className="px-6 py-4 text-zinc-400">{start}</td>
                      <td className="px-6 py-4 font-bold text-orange-400">{price} €</td>
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
            <MapPin className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400 mb-2">Aucune mission</h3>
            <p className="text-zinc-600 text-sm mb-6">Vous n'avez pas encore de mission programmée.</p>
          </div>
        )}
      </Card>
    </>
  );
}
