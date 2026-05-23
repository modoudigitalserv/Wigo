import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Car Interior"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent md:w-1/2" />
      </div>

      <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-block mb-10">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              Wigo
            </span>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">Bienvenue</h1>
          <p className="text-zinc-400 mb-8">Connectez-vous pour gérer vos réservations ou vos missions.</p>

          <div className="glass-card p-8 border-zinc-800/50 space-y-6 bg-zinc-950/80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Adresse Email</Label>
                <Input id="email" type="email" placeholder="nom@exemple.com" className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-300">Mot de passe</Label>
                  <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">Oublié ?</Link>
                </div>
                <Input id="password" type="password" className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl" />
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/20">
              Se Connecter
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-2 text-zinc-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Apple
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Vous n'avez pas de compte ? <Link href="#" className="text-white hover:underline font-medium">S'inscrire</Link>
          </p>

          <p className="mt-8 text-center text-xs text-zinc-600 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Sécurisé par Supabase Auth
          </p>
        </div>
      </div>
    </div>
  );
}
