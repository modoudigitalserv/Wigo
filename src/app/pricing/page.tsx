"use client";

import { useState } from "react";
import { Check, Zap, Building2, UserRound, Crown, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const COMPANY_PLANS = [
  {
    name: "Basic",
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "Pour démarrer votre activité de location.",
    features: ["Jusqu'à 10 véhicules", "Tableau de bord basique", "Support email", "Statistiques de base"],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 79,
    yearlyPrice: 790,
    description: "Pour les entreprises en croissance.",
    features: ["Jusqu'à 50 véhicules", "Mise en avant marketplace", "Dashboard avancé", "Analytics détaillés", "Support prioritaire", "Badge Pro"],
    cta: "Choisir Pro",
    popular: true,
  },
  {
    name: "Premium",
    monthlyPrice: 149,
    yearlyPrice: 1490,
    description: "Pour les leaders du marché.",
    features: ["Véhicules illimités", "Priorité marketplace", "Analytics avancés", "Badge Premium", "Support VIP 24/7", "API accès", "Multi-agences"],
    cta: "Contacter",
    popular: false,
  },
];

const DRIVER_PLANS = [
  {
    name: "Starter",
    monthlyPrice: 19,
    yearlyPrice: 190,
    description: "Idéal pour commencer.",
    features: ["10 missions max", "Visibilité standard", "Support email", "Profil basique"],
    cta: "Commencer",
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 490,
    description: "Missions illimitées et boost.",
    features: ["Missions illimitées", "Boost marketplace", "Badge vérifié", "Statistiques avancées", "Support prioritaire"],
    cta: "Choisir Pro",
    popular: true,
  },
  {
    name: "Elite",
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "Le meilleur pour les pros.",
    features: ["Priorité maximale", "Missions VIP", "Badge Premium", "Support VIP 24/7", "Analytics complets", "Accès prioritaire clients"],
    cta: "Devenir Elite",
    popular: false,
  },
];

const FAQ = [
  { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le changement prend effet immédiatement et le montant est ajusté au prorata." },
  { q: "Y a-t-il une période d'essai gratuite ?", a: "Oui, tous les plans incluent 14 jours d'essai gratuit sans engagement. Aucune carte bancaire requise." },
  { q: "Comment fonctionne la limite de missions pour les chauffeurs ?", a: "Seules les missions terminées avec succès sont comptabilisées. Les annulations et refus ne comptent pas." },
  { q: "Quels modes de paiement acceptez-vous ?", a: "Nous acceptons les cartes Visa, Mastercard, et les virements bancaires via notre partenaire Stripe." },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState<"company" | "driver">("company");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = activeTab === "company" ? COMPANY_PLANS : DRIVER_PLANS;

  return (
    <div className="flex flex-col min-h-screen bg-black text-zinc-50 font-sans pb-24 md:pb-0">
      {/* Hero */}
      <section className="pt-28 pb-12 text-center px-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm font-medium text-blue-400 mb-6 border-blue-500/20">
          <Zap className="w-4 h-4" /> Tarifs transparents
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Un plan pour chaque{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">ambition</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
          Que vous soyez une entreprise de location ou un chauffeur indépendant, trouvez le plan adapté à vos besoins.
        </p>

        {/* Tab Toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "company" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" /> Entreprises
          </button>
          <button
            onClick={() => setActiveTab("driver")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "driver" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white"
            }`}
          >
            <UserRound className="w-4 h-4" /> Chauffeurs
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-white" : "text-zinc-500"}`}>Mensuel</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? "bg-blue-600" : "bg-zinc-800"}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${isYearly ? "translate-x-7" : "translate-x-0.5"}`} />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-white" : "text-zinc-500"}`}>
            Annuel <span className="text-green-400 text-xs ml-1">-17%</span>
          </span>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto px-4 max-w-6xl pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <Card
                key={plan.name}
                className={`relative glass-card border-zinc-800/50 overflow-hidden transition-all hover:scale-[1.02] ${
                  plan.popular ? "border-blue-500/50 shadow-xl shadow-blue-600/10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center text-xs font-bold py-1.5 uppercase tracking-wider flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Le plus populaire
                  </div>
                )}
                <CardContent className={`p-8 ${plan.popular ? "pt-12" : ""}`}>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-sm text-zinc-500">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-white">{price} €</span>
                    <span className="text-zinc-500 text-sm ml-1">/ {isYearly ? "an" : "mois"}</span>
                  </div>

                  <Link href="/register">
                    <Button
                      className={`w-full h-12 rounded-full font-bold text-sm mb-6 ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700"
                      }`}
                    >
                      {plan.cta} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-zinc-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 max-w-3xl pb-20">
        <h2 className="text-3xl font-bold text-center mb-10">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="glass-card border-zinc-800/50 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-zinc-200">{item.q}</span>
                <span className={`text-zinc-500 transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
