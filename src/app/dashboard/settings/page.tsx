import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, User, Shield, Bell, Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const city = formData.get("city") as string;

  await supabase
    .from("profiles")
    .update({ full_name, phone, city })
    .eq("id", user.sub);

  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings");
}

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const role = profile?.role || "client";
  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Fetch driver data if driver
  let driver: any = null;
  if (role === "driver") {
    const { data: d } = await supabase.from("drivers").select("*").eq("user_id", user.sub).single();
    driver = d;
  }

  // Fetch company data if company
  let company: any = null;
  if (role === "company") {
    const { data: c } = await supabase.from("companies").select("*").eq("user_id", user.sub).single();
    company = c;
  }

  const navLinks = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: TrendingUp },
    { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
    ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
    ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
    { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
    { href: "/dashboard/settings", label: "Paramètres", icon: Settings, active: true },
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

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-zinc-500 mb-8">Gérez votre profil et vos préférences.</p>

          {/* Avatar Section */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6">
            <CardContent className="p-6 flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{displayName}</h3>
                <p className="text-sm text-zinc-500">{user.email}</p>
                <p className="text-xs text-blue-400 capitalize mt-1">{role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" /> Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Nom complet</label>
                    <Input name="full_name" defaultValue={profile?.full_name || ""} placeholder="Votre nom"
                      className="bg-zinc-900 border-zinc-800 text-white rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Téléphone</label>
                    <Input name="phone" defaultValue={profile?.phone || ""} placeholder="+212 6XX XXX XXX"
                      className="bg-zinc-900 border-zinc-800 text-white rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Ville</label>
                  <Input name="city" defaultValue={profile?.city || ""} placeholder="Casablanca"
                    className="bg-zinc-900 border-zinc-800 text-white rounded-xl" />
                </div>
                <Button type="submit" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold">
                  Sauvegarder
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Company Section */}
          {role === "company" && (
            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CarFront className="w-5 h-5 text-blue-500" /> Informations entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Nom de l&apos;entreprise</label>
                    <Input defaultValue={company?.name || ""} disabled className="bg-zinc-900 border-zinc-800 text-zinc-400 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Plan actuel</label>
                    <Input defaultValue={company?.subscription_plan || "basic"} disabled className="bg-zinc-900 border-zinc-800 text-zinc-400 rounded-xl capitalize" />
                  </div>
                </div>
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="rounded-full border-zinc-700 text-zinc-300 mt-2">
                    Gérer l&apos;abonnement →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Driver Section */}
          {role === "driver" && (
            <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" /> Documents (KYC)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-500">Téléversez vos documents pour vérification.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Shield className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">Permis de conduire</p>
                    <p className="text-xs text-zinc-600 mt-1">{driver?.license_url ? "✅ Envoyé" : "Cliquer pour uploader"}</p>
                  </div>
                  <div className="border border-dashed border-zinc-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <User className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">CIN / Passeport</p>
                    <p className="text-xs text-zinc-600 mt-1">{driver?.identity_url ? "✅ Envoyé" : "Cliquer pour uploader"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                    driver?.is_verified
                      ? "text-green-400 bg-green-400/10 border-green-400/20"
                      : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                  }`}>
                    {driver?.is_verified ? "Vérifié" : "En cours de vérification"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" /> Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-1.5 block">Email</label>
                <Input defaultValue={user.email as string} disabled className="bg-zinc-900 border-zinc-800 text-zinc-400 rounded-xl" />
              </div>
              <Button variant="outline" className="rounded-full border-zinc-700 text-zinc-300">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
