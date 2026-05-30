import Link from "next/link";
import { ReactNode } from "react";
import { TrendingUp, Car, ListChecks, BarChart3, ShieldCheck, MapPin, Users, Wallet, Settings, HelpCircle, LogOut, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/login/actions";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import DashboardRealtimeListener from "@/components/DashboardRealtimeListener";

export default async function CompanyDashboardLayout({ children }: { children: ReactNode }) {
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

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("user_id", user.sub)
    .maybeSingle();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pt-14">
      {/* Sidebar (identique au dashboard principal) */}
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
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
            <TrendingUp className="w-4 h-4" /> Tableau de bord
          </Link>
          <Link href="/dashboard/company/missions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900/50 font-medium text-sm transition-colors">
            <MapPin className="w-4 h-4" /> Missions
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
        {/* Header commun */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            {/* Le titre h1 sera géré par la page enfant, ici on met juste le statut */}
            <div className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-widest text-emerald-400 flex items-center gap-1.5 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Système en ligne
            </div>
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

        {/* Contenu spécifique de la page (Missions, Analytics, etc.) */}
        {children}
      </main>
    </div>
  );
}
