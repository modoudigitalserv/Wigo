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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Wigo
          </span>
        </Link>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/cars" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Véhicules
          </Link>
          <Link href="/drivers" className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">
            Chauffeurs
          </Link>
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full hidden md:flex gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                <UserRound className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-300 max-w-[120px] truncate hidden sm:block">
                  {displayName}
                </span>
              </div>
              <form action={signout}>
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
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold">
                  S&apos;inscrire
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
