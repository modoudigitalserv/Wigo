import Link from "next/link";
import { ReactNode } from "react";
import { Home, CreditCard, CalendarDays, UserCircle, Clock } from "lucide-react";

export default function ChauffeurDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/95 p-6">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Dashboard Chauffeur</p>
            <h1 className="mt-4 text-2xl font-bold text-white">Espace Chauffeur</h1>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard/chauffeur" className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
              <Home className="w-4 h-4" /> Tableau de bord
            </Link>
            <Link href="/dashboard/chauffeur/subscription" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <CreditCard className="w-4 h-4" /> Abonnement
            </Link>
            <Link href="/dashboard/chauffeur/availability" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" /> Disponibilité
            </Link>
            <Link href="/dashboard/chauffeur/profile" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <UserCircle className="w-4 h-4" /> Profil
            </Link>
            <Link href="/dashboard/chauffeur/history" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Clock className="w-4 h-4" /> Historique
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
