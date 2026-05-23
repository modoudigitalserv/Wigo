"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, CarFront, UserRound, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Explorer", href: "/", icon: Search },
    { name: "Voitures", href: "/cars", icon: CarFront },
    { name: "Chauffeurs", href: "/drivers", icon: UserRound },
    { name: "Menu", href: "/dashboard", icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/80 backdrop-blur-xl border-t border-zinc-800 pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200",
                isActive ? "text-blue-500" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-blue-500/20")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
