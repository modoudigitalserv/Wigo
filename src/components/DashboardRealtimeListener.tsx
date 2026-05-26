"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

interface Props {
  role: "company" | "driver" | "super_admin" | "client";
  ownerId?: string; // company.id or driver.id
}

export default function DashboardRealtimeListener({ role, ownerId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!ownerId && role !== "super_admin" && role !== "client") return;

    // Listener pour l'entreprise (réservations de voitures)
    if (role === "company" && ownerId) {
      const channel = supabase
        .channel("company_dashboard_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
            filter: `company_id=eq.${ownerId}`,
          },
          (payload) => {
            console.log("Nouvelle réservation ou mise à jour reçue :", payload);
            router.refresh();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Listener pour le chauffeur (missions)
    if (role === "driver" && ownerId) {
      const channel = supabase
        .channel("driver_dashboard_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "driver_bookings",
            filter: `driver_id=eq.${ownerId}`,
          },
          (payload) => {
            console.log("Nouvelle mission ou mise à jour reçue :", payload);
            router.refresh();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Listener pour le client (ses propres réservations)
    if (role === "client" && ownerId) {
      const channel = supabase
        .channel("client_dashboard_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookings",
            filter: `customer_id=eq.${ownerId}`,
          },
          (payload) => {
            router.refresh();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

  }, [role, ownerId, router, supabase]);

  return null;
}
