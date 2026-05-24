"use client";

import React from "react";
import { useTransition } from "react";
import { CheckCircle2, Clock, XCircle, AlertTriangle, Play, Check, Loader2 } from "lucide-react";
import { updateBookingStatus } from "@/app/dashboard/bookings/actions";

const STATUS_MAP: Record<string, { label: string; style: string; icon: React.ElementType }> = {
  pending: { label: "En attente", style: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: Clock },
  confirmed: { label: "Confirmé", style: "text-green-400 bg-green-400/10 border-green-400/20", icon: CheckCircle2 },
  active: { label: "En cours", style: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Play },
  completed: { label: "Terminé", style: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Check },
  cancelled: { label: "Annulé", style: "text-red-400 bg-red-400/10 border-red-400/20", icon: XCircle },
  rejected: { label: "Refusé", style: "text-red-400 bg-red-400/10 border-red-400/20", icon: AlertTriangle },
};

export default function BookingStatusDropdown({ bookingId, initialStatus }: { bookingId: string, initialStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, newStatus);
      } catch (error) {
        console.error(error);
        alert("Une erreur est survenue lors de la mise à jour du statut de la réservation.");
      }
    });
  };

  const statusInfo = STATUS_MAP[initialStatus] || STATUS_MAP.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative group">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md cursor-pointer relative overflow-hidden transition-all hover:ring-2 hover:ring-blue-500/50 ${statusInfo.style}`}>
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <StatusIcon className="w-3.5 h-3.5" />}
        <span>{statusInfo.label}</span>
        
        {/* Invisible native select overlaid on top for native interaction */}
        <select 
          value={initialStatus}
          onChange={handleStatusChange}
          disabled={isPending}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          title="Modifier le statut de la réservation"
        >
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="active">En cours (Actif)</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="rejected">Refusé</option>
        </select>
      </div>
    </div>
  );
}
