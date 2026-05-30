import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, UserRound, ArrowLeft, MapPin, Clock, ChevronRight, Building2, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import BookingStatusDropdown from "@/components/BookingStatusDropdown";

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  pending:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  active:    "text-purple-400 bg-purple-400/10 border-purple-400/20",
  rejected:  "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmé",
  pending: "En attente",
  completed: "Terminé",
  cancelled: "Annulé",
  active: "En cours",
  rejected: "Refusé",
};

export default async function BookingsPage() {
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

  const role = 
    (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" :
    (profile?.role === "company" || user.email === "company@wigo.test") ? "company" :
    (profile?.role === "driver" || user.email === "driver@wigo.test") ? "driver" :
    (profile?.role || "client");

  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch all bookings for this user with car info
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, cars(brand, model, city)")
    .eq("customer_id", user.sub)
    .order("created_at", { ascending: false });

  // For companies: also fetch bookings for their cars
  let companyBookings: typeof bookings = null;
  if (role === "company") {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", user.sub)
      .single();

    if (company) {
      const { data: cBookings } = await supabase
        .from("bookings")
        .select("*, cars(brand, model, city), profiles!bookings_customer_id_fkey(full_name, email)")
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });
      companyBookings = cBookings;
    }
  }

  const allBookings = role === "company" ? (companyBookings || []) : (bookings || []);
  const stats = {
    total: allBookings.length,
    pending: allBookings.filter(b => b.status === "pending").length,
    active: allBookings.filter(b => ["confirmed", "active"].includes(b.status)).length,
    completed: allBookings.filter(b => b.status === "completed").length,
  };

  // Theme configurations based on role
  const themeColor =
    role === "super_admin" ? "purple" :
    role === "company" ? "blue" :
    role === "driver" ? "orange" : "emerald";

  const theme = {
    purple: {
      bg: "bg-purple-600",
      text: "text-purple-400",
      border: "border-purple-500/20",
      bgLight: "bg-purple-600/10",
      hoverBg: "hover:bg-purple-500",
      iconText: "text-purple-500",
      shadow: "shadow-purple-600/20",
      accentBg: "bg-purple-600/10",
      accentText: "text-purple-400"
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-400",
      border: "border-blue-500/20",
      bgLight: "bg-blue-600/10",
      hoverBg: "hover:bg-blue-500",
      iconText: "text-blue-500",
      shadow: "shadow-blue-600/20",
      accentBg: "bg-blue-600/10",
      accentText: "text-blue-400"
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-400",
      border: "border-orange-500/20",
      bgLight: "bg-orange-600/10",
      hoverBg: "hover:bg-orange-500",
      iconText: "text-orange-500",
      shadow: "shadow-orange-600/20",
      accentBg: "bg-orange-600/10",
      accentText: "text-orange-400"
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      bgLight: "bg-emerald-600/10",
      hoverBg: "hover:bg-emerald-500",
      iconText: "text-emerald-500",
      shadow: "shadow-emerald-600/20",
      accentBg: "bg-emerald-600/10",
      accentText: "text-emerald-400"
    }
  }[themeColor];

  // Set proper navigation links based on role
  let navLinks: any[] = [];
  if (role === "super_admin") {
    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
      { href: "/dashboard/users", label: "Utilisateurs", icon: UserRound },
      { href: "/dashboard/companies", label: "Entreprises", icon: Building2 },
      { href: "/dashboard/drivers", label: "Chauffeurs", icon: Users },
      { href: "/dashboard/all-bookings", label: "Toutes les Réservations", icon: Calendar },
      { href: "/dashboard/settings", label: "Paramètres Globaux", icon: Settings },
    ];
  } else {
    navLinks = [
      { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
      { href: "/dashboard/bookings", label: "Réservations", icon: Calendar, active: true },
      ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
      ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
      { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
    ];
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800/80 p-3 rounded-2xl mb-8">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 ${theme.bg}`}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-white text-base truncate">{displayName}</h3>
              <p className={`text-sm font-medium capitalize ${theme.text}`}>{role === 'super_admin' ? 'Super Admin' : role}</p>
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
                      ? `${theme.bgLight} ${theme.text} border ${theme.border}`
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
            <h1 className="text-3xl font-bold">Réservations</h1>
            <p className="text-zinc-500 mt-1">
              {role === "company"
                ? "Gérez les réservations de vos véhicules."
                : "Suivez vos réservations en temps réel."}
            </p>
          </div>
          {role !== "super_admin" && (
            <Link href="/cars">
              <Button className={`rounded-full text-white font-bold shadow-lg ${theme.bg} ${theme.hoverBg} ${theme.shadow}`}>
                <CarFront className="w-4 h-4 mr-2" />
                Nouvelle réservation
              </Button>
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "En attente", value: stats.pending, color: "text-yellow-400" },
            { label: "En cours", value: stats.active, color: "text-purple-400" },
            { label: "Terminées", value: stats.completed, color: "text-blue-400" },
          ].map((stat) => (
            <Card key={stat.label} className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings List */}
        {allBookings.length === 0 ? (
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Calendar className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">Aucune réservation</h3>
              <p className="text-zinc-600 mb-6 text-center max-w-md">
                {role === "company"
                  ? "Vous n'avez pas encore reçu de réservation. Ajoutez des véhicules pour commencer."
                  : "Vous n'avez pas encore de réservation. Parcourez nos véhicules pour en faire une."}
              </p>
              <Link href={role === "company" ? "/dashboard/cars/new" : "/cars"}>
                <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                  {role === "company" ? "Ajouter un véhicule" : "Voir les véhicules"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allBookings.map((booking) => {
              const car = (booking as any).cars;
              const customer = (booking as any).profiles;
              const carName = car ? `${car.brand} ${car.model}` : "Véhicule";
              const carCity = car?.city || "—";
              const status = booking.status || "pending";
              const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.pending;
              const statusLabel = STATUS_LABELS[status] || status;
              const start = new Date(booking.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
              const end = new Date(booking.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
              const days = Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={booking.id} className="glass-card border-zinc-800/50 bg-zinc-950/80 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Car Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          <CarFront className={`w-6 h-6 ${theme.text}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{carName}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {carCity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {days} jour{days > 1 ? "s" : ""}
                            </span>
                          </div>
                          {role === "company" && customer && (
                            <p className="text-xs text-zinc-500 mt-1">
                              Client: {customer.full_name || customer.email}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Center: Dates */}
                      <div className="flex items-center gap-2 text-sm">
                        <div className="text-center px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold">Départ</p>
                          <p className="font-semibold text-zinc-200">{start}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                        <div className="text-center px-3 py-1.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold">Retour</p>
                          <p className="font-semibold text-zinc-200">{end}</p>
                        </div>
                      </div>

                      {/* Right: Price & Status */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{booking.total_price} €</p>
                          <p className="text-xs text-zinc-500">Total</p>
                        </div>
                        {role === "company" || role === "super_admin" ? (
                          <BookingStatusDropdown bookingId={booking.id} initialStatus={booking.status} />
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyle}`}>
                            {statusLabel}
                          </span>
                        )}
                      </div>
                    </div>
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
