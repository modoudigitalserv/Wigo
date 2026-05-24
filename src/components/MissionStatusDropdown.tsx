"use client";

import React from "react";
import { useTransition } from "react";
import { CheckCircle2, Clock, XCircle, AlertTriangle, Play, Check, Loader2 } from "lucide-react";
import { updateDriverBookingStatus } from "@/app/dashboard/bookings/actions";

const STATUS_MAP: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  pending: { label: "En attente", style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Clock },
  confirmed: { label: "Confirmée", style: "text-green-400 bg-green-400/10 border-green-400/20", icon: CheckCircle2 },
  active: { label: "En cours", style: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Play },
  completed: { label: "Terminée", style: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Check },
  cancelled: { label: "Annulée", style: "text-red-400 bg-red-400/10 border-red-400/20", icon: XCircle },
  rejected: { label: "Refusée", style: "text-red-400 bg-red-400/10 border-red-400/20", icon: AlertTriangle },
};

export default function MissionStatusDropdown({ bookingId, initialStatus }: { bookingId: string, initialStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateDriverBookingStatus(bookingId, newStatus);
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de la mise à jour du statut de la mission.");
      }
    });
  };

  const statusInfo = STATUS_MAP[initialStatus] || STATUS_MAP.pending;
  const StatusIcon = statusInfo.icon;

  if (initialStatus === "pending") {
    return (
      <div className="flex gap-2 w-full mt-4 pt-4 border-t border-zinc-800/50">
        <button
          onClick={() => handleStatusChange("confirmed")}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-green-600 hover:bg-green-500 text-white disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Accepter
        </button>
        <button
          onClick={() => handleStatusChange("rejected")}
          disabled={isPending}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Refuser
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md cursor-pointer relative overflow-hidden transition-all hover:ring-2 hover:ring-orange-500/50 ${statusInfo.style}`}>
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StatusIcon className="w-3.5 h-3.5" />}
        <span>{statusInfo.label}</span>
        
        {/* Invisible native select overlaid on top for native interaction */}
        <select 
          value={initialStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          title="Modifier le statut de la mission"
        >
          <option value="confirmed">Confirmée</option>
          <option value="active">En cours</option>
          <option value="completed">Terminée</option>
          <option value="cancelled">Annulée</option>
          <option value="rejected">Refusée</option>
        </select>
      </div>
    </div>
  );
}
