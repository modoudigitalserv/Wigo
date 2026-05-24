import { Button } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";
import { signout } from "@/app/login/actions";

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-50 p-4">
      <div className="max-w-md w-full glass-card border-red-900/50 p-8 rounded-3xl text-center shadow-2xl shadow-red-900/20">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">Compte Suspendu</h1>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Votre compte a été bloqué par l'administrateur suite au non-respect de nos conditions d'utilisation. 
          Vous n'avez plus accès à votre tableau de bord ni aux services de la plateforme.
        </p>

        <div className="space-y-3">
          <Link href="mailto:support@wigo.com">
            <Button className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold">
              Contacter le support
            </Button>
          </Link>
          
          <form action={signout}>
            <Button type="submit" variant="ghost" className="w-full h-12 rounded-xl text-zinc-500 hover:text-white">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
