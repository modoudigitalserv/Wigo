import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/server";
import { signout } from "@/app/login/actions";
import { UserRound, LogOut, LayoutDashboard } from "lucide-react";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Get profile for display name
  let displayName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.sub)
      .single();
    displayName = profile?.full_name || user.email || "Mon compte";
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-black/90 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-base shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            W
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white uppercase">
            Wigo
          </span>
        </Link>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-white hover:text-blue-400 transition-colors font-medium">
            Home
          </Link>
          <Link href="/drivers" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Chauffeurs
          </Link>
          <Link href="/register?role=company" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Entreprises
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Tarifs
          </Link>
        </nav>

        {/* Auth & CTA section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full hidden md:flex gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-900">
                <UserRound className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-300 max-w-[120px] truncate hidden sm:block">
                  {displayName}
                </span>
              </div>
              <form action={signout} className="hidden sm:block">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-full"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full">
                  Connexion
                </Button>
              </Link>
            </>
          )}
          <Link href="/cars">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-6 shadow-lg shadow-blue-600/30">
              Réserver
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
