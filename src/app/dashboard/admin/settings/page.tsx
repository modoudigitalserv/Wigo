import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-zinc-400" />
            Paramètres Globaux
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Configurez les paramètres généraux de la plateforme Wigo.</p>
        </div>
      </div>

      <Card className="bg-[#121217] border-zinc-800/60 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white text-lg">Frais & Commissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">Commission sur les réservations (%)</label>
              <div className="mt-2 relative">
                <input 
                  type="number" 
                  defaultValue={15} 
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <span className="absolute right-4 top-3 text-zinc-500">%</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Pourcentage prélevé sur chaque transaction réussie.</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-400">Frais de service fixe (€)</label>
              <div className="mt-2 relative">
                <input 
                  type="number" 
                  defaultValue={2.50} 
                  step="0.10"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <span className="absolute right-4 top-3 text-zinc-500">€</span>
              </div>
            </div>
          </div>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
            <Save className="w-4 h-4 mr-2" /> Enregistrer les frais
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#121217] border-red-900/30 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-red-400 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Mode Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 mb-6">
            Activer le mode maintenance désactivera l'accès à la plateforme pour tous les utilisateurs (clients, chauffeurs, entreprises) à l'exception des Super Admins.
          </p>
          <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl">
            Activer le mode maintenance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
