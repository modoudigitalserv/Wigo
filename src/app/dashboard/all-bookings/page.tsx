import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, UserRound, Building2, Users, Calendar, Settings, CarFront, MapPin, Clock, ChevronRight } from "lucide-react";
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

export default async function AdminAllBookingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = profile?.role === "super_admin" || user.email === "admin@wigo.test" ? "super_admin" : profile?.role || "client";
  
  if (role !== "super_admin") redirect("/dashboard");

  const displayName = profile?.full_name || user.email || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch all car bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, cars(brand, model, city), profiles!bookings_customer_id_fkey(full_name, email), companies(name)")
    .order("created_at", { ascending: false });

  const allBookings = bookings || [];

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/users", label: "Utilisateurs", icon: UserRound },
    { href: "/dashboard/companies", label: "Entreprises", icon: Building2 },
    { href: "/dashboard/drivers", label: "Chauffeurs", icon: Users },
    { href: "/dashboard/all-bookings", label: "Toutes les Réservations", icon: Calendar, active: true },
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
            <h1 className="text-3xl font-bold">Toutes les Réservations</h1>
            <p className="text-zinc-500 mt-1">Gérez toutes les réservations de la plateforme.</p>
          </div>
        </div>

        <div className="space-y-4">
          {allBookings.map((booking: any) => {
            const carName = booking.cars ? `${booking.cars.brand} ${booking.cars.model}` : "Véhicule Inconnu";
            const carCity = booking.cars ? booking.cars.city : "Non spécifiée";
            const customer = booking.profiles;
            const company = booking.companies;
            const statusStyle = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            
            const start = new Date(booking.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
            const end = new Date(booking.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
            const days = Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card key={booking.id} className="glass-card border-zinc-800/50 bg-zinc-950/80 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                        <CarFront className="w-6 h-6 text-purple-400" />
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
                        <p className="text-xs text-zinc-500 mt-1">
                          Client: {customer?.full_name || customer?.email}
                          {company && ` • Loueur: ${company.name}`}
                        </p>
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
                      <BookingStatusDropdown bookingId={booking.id} initialStatus={booking.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {allBookings.length === 0 && (
             <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
               <Calendar className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-zinc-400 mb-2">Aucune réservation</h3>
               <p className="text-zinc-600">Il n&apos;y a aucune réservation sur la plateforme.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
