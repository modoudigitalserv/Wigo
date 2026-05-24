import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Settings, CreditCard, Receipt, ArrowUpRight, CheckCircle2, Crown, UserRound, Building2, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { simulateUpgrade } from "./actions";

const PLAN_DETAILS: Record<string, { label: string; price: number; color: string; features: string[] }> = {
  basic: { label: "Basic", price: 29, color: "text-zinc-400", features: ["10 véhicules max", "Stats basiques", "Support email"] },
  pro: { label: "Pro", price: 79, color: "text-blue-400", features: ["50 véhicules max", "Boost marketplace", "Dashboard avancé", "Support prioritaire"] },
  premium: { label: "Premium", price: 149, color: "text-yellow-400", features: ["Véhicules illimités", "Priorité marketplace", "Analytics avancés", "Support VIP 24/7"] },
  starter: { label: "Starter", price: 19, color: "text-zinc-400", features: ["10 missions max", "Visibilité standard", "Support email"] },
  elite: { label: "Elite", price: 99, color: "text-yellow-400", features: ["Priorité maximale", "Missions VIP", "Badge Premium", "Support VIP 24/7"] },
};

export default async function BillingPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.sub).single();
  const role = 
    (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" :
    (profile?.role === "company" || user.email === "company@wigo.test") ? "company" :
    (profile?.role === "driver" || user.email === "driver@wigo.test") ? "driver" :
    (profile?.role || "client");

  const displayName = profile?.full_name || user.email || "Utilisateur";
  const initials = displayName.slice(0, 2).toUpperCase();

  // Get current plan info
  let currentPlan = "basic";
  let renewalDate = "—";
  let usageCount = 0;
  let usageLimit = 10;

  if (role === "company") {
    const { data: company } = await supabase.from("companies").select("*, cars(count)").eq("user_id", user.sub).single();
    currentPlan = company?.subscription_plan || "basic";
    usageCount = (company as any)?.cars?.[0]?.count || 0;
    const limits: Record<string, number> = { basic: 10, pro: 50, premium: 9999 };
    usageLimit = limits[currentPlan] || 10;
  } else if (role === "driver") {
    const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", user.sub).single();
    if (driver) {
      const { data: usage } = await supabase.from("driver_usage_stats").select("*").eq("driver_id", driver.id).single();
      currentPlan = usage?.current_plan || "starter";
      usageCount = usage?.completed_missions || 0;
      const limits: Record<string, number> = { starter: 10, pro: 9999, elite: 9999 };
      usageLimit = limits[currentPlan] || 10;
    }

    const { data: sub } = driver
      ? await supabase.from("driver_subscriptions").select("*").eq("driver_id", driver.id).eq("status", "active").single()
      : { data: null };
    if (sub?.current_period_end) {
      renewalDate = new Date(sub.current_period_end).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    }
  }

  const planInfo = PLAN_DETAILS[currentPlan] || PLAN_DETAILS.basic;
  const usagePercent = usageLimit === 9999 ? 0 : Math.min((usageCount / usageLimit) * 100, 100);

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
      gradient: "from-purple-600/20 to-indigo-600/10",
      accentBg: "bg-purple-600/20",
      accentText: "text-purple-400",
      accentBorder: "border-purple-400/20",
      shadow: "shadow-purple-600/20",
      cardGradient: "from-purple-700 to-purple-500"
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-400",
      border: "border-blue-500/20",
      bgLight: "bg-blue-600/10",
      hoverBg: "hover:bg-blue-500",
      iconText: "text-blue-500",
      gradient: "from-blue-600/20 to-indigo-600/10",
      accentBg: "bg-blue-600/20",
      accentText: "text-blue-400",
      accentBorder: "border-blue-400/20",
      shadow: "shadow-blue-600/20",
      cardGradient: "from-blue-700 to-blue-500"
    },
    orange: {
      bg: "bg-orange-600",
      text: "text-orange-400",
      border: "border-orange-500/20",
      bgLight: "bg-orange-600/10",
      hoverBg: "hover:bg-orange-500",
      iconText: "text-orange-500",
      gradient: "from-orange-600/20 to-indigo-600/10",
      accentBg: "bg-orange-600/20",
      accentText: "text-orange-400",
      accentBorder: "border-orange-400/20",
      shadow: "shadow-orange-600/20",
      cardGradient: "from-orange-700 to-orange-500"
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      bgLight: "bg-emerald-600/10",
      hoverBg: "hover:bg-emerald-500",
      iconText: "text-emerald-500",
      gradient: "from-emerald-600/20 to-indigo-600/10",
      accentBg: "bg-emerald-600/20",
      accentText: "text-emerald-400",
      accentBorder: "border-emerald-400/20",
      shadow: "shadow-emerald-600/20",
      cardGradient: "from-emerald-700 to-emerald-500"
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
      { href: "/dashboard/bookings", label: "Réservations", icon: Calendar },
      ...(role === "company" ? [{ href: "/dashboard/cars", label: "Mes Véhicules", icon: CarFront }] : []),
      ...(role === "driver" ? [{ href: "/dashboard/missions", label: "Mes Missions", icon: CarFront }] : []),
      { href: "/dashboard/revenues", label: "Revenus", icon: Wallet },
      { href: "/dashboard/billing", label: "Abonnement", icon: CreditCard, active: true },
      { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
    ];
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:flex md:flex-col">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${theme.bg}`}>{initials}</div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className={`text-xs capitalize ${theme.text}`}>{role === 'super_admin' ? 'Super Admin' : role}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                    (link as any).active ? `${theme.bgLight} ${theme.text} border ${theme.border}` : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}>
                  <Icon className="w-4 h-4" />{link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Abonnement & Facturation</h1>
          <p className="text-zinc-500 mb-8">Gérez votre abonnement et consultez vos factures.</p>

          {/* Current Plan */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6 overflow-hidden">
            <div className={`bg-gradient-to-r ${theme.gradient} p-6 border-b border-zinc-800/50`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.accentBg}`}>
                    <Crown className={`w-6 h-6 ${planInfo.color}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      Plan {planInfo.label}
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${theme.accentText} ${theme.accentBorder}`}>Actif</span>
                    </h2>
                    <p className="text-sm text-zinc-500">{renewalDate !== "—" ? `Renouvellement: ${renewalDate}` : "Abonnement mensuel"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-white">{planInfo.price} €</p>
                  <p className="text-xs text-zinc-500">/ mois</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              {/* Features */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {planInfo.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${theme.iconText}`} /> {f}
                  </li>
                ))}
              </ul>

              {/* Usage Bar */}
              {usageLimit < 9999 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Utilisation: {usageCount} / {usageLimit}</span>
                    <span>{Math.round(usagePercent)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${usagePercent >= 90 ? "bg-red-500" : usagePercent >= 70 ? "bg-yellow-500" : theme.bg}`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <form action={simulateUpgrade.bind(null, role === 'company' ? 'pro' : 'elite')}>
                  <Button type="submit" className={`rounded-full text-white font-bold shadow-lg ${theme.bg} ${theme.hoverBg} ${theme.shadow}`}>
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Simuler Upgrade ({role === 'company' ? 'Pro' : 'Elite'})
                  </Button>
                </form>
                <Button variant="outline" className="rounded-full border-zinc-700 text-zinc-300">
                  Annuler l&apos;abonnement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className={`w-5 h-5 ${theme.iconText}`} /> Mode de paiement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-7 rounded bg-gradient-to-r flex items-center justify-center ${theme.cardGradient}`}>
                    <span className="text-white text-[10px] font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">•••• •••• •••• 4242</p>
                    <p className="text-xs text-zinc-500">Expire 12/27</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-zinc-700 text-zinc-400 text-xs">
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Invoice History */}
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Receipt className={`w-5 h-5 ${theme.iconText}`} /> Historique des factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "1 Mai 2026", amount: `${planInfo.price} €`, status: "Payée" },
                  { date: "1 Avr 2026", amount: `${planInfo.price} €`, status: "Payée" },
                  { date: "1 Mar 2026", amount: `${planInfo.price} €`, status: "Payée" },
                ].map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Facture — {inv.date}</p>
                        <p className="text-xs text-zinc-500">{inv.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">{inv.status}</span>
                      <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-white text-xs">
                        PDF ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
