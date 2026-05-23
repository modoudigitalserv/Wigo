import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { signup } from "@/app/login/actions";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1503376712341-ea1c9b311756?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Car"
          fill
          className="object-cover opacity-30"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md py-12">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              Wigo
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white mt-4 mb-2">Créer un compte</h1>
          <p className="text-zinc-400">Rejoignez la plateforme n°1 de mobilité au Sénégal.</p>
        </div>

          {params.error && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-950/50 border border-red-800/50 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{decodeURIComponent(params.error)}</p>
            </div>
          )}

          <form action={signup}>
            <div className="glass-card p-8 border-zinc-800/50 space-y-5 bg-zinc-950/80">
              
              {/* Role selector */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Je suis un(e)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "client", label: "Client" },
                    { value: "company", label: "Entreprise" },
                    { value: "driver", label: "Chauffeur" },
                  ].map((opt) => (
                    <label key={opt.value} className="relative">
                      <input type="radio" name="role" value={opt.value} defaultChecked={opt.value === "client"} className="peer sr-only" />
                      <div className="cursor-pointer text-center py-3 rounded-xl border border-zinc-700 text-sm text-zinc-400 peer-checked:border-blue-500 peer-checked:text-blue-400 peer-checked:bg-blue-950/30 transition-all hover:border-zinc-600">
                        {opt.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-zinc-300">Nom complet</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Mamadou Diallo"
                  required
                  className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Adresse Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  required
                  className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                  className="bg-zinc-900 border-zinc-700 text-white focus-visible:ring-blue-500 h-12 rounded-xl"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/20"
              >
                Créer mon compte
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-white hover:underline font-medium">Se connecter</Link>
          </p>

          <p className="mt-4 text-center text-xs text-zinc-600 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Sécurisé par Supabase Auth
          </p>
      </div>
    </div>
  );
}

