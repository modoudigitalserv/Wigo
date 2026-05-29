import Link from "next/link";
import { ReactNode } from "react";
import { Home, Users, Building2, User, BarChart3, FileText, ShieldCheck } from "lucide-react";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto flex flex-col lg:flex-row min-h-screen">
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/95 p-6">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">Admin SaaS</p>
            <h1 className="mt-4 text-2xl font-bold text-white">Espace Administrateur</h1>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard/admin" className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-slate-800 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
              <Home className="w-4 h-4" /> Tableau de bord
            </Link>
            <Link href="/dashboard/admin/users" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Users className="w-4 h-4" /> Clients
            </Link>
            <Link href="/dashboard/admin/companies" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Building2 className="w-4 h-4" /> Entreprises
            </Link>
            <Link href="/dashboard/admin/chauffeurs" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <User className="w-4 h-4" /> Chauffeurs
            </Link>
            <Link href="/dashboard/admin/reports" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" /> Rapports
            </Link>
            <Link href="/dashboard/admin/moderation" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4" /> Modération
            </Link>
            <Link href="/dashboard/admin/security" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <FileText className="w-4 h-4" /> Sécurité
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
