"use client";

import React from "react";
import { useTransition } from "react";
import { CheckCircle2, Calendar, Wrench, Loader2 } from "lucide-react";
import { updateCarStatus } from "@/app/dashboard/cars/actions";

const STATUS_MAP: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  disponible: { label: "Disponible", style: "text-green-400 bg-green-400/10 border-green-400/20", icon: CheckCircle2 },
  louee: { label: "Louée", style: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Calendar },
  maintenance: { label: "Maintenance", style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Wrench },
};

export default function CarStatusDropdown({ carId, initialStatus, isReserved }: { carId: string, initialStatus: string, isReserved: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateCarStatus(carId, newStatus);
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de la mise à jour du statut.");
      }
    });
  };

  const statusInfo = STATUS_MAP[initialStatus] || STATUS_MAP.disponible;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative group">
      <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border backdrop-blur-md cursor-pointer relative overflow-hidden transition-all hover:ring-2 hover:ring-blue-500/50 ${statusInfo.style}`}>
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StatusIcon className="w-3.5 h-3.5" />}
        <span>{statusInfo.label}</span>
        {isReserved && initialStatus === 'disponible' && (
          <span className="ml-1 px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] border border-blue-500/30">
            Réservée
          </span>
        )}
        
        {/* Invisible native select overlaid on top for native interaction */}
        <select 
          value={initialStatus}
          onChange={handleStatusChange}
          disabled={isPending}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          title="Modifier le statut"
        >
          <option value="disponible">Disponible</option>
          <option value="louee">Louée</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
  );
}
