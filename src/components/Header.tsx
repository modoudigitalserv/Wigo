import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/server";
import { signout } from "@/app/login/actions";
import { UserRound, LogOut, LayoutDashboard, Search } from "lucide-react";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-[#0a0a0f]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center justify-between">
        
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.8)] transition-all">
              W
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">Wigo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/cars" className="text-sm text-white font-semibold hover:text-blue-400 transition-colors">
              Flotte
            </Link>
            <Link href="/drivers" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">
              Chauffeurs
            </Link>
            <Link href="/register?role=company" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">
              Entreprise
            </Link>
            <Link href="/pricing" className="text-sm text-zinc-500 hover:text-white transition-colors font-medium">
              Tarifs
            </Link>
          </nav>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full hidden md:flex gap-2 text-xs">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-800">
                <UserRound className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-zinc-300 max-w-[100px] truncate hidden sm:block">
                  {displayName}
                </span>
              </div>
              <form action={signout} className="hidden sm:block">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded-full w-8 h-8"
                  title="Se déconnecter"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </form>
            </>
          ) : (
            <>
              <button className="hidden md:flex w-8 h-8 items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <Link href="/login" className="hidden sm:block">
                <span className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
                  Connexion
                </span>
              </Link>
              <Link href="/register">
                <span className="text-xs text-zinc-500 hover:text-white transition-colors hidden sm:block">
                  S&apos;inscrire
                </span>
              </Link>
            </>
          )}
          <Link href="/cars">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold px-5 text-xs shadow-lg shadow-blue-600/30 h-9">
              Réserver
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
