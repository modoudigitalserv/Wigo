"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Search, Star, ShieldCheck, CarFront, UserRound, ArrowRight, CheckCircle2, TrendingUp, Building2, Briefcase, Zap, StarHalf, Quote } from "lucide-react";

const PLACEHOLDER_CAR = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
};

export default function LandingClient({ cars, totalCars, totalDrivers }: { cars: unknown[], totalCars: string | number, totalDrivers: string | number }) {
  const stats = [
    { label: "Véhicules", value: totalCars, icon: CarFront },
    { label: "Chauffeurs vérifiés", value: totalDrivers, icon: UserRound },
    { label: "Villes couvertes", value: "12", icon: MapPin },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop"
            alt="Luxury Car Background"
            fill
            className="object-cover object-center opacity-40"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        </div>

        <motion.div 
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="relative z-10 container mx-auto px-4 text-center mt-16"
        >
          <motion.span variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-blue-400 mb-6 border-blue-500/20">
            <ShieldCheck className="w-4 h-4" /> La Plateforme n°1 au Maroc
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
            L&apos;Excellence <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              en Mouvement
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
            La marketplace de référence pour louer des véhicules d&apos;exception, avec ou sans chauffeur privé, en quelques clics.
          </motion.p>

          {/* Floating Search Bar */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto glass rounded-3xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2 md:gap-4 backdrop-blur-2xl bg-black/40 border-white/10 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
            <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Lieu de prise en charge</p>
                <input type="text" placeholder="Casablanca, Rabat..." className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium text-sm md:text-base" />
              </div>
            </div>
            
            <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full border-b md:border-b-0 md:border-r border-zinc-800">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <div className="text-left w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Dates de location</p>
                <input type="text" placeholder="Ajouter des dates" className="bg-transparent border-none outline-none text-white w-full placeholder-zinc-600 font-medium text-sm md:text-base" />
              </div>
            </div>

            <Link href="/cars" className="w-full md:w-auto p-1">
              <Button size="lg" className="w-full h-14 md:h-16 px-8 rounded-2xl md:rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-12 mb-20 container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center text-center pt-4 md:pt-0 first:pt-0">
                <div className="w-12 h-12 mb-3 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-3xl font-extrabold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* Comment ça marche */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-blue-500 font-semibold tracking-wider uppercase text-sm"
          >
            Simple et Rapide
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mt-2"
          >
            Comment ça marche ?
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Search, title: "1. Trouvez votre idéal", desc: "Parcourez notre large sélection de véhicules premium et de chauffeurs professionnels." },
            { icon: Calendar, title: "2. Réservez facilement", desc: "Sélectionnez vos dates, confirmez vos options et finalisez votre réservation en un instant." },
            { icon: CheckCircle2, title: "3. Profitez du trajet", desc: "Récupérez votre véhicule ou attendez votre chauffeur à l'heure convenue, en toute sérénité." }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-blue-900/10 border-blue-500/20">
                <step.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="container mx-auto px-4 py-24 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold">Véhicules Populaires</h2>
            <p className="text-zinc-400 mt-3 text-lg">Découvrez les voitures les plus demandées par nos clients.</p>
          </div>
          <Link href="/cars">
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full h-12 px-6">
              Voir la flotte <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((carItem, i) => {
            const car = carItem as {
              id: string;
              brand: string;
              model: string;
              price_day: number;
              rating_average?: number;
              transmission?: string;
              fuel?: string;
              car_images?: { is_primary?: boolean; image_url?: string }[];
            };
            const primaryImg = car.car_images?.find((img) => img.is_primary)?.image_url || PLACEHOLDER_CAR;
            const name = `${car.brand} ${car.model}`;
            const price = car.price_day;
            const rating = car.rating_average || 5.0;

            return (
              <motion.div 
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/cars/${car.id}`}>
                  <Card className="glass-card overflow-hidden group cursor-pointer border-white/5 bg-zinc-900/40">
                    <div className="relative h-64 overflow-hidden rounded-t-3xl bg-zinc-950">
                      <Image
                        src={primaryImg}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                        unoptimized
                      />
                      <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md bg-black/50 border-white/10">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-bold text-white">{rating.toFixed(1)}</span>
                      </div>
                      <div className="absolute top-4 left-4">
                         <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                           Populaire
                         </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-zinc-400 capitalize px-2 py-1 bg-white/5 rounded-md">{car.transmission}</span>
                            <span className="text-xs text-zinc-400 capitalize px-2 py-1 bg-white/5 rounded-md">{car.fuel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex items-end justify-between">
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">À partir de</p>
                          <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-bold text-white">{price} €</p>
                            <span className="text-sm text-zinc-500">/ jour</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                          <ArrowRight className="w-5 h-5 text-blue-500 group-hover:text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* B2B Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass border-white/10"
        >
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2073&auto=format&fit=crop"
                alt="Business Dashboard"
                fill
                className="object-cover opacity-20 mix-blend-luminosity"
                unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          </div>
          
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white mb-4 uppercase tracking-wider">
                <Building2 className="w-4 h-4" /> B2B SaaS
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Propulsez votre agence de location</h2>
              <p className="text-zinc-300 text-lg mb-8 max-w-xl">
                Rejoignez la marketplace Wigo et gérez toute votre flotte automobile depuis un tableau de bord puissant. Augmentez votre visibilité et vos revenus.
              </p>
              <ul className="space-y-4 mb-8">
                {["Gestion centralisée de votre flotte", "Paiements sécurisés par Stripe", "Statistiques et prévisions de revenus", "Visibilité premium sur la marketplace"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register?role=company">
                <Button size="lg" className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-base">
                  Devenir Loueur Partenaire
                </Button>
              </Link>
            </div>
            <div className="flex-1 hidden md:block">
               {/* Decorative Dashboard mock */}
               <div className="glass rounded-2xl p-6 shadow-2xl border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-zinc-400 text-sm">Revenus mensuels</p>
                      <p className="text-2xl font-bold">12,450 €</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((v) => (
                      <div key={v} className="h-12 w-full bg-white/5 rounded-xl border border-white/10" />
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Drivers Section */}
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-indigo-900/20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-300 mb-4 uppercase tracking-wider">
                <UserRound className="w-4 h-4" /> Chauffeurs
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Gagnez plus avec Wigo</h2>
              <p className="text-zinc-300 text-lg mb-8 max-w-xl">
                Devenez chauffeur indépendant sur notre plateforme. Recevez des missions exclusives, gérez votre planning et développez votre clientèle premium.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="glass p-4 rounded-2xl bg-black/20">
                  <Briefcase className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="font-bold text-white">Missions VIP</h4>
                  <p className="text-sm text-zinc-400 mt-1">Clients d&apos;affaires et tourisme premium</p>
                </div>
                <div className="glass p-4 rounded-2xl bg-black/20">
                  <Zap className="w-6 h-6 text-blue-400 mb-2" />
                  <h4 className="font-bold text-white">Liberté totale</h4>
                  <p className="text-sm text-zinc-400 mt-1">Choisissez quand vous voulez travailler</p>
                </div>
              </div>
              <Link href="/register?role=driver">
                <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30">
                  Créer un compte Chauffeur
                </Button>
              </Link>
            </div>
            <div className="flex-1 w-full relative h-[400px] hidden md:block">
              <Image 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                alt="Chauffeur"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6 glass p-4 rounded-xl flex items-center gap-4 border-white/20">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex flex-col items-center justify-center border border-blue-400/30">
                   <span className="text-xs font-bold text-blue-300">NOTE</span>
                   <span className="text-sm font-extrabold text-white">4.9</span>
                </div>
                <div>
                   <p className="font-bold text-white">"La meilleure plateforme pour les VTC"</p>
                   <p className="text-xs text-zinc-300">Youssef, Chauffeur certifié</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ils nous font confiance</h2>
          <p className="text-zinc-400 text-lg">Rejoignez des milliers d&apos;utilisateurs satisfaits.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Amine K.", role: "Client régulier", text: "Service impeccable. J'ai loué une Range Rover pour le week-end, la voiture était parfaite et le processus de réservation ultra fluide.", rating: 5 },
            { name: "Global Rentals", role: "Loueur Partenaire", text: "Depuis que nous utilisons Wigo pour gérer notre flotte, notre taux d'occupation a grimpé de 40%. Le dashboard est incroyablement bien conçu.", rating: 5 },
            { name: "Sarah M.", role: "Cliente", text: "Le service chauffeur est fantastique. Mon vol a eu du retard mais le chauffeur m'attendait avec le sourire. Je recommande vivement.", rating: 5 }
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="glass-card h-full bg-black/40 border-white/5 p-8 relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-zinc-300 text-lg mb-8 relative z-10 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <p className="text-sm text-zinc-500">{review.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-12 md:py-16 mt-12 relative z-10">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
               <div className="md:col-span-1">
                  <Link href="/" className="flex items-center gap-2 mb-6">
                     <span className="text-3xl font-extrabold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Wigo</span>
                  </Link>
                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                     L&apos;excellence en mouvement. La première plateforme SaaS et Marketplace pour la location de véhicules premium et chauffeurs au Maroc.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-white mb-6">Marketplace</h4>
                  <ul className="space-y-4 text-sm text-zinc-400">
                     <li><Link href="/cars" className="hover:text-white transition-colors">Véhicules</Link></li>
                     <li><Link href="/drivers" className="hover:text-white transition-colors">Chauffeurs</Link></li>
                     <li><Link href="/cities" className="hover:text-white transition-colors">Villes desservies</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Partenaires</h4>
                  <ul className="space-y-4 text-sm text-zinc-400">
                     <li><Link href="/register?role=company" className="hover:text-white transition-colors">Devenir Loueur</Link></li>
                     <li><Link href="/register?role=driver" className="hover:text-white transition-colors">Devenir Chauffeur</Link></li>
                     <li><Link href="/pricing" className="hover:text-white transition-colors">Tarifs Abonnements SaaS</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-white mb-6">Support</h4>
                  <ul className="space-y-4 text-sm text-zinc-400">
                     <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                     <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                     <li><Link href="/terms" className="hover:text-white transition-colors">Conditions Générales</Link></li>
                     <li><Link href="/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                  </ul>
               </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
               <p>© {new Date().getFullYear()} Wigo Mobility. Tous droits réservés.</p>
               <div className="flex gap-6">
                  {/* Social icons placeholders */}
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
