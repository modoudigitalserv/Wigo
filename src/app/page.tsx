import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Search, Star, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop"
            alt="Luxury Car"
            fill
            className="object-cover object-center opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center mt-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-blue-400 mb-6 border-blue-500/20">
            <ShieldCheck className="w-4 h-4" /> Plateforme n°1 au Sénégal
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            L'Excellence <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              en Mouvement
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            Louez des véhicules d'exception ou réservez un chauffeur privé professionnel en quelques clics.
          </p>

          {/* Floating Search Bar */}
          <div className="max-w-4xl mx-auto glass rounded-full p-2 flex flex-col md:flex-row items-center gap-2 md:gap-4 backdrop-blur-2xl bg-black/50 border-white/10 shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Lieu</p>
                <input type="text" placeholder="Dakar, Sénégal" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Dates</p>
                <input type="text" placeholder="Ajouter des dates" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium" />
              </div>
            </div>

            <Button size="lg" className="w-full md:w-auto h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg shadow-blue-600/20 m-1">
              <Search className="w-5 h-5 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">Véhicules Populaires</h2>
          <Button variant="link" className="text-blue-400 hover:text-blue-300">
            Voir tout &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="glass-card overflow-hidden group cursor-pointer border-zinc-800/50">
              <div className="relative h-64 overflow-hidden rounded-t-3xl bg-zinc-900">
                <Image
                  src={`https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop`}
                  alt="BMW"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-white">4.9</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">BMW Série 5 M-Sport</h3>
                    <p className="text-sm text-zinc-400">Automatique • Essence</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">85K</p>
                    <p className="text-xs text-zinc-500">FCFA / jour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
