import Link from "next/link";
import { ReactNode } from "react";
import { TrendingUp, Users, Building2, UserRound, Calendar, Settings, LogOut } from "lucide-react";
import { signout } from "@/app/login/actions";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import DashboardRealtimeListener from "@/components/DashboardRealtimeListener";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single();

  const displayName = profile?.full_name || user.email || "Super Admin";
  const role = 
    (profile?.role === "super_admin" || user.email === "admin@wigo.test") ? "super_admin" :
    (profile?.role === "company" || user.email === "company@wigo.test") ? "company" :
    (profile?.role === "driver" || user.email === "driver@wigo.test") ? "driver" :
    (profile?.role || "client");

  if (role !== "super_admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0f] text-zinc-50 font-sans pt-14">
      {/* Realtime Updates */}
      <DashboardRealtimeListener role="super_admin" ownerId={user.sub} />

      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 border-r border-zinc-800/50 bg-[#0f0f13] hidden md:flex md:flex-col pt-8 pb-6">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20">
              SU
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">Super Admin</h1>
              <p className="text-[10px] text-indigo-400 font-medium">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <TrendingUp className="w-4 h-4" /> Vue d'ensemble
          </Link>
          <Link href="/dashboard/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <UserRound className="w-4 h-4" /> Utilisateurs
          </Link>
          <Link href="/dashboard/admin/companies" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <Building2 className="w-4 h-4" /> Entreprises
          </Link>
          <Link href="/dashboard/admin/drivers" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <Users className="w-4 h-4" /> Chauffeurs
          </Link>
          <Link href="/dashboard/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <Calendar className="w-4 h-4" /> Toutes les Réservations
          </Link>
          <Link href="/dashboard/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:text-white hover:bg-zinc-900/50 text-zinc-400 font-medium text-sm transition-colors">
            <Settings className="w-4 h-4" /> Paramètres Globaux
          </Link>
        </nav>

        <div className="px-4 space-y-1 mt-auto">
          <form action={signout}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
