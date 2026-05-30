"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Search, Star, ShieldCheck, CarFront, UserRound, ArrowRight, CheckCircle2, ChevronRight, Mail } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop";
const TESLA_IMG = "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop";
const RANGE_IMG = "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=2070&auto=format&fit=crop";
const MERCEDES_IMG = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop";
const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop";

const DRIVERS = [
  {
    name: "Jean D.",
    role: "Partenaire Élite",
    exp: "12 ans exp.",
    quote: "La ponctualité est la politesse des rois. Votre confort est ma priorité absolue.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Marc A.",
    role: "Chauffeur Spécialisé",
    exp: "8 ans exp.",
    quote: "Spécialisé dans les transferts VIP. Je garantis une discrétion totale pour tous vos trajets.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop"
  },
  {
    name: "Sophie L.",
    role: "Concierge Drive",
    exp: "15 ans exp.",
    quote: "Plus qu'un trajet, une expérience sur mesure adaptée à votre emploi du temps.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974&auto=format&fit=crop"
  }
];

export default function LandingClient({ cars }: { cars: any[] }) {
  const [selectedService, setSelectedService] = useState("Voiture Seule");

  // Format cars to map standard structure or mock if empty
  const featuredCars = [
    {
      id: cars[0]?.id || "1",
      brand: cars[0]?.brand || "Tesla",
      model: cars[0]?.model || "Model S Plaid",
      category: "PREMIUM ELECTRIC",
      specs: "Autonomie 630km • 0-100 en 2.1s",
      price: cars[0]?.price_day || 450,
      image: cars[0]?.car_images?.find((i: any) => i.is_primary)?.image_url || TESLA_IMG
    },
    {
      id: cars[1]?.id || "2",
      brand: cars[1]?.brand || "Range Rover",
      model: cars[1]?.model || "Sport M-Sport",
      category: "LUXURY SUV",
      specs: "Confort Absolu • 5 Places",
      price: cars[1]?.price_day || 350,
      image: cars[1]?.car_images?.find((i: any) => i.is_primary)?.image_url || RANGE_IMG
    },
    {
      id: cars[2]?.id || "3",
      brand: cars[2]?.brand || "Mercedes-Benz",
      model: cars[2]?.model || "Classe S",
      category: "BUSINESS CLASS",
      specs: "L'Icône du Luxe",
      price: cars[2]?.price_day || 500,
      image: cars[2]?.car_images?.find((i: any) => i.is_primary)?.image_url || MERCEDES_IMG
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#070708] text-zinc-100 font-sans overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 px-4 overflow-hidden">
        {/* Background Image & Glowing vertical lines */}
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_BG}
            alt="Luxury Car Tunnel"
            fill
            className="object-cover object-center opacity-30 mix-blend-screen"
            priority
            sizes="100vw"
          />
          {/* Neon vertical highlights simulation */}
          <div className="absolute inset-y-0 left-1/4 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent blur-[2px]" />
          <div className="absolute inset-y-0 right-1/4 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070708]/80 via-transparent to-[#070708]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-5xl text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white"
          >
            L&apos;Excellence du Voyage,<br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Redéfinie.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mb-12 leading-relaxed"
          >
            Accédez à une flotte exclusive de véhicules de prestige et des chauffeurs d&apos;exception pour vos déplacements les plus exigeants.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-3 flex flex-col md:flex-row items-center gap-3 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Lieu</p>
                <select defaultValue="" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-700 font-semibold text-sm appearance-none cursor-pointer">
                  <option value="" disabled className="text-zinc-500">Ville, Pays</option>
                  <option value="Casablanca, Maroc" className="text-black">Casablanca, Maroc</option>
                  <option value="Rabat, Maroc" className="text-black">Rabat, Maroc</option>
                  <option value="Marrakech, Maroc" className="text-black">Marrakech, Maroc</option>
                  <option value="Tanger, Maroc" className="text-black">Tanger, Maroc</option>
                  <option value="Agadir, Maroc" className="text-black">Agadir, Maroc</option>
                  <option value="Fès, Maroc" className="text-black">Fès, Maroc</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Date</p>
                <input type="date" min={new Date().toISOString().split('T')[0]} className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-700 font-semibold text-sm [color-scheme:dark]" />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <UserRound className="w-5 h-5 text-blue-500 shrink-0" />
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Service</p>
                <select 
                  value={selectedService} 
                  onChange={(e) => setSelectedService(e.target.value)} 
                  className="bg-transparent border-none outline-none text-white w-full font-semibold text-sm appearance-none cursor-pointer"
                >
                  <option value="Chauffeur Privé" className="text-black">Chauffeur Privé</option>
                  <option value="Voiture Seule" className="text-black">Voiture Seule</option>
                  <option value="Voiture + Chauffeur" className="text-black">Voiture + Chauffeur</option>
                </select>
              </div>
            </div>

            <Link href="/cars" className="w-full md:w-auto">
              <Button size="lg" className="w-full md:w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold p-0 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 mt-20 w-full max-w-4xl border-t border-zinc-900 pt-8 pb-12">
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-extrabold text-white">10k+</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Véhicules de Prestige</p>
            </div>
            <div className="text-center border-x border-zinc-900">
              <p className="text-2xl sm:text-4xl font-extrabold text-white">500+</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Chauffeurs Certifiés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-4xl font-extrabold text-white">24/7</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider mt-1">Support Dédié</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VEHICULES POPULAIRES (Asymmetric Grid) */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Véhicules Populaires</h2>
            <p className="text-zinc-500 mt-2 text-sm">L&apos;alliance parfaite de la technologie et du confort.</p>
          </div>
          <Link href="/cars" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white font-semibold group">
            Voir toute la flotte 
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Large Left Card (1st Car) */}
          <Link href={`/cars/${featuredCars[0].id}`} className="lg:col-span-2 group">
            <div className="relative h-[480px] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-900/60 p-8 flex flex-col justify-end">
              <Image 
                src={featuredCars[0].image}
                alt={featuredCars[0].brand}
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/30 to-transparent" />
              
              <div className="relative z-10">
                <span className="text-[10px] font-extrabold tracking-widest text-blue-400 border border-blue-500/20 bg-blue-500/5 px-3 py-1 rounded-full uppercase">
                  {featuredCars[0].category}
                </span>
                <h3 className="text-3xl font-extrabold text-white mt-4">{featuredCars[0].brand} {featuredCars[0].model}</h3>
                <p className="text-zinc-400 text-sm mt-1">{featuredCars[0].specs}</p>
                
                <div className="flex items-end justify-between mt-6 pt-6 border-t border-zinc-900/80">
                  <div>
                    <span className="text-xs text-zinc-500 block">À partir de</span>
                    <span className="text-2xl font-black text-white">{featuredCars[0].price} € <span className="text-xs font-normal text-zinc-500">/ jour</span></span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Stacked Cards (2nd & 3rd Cars) */}
          <div className="flex flex-col gap-6">
            {featuredCars.slice(1).map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`} className="group flex-1">
                <div className="relative h-[228px] rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-900/60 p-6 flex flex-col justify-end">
                  <Image 
                    src={car.image}
                    alt={car.brand}
                    fill
                    className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/30 to-transparent" />
                  
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-white">{car.brand} {car.model}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{car.specs}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 3. CHAUFFEURS D'EXCELLENCE */}
      <section className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Chauffeurs d&apos;Excellence</h2>
        <p className="text-zinc-500 mt-2 max-w-lg mx-auto text-sm">
          Nos chauffeurs sont rigoureusement sélectionnés et formés pour vous offrir une discrétion absolue et un service irréprochable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {DRIVERS.map((driver, i) => (
            <div key={i} className="flex flex-col items-center p-6 bg-[#0c0c0e] rounded-3xl border border-zinc-900/40 relative">
              <div className="relative w-24 h-24 mb-6">
                <Image 
                  src={driver.image}
                  alt={driver.name}
                  fill
                  className="object-cover rounded-full border border-zinc-800"
                  sizes="96px"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 border-2 border-[#0c0c0e] flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <h4 className="text-lg font-bold text-white">{driver.name}</h4>
              <p className="text-[10px] font-extrabold tracking-wider text-blue-400 uppercase mt-1">{driver.role} • {driver.exp}</p>
              
              <p className="text-zinc-400 text-sm mt-6 leading-relaxed italic">
                &ldquo;{driver.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CATALOGUE CENTRAL */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Catalogue centralisé</h2>
            <p className="text-zinc-500 mt-2 text-sm max-w-2xl">
              Découvrez l&apos;offre complète de véhicules disponibles sur la plateforme, avec ou sans chauffeur, pour toutes les occasions.
            </p>
          </div>
          <Link href="/cars" className="text-sm font-semibold text-blue-400 hover:text-white">
            Parcourir la flotte complète
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => {
            const primaryImage = car.car_images?.[0]?.image_url || PLACEHOLDER_IMG;
            const name = `${car.brand || "Véhicule"} ${car.model || "Premium"}`;
            const price = car.price_day || 0;
            const city = car.city || "Localisation indisponible";
            const rating = car.rating_average || 4.5;
            const driverLabel = car.has_driver ? "Avec chauffeur" : "Sans chauffeur";

            return (
              <Card key={car.id} className="overflow-hidden rounded-3xl bg-zinc-950/90 border border-zinc-800/60 hover:border-blue-500/40 transition-all duration-300">
                <div className="relative h-48 bg-zinc-900">
                  <Image src={primaryImage} alt={name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-blue-400 font-bold">{driverLabel}</p>
                      <h3 className="text-lg font-bold text-white mt-2">{name}</h3>
                    </div>
                    <span className="text-sm text-zinc-400">{rating.toFixed(1)} ★</span>
                  </div>

                  <p className="text-sm text-zinc-400 mb-4">{city}</p>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-extrabold text-white">{price}€</p>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest">par jour</span>
                    </div>
                    <Link href={`/cars/${car.id}`} className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors">
                      Voir
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. NOS PLANS PRIVILEGES */}
      <section className="container mx-auto px-4 py-20 max-w-7xl text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Nos Plans Privilèges</h2>
        <p className="text-zinc-500 mt-2 max-w-lg mx-auto text-sm">
          Optimisez vos déplacements avec nos formules exclusives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto items-center">
          
          {/* Starter Plan */}
          <Card className="glass-card bg-[#09090b] border-zinc-900 p-8 rounded-3xl text-left flex flex-col h-[500px]">
            <div className="mb-6">
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase">Essentiel</span>
              <h3 className="text-2xl font-bold text-white mt-1">Starter</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-black text-white">299€</span>
                <span className="text-zinc-500 text-xs">/ mois</span>
              </div>
            </div>
            <ul className="space-y-4 my-auto">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Accès flotte standard
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Réservation 24h à l&apos;avance
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Service client de base
              </li>
            </ul>
            <Link href="/register?role=driver" className="mt-8">
              <Button variant="outline" className="w-full rounded-full border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white font-bold h-12">
                Choisir ce plan
              </Button>
            </Link>
          </Card>

          {/* Elite Plan (Highlighted) */}
          <Card className="glass-card bg-blue-600 border-none p-8 rounded-3xl text-left flex flex-col h-[540px] shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-extrabold uppercase py-1 px-4 tracking-wider rounded-bl-xl">
              Recommandé
            </div>
            <div className="mb-6">
              <span className="text-[10px] font-extrabold tracking-wider text-blue-200 uppercase">Prestige Total</span>
              <h3 className="text-3xl font-extrabold text-white mt-1">Élite</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-black text-white">999€</span>
                <span className="text-blue-200 text-xs">/ mois</span>
              </div>
            </div>
            <ul className="space-y-4 my-auto">
              <li className="flex items-center gap-3 text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Flotte exclusive (Hypercars)
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Chauffeur dédié personnel
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Réservation instantanée
              </li>
              <li className="flex items-center gap-3 text-white text-sm">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" /> Accès aux lounges VIP
              </li>
            </ul>
            <Link href="/register?role=driver" className="mt-8">
              <Button className="w-full rounded-full bg-white hover:bg-zinc-100 text-blue-600 font-bold h-12">
                S&apos;abonner maintenant
              </Button>
            </Link>
          </Card>

          {/* Pro Plan */}
          <Card className="glass-card bg-[#09090b] border-zinc-900 p-8 rounded-3xl text-left flex flex-col h-[500px]">
            <div className="mb-6">
              <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase">Affaires</span>
              <h3 className="text-2xl font-bold text-white mt-1">Pro</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-3xl font-black text-white">549€</span>
                <span className="text-zinc-500 text-xs">/ mois</span>
              </div>
            </div>
            <ul className="space-y-4 my-auto">
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Flotte Business Class
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Réservation 4h à l&apos;avance
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> Service conciergerie 24/7
              </li>
            </ul>
            <Link href="/register?role=company" className="mt-8">
              <Button variant="outline" className="w-full rounded-full border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-white font-bold h-12">
                Choisir ce plan
              </Button>
            </Link>
          </Card>

        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-[#0a0a0c] p-12 md:p-20 text-center">
          <div className="absolute inset-0 z-0 opacity-15">
            <Image 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2070&auto=format&fit=crop"
              alt="Porsche Silhouette"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-[#0a0a0c]" />
          </div>
          
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Prêt pour votre prochain voyage ?</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Rejoignez le cercle exclusif Wigo et vivez une expérience de mobilité inégalée dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-12 shadow-lg shadow-blue-600/20">
                  Démarrer l&apos;aventure
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-full border-zinc-800 bg-zinc-950 text-white font-bold px-8 h-12 hover:bg-zinc-900">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-xl py-12 md:py-16 relative z-10">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
               
               {/* Brand & Quote */}
               <div className="md:col-span-1">
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      W
                    </div>
                    <span className="text-xl font-extrabold tracking-wider text-white uppercase">Wigo</span>
                  </Link>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                     La plateforme de mobilité ultra premium pour les particuliers exigeants et les entreprises de prestige.
                  </p>
               </div>
               
               {/* Plateforme */}
               <div>
                  <h4 className="font-bold text-white text-sm mb-6">Plateforme</h4>
                  <ul className="space-y-4 text-xs text-zinc-500">
                     <li><Link href="/" className="hover:text-white transition-colors">La flotte</Link></li>
                     <li><Link href="/drivers" className="hover:text-white transition-colors">Les Chauffeurs</Link></li>
                     <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs abonnements</Link></li>
                     <li><Link href="/register" className="hover:text-white transition-colors">Affiliations</Link></li>
                  </ul>
               </div>

               {/* Société */}
               <div>
                  <h4 className="font-bold text-white text-sm mb-6">Société</h4>
                  <ul className="space-y-4 text-xs text-zinc-500">
                     <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
                     <li><Link href="/careers" className="hover:text-white transition-colors">Carrières</Link></li>
                     <li><Link href="/press" className="hover:text-white transition-colors">Presse</Link></li>
                     <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  </ul>
               </div>

               {/* Newsletter */}
               <div>
                  <h4 className="font-bold text-white text-sm mb-6">Newsletter</h4>
                  <p className="text-zinc-500 text-xs mb-4 leading-relaxed">Conservez nos offres exclusives.</p>
                  <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 max-w-sm">
                     <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800/80 rounded-xl">
                        <Mail className="w-4 h-4 text-zinc-600" />
                        <input type="email" placeholder="Votre email" className="bg-transparent border-none outline-none text-xs text-white placeholder-zinc-700 w-full" />
                     </div>
                     <Button type="submit" size="sm" className="bg-white hover:bg-zinc-200 text-black font-bold px-4 h-10 rounded-xl">
                        OK
                     </Button>
                  </form>
               </div>

            </div>

            {/* Bottom Credits */}
            <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
               <p>© {new Date().getFullYear()} Wigo Mobility. Tous droits réservés.</p>
               <div className="flex gap-6">
                  <Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
                  <Link href="/terms" className="hover:text-white transition-colors">Conditions</Link>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}
