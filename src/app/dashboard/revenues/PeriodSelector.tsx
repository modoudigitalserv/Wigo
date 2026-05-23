"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Calendar } from "lucide-react";

const PERIODS = [
  { label: "7 jours", value: "7d" },
  { label: "30 jours", value: "30d" },
  { label: "3 mois", value: "3m" },
  { label: "6 mois", value: "6m" },
  { label: "1 an", value: "1y" },
  { label: "Tout", value: "all" },
];

export default function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("period") || "30d";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.push(`/dashboard/revenues?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1">
      <Calendar className="w-4 h-4 text-zinc-500 ml-2 mr-1 shrink-0" />
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => handleChange(p.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            current === p.value
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
