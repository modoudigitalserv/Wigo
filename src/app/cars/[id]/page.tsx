import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShieldCheck, MapPin, CheckCircle2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CarDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch data based on params.id
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-10 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/cars" className="inline-flex items-center text-zinc-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Retour aux véhicules
        </Link>

        {/* Image Gallery Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 h-[40vh] md:h-[60vh]">
          <div className="relative h-full w-full rounded-l-3xl overflow-hidden bg-zinc-900">
            <Image 
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop" 
              alt="BMW" fill className="object-cover" 
            />
          </div>
          <div className="grid grid-rows-2 gap-4 h-full">
            <div className="relative h-full w-full rounded-tr-3xl overflow-hidden bg-zinc-900">
              <Image src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop" alt="Intérieur" fill className="object-cover" />
            </div>
            <div className="relative h-full w-full rounded-br-3xl overflow-hidden bg-zinc-900">
              <Image src="https://images.unsplash.com/photo-1503376712341-ea1c9b311756?q=80&w=2070&auto=format&fit=crop" alt="Détail" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                <span className="font-bold text-lg border-2 border-white px-4 py-2 rounded-full">Voir les 12 photos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Info Column */}
          <div className="flex-1 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Premium</span>
                <span className="flex items-center text-yellow-500 text-sm font-bold"><Star className="w-4 h-4 mr-1 fill-yellow-500" /> 4.9 (120 avis)</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">BMW Série 5 M-Sport</h1>
              <p className="text-zinc-400 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> Dakar, Almadies
              </p>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold mb-6">Caractéristiques</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: "Transmission", value: "Automatique" },
                  { label: "Carburant", value: "Essence" },
                  { label: "Places", value: "5 places" },
                  { label: "Climatisation", value: "Inclus" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-zinc-500 text-sm">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-zinc-400 leading-relaxed">
                Louez cette magnifique BMW Série 5 M-Sport pour vos déplacements professionnels ou vos week-ends. 
                Alliant confort absolu, sportivité et technologies de pointe, elle vous garantit une expérience 
                de conduite inoubliable au Sénégal. Entretien régulier et propreté impeccable garantis.
              </p>
            </div>
          </div>

          {/* Booking Sticky Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24">
              <Card className="glass-card border-zinc-800 p-6">
                <div className="mb-6">
                  <p className="text-3xl font-extrabold text-white">85 000 <span className="text-lg font-normal text-zinc-400">FCFA / jour</span></p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-zinc-700 rounded-xl p-3 bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 uppercase font-bold">Départ</p>
                      <p className="text-sm">Ajouter date</p>
                    </div>
                    <div className="border border-zinc-700 rounded-xl p-3 bg-zinc-900/50">
                      <p className="text-xs text-zinc-500 uppercase font-bold">Retour</p>
                      <p className="text-sm">Ajouter date</p>
                    </div>
                  </div>
                  
                  <div className="border border-zinc-700 rounded-xl p-4 bg-zinc-900/50 flex items-start justify-between cursor-pointer hover:border-blue-500 transition-colors">
                    <div>
                      <p className="font-bold">Option Chauffeur</p>
                      <p className="text-xs text-zinc-400">Professionnel anglophone/francophone</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">+ 15 000</p>
                      <p className="text-[10px] text-zinc-500">FCFA / jour</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-14 text-lg font-bold rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 mb-4">
                  Réserver ce véhicule
                </Button>
                
                <p className="text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Aucun montant débité avant confirmation
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
