import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarFront, UserRound } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Wigo
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cars" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
            <CarFront className="w-4 h-4" />
            Voitures
          </Link>
          <Link href="/drivers" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            Chauffeurs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
              Connexion
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Mon Espace
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
