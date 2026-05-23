import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarFront, Calendar, Wallet, TrendingUp, Bell, Settings, LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-zinc-50 font-sans pt-16">
      {/* Sidebar Dashboard */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950/50 hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              MG
            </div>
            <div>
              <p className="font-bold text-sm">Modou Gueye</p>
              <p className="text-xs text-zinc-500">Plan Pro</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600/10 text-blue-500 font-medium">
              <TrendingUp className="w-4 h-4" /> Vue d'ensemble
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <Calendar className="w-4 h-4" /> Réservations
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <CarFront className="w-4 h-4" /> Mes Véhicules
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <Wallet className="w-4 h-4" /> Revenus
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <Settings className="w-4 h-4" /> Paramètres
            </Link>
          </nav>
        </div>
        <div className="absolute bottom-4 w-64 px-6">
          <Button variant="ghost" className="w-full justify-start text-zinc-500 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vue d'ensemble</h1>
            <p className="text-zinc-400 text-sm">Bienvenue sur votre espace de gestion.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="border-zinc-800 text-zinc-400 rounded-full">
              <Bell className="w-4 h-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full">
              + Ajouter un véhicule
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Revenus Mensuels</CardTitle>
              <Wallet className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1 450 000 <span className="text-sm font-normal text-zinc-500">FCFA</span></div>
              <p className="text-xs text-green-500 mt-1 flex items-center">+12.5% depuis le mois dernier</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Réservations Actives</CardTitle>
              <Calendar className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center">3 en attente de validation</p>
            </CardContent>
          </Card>
          <Card className="glass-card border-zinc-800/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">Taux d'occupation</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78%</div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings Table */}
        <h2 className="text-lg font-bold mb-4">Réservations Récentes</h2>
        <Card className="glass-card border-zinc-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Montant</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {[
                  { car: "BMW Série 5", client: "Amadou D.", dates: "12 - 15 Mai", price: "255K", status: "Confirmé", color: "text-green-400 bg-green-400/10 border-green-400/20" },
                  { car: "Range Rover", client: "Fatou N.", dates: "18 - 20 Mai", price: "240K", status: "En attente", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
                  { car: "Mercedes S", client: "Omar B.", dates: "01 - 05 Juin", price: "750K", status: "Payé", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row.car}</td>
                    <td className="px-6 py-4 text-zinc-300">{row.client}</td>
                    <td className="px-6 py-4 text-zinc-400">{row.dates}</td>
                    <td className="px-6 py-4 font-bold">{row.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
