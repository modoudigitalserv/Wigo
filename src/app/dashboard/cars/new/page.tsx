import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CarFront, UploadCloud } from "lucide-react";
import Link from "next/link";
import { addCar } from "../actions";
import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";

export default async function NewCarPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.sub).single();
  if (profile?.role !== "company") {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-black text-zinc-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Ajouter un Véhicule</h1>
            <p className="text-zinc-400 text-sm mt-1">Publiez une nouvelle voiture sur la marketplace Wigo.</p>
          </div>
        </div>

        {/* Formulaire */}
        <form action={addCar} className="space-y-8">
          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarFront className="w-5 h-5 text-blue-500" /> Informations générales
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Renseignez les informations de base du véhicule.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-zinc-300">Marque <span className="text-red-500">*</span></Label>
                <Input id="brand" name="brand" placeholder="Ex: Mercedes-Benz" required className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model" className="text-zinc-300">Modèle <span className="text-red-500">*</span></Label>
                <Input id="model" name="model" placeholder="Ex: Classe S" required className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year" className="text-zinc-300">Année <span className="text-red-500">*</span></Label>
                <Input id="year" name="year" type="number" min="2000" max={new Date().getFullYear() + 1} placeholder="Ex: 2023" required className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city" className="text-zinc-300">Ville <span className="text-red-500">*</span></Label>
                <Input id="city" name="city" placeholder="Ex: Casablanca" required className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>

            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardHeader>
              <CardTitle>Caractéristiques & Tarifs</CardTitle>
              <CardDescription className="text-zinc-400">
                Détails techniques et prix de location.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <Label htmlFor="fuel" className="text-zinc-300">Carburant</Label>
                <select id="fuel" name="fuel" className="flex h-12 w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybride">Hybride</option>
                  <option value="electrique">Électrique</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-zinc-300">Transmission</Label>
                <select id="transmission" name="transmission" className="flex h-12 w-full items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="automatique">Automatique</option>
                  <option value="manuelle">Manuelle</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats" className="text-zinc-300">Nombre de places</Label>
                <Input id="seats" name="seats" type="number" defaultValue="5" min="2" max="9" className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_day" className="text-zinc-300">Prix par jour (€) <span className="text-red-500">*</span></Label>
                <Input id="price_day" name="price_day" type="number" min="0" placeholder="Ex: 80" required className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-zinc-300">Description</Label>
                <Textarea id="description" name="description" placeholder="Décrivez les atouts de ce véhicule..." className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 min-h-[100px] rounded-xl" />
              </div>

            </CardContent>
          </Card>

          <Card className="glass-card border-zinc-800/50 bg-zinc-950/80">
            <CardHeader>
              <CardTitle>Photo du véhicule</CardTitle>
              <CardDescription className="text-zinc-400">
                Ajoutez une photo claire et attrayante pour mettre en valeur votre voiture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 border-dashed rounded-xl cursor-pointer bg-zinc-900/50 hover:bg-zinc-900 hover:border-blue-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-zinc-400" />
                    <p className="mb-2 text-sm text-zinc-400"><span className="font-semibold text-blue-400">Cliquez pour uploader</span> ou glissez-déposez</p>
                    <p className="text-xs text-zinc-500">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                  <input id="image" name="image" type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="h-12 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20">
              Publier le véhicule
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
