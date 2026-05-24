import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, Plus, Wrench, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

const STATUS_MAP: Record<string, { label: string; style: string; icon: any }> = {
  disponible: { label: "Disponible", style: "text-green-400 bg-green-400/10 border-green-400/20", icon: CheckCircle2 },
  louee: { label: "Louée", style: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Calendar },
  maintenance: { label: "Maintenance", style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Wrench },
};

export default async function DashboardCarsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = profile?.role || "client";
  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (role !== "company") redirect("/dashboard");

  const { data: company } = await supabase.from("companies").select("id, subscription_plan").eq("user_id", user.sub).single();

  const { data: cars } = company
    ? await supabase.from("cars").select("*, car_images(image_url, is_primary)").eq("company_id", company.id).order("created_at", { ascending: false })
    : { data: [] };

  const allCars = cars || [];
  const available = allCars.filter(c => c.status === "disponible").length;
  const rented = allCars.filter(c => c.status === "louee").length;
  const maintenance = allCars.filter(c => c.status === "maintenance").length;

  const planLimits: Record<string, number> = { basic: 10, pro: 50, premium: 9999 };
  const maxCars = planLimits[company?.subscription_plan || "basic"] || 10;

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    { href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront, active: true },
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
            <h1 className="text-3xl font-bold">Mes Véhicules</h1>
            <p className="text-zinc-500 mt-1">{allCars.length}/{maxCars === 9999 ? "∞" : maxCars} véhicules ({company?.subscription_plan || "basic"})</p>
          </div>
          <Link href="/dashboard/cars/new">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
              <Plus className="w-4 h-4 mr-2" /> Ajouter un véhicule
            </Button>
          </Link>
        </div>

        {/* Quota Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>{allCars.length} véhicule{allCars.length > 1 ? "s" : ""}</span>
            <span>Limite: {maxCars === 9999 ? "illimitée" : maxCars}</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${allCars.length >= maxCars ? "bg-red-500" : "bg-blue-600"}`}
              style={{ width: `${Math.min((allCars.length / maxCars) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Disponibles", value: available, color: "text-green-400" },
            { label: "Louées", value: rented, color: "text-purple-400" },
            { label: "Maintenance", value: maintenance, color: "text-yellow-400" },
          ].map(s => (
            <Card key={s.label} className="glass-card border-zinc-800/50 bg-zinc-950/80">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cars List */}
        {allCars.length === 0 ? (
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <CarFront className="w-16 h-16 text-zinc-700 mb-4" />
              <h3 className="text-xl font-bold text-zinc-400 mb-2">Aucun véhicule</h3>
              <p className="text-zinc-600 mb-6 text-center">Ajoutez votre premier véhicule pour commencer.</p>
              <Link href="/dashboard/cars/new">
                <Button className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Ajouter un véhicule
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCars.map((car: any) => {
              const img = car.car_images?.find((i: any) => i.is_primary)?.image_url || PLACEHOLDER_IMG;
              const statusInfo = STATUS_MAP[car.status] || STATUS_MAP.disponible;
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={car.id} className="glass-card border-zinc-800/50 overflow-hidden group hover:border-zinc-700 transition-colors">
                  <div className="relative h-44 overflow-hidden bg-zinc-900">
                    <Image src={img} alt={`${car.brand} ${car.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${statusInfo.style}`}>
                        <StatusIcon className="w-3 h-3" /> {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg text-white">{car.brand} {car.model}</h3>
                    <p className="text-sm text-zinc-500 capitalize">{car.fuel} • {car.transmission} • {car.city}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-bold text-blue-400">{car.price_day} <span className="text-xs text-zinc-500 font-normal">€/jour</span></span>
                      <Link href={`/cars/${car.id}`}>
                        <Button size="sm" variant="outline" className="rounded-full border-zinc-700 text-zinc-300 text-xs">
                          Voir →
                        </Button>
                      </Link>
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
